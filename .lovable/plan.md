## Implementation Plan

### Phase 1: Database & CMS Foundation
1. Create database tables: `site_content`, `team_members`, `projects`, `social_links`
2. All site text stored in `site_content` (key-value pairs)
3. Projects table with GitHub auto-sync + manual override
4. Secret URL admin panel at `/admin?key=SECRET`

### Phase 2: Admin Panel
- Dashboard with tabs: Content, Projects, Team, Social Links
- CRUD operations for all tables
- Glass morphism + 3D background styling
- GitHub sync button to fetch repos from `mohidqx` org

### Phase 3: Frontend Updates
- Update social links (LinkedIn, GitHub, X, WhatsApp)
- Connect all site text to CMS `site_content` table
- Projects auto-fetched from DB (synced from GitHub)

### Phase 4: Visual Enhancements
- Scroll-triggered parallax with depth layers (framer-motion)
- 3D WebGL rotating objects (React Three Fiber)
- Layered depth parallax on images
- 3D particle background on all pages including admin

### Phase 5: Terms & Conditions Page
- New `/terms` route with cyberpunk styled legal content

### Phase 6: GitHub Auto-Sync
- Edge function to fetch repos from GitHub API
- Auto-create project cards from public repos
- Admin can override/edit auto-fetched data

This is a large implementation. I'll tackle it in order, starting with the database and admin panel.