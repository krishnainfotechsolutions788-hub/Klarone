"use client";

import { useState, useRef } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

type CategoryKey = "general" | "ai" | "integrations";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_CATEGORIES: { id: CategoryKey; name: string; items: FaqItem[] }[] = [
  {
    id: "general",
    name: "General",
    items: [
      {
        question: "What is Klarone and how does it work?",
        answer: "Klarone is a technology guidance platform that helps you discover, choose, and manage laptops based on your exact workflow and budget, without pushy sales pitches."
      },
      {
        question: "How long does it take to get a recommendation?",
        answer: "Our recommendation engine delivers personalized results instantly after you answer a few quick questions about your workflow."
      },
      {
        question: "Do I need technical knowledge to use Klarone?",
        answer: "No technical knowledge is required. You simply tell us what software or tasks you run (e.g. coding, video editing, college assignments) and we handle the technical hardware specifications for you."
      },
      {
        question: "Is there a free plan available?",
        answer: "Yes, technology recommendations and community access on Klarone V1 are 100% free with no credit card required."
      },
      {
        question: "What's included in the Pro plan?",
        answer: "Pro users get 1-on-1 expert consultation calls, customized hardware build reports, exclusive rental discounts, and priority access to future marketplace deals."
      },
      {
        question: "Can I switch plans or cancel anytime?",
        answer: "Yes, you can upgrade, downgrade, or cancel your Klarone Pro account anytime with zero hidden lock-in contracts."
      }
    ]
  },
  {
    id: "ai",
    name: "AI & Capabilities",
    items: [
      {
        question: "How accurate are the laptop recommendations?",
        answer: "Our matching algorithms analyze real-world benchmark data, thermal performance, and user workflow benchmarks verified by hardware engineers."
      },
      {
        question: "Does Klarone prefer specific laptop brands?",
        answer: "No. Klarone is 100% brand-agnostic. We do not sell inventory directly on V1, guaranteeing completely unbiased advice."
      },
      {
        question: "Can I get help comparing Mac vs Windows?",
        answer: "Yes! Our matcher evaluates app compatibility, battery life priorities, and ecosystem preferences to tell you objectively whether macOS or Windows fits your work better."
      }
    ]
  },
  {
    id: "integrations",
    name: "Integrations & Security",
    items: [
      {
        question: "How is my contact and survey data protected?",
        answer: "We use enterprise-grade encryption for all user submission data. We never sell your data to third-party ad networks or cold-call telemarketers."
      },
      {
        question: "How do I contact the support team?",
        answer: "You can reach out to our team directly via email at support@klarone.com or join our official WhatsApp tech community for immediate assistance."
      }
    ]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
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

export default function FaqSection() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("general");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const currentCategoryObj = FAQ_CATEGORIES.find((cat) => cat.id === activeCategory) || FAQ_CATEGORIES[0];

  // Track scroll progress specifically across the main FAQ content grid
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ["start 0.5", "end 0.9"],
  });

  // Dynamic slide translation matching distance above Got Questions card
  const tabY = useTransform(scrollYProgress, [0, 1], ["0px", "220px"]);

  return (
    <section id="faq" className="w-full py-28 bg-[#000000] text-white overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">

        {/* Section Header with Entrance Animation */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={containerVariants}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16"
        >
          <div className="flex flex-col items-start">
            {/* Minimal Category Pill */}
            <motion.div variants={itemUpVariants} className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1A1A1A] border border-white/10 mb-6 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-white/60"></span>
              <span className="text-[12px] font-normal text-white/70 tracking-wide">FAQ</span>
            </motion.div>

            <motion.h2 variants={itemUpVariants} className="text-[33px] sm:text-[40px] lg:text-[46px] font-normal leading-[1.15] tracking-tight text-white max-w-[620px]">
              Answers to the questions <br className="hidden sm:block" /> that come up most.
            </motion.h2>
          </div>

          <motion.p variants={itemUpVariants} className="text-[14.5px] leading-relaxed text-white/60 max-w-[360px] pb-2">
            Learn how Klarone works, what it connects to, how recommendations are handled, and what teams can expect day to day.
          </motion.p>
        </motion.div>

        {/* Main Grid Layout */}
        <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">

          {/* Left Column (Category Tabs + Got Questions Card) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-12 relative min-h-[580px]">

            {/* Top Category Selector Stack (Slides down seamlessly on scroll) */}
            <motion.div 
              style={{ y: tabY }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={containerVariants}
              className="flex flex-col gap-1.5 items-stretch max-w-[320px]"
            >
              {FAQ_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <motion.button
                    key={cat.id}
                    variants={itemUpVariants}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setOpenIndex(null);
                    }}
                    className={`w-full py-3.5 px-6 rounded-full text-[14.5px] font-medium transition-all text-center cursor-pointer ${
                      isActive
                        ? "bg-[#222226] text-white border border-white/15 shadow-md"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    {cat.name}
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Bottom Got Questions? Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
              className="p-7 rounded-2xl bg-[#141416] border border-white/10 flex flex-col justify-between min-h-[200px] max-w-[320px] shadow-xl mt-auto z-10"
            >
              <div>
                <h3 className="text-[20px] font-medium text-white mb-2 tracking-tight">Got Questions?</h3>
                <p className="text-[13.5px] leading-relaxed text-white/60">
                  Need help with something? Our team is here to make things easy. Don't hesitate to reach out.
                </p>
              </div>

              <a
                href="mailto:support@klarone.com"
                className="inline-flex items-center gap-2 text-[14px] font-medium text-white/90 hover:text-white transition-colors group cursor-pointer pt-4"
              >
                Email us
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>

          </div>

          {/* Right Column (Accordion List) */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.15 }}
                variants={containerVariants}
                className="flex flex-col gap-3"
              >
                {currentCategoryObj.items.map((item, idx) => {
                  const isOpen = openIndex === idx;
                  return (
                    <motion.div
                      key={idx}
                      variants={itemUpVariants}
                      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                        isOpen 
                          ? "bg-[#1C1C20] border-white/25 shadow-xl" 
                          : "bg-[#141416] border-white/10 hover:bg-[#1A1A1E] hover:border-white/20 hover:shadow-md"
                      }`}
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : idx)}
                        className="w-full text-left px-7 py-6 flex items-center justify-between gap-4 cursor-pointer"
                      >
                        <span className={`text-[15.5px] font-medium transition-colors ${isOpen ? "text-white" : "text-white/90"}`}>
                          {item.question}
                        </span>
                        <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180 bg-white/15 text-white" : "text-white/60"
                        }`}>
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-7 pb-6 pt-1 border-t border-white/[0.06]">
                              <p className="text-[14px] leading-relaxed text-white/70">
                                {item.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
