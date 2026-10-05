import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-black flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-amber/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with back link */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-brand-zinc-400 hover:text-brand-amber transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Link>
        <div className="inline-flex items-center gap-1.5 text-xs text-brand-zinc-500">
          <ShieldCheck className="w-4 h-4 text-brand-amber" />
          <span>Secure Fitment Portal</span>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="max-w-md w-full mx-auto my-8 z-10">
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <Logo href="/" />
          <p className="text-xs uppercase tracking-widest text-brand-zinc-400 font-semibold mt-3">
            THE RIGHT PART. THE RIGHT FIT.
          </p>
        </div>

        <div className="bg-brand-zinc/90 backdrop-blur-md border border-brand-zinc-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {children}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md w-full mx-auto text-center text-xs text-brand-zinc-500 z-10">
        &copy; {new Date().getFullYear()} CARS SPARE PARTS. All rights reserved.
      </div>
    </div>
  );
}
