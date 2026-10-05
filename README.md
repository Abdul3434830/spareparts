# CARS SPARE PARTS

> **TAGLINE**: THE RIGHT PART. THE RIGHT FIT.  
> **SUBHEADING**: Genuine, OEM and performance parts for your car.

A full-stack, enterprise-grade automotive spare parts e-commerce and fitment platform built with **Next.js 14 App Router**, **TypeScript (Strict, zero `any`)**, **Tailwind CSS**, **Prisma + Neon Serverless Postgres**, **Auth.js v5**, and **Vercel Blob** storage.

---

## Brand Identity & Aesthetic

- **Name**: CARS SPARE PARTS
- **Color Palette**:
  - `#0A0A0A` (Deep Black Background)
  - `#F59E0B` (Amber Action & Accent)
  - `#18181B` (Zinc Dark Surfaces & Cards)
  - `#F9FAFB` (Muted Clean White Typography)
- **Typography**:
  - `Montserrat` (Bold headings, product titles, wordmarks)
  - `Inter` (High-legibility technical specs and body copy)
- **Design Philosophy**: Mobile-first, glassmorphism cards, micro-animations, zero dummy data, and 100% vehicle fitment guarantees.

---

## Architectural Stack

| System Component | Technology | Rationale |
|---|---|---|
| Frontend Framework | Next.js 14 (App Router) | Server Components, dynamic streaming, SEO metadata |
| Language | TypeScript (Strict mode) | Strict type safety across database models and cart state |
| Styling | Tailwind CSS | Custom design tokens and responsive breakpoints |
| Global Client State | Zustand (with localStorage persistence) | High performance state management for Cart, Garage, and Wishlist |
| Database & ORM | Neon Postgres + Prisma ORM | Serverless Postgres with pooled connections & relational schema |
| Authentication | Auth.js v5 (NextAuth beta) | Role-based edge-safe route guards (`ADMIN`, `CUSTOMER`) |
| Media Storage | Vercel Blob | Direct client-side WebP compressed image uploads |
| Vehicle Fitment Engine | Custom Cascading Matcher | Make > Model > Year > Engine cascading filters with chassis VIN helper |

---

## Completed Development Phases

- **Phase 0: Scaffold**: Next.js 14 project, TypeScript, Tailwind, directory structure (`chore: scaffold`).
- **Phase 1: Design System**: Dark theme tokens, Button, Badge, Card, Input, Select, Modal, Spinner, Skeleton, EmptyState (`feat: design system`).
- **Phase 2: Database Schema & Seed**: Complete Prisma schema with 18 models, idempotent seed for 12 categories & admin user (`feat: database schema`).
- **Phase 3: Authentication**: NextAuth v5 credentials provider, customer registration, role-based middleware (`feat: auth`).
- **Phase 4: Admin Dashboard**: Full admin console with live DB stats, catalog CRUD with client-side WebP compression, margin calculator, CSV bulk import/export, and courier tracking assignment (`feat: admin dashboard`).
- **Phase 5: Layout Architecture**: Responsive Header with wordmark, search, My Garage active vehicle pill, cart counter, 4-column Footer, MobileNav bottom bar, and vehicle-aware WhatsApp button (`feat: layout`).
- **Phase 6: Vehicle Fitment Engine**: Cascading `VehicleSelector`, `MyGarageModal`, `FitmentBadge` (real-time green/red indicator), `CompatibilityTable`, and `VINHelper` (`feat: fitment`).
- **Phase 7: Homepage**: Hero with vehicle selector, trust bar, 12 category grid, brand showcase, deals, verified reviews, technical guides, and hard-to-find sourcing banner (`feat: homepage`).
- **Phase 8: Shop Pages**: `/shop`, `/shop/[category]`, `/shop/[category]/[subcategory]` with vehicle fitment filter, category hierarchy, brand multi-select, and classification filters (`feat: shop pages`).
- **Phase 9: Product Detail Page**: `/products/[slug]` with multi-image gallery, fitment confirmation, pricing breakdown, full technical specs, return policy, and JSON-LD schema (`feat: product page`).
- **Phase 10: Search Page**: `/search` with debounced search across part SKU, OEM interchange, name, brand, and vehicle model (`feat: search`).
- **Phase 11: Cart & Checkout**: `/cart` with free delivery progress bar, `/checkout` with Pakistani city dropdown, VIN verification checkbox, Meezan Bank, JazzCash & Easypaisa manual payment options, and `/checkout/success` (`feat: checkout`).
- **Phase 12: Customer Accounts**: `/account` dashboard, `/account/orders` order history with courier tracking, `/account/garage` saved vehicles, and `/account/wishlist` (`feat: accounts`).
- **Phase 14: Search Engine Optimization**: Dynamic `sitemap.ts`, `robots.ts`, OpenGraph metadata, and structured data (`feat: seo`).
- **Phase 15: Polish & Accessibility**: Branded `not-found.tsx`, global `error.tsx` boundary, animated `loading.tsx`, and WCAG contrast standards (`feat: polish`).
- **Phase 16: Deployment**: Vercel configuration, environment variable templates, and comprehensive `DEPLOY.md` (`feat: deployment`).

---

## Local Development Setup

```bash
# 1. Clone repository
git clone <repo-url>
cd care-spare-parts

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Fill in your DATABASE_URL, AUTH_SECRET, BLOB_READ_WRITE_TOKEN

# 4. Generate Prisma Client and Push Schema
npx prisma generate
npx prisma db push

# 5. Seed initial categories and admin user
npm run prisma:seed

# 6. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the storefront.

---

## Production Deployment

Refer to [DEPLOY.md](./DEPLOY.md) for full step-by-step instructions on deploying to **Vercel** with **Neon Postgres**.
