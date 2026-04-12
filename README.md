# TeamCyberØps

> Cybersecurity & Ethical Hacking Organization — Monitor and Protect

## Overview

TeamCyberØps is a full-stack cybersecurity platform built with React, Three.js, and a CMS-driven backend. It features a hacker-aesthetic UI with 3D WebGL visuals, real-time messaging, blog system, automated GitHub project sync, and a comprehensive admin panel.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite 5 |
| **Styling** | Tailwind CSS v3, Framer Motion |
| **3D Graphics** | Three.js, @react-three/fiber, @react-three/drei |
| **Backend** | Lovable Cloud (Supabase) |
| **Data Fetching** | TanStack React Query |
| **Routing** | React Router v6 |
| **UI Components** | shadcn/ui, Radix Primitives |

## Features

- **CMS Dashboard** — Every text, stat, and piece of content is manageable via the admin panel
- **3D WebGL Background** — Rotating wireframe globe, DNA helix, octahedrons, particle field, and grid floor
- **Services & Pricing** — Cybersecurity services with features, pricing, and admin CRUD
- **Blog System** — Full blog with slug-based routing, cover images, tags, and rich content
- **GitHub Auto-Sync** — Repos from `github.com/mohidqx` auto-create project cards
- **Real-time Messages** — Contact form submissions appear instantly in admin
- **Team Management** — Add/edit team members with avatars, roles, clearance levels
- **Social Links** — Dynamic social bar managed from admin
- **Logo Flip Animation** — 3D flip on the badge in WHO WE ARE section
- **Parallax & Scroll Animations** — Layered depth effects with staggered reveals
- **Mobile Responsive** — Smooth experience across all breakpoints

## Project Structure

```
src/
├── assets/           # Static images (badge, skull-back)
├── components/       # UI sections (Hero, Arsenal, Services, Crew, Blog, etc.)
│   └── ui/           # shadcn/ui primitives
├── hooks/            # React Query hooks (use-cms.ts)
├── integrations/     # Supabase client & types (auto-generated)
├── pages/            # Route pages (Index, Admin, Blog, BlogPost, Tools, Terms)
└── lib/              # Utilities
```

## Pages

| Route | Description |
|-------|------------|
| `/` | Landing page with all sections |
| `/tools` | Filterable arsenal page with project details |
| `/blog` | Blog listing page |
| `/blog/:slug` | Individual blog post |
| `/terms` | Terms & Conditions |
| `/admin?key=***` | CMS admin panel (secret URL access) |

## Database Tables

- `site_content` — Key-value CMS content
- `projects` — GitHub repos & custom projects
- `team_members` — Team roster
- `social_links` — Social platform links
- `blog_posts` — Blog articles
- `contact_messages` — Contact form submissions (realtime)
- `services` — Cybersecurity service offerings with pricing

## Getting Started

```bash
npm install
npm run dev
```

## License

All rights reserved © TeamCyberØps
