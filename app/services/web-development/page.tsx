"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Code2,
  Sparkles,
  Laptop,
  CheckCircle2,
  ArrowRight,
  Zap,
  Globe2,
  Layers,
  Smartphone,
  ShieldCheck,
  Cpu,
  Palette,
  Send,
  MessageSquare,
  Building2,
  TrendingUp,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/shared/Footer";

const serviceCapabilities = [
  {
    icon: Palette,
    title: "Custom UI/UX & Brand Design",
    description:
      "Crafting high-converting, minimal, and premium digital aesthetics tailored to your business persona with zero generic templates.",
    features: [
      "Figma wireframing & high-fidelity interactive prototypes",
      "Tailored typography, design systems & fluid animations",
      "Mobile-first responsive layouts for high engagement",
    ],
  },
  {
    icon: Code2,
    title: "Full-Stack Web Development",
    description:
      "Engineered with modern frameworks for hyper-fast load times, SEO dominance, and reliable cloud deployments.",
    features: [
      "Next.js, React, TypeScript & Tailwind CSS",
      "Server-side rendering (SSR) & edge performance",
      "Scalable REST & GraphQL API integrations",
    ],
  },
  {
    icon: Smartphone,
    title: "E-Commerce & Digital Storefronts",
    description:
      "Custom shopping experiences designed to maximize conversions, automate inventory, and accept multi-currency payments securely.",
    features: [
      "Seamless Razorpay, Stripe & UPI payment gateways",
      "Custom catalog management & order tracking dashboards",
      "High-speed checkout flows with minimal cart abandonment",
    ],
  },
  {
    icon: TrendingUp,
    title: "Performance, SEO & Business Scale",
    description:
      "We don't just build websites; we optimize them to rank on Google search, generate leads, and accelerate your business growth.",
    features: [
      "Core Web Vitals 95+ score optimization",
      "Technical on-page SEO & structured schema markup",
      "Analytics dashboards & automated CRM lead capture",
    ],
  },
];

const developmentProcess = [
  {
    step: "01",
    title: "Discovery & Strategy",
    desc: "We analyze your business goals, target audience, competitive landscape, and digital requirements.",
  },
  {
    step: "02",
    title: "UI/UX Architecture",
    desc: "Translating brand identity into modern wireframes and prototypes for feedback and iteration.",
  },
  {
    step: "03",
    title: "Engineering & Speed",
    desc: "Writing clean, modular, production-ready code with responsive design across all mobile and desktop devices.",
  },
  {
    step: "04",
    title: "Launch, SEO & Support",
    desc: "Deploying to fast cloud servers, configuring Google analytics, security certificates, and ongoing maintenance.",
  },
];

const techStack = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "Supabase",
  "PostgreSQL",
  "Vercel",
  "Stripe",
  "Figma",
  "Framer Motion",
  "Docker",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] as const },
  },
};

