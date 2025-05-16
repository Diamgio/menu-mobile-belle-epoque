
import { Session, User } from "@supabase/supabase-js";

export interface Restaurant {
  id: number;
  name: string;
  subdomain: string;
  logo_url?: string;
}

export interface Subscription {
  active: boolean;
  status?: string;
  current_period_end?: string;
}

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signUp: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
  createRestaurant: (name: string, subdomain: string) => Promise<Restaurant | null>;
  restaurants: Restaurant[];
  currentRestaurant: Restaurant | null;
  setCurrentRestaurant: (restaurant: Restaurant | null) => void;
  loadRestaurants: () => Promise<Restaurant[] | void>;
  subscription: Subscription | null;
  checkSubscription: (restaurantId: number) => Promise<void>;
  createSubscription: (restaurantId: number) => Promise<string | null>;
  manageSubscription: (restaurantId: number) => Promise<string | null>;
};
