"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, Key } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const resetSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 text-center py-10">
        <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-[28px] font-bold tracking-tight text-[#111111]">Check your email</h2>
        <p className="text-[15px] text-slate-500 font-medium max-w-sm mx-auto">
          We&apos;ve sent a password reset link to your email address. You can close this window.
        </p>
        <Link href="/login">
          <Button className="h-11 mt-4 px-8 bg-[#111111] hover:bg-[#222222] text-white rounded-lg font-medium shadow-md transition-all hover:scale-[1.02]">
            Back to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-2">
          <Key className="w-6 h-6 text-slate-700" />
        </div>
        <h2 className="text-[32px] font-bold tracking-tight text-[#111111]">Forgot password</h2>
        <p className="text-[15px] text-slate-500 font-medium">Enter your email and we&apos;ll send you a reset link.</p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2 relative">
          <label className="text-[13px] font-semibold text-slate-700 ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              type="email" 
              placeholder="you@example.com" 
              {...register("email")}
              className={`pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:ring-[#00A7B5] transition-all ${errors.email ? "border-red-500" : ""}`}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>}
        </div>

        <Button disabled={isLoading} className="w-full h-11 mt-2 bg-[#111111] hover:bg-[#222222] text-white rounded-lg font-medium shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
          {isLoading ? "Sending link..." : "Send Reset Link"} <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      <p className="text-center text-[14px] text-slate-500 font-medium mt-4">
        Remembered your password?{" "}
        <Link href="/login" className="text-[#111111] hover:text-[#00A7B5] font-semibold transition-colors">
          Sign In
        </Link>
      </p>
    </div>
  );
}
