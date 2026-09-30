import { Suspense } from "react";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { SearchPageClient } from "@/components/search/SearchPageClient";
import { Spinner } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Search Spare Parts | CARE SPARE PARTS",
  description:
    "Search genuine, OEM and aftermarket auto spare parts by SKU, part number, car make, or model. 100% fitment guarantee.",
};

export default async function SearchPage() {
  const categories = await db.category.findMany({
    where: { parentId: null },
    include: { subcategories: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="flex flex-col min-h-screen bg-brand-black text-brand-white selection:bg-brand-amber selection:text-brand-black">
      <Header categories={categories} />

      <main className="flex-1 w-full pb-20 md:pb-16">
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-20">
              <Spinner size="lg" color="amber" />
            </div>
          }
        >
          <SearchPageClient />
        </Suspense>
      </main>

      <Footer />
      <MobileNav />
      <WhatsAppButton />
    </div>
  );
}
