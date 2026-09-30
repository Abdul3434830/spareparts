"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { Button, Input, Spinner } from "@/components/ui";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email.toLowerCase().trim(),
        password: data.password,
      });

      if (!result || result.error) {
        setErrorMessage("Invalid email or password. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      console.error("Login submission error:", err);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-brand-white">
          Sign In to Your Account
        </h2>
        <p className="text-xs sm:text-sm text-brand-zinc-400">
          Access your garage, order history, and saved vehicle fitments
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="your.email@example.com"
          leftIcon={<Mail className="w-4 h-4 text-brand-zinc-400" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="space-y-1">
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4 text-brand-zinc-400" />}
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          size="lg"
          loading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <div className="pt-4 border-t border-brand-zinc-800 text-center space-y-2">
        <p className="text-xs text-brand-zinc-400">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/register"
            className="text-brand-amber font-semibold hover:underline"
          >
            Create Customer Account
          </Link>
        </p>
        <p className="text-xs text-brand-zinc-500">
          Are you a workshop or wholesale buyer?{" "}
          <Link
            href="/register?type=wholesale"
            className="text-brand-zinc-300 font-medium hover:text-brand-amber underline"
          >
            Apply for Wholesale
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <Spinner size="lg" color="amber" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
