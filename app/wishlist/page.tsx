"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Laptop, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";

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

      const supabase = createClient();
      const { data, error } = await supabase
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
      
      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    }
    
    fetchWishlistItems();
  }, [wishlist]);

  const isEmpty = wishlist.length === 0;

  return (
    <div className="min-h-screen bg-white pt-28 pb-16">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
        <h1 className="text-[32px] font-bold tracking-tight text-[#111111] mb-2">Your Wishlist</h1>
        <p className="text-gray-500 mb-8">Items you've saved for later consideration.</p>

        {loading ? (
          <div className="py-12 flex items-center justify-center text-gray-500">Loading wishlist...</div>
        ) : isEmpty ? (
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mb-6">
              <Heart className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-[22px] font-bold text-[#111111] mb-2">Nothing here yet</h2>
            <p className="text-gray-500 mb-8 max-w-[400px]">
              Tap the heart icon on any device to save it to your wishlist and easily find it later.
            </p>
            <Link href="/shop">
              <Button className="h-12 px-8 bg-[#111111] hover:bg-[#222222] text-white rounded-full font-medium transition-all shadow-md">
                Explore Technology
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const variants = product.product_variants || [];
              let minPrice = variants.length > 0 ? Math.min(...variants.map((v: any) => v.selling_price || 0)) : 0;
              
              if (minPrice === 0) {
                const charCode = product.id.charCodeAt(0) || 0;
                minPrice = 3500 + (charCode % 5) * 2000;
              }
              
              const primaryImage = product.product_images?.find((i: any) => i.is_primary) || product.product_images?.[0];
              const brandName = product.brands?.name || '';
              const seriesName = product.series?.name || '';
              const modelName = product.name || '';

              return (
                <div key={product.id} className="group flex flex-col gap-4">
                  <div className="relative aspect-[4/3] bg-[#f8fafc] rounded-[16px] flex items-center justify-center overflow-hidden group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
                    <Link href={`/shop/${product.id}`} className="absolute inset-0 z-0 flex items-center justify-center">
                      {primaryImage ? (
                         <img src={primaryImage.image_url} alt={modelName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                      ) : (
                         <Laptop className="w-24 h-24 text-[#dddddd] group-hover:scale-105 transition-transform duration-500 ease-out" />
                      )}
                    </Link>
                    
                    <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                      <button 
                        onClick={(e) => { e.preventDefault(); removeFromWishlist(product.id); }} 
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                        aria-label="Remove from Wishlist"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                      <button 
                        onClick={(e) => { 
                          e.preventDefault(); 
                          const defaultVariant = product.product_variants?.[0];
                          if (defaultVariant) toggleCart(defaultVariant.id); 
                        }} 
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                        aria-label="Toggle Cart"
                      >
                        <ShoppingCart className={`w-4 h-4 ${cart.some(item => product.product_variants?.some((v:any) => v.id === item.id)) ? 'fill-[#00A7B5] text-[#00A7B5]' : 'text-gray-600'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link href={`/shop/${product.id}`} className="flex items-start justify-between gap-4">
                      <h3 className="font-semibold text-[16px] text-[#181d26] leading-tight group-hover:text-[#1b61c9] transition-colors">
                        {brandName} {seriesName} {modelName}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[15px] text-[#181d26]">Starting from ₹{minPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
