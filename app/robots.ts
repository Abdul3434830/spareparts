import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "https://carsspareparts.com";

  const privatePaths = ["/admin/", "/account/", "/api/", "/checkout/"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: privatePaths,
      },
      // Google AI Overviews & Gemini Search
      {
        userAgent: ["Googlebot", "Google-Extended"],
        allow: "/",
        disallow: privatePaths,
      },
      // OpenAI / ChatGPT & SearchGPT
      {
        userAgent: ["GPTBot", "OAI-SearchBot"],
        allow: "/",
        disallow: privatePaths,
      },
      // Perplexity AI Search
      {
        userAgent: ["PerplexityBot"],
        allow: "/",
        disallow: privatePaths,
      },
      // Anthropic / Claude
      {
        userAgent: ["ClaudeBot", "anthropic-ai"],
        allow: "/",
        disallow: privatePaths,
      },
      // Microsoft Copilot & Bing
      {
        userAgent: ["Bingbot"],
        allow: "/",
        disallow: privatePaths,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
