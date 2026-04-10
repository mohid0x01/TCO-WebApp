
-- Blog posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT,
  author TEXT NOT NULL DEFAULT 'TeamCyberOps',
  tags TEXT[] NOT NULL DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published blogs" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "Anon manage blog_posts" ON public.blog_posts FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Auth manage blog_posts" ON public.blog_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Contact messages table
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon manage contact_messages" ON public.contact_messages FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Auth manage contact_messages" ON public.contact_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public insert contact_messages" ON public.contact_messages FOR INSERT TO public WITH CHECK (true);

-- Enable realtime for contact_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_messages;
