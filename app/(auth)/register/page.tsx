"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { User, Mail, Lock, Phone, Building2, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { Button, Input, Spinner } from "@/components/ui";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(8, "Please enter a valid phone number (e.g. 03001234567)"),
    accountType: z.enum(["CUSTOMER", "WHOLESALE"]),
    companyName: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.accountType === "WHOLESALE" && !data.companyName) {
        return false;
      }
      return true;
    },
    {
      message: "Company / Workshop name is required for wholesale registration",
      path: ["companyName"],
    }
  );

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") === "wholesale" ? "WHOLESALE" : "CUSTOMER";

  const [accountType, setAccountType] = useState<"CUSTOMER" | "WHOLESALE">(initialType);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      accountType: initialType,
    },
  });

  const handleTypeChange = (type: "CUSTOMER" | "WHOLESALE") => {
    setAccountType(type);
    setValue("accountType", type);
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          accountType: data.accountType,
          companyName: data.companyName,
          password: data.password,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setErrorMessage(json.error || "Failed to create account. Please try again.");
        setIsLoading(false);
        return;
      }

      if (data.accountType === "WHOLESALE") {
        setSuccessMessage(
          "Your wholesale application has been submitted! Our admin team will verify and activate your discounted wholesale rates within 24 hours."
        );
        setIsLoading(false);
      } else {
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

      {/* Account Type Selector Tabs */}
      <div className="grid grid-cols-2 p-1 rounded-xl bg-brand-zinc-800 border border-brand-zinc-700">
        <button
          type="button"
          onClick={() => handleTypeChange("CUSTOMER")}
          className={`py-2 text-xs font-semibold rounded-lg transition-all ${
            accountType === "CUSTOMER"
              ? "bg-brand-amber text-brand-black shadow-md"
              : "text-brand-zinc-400 hover:text-brand-white"
          }`}
        >
          Customer
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange("WHOLESALE")}
          className={`py-2 text-xs font-semibold rounded-lg transition-all ${
            accountType === "WHOLESALE"
              ? "bg-brand-amber text-brand-black shadow-md"
              : "text-brand-zinc-400 hover:text-brand-white"
          }`}
        >
          Wholesale / Workshop
        </button>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-lg bg-green-950/60 border border-green-800 text-green-300 text-xs space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span>Application Submitted!</span>
          </div>
          <p className="leading-relaxed">{successMessage}</p>
          <div className="pt-2">
            <Link href="/login" className="text-brand-amber font-semibold hover:underline">
              Return to Login &rarr;
            </Link>
          </div>
        </div>
      )}

      {!successMessage && (
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

          {accountType === "WHOLESALE" && (
            <Input
              label="Workshop / Business Name"
              placeholder="Ali Motors & Spare Parts"
              leftIcon={<Building2 className="w-4 h-4 text-brand-zinc-400" />}
              error={errors.companyName?.message}
              {...register("companyName")}
            />
          )}

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
            {isLoading
              ? "Creating Account..."
              : accountType === "WHOLESALE"
              ? "Submit Wholesale Application"
              : "Create Account"}
          </Button>
        </form>
      )}

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
