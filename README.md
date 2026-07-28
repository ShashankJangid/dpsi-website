# DPS Indirapuram - Modern School Website

A production-grade, fullstack school website built with React, TypeScript, tRPC, Drizzle ORM, and MySQL. Features selective 3D elements, CMS-backed dynamic content, secure admin dashboard, and modern UI/UX.

---

## Project Overview

This project modernizes the reference website (dpsindirapuram.com) with:

- **Reference Analysis**: Cluttered layout, dated design, no dark mode, static content, no admin panel, limited interactivity
- **Upgrades**: Modern premium UI, selective 3D showcases, dark/light mode, full CMS backend, admin dashboard, smooth animations

---

## Architecture

```
Frontend (React + Vite + Tailwind CSS + shadcn/ui)
  |-- Pages: Home, About, Academics, Admissions, Facilities, News & Events, Gallery, Contact
  |-- 3D Components: Hero scene (React Three Fiber), Facilities interactive showcase
  |-- Animations: GSAP via Framer Motion, scroll-triggered reveals
  |
Backend (Hono + tRPC + Drizzle ORM)
  |-- API Routes: /api/trpc/* (type-safe RPC)
  |-- Auth: Kimi OAuth 2.0 with role-based access (user / admin)
  |-- Database: MySQL with Drizzle ORM
  |-- CMS Tables: news, events, gallery, admissions, testimonials, achievements, announcements, stats, contact_messages
```

---

## Pages & Features

### Public Website

| Page | Key Features |
|------|-------------|
| **Home** | 3D hero with floating shapes, announcement ticker, animated stats counter, news highlights, principal message, achievers carousel, testimonials slider, CTA section |
| **About** | Vision & Mission cards, core values grid, leadership profiles, animated timeline (2003-2025) |
| **Academics** | Curriculum overview, 6 departments with icons, CBSE results charts (Bar + Pie with Recharts) |
| **Admissions** | 5-step process cards, online admission form with validation, expandable FAQs |
| **Facilities** | Interactive 3D showcase (clickable facility cards), 10 facility cards with images |
| **News & Events** | Tabbed layout (News / Events), CMS-driven cards with images |
| **Gallery** | Category filter, lightbox modal, lazy-loaded images |
| **Contact** | Contact info cards, embedded Google Map, contact form with backend storage |

### Admin Dashboard (Protected)

- Secure login via Kimi OAuth
- Role-based access (admin only)
- Dashboard overview with stats cards
- Manage Admissions (view, update status, delete)
- Manage News (view, delete)
- Manage Events (view, delete)
- Manage Gallery (view, delete)
- Manage Contact Messages (mark read, delete)

---

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui (40+ pre-installed components)
- Framer Motion (animations)
- React Three Fiber + Drei (selective 3D)
- Recharts (data visualization)
- React Router v7 (SPA routing)

### Backend
- Hono (lightweight HTTP framework)
- tRPC 11.x (end-to-end type-safe APIs)
- Drizzle ORM (type-safe MySQL queries)
- MySQL (database)
- Kimi OAuth 2.0 (authentication)
- Zod (input validation)

---

## Performance Optimizations

1. **Code Splitting**: Manual chunks for `three`, `charts`, `vendor`, and `index`
2. **Lazy Loading**: ScrollProgress component lazy-loaded, images use `loading="lazy"`
3. **3D Optimization**: `dpr={[1, 1.5]}`, limited polygon counts, `Suspense` fallbacks
4. **Animation Performance**: GPU-accelerated transforms via Framer Motion
5. **Bundle Size**: Main app chunk ~365KB (98KB gzipped), vendor ~172KB (57KB gzipped)

---

## Security Features

