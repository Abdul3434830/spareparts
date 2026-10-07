import { db } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { ShopCatalog } from "@/components/shop/ShopCatalog";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Auto Spare Parts Catalog | CARS SPARE PARTS Pakistan",
  description:
    "Explore our complete inventory of genuine OEM and high performance replacement auto parts. Guaranteed vehicle fitment and express nationwide delivery.",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Auto Spare Parts Catalog | CARS SPARE PARTS Pakistan",
    description:
      "Explore genuine OEM and certified aftermarket replacement auto parts. Express courier delivery across Pakistan.",
    url: "/shop",
  },
};

interface ShopPageProps {
  searchParams?: {
    category?: string;
    subcategory?: string;
    brand?: string;
    type?: string;
    sale?: string;
    bestseller?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const [categories, brands, products] = await Promise.all([
    db.category.findMany({
      where: { parentId: null },
      include: {
        subcategories: true,
      },
      orderBy: { sortOrder: "asc" },
    }),
    db.brand.findMany({
      orderBy: { name: "asc" },
    }),
    db.product.findMany({
      where: { published: true },
      include: {
        images: true,
        brand: true,
        category: true,
        subcategory: true,
        fitments: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-brand-black text-brand-white selection:bg-brand-amber selection:text-brand-black">
      <Header categories={categories} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-20 md:pb-12">
        <ShopCatalog
          products={products}
          categories={categories}
          brands={brands}
          initialCategorySlug={searchParams?.category}
          initialSubcategorySlug={searchParams?.subcategory}
          initialBrandSlug={searchParams?.brand}
          title={
            searchParams?.brand
              ? `Spare Parts by ${
                  brands.find((b) => b.slug === searchParams.brand)?.name ||
                  searchParams.brand.toUpperCase()
                }`
              : "All Spare Parts"
          }
          description="Browse the comprehensive CARS SPARE PARTS inventory. Filter by vehicle make, model, brand, or component category."
        />
      </main>

      <Footer />
      <MobileNav />
      <WhatsAppButton />
    </div>
  );
}
