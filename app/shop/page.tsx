"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/shared/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ChevronDown,
  X,
  Plus,
  Minus,
  Check,
  Search,
  Laptop,
  Heart,
  ShoppingCart,
  Star,
  SlidersHorizontal,
  Sparkles
} from "lucide-react";
import { useStore } from "@/lib/store";

// Constants
const PURPOSES = ["Student", "Programming", "Office Work", "Gaming", "Graphic Design", "Video Editing", "Business", "Content Creation", "Architecture / CAD", "AI / Data Science"];
const BUDGETS = ["Under ₹30K", "₹30K–₹50K", "₹50K–₹75K", "₹75K–₹1L", "Above ₹1L"];
const PERFORMANCES = ["Basic", "Everyday", "Fast", "Professional", "Extreme"];
const CONDITIONS = ["New", "Refurbished", "Open Box"];

// Unified Page & Element Entrance Variants (matching design.md Rule #7)
const pageContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemUpVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.215, 0.61, 0.355, 1] as const,
    },
  },
};

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const DarkFilterGroup = ({ title, options, selected, toggleFn, isOpen, onToggleGroup }: any) => {
  const [showAll, setShowAll] = useState(false);
  const visibleOptions = showAll ? options : options.slice(0, 6);
  const hasMore = options.length > 6;

  if (options.length === 0) return null;

  return (
    <div className="border-b border-white/10 last:border-0 py-4">
      <button onClick={onToggleGroup} className="flex items-center justify-between w-full text-left group">
        <span className="text-[12px] font-medium tracking-wider text-white/90 uppercase">{title}</span>
        {isOpen ? (
          <Minus className="w-3.5 h-3.5 text-white/50 group-hover:text-white transition-colors" />
        ) : (
          <Plus className="w-3.5 h-3.5 text-white/50 group-hover:text-white transition-colors" />
        )}
      </button>

      {isOpen && (
        <div className="mt-3.5 flex flex-col gap-2.5">
          {visibleOptions.map((opt: any, oIdx: number) => {
            const isChecked = selected.includes(opt.label);
            return (
              <label key={oIdx} className="flex items-center gap-3 cursor-pointer group select-none">
                <input type="checkbox" className="hidden" checked={isChecked} onChange={() => toggleFn(opt.label)} />
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isChecked ? 'bg-white border-white text-black' : 'border-white/20 bg-white/5 group-hover:border-white/40'
                  }`}>
                  {isChecked && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
                </div>
                <span className={`text-[13.5px] flex-1 transition-colors ${isChecked ? 'font-medium text-white' : 'text-white/60 group-hover:text-white/80'}`}>{opt.label}</span>
                {opt.count !== undefined && <span className="text-[12px] text-white/40">{opt.count}</span>}
              </label>
            );
          })}
          {hasMore && (
            <button onClick={() => setShowAll(!showAll)} className="mt-1 text-[12px] font-medium text-[#00A7B5] hover:underline self-start">
              {showAll ? '- Show Less' : `+ Show ${options.length - 6} More`}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default function ShopPage() {
  const router = useRouter();
  const [isAiSlideOpen, setAiSlideOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cart & Wishlist State
  const { cart, wishlist, toggleCart, toggleWishlist, compareList, toggleCompare, clearCompare } = useStore();

  // Compare Mode State
  const [isCompareMode, setIsCompareMode] = useState(compareList.length > 0);

  // Filter States
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedProcessors, setSelectedProcessors] = useState<string[]>([]);
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [selectedBudgets, setSelectedBudgets] = useState<string[]>([]);
  const [selectedPerformances, setSelectedPerformances] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [draftSearchInput, setDraftSearchInput] = useState('');

  // Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // UI State - All filters collapsed by default
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({
    "PURPOSE": false,
    "BUDGET": false,
    "BRAND": false,
    "PERFORMANCE": false,
    "CONDITION": false,
    "ADVANCED": false
  });

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
    setProducts([]);
    setHasMore(true);
  }, [selectedBrands, selectedProcessors, selectedPurposes, selectedBudgets, selectedPerformances, selectedConditions, searchQuery]);

  useEffect(() => {
    async function loadProducts() {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        const res = await fetch('/api/shop/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            selectedBrands,
            selectedProcessors,
            selectedPurposes,
            selectedBudgets,
            selectedPerformances,
            selectedConditions,
            searchQuery,
            page,
            limit: 20
          })
        });

        if (res.ok) {
          const { data, hasMore: more } = await res.json();
          setProducts(prev => page === 1 ? (data || []) : [...prev, ...(data || [])]);
          setHasMore(more);
        } else {
          console.error("Error fetching products:", await res.text());
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
      setLoading(false);
      setLoadingMore(false);
    }
    loadProducts();
  }, [selectedBrands, selectedProcessors, selectedPurposes, selectedBudgets, selectedPerformances, selectedConditions, searchQuery, page]);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    }, { threshold: 0.1 });

    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  const toggleFilter = (name: string) => {
    setOpenFilters(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const toggleArrayItem = (setter: any, item: string) => {
    setter((prev: string[]) => prev.includes(item) ? prev.filter((i: string) => i !== item) : [...prev, item]);
  };

  const handleAddToCart = (e: React.MouseEvent, variantId: string) => {
    e.preventDefault();
    if (variantId) toggleCart(variantId);
  };

  const handleToggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    toggleWishlist(productId);
  };

  const handleToggleCompare = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    if (!compareList.includes(productId) && compareList.length >= 4) {
      alert("You can only compare up to 4 items.");
      return;
    }
    toggleCompare(productId);
  };

  // Derived Options & Search Results
  const { filteredProducts, brandOptions, processorOptions, searchResults, selectedCompareProducts } = useMemo(() => {
    const filtered = products;

    // Brand Options
    const bMap = new Map();
    products.forEach(p => {
      const bName = p.kc_brands?.name;
      if (bName) bMap.set(bName, (bMap.get(bName) || 0) + 1);
    });
    selectedBrands.forEach(b => { if (!bMap.has(b)) bMap.set(b, 0); });
    const bOptions = Array.from(bMap.entries()).map(([label, count]) => ({
      label, count, checked: selectedBrands.includes(label)
    })).sort((a, b) => a.label.localeCompare(b.label));

    // Processor Options
    const pMap = new Map();
    products.forEach(p => {
      const productProcessors = new Set<string>();
      p.kc_variants?.forEach((v: any) => {
        if (v.cpu) productProcessors.add(v.cpu);
      });
      productProcessors.forEach(cpu => {
        pMap.set(cpu, (pMap.get(cpu) || 0) + 1);
      });
    });
    selectedProcessors.forEach(p => { if (!pMap.has(p)) pMap.set(p, 0); });
    const pOptions = Array.from(pMap.entries()).map(([label, count]) => ({
      label, count, checked: selectedProcessors.includes(label)
    })).sort((a, b) => a.label.localeCompare(b.label));

    const compareData = compareList.map(id => products.find(p => p.id === id)).filter(Boolean);

    return { filteredProducts: filtered, brandOptions: bOptions, processorOptions: pOptions, searchResults: products, selectedCompareProducts: compareData };
  }, [products, selectedBrands, selectedProcessors, compareList]);

  return (
    <div className="relative flex min-h-screen flex-col bg-[#000000] text-white font-sans overflow-x-hidden">
      <main className="flex-1 mt-32 sm:mt-36 pb-32">
        <motion.div
          variants={pageContainerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-[1400px] px-6 lg:px-12"
        >

          {/* Hero Header Banner with Smooth Entrance */}
          <motion.div
            variants={itemUpVariants}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10 mb-8 pt-2"
          >
            <div>
              <h1 className="text-[32px] sm:text-[40px] font-medium tracking-tight text-white">
                Discover Verified Laptops
              </h1>
              <p className="text-[14.5px] text-white/60 mt-1 max-w-xl">
                Browse our expert-curated catalog filtered by your exact performance demands and budget.
              </p>
            </div>

            {/* Sleek Minimal Search Trigger Pill */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setAiSlideOpen(true)}
              className="w-full md:w-64 px-4 py-2.5 rounded-full bg-[#18181A] border border-white/10 hover:border-white/20 text-white/50 text-[13.5px] flex items-center gap-2.5 transition-all duration-200 shadow-sm cursor-pointer"
            >
              <Search className="w-4 h-4 text-white/40" />
              <span className="text-white/40">Search...</span>
            </motion.button>
          </motion.div>

          {/* Active Filters Bar */}
          <motion.div variants={itemUpVariants} className="sticky top-20 z-30 bg-[#000000]/90 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-white/10 mb-10 gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[14px] font-medium text-white/70">
                <strong className="text-white">{filteredProducts.length}</strong> devices available
              </span>

              {(selectedBrands.length > 0 || selectedProcessors.length > 0 || selectedPurposes.length > 0 || selectedBudgets.length > 0) && (
                <div className="flex flex-wrap items-center gap-2 ml-2">

                  {selectedBrands.map((brand) => (
                    <button key={brand} onClick={() => toggleArrayItem(setSelectedBrands, brand)} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1A1E] border border-white/15 text-[12px] font-medium text-white hover:border-white/30 transition-colors">
                      {brand}
                      <X className="w-3 h-3 text-white/50" />
                    </button>
                  ))}

                  {selectedPurposes.map((p) => (
                    <button key={p} onClick={() => toggleArrayItem(setSelectedPurposes, p)} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1A1E] border border-white/15 text-[12px] font-medium text-white hover:border-white/30 transition-colors">
                      {p}
                      <X className="w-3 h-3 text-white/50" />
                    </button>
                  ))}

                  {selectedBudgets.map((b) => (
                    <button key={b} onClick={() => toggleArrayItem(setSelectedBudgets, b)} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1A1E] border border-white/15 text-[12px] font-medium text-white hover:border-white/30 transition-colors">
                      {b}
                      <X className="w-3 h-3 text-white/50" />
                    </button>
                  ))}

                  <button onClick={() => {
                    setSelectedBrands([]);
                    setSelectedProcessors([]);
                    setSelectedPurposes([]);
                    setSelectedBudgets([]);
                  }} className="text-[12px] ml-2 font-medium text-[#00A7B5] hover:underline cursor-pointer">
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Controls Right */}
            <div className="flex items-center gap-5 shrink-0">
              {/* Compare Toggle */}
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-[13px] font-medium text-white/80 cursor-pointer select-none">
                  <div className={`w-8 h-4 rounded-full transition-colors relative ${isCompareMode ? 'bg-[#00A7B5]' : 'bg-white/20'}`} onClick={() => setIsCompareMode(!isCompareMode)}>
                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${isCompareMode ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                  Compare
                </label>
              </div>

              {/* <div className="w-px h-4 bg-white/15 hidden sm:block"></div> */}

              {/* <div className="flex items-center gap-2">
                <span className="text-[13px] text-white/50">Sort:</span>
                <button className="flex items-center gap-1 text-[13px] font-medium text-white hover:text-[#00A7B5] transition-colors cursor-pointer">
                  Newest First
                  <ChevronDown className="w-3.5 h-3.5 text-white/50" />
                </button>
              </div> */}
            </div>
          </motion.div>

          <motion.div variants={itemUpVariants} className="flex flex-col lg:flex-row gap-10">

            {/* Left Sidebar Filters Container */}
            <div className="w-full lg:w-[260px] shrink-0 rounded-2xl h-fit self-start">

              <div className="flex items-center gap-2 pb-4 mb-2 border-b border-white/10">
                <SlidersHorizontal className="w-4 h-4 text-[#00A7B5]" />
                <h3 className="text-[14px] font-medium text-white tracking-tight">Refine Catalog</h3>
              </div>

              {/* Primary Filters */}
              <DarkFilterGroup
                title="Purpose"
                options={PURPOSES.map(p => ({ label: p }))}
                selected={selectedPurposes}
                toggleFn={(val: string) => toggleArrayItem(setSelectedPurposes, val)}
                isOpen={openFilters["PURPOSE"]}
                onToggleGroup={() => toggleFilter("PURPOSE")}
              />

              <DarkFilterGroup
                title="Budget"
                options={BUDGETS.map(b => ({ label: b }))}
                selected={selectedBudgets}
                toggleFn={(val: string) => toggleArrayItem(setSelectedBudgets, val)}
                isOpen={openFilters["BUDGET"]}
                onToggleGroup={() => toggleFilter("BUDGET")}
              />

              <DarkFilterGroup
                title="Brand"
                options={brandOptions}
                selected={selectedBrands}
                toggleFn={(val: string) => toggleArrayItem(setSelectedBrands, val)}
                isOpen={openFilters["BRAND"]}
                onToggleGroup={() => toggleFilter("BRAND")}
              />

              <DarkFilterGroup
                title="Performance Level"
                options={PERFORMANCES.map(p => ({ label: p }))}
                selected={selectedPerformances}
                toggleFn={(val: string) => toggleArrayItem(setSelectedPerformances, val)}
                isOpen={openFilters["PERFORMANCE"]}
                onToggleGroup={() => toggleFilter("PERFORMANCE")}
              />

              <DarkFilterGroup
                title="Condition"
                options={CONDITIONS.map(c => ({ label: c }))}
                selected={selectedConditions}
                toggleFn={(val: string) => toggleArrayItem(setSelectedConditions, val)}
                isOpen={openFilters["CONDITION"]}
                onToggleGroup={() => toggleFilter("CONDITION")}
              />

              {/* Advanced Filters */}
              <div className="pt-4 mt-2">
                <button
                  onClick={() => toggleFilter("ADVANCED")}
                  className="flex items-center justify-between w-full text-left group cursor-pointer"
                >
                  <span className="text-[13px] font-medium text-[#00A7B5]">Advanced Specs</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#00A7B5] transition-transform ${openFilters["ADVANCED"] ? "rotate-180" : ""}`} />
                </button>

                {openFilters["ADVANCED"] && (
                  <div className="mt-3 pl-2 border-l border-white/10 ml-1">
                    <DarkFilterGroup
                      title="Processor"
                      options={processorOptions}
                      selected={selectedProcessors}
                      toggleFn={(val: string) => toggleArrayItem(setSelectedProcessors, val)}
                      isOpen={true}
                      onToggleGroup={() => { }}
                    />
                  </div>
                )}
              </div>

            </div>

            {/* Right Product Grid (2 columns md, 3 columns xl) with Staggered Entrance */}
            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="p-1 rounded-2xl bg-[#141416] border border-white/10 flex flex-col justify-between animate-pulse">
                      <div className="aspect-[16/12] bg-[#0A0A0C] rounded-xl border border-white/5" />
                      <div className="p-5 flex flex-col gap-4">
                        <div className="h-4 bg-white/10 rounded-md w-3/4" />
                        <div className="h-3 bg-white/5 rounded-md w-1/2" />
                        <div className="flex justify-between items-center pt-2">
                          <div className="h-3 bg-white/5 rounded-md w-1/3" />
                          <div className="h-4 bg-white/10 rounded-md w-1/4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 flex flex-col items-center justify-center text-white/50 text-[14px]"
                >
                  <p>No laptops match your selected criteria.</p>
                </motion.div>
              ) : (
                <motion.div
                  variants={gridContainerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 content-start"
                >
                  {filteredProducts.map((product) => {
                    const variants = product.kc_variants || [];

                    let allPrices: number[] = [];
                    variants.forEach((v: any) => {
                      if (v.inventory_items) {
                        v.inventory_items.forEach((item: any) => {
                          if (item.selling_price) allPrices.push(item.selling_price);
                        });
                      }
                    });

                    let minPrice = allPrices.length > 0 ? Math.min(...allPrices) : product.msrp || 0;
                    if (minPrice === 0) {
                      const charCode = product.id.charCodeAt(0) || 0;
                      minPrice = 38000 + (charCode % 5) * 8000;
                    }

                    const images = product.official_images || [];
                    const primaryImage = images.find((i: any) => i.is_primary) || images[0];

                    const brandName = product.kc_brands?.name || '';
                    const seriesName = product.series || '';
                    const modelName = product.model || '';

                    return (
                      <motion.div key={product.id} variants={itemUpVariants}>
                        <Link href={`/shop/${product.id}`} className="group flex flex-col p-1 rounded-2xl bg-[#141416] border border-white/10 hover:border-white/20 hover:bg-[#18181C] transition-all duration-300 shadow-xl overflow-hidden justify-between h-full">

                          {/* Top Image Container - Full Bleed object-cover with balanced dark overlay vignette */}
                          <div className="relative aspect-[16/12] bg-[#08080A] p-0 flex items-center justify-center overflow-hidden border-b border-white/[0.08] rounded-xl group">
                            {primaryImage ? (
                              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                                <img
                                  src={primaryImage.url || primaryImage}
                                  alt={modelName}
                                  className="w-full h-full object-cover brightness-[0.94] group-hover:scale-105 transition-transform duration-500 ease-out"
                                />
                                {/* Balanced Dark Overlay Vignette Layer */}
                                <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/60 mix-blend-multiply opacity-60 pointer-events-none" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#141416]/70 via-transparent to-transparent pointer-events-none" />
                              </div>
                            ) : (
                              <Laptop className="w-16 h-16 text-white/20 group-hover:scale-105 transition-transform duration-500 ease-out" />
                            )}

                            {/* Top Badges & Compare/Wishlist Actions */}
                            {isCompareMode ? (
                              <div className="absolute top-3 right-3 z-10">
                                <button
                                  onClick={(e) => handleToggleCompare(e, product.id)}
                                  className="bg-[#141416]/90 backdrop-blur-md shadow-md flex items-center gap-1.5 cursor-pointer border border-white/20 hover:bg-[#1C1C20] transition-colors rounded-full px-2.5 py-1"
                                >
                                  <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${compareList.includes(product.id) ? 'bg-white border-white text-black' : 'border-white/40 bg-transparent'}`}>
                                    {compareList.includes(product.id) && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
                                  </div>
                                  <span className="text-[11.5px] font-medium text-white">Compare</span>
                                </button>
                              </div>
                            ) : (
                              <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                                <button
                                  onClick={(e) => handleToggleWishlist(e, product.id)}
                                  className="p-1.5 bg-[#141416]/80 backdrop-blur-md rounded-full border border-white/15 hover:border-white/30 transition-colors cursor-pointer"
                                  aria-label="Add to Wishlist"
                                >
                                  <Heart className={`w-3.5 h-3.5 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-white/70'}`} />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Single Content Box with p-5 (padding of 5 / 20px on all sides) containing Details & Metalines */}
                          <div className="p-5 flex flex-col flex-1 justify-between gap-6">

                            {/* Title */}
                            <h3 className="font-normal text-[15px] sm:text-[16px] leading-[1.35] text-white/90 group-hover:text-white transition-colors line-clamp-2">
                              {(() => {
                                const fullTitle = `${brandName} ${seriesName} ${modelName}`.trim();
                                const words = fullTitle.split(" ");
                                const uniqueWords: string[] = [];
                                words.forEach(w => {
                                  if (uniqueWords.length === 0 || uniqueWords[uniqueWords.length - 1].toLowerCase() !== w.toLowerCase()) {
                                    uniqueWords.push(w);
                                  }
                                });
                                return uniqueWords.join(" ");
                              })()}
                            </h3>

                            {/* Bottom Metalines */}
                            <div className="flex items-center justify-between text-[12.5px] text-white/40 font-normal tracking-wide">
                              <span className="truncate max-w-[140px]">
                                {seriesName || brandName || "Laptop"}
                              </span>
                              <span className="font-medium text-white/80">
                                ₹{minPrice.toLocaleString()}
                              </span>
                            </div>

                          </div>

                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {/* Infinite Scroll Loader Target */}
              {hasMore && (
                <div ref={lastElementRef} className="col-span-full py-8 flex items-center justify-center">
                  {loadingMore && <span className="text-white/50 text-[13px]">Loading more devices...</span>}
                </div>
              )}
            </div>

          </motion.div>

        </motion.div>
      </main>

      <Footer />

      {/* Floating Compare Button */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => router.push(`/compare?ids=${compareList.join(',')}`)}
            className="bg-white text-black h-12 px-6 rounded-full text-[13px] font-semibold shadow-2xl flex items-center gap-3 hover:bg-white/90 transition-all cursor-pointer"
          >
            <span>Compare ({compareList.length})</span>
            <span className="w-2 h-2 rounded-full bg-[#00A7B5]"></span>
          </button>
        </div>
      )}

      {/* Smart Search Modal - Matching Target Reference UI */}
      <Dialog open={isAiSlideOpen} onOpenChange={(open) => {
        setAiSlideOpen(open);
        if (!open) setDraftSearchInput('');
      }}>
        <DialogContent className="bg-[#141416] border border-white/10 text-white sm:max-w-xl p-0 rounded-2xl shadow-2xl overflow-hidden [&>button]:hidden">

          {/* Top Search Input Header Line */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (draftSearchInput.trim()) {
                setSearchQuery(draftSearchInput.trim());
                setAiSlideOpen(false);
              }
            }}
            className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-[#141416]"
          >
            <Search className="w-4 h-4 text-white/50 shrink-0" />
            <input
              type="text"
              value={draftSearchInput}
              onChange={(e) => setDraftSearchInput(e.target.value)}
              placeholder="Search for laptops, brands, specs, budget..."
              className="flex-1 bg-transparent border-none outline-none text-[15px] text-white placeholder:text-white/40 font-normal"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setAiSlideOpen(false)}
              className="p-1 text-white/50 hover:text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </form>

          {/* Modal Body Container */}
          <div className="p-5 flex flex-col gap-6 max-h-[60vh] overflow-y-auto no-scrollbar">

            {/* When Input is Empty: Show Quick Categories */}
            {draftSearchInput.trim().length === 0 ? (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-3">
                  <span className="text-[13.5px] font-normal text-white/50">I'm looking for...</span>
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { label: "Gaming", icon: Laptop },
                      { label: "Student", icon: Sparkles },
                      { label: "MacBook", icon: Check },
                      { label: "Core i7", icon: SlidersHorizontal },
                    ].map((cat, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setDraftSearchInput(cat.label);
                        }}
                        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C1C20] hover:bg-[#242428] border border-white/10 text-[13px] font-normal text-white/80 hover:text-white transition-all cursor-pointer"
                      >
                        <cat.icon className="w-3.5 h-3.5 text-white/50" />
                        <span>{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Featured Products */}
                <div className="flex flex-col gap-3 pt-2 border-t border-white/10">
                  <span className="text-[13.5px] font-medium text-white/70">Popular Devices</span>
                  <div className="flex flex-col gap-2">
                    {products.slice(0, 3).map((p) => {
                      const primaryImage = (p.official_images || []).find((i: any) => i.is_primary) || (p.official_images || [])[0];
                      const fullTitle = `${p.kc_brands?.name || ''} ${p.series || ''} ${p.model || ''}`.trim();
                      const words = fullTitle.split(" ");
                      const cleanTitle = words.filter((w, i) => words.indexOf(w) === i).join(" ");

                      let minPrice = p.msrp || 45000;
                      return (
                        <Link
                          key={p.id}
                          href={`/shop/${p.id}`}
                          onClick={() => setAiSlideOpen(false)}
                          className="flex items-center justify-between p-2.5 px-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-lg bg-[#0A0A0C] border border-white/10 flex items-center justify-center p-1 shrink-0">
                              {primaryImage ? (
                                <img src={primaryImage.url || primaryImage} alt={p.model} className="w-full h-full object-contain" />
                              ) : (
                                <Laptop className="w-4 h-4 text-white/40" />
                              )}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[14px] font-normal text-white/90 group-hover:text-white truncate">
                                {cleanTitle}
                              </span>
                              <span className="text-[12px] text-white/40 truncate">
                                {p.cpu || p.series || "Verified Laptop"}
                              </span>
                            </div>
                          </div>

                          <span className="text-[13px] font-medium text-white/80 shrink-0 ml-3">
                            ₹{minPrice.toLocaleString()}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* When User is Typing: Show Search Suggestions FIRST, followed by Matching Real Products */
              (() => {
                const query = draftSearchInput.toLowerCase().trim();

                // Related Search Suggestions
                const searchSuggestions = [
                  `Best ${draftSearchInput.trim()} laptops`,
                  `${draftSearchInput.trim()} laptops under ₹50,000`,
                  `High performance ${draftSearchInput.trim()} setup`,
                  `${draftSearchInput.trim()} laptops with long battery life`,
                ];

                // Real Matching Products
                const matchedProducts = products.filter(p => {
                  const title = `${p.kc_brands?.name || ''} ${p.series || ''} ${p.model || ''} ${p.cpu || ''}`.toLowerCase();
                  return title.includes(query);
                }).slice(0, 4);

                return (
                  <div className="flex flex-col gap-6">

                    {/* SECTION 1: Related Search Suggestions */}
                    <div className="flex flex-col gap-2.5">
                      <span className="text-[12px] font-semibold text-white/40 uppercase tracking-wider px-1">Search Suggestions</span>
                      <div className="flex flex-col gap-1.5">
                        {searchSuggestions.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => {
                              setSearchQuery(sug);
                              setDraftSearchInput(sug);
                              setAiSlideOpen(false);
                            }}
                            className="flex items-center gap-3 p-2.5 px-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-left text-[13.5px] text-white/85 hover:text-white transition-all cursor-pointer group"
                          >
                            <Search className="w-3.5 h-3.5 text-[#00A7B5] group-hover:scale-110 transition-transform shrink-0" />
                            <span className="flex-1 font-normal truncate">{sug}</span>
                            <span className="text-[11px] text-white/30 font-mono shrink-0">Press ↵</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* SECTION 2: Real Products Related to Search */}
                    <div className="flex flex-col gap-2.5 pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[12px] font-semibold text-white/40 uppercase tracking-wider">Matching Products</span>
                        <span className="text-[12px] font-medium text-white/40">{matchedProducts.length} devices</span>
                      </div>

                      {matchedProducts.length === 0 ? (
                        <div className="py-4 px-1 text-[13px] text-white/40 font-normal">
                          No devices directly match "{draftSearchInput}". Press Enter to perform extended search.
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1.5">
                          {matchedProducts.map((p) => {
                            const primaryImage = (p.official_images || []).find((i: any) => i.is_primary) || (p.official_images || [])[0];
                            const fullTitle = `${p.kc_brands?.name || ''} ${p.series || ''} ${p.model || ''}`.trim();
                            const words = fullTitle.split(" ");
                            const cleanTitle = words.filter((w, i) => words.indexOf(w) === i).join(" ");

                            let allPrices: number[] = [];
                            (p.kc_variants || []).forEach((v: any) => {
                              if (v.inventory_items) {
                                v.inventory_items.forEach((item: any) => {
                                  if (item.selling_price) allPrices.push(item.selling_price);
                                });
                              }
                            });
                            let minPrice = allPrices.length > 0 ? Math.min(...allPrices) : p.msrp || 0;
                            if (minPrice === 0) {
                              const charCode = p.id.charCodeAt(0) || 0;
                              minPrice = 38000 + (charCode % 5) * 8000;
                            }

                            return (
                              <Link
                                key={p.id}
                                href={`/shop/${p.id}`}
                                onClick={() => setAiSlideOpen(false)}
                                className="flex items-center justify-between p-2 px-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] text-left transition-all group cursor-pointer gap-4"
                              >
                                <div className="flex items-center gap-2.5 min-w-0 max-w-[280px] sm:max-w-[340px]">
                                  <div className="w-7 h-7 rounded-md bg-[#0A0A0C] border border-white/10 flex items-center justify-center p-0.5 shrink-0">
                                    {primaryImage ? (
                                      <img src={primaryImage.url || primaryImage} alt={p.model} className="w-full h-full object-contain" />
                                    ) : (
                                      <Laptop className="w-3.5 h-3.5 text-white/40" />
                                    )}
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-[12.5px] sm:text-[13px] font-normal text-white/85 group-hover:text-white truncate leading-snug">
                                      {cleanTitle}
                                    </span>
                                    <span className="text-[11px] text-white/40 truncate">
                                      {p.cpu || p.series || "Verified Laptop"}
                                    </span>
                                  </div>
                                </div>

                                <span className="text-[12.5px] font-medium text-white/80 shrink-0">
                                  ₹{minPrice.toLocaleString()}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>
                );
              })()
            )}

          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
