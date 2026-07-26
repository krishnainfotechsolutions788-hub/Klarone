"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Laptop, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

const itemUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] as const } 
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export default function WishlistPage() {
  const { wishlist, cart, removeFromWishlist, toggleCart } = useStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWishlistItems() {
      if (wishlist.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const supabase = createClient();

      // 1. Query product_models
      const { data: modelsData } = await supabase
        .from("product_models")
        .select(`
          id,
          name,
          brands(name),
          series(name),
          categories(name),
          product_variants(id, selling_price, status),
          product_images(image_url, is_primary)
        `)
        .in("id", wishlist);

      // 2. Query kc_master_products as fallback for catalog items
      const { data: kcData } = await supabase
        .from("kc_master_products")
        .select(`
          id,
          model,
          series,
          msrp,
          images,
          kc_brands(name)
        `)
        .in("id", wishlist);

      const getRelationName = (rel: any) => {
        if (!rel) return '';
        if (Array.isArray(rel)) return rel[0]?.name || '';
        return rel.name || '';
      };

      const formattedModels = ((modelsData as any[]) || []).map(item => ({
        id: item.id,
        name: item.name,
        brandName: getRelationName(item.brands),
        seriesName: getRelationName(item.series),
        minPrice: item.product_variants?.length ? Math.min(...item.product_variants.map((v: any) => v.selling_price || 0)) : 0,
        image: item.product_images?.find((i: any) => i.is_primary)?.image_url || item.product_images?.[0]?.image_url || '',
        variants: item.product_variants || []
      }));

      const formattedKc = ((kcData as any[]) || []).map(item => {
        const imgArray = item.images ? (typeof item.images === 'string' ? item.images.split(',') : item.images) : [];
        return {
          id: item.id,
          name: item.model,
          brandName: getRelationName(item.kc_brands),
          seriesName: item.series || '',
          minPrice: item.msrp || 0,
          image: imgArray[0] || '',
          variants: []
        };
      });

      // Combine results without duplicates
      const allItems = [...formattedModels];
      formattedKc.forEach(kcItem => {
        if (!allItems.some(m => m.id === kcItem.id)) {
          allItems.push(kcItem);
        }
      });

      setProducts(allItems);
      setLoading(false);
    }
    
    fetchWishlistItems();
  }, [wishlist]);

  const isEmpty = wishlist.length === 0;

  return (
    <div className="min-h-screen bg-[#000000] text-white relative overflow-hidden pt-32 pb-24">
      {/* Background Vignette Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-20 brightness-[0.7]"
        style={{ backgroundImage: "url('/tech-landscape.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        {loading ? (
          <div className="flex items-center justify-center text-white/40 font-normal">Loading saved devices...</div>
        ) : isEmpty ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center text-center py-16 sm:py-24 min-h-[50vh]"
          >
            <div className="relative w-52 sm:w-70 aspect-square mb-5 flex items-center justify-center">
              <img 
                src="/empty-cart.png" 
                alt="Empty Wishlist" 
                className="w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]" 
              />
            </div>
            <h2 className="text-2xl sm:text-3xl font-medium text-white mb-2 tracking-tight">Your Wishlist is Empty</h2>
            <p className="text-white/50 mb-6 max-w-[360px] text-xs sm:text-sm leading-relaxed font-normal">
              Tap the heart icon on any hardware model to bookmark devices for later evaluation.
            </p>
            <Link href="/shop">
              <Button className="h-11 px-7 bg-white hover:bg-white/90 text-black rounded-full font-medium transition-all shadow-lg flex items-center gap-2 text-sm cursor-pointer">
                Browse <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Header Hero Title */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="flex flex-col items-start mb-12 sm:mb-16"
            >
              <motion.div variants={itemUpVariants} className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1A1A1A] border border-white/10 mb-6 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00A7B5]"></span>
                <span className="text-[12px] font-medium text-white/80 tracking-wide">Saved Tech Decisions</span>
              </motion.div>

              <motion.h1 
                variants={itemUpVariants}
                className="text-[36px] sm:text-[48px] lg:text-[56px] font-normal text-white leading-tight tracking-tight mb-3"
              >
                Your Saved Wishlist
              </motion.h1>
              <motion.p 
                variants={itemUpVariants}
                className="text-base sm:text-lg text-white/60 max-w-[600px]"
              >
                Review hardware recommendations you have bookmarked for confident technology purchasing.
              </motion.p>
            </motion.div>

            <motion.div 
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
            >
            {products.map((product) => {
              let displayPrice = product.minPrice || 0;
              if (displayPrice === 0) {
                const charCode = product.id.charCodeAt(0) || 0;
                displayPrice = 3500 + (charCode % 5) * 2000;
              }
              
              const brandName = product.brandName || '';
              const seriesName = product.seriesName || '';
              const modelName = product.name || '';
              const imageUrl = product.image;

              return (
                <motion.div 
                  key={product.id}
                  variants={itemUpVariants}
                  className="group flex flex-col bg-[#111113] border border-white/10 rounded-2xl overflow-hidden hover:border-[#00A7B5]/40 transition-all duration-300 shadow-xl"
                >
                  <div className="relative aspect-[4/3] bg-[#0A0A0C] flex items-center justify-center overflow-hidden p-4">
                    <Link href={`/shop/${product.id}`} className="absolute inset-0 z-0 flex items-center justify-center p-4">
                      {imageUrl ? (
                         <div className="relative w-full h-full flex items-center justify-center">
                           <img 
                             src={imageUrl} 
                             alt={modelName} 
                             className="w-full h-full object-contain brightness-[0.9] group-hover:scale-105 transition-transform duration-500 ease-out" 
                           />
                           <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 mix-blend-multiply opacity-60 pointer-events-none" />
                         </div>
                      ) : (
                         <Laptop className="w-20 h-20 text-white/20 group-hover:scale-105 transition-transform duration-500 ease-out" />
                      )}
                    </Link>
                    
                    <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                      <button 
                        onClick={(e) => { e.preventDefault(); removeFromWishlist(product.id); }} 
                        className="p-2.5 bg-black/80 backdrop-blur-md rounded-full border border-white/10 shadow-md hover:bg-rose-500/20 text-rose-400 transition-all cursor-pointer"
                        aria-label="Remove from Wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { 
                          e.preventDefault(); 
                          const defaultVariantId = product.variants?.[0]?.id || product.id;
                          if (defaultVariantId) toggleCart(defaultVariantId); 
                        }} 
                        className="p-2.5 bg-black/80 backdrop-blur-md rounded-full border border-white/10 shadow-md hover:bg-white/20 text-white transition-all cursor-pointer"
                        aria-label="Toggle Cart"
                      >
                        <ShoppingCart className={`w-4 h-4 ${cart.some(item => item.id === product.id || product.variants?.some((v:any) => v.id === item.id)) ? 'fill-[#00A7B5] text-[#00A7B5]' : 'text-white/80'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col p-5 gap-3 flex-1 justify-between bg-[#111113]">
                    <Link href={`/shop/${product.id}`} className="flex flex-col gap-1">
                      <span className="text-xs text-[#00A7B5] font-normal tracking-wide uppercase">{brandName || 'Device'}</span>
                      <h3 className="font-normal text-base text-white leading-snug group-hover:text-[#00A7B5] transition-colors line-clamp-2">
                        {brandName} {seriesName} {modelName}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[11px] text-white/40 uppercase tracking-wide">Guide Price</span>
                        <span className="font-medium text-base text-white">₹{displayPrice.toLocaleString()}</span>
                      </div>
                      <Link href={`/shop/${product.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 text-xs text-white/70 hover:text-white hover:bg-white/10 rounded-full px-3">
                          View Specs
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
