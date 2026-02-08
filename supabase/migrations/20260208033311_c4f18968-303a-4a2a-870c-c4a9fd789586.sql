
-- Create addon_services table
CREATE TABLE public.addon_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  icon TEXT DEFAULT 'wrench',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.addon_services ENABLE ROW LEVEL SECURITY;

-- Anyone can view active add-ons
CREATE POLICY "Anyone can view active addons"
ON public.addon_services
FOR SELECT
USING (is_active = true);

-- Admins can manage add-ons
CREATE POLICY "Admins can manage addons"
ON public.addon_services
FOR ALL
USING (is_admin());

-- Trigger for updated_at
CREATE TRIGGER update_addon_services_updated_at
BEFORE UPDATE ON public.addon_services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial add-on data
INSERT INTO public.addon_services (name, description, price, icon, display_order) VALUES
  ('Sofa Cleaning', 'Professional sofa and upholstery cleaning', 499, 'sofa', 1),
  ('Mattress Cleaning', 'Deep mattress cleaning and sanitization', 399, 'bed-double', 2),
  ('Dry Cleaning Support', 'Dry cleaning pickup and delivery', 599, 'shirt', 3),
  ('Electrician Support', 'Minor electrical fixes and support', 349, 'zap', 4),
  ('Plumbing (Minor)', 'Minor plumbing repairs', 299, 'wrench', 5);
