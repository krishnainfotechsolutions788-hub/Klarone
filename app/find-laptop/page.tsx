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

// Guided Recommendation Questions Flow
const GUIDED_QUESTIONS = [
  {
    id: "primary_use",
    question: "What will be the primary use for your new laptop?",
    options: [
      { label: "Software Development & Coding", value: "Software Development & Coding" },
      { label: "College & Academic Work", value: "College & Academic Work" },
      { label: "Graphic Design & Video Editing", value: "Graphic Design & Video Editing" },
      { label: "Business & Management", value: "Business & Management" },
      { label: "Gaming & Heavy Rendering", value: "Gaming & Heavy Rendering" }
    ]
  },
  {
    id: "budget",
    question: "What is your target budget range?",
    options: [
      { label: "Under ₹50,000", value: "Under ₹50,000" },
      { label: "₹50,000 - ₹75,000", value: "₹50,000 - ₹75,000" },
      { label: "₹75,000 - ₹1,10,000", value: "₹75,000 - ₹1,10,000" },
      { label: "Above ₹1,10,000", value: "Above ₹1,10,000" }
    ]
  },
  {
    id: "priority",
    question: "Which feature matters most for your daily work?",
    options: [
      { label: "Long Battery Life & Portability", value: "Long Battery Life & Portability" },
      { label: "Maximum CPU & GPU Power", value: "Maximum CPU & GPU Power" },
      { label: "Color Accurate High-Res Display", value: "Color Accurate High-Res Display" },
      { label: "Durable Build & Keyboard Quality", value: "Durable Build & Keyboard Quality" }
    ]
  },
  {
    id: "os_preference",
    question: "Do you have an Operating System preference?",
    options: [
      { label: "macOS (Apple Silicon)", value: "macOS" },
      { label: "Windows 11", value: "Windows 11" },
      { label: "Linux Compatible", value: "Linux Compatible" },
      { label: "Best Value (Any OS)", value: "Best Value (Any OS)" }
    ]
  }
];

// Sample Curated Recommendations with Images
const SAMPLE_RECOMMENDATIONS = [
  {
    name: "MacBook Air M3",
    tagline: "Best overall for Developers & Creative Professionals",
    price: "₹1,04,900",
    image: "/top/top1.webp",
    specs: ["Apple M3 8-Core", "16GB Unified RAM", "512GB SSD", "18 Hr Battery"],
    score: "98% Match",
    reasons: ["Extremely quiet fanless design", "Industry leading battery stamina", "Retina color accuracy"],
    badge: "Top Recommendation"
  },
  {
    name: "ThinkPad E14 Gen 5",
    tagline: "Unmatched Keyboard & Commercial Durability",
    price: "₹74,500",
    image: "/top/top2.webp",
    specs: ["Intel Core i7-1355U", "16GB DDR5", "512GB NVMe", "Thunderbolt 4"],
    score: "94% Match",
    reasons: ["Best tactile keyboard for coding", "MIL-STD 810H durability", "Easy RAM upgradeability"],
    badge: "Best Reliability"
  },
  {
    name: "ASUS ROG Zephyrus G14",
    tagline: "Compact Powerhouse for Gaming & Heavy Workloads",
    price: "₹1,18,900",
    image: "/top/top3.webp",
    specs: ["AMD Ryzen 9 8945HS", "RTX 4060 8GB", "16GB RAM", "OLED 120Hz"],
    score: "91% Match",
    reasons: ["Stunning OLED panel", "Ultra-portable gaming chassis", "Vapor chamber cooling"],
    badge: "Highest Performance"
  },
  {
    name: "Dell XPS 13 9340",
    tagline: "Sleek Ultraportable for Professionals",
    price: "₹1,09,900",
    image: "/top/top4.webp",
    specs: ["Intel Core Ultra 7", "16GB LPDDR5X", "512GB SSD", "FHD+ InfinityEdge"],
    score: "89% Match",
    reasons: ["Ultra-thin aluminum chassis", "Gorilla Glass touchpad", "Vibrant InfinityEdge display"],
    badge: "Premium Design"
  }
];

export default function FindLaptopPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initial prompt cards (Exact original layout maintained)
  const suggestions = [
    { icon: <HelpCircle className="w-4 h-4 text-white/50" />, text: "Gaming laptop under $1000" },
    { icon: <LinkIcon className="w-4 h-4 text-white/50" />, text: "Best laptop for programming" },
    { icon: <Mail className="w-4 h-4 text-white/50" />, text: "Lightweight student laptop" },
    { icon: <BarChart2 className="w-4 h-4 text-white/50" />, text: "Video editing powerhouse" },
    { icon: <FileText className="w-4 h-4 text-white/50" />, text: "Compare Mac and Windows" },
    { icon: <Users className="w-4 h-4 text-white/50" />, text: "Longest battery life" },
  ];

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
      setTimeout(() => {
        setMessages([
          ...updatedMessages,
          {
            role: "assistant",
            content: "Thank you! I've analyzed your requirements and calculated personalized laptop recommendations for your exact workflow.",
            isResultsCard: true
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
            // Empty State (Exact original UI restored)
            <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-4xl mx-auto w-full mt-[-8vh]">
              <h1 className="text-[32px] font-medium text-white mb-2">What do you want to do?</h1>
              <p className="text-[15px] text-white/50 mb-10">Ask anything and I'll handle the busywork.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-3xl">
                {suggestions.map((item, i) => (
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
                          {SAMPLE_RECOMMENDATIONS.map((item, rIdx) => (
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
                                    {item.specs.map((spec, sIdx) => (
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
                                    {item.reasons.slice(0, 2).map((r, reasonIdx) => (
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
                placeholder="Ask anything. Type @ for mentions and / for shortcuts."
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
