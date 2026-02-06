-- =====================================================
-- NELLUSORU MANUFACTURERS AND SERVICES
-- Database Schema for Supabase (PostgreSQL)
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE (Admin Users)
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for email lookup
CREATE INDEX idx_users_email ON users(email);

-- =====================================================
-- CATEGORIES TABLE
-- =====================================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for slug lookup
CREATE INDEX idx_categories_slug ON categories(slug);

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    brand VARCHAR(255),
    description TEXT,
    specifications TEXT,
    image_url VARCHAR(500),
    price DECIMAL(12, 2),
    unit VARCHAR(50),
    min_order_quantity INTEGER DEFAULT 1,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;

-- =====================================================
-- CUSTOMERS TABLE
-- =====================================================
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255),
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    alternate_phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    gst_number VARCHAR(20),
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_email ON customers(email);

-- =====================================================
-- INVOICES TABLE
-- =====================================================
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,
    subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0,
    tax_rate DECIMAL(5, 2) DEFAULT 0,
    tax_amount DECIMAL(12, 2) DEFAULT 0,
    discount_amount DECIMAL(12, 2) DEFAULT 0,
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    status VARCHAR(50) DEFAULT 'draft',
    notes TEXT,
    terms TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_date ON invoices(invoice_date);
CREATE INDEX idx_invoices_status ON invoices(status);

-- =====================================================
-- INVOICE ITEMS TABLE
-- =====================================================
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    description VARCHAR(500) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
    unit VARCHAR(50),
    unit_price DECIMAL(12, 2) NOT NULL,
    discount_percent DECIMAL(5, 2) DEFAULT 0,
    amount DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index
CREATE INDEX idx_invoice_items_invoice ON invoice_items(invoice_id);

-- =====================================================
-- OFFERS / ANNOUNCEMENTS TABLE
-- =====================================================
CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    start_date DATE,
    end_date DATE,
    discount_percent DECIMAL(5, 2),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index
CREATE INDEX idx_offers_active ON offers(is_active) WHERE is_active = TRUE;

-- =====================================================
-- CONTACT ENQUIRIES TABLE
-- =====================================================
CREATE TABLE enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    company VARCHAR(255),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'new',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_enquiries_status ON enquiries(status);
CREATE INDEX idx_enquiries_created ON enquiries(created_at);

-- =====================================================
-- BUSINESS SETTINGS TABLE
-- =====================================================
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description VARCHAR(255),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON offers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enquiries_updated_at BEFORE UPDATE ON enquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, full_name, role) VALUES
('admin@nellusoru.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4qKQzJC6wQvWQKmu', 'Admin User', 'admin');

-- Insert default categories
INSERT INTO categories (name, slug, description, display_order) VALUES
('Manufacturing Supplies', 'manufacturing-supplies', 'High-quality manufacturing supplies for industrial use', 1),
('Service Tools', 'service-tools', 'Professional service tools and equipment', 2),
('Industrial Components', 'industrial-components', 'Essential industrial components and parts', 3),
('Custom Orders', 'custom-orders', 'Customized manufacturing solutions', 4);

-- Insert business settings
INSERT INTO settings (key, value, description) VALUES
('business_name', 'Nellusoru Manufacturers and Services', 'Company name'),
('business_tagline', 'Quality Manufacturing & Reliable Services', 'Company tagline'),
('business_phone', '+91 98765 43210', 'Primary phone number'),
('business_whatsapp', '919876543210', 'WhatsApp number (without +)'),
('business_email', 'info@nellusoru.com', 'Business email'),
('business_address', 'Near Karur Road, Kadavur, Karur, Tamil Nadu - 621313', 'Business address'),
('gst_number', 'GSTIN12345678', 'GST Number'),
('established_year', '2023', 'Year of establishment'),
('invoice_prefix', 'NMS', 'Invoice number prefix'),
('invoice_terms', 'Payment due within 30 days. All goods remain property of Nellusoru Manufacturers and Services until paid in full.', 'Default invoice terms');

-- Insert sample products
INSERT INTO products (category_id, name, slug, brand, description, image_url, price, unit, min_order_quantity, is_featured) VALUES
((SELECT id FROM categories WHERE slug = 'manufacturing-supplies'), 'Industrial Steel Sheets', 'industrial-steel-sheets', 'Tata Steel', 'High-grade steel sheets for manufacturing purposes. Available in various thicknesses and sizes.', 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400', 2500.00, 'per sheet', 10, true),
((SELECT id FROM categories WHERE slug = 'manufacturing-supplies'), 'Aluminum Rods', 'aluminum-rods', 'Hindalco', 'Premium quality aluminum rods for industrial applications.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 1800.00, 'per kg', 5, true),
((SELECT id FROM categories WHERE slug = 'service-tools'), 'Industrial Welding Machine', 'industrial-welding-machine', 'Esab', 'Professional-grade welding machine for heavy-duty applications.', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400', 45000.00, 'per unit', 1, true),
((SELECT id FROM categories WHERE slug = 'service-tools'), 'Precision Cutting Tools Set', 'precision-cutting-tools', 'Bosch', 'Complete set of precision cutting tools for manufacturing.', 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400', 8500.00, 'per set', 1, false),
((SELECT id FROM categories WHERE slug = 'industrial-components'), 'Ball Bearings Pack', 'ball-bearings-pack', 'SKF', 'High-quality ball bearings for industrial machinery.', 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=400', 3200.00, 'per pack', 2, false),
((SELECT id FROM categories WHERE slug = 'industrial-components'), 'Industrial Motors', 'industrial-motors', 'Siemens', 'Energy-efficient industrial motors for manufacturing equipment.', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400', 35000.00, 'per unit', 1, true),
((SELECT id FROM categories WHERE slug = 'custom-orders'), 'Custom Metal Fabrication', 'custom-metal-fabrication', 'Nellusoru', 'Custom metal fabrication services tailored to your needs.', 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=400', NULL, 'per project', 1, false),
((SELECT id FROM categories WHERE slug = 'custom-orders'), 'Bespoke Industrial Parts', 'bespoke-industrial-parts', 'Nellusoru', 'Made-to-order industrial parts and components.', 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=400', NULL, 'per order', 1, false);

-- Insert sample offers
INSERT INTO offers (title, description, discount_percent, is_active, display_order) VALUES
('Grand Opening Offer', 'Get 10% off on bulk orders above ₹50,000. Valid for new customers.', 10, true, 1),
('Festive Season Sale', 'Special discounts on all manufacturing supplies. Contact us for exclusive deals!', 15, true, 2),
('Referral Bonus', 'Refer a business and get ₹1,000 credit on your next order.', NULL, true, 3);
