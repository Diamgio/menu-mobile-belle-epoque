
// Types that match Supabase schema
export interface DbDish {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  category_id: number | null;
  image_url: string | null;
}

export interface DbCategory {
  id: number;
  name: string;
  order_index: number | null;
}

export interface DbAllergen {
  id: number;
  name: string;
  icon: string | null;
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
}
