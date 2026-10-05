"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { User, Mail, Lock, Phone, AlertCircle, ArrowRight } from "lucide-react";
import { Button, Input, Spinner } from "@/components/ui";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(8, "Please enter a valid phone number (e.g. 03001234567)"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          accountType: "CUSTOMER",
          password: data.password,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setErrorMessage(json.error || "Failed to create account. Please try again.");
        setIsLoading(false);
        return;
      }

      // Automatic login for customers
      const loginRes = await signIn("credentials", {
        redirect: false,
        email: data.email.toLowerCase().trim(),
        password: data.password,
      });

      if (loginRes && !loginRes.error) {
        router.push("/account");
        router.refresh();
      } else {
        router.push("/login?registered=true");
      }
    } catch (err) {
      console.error("Registration submit error:", err);
      setErrorMessage("Network error occurred. Please check your connection and try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-brand-white">
          Create an Account
        </h2>
        <p className="text-xs sm:text-sm text-brand-zinc-400">
          Join CARE SPARE PARTS for precision fitment and fast shipping
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <Input
          label="Full Name"
          placeholder="Muhammad Ali"
          leftIcon={<User className="w-4 h-4 text-brand-zinc-400" />}
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="ali@example.com"
          leftIcon={<Mail className="w-4 h-4 text-brand-zinc-400" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="03001234567"
          leftIcon={<Phone className="w-4 h-4 text-brand-zinc-400" />}
          hint="For order tracking & fitment confirmation WhatsApp updates"
          error={errors.phone?.message}
          {...register("phone")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4 text-brand-zinc-400" />}
            error={errors.password?.message}
            {...register("password")}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4 text-brand-zinc-400" />}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-4"
          size="lg"
          loading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="pt-4 border-t border-brand-zinc-800 text-center">
        <p className="text-xs text-brand-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-amber font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <Spinner size="lg" color="amber" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
