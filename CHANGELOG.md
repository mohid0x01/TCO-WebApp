# Changelog

All notable changes to TeamCyberØps are documented here.

## [1.5.0] — 2026-05-02

### Added
- Feature-row services comparison table on `/services` with tier columns and a sticky pricing CTA
- Dedicated service detail layout with overview, pricing, deliverables, FAQs, and back-to-comparison link
- Stronger neon depth layers and scroll parallax on service cards

### Changed
- Hero logo flip is smoother, mobile-safe, and aligned with the glitch cyber theme
- Admin unlock flow now validates keys before opening the CMS and persists a time-limited session

### Fixed
- Admin panel no longer opens into a broken authenticated state when the key is missing or invalid

## [1.4.0] — 2026-05-01

### Added
- `/services` pricing page with comparison table inspired by the provided pricing layout
- `/services/:slug` individual service detail pages
- Extra parallax/WebGL-style depth effects on service cards
- Hero logo flip effect using the badge front and skull back
- Protected admin backend function for Zero Leak CMS operations

### Changed
- Admin panel data management now runs through a secret-key backend layer instead of direct browser table writes
- Services admin form now manages slug, timeline, best-for, deliverables, comparison level, and CTA label

### Fixed
- Admin panel access and CRUD flow after restrictive RLS hardening

## [1.3.0] — 2026-04-11

### Added
- **Services & Pricing Section** — Six cybersecurity services with pricing, features, and "Get Quote" CTA
- **Services Admin Tab** — Full CRUD for services in admin panel
- **CHANGELOG.md** — This file

### Changed
- Hero banner text updated to **TeamCyberØps** (with Ø character)
- Admin panel navbar displays **TeamCyberØps** branding
- README.md fully rewritten with tech stack, features, and project structure

## [1.2.0] — 2026-04-10

### Added
- Blog system with `/blog` and `/blog/:slug` pages
- Blog admin tab with CRUD, publish/draft toggle
- Tools page at `/tools` with category filtering and detail modals
- Logo flip animation in WHO WE ARE section (badge ↔ skull)
- Realtime message notifications in admin panel
- Enhanced 3D WebGL background (globe, DNA helix, octahedrons, grid floor)

### Changed
- Social links updated with real URLs (LinkedIn, X, WhatsApp, GitHub)
- Navbar gains mobile hamburger menu and page links

## [1.1.0] — 2026-04-09

### Added
- Lovable Cloud integration with CMS-driven site content
- Admin panel at `/admin?key=***` with secret URL access
- Database tables: site_content, projects, team_members, social_links, contact_messages
- GitHub auto-sync for project cards
- 3D WebGL particle background using Three.js
- Terms & Conditions page at `/terms`
- Scroll parallax and staggered animations

## [1.0.0] — 2026-04-08

### Added
- Initial TeamCyberOps website with Hero, Mission, Arsenal, Stats, Crew, Contact, Footer sections
- Dark hacker theme with neon-blue primary color
