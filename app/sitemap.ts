import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://carsspareparts.com";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/brands`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  try {
    const [categories, subcategories, products, brands] = await Promise.all([
      db.category.findMany({
        where: { parentId: null },
        select: { slug: true, updatedAt: true },
      }),
      db.category.findMany({
        where: { parentId: { not: null } },
        include: { parent: { select: { slug: true } } },
      }),
      db.product.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
        take: 500,
      }),
      db.brand.findMany({
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
      url: `${baseUrl}/shop/${cat.slug}`,
      lastModified: cat.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const subcategoryRoutes: MetadataRoute.Sitemap = subcategories
      .filter((sub) => sub.parent)
      .map((sub) => ({
        url: `${baseUrl}/shop/${sub.parent!.slug}/${sub.slug}`,
        lastModified: sub.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
      }));

    const brandRoutes: MetadataRoute.Sitemap = brands.map((b) => ({
      url: `${baseUrl}/shop?brand=${b.slug}`,
      lastModified: b.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const productRoutes: MetadataRoute.Sitemap = products.map((prod) => ({
      url: `${baseUrl}/products/${prod.slug}`,
      lastModified: prod.updatedAt,
      changeFrequency: "daily",
      priority: 0.9,
    }));

    return [
      ...staticRoutes,
      ...categoryRoutes,
      ...subcategoryRoutes,
      ...brandRoutes,
      ...productRoutes,
    ];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return staticRoutes;
  }
}
