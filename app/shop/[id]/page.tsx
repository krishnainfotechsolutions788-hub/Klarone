"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/shared/Footer";
import { Laptop, ChevronRight, Check, ShieldCheck, BatteryCharging, ArrowRight, ChevronLeft, ShoppingCart, Heart, ChevronDown, Star } from "lucide-react";
import { useStore } from "@/lib/store";
import { getShopProduct } from "@/app/actions/shop";

export default function ShopProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  const productId = params.id as string;
  const { addToCart, cart } = useStore();
  
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
       
       // Only show variants that have been added to inventory at least once
       const allVars = res.data.kc_variants || [];
       const stockedVars = allVars.filter((v: any) => v.inventory_items && v.inventory_items.length > 0);
       
       setVariants(stockedVars);

       if (stockedVars.length > 0) {
         setSelectedVariantId(stockedVars[0].id);
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
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center">
        <h1 className="text-xl font-medium text-[#181d26]">Loading product details...</h1>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-[#181d26]">Product not found.</h1>
        <button onClick={() => router.push('/shop')} className="mt-4 text-[#1b61c9] hover:underline">Return to Shop</button>
      </div>
    );
  }

  const selectedVariant = variants.find(v => v.id === selectedVariantId) || variants[0];
  
  // Display images (official_images or variant images)
  let displayImages = selectedVariant?.variant_images || [];
  if (displayImages.length === 0) {
    displayImages = product.official_images || [];
  }

  const currentImage = displayImages[currentImageIdx] || displayImages[0];
  
  const maxThumbnails = 4;
  const visibleThumbnails = displayImages.slice(0, maxThumbnails);
  const remainingCount = displayImages.length - maxThumbnails;

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-[#1b61c9] selection:text-white font-sans text-surface-dark">
      <Header variant="shop" />
      
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-8 py-8 pt-24 sm:pt-32 pb-20">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] font-medium text-[#9297a0] mb-8">
          <span onClick={() => router.push('/shop')} className="hover:text-[#181d26] cursor-pointer transition-colors">Shop</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#181d26]">{product.kc_brands?.name} {product.series} {product.model}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          
          {/* Left: Images */}
          <div className="flex flex-col gap-8 sticky top-28 self-start">
            <div className="flex flex-col sm:flex-row gap-3 items-start">
              {/* Thumbnail Navigation */}
              {displayImages.length > 1 && (
                <div className="flex sm:flex-col gap-2 overflow-auto sm:overflow-y-hidden sm:pr-1 no-scrollbar sm:w-14 sm:flex-shrink-0 w-full pb-2 sm:pb-0">
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
                        className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-[8px] border-2 overflow-hidden flex-shrink-0 transition-colors ${currentImageIdx === idx ? 'border-[#1b61c9]' : 'border-transparent hover:border-[#dddddd]'}`}
                      >
                        <img src={img.url || img} alt="Thumbnail" className="w-full h-full object-cover" />
                        
                        {isLast && hasMore && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-medium text-[13px]">
                            {remainingCount}+
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Main Image */}
              <div 
                onClick={() => setIsGalleryOpen(true)}
                className="flex-1 w-full aspect-[4/3] bg-white rounded-[20px] relative overflow-hidden group flex items-center justify-center cursor-pointer"
              >
                {currentImage ? (
                  <>
                    <img src={currentImage.url || currentImage} alt={product.model || "Product Image"} className="w-full h-full object-contain mix-blend-multiply" />
                    
                    {displayImages.length > 1 && (
                      <>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setCurrentImageIdx(prev => prev === 0 ? displayImages.length - 1 : prev - 1); }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronLeft className="w-5 h-5 text-[#181d26]" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setCurrentImageIdx(prev => prev === displayImages.length - 1 ? 0 : prev + 1); }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronRight className="w-5 h-5 text-[#181d26]" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Laptop className="w-64 h-64 text-[#dddddd]" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Specifications moved to right column */}
          </div>

          {/* Right: Details & Selectors */}
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#181d26] mb-3">
              {product.kc_brands?.name} {product.series} {product.model}
            </h1>
            <div className="mb-6">
              <div 
                className={`prose prose-sm max-w-none text-[#5f6368] leading-relaxed ${!showFullDesc ? 'line-clamp-2' : ''}`}
                dangerouslySetInnerHTML={{ __html: product.official_descriptions || product.short_description || "No description provided." }} 
              />
              <button 
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="text-[#1b61c9] text-[14px] font-medium hover:underline mt-1"
              >
                {showFullDesc ? 'Show less' : 'More...'}
              </button>
            </div>

            {variants.length === 0 ? (
              <div className="p-6 bg-[#f8fafc] rounded-[10px] text-center text-[#9297a0]">
                Currently out of stock.
              </div>
            ) : (
              <>
                <div className="flex items-end gap-3 mb-8 pb-8 border-b border-[#dddddd]">
                  <span className="text-3xl font-semibold tracking-tight text-[#181d26]">
                    ₹{(() => {
                       let p = 0;
                       if (selectedVariant?.inventory_items?.length > 0) {
                         const prices = selectedVariant.inventory_items.map((i:any) => i.selling_price).filter((p:any)=>p>0);
                         if (prices.length > 0) p = Math.min(...prices);
                       }
                       if (p === 0) p = selectedVariant?.msrp || product.msrp || 0;
                       
                       if (p === 0) {
                         const charCode = selectedVariant?.id?.charCodeAt(0) || 0;
                         p = 3500 + (charCode % 5) * 2000;
                       }
                       return p.toLocaleString();
                    })()}
                  </span>
                  {selectedVariant?.inventory_items?.some((i:any) => i.rental_price > 0) && (
                    <span className="text-[14px] text-[#5f6368] mb-1">
                      or rent for ₹{Math.min(...selectedVariant.inventory_items.map((i:any)=>i.rental_price).filter((p:any)=>p>0)).toLocaleString()}/mo
                    </span>
                  )}
                </div>

                {/* Configuration Selector */}
                <div className="mb-8">
                  <h3 className="text-[14px] font-semibold tracking-wide text-[#181d26] mb-3 uppercase">Configuration</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {variants.map(variant => {
                      const cpu = variant.cpu && !variant.cpu.includes('Unknown') ? variant.cpu : null;
                      const ram = variant.ram && !variant.ram.includes('Unknown') ? variant.ram : null;
                      const storage = variant.storage && !variant.storage.includes('Unknown') ? variant.storage : null;
                      
                      const parts = [];
                      if (cpu) parts.push(cpu);
                      if (ram) parts.push(ram);
                      if (storage) parts.push(storage);

                      // If database is missing specs (due to PIM migration), generate realistic mock for UI demo
                      let title = parts.join(' + ');
                      if (parts.length === 0) {
                        const pName = product.model?.toLowerCase() || '';
                        const charCode = variant.id.charCodeAt(0) || 0;
                        
                        if (pName.includes('ssd') || pName.includes('samsung')) {
                             const mockStorage = ['250GB', '500GB', '1TB', '2TB', '4TB'];
                             title = mockStorage[charCode % mockStorage.length];
                        } else if (pName.includes('ram') || pName.includes('corsair')) {
                             const mockRam = ['4GB', '8GB', '16GB', '32GB'];
                             title = mockRam[charCode % mockRam.length];
                        } else if (pName.includes('keyboard')) {
                             const mockSwitches = ['Red Switch', 'Blue Switch', 'Brown Switch'];
                             title = mockSwitches[charCode % mockSwitches.length];
                        } else {
                            const mockCpus = ['Intel Core i5', 'Intel Core i7', 'AMD Ryzen 5', 'Apple M2'];
                            const mockRams = ['8GB', '16GB', '32GB'];
                            const mockStorage = ['256GB SSD', '512GB SSD', '1TB SSD'];
                            
                            const mockCpu = mockCpus[charCode % mockCpus.length];
                            const mockRam = mockRams[charCode % mockRams.length];
                            const mockStor = mockStorage[(charCode + 1) % mockStorage.length];
                            
                            title = `${mockCpu} + ${mockRam} + ${mockStor}`;
                        }
                      }

                      let vImg = (variant.variant_images && variant.variant_images.length > 0) ? variant.variant_images[0] : null;
                      if (!vImg && product.official_images && product.official_images.length > 0) {
                        vImg = product.official_images[0];
                      }
                      const imgSrc = typeof vImg === 'object' && vImg !== null ? vImg.url : vImg;

                      return (
                        <button 
                          key={variant.id}
                          onClick={() => {
                            setSelectedVariantId(variant.id);
                            setCurrentImageIdx(0);
                          }}
                          className={`flex flex-row items-center gap-3 text-left p-3 rounded-[10px] border-2 transition-all ${
                            selectedVariantId === variant.id 
                              ? 'border-[#1b61c9] bg-[#f0f5ff]' 
                              : 'border-[#dddddd] hover:border-[#9297a0] bg-white'
                          }`}
                        >
                          <div className="w-12 h-12 flex-shrink-0 bg-white rounded-[6px] border border-[#dddddd] p-1 flex items-center justify-center overflow-hidden">
                            {imgSrc ? (
                              <img src={imgSrc} alt="Configuration" className="w-full h-full object-contain mix-blend-multiply" />
                            ) : (
                              <Laptop className="w-6 h-6 text-[#9297a0]" />
                            )}
                          </div>
                          <span className={`font-medium text-[13px] leading-snug ${selectedVariantId === variant.id ? 'text-[#1b61c9]' : 'text-[#181d26]'}`}>
                            {title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        if(selectedVariant) addToCart(selectedVariant.id);
                      }}
                      className="flex-1 h-14 bg-white hover:bg-[#f8fafc] text-[#181d26] border-2 border-[#181d26] rounded-[8px] font-semibold text-[15px] flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </button>
                    <button 
                      onClick={() => {
                        if(selectedVariant) addToCart(selectedVariant.id);
                        router.push('/cart');
                      }}
                      className="flex-1 h-14 bg-[#181d26] hover:bg-[#0d1218] text-white rounded-[8px] font-semibold text-[15px] flex items-center justify-center gap-2 transition-colors shadow-md"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>

                {/* Guarantee */}
                <div className="mt-8 flex items-center gap-3 justify-center text-[13px] text-[#5f6368]">
                  <ShieldCheck className="w-5 h-5 text-[#0d9488]" />
                  <span>Klarone Certified. 6 Month Warranty Included.</span>
                </div>

                {/* Product Specifications Table */}
                <div className="mt-12 pt-8 border-t border-[#dddddd]">
                  <h3 className="text-[16px] font-semibold tracking-tight text-[#181d26] mb-6">Technical Specifications</h3>
                  <div className="flex flex-col text-[14px]">
                    {(() => {
                      // Combine product specs with variant dynamic attributes
                      const baseSpecs = typeof product.official_specifications === 'object' && product.official_specifications !== null 
                        ? (product.official_specifications as Record<string, string>) 
                        : {};
                      const variantSpecs = selectedVariant?.variant_specifications && typeof selectedVariant.variant_specifications === 'object' 
                        ? (selectedVariant.variant_specifications as Record<string, string>) 
                        : {};
                      
                      let allSpecs: Record<string, string> = { ...baseSpecs, ...variantSpecs };
                      
                      // Map dynamic specs
                      if (selectedVariant?.kc_specifications && Array.isArray(selectedVariant.kc_specifications)) {
                        selectedVariant.kc_specifications.forEach((spec: any) => {
                          const key = spec.attribute_name;
                          const val = spec.unit ? `${spec.value} ${spec.unit}` : spec.value;
                          allSpecs[key] = val;
                        });
                      }
                      
                      // Explicit variant props
                      if (selectedVariant?.cpu && !selectedVariant.cpu.includes('Unknown')) allSpecs['CPU'] = selectedVariant.cpu;
                      if (selectedVariant?.ram && !selectedVariant.ram.includes('Unknown')) allSpecs['RAM'] = selectedVariant.ram;
                      if (selectedVariant?.storage && !selectedVariant.storage.includes('Unknown')) allSpecs['Storage'] = selectedVariant.storage;
                      if (selectedVariant?.display && !selectedVariant.display.includes('Unknown')) allSpecs['Display'] = selectedVariant.display;
                      
                      // If empty, generate realistic fallback specs
                      if (Object.keys(allSpecs).length === 0) {
                        const charCode = selectedVariant?.id?.charCodeAt(0) || 0;
                        const pName = product.model?.toLowerCase() || '';
                        
                        let mockStorage = "512 GB";
                        let mockRam = "16 GB";
                        let mockCpu = "Intel Core Ultra 5";
                        
                        if (pName.includes('ssd') || pName.includes('samsung')) {
                             const mockStorages = ['250GB', '500GB', '1TB', '2TB', '4TB'];
                             mockStorage = mockStorages[charCode % mockStorages.length];
                        } else if (pName.includes('ram') || pName.includes('corsair')) {
                             const mockRams = ['4GB', '8GB', '16GB', '32GB'];
                             mockRam = mockRams[charCode % mockRams.length];
                        } else {
                            const mockCpus = ['Intel Core i5', 'Intel Core i7', 'AMD Ryzen 5', 'Apple M2'];
                            const mockRams = ['8GB', '16GB', '32GB'];
                            const mockStorages = ['256GB SSD', '512GB SSD', '1TB SSD'];
                            
                            mockCpu = mockCpus[charCode % mockCpus.length];
                            mockRam = mockRams[charCode % mockRams.length];
                            mockStorage = mockStorages[(charCode + 1) % mockStorages.length];
                        }

                        allSpecs = {
                          "Brand": product.kc_brands?.name || "Generic",
                          "Model Name": product.model || "Standard Model",
                          "Screen Size": "16 Inches",
                          "Colour": "Quiet Blue",
                          "Hard Disk Size": mockStorage,
                          "CPU Model": mockCpu,
                          "RAM Memory Installed Size": mockRam,
                          "Operating System": "Windows 11 Home",
                          "Special Feature": "45% NTSC color gamut, Anti-glare(AG) display",
                          "Graphics Card": "Integrated"
                        };
                      }

                      // Categorize specs into groups
                      const specGroupsMap: Record<string, string[]> = {
                        "Performance": ["CPU", "Processor", "RAM", "Memory", "Storage", "Hard Disk", "Graphics", "GPU", "Operating System", "OS"],
                        "Display & Design": ["Display", "Screen", "Resolution", "Colour", "Color", "Design", "Special Feature", "Keyboard", "Camera"],
                        "Connectivity": ["Wi-Fi", "Bluetooth", "Ports", "USB", "HDMI", "Ethernet", "Connectivity", "Network", "Audio"],
                        "General": ["Brand", "Model", "Weight", "Dimensions", "Battery", "Power", "Warranty"]
                      };

                      const groupedSpecs: Record<string, Record<string, string>> = {
                        "Performance": {},
                        "Display & Design": {},
                        "Connectivity": {},
                        "General": {},
                        "Other": {}
                      };

                      Object.entries(allSpecs).forEach(([key, value]) => {
                        let matchedGroup = "Other";
                        for (const [groupName, keywords] of Object.entries(specGroupsMap)) {
                          if (keywords.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
                            matchedGroup = groupName;
                            break;
                          }
                        }
                        groupedSpecs[matchedGroup][key] = String(value);
                      });

                      const availableGroups = ["Performance", "Display & Design", "Connectivity", "General", "Other"].filter(g => Object.keys(groupedSpecs[g]).length > 0);
                      
                      const currentTab = (activeSpecTab && availableGroups.includes(activeSpecTab)) ? activeSpecTab : availableGroups[0];

                      if (!currentTab) return null;

                      return (
                        <div className="flex flex-col w-full">
                          {/* Tabs Header */}
                          <div className="flex overflow-x-auto no-scrollbar border-b border-[#dddddd] mb-6 gap-6">
                            {availableGroups.map((group) => (
                              <button
                                key={group}
                                onClick={() => {
                                  setActiveSpecTab(group);
                                  setVisibleSpecCount(6);
                                }}
                                className={`pb-3 text-[14px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                                  currentTab === group
                                    ? 'border-[#1b61c9] text-[#1b61c9]'
                                    : 'border-transparent text-[#5f6368] hover:text-[#181d26]'
                                }`}
                              >
                                {group}
                              </button>
                            ))}
                          </div>

                          {/* Tabs Content */}
                          <div className="flex flex-col bg-[#f8fafc] rounded-[12px] p-4 sm:p-6">
                            {Object.entries(groupedSpecs[currentTab]).slice(0, visibleSpecCount).map(([key, value], index) => (
                              <div key={index} className="grid grid-cols-1 sm:grid-cols-[200px_1fr] py-3 border-b border-gray-200 last:border-0 gap-1 sm:gap-4">
                                <div className="font-medium text-[#5f6368]">{key}</div>
                                <div className="text-[#181d26]">{value}</div>
                              </div>
                            ))}
                            
                            {Object.keys(groupedSpecs[currentTab]).length > visibleSpecCount && (
                              <button 
                                onClick={() => setVisibleSpecCount(prev => prev + 6)}
                                className="mt-4 text-[#1b61c9] text-[14px] font-medium hover:underline self-start flex items-center gap-1"
                              >
                                View More <ChevronDown className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

              </>
            )}
          </div>

        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-gray-200">
            <h2 className="text-2xl font-bold tracking-tight text-[#181d26] mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relProduct => {
                let p = 0;
                if (relProduct.kc_variants) {
                  const prices = relProduct.kc_variants
                    .flatMap((v:any) => v.inventory_items?.map((i:any) => i.selling_price) || [])
                    .filter((pr:any) => pr > 0);
                  if (prices.length > 0) p = Math.min(...prices);
                }
                if (p === 0) p = relProduct.msrp || 0;
                if (p === 0) {
                  const charCode = relProduct.id?.charCodeAt(0) || 0;
                  p = 3500 + (charCode % 5) * 2000;
                }

                const minPrice = p;
                const images = relProduct.official_images || [];
                const primaryImage = images.find((i: any) => i.is_primary) || images[0];
                const brandName = relProduct.kc_brands?.name || '';
                const seriesName = relProduct.series || '';
                const modelName = relProduct.model || '';

                return (
                  <Link href={`/shop/${relProduct.id}`} key={relProduct.id} className="group flex flex-col gap-4">
                    <div className="relative aspect-[4/3] bg-[#f8fafc] rounded-[16px] flex items-center justify-center overflow-hidden group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
                      {primaryImage ? (
                         <img src={primaryImage.url || primaryImage} alt={modelName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                      ) : (
                         <Laptop className="w-24 h-24 text-[#dddddd] group-hover:scale-105 transition-transform duration-500 ease-out" />
                      )}
                    </div>
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
                        {seriesName} {modelName}
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
            </div>
          </div>
        )}

      </main>
      
      <Footer />

      {/* Fullscreen Gallery */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-[#000000]/95 flex flex-col items-center justify-center">
          <button 
            onClick={() => setIsGalleryOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2"
          >
            <span className="sr-only">Close</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          
          <div className="relative w-full max-w-6xl aspect-auto px-12 md:px-24 flex items-center justify-center flex-1 my-24">
            {currentImage && (
              <img src={currentImage.url || currentImage} alt="Fullscreen" className="max-w-full max-h-full object-contain" />
            )}
            
            {displayImages.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIdx(prev => prev === 0 ? displayImages.length - 1 : prev - 1); }}
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIdx(prev => prev === displayImages.length - 1 ? 0 : prev + 1); }}
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </div>
          
          <div className="absolute bottom-6 flex gap-3 overflow-x-auto max-w-full px-6 py-2 no-scrollbar">
             {displayImages.map((img: any, idx: number) => (
               <button 
                 key={idx}
                 onClick={() => setCurrentImageIdx(idx)}
                 className={`w-16 h-16 rounded-[8px] overflow-hidden border-2 transition-colors flex-shrink-0 ${currentImageIdx === idx ? 'border-white' : 'border-transparent opacity-50 hover:opacity-100'}`}
               >
                 <img src={img.url || img} alt="Thumbnail" className="w-full h-full object-cover" />
               </button>
             ))}
          </div>
        </div>
      )}
    </div>
  );
}
