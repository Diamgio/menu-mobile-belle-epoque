
// Types that match Supabase schema
export interface DbDish {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  category_id: number | null;
  image_url: string | null;
  restaurant_id?: number | null;
}

export interface DbCategory {
  id: number;
  name: string;
  order_index: number | null;
  restaurant_id?: number | null;
}

export interface DbAllergen {
  id: number;
  name: string;
  icon: string | null;
  restaurant_id?: number | null;
}

export interface DbSettings {
  id: number;
  restaurant_name: string | null;
  address: string | null;
  phone: string | null;
  opening_hours: any | null;
  facebook_url: string | null;
  instagram_url: string | null;
  other_social: string | null;
  logo_url: string | null;
  restaurant_id?: number | null;
}

// New type for the restaurants table
export interface DbRestaurant {
  id: number;
  name: string;
  subdomain: string;
  user_id: string | null;
  logo_url: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

// New type for the subscriptions table
export interface DbSubscription {
  id: number;
  restaurant_id: number | null;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  status: string;
  current_period_end: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}
