-- E-commerce Delivery App Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable RLS (Row Level Security)
ALTER TABLE IF EXISTS auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('customer', 'store', 'delivery_boy')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  
  -- Customer specific fields
  address TEXT,
  city TEXT,
  
  -- Store specific fields
  store_name TEXT,
  store_address TEXT,
  store_description TEXT,
  store_category TEXT,
  
  -- Delivery boy specific fields
  vehicle_type TEXT,
  license_number TEXT,
  is_available BOOLEAN DEFAULT false,
  
  PRIMARY KEY (id)
);

-- Create stores table for additional store information
CREATE TABLE IF NOT EXISTS public.stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  category TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  rating DECIMAL(3,2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  delivery_partner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  delivery_address TEXT NOT NULL,
  delivery_instructions TEXT,
  estimated_delivery_time TIMESTAMP WITH TIME ZONE,
  actual_delivery_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Create delivery_partners table for additional delivery partner information
CREATE TABLE IF NOT EXISTS public.delivery_partners (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  vehicle_type TEXT NOT NULL,
  license_number TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT false,
  current_location_lat DECIMAL(10,8),
  current_location_lng DECIMAL(11,8),
  rating DECIMAL(3,2) DEFAULT 0,
  total_deliveries INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  delivery_partner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  store_rating INTEGER CHECK (store_rating >= 1 AND store_rating <= 5),
  delivery_rating INTEGER CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
  store_comment TEXT,
  delivery_comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Stores policies
CREATE POLICY "Stores are viewable by everyone." ON stores FOR SELECT USING (true);
CREATE POLICY "Store owners can insert their own stores." ON stores FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Store owners can update their own stores." ON stores FOR UPDATE USING (auth.uid() = owner_id);

-- Products policies
CREATE POLICY "Products are viewable by everyone." ON products FOR SELECT USING (true);
CREATE POLICY "Store owners can manage their products." ON products FOR ALL USING (
  auth.uid() IN (
    SELECT owner_id FROM stores WHERE id = products.store_id
  )
);

-- Orders policies
CREATE POLICY "Customers can view their own orders." ON orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Store owners can view orders for their stores." ON orders FOR SELECT USING (
  auth.uid() IN (
    SELECT owner_id FROM stores WHERE id = orders.store_id
  )
);
CREATE POLICY "Delivery partners can view assigned orders." ON orders FOR SELECT USING (auth.uid() = delivery_partner_id);
CREATE POLICY "Customers can insert orders." ON orders FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Store owners can update orders for their stores." ON orders FOR UPDATE USING (
  auth.uid() IN (
    SELECT owner_id FROM stores WHERE id = orders.store_id
  )
);
CREATE POLICY "Delivery partners can update assigned orders." ON orders FOR UPDATE USING (auth.uid() = delivery_partner_id);

-- Order items policies
CREATE POLICY "Order items are viewable by order participants." ON order_items FOR SELECT USING (
  auth.uid() IN (
    SELECT customer_id FROM orders WHERE id = order_items.order_id
    UNION
    SELECT owner_id FROM stores s JOIN orders o ON s.id = o.store_id WHERE o.id = order_items.order_id
    UNION
    SELECT delivery_partner_id FROM orders WHERE id = order_items.order_id
  )
);

-- Delivery partners policies
CREATE POLICY "Delivery partners are viewable by everyone." ON delivery_partners FOR SELECT USING (true);
CREATE POLICY "Delivery partners can insert their own profile." ON delivery_partners FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Delivery partners can update their own profile." ON delivery_partners FOR UPDATE USING (auth.uid() = id);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone." ON reviews FOR SELECT USING (true);
CREATE POLICY "Customers can insert reviews for their orders." ON reviews FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Customers can update their own reviews." ON reviews FOR UPDATE USING (auth.uid() = customer_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);
CREATE INDEX IF NOT EXISTS stores_category_idx ON stores(category);
CREATE INDEX IF NOT EXISTS stores_city_idx ON stores(city);
CREATE INDEX IF NOT EXISTS products_store_id_idx ON products(store_id);
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS orders_customer_id_idx ON orders(customer_id);
CREATE INDEX IF NOT EXISTS orders_store_id_idx ON orders(store_id);
CREATE INDEX IF NOT EXISTS orders_delivery_partner_id_idx ON orders(delivery_partner_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items(order_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::TEXT, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_delivery_partners_updated_at BEFORE UPDATE ON delivery_partners FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insert some sample data (optional)
-- You can uncomment these if you want sample data

/*
-- Sample stores
INSERT INTO stores (id, owner_id, name, description, address, city, category, phone, email) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM profiles WHERE role = 'store' LIMIT 1), 'Fresh Mart', 'Your neighborhood grocery store', '123 Main St', 'Springfield', 'Grocery', '+1234567890', 'freshmart@example.com'),
  ('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM profiles WHERE role = 'store' LIMIT 1), 'Tech World', 'Latest electronics and gadgets', '456 Tech Ave', 'Springfield', 'Electronics', '+1234567891', 'techworld@example.com');

-- Sample products
INSERT INTO products (store_id, name, description, price, category, stock_quantity) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Fresh Apples', 'Crispy red apples', 3.99, 'Fruits', 50),
  ('550e8400-e29b-41d4-a716-446655440001', 'Whole Wheat Bread', 'Healthy whole wheat bread', 2.49, 'Bakery', 20),
  ('550e8400-e29b-41d4-a716-446655440002', 'Wireless Headphones', 'High-quality wireless headphones', 89.99, 'Electronics', 15);
*/