1. **Authentication**: Kimi OAuth 2.0 with JWT sessions, httpOnly cookies
2. **Authorization**: Role-based access control (`publicQuery`, `authedQuery`, `adminQuery`)
3. **Input Validation**: All mutations use Zod schemas
4. **Rate Limiting**: Body limit middleware (50MB max)
5. **XSS Protection**: React's built-in escaping, no dangerous innerHTML
6. **CSRF Protection**: SameSite cookie settings

---

## Setup Instructions

### Prerequisites
- Node.js 20+
- MySQL database

### 1. Install Dependencies
```bash
cd /mnt/agents/output/app
npm install
```

### 2. Environment Variables
The `.env` file is pre-configured by the init script with:
- `DATABASE_URL` - MySQL connection string
- `APP_ID`, `APP_SECRET` - OAuth credentials
- `KIMI_AUTH_URL`, `KIMI_OPEN_URL` - Auth endpoints

### 3. Database Setup
```bash
# Push schema to database
npm run db:push

# Seed with sample data
npx tsx db/seed.ts
```

### 4. Development Server
```bash
npm run dev
# Server runs at http://localhost:3000
```

### 5. Production Build
```bash
npm run build
# Output: dist/ (frontend + backend)
```

---

## Deployment Guide

### Option A: VPS / Dedicated Server

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Set environment variables** in production:
   ```bash
   export NODE_ENV=production
   export PORT=3000
   # Ensure DATABASE_URL points to production MySQL
   ```

3. **Start the production server**:
   ```bash
   npm start
   # Serves static files + API from dist/
   ```

4. **Use PM2 for process management**:
   ```bash
   npm install -g pm2
   pm2 start dist/boot.js --name "dps-website"
   pm2 save
   pm2 startup
   ```

5. **Configure Nginx as reverse proxy**:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Option B: Docker Deployment

```dockerfile
# Dockerfile already included
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY dist ./dist
COPY .env .env
EXPOSE 3000
CMD ["node", "dist/boot.js"]
```

```bash
docker build -t dps-website .
docker run -p 3000:3000 dps-website
```

### Option C: Cloud Platform (Railway, Render, Fly.io)

1. Connect your GitHub repo
2. Set `DATABASE_URL` and other env vars
3. Build command: `npm run build`
4. Start command: `npm start`
5. The `dist/boot.js` serves both frontend and backend

---

## Database Schema

| Table | Purpose |
|-------|---------|
| `users` | OAuth users with roles (user/admin) |
| `admissions` | Online admission form submissions |
| `news` | CMS news articles |
| `events` | School events calendar |
| `gallery` | Gallery images/videos |
| `contact_messages` | Contact form submissions |
| `testimonials` | Visitor/parent testimonials |
| `achievements` | Student achievers/toppers |
| `announcements` | Top bar announcements |
| `stats` | Quick stats for homepage |

---

## API Endpoints (tRPC Routers)

| Router | Public | Admin |
|--------|--------|-------|
| `auth` | me, logout | - |
| `admissions` | create, stats | list, getById, updateStatus, delete |
| `news` | list, featured, getBySlug | adminList, create, update, delete |
| `events` | list, all | create, update, delete |
| `gallery` | list, byCategory, featured | create, update, delete |
| `contact` | create | list, markRead, delete |
| `testimonials` | list, featured | create, update, delete |
| `achievements` | list, featured | create, update, delete |
| `announcements` | list | adminList, create, update, delete |
| `stats` | list | adminList, create, update, delete |

---

## SEO Best Practices

- Semantic HTML structure
- Meta tags via `index.html`
- Lazy loading for images
- Descriptive alt tags
- Mobile-first responsive design
- Fast loading with code splitting

---

## Future Enhancements

- [ ] AI Chatbot for school queries (integrate OpenAI/Claude API)
- [ ] Virtual Campus Tour (360-degree images)
- [ ] Push notification system
- [ ] Multi-language support
- [ ] Student portal with ERP integration
- [ ] Online fee payment gateway

---

## License

Copyright (c) DPS Indirapuram. All Rights Reserved.
