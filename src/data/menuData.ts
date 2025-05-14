
import { MenuItem, RestaurantInfo } from "../types/menu";

export const categories = [
  "Antipasti",
  "Primi",
  "Secondi",
  "Contorni",
  "Dessert",
  "Bevande"
];

export const allergens = [
  "Glutine",
  "Lattosio",
  "Frutta a guscio",
  "Uova",
  "Pesce",
  "Crostacei",
  "Soia",
  "Arachidi"
];

export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Bruschetta al Pomodoro",
    description: "Pane tostato con pomodorini, aglio, basilico e olio d'oliva",
    price: 7.50,
    category: "Antipasti",
    image: "/placeholder.svg",
    allergens: ["Glutine"]
  },
  {
    id: "2",
    name: "Carpaccio di Manzo",
    description: "Sottili fette di manzo con rucola, parmigiano e olio al tartufo",
    price: 12.00,
    category: "Antipasti",
    image: "/placeholder.svg",
    allergens: ["Lattosio"]
  },
  {
    id: "3",
    name: "Spaghetti alla Carbonara",
    description: "Pasta con uova, guanciale, pepe nero e pecorino romano",
    price: 14.50,
    category: "Primi",
    image: "/placeholder.svg",
    allergens: ["Glutine", "Uova", "Lattosio"]
  },
  {
    id: "4",
    name: "Risotto ai Funghi Porcini",
    description: "Riso carnaroli con funghi porcini, burro e parmigiano",
    price: 15.00,
    category: "Primi",
    image: "/placeholder.svg",
    allergens: ["Lattosio"]
  },
  {
    id: "5",
    name: "Bistecca alla Fiorentina",
    description: "Bistecca di manzo T-bone alla griglia con erbe aromatiche",
    price: 28.00,
    category: "Secondi",
    image: "/placeholder.svg",
    allergens: []
  },
  {
    id: "6",
    name: "Branzino al Forno",
    description: "Filetto di branzino al forno con patate, olive e pomodorini",
    price: 22.00,
    category: "Secondi",
    image: "/placeholder.svg",
    allergens: ["Pesce"]
  },
  {
    id: "7",
    name: "Insalata Mista",
    description: "Insalata verde, pomodori, carote e olive",
    price: 6.00,
    category: "Contorni",
    image: "/placeholder.svg",
    allergens: []
  },
  {
    id: "8",
    name: "Patate Arrosto",
    description: "Patate al forno con rosmarino e aglio",
    price: 5.50,
    category: "Contorni",
    image: "/placeholder.svg",
    allergens: []
  },
  {
    id: "9",
    name: "Tiramisù",
    description: "Savoiardi, caffè, mascarpone e cacao",
    price: 7.00,
    category: "Dessert",
    image: "/placeholder.svg",
    allergens: ["Glutine", "Lattosio", "Uova"]
  },
  {
    id: "10",
    name: "Panna Cotta",
    description: "Dolce alla panna con salsa di frutti di bosco",
    price: 6.50,
    category: "Dessert",
    image: "/placeholder.svg",
    allergens: ["Lattosio"]
  },
  {
    id: "11",
    name: "Vino Rosso della Casa",
    description: "Bottiglia di vino rosso locale",
    price: 18.00,
    category: "Bevande",
    image: "/placeholder.svg",
    allergens: []
  },
  {
    id: "12",
    name: "Acqua Minerale",
    description: "Acqua naturale o frizzante 1L",
    price: 3.00,
    category: "Bevande",
    image: "/placeholder.svg",
    allergens: []
  }
];

export const restaurantInfo: RestaurantInfo = {
  name: "Trattoria Bella Italia",
  openingHours: "Martedì-Domenica: 12:00-15:00, 19:00-23:00. Chiuso il lunedì.",
  phone: "+39 123 456 7890",
  address: "Via Roma 123, Milano, Italia",
  socialLinks: {
    facebook: "https://facebook.com/trattoriabellaitalia",
    instagram: "https://instagram.com/trattoriabellaitalia"
  }
};
