import { db } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { WholesaleClient } from "@/components/wholesale/WholesaleClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Wholesale & B2B Auto Parts | CARE SPARE PARTS",
  description:
    "Tiered B2B pricing, volume pallet delivery, and credit terms for automotive workshops, fleet managers, and spare parts retailers across Pakistan.",
};

export default async function WholesalePage() {
  const categories = await db.category.findMany({
    where: { parentId: null },
    include: { subcategories: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="flex flex-col min-h-screen bg-brand-black text-brand-white selection:bg-brand-amber selection:text-brand-black">
      <Header categories={categories} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full pb-20 md:pb-16">
        <WholesaleClient />
      </main>

      <Footer />
      <MobileNav />
      <WhatsAppButton />
    </div>
  );
}
