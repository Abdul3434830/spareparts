import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SuccessClient } from "@/components/checkout/SuccessClient";
import { Spinner } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Order Placed Successfully | CARS SPARE PARTS",
  description: "Your auto parts order has been placed. Thank you for shopping with CARS SPARE PARTS.",
};

export default function CheckoutSuccessPage() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-black text-brand-white selection:bg-brand-amber selection:text-brand-black">
      <Header />

      <main className="flex-1 w-full pb-20 md:pb-16 flex items-center justify-center">
        <Suspense
          fallback={
            <div className="p-20 text-center">
              <Spinner size="lg" color="amber" />
            </div>
          }
        >
          <SuccessClient />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
