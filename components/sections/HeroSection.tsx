"use client";

import Link from "next/link";
import { Play, X, Menu, Paperclip, BarChart, Zap, Mic, ArrowUp, Search, Sparkles } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import KlaroneIcon from "@/components/KlaroneIcon";

export default function HeroSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax scroll transformations
  const cardY = useTransform(scrollYProgress, [0, 1], ["0px", "-40px"]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0px", "40px"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full flex flex-col items-center overflow-hidden bg-[#000000] text-white pt-24 sm:pt-32 pb-16"
    >
      
      {/* ===== TECH HORIZON LANDSCAPE BACKGROUND ===== */}
      <motion.div 
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/Hero/tech-landscape.png" 
          alt="Tech Hub Horizon Landscape"
          className="w-full h-full object-cover object-center opacity-80"
        />
        
        {/* Subtle Dark Vignette for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/85 via-[#000000]/40 to-[#000000] z-1" />
      </motion.div>

      {/* ===== HERO HEADLINE & CTAS (Sitting over the Sky) ===== */}
      <div className="relative z-20 mx-auto max-w-[900px] px-6 flex flex-col items-center text-center">

        {/* Intro Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md mb-7 shadow-sm cursor-pointer hover:bg-white/15 transition-colors"
        >
          <span className="flex h-2 w-2 rounded-full bg-[#00A7B5] animate-pulse"></span>
          <span className="text-[12.5px] font-normal text-white/85 tracking-wide">Klarone V1: Smart Recommendations</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[44px] sm:text-[54px] lg:text-[62px] font-medium leading-[1.08] tracking-tight text-white mb-5 drop-shadow-sm max-w-[780px]"
        >
          Buy Technology <br className="hidden sm:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white/95 to-white/70">
            With Confidence
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-[15px] sm:text-[16.5px] leading-relaxed text-white/70 mb-9 max-w-[480px] drop-shadow-sm"
        >
          Personalized technology recommendations based on your goals, budget, and workflow.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12"
        >
          {/* Primary CTA */}
          <Link href="/find-laptop">
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,1)" }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center h-[46px] rounded-full bg-white px-7 text-[14px] font-medium text-black transition-colors duration-300 shadow-[0_0_22px_rgba(255,255,255,0.18)] hover:shadow-[0_0_32px_rgba(255,255,255,0.28)]"
            >
              Find My Laptop
            </motion.button>
          </Link>

          {/* Secondary Play CTA */}
          <motion.button
            onClick={() => setIsVideoOpen(true)}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.25)" }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-2.5 h-[46px] rounded-full border border-white/15 bg-white/5 backdrop-blur-md pl-3 pr-5 text-[14px] font-medium text-white transition-all duration-300"
          >
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/15 shrink-0">
              <Play className="w-2.5 h-2.5 text-white fill-white translate-x-[1px]" />
            </div>
            <span>How it works</span>
          </motion.button>
        </motion.div>
      </div>

      {/* ===== FLOATING DEMO CHAT CARD IMAGE (Centered Over Hills) ===== */}
      <div className="relative w-full z-20 flex flex-col items-center mt-2">
        <motion.div
          style={{ y: cardY }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-[880px] px-4 sm:px-6 my-4"
        >
          <div className="w-full rounded-2xl sm:rounded-3xl border border-white/15 overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.85)] bg-[#111113] backdrop-blur-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/sample/comp.png"
              alt="Klarone AI Recommendation Experience"
              className="w-full h-auto object-cover rounded-2xl sm:rounded-3xl scale-103"
            />
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsVideoOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-10"
            >
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 hover:bg-white/10 text-white/70 hover:text-white transition-colors border border-white/10 backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>
              <video
                src="/sample/how-work.mp4"
                autoPlay
                controls
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}


