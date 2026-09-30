import type { Metadata } from "next";
import { montserrat, inter } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CARE SPARE PARTS | The Right Part. The Right Fit.",
    template: "%s | CARE SPARE PARTS",
  },
  description: "Genuine, OEM and performance parts for your car.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable} dark`}>
      <body className="min-h-screen bg-brand-black text-brand-white font-body antialiased selection:bg-brand-amber/30 selection:text-brand-white">
        {children}
      </body>
    </html>
  );
}
