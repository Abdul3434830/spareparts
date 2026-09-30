import { db } from "@/lib/db";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileNav } from "./MobileNav";
import { WhatsAppButton } from "./WhatsAppButton";

interface CategoryNavItem {
  id: string;
  name: string;
  slug: string;
  subcategories: { id: string; name: string; slug: string }[];
}

export async function StoreShell({ children }: { children: React.ReactNode }) {
  let categories: CategoryNavItem[] = [];
  try {
    categories = await db.category.findMany({
      where: { parentId: null },
      orderBy: { sortOrder: "asc" },
      include: {
        subcategories: {
          orderBy: { sortOrder: "asc" },
          select: { id: true, name: true, slug: true },
        },
      },
    });
  } catch (err) {
    console.warn("Could not load categories for Header:", err);
  }

  return (
    <div className="flex flex-col min-h-screen bg-brand-black text-brand-white">
      <Header categories={categories} />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <MobileNav />
      <WhatsAppButton />
    </div>
  );
}
