-- Add service-detail fields for /services and /services/:slug
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS timeline text NOT NULL DEFAULT 'Custom timeline',
  ADD COLUMN IF NOT EXISTS best_for text NOT NULL DEFAULT 'Teams needing verified security coverage',
  ADD COLUMN IF NOT EXISTS deliverables text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS comparison_level text NOT NULL DEFAULT 'Standard',
  ADD COLUMN IF NOT EXISTS cta_label text NOT NULL DEFAULT 'Get Quote';

-- Backfill slugs from titles for existing services
UPDATE public.services
SET slug = lower(regexp_replace(regexp_replace(trim(title), '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g'))
WHERE slug IS NULL OR slug = '';

ALTER TABLE public.services
  ALTER COLUMN slug SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS services_slug_key ON public.services (slug);
CREATE INDEX IF NOT EXISTS idx_services_active_order ON public.services (is_active, order_index);
CREATE INDEX IF NOT EXISTS idx_projects_visible_order ON public.projects (is_visible, order_index);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts (is_published, published_at DESC);

-- Remove direct browser-side admin access. Admin work will go through a protected backend function.
DROP POLICY IF EXISTS "Anon manage site_content" ON public.site_content;
DROP POLICY IF EXISTS "Anon manage team_members" ON public.team_members;
DROP POLICY IF EXISTS "Anon manage projects" ON public.projects;
DROP POLICY IF EXISTS "Anon manage social_links" ON public.social_links;
DROP POLICY IF EXISTS "Anon manage blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Anon manage contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Anon manage services" ON public.services;

DROP POLICY IF EXISTS "Auth manage site_content" ON public.site_content;
DROP POLICY IF EXISTS "Auth manage team_members" ON public.team_members;
DROP POLICY IF EXISTS "Auth manage projects" ON public.projects;
DROP POLICY IF EXISTS "Auth manage social_links" ON public.social_links;
DROP POLICY IF EXISTS "Auth manage blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Auth manage contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Auth manage services" ON public.services;

-- Replace broad public reads with least-privilege public reads.
DROP POLICY IF EXISTS "Public read projects" ON public.projects;
CREATE POLICY "Public read visible projects"
ON public.projects
FOR SELECT
USING (is_visible = true);

DROP POLICY IF EXISTS "Public read team_members" ON public.team_members;
CREATE POLICY "Public read active team_members"
ON public.team_members
FOR SELECT
USING (is_active = true);

DROP POLICY IF EXISTS "Public read social_links" ON public.social_links;
CREATE POLICY "Public read active social_links"
ON public.social_links
FOR SELECT
USING (is_active = true);

DROP POLICY IF EXISTS "Public read published blogs" ON public.blog_posts;
CREATE POLICY "Public read published blogs"
ON public.blog_posts
FOR SELECT
USING (is_published = true);

DROP POLICY IF EXISTS "Public read active services" ON public.services;
CREATE POLICY "Public read active services"
ON public.services
FOR SELECT
USING (is_active = true);

-- Contact messages stay public-submittable only.
DROP POLICY IF EXISTS "Public insert contact_messages" ON public.contact_messages;
CREATE POLICY "Public submit contact_messages"
ON public.contact_messages
FOR INSERT
WITH CHECK (true);

-- Keep general public CMS content readable for website rendering.
DROP POLICY IF EXISTS "Public read site_content" ON public.site_content;
CREATE POLICY "Public read site_content"
ON public.site_content
FOR SELECT
USING (true);