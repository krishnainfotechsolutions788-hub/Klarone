"use client";

import Link from "next/link";
import { ArrowUpRight, Sparkles, Laptop, Globe, Server, Check } from "lucide-react";
import { motion } from "framer-motion";

interface ServiceColumn {
  number: string;
  id: string;
  badge?: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  icon: typeof Sparkles;
  isParentCompany?: boolean;
  parentLabel?: string;
  accentGlow: string;
  borderHover: string;
}

const serviceColumns: ServiceColumn[] = [
  {
    number: "01",
    id: "smart-advisor",
    badge: "Klarone Core",
    title: "Smart",
    titleAccent: "Advisor",
    subtitle:
      "AI-driven hardware matching tailored to your exact coding stack, creative apps, budget, and performance needs.",
    ctaText: "FIND MY LAPTOP",
    ctaHref: "/find-laptop",
    icon: Sparkles,
    accentGlow: "from-[#00A7B5]/25 via-[#00A7B5]/5 to-transparent",
    borderHover: "hover:border-[#00A7B5]/50",
  },
  {
    number: "02",
    id: "sell-laptops",
    badge: "Certified Marketplace",
    title: "Laptop &",
    titleAccent: "Desktop Sales",
    subtitle:
      "Curated brand-new & certified refurbished machines with transparent condition grades, warranties, and zero hidden markups.",
    ctaText: "EXPLORE SHOP",
    ctaHref: "/shop",
    icon: Laptop,
    accentGlow: "from-white/15 via-white/5 to-transparent",
    borderHover: "hover:border-white/40",
  },
  {
    number: "03",
    id: "web-development",
    badge: "Scale Your Brand",
    title: "Website Design",
    titleAccent: "& Development",
    subtitle:
      "High-performance modern web apps, e-commerce stores, and digital products engineered to help your business scale fast.",
    ctaText: "EXPLORE WEB DEV",
    ctaHref: "/services/web-development",
    icon: Globe,
    accentGlow: "from-blue-500/20 via-blue-500/5 to-transparent",
    borderHover: "hover:border-blue-400/40",
  },
  {
    number: "04",
    id: "hardware-network-b2b",
    badge: "B2B Infrastructure",
    isParentCompany: true,
    parentLabel: "Krishna Infotech Solutions",
    title: "Hardware, Network",
    titleAccent: "& IT Solutions",
    subtitle:
      "Turnkey corporate IT infrastructure, bulk commercial hardware, enterprise networking, servers, and office deployment.",
    ctaText: "INQUIRE B2B",
    ctaHref:
      "https://wa.me/919999999999?text=Hi%20Krishna%20Infotech%20Solutions,%20I'm%20inquiring%20about%20Hardware,%20Networking%20and%20IT%20Solutions.",
    icon: Server,
    accentGlow: "from-amber-500/20 via-amber-500/5 to-transparent",
    borderHover: "hover:border-amber-400/40",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemUpVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] as const },
  },
};

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="relative w-full bg-[#000000] text-white py-20 sm:py-28 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#00A7B5]/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Top Header Row matching site style */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={containerVariants}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6"
        >
          <div className="flex flex-col items-start">
            {/* Pill Badge */}
            <motion.div
              variants={itemUpVariants}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1A1A1A] border border-white/10 mb-6 shadow-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#00A7B5]"></span>
              <span className="text-[12px] font-medium text-white/80 tracking-wide font-sans">
                Our Services
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h2
              variants={itemUpVariants}
              className="text-[33px] sm:text-[42px] lg:text-[48px] font-normal text-white tracking-tight leading-[1.12] max-w-[720px] font-sans"
            >
              Built around <br />
              <span className="text-white/60">your technology & business.</span>
            </motion.h2>
          </div>

          <motion.p
            variants={itemUpVariants}
            className="text-[14.5px] sm:text-[15px] leading-relaxed text-white/60 max-w-[380px] pb-1 font-light"
          >
            From AI-driven individual hardware guidance to custom web platforms and enterprise B2B infrastructure.
          </motion.p>
        </motion.div>

        {/* 4 Multi-Column Card Structure */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-4.5 rounded-3xl"
        >
          {serviceColumns.map((col) => {
            const Icon = col.icon;
            const isExternal = col.ctaHref.startsWith("http");

            const cardContent = (
              <div
                className={`relative flex flex-col justify-between p-7 sm:p-8 rounded-2xl bg-[#0F0F12] border border-white/[0.08] ${col.borderHover} transition-all duration-400 hover:bg-[#141418] shadow-2xl h-full overflow-hidden min-h-[460px] sm:min-h-[490px]`}
              >
                {/* Subtle top corner gradient glow */}
                <div
                  className={`absolute top-0 right-0 w-44 h-44 bg-gradient-to-br ${col.accentGlow} blur-2xl opacity-40 group-hover:opacity-85 transition-opacity duration-500 pointer-events-none`}
                />

                {/* Top: Index number & Outline Icon */}
                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[13px] font-mono font-medium tracking-wider text-white/50">
                      {col.number}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-[#1A1A20] border border-white/10 flex items-center justify-center text-white/80 group-hover:text-white group-hover:scale-105 transition-all duration-300">
                    <Icon className="w-5 h-5 stroke-[1.75]" />
                  </div>
                </div>

                {/* Middle: Title & Paragraph */}
                <div className="relative z-10 my-auto py-6">
                  <div className="text-[11px] font-medium uppercase font-mono tracking-wider text-white/40 mb-3">
                    {col.badge}
                  </div>
                  <h3 className="text-[24px] sm:text-[26px] font-normal leading-[1.18] tracking-tight text-white mb-3.5">
                    {col.title} <br />
                    <span className="text-white/85 font-normal">{col.titleAccent}</span>
                  </h3>
                  <p className="text-[13.5px] leading-[1.55] text-white/60 font-light">
                    {col.subtitle}
                  </p>
                </div>

                {/* Bottom: Action CTA */}
                <div className="relative z-10 pt-5 border-t border-white/[0.08] flex items-center justify-between group/cta">
                  <span className="text-[11.5px] font-mono tracking-[0.14em] font-semibold text-white/70 group-hover:text-white transition-colors uppercase">
                    {col.ctaText}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 group-hover:text-white group-hover:bg-white/15 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2]" />
                  </div>
                </div>
              </div>
            );

            return (
              <motion.div key={col.id} variants={itemUpVariants} className="group h-full">
                {isExternal ? (
                  <a
                    href={col.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full cursor-pointer"
                  >
                    {cardContent}
                  </a>
                ) : (
                  <Link href={col.ctaHref} className="block h-full cursor-pointer">
                    {cardContent}
                  </Link>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
