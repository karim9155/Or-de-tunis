-- =============================================
-- L'Or de Tunis - Database Migration
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLES
-- =============================================

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en TEXT NOT NULL,
  name_fr TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Plates table
CREATE TABLE plates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name_en TEXT NOT NULL,
  name_fr TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description_en TEXT NOT NULL DEFAULT '',
  description_fr TEXT NOT NULL DEFAULT '',
  description_ar TEXT NOT NULL DEFAULT '',
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  image_url TEXT,
  available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL DEFAULT '',
  customer_email TEXT NOT NULL DEFAULT '',
  event_date DATE NOT NULL,
  event_type TEXT NOT NULL,
  guest_count INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'preparing', 'ready', 'delivered', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  plate_id UUID NOT NULL REFERENCES plates(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_at_order DECIMAL(10, 2) NOT NULL
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_plates_category ON plates(category_id);
CREATE INDEX idx_plates_available ON plates(available);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE plates ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Categories: public read
CREATE POLICY "Categories are publicly readable"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

-- Plates: public read
CREATE POLICY "Plates are publicly readable"
  ON plates FOR SELECT
  TO anon, authenticated
  USING (true);

-- Orders: authenticated users can insert their own
CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Orders: users can read their own orders
CREATE POLICY "Users can read their own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Order items: authenticated users can insert for their own orders
CREATE POLICY "Users can create items for their own orders"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Order items: users can read items from their own orders
CREATE POLICY "Users can read their own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- =============================================
-- STORAGE BUCKET
-- =============================================

-- Create a public bucket for plate images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('plate-images', 'plate-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to plate images
CREATE POLICY "Plate images are publicly readable"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'plate-images');

-- Allow authenticated users to upload (admin will use service_role which bypasses RLS)
CREATE POLICY "Authenticated users can upload plate images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'plate-images');

-- =============================================
-- SEED DATA: Categories
-- =============================================

INSERT INTO categories (name_en, name_fr, name_ar, sort_order) VALUES
  ('Appetizers', 'Entrées', 'مقبلات', 1),
  ('Main Courses', 'Plats Principaux', 'أطباق رئيسية', 2),
  ('Side Dishes', 'Accompagnements', 'أطباق جانبية', 3),
  ('Desserts', 'Desserts', 'حلويات', 4),
  ('Beverages', 'Boissons', 'مشروبات', 5);
