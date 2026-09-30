"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App boundary error caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-brand-black text-brand-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-500/50 flex items-center justify-center text-rose-400 mx-auto shadow-2xl">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-white">
            Something went wrong
          </h1>
          <p className="text-xs text-brand-zinc-400 leading-relaxed">
            An unexpected error occurred while loading this page. Our technical team has been notified.
          </p>
          {error?.digest && (
            <p className="text-[10px] font-mono text-brand-zinc-600">
              Error Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={() => reset()}
            leftIcon={<RotateCcw className="w-4 h-4 text-brand-black" />}
            className="w-full sm:w-auto font-heading uppercase tracking-wider text-xs font-bold"
          >
            Try Again
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="md"
              leftIcon={<Home className="w-4 h-4" />}
              className="w-full sm:w-auto text-xs"
            >
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
