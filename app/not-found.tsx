import Link from "next/link";
import { Wrench, Home, Search, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui";

export default function NotFound() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";

  return (
    <div className="min-h-screen bg-brand-black text-brand-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-brand-zinc border-2 border-brand-amber/40 flex items-center justify-center text-brand-amber mx-auto shadow-2xl shadow-brand-amber/10">
          <Wrench className="w-10 h-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-mono font-bold text-brand-amber uppercase tracking-widest">
            Error 404
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight text-brand-white">
            Part Not Found
          </h1>
          <p className="text-xs sm:text-sm text-brand-zinc-400 leading-relaxed">
            The page, part SKU, or vehicle catalog you requested does not exist or may have been relocated.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              className="w-full sm:w-auto font-heading uppercase tracking-wider text-xs font-bold"
              leftIcon={<Home className="w-4 h-4 text-brand-black" />}
            >
              Return Home
            </Button>
          </Link>

          <Link href="/search" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="md"
              className="w-full sm:w-auto text-xs"
              leftIcon={<Search className="w-4 h-4" />}
            >
              Search Parts
            </Button>
          </Link>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              "Hello CARE SPARE PARTS! I ran into a 404 page while searching for a part. Can you help me find it?"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              variant="ghost"
              size="md"
              className="w-full sm:w-auto text-xs text-emerald-400 hover:text-emerald-300"
              leftIcon={<MessageSquare className="w-4 h-4" />}
            >
              WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
