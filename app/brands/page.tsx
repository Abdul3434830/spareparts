import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { Tag, ArrowRight, ShieldCheck, Globe } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Auto Component Manufacturers & Brands | CARS SPARE PARTS Pakistan",
  description:
    "Explore genuine OEM and aftermarket brands including Bosch, Denso, Brembo, NGK, Aisin, KYB, and more. 100% authentic spare parts with guaranteed quality.",
  alternates: {
    canonical: "/brands",
  },
  openGraph: {
    title: "Auto Component Manufacturers & Brands | CARS SPARE PARTS Pakistan",
    description:
      "Explore genuine OEM and certified aftermarket automotive brands. Nationwide courier delivery across Pakistan.",
    url: "/brands",
  },
};

export default async function BrandsPage() {
  const [categories, brands] = await Promise.all([
    db.category.findMany({
      where: { parentId: null },
      include: { subcategories: true },
      orderBy: { sortOrder: "asc" },
    }),
    db.brand.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { products: { where: { published: true } } },
        },
      },
    }),
  ]);

  const brandsSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Automotive Parts Brands & Manufacturers",
    url: "https://carsspareparts.com/brands",
    description: "Explore genuine OEM and tier-1 aftermarket auto parts manufacturers.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: brands.map((b, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "Brand",
          name: b.name,
          url: `https://carsspareparts.com/shop?brand=${b.slug}`,
        },
      })),
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-black text-brand-white selection:bg-brand-amber selection:text-brand-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(brandsSchema) }}
      />
      <Header categories={categories} />

      <main className="flex-1 w-full pb-20 md:pb-16">
        {/* Hero Section */}
        <section className="border-b border-brand-zinc-800 bg-gradient-to-b from-brand-zinc/80 to-brand-black py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-amber/10 border border-brand-amber/30 text-xs font-semibold text-brand-amber">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Genuine & OEM Certified Suppliers</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-brand-white tracking-tight">
              Trusted Component <span className="text-brand-amber">Brands</span>
            </h1>
            <p className="text-xs sm:text-sm text-brand-zinc-400 max-w-2xl mx-auto leading-relaxed">
              We partner directly with leading tier-1 automotive manufacturers and factory suppliers worldwide to deliver authentic components engineered for exact fitment and longevity.
            </p>
          </div>
        </section>

        {/* Brands Catalog Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-zinc-800 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-brand-white">
                All Manufacturers ({brands.length})
              </h2>
              <p className="text-xs text-brand-zinc-400 mt-0.5">
                Select a manufacturer to browse their full catalog of verified parts
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-amber hover:underline"
            >
              <span>View All Catalog Parts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {brands.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-brand-zinc border border-brand-zinc-800 space-y-3">
              <Tag className="w-8 h-8 text-brand-zinc-500 mx-auto" />
              <div className="font-heading font-bold text-sm text-brand-white">
                No Brands Available Yet
              </div>
              <p className="text-xs text-brand-zinc-400 max-w-sm mx-auto">
                Brands are currently being configured in the catalog.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/shop?brand=${brand.slug}`}
                  className="group p-5 rounded-2xl bg-brand-zinc border border-brand-zinc-800 hover:border-brand-amber/60 hover:bg-brand-zinc-800/80 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-14 h-14 rounded-xl bg-brand-black border border-brand-zinc-700/80 p-2 flex items-center justify-center shrink-0 group-hover:border-brand-amber/50 transition-colors">
                        {brand.logo ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={brand.logo}
                              alt={brand.name}
                              fill
                              className="object-contain filter grayscale group-hover:grayscale-0 transition-all"
                            />
                          </div>
                        ) : (
                          <span className="font-heading font-extrabold text-sm text-brand-amber">
                            {brand.name.slice(0, 3).toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        {brand.country && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-brand-zinc-400 uppercase tracking-wider">
                            <Globe className="w-3 h-3 text-brand-zinc-500" />
                            {brand.country}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-heading font-bold text-base text-brand-white group-hover:text-brand-amber transition-colors">
                        {brand.name}
                      </h3>
                      {brand.description && (
                        <p className="text-xs text-brand-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                          {brand.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-brand-zinc-800/80 flex items-center justify-between text-xs">
                    <span className="font-medium text-brand-zinc-400">
                      {brand._count.products}{" "}
                      {brand._count.products === 1 ? "Product" : "Products"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-brand-amber font-semibold group-hover:translate-x-1 transition-transform">
                      <span>Browse</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
      <MobileNav />
      <WhatsAppButton />
    </div>
  );
}
