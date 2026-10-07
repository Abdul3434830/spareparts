import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Wrench,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Car,
  Layers,
  PhoneCall,
  Award,
  Zap,
} from "lucide-react";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui";
import { HomeFAQ } from "@/components/home/HomeFAQ";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";

  // Data fetching from database
  const [
    categories,
    featuredProducts,
    bestsellers,
    deals,
    makes,
    reviews,
    blogPosts,
  ] = await Promise.all([
    db.category.findMany({
      where: { parentId: null },
      include: {
        subcategories: true,
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: "asc" },
    }),
    db.product.findMany({
      where: { published: true, featured: true },
      include: {
        images: true,
        brand: true,
        category: true,
        fitments: true,
      },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    db.product.findMany({
      where: { published: true, bestseller: true },
      include: {
        images: true,
        brand: true,
        category: true,
        fitments: true,
      },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    db.product.findMany({
      where: { published: true, salePrice: { not: null } },
      include: {
        images: true,
        brand: true,
        category: true,
        fitments: true,
      },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    db.make.findMany({
      take: 12,
      orderBy: { name: "asc" },
    }),
    db.review.findMany({
      where: { isVerified: true },
      take: 3,
      include: { user: true, product: true },
    }),
    db.blogPost.findMany({
      where: { published: true },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-brand-black text-brand-white selection:bg-brand-amber selection:text-brand-black">
      <Header categories={categories} />

      <main className="flex-1 space-y-20 pb-20 md:pb-16">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-brand-zinc-800 bg-gradient-to-b from-brand-zinc-900/60 via-brand-black to-brand-black">
          {/* Subtle amber gradient halo background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-brand-amber/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-zinc-800 border border-brand-zinc-700 text-xs font-semibold text-brand-amber shadow-inner">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pakistan&apos;s Leading Automotive Parts Specialists</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight text-brand-white">
                CARS <span className="text-brand-amber">SPARE PARTS</span>
              </h1>

              <p className="text-lg sm:text-2xl font-heading font-semibold text-brand-zinc-300 tracking-wider uppercase">
                THE RIGHT PART. THE RIGHT FIT.
              </p>

              <p className="text-brand-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
                Genuine OEM and high-performance replacement parts engineered for exact vehicle fitment, reliability, and precision stopping power.
              </p>
            </div>

            {/* Quick Hero Feature Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-brand-zinc-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Genuine Quality Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Express Courier Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Direct Sourcing Available on WhatsApp</span>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST BAR */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-brand-zinc border border-brand-zinc-800 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-brand-zinc-800 border border-brand-zinc-700 flex items-center justify-center text-brand-amber shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-brand-white">
                  100% Genuine Auto Parts
                </h4>
                <p className="text-xs text-brand-zinc-400 mt-1">
                  Authentic OEM & certified aftermarket components with 7-day exchange.
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-brand-zinc border border-brand-zinc-800 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-brand-zinc-800 border border-brand-zinc-700 flex items-center justify-center text-brand-amber shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-brand-white">
                  Nationwide Express
                </h4>
                <p className="text-xs text-brand-zinc-400 mt-1">
                  Fast delivery across Pakistan with real-time tracking.
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-brand-zinc border border-brand-zinc-800 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-brand-zinc-800 border border-brand-zinc-700 flex items-center justify-center text-brand-amber shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-brand-white">
                  Genuine & OEM Quality
                </h4>
                <p className="text-xs text-brand-zinc-400 mt-1">
                  Direct from certified global manufacturers and tier-1 suppliers.
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-brand-zinc border border-brand-zinc-800 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-brand-zinc-800 border border-brand-zinc-700 flex items-center justify-center text-brand-amber shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-brand-white">
                  Payment Flexibility
                </h4>
                <p className="text-xs text-brand-zinc-400 mt-1">
                  Meezan Bank, Easypaisa & JazzCash verified payments.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SHOP BY CATEGORY */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-brand-amber uppercase tracking-wider">
                Explore Categories
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-brand-white">
                Shop By System & Category
              </h2>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-amber hover:text-brand-amber-400 transition-colors"
            >
              <span>View All Categories</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop/${cat.slug}`}
                className="group p-5 rounded-2xl bg-brand-zinc border border-brand-zinc-800 hover:border-brand-amber/50 hover:bg-brand-zinc-800 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-brand-black border border-brand-zinc-700 group-hover:border-brand-amber/40 flex items-center justify-center text-brand-amber mb-3 transition-colors">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-brand-white group-hover:text-brand-amber transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-brand-zinc-400 line-clamp-2 mt-1">
                    {cat.description || "High-precision components & assemblies"}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-brand-zinc-800/80 flex items-center justify-between text-[11px] text-brand-zinc-500">
                  <span>{cat.subcategories.length} Subcategories</span>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-zinc-400 group-hover:text-brand-amber group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FEATURED PARTS */}
        {featuredProducts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-brand-amber uppercase tracking-wider">
                  Handpicked
                </div>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-brand-white">
                  Featured Automotive Parts
                </h2>
              </div>
              <Link
                href="/shop?featured=true"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-amber hover:text-brand-amber-400 transition-colors"
              >
                <span>Browse All Featured</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* BEST SELLERS */}
        {bestsellers.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-brand-amber uppercase tracking-wider">
                  Most Popular
                </div>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-brand-white">
                  Best Selling Components
                </h2>
              </div>
              <Link
                href="/shop?bestseller=true"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-amber hover:text-brand-amber-400 transition-colors"
              >
                <span>View All Best Sellers</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestsellers.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* ON SALE / DEALS */}
        {deals.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                  Special Offers
                </div>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-brand-white">
                  Discounted Deals & Clearance
                </h2>
              </div>
              <Link
                href="/shop?sale=true"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-amber hover:text-brand-amber-400 transition-colors"
              >
                <span>View All Deals</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {deals.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* SHOP BY VEHICLE MAKE */}
        {makes.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-brand-amber uppercase tracking-wider">
                  Vehicle Compatibility
                </div>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-brand-white">
                  Shop By Car Manufacturer
                </h2>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-amber hover:text-brand-amber-400 transition-colors"
              >
                <span>All Vehicles</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {makes.map((m) => (
                <Link
                  key={m.id}
                  href={`/shop?make=${encodeURIComponent(m.name)}`}
                  className="p-4 rounded-xl bg-brand-zinc border border-brand-zinc-800 hover:border-brand-amber/50 hover:bg-brand-zinc-800 transition-all text-center group"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-black border border-brand-zinc-700 mx-auto flex items-center justify-center text-brand-amber group-hover:border-brand-amber transition-colors mb-2">
                    <Car className="w-4 h-4" />
                  </div>
                  <div className="font-heading font-bold text-xs sm:text-sm text-brand-white group-hover:text-brand-amber transition-colors">
                    {m.name}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}


        {/* VERIFIED REVIEWS (Only rendered if reviews exist in db) */}
        {reviews.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="text-center max-w-xl mx-auto">
              <div className="text-xs font-semibold text-brand-amber uppercase tracking-wider">
                Real Customer Feedback
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-brand-white mt-1">
                Verified Buyer Reviews
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="p-6 rounded-2xl bg-brand-zinc border border-brand-zinc-800 space-y-3"
                >
                  <div className="flex items-center gap-1 text-brand-amber text-sm">
                    {"★".repeat(r.rating)}
                    {"☆".repeat(5 - r.rating)}
                  </div>
                  {r.title && (
                    <h4 className="font-heading font-bold text-sm text-brand-white">
                      {r.title}
                    </h4>
                  )}
                  <p className="text-xs text-brand-zinc-300 leading-relaxed italic">
                    &ldquo;{r.comment}&rdquo;
                  </p>
                  <div className="pt-2 border-t border-brand-zinc-800 flex items-center justify-between text-[11px] text-brand-zinc-500">
                    <span className="font-medium text-brand-zinc-300">
                      {r.user?.name || "Verified Customer"}
                    </span>
                    <span className="text-emerald-400">Verified Purchase</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* BLOG & GUIDES (Only rendered if blog posts exist in db) */}
        {blogPosts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-brand-amber uppercase tracking-wider">
                  Expert Insights
                </div>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-brand-white">
                  Technical Guides & Maintenance
                </h2>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-amber hover:text-brand-amber-400 transition-colors"
              >
                <span>Read All Articles</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group rounded-2xl bg-brand-zinc border border-brand-zinc-800 hover:border-brand-zinc-700 overflow-hidden flex flex-col transition-all"
                >
                  {post.coverImage && (
                    <div className="relative aspect-video w-full bg-brand-zinc-900">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-heading font-bold text-base text-brand-white group-hover:text-brand-amber transition-colors">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-xs text-brand-zinc-400 line-clamp-2 mt-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="text-[11px] text-brand-zinc-500 flex items-center justify-between">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span className="text-brand-amber font-semibold group-hover:translate-x-1 transition-transform">
                        Read Guide →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* AUTHORITATIVE FAQ SECTION (AEO/GEO & RICH SNIPPETS) */}
        <HomeFAQ />

        {/* HARD-TO-FIND SOURCING BANNER */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-zinc to-brand-zinc-900 border border-brand-zinc-700 p-8 sm:p-12 shadow-2xl">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-amber/10 border border-brand-amber/30 text-xs font-semibold text-brand-amber">
                <Wrench className="w-3.5 h-3.5" />
                <span>Custom Sourcing & Rare Imports</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-brand-white tracking-tight">
                Can&apos;t find your part number?
              </h2>
              <p className="text-sm sm:text-base text-brand-zinc-300 leading-relaxed">
                CARS SPARE PARTS sources rare, discontinued, and European/Japanese imports directly from overseas distribution hubs. Send us your chassis or part number for an instant quote.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    "Hello CARS SPARE PARTS! I am looking for a hard-to-find part. Can you help me source it?"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="primary"
                    size="lg"
                    leftIcon={<PhoneCall className="w-4 h-4 text-brand-black" />}
                    className="font-heading uppercase tracking-wider text-xs font-bold"
                  >
                    Request on WhatsApp
                  </Button>
                </a>
                <Link href="/shop">
                  <Button variant="outline" size="lg" className="text-xs">
                    Browse All Parts Catalog
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileNav />
      <WhatsAppButton />
    </div>
  );
}
