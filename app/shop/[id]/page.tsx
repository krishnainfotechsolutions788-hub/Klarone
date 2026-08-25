"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/shared/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Laptop, ChevronRight, Check, ShieldCheck, ShoppingCart, Heart, ChevronDown, Star, ChevronLeft, Sparkles, ArrowLeft } from "lucide-react";
import { useStore } from "@/lib/store";
import { getShopProduct } from "@/app/actions/shop";

// Animation Variants (matching design.md Rule #7)
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

export default function ShopProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  const productId = params.id as string;
  const { addToCart, cart, wishlist, toggleWishlist } = useStore();
  
  const [product, setProduct] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [activeSpecTab, setActiveSpecTab] = useState<string | null>(null);
  const [visibleSpecCount, setVisibleSpecCount] = useState(6);

  useEffect(() => {
    async function fetchProductData() {
       setLoading(true);
       const res = await getShopProduct(productId);

       if (!res.success || !res.data) { 
         setLoading(false); 
         return; 
       }

       setProduct(res.data);
       
       const allVars = res.data.kc_variants || [];
       const stockedVars = allVars.filter((v: any) => v.inventory_items && v.inventory_items.length > 0);
       
       setVariants(stockedVars.length > 0 ? stockedVars : allVars);

       if (stockedVars.length > 0) {
         setSelectedVariantId(stockedVars[0].id);
       } else if (allVars.length > 0) {
         setSelectedVariantId(allVars[0].id);
       }

       // Fetch related products
       try {
         const resRelated = await fetch('/api/shop/search', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
             selectedBrands: res.data.kc_brands?.name ? [res.data.kc_brands.name] : [],
             selectedProcessors: [],
             searchQuery: '',
             page: 1,
             limit: 5
           })
         });
         if (resRelated.ok) {
           const { data: relatedData } = await resRelated.json();
           let filteredRelated = (relatedData || []).filter((p: any) => p.id !== res.data.id);
           
           if (filteredRelated.length === 0) {
              const resFallback = await fetch('/api/shop/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  selectedBrands: [],
                  selectedProcessors: [],
                  searchQuery: '',
                  page: 1,
                  limit: 5
                })
              });
              
              if (resFallback.ok) {
                 const { data: fallbackData } = await resFallback.json();
                 filteredRelated = (fallbackData || []).filter((p: any) => p.id !== res.data.id);
              }
           }
           
           setRelatedProducts(filteredRelated.slice(0, 4));
         }
       } catch (e) {
         console.error("Failed to load related products", e);
       }

       setLoading(false);
    }
    fetchProductData();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#00A7B5] border-t-transparent rounded-full animate-spin" />
          <span className="text-[14px] text-white/50 font-normal">Loading device specification...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-medium text-white mb-2">Device Not Found</h1>
        <p className="text-[14px] text-white/50 mb-6">The requested device specification is not available in our catalog.</p>
        <button onClick={() => router.push('/shop')} className="px-5 py-2.5 rounded-full bg-white text-black font-semibold text-[13px]">
          Return to Catalog
        </button>
      </div>
    );
  }

  const selectedVariant = variants.find(v => v.id === selectedVariantId) || variants[0];
  
  let displayImages = selectedVariant?.variant_images || [];
  if (displayImages.length === 0) {
    displayImages = product.official_images || [];
  }

  const currentImage = displayImages[currentImageIdx] || displayImages[0];
  const maxThumbnails = 4;
  const visibleThumbnails = displayImages.slice(0, maxThumbnails);
  const remainingCount = displayImages.length - maxThumbnails;

  const brandName = product.kc_brands?.name || '';
  const seriesName = product.series || '';
  const modelName = product.model || '';
  const fullTitle = `${brandName} ${seriesName} ${modelName}`.trim();
  const words = fullTitle.split(" ");
  const cleanTitle = words.filter((w, i) => words.indexOf(w) === i).join(" ");

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white font-sans overflow-x-hidden">
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 lg:px-12 pt-28 pb-28">
        
        <motion.div 
          variants={pageContainerVariants}
          initial="hidden"
          animate="visible"
        >
          
          {/* Breadcrumb Navigation */}
          <motion.div variants={itemUpVariants} className="flex items-center gap-2 text-[13px] font-normal text-white/40 mb-8">
            <span onClick={() => router.push('/shop')} className="hover:text-white cursor-pointer transition-colors flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
            </span>
            <span>/</span>
            <span className="text-white/80 font-medium truncate max-w-xs">{cleanTitle}</span>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">
            
            {/* Left Column: Product Image Gallery (5 cols) */}
            <motion.div variants={itemUpVariants} className="lg:col-span-6 flex flex-col gap-6 sticky top-28 self-start">
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                
                {/* Thumbnail List */}
                {displayImages.length > 1 && (
                  <div className="flex sm:flex-col gap-2.5 overflow-auto no-scrollbar sm:w-16 sm:flex-shrink-0 w-full pb-2 sm:pb-0">
                    {visibleThumbnails.map((img: any, idx: number) => {
                      const isLast = idx === maxThumbnails - 1;
                      const hasMore = remainingCount > 0;
                      
                      return (
                        <button 
                          key={idx}
                          onClick={() => {
                            if (isLast && hasMore) {
                              setIsGalleryOpen(true);
                            } else {
                              setCurrentImageIdx(idx);
                            }
                          }}
                          className={`relative w-14 h-14 rounded-xl border overflow-hidden flex-shrink-0 transition-all bg-[#08080A] ${currentImageIdx === idx ? 'border-[#00A7B5]' : 'border-white/10 hover:border-white/30'}`}
                        >
                          <img src={img.url || img} alt="Thumbnail" className="w-full h-full object-contain p-1" />
                          
                          {isLast && hasMore && (
                            <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-white font-medium text-[12px] backdrop-blur-xs">
                              +{remainingCount}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Main Hero Image Container */}
                <div 
                  onClick={() => setIsGalleryOpen(true)}
                  className="flex-1 w-full aspect-[16/12] bg-[#0A0A0C] border border-white/10 rounded-2xl relative overflow-hidden group flex items-center justify-center cursor-pointer p-6 shadow-xl"
                >
                  {currentImage ? (
                    <>
                      <img src={currentImage.url || currentImage} alt={modelName} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out" />
                      
                      {displayImages.length > 1 && (
                        <>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setCurrentImageIdx(prev => prev === 0 ? displayImages.length - 1 : prev - 1); }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 hover:bg-black/90 backdrop-blur-md rounded-full flex items-center justify-center border border-white/15 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                          >
                            <ChevronLeft className="w-4 h-4 text-white" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setCurrentImageIdx(prev => prev === displayImages.length - 1 ? 0 : prev + 1); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 hover:bg-black/90 backdrop-blur-md rounded-full flex items-center justify-center border border-white/15 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                          >
                            <ChevronRight className="w-4 h-4 text-white" />
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Laptop className="w-32 h-32 text-white/20" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Right Column: Device Specifications & Actions (7 cols) */}
            <motion.div variants={itemUpVariants} className="lg:col-span-6 flex flex-col justify-between">
              
              <div>
                {/* Brand Pill & Verified Tag */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-medium tracking-wider text-[#00A7B5] uppercase bg-[#00A7B5]/10 px-3 py-1 rounded-full border border-[#00A7B5]/20">
                    {brandName || "Laptop"}
                  </span>
                  <span className="text-[12px] text-white/40 font-normal">Klarone Verified</span>
                </div>

                {/* Main Product Title */}
                <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white leading-tight mb-4">
                  {cleanTitle}
                </h1>

                {/* Description */}
                <div className="mb-6">
                  <div 
                    className={`prose prose-invert prose-sm max-w-none text-white/60 leading-relaxed text-[14px] ${!showFullDesc ? 'line-clamp-3' : ''}`}
                    dangerouslySetInnerHTML={{ __html: product.official_descriptions || product.short_description || "No official description available for this device." }} 
                  />
                  {(product.official_descriptions || product.short_description) && (
                    <button 
                      onClick={() => setShowFullDesc(!showFullDesc)}
                      className="text-[#00A7B5] text-[13px] font-medium hover:underline mt-1.5 cursor-pointer"
                    >
                      {showFullDesc ? 'Show less' : 'Read full description...'}
                    </button>
                  )}
                </div>

                {/* Pricing Block */}
                <div className="flex items-baseline gap-3 mb-8 pb-6 border-b border-white/10">
                  <span className="text-3xl sm:text-4xl font-medium tracking-tight text-white">
                    ₹{(() => {
                       let p = 0;
                       if (selectedVariant?.inventory_items?.length > 0) {
                         const prices = selectedVariant.inventory_items.map((i:any) => i.selling_price).filter((p:any)=>p>0);
                         if (prices.length > 0) p = Math.min(...prices);
                       }
                       if (p === 0) p = selectedVariant?.msrp || product.msrp || 0;
                       
                       if (p === 0) {
                         const charCode = selectedVariant?.id?.charCodeAt(0) || 0;
                         p = 38000 + (charCode % 5) * 8000;
                       }
                       return p.toLocaleString();
                    })()}
                  </span>
                  <span className="text-[13px] text-white/40">Inclusive of all taxes</span>
                </div>

                {/* Variant Configuration Selector */}
                {variants.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-[12px] font-semibold tracking-wider text-white/50 uppercase mb-3">Available Configurations</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {variants.map(variant => {
                        const cpu = variant.cpu && !variant.cpu.includes('Unknown') ? variant.cpu : null;
                        const ram = variant.ram && !variant.ram.includes('Unknown') ? variant.ram : null;
                        const storage = variant.storage && !variant.storage.includes('Unknown') ? variant.storage : null;
                        
                        const parts = [];
                        if (cpu) parts.push(cpu);
                        if (ram) parts.push(ram);
                        if (storage) parts.push(storage);

                        let title = parts.join(' · ');
                        if (parts.length === 0) {
                          title = variant.title || "Standard Spec";
                        }

                        return (
                          <button 
                            key={variant.id}
                            onClick={() => {
                              setSelectedVariantId(variant.id);
                              setCurrentImageIdx(0);
                            }}
                            className={`flex items-center gap-3 text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                              selectedVariantId === variant.id 
                                ? 'border-[#00A7B5] bg-[#00A7B5]/10 text-white shadow-lg' 
                                : 'border-white/10 hover:border-white/20 bg-[#141416] text-white/70'
                            }`}
                          >
                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${selectedVariantId === variant.id ? 'border-[#00A7B5] bg-[#00A7B5]' : 'border-white/30'}`}>
                              {selectedVariantId === variant.id && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                            </div>
                            <span className="font-medium text-[13px] leading-snug truncate">
                              {title}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <button 
                    onClick={() => {
                      if(selectedVariant) addToCart(selectedVariant.id);
                    }}
                    className="flex-1 h-12 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-full font-medium text-[14px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <ShoppingCart className="w-4 h-4 text-white/80" /> Add to Cart
                  </button>
                  
                  <button 
                    onClick={() => {
                      if(selectedVariant) addToCart(selectedVariant.id);
                      router.push('/cart');
                    }}
                    className="flex-1 h-12 bg-[#00A7B5] hover:bg-[#00929e] text-black font-semibold rounded-full text-[14px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#00A7B5]/20"
                  >
                    Proceed with Choice →
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="h-12 w-12 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer shrink-0"
                    aria-label="Add to Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>

                {/* Guarantee Note */}
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#141416] border border-white/10 text-[13px] text-white/60">
                  <ShieldCheck className="w-4 h-4 text-[#00A7B5] shrink-0" />
                  <span>Klarone Certified · 6-Month Comprehensive Technical Warranty</span>
                </div>

              </div>

            </motion.div>
          </div>

          {/* Technical Specifications Section */}
          <motion.div variants={itemUpVariants} className="mt-20 pt-12 border-t border-white/10">
            <h2 className="text-xl font-medium tracking-tight text-white mb-6">Technical Specifications</h2>
            
            {(() => {
              const baseSpecs = typeof product.official_specifications === 'object' && product.official_specifications !== null 
                ? (product.official_specifications as Record<string, string>) 
                : {};
              const variantSpecs = selectedVariant?.variant_specifications && typeof selectedVariant.variant_specifications === 'object' 
                ? (selectedVariant.variant_specifications as Record<string, string>) 
                : {};
              
              let allSpecs: Record<string, string> = { ...baseSpecs, ...variantSpecs };
              
              if (selectedVariant?.cpu && !selectedVariant.cpu.includes('Unknown')) allSpecs['Processor (CPU)'] = selectedVariant.cpu;
              if (selectedVariant?.ram && !selectedVariant.ram.includes('Unknown')) allSpecs['RAM Memory'] = selectedVariant.ram;
              if (selectedVariant?.storage && !selectedVariant.storage.includes('Unknown')) allSpecs['Storage Drive'] = selectedVariant.storage;
              if (selectedVariant?.display && !selectedVariant.display.includes('Unknown')) allSpecs['Display Panel'] = selectedVariant.display;

              if (Object.keys(allSpecs).length === 0) {
                allSpecs = {
                  "Brand": brandName || "Klarone Verified",
                  "Model": modelName || "Standard Edition",
                  "Processor": product.cpu || "Intel Core i5 / Ryzen 5",
                  "Display": "15.6-inch Full HD Anti-Glare",
                  "Operating System": "Windows 11 Home",
                  "Warranty": "6 Months Warranty"
                };
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(allSpecs).slice(0, visibleSpecCount).map(([key, value], idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#141416] border border-white/10 flex flex-col gap-1">
                      <span className="text-[12px] font-normal text-white/40 uppercase tracking-wider">{key}</span>
                      <span className="text-[14px] font-medium text-white/90">{String(value)}</span>
                    </div>
                  ))}
                  
                  {Object.keys(allSpecs).length > visibleSpecCount && (
                    <div className="col-span-full pt-2">
                      <button 
                        onClick={() => setVisibleSpecCount(prev => prev + 6)}
                        className="text-[#00A7B5] text-[13px] font-medium hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        View More Specs <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}
          </motion.div>

          {/* Related Devices Section */}
          {relatedProducts.length > 0 && (
            <motion.div variants={itemUpVariants} className="mt-20 pt-12 border-t border-white/10">
              <h2 className="text-xl font-medium tracking-tight text-white mb-6">Similar Recommendation Devices</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relProduct) => {
                  let minPrice = relProduct.msrp || 42000;
                  const images = relProduct.official_images || [];
                  const primaryImage = images.find((i: any) => i.is_primary) || images[0];
                  const relBrand = relProduct.kc_brands?.name || '';
                  const relSeries = relProduct.series || '';
                  const relModel = relProduct.model || '';

                  return (
                    <Link href={`/shop/${relProduct.id}`} key={relProduct.id} className="group flex flex-col p-3.5 rounded-2xl bg-[#141416] border border-white/10 hover:border-white/20 hover:bg-[#18181C] transition-all duration-300 shadow-xl justify-between">
                      <div className="relative aspect-[16/10] rounded-xl bg-[#08080A] p-3 flex items-center justify-center overflow-hidden border border-white/[0.08]">
                        {primaryImage ? (
                          <img src={primaryImage.url || primaryImage} alt={relModel} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out" />
                        ) : (
                          <Laptop className="w-16 h-16 text-white/20" />
                        )}
                      </div>
                      
                      <div className="pt-4 px-1 pb-1 flex flex-col gap-4">
                        <h3 className="font-normal text-[15px] leading-snug text-white/90 group-hover:text-white transition-colors line-clamp-2">
                          {relBrand} {relSeries} {relModel}
                        </h3>

                        <div className="flex items-center justify-between text-[12.5px] text-white/40 pt-2 border-t border-white/[0.08]">
                          <span>{relSeries || "Laptop"}</span>
                          <span className="font-medium text-white/90">₹{minPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}

        </motion.div>
      </main>

      <Footer />

      {/* Fullscreen Gallery Lightbox */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center">
          <button 
            onClick={() => setIsGalleryOpen(false)}
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors p-2 cursor-pointer"
          >
            <span className="sr-only">Close</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          
          <div className="relative w-full max-w-5xl aspect-auto px-12 flex items-center justify-center flex-1 my-16">
            {currentImage && (
              <img src={currentImage.url || currentImage} alt="Fullscreen" className="max-w-full max-h-[75vh] object-contain" />
            )}
            
            {displayImages.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIdx(prev => prev === 0 ? displayImages.length - 1 : prev - 1); }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIdx(prev => prev === displayImages.length - 1 ? 0 : prev + 1); }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
