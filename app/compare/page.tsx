"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/shared/Footer";
import { getShopProducts } from "@/app/actions/shop";
import { Laptop, X, ChevronLeft, ShoppingCart, Loader2, Plus, Sparkles, Check, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";

// Framer Motion entrance variants matching landing page Hero
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
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.215, 0.61, 0.355, 1] as const,
    },
  },
};

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idsParam = searchParams.get("ids");
  const { addToCart, cart, removeFromCompare } = useStore();
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      if (!idsParam) {
        setProducts([]);
        setLoading(false);
        return;
      }
      
      const ids = idsParam.split(',').filter(Boolean);
      if (ids.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const res = await getShopProducts(ids);
      if (res.success && res.data) {
        setProducts(res.data);
      }
      setLoading(false);
    }
    
    fetchProducts();
  }, [idsParam]);

  const handleRemove = (idToRemove: string) => {
    removeFromCompare(idToRemove);
    const currentIds = idsParam ? idsParam.split(',').filter(Boolean) : [];
    const newIds = currentIds.filter(id => id !== idToRemove);
    if (newIds.length === 0) {
      router.push('/shop');
    } else {
      router.push(`/compare?ids=${newIds.join(',')}`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, variantId: string) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(variantId, 1);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[65vh] bg-[#000000] text-white">
        <Loader2 className="w-9 h-9 animate-spin text-[#00A7B5] mb-4" />
        <p className="text-white/60 text-sm font-medium">Fetching comparison matrix...</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[65vh] px-6 bg-[#000000] text-white text-center">
        <div className="w-20 h-20 rounded-full bg-[#141416] border border-white/10 flex items-center justify-center mb-6 shadow-2xl">
          <Laptop className="w-9 h-9 text-white/30" />
        </div>
        <h2 className="text-3xl font-medium tracking-tight text-white mb-3">No Devices Selected</h2>
        <p className="text-white/50 mb-8 max-w-md text-sm leading-relaxed">
          Select up to 4 devices from our catalog to analyze specs, thermal benchmarks, and pricing side by side.
        </p>
        <Link href="/shop" className="inline-flex items-center gap-2 bg-white text-black px-7 py-3 rounded-full text-sm font-medium hover:bg-white/90 transition-all shadow-lg">
          <span>Explore Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // Extract all unique specs
  const specGroups: Record<string, Set<string>> = {};
  
  products.forEach(product => {
    const variant = product.kc_variants?.[0];
    if (variant && variant.kc_specifications) {
      variant.kc_specifications.forEach((spec: any) => {
        const group = spec.group_name || 'General';
        if (!specGroups[group]) {
          specGroups[group] = new Set();
        }
        specGroups[group].add(spec.attribute_name);
      });
    }
  });

  const getSpecValue = (product: any, groupName: string, attributeName: string) => {
    const variant = product.kc_variants?.[0];
    if (!variant || !variant.kc_specifications) return '-';
    
    const spec = variant.kc_specifications.find(
      (s: any) => (s.group_name || 'General') === groupName && s.attribute_name === attributeName
    );
    
    if (!spec) return '-';
    return `${spec.value} ${spec.unit || ''}`.trim();
  };

  return (
    <motion.div 
      variants={pageContainerVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 max-w-[1400px] mx-auto w-full px-6 lg:px-12 pt-[120px] pb-28 text-white relative z-10"
    >
      {/* Top Breadcrumb */}
      <motion.div variants={itemUpVariants} className="flex items-center gap-2 mb-8">
        <Link href="/shop" className="text-xs font-medium text-white/50 hover:text-white transition-colors flex items-center gap-1">
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-xs font-medium text-white/90">Device Comparison</span>
      </motion.div>

      {/* Header Banner */}
      <motion.div variants={itemUpVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1A1A1A] border border-white/10 mb-4 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00A7B5]"></span>
            <span className="text-[12px] font-medium text-white/80 tracking-wide">Side-by-Side Matrix</span>
          </div>
          <h1 className="text-[33px] sm:text-[40px] lg:text-[46px] font-normal leading-[1.15] tracking-tight text-white">
            Compare Devices
          </h1>
          <p className="text-[14.5px] text-white/60 mt-1 max-w-xl">
            Evaluate specifications, build quality, performance tiers, and exact pricing side by side.
          </p>
        </div>
      </motion.div>

      {/* Matrix Table */}
      <motion.div variants={itemUpVariants} className="w-full overflow-x-auto custom-scrollbar pb-8 rounded-2xl border border-white/10 bg-[#0A0A0C]/90 backdrop-blur-xl shadow-2xl">
        <div className="min-w-[850px] flex">
          
          {/* Label Column Sticky */}
          <div className="w-[220px] shrink-0 border-r border-white/10 flex flex-col bg-[#0A0A0C] sticky left-0 z-20">
            <div className="h-[320px] p-6 border-b border-white/10 flex flex-col justify-end">
              <span className="text-[11px] font-medium text-white/40 tracking-widest uppercase">Overview & Pricing</span>
            </div>
          </div>

          {/* Product Columns - Always 4 Slots */}
          {Array.from({ length: 4 }).map((_, index) => {
            const product = products[index];

            if (!product) {
              return (
                <div key={`empty-${index}`} className="flex-1 min-w-[260px] max-w-[340px] border-r border-white/10 flex flex-col bg-[#070709]/50">
                  <div className="h-[320px] p-6 border-b border-white/10 flex flex-col items-center justify-center">
                    <Link href="/shop" className="flex flex-col items-center justify-center gap-3.5 group">
                      <div className="w-14 h-14 rounded-full bg-[#141416] border border-white/10 shadow-md flex items-center justify-center group-hover:border-[#00A7B5] group-hover:text-[#00A7B5] transition-all">
                        <Plus className="w-5 h-5 text-white/40 group-hover:text-[#00A7B5] transition-colors" />
                      </div>
                      <span className="text-xs font-medium text-white/40 group-hover:text-[#00A7B5] transition-colors">Add Device</span>
                    </Link>
                  </div>
                </div>
              );
            }

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
              minPrice = 3500 + ((product.id.charCodeAt(0) || 0) % 5) * 2000;
            }

            const defaultVariant = product.kc_variants?.[0];
            const inCart = cart.some(item => product.kc_variants?.some((v:any) => v.id === item.id));

            return (
              <div key={product.id} className="flex-1 min-w-[260px] max-w-[340px] border-r border-white/10 flex flex-col relative bg-[#111113]/80 group">
                <div className="h-[320px] p-5 sm:p-6 border-b border-white/10 flex flex-col">
                  
                  {/* Remove Button */}
                  <button 
                    onClick={() => handleRemove(product.id)}
                    className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/15 transition-all z-30 opacity-80 group-hover:opacity-100"
                    aria-label="Remove from comparison"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <Link href={`/shop/${product.id}`} className="flex-1 flex flex-col justify-between group/link">
                    {/* Image Box with Dark Overlay */}
                    <div className="relative w-full h-[140px] mb-4 rounded-xl bg-[#060608] border border-white/[0.05] overflow-hidden flex items-center justify-center p-2">
                      {primaryImage ? (
                        <img 
                          src={primaryImage.url || primaryImage} 
                          alt={product.model} 
                          className="max-h-full max-w-full object-contain brightness-[0.9] group-hover/link:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <Laptop className="w-12 h-12 text-white/20" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none" />
                    </div>

                    <div>
                      <div className="text-[11px] font-semibold text-[#00A7B5] mb-1 uppercase tracking-wider">{product.kc_brands?.name}</div>
                      <h3 className="text-[14.5px] font-normal text-white line-clamp-2 leading-snug group-hover/link:text-white/90 transition-colors">{product.model} {product.cpu ? `- ${product.cpu}` : ''}</h3>
                    </div>
                  </Link>

                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10">
                    <span className="text-lg sm:text-xl font-medium text-white">₹{minPrice.toLocaleString()}</span>
                    <button 
                      onClick={(e) => {
                        if (defaultVariant) handleAddToCart(e, defaultVariant.id);
                      }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm ${inCart ? 'bg-[#00A7B5] text-white hover:bg-[#008f9b]' : 'bg-white/10 text-white border border-white/15 hover:bg-white hover:text-black hover:border-white'}`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Specifications Rows */}
        {Object.keys(specGroups).sort().map(group => (
          <div key={group} className="flex flex-col">
            <div className="min-w-[850px] flex bg-[#161619] border-b border-white/10 py-2.5 px-6 sticky left-0">
              <span className="text-[12.5px] font-medium text-[#00A7B5] uppercase tracking-wider">{group}</span>
            </div>
            
            {Array.from(specGroups[group]).sort().map(attribute => (
              <div key={`${group}-${attribute}`} className="min-w-[850px] flex border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors">
                <div className="w-[220px] shrink-0 border-r border-white/10 p-4 pl-6 bg-[#0A0A0C] flex items-center sticky left-0 z-10">
                  <span className="text-[13px] font-normal text-white/60">{attribute}</span>
                </div>
                {Array.from({ length: 4 }).map((_, index) => {
                  const product = products[index];
                  return (
                    <div key={`${product?.id || `empty-${index}`}-${attribute}`} className="flex-1 min-w-[260px] max-w-[340px] border-r border-white/10 p-4 flex items-center">
                      {product ? (
                        <span className="text-[13.5px] text-white/90 leading-relaxed font-normal">{getSpecValue(product, group, attribute)}</span>
                      ) : (
                        <span className="text-[13.5px] text-white/20">-</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}

      </motion.div>
    </motion.div>
  );
}

export default function ComparePage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#000000] text-white font-sans overflow-x-hidden">
      {/* Background Tech Horizon Landscape Overlay with Parallax Vignette matching HeroSection */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <img 
          src="/Hero/tech-landscape.png" 
          alt="Tech Horizon Landscape" 
          className="w-full h-[700px] object-cover object-center opacity-30 brightness-[0.7] contrast-[1.1]" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/80 via-[#000000]/95 to-[#000000]" />
      </div>

      <Header variant="shop" />
      <Suspense fallback={
        <div className="flex-1 flex flex-col items-center justify-center min-h-[65vh] bg-[#000000] text-white">
          <Loader2 className="w-9 h-9 animate-spin text-[#00A7B5]" />
        </div>
      }>
        <CompareContent />
      </Suspense>
      <Footer />
    </div>
  );
}

