"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search, Menu, MessageSquare, CheckCircle2,
  HelpCircle, Link as LinkIcon, Mail, BarChart2, FileText, Users,
  Paperclip, BarChart, Zap, Mic, ArrowUp, PanelLeftClose, ShieldCheck, Laptop, RefreshCw, Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import KlaroneIcon from "@/components/KlaroneIcon";
import { getMLRecommendationsAction, getDynamicSuggestionsAction } from "@/app/actions/mlScoring";

// Guided Recommendation Questions Flow (Tailored for Indian Market)
const GUIDED_QUESTIONS = [
  {
    id: "primary_use",
    question: "What is your primary use case or professional requirement?",
    options: [
      { label: "Software Development & Coding (B.Tech / Dev)", value: "Software Development & Coding" },
      { label: "College & Academic Use (Student Budget)", value: "College & Academic Work" },
      { label: "Graphic Design, Video Editing & YouTube", value: "Graphic Design & Content Creation" },
      { label: "Business, Finance & Corporate Work", value: "Business & Productivity" },
      { label: "Gaming, AI Workloads & 3D Rendering", value: "Gaming & Heavy Rendering" }
    ]
  },
  {
    id: "budget",
    question: "What is your target budget range (in Indian Rupees ₹)?",
    options: [
      { label: "Under ₹45,000 (Entry Budget)", value: "Under ₹45,000" },
      { label: "₹45,000 - ₹65,000 (Mid-Range Value)", value: "₹45,000 - ₹65,000" },
      { label: "₹65,000 - ₹95,000 (High Performance)", value: "₹65,000 - ₹95,000" },
      { label: "Above ₹95,000 (Flagship & Premium)", value: "Above ₹95,000" }
    ]
  },
  {
    id: "priority",
    question: "Which feature is most critical for your daily Indian usage?",
    options: [
      { label: "All-day Battery Life & Travel Friendly", value: "Long Battery Life & Portability" },
      { label: "Raw CPU & GPU Processing Power", value: "Maximum CPU & GPU Power" },
      { label: "Color Accurate OLED / High-Res Display", value: "Color Accurate High-Res Display" },
      { label: "Durable Metal Build & Tactile Keyboard", value: "Durable Build & Keyboard Quality" }
    ]
  },
  {
    id: "os_preference",
    question: "Do you have a preferred OS & Service Brand in India?",
    options: [
      { label: "macOS (Apple M2/M3 Silicon)", value: "macOS" },
      { label: "Windows 11 (Lenovo / HP / Dell / ASUS)", value: "Windows 11" },
      { label: "Linux / Ubuntu Coding Ready", value: "Linux Compatible" },
      { label: "Best Value & Service Network in India", value: "Best Value (Any OS)" }
    ]
  }
];

// Sample Curated Recommendations tailored for Indian buyers with real INR pricing
const SAMPLE_RECOMMENDATIONS = [
  {
    name: "Apple MacBook Air M2 / M3",
    tagline: "Top choice in India for Developers, Students & Creators",
    price: "₹89,900",
    image: "/top/top1.webp",
    specs: ["Apple M2/M3 Chip", "8GB/16GB Unified RAM", "512GB SSD", "18 Hr Battery"],
    score: "98% Match",
    reasons: ["Silent fanless build ideal for long coding sessions", "Best-in-class battery life for college & travel", "High resale value & Apple Care support in India"],
    badge: "Top Recommendation"
  },
  {
    name: "Lenovo ThinkPad E14 Gen 5",
    tagline: "Unmatched Keyboard & Commercial Onsite Warranty in India",
    price: "₹64,990",
    image: "/top/top2.webp",
    specs: ["Intel Core i5-1335U", "16GB DDR5 (Upgradable)", "512GB NVMe SSD", "Thunderbolt 4"],
    score: "95% Match",
    reasons: ["Legendary tactile keyboard preferred by software engineers", "MIL-STD 810H military-grade build durability", "Widespread Lenovo onsite service center network in India"],
    badge: "Best for Coding"
  },
  {
    name: "ASUS Vivobook S 15 OLED",
    tagline: "Stunning 2.8K OLED Display for Creators & Multitaskers",
    price: "₹72,990",
    image: "/top/top3.webp",
    specs: ["Intel Core Evo i5-13500H", "16GB LPDDR5", "512GB Gen4 SSD", "120Hz OLED"],
    score: "92% Match",
    reasons: ["100% DCI-P3 color accuracy for video editing & design", "High performance H-series processor", "Sleek all-metal chassis with Harma Kardon speakers"],
    badge: "Best Display"
  },
  {
    name: "HP Victus / Pavilion Plus 14",
    tagline: "Balanced Power for Student Coding & Light Gaming",
    price: "₹58,990",
    image: "/top/top4.webp",
    specs: ["AMD Ryzen 5 7535HS", "RTX 2050 / 3050 4GB", "16GB RAM", "144Hz FHD"],
    score: "89% Match",
    reasons: ["Dedicated GPU for machine learning & casual gaming", "Pan-India HP home pickup & doorstep warranty", "Excellent price-to-performance ratio for Indian students"],
    badge: "Best Student Value"
  }
];

