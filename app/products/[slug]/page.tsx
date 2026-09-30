import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { ProductCard } from "@/components/product/ProductCard";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await db.product.findUnique({
    where: { slug: params.slug },
    include: { brand: true, category: true, images: true },
  });

  if (!product) {
    return { title: "Product Not Found | CARE SPARE PARTS" };
  }

  const primaryImage = product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url;

  return {
    title: `${product.name} (${product.partNumber}) | CARE SPARE PARTS`,
    description: `Buy ${product.name} (SKU: ${product.partNumber}) by ${
      product.brand?.name || "Genuine Quality"
    }. Guaranteed vehicle fitment, express courier delivery across Pakistan.`,
    openGraph: {
      title: `${product.name} | CARE SPARE PARTS`,
      description: `SKU: ${product.partNumber}. Genuine, OEM and high performance replacement parts.`,
      images: primaryImage ? [{ url: primaryImage }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const [product, categories] = await Promise.all([
    db.product.findUnique({
      where: { slug: params.slug },
      include: {
        brand: true,
        category: true,
        subcategory: true,
        images: { orderBy: { sortOrder: "asc" } },
        fitments: true,
        reviews: {
          include: { user: true },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    db.category.findMany({
      where: { parentId: null },
      include: { subcategories: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  if (!product) {
    notFound();
  }

  // Related products from same category
  const relatedProducts = await db.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      published: true,
    },
    include: {
      brand: true,
      category: true,
      images: true,
      fitments: true,
    },
    take: 4,
  });

  // JSON-LD structured data for Google Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.images.map((img) => img.url),
    description: `Auto spare part SKU ${product.partNumber} by ${product.brand?.name || "CARE Quality"}`,
    sku: product.partNumber,
    mpn: product.partNumber,
    brand: {
      "@type": "Brand",
      name: product.brand?.name || "CARE SPARE PARTS",
    },
    offers: {
      "@type": "Offer",
      url: `https://carespareparts.com/products/${product.slug}`,
      priceCurrency: "PKR",
      price: product.salePrice ?? product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-black text-brand-white selection:bg-brand-amber selection:text-brand-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header categories={categories} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-20 md:pb-16 space-y-16">
        <ProductDetailView product={product} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="space-y-6 pt-10 border-t border-brand-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-brand-amber uppercase tracking-wider">
                  Recommendations
                </div>
                <h2 className="text-2xl font-heading font-bold text-brand-white">
                  Related Automotive Parts
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <MobileNav />
      <WhatsAppButton />
    </div>
  );
}
