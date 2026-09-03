"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Clock,
  AlertCircle,
  Package,
  BarChart3,
  Users,
  Store,
  Utensils,
  Scissors,
  Building,
  Boxes,
  ShoppingBag,
  MoreHorizontal
} from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/shared/Footer";

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

// Problems clients face with images from /public/service/web1.png to web4.png
const clientProblems = [
  {
    icon: Palette,
    title: "Weak Brand Identity",
    description: "Generic templates make your business look like everyone else. No unique visual presence to stand out in the market.",
    image: "/service/web1.png",
    color: "#00A7B5"
  },
  {
    icon: Package,
    title: "Inventory Mismanagement",
    description: "Manual tracking leads to stockouts, overstocking, and lost sales. No real-time visibility into your inventory.",
    image: "/service/web2.png",
    color: "#F59E0B"
  },
  {
    icon: BarChart3,
    title: "No Customer Insights",
    description: "Operating blindly without understanding customer behavior, preferences, or purchase patterns to grow your business.",
    image: "/service/web3.png",
    color: "#8B5CF6"
  },
  {
    icon: Users,
    title: "Poor Customer Engagement",
    description: "No system to capture leads, nurture relationships, or convert visitors into loyal, repeat customers.",
    image: "/service/web4.png",
    color: "#EC4899"
  }
];

// Website solutions we build with images from /public/service/dev1.png to dev4.png
const websiteSolutions = [
  {
    icon: Scissors,
    title: "Barber Shops & Salons",
    description: "Branded websites with appointment booking, service catalog, loyalty programs, and client management dashboards.",
    features: ["Online booking system", "Service packages", "Client history tracking", "SMS reminders"],
    image: "/service/dev1.png",
    color: "#00A7B5"
  },
  {
    icon: ShoppingBag,
    title: "E-Commerce Stores",
    description: "Full-featured online stores with multi-currency payments, shipping integration, and AI-powered product recommendations.",
    features: ["Secure checkout", "Multi-payment gateways", "Product variants", "Order tracking"],
    image: "/service/dev2.png",
    color: "#F59E0B"
  },
  {
    icon: Boxes,
    title: "Inventory Management",
    description: "Custom inventory systems with barcode scanning, stock alerts, supplier management, and purchase order automation.",
    features: ["Real-time stock tracking", "Automated reordering", "Supplier portals", "Analytics dashboards"],
    image: "/service/dev3.png",
    color: "#8B5CF6"
  },
  {
    icon: MoreHorizontal,
    title: "Other Industries",
    description: "Custom websites for real estate, education, healthcare, logistics, startups, and any other business niche.",
    features: ["Tailored solutions", "Industry-specific features", "Scalable architecture", "Future-ready design"],
    image: "/service/dev4.png",
    color: "#EC4899"
  }
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
              Along with Klarone's AI laptop advisory and hardware marketplace, we help startups, local businesses, and modern enterprises build blazing-fast websites, custom web applications, and high-converting e-commerce platforms.
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

        {/* ===== PROBLEMS CLIENTS FACE ===== */}
        <section className="relative w-full px-6 lg:px-12 py-16 border-t border-white/[0.06]">
          <div className="mx-auto max-w-[1240px]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={containerVariants}
              className="mb-14"
            >
              {/* <motion.div
                variants={itemUpVariants}
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1A1A1A] border border-white/10 mb-4 shadow-sm"
              >
                <AlertCircle className="w-3.5 h-3.5 text-[#00A7B5]" />
                <span className="text-[12px] font-medium text-white/80 tracking-wide font-sans">
                  Common Challenges
                </span>
              </motion.div> */}
              <motion.h2
                variants={itemUpVariants}
                className="text-[30px] sm:text-[38px] font-normal tracking-tight text-white max-w-[700px]"
              >
                Struggling with these business challenges?
              </motion.h2>
              <motion.p
                variants={itemUpVariants}
                className="text-[14.5px] text-white/60 max-w-[600px] mt-3 font-light"
              >
                We've helped hundreds of businesses overcome these obstacles with custom digital solutions.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {clientProblems.map((problem, idx) => {
                const Icon = problem.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={itemUpVariants}
                    className="group overflow-hidden rounded-2xl bg-[#0F0F12] border border-white/[0.08] hover:border-white/20 transition-all duration-300 hover:bg-[#141418] shadow-xl hover:shadow-[0_0_40px_rgba(0,0,0,0.3)] hover:-translate-y-1"
                  >
                    {/* Image Container - 1:1 Square aspect ratio */}
                    <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-[#1A1A20] to-[#0F0F12]">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F12] via-transparent to-transparent z-10 opacity-60"></div>
                      <Image
                        src={problem.image}
                        alt={problem.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${problem.color}15` }}
                        >
                          <Icon className="w-5 h-5 stroke-[1.75]" style={{ color: problem.color }} />
                        </div>
                        <h3 className="text-[17px] font-medium text-white tracking-tight">
                          {problem.title}
                        </h3>
                      </div>
                      <p className="text-[13.5px] text-white/60 leading-relaxed font-light">
                        {problem.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ===== WHAT WE BUILD (Solutions Cards in a Row) ===== */}
        <section className="relative w-full px-6 lg:px-12 py-20 bg-[#070709] border-t border-white/[0.06]">
          <div className="mx-auto max-w-[1240px]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={containerVariants}
              className="mb-14"
            >
              {/* <motion.div
                variants={itemUpVariants}
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1A1A1A] border border-white/10 mb-4 shadow-sm"
              >
                <Laptop className="w-3.5 h-3.5 text-[#00A7B5]" />
                <span className="text-[12px] font-medium text-white/80 tracking-wide font-sans">
                  Custom Solutions
                </span>
              </motion.div> */}
              <motion.h2
                variants={itemUpVariants}
                className="text-[30px] sm:text-[38px] font-normal tracking-tight text-white max-w-[700px]"
              >
                Websites we build for your business
              </motion.h2>
              <motion.p
                variants={itemUpVariants}
                className="text-[14.5px] text-white/60 max-w-[600px] mt-3 font-light"
              >
                Tailored digital solutions designed for your industry's unique needs and challenges.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {websiteSolutions.map((solution, idx) => {
                const Icon = solution.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={itemUpVariants}
                    className="group overflow-hidden rounded-2xl bg-[#0F0F12] border border-white/[0.08] hover:border-white/20 transition-all duration-300 hover:bg-[#141418] shadow-xl hover:-translate-y-1 flex flex-col"
                  >
                    {/* Image Container - 1:1 Square aspect ratio with actual images */}
                    <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-[#1A1A20] to-[#0F0F12] flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F12] via-transparent to-transparent z-10 opacity-60"></div>
                      <Image
                        src={solution.image}
                        alt={solution.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    
                    {/* Content - Compact for row layout */}
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div 
                          className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${solution.color}15` }}
                        >
                          <Icon className="w-4 h-4 stroke-[1.75]" style={{ color: solution.color }} />
                        </div>
                        <h3 className="text-[16px] font-medium text-white tracking-tight leading-tight">
                          {solution.title}
                        </h3>
                      </div>
                      <p className="text-[12.5px] text-white/60 leading-relaxed mb-3 font-light flex-grow">
                        {solution.description}
                      </p>

                      <ul className="space-y-1.5 pt-3 border-t border-white/[0.06]">
                        {solution.features.map((feat, fIdx) => (
                          <li
                            key={fIdx}
                            className="flex items-start gap-2 text-[12px] text-white/70"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: solution.color }} />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
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