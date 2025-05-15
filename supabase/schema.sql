
-- Custom script for initializing database
-- This script will be executed when the Supabase project is created or reset

-- Create tables if they don't exist

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  order_index INT
);

-- Allergens table
CREATE TABLE IF NOT EXISTS public.allergens (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT
);

-- Dishes table
CREATE TABLE IF NOT EXISTS public.dishes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC,
  category_id INT REFERENCES public.categories(id),
  image_url TEXT
);

-- Dish-Allergens junction table
CREATE TABLE IF NOT EXISTS public.dish_allergens (
  dish_id INT REFERENCES public.dishes(id) ON DELETE CASCADE,
  allergen_id INT REFERENCES public.allergens(id) ON DELETE CASCADE,
  PRIMARY KEY (dish_id, allergen_id)
);

-- Restaurant settings table
CREATE TABLE IF NOT EXISTS public.settings (
  id SERIAL PRIMARY KEY,
  restaurant_name TEXT,
  address TEXT,
  phone TEXT,
  opening_hours JSONB,
  facebook_url TEXT,
  instagram_url TEXT,
  other_social TEXT
);

-- Insert default restaurant info if settings table is empty
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.settings) THEN
    INSERT INTO public.settings (restaurant_name, address, phone, opening_hours, facebook_url, instagram_url)
    VALUES (
      'Trattoria Bella Italia',
      'Via Roma 123, Milano, Italia',
      '+39 123 456 7890',
      '"Martedì-Domenica: 12:00-15:00, 19:00-23:00. Chiuso il lunedì."',
      'https://facebook.com/trattoriabellaitalia',
      'https://instagram.com/trattoriabellaitalia'
    );
  END IF;
END $$;

-- Add default categories if categories table is empty
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.categories) THEN
    INSERT INTO public.categories (name, order_index)
    VALUES
      ('Antipasti', 1),
      ('Primi', 2),
      ('Secondi', 3),
      ('Contorni', 4),
      ('Dessert', 5),
      ('Bevande', 6);
  END IF;
END $$;

-- Add default allergens if allergens table is empty
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.allergens) THEN
    INSERT INTO public.allergens (name)
    VALUES
      ('Glutine'),
      ('Lattosio'),
      ('Frutta a guscio'),
      ('Uova'),
      ('Pesce'),
      ('Crostacei'),
      ('Soia'),
      ('Arachidi');
  END IF;
END $$;

-- Create RLS policies
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allergens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dish_allergens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous users (read-only)
CREATE POLICY "Allow anonymous read access to dishes" 
  ON public.dishes FOR SELECT 
  USING (true);

CREATE POLICY "Allow anonymous read access to categories" 
  ON public.categories FOR SELECT 
  USING (true);

CREATE POLICY "Allow anonymous read access to allergens" 
  ON public.allergens FOR SELECT 
  USING (true);

CREATE POLICY "Allow anonymous read access to dish_allergens" 
  ON public.dish_allergens FOR SELECT 
  USING (true);

CREATE POLICY "Allow anonymous read access to settings" 
  ON public.settings FOR SELECT 
  USING (true);

-- Create policies for authenticated users (full access)
CREATE POLICY "Allow authenticated users full access to dishes"
  ON public.dishes FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users full access to categories"
  ON public.categories FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users full access to allergens"
  ON public.allergens FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users full access to dish_allergens"
  ON public.dish_allergens FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users full access to settings"
  ON public.settings FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
