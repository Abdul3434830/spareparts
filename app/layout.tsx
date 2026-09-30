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
    default: "CARE SPARE PARTS | The Right Part. The Right Fit.",
    template: "%s | CARE SPARE PARTS",
  },
  description:
    "Genuine, OEM and performance parts for your car. 100% vehicle fitment guarantee, express nationwide courier delivery, and wholesale supply across Pakistan.",
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
    "CARE SPARE PARTS",
  ],
  authors: [{ name: "CARE SPARE PARTS" }],
  creator: "CARE SPARE PARTS",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://carespareparts.com"),
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "/",
    siteName: "CARE SPARE PARTS",
    title: "CARE SPARE PARTS | The Right Part. The Right Fit.",
    description:
      "Genuine, OEM and performance parts for your car. 100% vehicle fitment guarantee and nationwide delivery.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CARE SPARE PARTS | The Right Part. The Right Fit.",
    description:
      "Genuine, OEM and performance parts for your car. 100% vehicle fitment guarantee and nationwide delivery.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable} dark`}>
      <body className="min-h-screen bg-brand-black text-brand-white font-body antialiased selection:bg-brand-amber/30 selection:text-brand-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
