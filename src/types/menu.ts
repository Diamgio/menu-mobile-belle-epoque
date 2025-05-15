
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  images?: string[]; // New field for multiple images
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
  logo?: string;
}
