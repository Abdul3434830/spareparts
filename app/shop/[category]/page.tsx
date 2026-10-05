import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { ShopCatalog } from "@/components/shop/ShopCatalog";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const cat = await db.category.findUnique({
    where: { slug: params.category },
  });

  if (!cat) return { title: "Category Not Found | CARS SPARE PARTS" };

  return {
    title: `${cat.name} Auto Parts | CARS SPARE PARTS`,
    description:
      cat.description ||
      `Buy premium and OEM ${cat.name} replacement parts for your vehicle with verified fitment.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const [currentCategory, categories, brands, products] = await Promise.all([
    db.category.findUnique({
      where: { slug: params.category },
      include: { subcategories: true },
    }),
    db.category.findMany({
      where: { parentId: null },
      include: { subcategories: true },
      orderBy: { sortOrder: "asc" },
    }),
    db.brand.findMany({
      orderBy: { name: "asc" },
    }),
    db.product.findMany({
      where: {
        published: true,
        category: { slug: params.category },
      },
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

  if (!currentCategory) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-brand-black text-brand-white selection:bg-brand-amber selection:text-brand-black">
      <Header categories={categories} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-20 md:pb-12">
        <ShopCatalog
          products={products}
          categories={categories}
          brands={brands}
          initialCategorySlug={currentCategory.slug}
          title={`${currentCategory.name} Catalog`}
          description={
            currentCategory.description ||
            `Explore precision engineered ${currentCategory.name} parts and components.`
          }
        />
      </main>

      <Footer />
      <MobileNav />
      <WhatsAppButton />
    </div>
  );
}
