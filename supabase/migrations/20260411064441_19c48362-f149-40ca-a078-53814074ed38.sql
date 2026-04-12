
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  long_description TEXT,
  price TEXT NOT NULL DEFAULT 'Contact Us',
  price_label TEXT DEFAULT NULL,
  icon TEXT NOT NULL DEFAULT 'shield',
  features TEXT[] NOT NULL DEFAULT '{}'::text[],
  category TEXT NOT NULL DEFAULT 'Security',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Anon manage services" ON public.services FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Auth manage services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
