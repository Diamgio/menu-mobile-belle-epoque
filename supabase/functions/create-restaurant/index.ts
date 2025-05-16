
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Non autorizzato: token mancante' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a Supabase client with the service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // First, verify the user's JWT token to confirm they're authenticated
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Non autorizzato: token non valido', details: authError }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Now extract restaurant data from the request body
    const { name, subdomain } = await req.json();
    
    if (!name || !subdomain) {
      return new Response(
        JSON.stringify({ error: 'Dati mancanti: nome e sottodominio sono obbligatori' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create the restaurant using the service role client (bypassing RLS)
    const { data: restaurant, error: insertError } = await supabase
      .from('restaurants')
      .insert({ 
        name, 
        subdomain, 
        user_id: user.id 
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('Errore durante la creazione del ristorante:', insertError);
      
      // Check if it's a unique constraint violation (subdomain already exists)
      if (insertError.code === '23505' && insertError.message.includes('subdomain')) {
        return new Response(
          JSON.stringify({ error: 'Il sottodominio è già in uso. Scegli un altro sottodominio.' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Errore durante la creazione del ristorante', details: insertError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return the created restaurant
    return new Response(
      JSON.stringify(restaurant),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Errore interno:', error);
    
    return new Response(
      JSON.stringify({ error: 'Errore interno del server', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
