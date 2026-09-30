# CARE SPARE PARTS

> **THE RIGHT PART. THE RIGHT FIT.**  
> Genuine, OEM and performance parts for your car.

A full-stack auto parts e-commerce store built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, **Prisma + Neon Postgres**, **Auth.js**, and **Vercel Blob** storage.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| State | Zustand (cart, garage, wishlist) |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Database | Neon Postgres via Prisma ORM |
| Auth | Auth.js v5 (NextAuth beta) — credentials |
| Storage | Vercel Blob |
| Hosting | Vercel |

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon pooled connection string (used at runtime) |
| `DIRECT_URL` | Neon direct connection string (used for migrations) |
| `AUTH_SECRET` | Random secret for Auth.js — generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Full public URL of the site, e.g. `http://localhost:3000` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob read/write token |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number in international format (no `+`), e.g. `923001234567` |
| `ADMIN_EMAIL` | Email for the first admin account (seed only) |
| `ADMIN_PASSWORD` | Password for the first admin account (seed only) |

---

## Local Development

### Prerequisites
- Node.js 20+
- npm 10+
- A Neon Postgres database (free tier works)
- A Vercel Blob store (create in Vercel dashboard)

### Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd care-spare-parts

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# → Edit .env with your actual values

# 4. Run database migrations
npx prisma migrate dev --name init

# 5. Seed the database (categories + admin user)
npx prisma db seed

# 6. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Admin Panel
After seeding, log in at `/auth/login` with your `ADMIN_EMAIL` / `ADMIN_PASSWORD`.  
Navigate to `/admin` to manage products, orders, vehicles, and more.

---

## Database Commands

```bash
# Create a new migration
npx prisma migrate dev --name <migration-name>

# Apply migrations (production)
npx prisma migrate deploy

# Open Prisma Studio (visual DB browser)
npx prisma studio

# Re-generate Prisma client (after schema changes)
npx prisma generate

# Seed the database
npx prisma db seed
```

---

## Project Structure

```
care-spare-parts/
├── app/                    # Next.js App Router pages & API routes
│   ├── (auth)/             # Auth pages (login, register)
│   ├── (shop)/             # Public shop pages
│   ├── admin/              # Admin dashboard (ADMIN role required)
│   ├── api/                # API route handlers
│   └── layout.tsx          # Root layout
├── components/             # Reusable React components
│   └── ui/                 # Base UI components (Button, Badge, etc.)
├── lib/                    # Shared utilities
│   ├── auth.ts             # Auth.js configuration
│   ├── db.ts               # Prisma client singleton
│   └── fonts.ts            # Next.js font definitions
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Migration history
│   └── seed.ts             # Seed script (categories + admin)
├── public/                 # Static assets
├── store/                  # Zustand stores
├── types/                  # Shared TypeScript types
├── .env.example            # Environment variable template
├── vercel.json             # Vercel deployment config
└── README.md
```

---

## Deployment (Vercel)

See [DEPLOY.md](./DEPLOY.md) for the full step-by-step beginner guide covering:
- Creating Neon DB from Vercel Storage tab
- Creating a Blob store
- Connecting your GitHub repo
- Setting environment variables
- First deploy + running migrations and seed
- Adding a custom domain

---

## Categories

The store is seeded with 12 top-level categories:
1. Engine Parts
2. Brakes
3. Suspension & Steering
4. Transmission & Clutch
5. Cooling & Heating
6. Exhaust
7. Electrical & Batteries
8. Lighting
9. Body Parts
10. Performance Parts
11. Oils & Fluids
12. Accessories

All categories and subcategories are fully editable from the admin panel.

---

## License

Private — all rights reserved.
