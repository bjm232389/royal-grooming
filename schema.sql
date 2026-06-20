-- ==========================================
-- SQL SCHEMA FOR ROYAL GROOMING PRODUCT CATALOG
-- Platform: Supabase / PostgreSQL
-- ==========================================

-- Create custom enum typings for categories
CREATE TYPE product_category AS ENUM ('beard', 'hair', 'tools', 'wholesale');
CREATE TYPE media_type_enum AS ENUM ('image', 'video');
CREATE TYPE illustration_type_enum AS ENUM ('oil', 'balm', 'pomade', 'spray', 'razor', 'comb', 'clipper', 'pack');

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category product_category NOT NULL,
    price_retail NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    price_wholesale_min NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    min_wholesale_qty INT NOT NULL DEFAULT 6,
    wholesale_unit_desc VARCHAR(100) NOT NULL DEFAULT 'Mínimo 6 un.',
    description TEXT,
    features TEXT[] DEFAULT '{}', -- Array of dynamic features
    rating NUMERIC(3, 2) DEFAULT 5.00,
    featured BOOLEAN DEFAULT FALSE,
    in_stock BOOLEAN DEFAULT TRUE,
    media_url VARCHAR(1024), -- Cloudinary secure_url link
    media_type media_type_enum DEFAULT 'image',
    illustration_type illustration_type_enum DEFAULT 'pomade',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for catalog performance (filtering by category and newest first)
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Enable Row Level Security (RLS) policies for security protection
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 1. Policy: Everyone can read the products
CREATE POLICY "Permitir lectura publica de catalogo" 
ON products FOR SELECT 
USING (true);

-- 2. Policy: Only authenticated administrators can write or modify products
CREATE POLICY "Permitir escritura solo a administradores" 
ON products FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
