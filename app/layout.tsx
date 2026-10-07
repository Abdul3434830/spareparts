import type { Metadata, Viewport } from "next";
import { montserrat, inter } from "@/lib/fonts";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "CARS SPARE PARTS | The Right Part. The Right Fit.",
    template: "%s | CARS SPARE PARTS",
  },
  description:
    "Genuine, OEM and performance parts for your car. 100% vehicle fitment guarantee, express nationwide courier delivery, and verified payments across Pakistan.",
  icons: {
    icon: [
      { url: "/care-icon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/care-icon.svg",
    apple: "/care-icon.svg",
  },
  keywords: [
    "auto spare parts",
    "car parts Pakistan",
    "OEM car parts",
    "genuine auto parts",
    "brake pads",
    "oil filters",
    "Toyota spare parts",
    "Honda spare parts",
    "vehicle fitment",
    "CARS SPARE PARTS",
  ],
  authors: [{ name: "CARS SPARE PARTS" }],
  creator: "CARS SPARE PARTS",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://carsspareparts.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "/",
    siteName: "CARS SPARE PARTS",
    title: "CARS SPARE PARTS | Genuine OEM & Aftermarket Auto Parts Pakistan",
    description:
      "Buy 100% genuine OEM & certified aftermarket car spare parts in Pakistan. Express nationwide courier delivery, warranty protection, and verified payments.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CARS SPARE PARTS | Genuine OEM & Aftermarket Auto Parts Pakistan",
    description:
      "Buy 100% genuine OEM & certified aftermarket car spare parts in Pakistan. Express nationwide courier delivery, warranty protection, and verified payments.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["AutoPartsStore", "Organization"],
      "@id": "https://carsspareparts.com/#organization",
      name: "CARS SPARE PARTS",
      alternateName: ["Care Spare Parts", "CarsSpareParts Pakistan"],
      url: "https://carsspareparts.com",
      logo: {
        "@type": "ImageObject",
        url: "https://carsspareparts.com/care-logo-light.svg",
        caption: "CARS SPARE PARTS Logo",
      },
      image: "https://carsspareparts.com/care-logo-light.svg",
      description:
        "Premier automotive spare parts store in Pakistan offering genuine OEM and certified aftermarket car replacement parts.",
      telephone: "+92-318-8303434",
      email: "info@carsspareparts.com",
      priceRange: "PKR",
      currenciesAccepted: "PKR",
      paymentAccepted: "Cash, IBFT Bank Transfer, Easypaisa, JazzCash",
      address: {
        "@type": "PostalAddress",
        addressCountry: "PK",
      },
      areaServed: {
        "@type": "Country",
        name: "Pakistan",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Automotive Spare Parts Catalog",
        itemListElement: [
          { "@type": "OfferCatalog", name: "Braking Systems" },
          { "@type": "OfferCatalog", name: "Engine Components" },
          { "@type": "OfferCatalog", name: "Suspension & Steering" },
          { "@type": "OfferCatalog", name: "Filters & Routine Service" },
          { "@type": "OfferCatalog", name: "Cooling & Heating" },
          { "@type": "OfferCatalog", name: "Electrical & Sensors" },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://carsspareparts.com/#website",
      url: "https://carsspareparts.com",
      name: "CARS SPARE PARTS",
      description: "Buy Genuine OEM & Certified Aftermarket Auto Parts Online in Pakistan",
      publisher: {
        "@id": "https://carsspareparts.com/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://carsspareparts.com/shop?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable} dark`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
      </head>
      <body className="min-h-screen bg-brand-black text-brand-white font-body antialiased selection:bg-brand-amber/30 selection:text-brand-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
