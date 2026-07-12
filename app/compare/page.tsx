"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/shared/Footer";
import { getShopProducts } from "@/app/actions/shop";
import { Laptop, X, ChevronLeft, ShoppingCart, Loader2, Plus } from "lucide-react";
import { useStore } from "@/lib/store";

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
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#00A7B5] mb-4" />
        <p className="text-gray-500">Loading comparison...</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] px-4">
        <Laptop className="w-16 h-16 text-gray-200 mb-6" />
        <h2 className="text-2xl font-bold text-surface-dark mb-3">Nothing to Compare</h2>
        <p className="text-gray-500 mb-8 max-w-md text-center">You haven't selected any products to compare. Head back to the shop to find products you're interested in.</p>
        <Link href="/shop" className="bg-[#111111] text-white px-8 py-3 rounded-xl font-medium hover:bg-black transition-colors">
          Browse Products
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
    <div className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-[120px] pb-24">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/shop" className="text-sm font-medium text-gray-500 hover:text-black transition-colors flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" />
          Back to Shop
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm font-medium text-black">Compare</span>
      </div>

      <h1 className="text-3xl font-bold text-surface-dark mb-10">Compare Products</h1>

      <div className="w-full overflow-x-auto custom-scrollbar pb-8">
        <div className="min-w-[800px] flex">
          
          {/* Label Column */}
          <div className="w-[200px] shrink-0 border-r border-gray-100 flex flex-col bg-white">
            <div className="h-[280px] p-6 border-b border-gray-100 sticky top-[80px] z-20 bg-white/95 backdrop-blur-sm flex flex-col justify-end">
              <span className="text-[13px] font-semibold text-gray-400 tracking-widest uppercase">Overview</span>
            </div>
          </div>

          {/* Product Columns - Always exactly 4 slots */}
          {Array.from({ length: 4 }).map((_, index) => {
            const product = products[index];

            if (!product) {
              return (
                <div key={`empty-${index}`} className="flex-1 min-w-[280px] max-w-[350px] border-r border-gray-100 flex flex-col bg-gray-50/30">
                  <div className="h-[280px] p-6 border-b border-gray-100 sticky top-[80px] z-20 bg-gray-50/80 backdrop-blur-sm flex flex-col items-center justify-center">
                    <Link href="/shop" className="flex flex-col items-center justify-center gap-4 group">
                      <div className="w-16 h-16 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center group-hover:border-[#00A7B5] group-hover:text-[#00A7B5] transition-colors">
                        <Plus className="w-6 h-6 text-gray-400 group-hover:text-[#00A7B5] transition-colors" />
                      </div>
                      <span className="text-sm font-medium text-gray-500 group-hover:text-[#00A7B5] transition-colors">Add Product</span>
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
              <div key={product.id} className="flex-1 min-w-[280px] max-w-[350px] border-r border-gray-100 flex flex-col relative bg-white group">
                <div className="h-[280px] p-6 border-b border-gray-100 sticky top-[80px] z-20 bg-white/95 backdrop-blur-sm flex flex-col">
                  
                  <button 
                    onClick={() => handleRemove(product.id)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors z-30 opacity-0 group-hover:opacity-100"
                    aria-label="Remove from comparison"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <Link href={`/shop/${product.id}`} className="flex-1 flex flex-col justify-between group/link">
                    <div className="h-[120px] mb-4 flex items-center justify-center">
                      {primaryImage ? (
                        <img src={primaryImage.url || primaryImage} alt={product.model} className="max-h-full max-w-full object-contain mix-blend-multiply group-hover/link:scale-105 transition-transform duration-300" />
                      ) : (
                        <Laptop className="w-16 h-16 text-gray-200" />
                      )}
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold text-[#00A7B5] mb-1 uppercase tracking-wider">{product.kc_brands?.name}</div>
                      <h3 className="text-[15px] font-medium text-surface-dark line-clamp-2 leading-snug group-hover/link:text-black transition-colors">{product.model} {product.cpu ? `- ${product.cpu}` : ''}</h3>
                    </div>
                  </Link>

                  <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-xl font-bold text-surface-dark">₹{minPrice.toLocaleString()}</span>
                    <button 
                      onClick={(e) => {
                        if (defaultVariant) handleAddToCart(e, defaultVariant.id);
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${inCart ? 'bg-[#00A7B5] text-white hover:bg-[#008f9b]' : 'bg-gray-50 text-surface-dark border border-gray-200 hover:bg-black hover:text-white hover:border-black'}`}
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
            <div className="min-w-[800px] flex bg-gray-50/80 border-b border-gray-100 py-3 px-6 sticky left-0">
              <span className="text-[14px] font-semibold text-surface-dark uppercase tracking-wide">{group}</span>
            </div>
            
            {Array.from(specGroups[group]).sort().map(attribute => (
              <div key={`${group}-${attribute}`} className="min-w-[800px] flex border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                <div className="w-[200px] shrink-0 border-r border-gray-100 p-4 pl-6 bg-white flex items-center sticky left-0 z-10 shadow-[1px_0_2px_rgb(0,0,0,0.02)]">
                  <span className="text-[13px] font-medium text-gray-600">{attribute}</span>
                </div>
                {Array.from({ length: 4 }).map((_, index) => {
                  const product = products[index];
                  return (
                    <div key={`${product?.id || `empty-${index}`}-${attribute}`} className="flex-1 min-w-[280px] max-w-[350px] border-r border-gray-100 p-4">
                      {product ? (
                        <span className="text-[13px] text-surface-dark leading-relaxed">{getSpecValue(product, group, attribute)}</span>
                      ) : (
                        <span className="text-[13px] text-gray-300">-</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}

      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-black">
      <Header variant="shop" />
      <Suspense fallback={
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#00A7B5]" />
        </div>
      }>
        <CompareContent />
      </Suspense>
      <Footer />
    </div>
  );
}
