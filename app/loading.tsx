import { Spinner } from "@/components/ui";

export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="relative">
        <Spinner size="lg" color="amber" />
        <div className="absolute inset-0 rounded-full border-2 border-brand-amber/20 animate-ping pointer-events-none" />
      </div>
      <div className="space-y-1">
        <div className="font-heading font-bold text-sm tracking-wider uppercase text-brand-white">
          CARE <span className="text-brand-amber">SPARE PARTS</span>
        </div>
        <div className="text-[11px] text-brand-zinc-500 font-mono">
          Loading catalog & vehicle fitment...
        </div>
      </div>
    </div>
  );
}
