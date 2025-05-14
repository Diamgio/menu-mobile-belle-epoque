
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string; // Changed from 'image: string' to 'image?: string' to make it optional
  allergens: string[];
}

export interface RestaurantInfo {
  name: string;
  openingHours: string;
  phone: string;
  address: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
  };
}