export default function WebDevelopmentPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "Business Website",
    budget: "₹25,000 - ₹50,000",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappMessage = encodeURIComponent(
      `*New Web Development Inquiry*\n\n` +
      `*Name:* ${formData.name}\n` +
      `*Email:* ${formData.email}\n` +
      `*Phone:* ${formData.phone}\n` +
      `*Project Type:* ${formData.projectType}\n` +
      `*Budget Range:* ${formData.budget}\n` +
      `*Project Details:* ${formData.message}`
    );
    window.open(`https://wa.me/919999999999?text=${whatsappMessage}`, "_blank");
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-white selection:text-black">
      <Header />

      <main className="pt-28 pb-20 overflow-hidden">
        {/* ===== HERO SECTION ===== */}
        <section className="relative w-full px-6 lg:px-12 pt-10 pb-20 sm:pb-28">
          {/* Ambient Lighting */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#00A7B5]/12 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-[1240px]">
            {/* Top Ecosystem Cross-Link Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex flex-wrap items-center gap-2.5 px-4 py-2 rounded-full bg-[#141418] border border-white/10 mb-8 backdrop-blur-md"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#00A7B5] animate-pulse"></span>
              <span className="text-[13px] text-white/80 font-normal">
                Beyond AI Hardware Recommendations & Tech Sales:
              </span>
              <span className="text-[13px] text-[#00A7B5] font-medium">
                We Build Digital Products For Your Business
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="max-w-[920px] mb-8"
            >
              <h1 className="text-[40px] sm:text-[56px] lg:text-[68px] font-normal tracking-tight leading-[1.08] text-white">
                High-performance websites & web apps,{" "}
                <span className="text-white/60">
                  engineered to scale your business.
                </span>
              </h1>
            </motion.div>

            {/* Subtitle & Value Proposition */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-[16px] sm:text-[18px] text-white/70 max-w-[720px] leading-relaxed mb-10 font-light"
            >
              Along with Klarone’s AI laptop advisory and hardware marketplace, we help startups, local businesses, and modern enterprises build blazing-fast websites, custom web applications, and high-converting e-commerce platforms.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <a
                href="#consultation"
                className="inline-flex items-center justify-center gap-2 px-8 h-12 rounded-full bg-white text-black text-[14.5px] font-medium hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(255,255,255,0.15)]"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="https://wa.me/919999999999?text=Hi%20Klarone,%20I'd%20like%20to%20discuss%20a%20website%20development%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 h-12 rounded-full bg-[#141418] border border-white/15 text-white/90 text-[14.5px] font-medium hover:bg-white/10 hover:border-white/30 transition-all"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Chat on WhatsApp</span>
              </a>
            </motion.div>
          </div>
        </section>

        {/* ===== WHAT WE BUILD (4 KEY CAPABILITIES) ===== */}
        <section className="relative w-full px-6 lg:px-12 py-16 border-t border-white/[0.06]">
          <div className="mx-auto max-w-[1240px]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={containerVariants}
              className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6"
            >
              <div>
                <motion.div
                  variants={itemUpVariants}
                  className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1A1A1A] border border-white/10 mb-4 shadow-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00A7B5]"></span>
                  <span className="text-[12px] font-medium text-white/80 tracking-wide font-sans">
                    Core Capabilities
                  </span>
                </motion.div>
                <motion.h2
                  variants={itemUpVariants}
                  className="text-[30px] sm:text-[38px] font-normal tracking-tight text-white"
                >
                  Everything needed to launch and grow online.
                </motion.h2>
              </div>

              <motion.p
                variants={itemUpVariants}
                className="text-[14.5px] text-white/60 max-w-[360px] font-light"
              >
                Tailored design and engineering from single-page marketing sites to complex web applications.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {serviceCapabilities.map((cap, idx) => {
                const Icon = cap.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={itemUpVariants}
                    className="p-8 sm:p-9 rounded-2xl bg-[#0F0F12] border border-white/[0.08] hover:border-white/20 transition-all duration-300 hover:bg-[#141418] shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-[#1A1A20] border border-white/10 flex items-center justify-center mb-6 text-white">
                        <Icon className="w-6 h-6 stroke-[1.75]" />
                      </div>
                      <h3 className="text-[22px] font-normal text-white mb-2.5 tracking-tight">
                        {cap.title}
                      </h3>
                      <p className="text-[14px] text-white/60 leading-relaxed mb-6 font-light">
                        {cap.description}
                      </p>
                    </div>

                    <ul className="space-y-2.5 pt-4 border-t border-white/[0.06]">
                      {cap.features.map((feat, fIdx) => (
                        <li
                          key={fIdx}
                          className="flex items-start gap-2.5 text-[13.5px] text-white/80"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#00A7B5] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ===== 4-STEP DEVELOPMENT PROCESS ===== */}
        <section className="relative w-full px-6 lg:px-12 py-20 bg-[#070709] border-t border-b border-white/[0.06]">
          <div className="mx-auto max-w-[1240px]">
            <div className="max-w-[620px] mb-14">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1A1A1A] border border-white/10 mb-4 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-white/70"></span>
                <span className="text-[12px] font-medium text-white/80 tracking-wide font-sans">
                  Process Workflow
                </span>
              </div>
              <h2 className="text-[30px] sm:text-[38px] font-normal tracking-tight text-white">
                How we take your idea to a live, converting website.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {developmentProcess.map((proc, pIdx) => (
                <div
                  key={pIdx}
                  className="p-7 rounded-2xl bg-[#0F0F12] border border-white/[0.07] flex flex-col justify-between min-h-[240px]"
                >
                  <span className="text-[28px] font-mono font-medium text-[#00A7B5] opacity-80">
                    {proc.step}
                  </span>
                  <div>
                    <h3 className="text-[18px] font-normal text-white mb-2">
                      {proc.title}
                    </h3>
                    <p className="text-[13.5px] text-white/60 leading-relaxed font-light">
                      {proc.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== MODERN TECH STACK PILLS ===== */}
        <section className="w-full px-6 lg:px-12 py-16">
          <div className="mx-auto max-w-[1240px] text-center">
            <h3 className="text-[13px] font-mono uppercase tracking-[0.2em] text-white/50 mb-8">
              Built using industry-standard modern technology
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
              {techStack.map((tech, tIdx) => (
                <div
                  key={tIdx}
                  className="px-4 py-2 rounded-full bg-[#111114] border border-white/10 text-white/80 text-[13.5px] font-medium hover:border-white/25 hover:text-white transition-colors"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CONSULTATION & ESTIMATE FORM SECTION ===== */}
        <section id="consultation" className="relative w-full px-6 lg:px-12 py-20 border-t border-white/[0.06]">
          <div className="mx-auto max-w-[1100px] grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column Information */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1A1A1A] border border-white/10 mb-4 shadow-sm w-fit">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00A7B5]"></span>
                <span className="text-[12px] font-medium text-white/80 tracking-wide font-sans">
                  Get In Touch
                </span>
              </div>
              <h2 className="text-[32px] sm:text-[40px] font-normal tracking-tight text-white leading-tight mb-5">
                Ready to build something exceptional?
              </h2>
              <p className="text-[14.5px] text-white/65 leading-relaxed mb-8 font-light">
                Tell us about your business goals, timeline, and features. We'll analyze your requirements and provide a clear roadmap and quotation within 24 hours.
              </p>

              <div className="space-y-4 pt-4 border-t border-white/[0.08]">
                <div className="flex items-center gap-3 text-[14px] text-white/80">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#00A7B5]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span>Fast turnaround & dedicated milestones</span>
                </div>
                <div className="flex items-center gap-3 text-[14px] text-white/80">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#00A7B5]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span>100% source code ownership & post-launch support</span>
                </div>
                <div className="flex items-center gap-3 text-[14px] text-white/80">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#00A7B5]">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span>Backed by Krishna Infotech Solutions infrastructure</span>
                </div>
              </div>
            </div>

            {/* Right Column Interactive Form */}
            <div className="lg:col-span-7 bg-[#0F0F12] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
              {isSubmitted ? (
                <div className="py-12 flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-[22px] font-medium text-white mb-2">
                    Inquiry Received!
                  </h3>
                  <p className="text-[14px] text-white/60 max-w-sm mb-6 font-light">
                    We've opened WhatsApp to connect you directly with our engineering team for instant project scoping.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2.5 rounded-full border border-white/15 text-[13.5px] text-white/80 hover:bg-white/5 transition-colors"
                  >
                    Submit Another Query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-medium uppercase font-mono tracking-wider text-white/60 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full h-11 px-4 rounded-xl bg-[#17171C] border border-white/10 text-white placeholder-white/30 text-[14px] focus:outline-none focus:border-white/30 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-medium uppercase font-mono tracking-wider text-white/60 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full h-11 px-4 rounded-xl bg-[#17171C] border border-white/10 text-white placeholder-white/30 text-[14px] focus:outline-none focus:border-white/30 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-medium uppercase font-mono tracking-wider text-white/60 mb-2">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full h-11 px-4 rounded-xl bg-[#17171C] border border-white/10 text-white placeholder-white/30 text-[14px] focus:outline-none focus:border-white/30 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-medium uppercase font-mono tracking-wider text-white/60 mb-2">
                        Project Type
                      </label>
                      <select
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl bg-[#17171C] border border-white/10 text-white text-[14px] focus:outline-none focus:border-white/30 transition-colors"
                      >
                        <option value="Business Website">Business Website</option>
                        <option value="E-Commerce Store">E-Commerce Store</option>
                        <option value="Custom Web Application">Custom Web Application / SaaS</option>
                        <option value="Website Redesign & Speed Optimization">Website Redesign & SEO</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium uppercase font-mono tracking-wider text-white/60 mb-2">
                      Estimated Budget Range
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        "Under ₹25,000",
                        "₹25,000 - ₹50,000",
                        "₹50,000 - ₹1,00,000",
                        "₹1,00,000+",
                      ].map((budgetOption) => (
                        <button
                          key={budgetOption}
                          type="button"
                          onClick={() => setFormData({ ...formData, budget: budgetOption })}
                          className={`py-2 px-3 rounded-lg text-[12.5px] font-medium border transition-all text-center ${
                            formData.budget === budgetOption
                              ? "bg-white text-black border-white"
                              : "bg-[#17171C] text-white/70 border-white/10 hover:border-white/25 hover:text-white"
                          }`}
                        >
                          {budgetOption}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium uppercase font-mono tracking-wider text-white/60 mb-2">
                      Project Details & Goals
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Briefly describe what your business does and what you'd like your website to achieve..."
                      className="w-full p-4 rounded-xl bg-[#17171C] border border-white/10 text-white placeholder-white/30 text-[14px] focus:outline-none focus:border-white/30 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-white hover:bg-white/90 text-black font-medium text-[14.5px] transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] shadow-lg cursor-pointer"
                  >
                    <span>Request Project Quotation</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
