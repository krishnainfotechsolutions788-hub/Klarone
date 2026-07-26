"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface TopProduct {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
}

const topProducts: TopProduct[] = [
  {
    id: "macbook-air-m3",
    title: "MacBook Air M3: Ultimate Portability & Battery for Developers",
    category: "Developer Choice",
    date: "Top Pick · Mar 2026",
    image: "/top/top5.webp",
  },
  {
    id: "thinkpad-x1-carbon",
    title: "Lenovo ThinkPad X1: Unmatched Durability & Keyboard Experience",
    category: "Professional",
    date: "Top Pick · Mar 2026",
    image: "/top/top1.webp",
  },
  {
    id: "dell-xps-14",
    title: "Dell XPS 14: Stunning 3.2K OLED Display for Creative Workflows",
    category: "Design & Editing",
    date: "Top Pick · Mar 2026",
    image: "/top/top2.webp",
  },
  {
    id: "asus-rog-zephyrus-g14",
    title: "ASUS ROG Zephyrus G14: High Performance AI & Gaming Powerhouse",
    category: "Performance & Gaming",
    date: "Top Pick · Mar 2026",
    image: "/top/top3.webp",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemUpVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] as const } 
  }
};

export default function TopSoldSection() {
  return (
    <section className="w-full bg-[#000000] text-white py-16 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Animated Header Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={containerVariants}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6"
        >
          <div className="flex flex-col items-start">
            {/* Minimal Pill Badge Animated */}
            <motion.div variants={itemUpVariants} className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1A1A1A] border border-white/10 mb-6 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
              <span className="text-[12px] font-medium text-white/80 tracking-wide">Top Products</span>
            </motion.div>

            {/* Main Headline Animated */}
            <motion.h2 
              variants={itemUpVariants}
              className="text-[33px] sm:text-[40px] lg:text-[46px] font-normal text-white tracking-tight leading-[1.15] max-w-[700px]"
            >
              Top recommended products of the month
            </motion.h2>
          </div>

          {/* Visit Shop / View All Link Animated */}
          <motion.div variants={itemUpVariants}>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors duration-200 shrink-0 pb-1"
            >
              <span>Explore shop</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>

        {/* 4-Column Card Grid with Entrance Animation */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6"
        >
          {topProducts.map((product) => (
            <motion.div key={product.id} variants={itemUpVariants}>
              <Link
                href={`/shop/${product.id}`}
                className="group flex flex-col bg-[#111113] border border-white/[0.08] hover:border-white/20 rounded-2xl p-1 transition-all duration-300 hover:bg-[#161619] shadow-2xl h-full"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-[4/3] rounded-xl bg-[#050507] overflow-hidden mb-5 flex items-center justify-center border border-white/[0.06]">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover opacity-85 brightness-[0.88] contrast-[1.05] group-hover:scale-105 group-hover:brightness-95 transition-all duration-500 ease-out"
                  />

                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
                  <div className="absolute inset-0 bg-black/25 mix-blend-multiply pointer-events-none group-hover:bg-black/15 transition-colors duration-300" />
                </div>

                {/* Title & Meta Info */}
                <div className="flex flex-col flex-1 justify-between px-5 pb-5">
                  <motion.h3 variants={itemUpVariants} className="text-base sm:text-[17px] font-normal text-white leading-snug mb-5 group-hover:text-white/90 transition-colors">
                    {product.title}
                  </motion.h3>

                  <motion.div variants={itemUpVariants} className="flex items-center justify-between text-xs text-white/50 border-t border-white/[0.06] pt-4">
                    <span>{product.category}</span>
                    <span>{product.date}</span>
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
