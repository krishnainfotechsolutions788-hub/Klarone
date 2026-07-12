"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/shared/Footer";
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
  Star
} from "lucide-react";
import { useStore } from '@/lib/store';

// Constants
const PURPOSES = ["Student", "Programming", "Office Work", "Gaming", "Graphic Design", "Video Editing", "Business", "Content Creation", "Architecture / CAD", "AI / Data Science"];
const BUDGETS = ["Under ₹30K", "₹30K–₹50K", "₹50K–₹75K", "₹75K–₹1L", "Above ₹1L"];
const PERFORMANCES = ["Basic", "Everyday", "Fast", "Professional", "Extreme"];
const CONDITIONS = ["New", "Refurbished", "Open Box"];

const FilterGroup = ({ title, options, selected, toggleFn, isOpen, onToggleGroup }: any) => {
  const [showAll, setShowAll] = useState(false);
  const visibleOptions = showAll ? options : options.slice(0, 6);
  const hasMore = options.length > 6;
  
  if (options.length === 0) return null;
  
  return (
    <div className="border-b border-gray-100 last:border-0 py-5">
      <button onClick={onToggleGroup} className="flex items-center justify-between w-full text-left group">
        <span className="text-[13px] font-semibold tracking-wide text-[#181d26] uppercase">{title}</span>
        {isOpen ? (
          <Minus className="w-4 h-4 text-gray-400 group-hover:text-[#181d26] transition-colors" />
        ) : (
          <Plus className="w-4 h-4 text-gray-400 group-hover:text-[#181d26] transition-colors" />
        )}
      </button>

      {isOpen && (
        <div className="mt-4 flex flex-col gap-3">
          {visibleOptions.map((opt: any, oIdx: number) => {
            const isChecked = selected.includes(opt.label);
            return (
              <label key={oIdx} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="hidden" checked={isChecked} onChange={() => toggleFn(opt.label)} />
                <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${isChecked ? 'bg-[#181d26] border-[#181d26]' : 'border-gray-300 group-hover:border-gray-400'}`}>
                  {isChecked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>
                <span className={`text-[14px] flex-1 ${isChecked ? 'font-medium text-[#181d26]' : 'text-gray-600'}`}>{opt.label}</span>
                {opt.count !== undefined && <span className="text-[13px] text-gray-400">{opt.count}</span>}
              </label>
            )
          })}
          {hasMore && (
             <button onClick={() => setShowAll(!showAll)} className="mt-1 text-[13px] font-medium text-[#00A7B5] hover:underline self-start">
               {showAll ? '- Show Less' : `+ Show ${options.length - 6} More`}
             </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function CatalogPage() {
  const router = useRouter();
  const [isAiSlideOpen, setAiSlideOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Cart & Wishlist State
  const { cart, wishlist, toggleCart, toggleWishlist, compareList, toggleCompare, clearCompare } = useStore();

  // Compare State
  // Compare State
  const [isCompareMode, setIsCompareMode] = useState(compareList.length > 0);

  // Filter States
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedProcessors, setSelectedProcessors] = useState<string[]>([]);
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [selectedBudgets, setSelectedBudgets] = useState<string[]>([]);
  const [selectedPerformances, setSelectedPerformances] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // UI State
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({
    "PURPOSE": true,
    "BUDGET": true,
    "BRAND": true,
    "PERFORMANCE": true,
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

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setAiSlideOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

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

  // Derived Data (Options & Search Results) from returned products
  const { filteredProducts, brandOptions, processorOptions, searchResults, selectedCompareProducts } = useMemo(() => {
    const filtered = products;

    // Extract Brand Options
    const bMap = new Map();
    products.forEach(p => {
      const bName = p.kc_brands?.name;
      if (bName) {
        bMap.set(bName, (bMap.get(bName) || 0) + 1);
      }
    });
    selectedBrands.forEach(b => { if (!bMap.has(b)) bMap.set(b, 0); });
    const bOptions = Array.from(bMap.entries()).map(([label, count]) => ({
      label, count, checked: selectedBrands.includes(label)
    })).sort((a,b) => a.label.localeCompare(b.label));
    
    // Extract Processor Options
    const pMap = new Map();
    products.forEach(p => {
      const productProcessors = new Set<string>();
      p.kc_variants?.forEach((v: any) => {
        if (v.cpu) {
           productProcessors.add(v.cpu);
        }
      });
      productProcessors.forEach(cpu => {
        pMap.set(cpu, (pMap.get(cpu) || 0) + 1);
      });
    });
    selectedProcessors.forEach(p => { if (!pMap.has(p)) pMap.set(p, 0); });
    const pOptions = Array.from(pMap.entries()).map(([label, count]) => ({
      label, count, checked: selectedProcessors.includes(label)
    })).sort((a,b) => a.label.localeCompare(b.label));

    // Search Results
    let sResults = products;
    const compareData = compareList.map(id => products.find(p => p.id === id)).filter(Boolean);

    return { filteredProducts: filtered, brandOptions: bOptions, processorOptions: pOptions, searchResults: sResults, selectedCompareProducts: compareData };
  }, [products, selectedBrands, selectedProcessors, compareList]);

  return (
    <div className="relative flex min-h-screen flex-col bg-white text-black font-sans">
      <Header variant="shop" />
      <main className="flex-1 mt-[80px] lg:mt-[100px] pb-[120px]">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">

          {/* Active Filters Bar */}
          <div className="sticky top-[120px] z-30 bg-white flex flex-col lg:flex-row lg:items-center justify-between py-3 lg:py-4 border-y border-gray-200 mb-8 gap-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <span className="text-[18px] font-medium text-surface-dark">{filteredProducts.length} products found</span>

              {(selectedBrands.length > 0 || selectedProcessors.length > 0) && (
                <div className="flex flex-wrap items-center gap-2">
                  
                  {selectedBrands.map((brand) => (
                    <button key={brand} onClick={() => toggleArrayItem(setSelectedBrands, brand)} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 text-[12px] font-medium text-surface-dark hover:border-gray-400 transition-colors">
                      {brand}
                      <X className="w-3 h-3 text-gray-500" />
                    </button>
                  ))}
                  
                  {selectedProcessors.map((cpu) => (
                    <button key={cpu} onClick={() => toggleArrayItem(setSelectedProcessors, cpu)} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 text-[12px] font-medium text-surface-dark hover:border-gray-400 transition-colors">
                      {cpu}
                      <X className="w-3 h-3 text-gray-500" />
                    </button>
                  ))}
                  
                  <button onClick={() => {
                    setSelectedBrands([]);
                    setSelectedProcessors([]);
                  }} className="text-[13px] ml-2 font-medium text-surface-dark underline underline-offset-4 hover:text-[#00A7B5] transition-colors">
                    Clear all
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 shrink-0">
              {/* Compare Toggle */}
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-[13px] font-medium text-surface-dark cursor-pointer select-none">
                  <div className={`w-8 h-4 rounded-full transition-colors relative ${isCompareMode ? 'bg-[#00A7B5]' : 'bg-gray-300'}`} onClick={() => setIsCompareMode(!isCompareMode)}>
                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${isCompareMode ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                  Compare
                </label>
              </div>

              <div className="w-px h-5 bg-gray-200 hidden sm:block"></div>
              
              <div className="flex items-center gap-2">
                <span className="text-[14px] text-gray-500">Sort by:</span>
                <button className="flex items-center gap-1 text-[14px] font-medium text-surface-dark hover:text-[#00A7B5] transition-colors">
                  Newest First
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Sidebar Filters */}
            <div className="w-full lg:w-[240px] shrink-0 flex flex-col gap-0">
              <div className="mb-8">
                <button
                  onClick={() => setAiSlideOpen(true)}
                  className="w-full bg-white rounded-lg py-3.5 px-5 flex items-center gap-3 border border-gray-200 hover:border-gray-300 transition-all text-left group"
                >
                  <Search className="w-[18px] h-[18px] text-gray-400 group-hover:text-[#00A7B5] transition-colors shrink-0" />
                  <span className="flex-1 text-[14px] text-gray-500 font-medium truncate">Smart Search...</span>
                </button>
              </div>

              {/* Primary Filters */}
              <FilterGroup 
                title="Purpose" 
                options={PURPOSES.map(p => ({ label: p }))} 
                selected={selectedPurposes} 
                toggleFn={(val: string) => toggleArrayItem(setSelectedPurposes, val)}
                isOpen={openFilters["PURPOSE"]}
                onToggleGroup={() => toggleFilter("PURPOSE")}
              />

              <FilterGroup 
                title="Budget" 
                options={BUDGETS.map(b => ({ label: b }))} 
                selected={selectedBudgets} 
                toggleFn={(val: string) => toggleArrayItem(setSelectedBudgets, val)}
                isOpen={openFilters["BUDGET"]}
                onToggleGroup={() => toggleFilter("BUDGET")}
              />

              <FilterGroup 
                title="Brand" 
                options={brandOptions} 
                selected={selectedBrands} 
                toggleFn={(val: string) => toggleArrayItem(setSelectedBrands, val)}
                isOpen={openFilters["BRAND"]}
                onToggleGroup={() => toggleFilter("BRAND")}
              />
              
              <FilterGroup 
                title="Performance Level" 
                options={PERFORMANCES.map(p => ({ label: p }))} 
                selected={selectedPerformances} 
                toggleFn={(val: string) => toggleArrayItem(setSelectedPerformances, val)}
                isOpen={openFilters["PERFORMANCE"]}
                onToggleGroup={() => toggleFilter("PERFORMANCE")}
              />

              <FilterGroup 
                title="Condition" 
                options={CONDITIONS.map(c => ({ label: c }))} 
                selected={selectedConditions} 
                toggleFn={(val: string) => toggleArrayItem(setSelectedConditions, val)}
                isOpen={openFilters["CONDITION"]}
                onToggleGroup={() => toggleFilter("CONDITION")}
              />

              {/* Advanced Filters */}
              <div className="border-t border-gray-200 pt-5 mt-5">
                <button
                  onClick={() => toggleFilter("ADVANCED")}
                  className="flex items-center gap-2 w-full text-left group"
                >
                  <span className="text-[14px] font-semibold text-[#00A7B5]">Advanced Filters</span>
                  {openFilters["ADVANCED"] ? (
                    <ChevronDown className="w-4 h-4 text-[#00A7B5] rotate-180 transition-transform" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#00A7B5] transition-transform" />
                  )}
                </button>

                {openFilters["ADVANCED"] && (
                  <div className="mt-4 pl-2 border-l-2 border-gray-100 ml-1">
                    <FilterGroup 
                      title="Processor" 
                      options={processorOptions} 
                      selected={selectedProcessors} 
                      toggleFn={(val: string) => toggleArrayItem(setSelectedProcessors, val)}
                      isOpen={true}
                      onToggleGroup={() => {}}
                    />
                  </div>
                )}
              </div>

            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 content-start">
              {loading ? (
                <div className="col-span-full py-12 flex items-center justify-center text-gray-500">Loading products...</div>
              ) : filteredProducts.length === 0 ? (
                <div className="col-span-full py-12 flex items-center justify-center text-gray-500">No products match your criteria.</div>
              ) : filteredProducts.map((product) => {
                const variants = product.kc_variants || [];
                
                // Aggregate prices across all valid inventory items for all variants
                let allPrices: number[] = [];
                variants.forEach((v: any) => {
                   if (v.inventory_items) {
                      v.inventory_items.forEach((item: any) => {
                         if (item.selling_price) allPrices.push(item.selling_price);
                      });
                   }
                });
                
                let minPrice = allPrices.length > 0 ? Math.min(...allPrices) : product.msrp || 0;
                
                // Fallback for mock data that was seeded with 0 price
                if (minPrice === 0) {
                  const charCode = product.id.charCodeAt(0) || 0;
                  minPrice = 3500 + (charCode % 5) * 2000;
                }
                
                // Primary Image
                const images = product.official_images || [];
                const primaryImage = images.find((i: any) => i.is_primary) || images[0];

                const brandName = product.kc_brands?.name || '';
                const seriesName = product.series || '';
                const modelName = product.model || '';
                
                return (
                  <Link href={`/shop/${product.id}`} key={product.id} className="group flex flex-col gap-4">
                    {/* Product Image Card */}
                    <div className="relative aspect-[4/3] bg-[#f8fafc] rounded-[16px] flex items-center justify-center overflow-hidden group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
                      {primaryImage ? (
                         <img src={primaryImage.url || primaryImage} alt={modelName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                      ) : (
                         <Laptop className="w-24 h-24 text-[#dddddd] group-hover:scale-105 transition-transform duration-500 ease-out" />
                      )}
                      
                      {isCompareMode ? (
                        <div className="absolute top-0 right-0 z-10">
                          <button 
                            onClick={(e) => handleToggleCompare(e, product.id)}
                            className="bg-white/95 backdrop-blur-sm shadow-sm flex items-center gap-2 cursor-pointer border border-gray-100 hover:bg-white transition-colors rounded-bl-xl px-3 py-2"
                            aria-label="Select to compare"
                          >
                            <div className={`w-[18px] h-[18px] rounded-[5px] border flex items-center justify-center transition-colors ${compareList.includes(product.id) ? 'bg-[#181d26] border-[#181d26]' : 'border-gray-300 bg-white'}`}>
                              {compareList.includes(product.id) && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                            </div>
                            <span className="text-[13px] font-medium text-[#181d26]">Compare</span>
                          </button>
                        </div>
                      ) : (
                        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                          <button 
                            onClick={(e) => handleToggleWishlist(e, product.id)} 
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                            aria-label="Add to Wishlist"
                          >
                            <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                          </button>
                          <button 
                            onClick={(e) => {
                              const defaultVariant = product.kc_variants?.[0];
                              if (defaultVariant) handleAddToCart(e, defaultVariant.id);
                            }} 
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                            aria-label="Add to Cart"
                          >
                            <ShoppingCart className={`w-4 h-4 ${cart.some(item => product.kc_variants?.some((v:any) => v.id === item.id)) ? 'fill-[#00A7B5] text-[#00A7B5]' : 'text-gray-600'}`} />
                          </button>
                        </div>
                      )}
                    </div>


                    {/* Product Info */}
                    <div className="flex flex-col gap-1 mt-3">
                      <div className="flex items-center gap-1.5 bg-[#f5f7f8] w-fit px-2 py-0.5 rounded-full text-[12px] font-medium text-[#181d26] mb-1">
                        4.5 <Star className="w-3 h-3 fill-[#0d9488] text-[#0d9488]" /> <span className="text-[#9297a0]">|</span> 128
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-[14px]">
                         <span className="font-bold text-[#181d26]">{brandName}</span>
                         <span className="text-[#9297a0]">|</span>
                         <span className="text-[#5f6368]">Laptop</span>
                      </div>
                      
                      <h3 className="font-normal text-[14px] text-[#5f6368] leading-snug group-hover:text-[#1b61c9] transition-colors line-clamp-2">
                        {seriesName} {modelName} {product.cpu || ''}
                      </h3>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-[16px] sm:text-[18px] text-[#181d26]">₹{minPrice.toLocaleString()}</span>
                        <span className="text-[13px] text-[#9297a0] line-through">₹{Math.floor(minPrice * 1.25).toLocaleString()}</span>
                        <span className="text-[13px] font-bold text-[#0d9488] tracking-tight">20% off</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
              
              {/* Infinite Scroll Loader Target */}
              {hasMore && (
                <div ref={lastElementRef} className="col-span-full py-8 flex items-center justify-center">
                  {loadingMore && <span className="text-gray-500">Loading more products...</span>}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
      <Footer />

      {/* Floating Compare Button */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 group">
          {/* Popover */}
          <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4 w-[320px] sm:w-[380px] opacity-0 scale-90 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-300 ease-out origin-bottom-right border border-gray-100">
             <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-2 custom-scrollbar">
               {selectedCompareProducts.map(p => {
                  const images = p.official_images || [];
                  const primaryImage = images.find((i: any) => i.is_primary) || images[0];
                  return (
                    <div key={p.id} className="relative w-16 h-16 shrink-0 bg-[#f8fafc] border border-gray-100 rounded-md p-1 flex items-center justify-center">
                      {primaryImage ? (
                        <img src={primaryImage.url || primaryImage} className="w-full h-full object-contain mix-blend-multiply" alt="" />
                      ) : (
                        <Laptop className="w-6 h-6 text-gray-300" />
                      )}
                      <button 
                        onClick={(e) => handleToggleCompare(e, p.id)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-100 hover:bg-gray-50"
                      >
                        <X className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  )
               })}
             </div>
             <div className="flex items-center gap-3">
               <button 
                 onClick={() => clearCompare()}
                 className="flex-1 h-[44px] bg-white border border-gray-300 text-[#181d26] text-[13px] font-semibold rounded-md hover:bg-gray-50 transition-colors"
               >
                 REMOVE ALL
               </button>
               <button 
                 onClick={() => {
                   if (compareList.length > 0) {
                     router.push(`/compare?ids=${compareList.join(',')}`);
                   }
                 }}
                 className="flex-1 h-[44px] bg-[#333333] text-white text-[13px] font-semibold rounded-md hover:bg-[#111111] transition-colors"
               >
                 COMPARE({compareList.length})
               </button>
             </div>
          </div>
          
          {/* Main Floating Button ALWAYS EXACTLY OVERLAPPING */}
          <button 
            onClick={() => {
              if (compareList.length > 0) {
                router.push(`/compare?ids=${compareList.join(',')}`);
              }
            }}
            className="relative z-10 bg-[#111111] text-white h-[44px] w-[138px] sm:w-[168px] rounded-md text-[13px] font-semibold shadow-lg flex items-center justify-center hover:bg-black transition-all duration-150 opacity-100 group-hover:opacity-0 group-hover:pointer-events-none"
          >
            COMPARE({compareList.length})
          </button>
        </div>
      )}

      <Dialog open={isAiSlideOpen} onOpenChange={(open) => {
        setAiSlideOpen(open);
        if (!open) setSearchQuery('');
      }}>
        <DialogContent className="bg-transparent border-none shadow-none sm:max-w-3xl p-0 top-10 sm:top-[10%] translate-y-0" showCloseButton={false}>
          <DialogTitle className="sr-only">Smart Search</DialogTitle>
          <DialogDescription className="sr-only">Search for laptops using AI</DialogDescription>
          
          {/* Top Search Input Box */}
          <div className="bg-white rounded-lg p-3 px-5 flex items-center gap-3 w-full border border-gray-200">
            <Search className="w-[18px] h-[18px] text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter model name, brand or series..." 
              className="flex-1 bg-transparent border-none outline-none text-[14px] text-surface-dark placeholder:text-gray-400"
              autoFocus
            />
          </div>

          {/* Results Box */}
          {searchQuery.trim().length > 0 && (
            <div className="bg-white rounded-lg p-5 sm:p-6 mt-3 flex flex-col gap-4 w-full border border-gray-200">
              <div className="flex flex-col gap-3">
                <span className="text-[14px] text-gray-600">Search Results ({searchResults.length})</span>

                {/* Items List - Scrollable */}
                <div className="flex flex-col max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {searchResults.length === 0 ? (
                    <div className="py-4 text-center text-[14px] text-gray-500">No products found matching "{searchQuery}"</div>
                  ) : searchResults.map((product) => {
                    const primaryImage = (product.official_images || []).find((i: any) => i.is_primary) || (product.official_images || [])[0];
                    let allPrices: number[] = [];
                    (product.kc_variants || []).forEach((v: any) => {
                       if (v.inventory_items) {
                          v.inventory_items.forEach((item: any) => {
                             if (item.selling_price) allPrices.push(item.selling_price);
                          });
                       }
                    });
                    
                    let minPrice = allPrices.length > 0 ? Math.min(...allPrices) : product.msrp || 0;
                    
                    if (minPrice === 0) {
                      const charCode = product.id.charCodeAt(0) || 0;
                      minPrice = 3500 + (charCode % 5) * 2000;
                    }
                    return (
                      <Link 
                        href={`/shop/${product.id}`} 
                        key={product.id}
                        onClick={() => setAiSlideOpen(false)}
                        className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 border-b border-gray-100 last:border-0 group cursor-pointer gap-3 hover:bg-gray-50 px-2 -mx-2 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center p-1 shrink-0">
                            {primaryImage ? (
                              <img src={primaryImage.url || primaryImage} alt={product.model} className="w-full h-full object-contain mix-blend-multiply" />
                            ) : (
                              <Laptop className="w-6 h-6 text-gray-300" />
                            )}
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[15px] font-medium text-surface-dark group-hover:text-[#00A7B5] transition-colors">
                              {product.kc_brands?.name} {product.model}
                            </span>
                            <div className="flex items-center gap-1.5 text-[13px] text-gray-500">
                              <span>{product.series}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 sm:ml-auto shrink-0 pl-[62px] sm:pl-0 font-medium text-surface-dark">
                          ₹{minPrice.toLocaleString()}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
