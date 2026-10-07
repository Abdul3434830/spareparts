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

  const canonicalUrl = `/shop/${cat.slug}`;
  const title = `${cat.name} Auto Spare Parts | CARS SPARE PARTS`;
  const description =
    cat.description ||
    `Browse genuine OEM and aftermarket ${cat.name} spare parts in Pakistan. High quality, nationwide express delivery, guaranteed quality.`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://carsspareparts.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Shop",
            item: "https://carsspareparts.com/shop",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: currentCategory.name,
            item: `https://carsspareparts.com/shop/${currentCategory.slug}`,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        name: `${currentCategory.name} Auto Spare Parts`,
        url: `https://carsspareparts.com/shop/${currentCategory.slug}`,
        description: currentCategory.description || `Buy ${currentCategory.name} parts online.`,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: products.length,
          itemListElement: products.slice(0, 10).map((p, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            url: `https://carsspareparts.com/products/${p.slug}`,
            name: p.name,
          })),
        },
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-black text-brand-white selection:bg-brand-amber selection:text-brand-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
