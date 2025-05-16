
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// This webhook doesn't require auth, so we'll disable JWT verification in config.toml
serve(async (req) => {
  try {
    // Initialize Stripe
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("Stripe secret key not found");
    }
    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" });

    // Create Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    // Get the signature from the headers
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      throw new Error("Stripe signature missing from headers");
    }

    // Get the webhook secret
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      throw new Error("Stripe webhook secret not found");
    }

    // Get the body as text
    const body = await req.text();

    // Verify the event
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      
      // Get the customer ID
      const customerId = session.customer;
      
      // Get the subscription ID
      const subscriptionId = session.subscription;
      
      if (!customerId || !subscriptionId) {
        throw new Error("Missing customer or subscription ID");
      }
      
      // Get customer metadata to find the restaurant ID
      const customer = await stripe.customers.retrieve(customerId);
      const restaurantId = customer.metadata?.restaurantId;
      
      if (!restaurantId) {
        throw new Error("Missing restaurant ID in customer metadata");
      }
      
      // Get the subscription details
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      
      // Update or insert the subscription record
      const { error } = await supabase
        .from("subscriptions")
        .upsert({
          restaurant_id: parseInt(restaurantId),
          stripe_subscription_id: subscriptionId,
          stripe_customer_id: customerId,
          status: subscription.status,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "restaurant_id",
        });
      
      if (error) {
        throw new Error(`Failed to update subscription: ${error.message}`);
      }
    } else if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object;
      const subscriptionId = subscription.id;
      
      // Find the restaurant associated with this subscription
      const { data: subscriptionData, error: findError } = await supabase
        .from("subscriptions")
        .select("restaurant_id")
        .eq("stripe_subscription_id", subscriptionId)
        .single();
      
      if (findError || !subscriptionData) {
        throw new Error(`Subscription not found: ${subscriptionId}`);
      }
      
      // Update the subscription status
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({
          status: subscription.status,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_subscription_id", subscriptionId);
      
      if (updateError) {
        throw new Error(`Failed to update subscription: ${updateError.message}`);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
