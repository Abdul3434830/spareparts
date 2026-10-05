import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "https://carsspareparts.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/account/", "/api/", "/checkout/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
