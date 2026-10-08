# Viral Bargarh — Full News Platform

A bilingual digital newsroom for **Viral Bargarh**, built around the existing brand identity and a cinematic Bargarh/Dhanuyatra opening experience.

## Stack

- Next.js 15 + App Router
- TypeScript
- Tailwind CSS v4 (plus a custom CSS design system)
- PostgreSQL
- Prisma ORM
- Custom admin CMS
- JWT-style httpOnly admin session using `jose`
- Password hashing with `bcryptjs`
- Zod request validation for authentication
- Responsive desktop/mobile UI

## Included

### Public website

- `/` → redirects to `/en`
- `/en` → English homepage
- `/or` → Odia homepage
- Full-screen Viral Bargarh video intro
- Autoplay + muted video for browser compatibility
- Sound toggle
- Skip intro
- Session-based intro dismissal
- Breaking-news ticker
- Featured news
- Latest news
- Trending stories
- Bargarh Now live-update area
- Video section
- Photo-story visual section
- Bilingual category navigation
- Article pages
- Category pages
- Search page
- SEO metadata
- `sitemap.xml`
- `robots.txt`

### Admin CMS

- `/admin/login`
- Dashboard
- Article CRUD
- Draft / Published / Scheduled / Archived statuses
- Breaking flag
- Featured flag
- Trending flag
- English + Odia title, excerpt and article body
- Categories
- Authors
- Media URL library
- Videos
- Live updates
- Admin/editor roles in the database

## Project structure

```text
viral-bargarh/
├── app/
│   ├── [locale]/
│   │   ├── category/[slug]/
│   │   ├── news/[slug]/
│   │   ├── search/
│   │   ├── videos/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── admin/
│   │   ├── articles/
│   │   ├── authors/
│   │   ├── breaking/
│   │   ├── categories/
│   │   ├── media/
│   │   ├── videos/
│   │   ├── login/
│   │   └── page.tsx
│   ├── api/
│   │   ├── articles/
│   │   ├── auth/
│   │   ├── authors/
│   │   ├── breaking/
│   │   ├── categories/
│   │   ├── live-updates/
│   │   ├── media/
│   │   ├── search/
│   │   └── videos/
│   ├── components/
│   │   └── admin/
│   ├── globals.css
│   ├── layout.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── lib/
│   ├── auth.ts
│   ├── news.ts
│   ├── prisma.ts
│   ├── seed-data.ts
│   └── slug.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   ├── brand/logo.jpg
│   └── video/
├── docker-compose.yml
├── middleware.ts
└── package.json
```

## Requirements

- Node.js 20+ (Node 22 recommended)
- npm
- Docker Desktop, or another PostgreSQL 14+ server

## 1. Install dependencies

```bash
npm install
```

The supplied package lock is intentionally not included because dependency installation should be performed on the target machine/CI environment.

## 2. Configure environment

Copy:

```text
.env.example
```

to:

```text
.env
```

Then set:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/viral_bargarh?schema=public"
AUTH_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

For production, generate a long random `AUTH_SECRET`. Do not use the development fallback.

## 3. Start PostgreSQL with Docker

If you use Docker:

```bash
docker compose up -d
```

This creates:

- Database: `viral_bargarh`
- User: `postgres`
- Password: `postgres`
- Port: `5432`

## 4. Create the database schema

For local development:

```bash
npm run db:push
```

Or use Prisma migrations:

```bash
npm run db:migrate
```

## 5. Generate Prisma client

```bash
npm run db:generate
```

## 6. Seed the newsroom

```bash
npm run db:seed
```

The seed creates demo categories, demo articles, a newsroom author, live updates and the first administrator.

### Initial admin login

```text
Email:    admin@viralbargarh.com
Password: ChangeMe123!
```

**Change this password before production.**

## 7. Start the website

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Admin:

```text
http://localhost:3000/admin/login
```

## 8. Type checking

```bash
npm run typecheck
```

Production build:

```bash
npm run build
npm start
```

## Publishing an article

1. Sign in to `/admin/login`.
2. Open **Articles**.
3. Click **New article**.
4. Enter English title.
5. Enter Odia title.
6. Select category.
7. Add English and Odia excerpts.
8. Add English and Odia article content.
9. Add a featured image URL.
10. Choose `PUBLISHED` to publish immediately, `DRAFT` to save, or `SCHEDULED` for a scheduled item.
11. Enable **Breaking**, **Featured**, or **Trending** when required.
12. Save.

## Bilingual URLs

English:

```text
/en
/en/category/bargarh
/en/news/article-slug
```

Odia:

```text
/or
/or/category/bargarh
/or/news/article-slug
```

The same article record contains both language versions.

## Video intro

The opening video is stored at:

```text
public/video/viral-bargarh-intro.mp4
```

Poster:

```text
public/video/intro-poster.jpg
```

The intro:

- starts muted because browsers commonly block audible autoplay;
- has a sound toggle;
- has a Skip Intro control;
- is dismissed for the current browser session after entry;
- fades into the homepage.

To replace the intro, keep the same filename or update `Intro.tsx`.

## Media

The current CMS supports a reliable **URL-based media library**, which works with Cloudinary, S3, a CDN, or any public image URL.

For production, a recommended setup is:

1. Create a Cloudinary account.
2. Create an unsigned upload preset.
3. Add the Cloudinary values to `.env`.
4. Replace the URL-only media form with direct browser uploads if desired.

The architecture intentionally keeps media URLs separate from article content so the storage provider can be changed later without changing the database model.

## Production deployment

### Vercel

1. Push this project to GitHub.
2. Import the repository into Vercel.
3. Create a managed PostgreSQL database (Neon, Supabase, Railway, or another PostgreSQL provider).
4. Set `DATABASE_URL` in Vercel.
5. Set a strong `AUTH_SECRET`.
6. Set `NEXT_PUBLIC_SITE_URL` to the final domain.
7. Deploy.
8. Run Prisma migrations against the production database.
9. Run the seed only if you need the initial demo data.

Recommended production commands:

```bash
npm run db:generate
npm run db:migrate
npm run build
```

## Security checklist before launch

- Change the seeded admin password.
- Use a long random `AUTH_SECRET`.
- Never commit `.env`.
- Use HTTPS in production.
- Restrict admin access to trusted editors.
- Add rate limiting to login and public search endpoints.
- Add image upload validation and size limits before enabling direct uploads.
- Add a rich-text editor with sanitization before allowing untrusted HTML input.
- Add database backups.
- Add an error monitoring service.
- Add analytics only after the site's privacy policy is ready.

## Recommended next production enhancements

The project is structured so these can be added without replacing the core architecture:

- Cloudinary direct upload UI
- Rich text editor (TipTap/Lexical)
- Scheduled publishing worker/cron
- Article revision history
- Role permissions for admin/editor
- Author management improvements
- Real YouTube API synchronization
- Google News Publisher integration
- Web Push notifications
- WhatsApp sharing
- Advertisement management
- Analytics dashboard
- Comments/moderation
- RSS feed
- Web Stories / short-form story pages
- Automated social publishing

## Brand

The project uses the supplied Viral Bargarh logo and a red/black/white editorial system. The opening experience uses the supplied Bargarh/Dhanuyatra teaser video as the cinematic introduction.

The visual direction takes inspiration from the supplied Bargarh Dhanuyatra website as an information-rich local experience, but the UI and brand system are original to Viral Bargarh.
