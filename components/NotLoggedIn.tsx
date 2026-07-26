"use client";

import Link from "next/link";
import { UserX, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function NotLoggedIn({
  title = "Authentication Required",
  message = "Please sign in or create an account to access your personal technology profile and orders."
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="min-h-screen bg-[#000000] text-white relative overflow-hidden pt-32 pb-24 flex items-center justify-center">
      {/* Background Vignette Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-20 brightness-[0.7]"
        style={{ backgroundImage: "url('/tech-landscape.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12 w-full flex justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-[#111113]/90 backdrop-blur-xl rounded-3xl border border-white/10 p-10 sm:p-14 max-w-lg w-full text-center flex flex-col items-center shadow-2xl"
        >
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <UserX className="w-10 h-10 text-[#00A7B5]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-medium text-white mb-3 tracking-tight">{title}</h2>
          <p className="text-white/50 mb-8 text-sm sm:text-base leading-relaxed font-normal max-w-[380px]">{message}</p>
          <Link href="/login" className="w-full">
            <Button className="w-full h-12 bg-white hover:bg-white/90 text-black rounded-full font-medium transition-all shadow-lg flex items-center justify-center gap-2 text-sm cursor-pointer">
              Sign In to Your Account <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
