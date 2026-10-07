import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { ShopCatalog } from "@/components/shop/ShopCatalog";

export const dynamic = "force-dynamic";

interface SubcategoryPageProps {
  params: {
    category: string;
    subcategory: string;
  };
}

export async function generateMetadata({ params }: SubcategoryPageProps) {
  const subcat = await db.category.findUnique({
    where: { slug: params.subcategory },
    include: { parent: true },
  });

  if (!subcat) return { title: "Subcategory Not Found | CARS SPARE PARTS" };

  const canonicalUrl = `/shop/${params.category}/${subcat.slug}`;
  const title = `${subcat.name} (${subcat.parent?.name || "Spare Parts"}) | CARS SPARE PARTS`;
  const description =
    subcat.description ||
    `Find genuine OEM and aftermarket ${subcat.name} parts for your vehicle with verified quality and nationwide courier delivery across Pakistan.`;

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

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  const [parentCategory, currentSubcategory, categories, brands, products] =
    await Promise.all([
      db.category.findUnique({
        where: { slug: params.category },
      }),
      db.category.findUnique({
        where: { slug: params.subcategory },
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
          subcategory: { slug: params.subcategory },
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

  if (!parentCategory || !currentSubcategory) {
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
            name: parentCategory.name,
            item: `https://carsspareparts.com/shop/${parentCategory.slug}`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: currentSubcategory.name,
            item: `https://carsspareparts.com/shop/${parentCategory.slug}/${currentSubcategory.slug}`,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        name: `${currentSubcategory.name} Auto Spare Parts`,
        url: `https://carsspareparts.com/shop/${parentCategory.slug}/${currentSubcategory.slug}`,
        description: currentSubcategory.description || `Buy ${currentSubcategory.name} parts online.`,
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
          initialCategorySlug={parentCategory.slug}
          initialSubcategorySlug={currentSubcategory.slug}
          title={`${currentSubcategory.name}`}
          description={`High-performance & OEM ${currentSubcategory.name} components under ${parentCategory.name}.`}
        />
      </main>

      <Footer />
      <MobileNav />
      <WhatsAppButton />
    </div>
  );
}