export default function FindLaptopPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dynamicSuggestions, setDynamicSuggestions] = useState<{ icon?: any; text: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initial fallback prompt cards tailored for Indian buyers
  const fallbackSuggestions = [
    { icon: <HelpCircle className="w-4 h-4 text-[#00A7B5]" />, text: "Best laptop for B.Tech CSE coding under ₹60,000" },
    { icon: <LinkIcon className="w-4 h-4 text-[#00A7B5]" />, text: "Lightweight student laptop with 10+ hr battery life" },
    { icon: <Mail className="w-4 h-4 text-[#00A7B5]" />, text: "Video editing & YouTube content creation laptop under ₹80,000" },
    { icon: <BarChart2 className="w-4 h-4 text-[#00A7B5]" />, text: "MacBook Air M2 vs Lenovo ThinkPad for software developers" },
    { icon: <FileText className="w-4 h-4 text-[#00A7B5]" />, text: "Gaming & ML laptop with RTX graphics under ₹75,000" },
    { icon: <Users className="w-4 h-4 text-[#00A7B5]" />, text: "Best business laptop with doorstep onsite warranty in India" },
  ];

  // Fetch dynamic suggestions from DB on mount
  useEffect(() => {
    async function loadDynamicSuggestions() {
      const res = await getDynamicSuggestionsAction();
      if (res && res.success && res.suggestions && res.suggestions.length > 0) {
        const icons = [
          <HelpCircle key="1" className="w-4 h-4 text-[#00A7B5]" />,
          <LinkIcon key="2" className="w-4 h-4 text-[#00A7B5]" />,
          <Mail key="3" className="w-4 h-4 text-[#00A7B5]" />,
          <BarChart2 key="4" className="w-4 h-4 text-[#00A7B5]" />,
          <FileText key="5" className="w-4 h-4 text-[#00A7B5]" />,
          <Users key="6" className="w-4 h-4 text-[#00A7B5]" />
        ];
        const formatted = res.suggestions.map((s: any, idx: number) => ({
          icon: icons[idx % icons.length],
          text: s.text
        }));
        setDynamicSuggestions(formatted);
      }
    }
    loadDynamicSuggestions();
  }, []);

  const activeSuggestions = dynamicSuggestions.length > 0 ? dynamicSuggestions : fallbackSuggestions;

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isCompleted]);

  // Start guided flow (triggered by user typing or clicking initial cards)
  const initiateFlowWithAnswer = (initialUserText?: string) => {
    setCurrentQuestionIndex(0);
    setIsCompleted(false);

    if (initialUserText) {
      // User started by clicking a card or typing custom input
      const initialMessages = [
        { role: "user", content: initialUserText },
        {
          role: "assistant",
          content: `Great! Let's narrow down the best option for "${initialUserText}".\n\nQuestion 1: ${GUIDED_QUESTIONS[0].question}`,
          options: GUIDED_QUESTIONS[0].options
        }
      ];
      setMessages(initialMessages);
    } else {
      setMessages([
        {
          role: "assistant",
          content: `Welcome to Klarone Laptop Guidance!\n\nQuestion 1: ${GUIDED_QUESTIONS[0].question}`,
          options: GUIDED_QUESTIONS[0].options
        }
      ]);
    }
  };

  // Submit answer (either by clicking a preset option pill above input or typing custom text)
  const handleAnswerSubmit = (userAnswerText: string) => {
    if (!userAnswerText.trim()) return;

    if (messages.length === 0) {
      initiateFlowWithAnswer(userAnswerText);
      setInput("");
      return;
    }

    if (isCompleted) return;

    const nextIndex = currentQuestionIndex + 1;
    const updatedMessages = [
      ...messages,
      { role: "user", content: userAnswerText }
    ];

    setMessages(updatedMessages);
    setInput("");

    if (nextIndex < GUIDED_QUESTIONS.length) {
      setCurrentQuestionIndex(nextIndex);
      setTimeout(() => {
        setMessages([
          ...updatedMessages,
          {
            role: "assistant",
            content: `Question ${nextIndex + 1}: ${GUIDED_QUESTIONS[nextIndex].question}`,
            options: GUIDED_QUESTIONS[nextIndex].options
          }
        ]);
      }, 500);
    } else {
      setIsCompleted(true);
      setTimeout(async () => {
        // Build natural language query from user answers
        const userSummary = updatedMessages
          .filter(m => m.role === "user")
          .map(m => m.content)
          .join(". ");

        // Call Klarone ML Model Recommendation Engine
        const mlRes = await getMLRecommendationsAction(userSummary);

        setMessages([
          ...updatedMessages,
          {
            role: "assistant",
            content: "Thank you! I've analyzed your requirements using Klarone's Machine Learning Recommendation Engine and selected the best laptop matches for your exact workflow.",
            isResultsCard: true,
            recommendations: mlRes.success && mlRes.recommendations.length > 0 ? mlRes.recommendations : undefined
          }
        ]);
      }, 700);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleAnswerSubmit(input);
  };

  const resetChat = () => {
    setMessages([]);
    setCurrentQuestionIndex(0);
    setIsCompleted(false);
    setInput("");
  };

  const currentOptions = !isCompleted && messages.length > 0
    ? GUIDED_QUESTIONS[currentQuestionIndex]?.options
    : null;

  return (
    <div className="flex h-screen bg-[#18181A] text-[#E0E0E0] overflow-hidden font-sans">

      {/* Sidebar (Exact original design) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-full border-r border-white/[0.08] bg-[#111111] flex flex-col shrink-0"
          >
            <div className="p-4 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <KlaroneIcon className="w-6 h-6 text-white" />
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="text-white/50 hover:text-white transition-colors">
                <PanelLeftClose className="w-5 h-5" />
              </button>
            </div>

            <div className="px-4 mt-2">
              <button
                onClick={resetChat}
                className="w-full py-2.5 rounded-full border border-white/[0.08] hover:bg-white/5 transition-colors text-[14px] text-white/90"
              >
                New Chat
              </button>
            </div>

            <div className="flex-1 mt-6 overflow-y-auto px-2">
              <div className="mb-4">
                <button onClick={resetChat} className="flex items-start gap-3 w-full p-2.5 rounded-lg hover:bg-white/5 transition-colors text-left group">
                  <MessageSquare className="w-4 h-4 shrink-0 text-white/40 mt-0.5 group-hover:text-white/70" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[13.5px] text-white/80 truncate">SSO for Pro plan?</span>
                    <span className="text-[11px] text-white/40 mt-0.5">2 min ago</span>
                  </div>
                </button>
                <button className="flex items-start gap-3 w-full p-2.5 rounded-lg hover:bg-white/5 transition-colors text-left group">
                  <BarChart2 className="w-4 h-4 shrink-0 text-white/40 mt-0.5 group-hover:text-white/70" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[13.5px] text-white/80 truncate">Weekly support report</span>
                    <span className="text-[11px] text-white/40 mt-0.5">1h ago</span>
                  </div>
                </button>
              </div>
            </div>

            {/* User Profile (Exact original UI) */}
            <div className="p-4 border-t border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[12px] font-medium text-white/70">
                  AK
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-medium text-white/90">Alex Carter</span>
                  <span className="text-[12px] text-white/50">Klarone Pro</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Header (Exact original UI) */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/[0.08] sticky top-0 z-10 bg-[#18181A]">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="text-white/50 hover:text-white transition-colors mr-2">
                <Menu className="w-5 h-5" />
              </button>
            )}
            <span className="text-[16px] font-medium text-white/90">Ask</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-white/50 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full border border-white/[0.08] flex items-center justify-center">
              <Menu className="w-4 h-4 text-white/70" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto flex flex-col relative pb-36">

          {messages.length === 0 ? (
            // Empty State (Tailored for Indian buyers)
            <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-4xl mx-auto w-full mt-[-8vh]">
              <h1 className="text-[32px] font-medium text-white mb-2">Find Your Ideal Laptop in India</h1>
              <p className="text-[15px] text-white/50 mb-10 text-center max-w-xl">Get unbiased, AI-driven recommendations based on your budget in ₹, degree/work requirements, and official Indian brand warranty.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-3xl">
                {activeSuggestions.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswerSubmit(item.text)}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-[#222224] border border-white/[0.05] hover:bg-white/[0.06] transition-all text-left group cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full bg-white/[0.05] flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <span className="text-[14px] text-white/70 group-hover:text-white/90 transition-colors">{item.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Chat Messages Thread
            <div className="max-w-3xl mx-auto w-full p-6 md:p-8 flex flex-col gap-8">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-1">
                      <KlaroneIcon className="w-4 h-4 text-[#00A7B5]" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] text-[15px] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-white/10 rounded-2xl px-5 py-3.5 text-white"
                        : "text-white/90 pt-1"
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.content}</div>

                    {/* Results Cards (Rendered when completed) */}
                    {msg.isResultsCard && (
                      <div className="mt-6 flex flex-col gap-4 w-full">
                        <div className="text-[12px] font-semibold text-white/40 uppercase tracking-wider">
                          Top Curated Recommendations
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(msg.recommendations && msg.recommendations.length > 0 ? msg.recommendations.map((r: any) => ({
                            name: r.model_name || r.name,
                            tagline: r.tagline || "Matched by Klarone AI Recommendation Engine",
                            price: typeof r.actual_price === 'number' ? `₹${r.actual_price.toLocaleString('en-IN')}` : (r.price || '₹60,000'),
                            score: typeof r.recommendation_score === 'number' ? `${r.recommendation_score}% Match` : (r.score || "94% Match"),
                            badge: r.badge || "Top Match",
                            image: typeof r.image === 'string' ? r.image : (r.image?.url || r.image?.src || (r.official_images && typeof r.official_images[0] === 'string' ? r.official_images[0] : r.official_images?.[0]?.url) || "/top/top1.webp"),
                            specs: r.specs || [`Gaming: ${r.gaming_score}/100`, `Student: ${r.student_score}/100`, `Business: ${r.business_score}/100`],
                            reasons: r.reasons || (r.reason ? [r.reason] : ["Matched for your workload"])
                          })) : SAMPLE_RECOMMENDATIONS).map((item: any, rIdx: number) => (
                            <div
                              key={rIdx}
                              className="rounded-2xl bg-[#1C1C1F] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between overflow-hidden shadow-xl group"
                            >
                              <div>
                                {/* Product Image & Header Badges */}
                                <div className="relative w-full h-44 bg-[#111113] overflow-hidden flex items-center justify-center p-4 border-b border-white/[0.06]">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                                  />
                                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#111113]/80 border border-white/15 backdrop-blur-md">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#00A7B5]"></span>
                                    <span className="text-[11px] font-medium text-white/90">{item.badge}</span>
                                  </div>
                                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-semibold backdrop-blur-md flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    {item.score}
                                  </div>
                                </div>

                                {/* Title, Rating & Pricing */}
                                <div className="p-4 pb-2">
                                  <div className="flex items-center gap-1 mb-1">
                                    {[...Array(5)].map((_, s) => (
                                      <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    ))}
                                    <span className="text-[11px] text-white/50 ml-1">(4.8/5 • Verified Reviews)</span>
                                  </div>

                                  <h3 className="text-[16.5px] font-semibold text-white group-hover:text-[#00A7B5] transition-colors leading-snug">{item.name}</h3>
                                  <p className="text-[12px] text-white/60 mt-0.5 line-clamp-1">{item.tagline}</p>

                                  <div className="mt-3 flex items-baseline justify-between border-t border-b border-white/[0.06] py-2.5">
                                    <div className="flex flex-col">
                                      <span className="text-[11px] text-white/40 uppercase tracking-wide">Expected Price</span>
                                      <span className="text-[18px] font-bold text-white tracking-tight">{item.price}</span>
                                    </div>
                                    <span className="text-[11.5px] text-emerald-400/90 font-medium">Official Warranty Incl.</span>
                                  </div>

                                  {/* Specs Badges */}
                                  <div className="mt-3 flex flex-wrap gap-1.5">
                                    {item.specs.map((spec: string, sIdx: number) => (
                                      <span key={sIdx} className="px-2.5 py-1 rounded-md bg-white/[0.06] text-white/80 text-[11.5px] font-medium border border-white/[0.05]">
                                        {spec}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Why Klarone Recommends + Trust CTAs */}
                              <div className="p-4 pt-2 flex flex-col gap-3">
                                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] flex flex-col gap-1.5">
                                  <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Klarone Analysis</span>
                                  <ul className="text-[12px] text-white/85 space-y-1">
                                    {item.reasons.slice(0, 2).map((r: string, reasonIdx: number) => (
                                      <li key={reasonIdx} className="flex items-center gap-1.5">
                                        <ShieldCheck className="w-3.5 h-3.5 text-[#00A7B5] shrink-0" />
                                        <span className="truncate">{r}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="flex items-center gap-2 pt-1">
                                  <button className="flex-1 py-2 rounded-xl bg-white text-black font-medium text-[13px] hover:bg-white/90 transition-all text-center">
                                    View Specifications
                                  </button>
                                  <button className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-[13px] font-medium transition-all">
                                    Compare
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-2">
                          <button
                            onClick={resetChat}
                            className="px-5 py-2 rounded-full border border-white/[0.08] hover:bg-white/5 text-[13px] text-white/80 transition-colors"
                          >
                            Start New Query
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Input Box Area (Exact original UI with pre-built option pills added cleanly above input) */}
        <div className="absolute bottom-8 w-full px-6">
          <div className="max-w-3xl mx-auto relative flex flex-col gap-2.5">

            {/* PRE-BUILT OPTION PILLS (Positioned cleanly directly above the input box) */}
            <AnimatePresence>
              {currentOptions && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex flex-wrap items-center gap-2 px-1"
                >
                  <span className="text-[12px] font-medium text-white/40 mr-1">Select Option:</span>
                  {currentOptions.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleAnswerSubmit(opt.value)}
                      className="px-3.5 py-1.5 rounded-full bg-[#2A2A2D] border border-white/10 hover:border-white/30 hover:bg-white/10 text-[13px] font-medium text-white/90 transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Original Input Box Container */}
            <form onSubmit={handleFormSubmit} className="relative flex flex-col bg-[#222224] rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden focus-within:border-white/20 transition-colors">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your requirements (e.g. B.Tech coding laptop under ₹65k with good battery)..."
                className="w-full bg-transparent px-5 pt-5 pb-12 text-[15px] text-white placeholder-white/30 focus:outline-none"
              />

              <div className="absolute bottom-3 left-4 flex items-center gap-3">
                <button type="button" className="text-white/30 hover:text-white/70 transition-colors"><Paperclip className="w-4 h-4" /></button>
                <button type="button" className="text-white/30 hover:text-white/70 transition-colors"><BarChart className="w-4 h-4" /></button>
                <button type="button" className="text-white/30 hover:text-white/70 transition-colors"><Zap className="w-4 h-4" /></button>
              </div>

              <div className="absolute bottom-3 right-4 flex items-center gap-2">
                <button type="button" className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/50 hover:text-white transition-colors">
                  <Mic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="flex items-center justify-center w-7 h-7 rounded-full bg-white text-black disabled:bg-white/20 disabled:text-white/40 transition-colors cursor-pointer"
                >
                  <ArrowUp className="w-4 h-4" strokeWidth={3} />
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
