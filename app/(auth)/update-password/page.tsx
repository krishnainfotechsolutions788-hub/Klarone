"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Key } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const updateSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type UpdateFormValues = z.infer<typeof updateSchema>;

export default function UpdatePasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateFormValues>({
    resolver: zodResolver(updateSchema),
  });

  const onSubmit = async (data: UpdateFormValues) => {
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    router.push("/login?message=Password updated successfully");
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-2">
          <Key className="w-6 h-6 text-slate-700" />
        </div>
        <h2 className="text-[32px] font-bold tracking-tight text-[#111111]">Update Password</h2>
        <p className="text-[15px] text-slate-500 font-medium">Please enter your new secure password.</p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2 relative">
          <label className="text-[13px] font-semibold text-slate-700 ml-1">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              type="password" 
              placeholder="••••••••••••" 
              {...register("password")}
              className={`pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:ring-[#00A7B5] transition-all ${errors.password ? "border-red-500" : ""}`}
            />
          </div>
          {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password.message}</p>}
        </div>

        <div className="flex flex-col gap-2 relative">
          <label className="text-[13px] font-semibold text-slate-700 ml-1">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              type="password" 
              placeholder="••••••••••••" 
              {...register("confirmPassword")}
              className={`pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:ring-[#00A7B5] transition-all ${errors.confirmPassword ? "border-red-500" : ""}`}
            />
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-500 ml-1">{errors.confirmPassword.message}</p>}
        </div>

        <Button disabled={isLoading} className="w-full h-11 mt-2 bg-[#111111] hover:bg-[#222222] text-white rounded-lg font-medium shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
          {isLoading ? "Updating..." : "Update Password"} <ArrowRight className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
