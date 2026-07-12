"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Mail, Lock, ShieldAlert } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert className="w-6 h-6 text-[#00A7B5]" />
          <span className="text-[14px] font-bold tracking-wider text-[#00A7B5] uppercase">Klarone Admin</span>
        </div>
        <h2 className="text-[32px] font-bold tracking-tight text-[#111111]">Enterprise Portal</h2>
        <p className="text-[15px] text-slate-500 font-medium">Log in to manage products, inventory, and users.</p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 font-medium">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2 relative">
          <label className="text-[13px] font-semibold text-slate-700 ml-1">Admin Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              type="email" 
              placeholder="admin@klarone.com" 
              {...register("email")}
              className={`pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:ring-[#00A7B5] transition-all ${errors.email ? "border-red-500" : ""}`}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-2 relative">
          <div className="flex justify-between items-center ml-1">
            <label className="text-[13px] font-semibold text-slate-700">Password</label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              type="password" 
              placeholder="Enter your secure password" 
              {...register("password")}
              className={`pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:ring-[#00A7B5] transition-all ${errors.password ? "border-red-500" : ""}`}
            />
          </div>
          {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between ml-1 mt-1">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-[#00A7B5] focus:ring-[#00A7B5]"
            />
            <label htmlFor="remember-me" className="ml-2 block text-[13px] font-medium text-slate-700">
              Keep me logged in
            </label>
          </div>

          <Link href="/forgot-password" className="text-[13px] font-semibold text-slate-500 hover:text-[#00A7B5] transition-colors">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full h-11 mt-4 bg-[#111111] hover:bg-[#222222] text-white rounded-lg font-medium shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
          {isLoading ? "Authenticating..." : "Access Dashboard"} <ArrowRight className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
