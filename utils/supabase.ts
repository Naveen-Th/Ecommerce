import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import { UserProfile, UserRole } from '../store/authStore';

const supabaseUrl = "https://maprljkodsmzpwopdmrc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcHJsamtvZHNtenB3b3BkbXJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MjUxMzcsImV4cCI6MjA2NTQwMTEzN30.39D2_SFYcnVqawAL2uwXo7uml8-4iN6yVL19SvqfHS0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database helper functions
export const createUserProfile = async (
  userId: string,
  email: string,
  role: UserRole,
  profileData: Partial<UserProfile>
) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        id: userId,
        email,
        role,
        ...profileData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select();

  return { data, error };
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return { data, error };
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<UserProfile>
) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select();

  return { data, error };
};

// Store management functions
export const createStore = async (storeData: {
  name: string;
  description?: string;
  address: string;
  city: string;
  category: string;
  phone?: string;
  email?: string;
}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('stores')
    .insert([
      {
        owner_id: user.id,
        ...storeData,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select();

  return { data, error };
};

export const getStoreByOwnerId = async (ownerId: string) => {
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('owner_id', ownerId)
    .single();

  return { data, error };
};

export const updateStore = async (storeId: string, updates: any) => {
  const { data, error } = await supabase
    .from('stores')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', storeId)
    .select();

  return { data, error };
};

// Product management functions
export const getProductsByStoreId = async (storeId: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', storeId)
    .order('created_at', { ascending: false });

  return { data, error };
};

export const createProduct = async (storeId: string, productData: {
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  stock_quantity?: number;
}) => {
  const { data, error } = await supabase
    .from('products')
    .insert([
      {
        store_id: storeId,
        ...productData,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select();

  return { data, error };
};

export const updateProduct = async (productId: string, updates: any) => {
  const { data, error } = await supabase
    .from('products')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', productId)
    .select();

  return { data, error };
};

export const deleteProduct = async (productId: string) => {
  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  return { data, error };
};

export const toggleProductStatus = async (productId: string, isActive: boolean) => {
  const { data, error } = await supabase
    .from('products')
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq('id', productId)
    .select();

  return { data, error };
};

// Order management functions for stores
export const getStoreOrders = async (storeId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      profiles!customer_id (
        full_name,
        phone
      ),
      order_items (
        *,
        products (
          name,
          price
        )
      )
    `)
    .eq('store_id', storeId)
    .order('created_at', { ascending: false });

  return { data, error };
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const { data, error } = await supabase
    .from('orders')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)
    .select();

  return { data, error };
};

// SQL for creating database tables (run this in Supabase SQL editor)
export const databaseSchema = `
-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('customer', 'store', 'delivery_boy')),
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
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
  is_available BOOLEAN DEFAULT TRUE
);

-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  category TEXT,
  phone TEXT,
  email TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  rating DECIMAL(2,1) DEFAULT 0.0,
  delivery_fee DECIMAL(10,2) DEFAULT 0.00,
  minimum_order DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  delivery_boy_id UUID REFERENCES profiles(id),
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled')) DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0.00,
  delivery_address TEXT NOT NULL,
  delivery_notes TEXT,
  payment_method TEXT DEFAULT 'cash',
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create delivery_boys table for tracking availability
CREATE TABLE IF NOT EXISTS delivery_boys (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  current_location_lat DECIMAL(10,8),
  current_location_lng DECIMAL(11,8),
  is_online BOOLEAN DEFAULT FALSE,
  vehicle_type TEXT,
  license_number TEXT,
  rating DECIMAL(2,1) DEFAULT 0.0,
  total_deliveries INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_boys ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Stores policies
CREATE POLICY "Anyone can view active stores" ON stores FOR SELECT USING (is_active = true);
CREATE POLICY "Store owners can manage their stores" ON stores FOR ALL USING (auth.uid() = owner_id);

-- Products policies
CREATE POLICY "Anyone can view available products" ON products FOR SELECT USING (is_available = true);
CREATE POLICY "Store owners can manage their products" ON products FOR ALL USING (
  auth.uid() IN (SELECT owner_id FROM stores WHERE id = store_id)
);

-- Orders policies
CREATE POLICY "Customers can view their orders" ON orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Store owners can view their store orders" ON orders FOR SELECT USING (
  auth.uid() IN (SELECT owner_id FROM stores WHERE id = store_id)
);
CREATE POLICY "Delivery boys can view assigned orders" ON orders FOR SELECT USING (auth.uid() = delivery_boy_id);
CREATE POLICY "Customers can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Order items policies
CREATE POLICY "Users can view order items for their orders" ON order_items FOR SELECT USING (
  order_id IN (
    SELECT id FROM orders WHERE 
    customer_id = auth.uid() OR 
    delivery_boy_id = auth.uid() OR
    store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid())
  )
);

-- Delivery boys policies
CREATE POLICY "Delivery boys can manage their profile" ON delivery_boys FOR ALL USING (auth.uid() = id);
CREATE POLICY "Anyone can view online delivery boys" ON delivery_boys FOR SELECT USING (is_online = true);

-- Functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, role, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
`;
