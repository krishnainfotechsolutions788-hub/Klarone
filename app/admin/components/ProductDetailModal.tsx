import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { Product } from "@/types/inventory";
import { mockCategories, getProductStats, getDisplayImages } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Edit, FileText, Image as ImageIcon, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const [mainImageIdx, setMainImageIdx] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setMainImageIdx(0);
    }
  }, [isOpen, product]);

  if (!product) return null;

  const category = mockCategories.find(c => c.id === product.category_id);
  const stats = getProductStats(product.id);
  const images = getDisplayImages(product.id);
  const mainImage = images[mainImageIdx] || images[0];

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:!max-w-[650px] w-full p-0 flex flex-col bg-white border-l-[#e5e5e5]">
        
        {/* Header */}
        <div className="px-6 py-6 border-b border-[#f0f0f0] shrink-0">
          <h2 className="text-[22px] font-semibold text-[#111111] tracking-tight">
            {product.brand} {product.series} {product.model_name}
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide bg-[#fafafa]/30">
          <div className="flex flex-col gap-8">
            
            {/* Image Gallery */}
            <div className="flex flex-col gap-2">
              {images.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <div className="w-full h-[320px] rounded-[8px] bg-[#f5f5f5] overflow-hidden border border-[#e5e5e5]">
                    <img src={mainImage.image_url} alt={mainImage.alt_text || 'Product Main Image'} className="w-full h-full object-cover" />
                  </div>
                  {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                      {images.map((img, index) => (
                        <button 
                          key={index} 
                          onClick={() => setMainImageIdx(index)}
                          className={`w-[80px] h-[60px] shrink-0 rounded-[6px] overflow-hidden border-2 transition-colors ${mainImageIdx === index ? 'border-[#111111]' : 'border-transparent hover:border-[#dddddd]'}`}
                        >
                          <img src={img.image_url} alt={img.alt_text || `Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-[200px] rounded-[8px] bg-[#f5f5f5] border border-[#f0f0f0] flex flex-col items-center justify-center text-[#a3a3a3] gap-2">
                  <ImageIcon className="w-6 h-6" />
                  <span className="text-[13px]">No images available</span>
                </div>
              )}
            </div>

            {/* Section: Details */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-semibold text-[#111111]">Details</h3>
                <ChevronUp className="w-4 h-4 text-[#a3a3a3]" />
              </div>
              <div className="border border-[#e5e5e5] rounded-[8px] bg-white overflow-hidden">
                <div className="grid grid-cols-[140px_1fr] border-b border-[#e5e5e5] px-4 py-3.5 text-[13px]">
                  <span className="text-[#737373]">Product ID:</span>
                  <span className="font-medium text-[#111111]">{product.id}</span>
                </div>
                <div className="grid grid-cols-[140px_1fr] border-b border-[#e5e5e5] px-4 py-3.5 text-[13px]">
                  <span className="text-[#737373]">Brand:</span>
                  <span className="font-medium text-[#111111]">{product.brand}</span>
                </div>
                <div className="grid grid-cols-[140px_1fr] border-b border-[#e5e5e5] px-4 py-3.5 text-[13px]">
                  <span className="text-[#737373]">Series / Model:</span>
                  <span className="font-medium text-[#111111]">{product.series} {product.model_name}</span>
                </div>
                <div className="grid grid-cols-[140px_1fr] border-b border-[#e5e5e5] px-4 py-3.5 text-[13px]">
                  <span className="text-[#737373]">Category:</span>
                  <span className="font-medium text-[#111111]">{category?.name || '-'}</span>
                </div>
                <div className="grid grid-cols-[140px_1fr] border-b border-[#e5e5e5] px-4 py-3.5 text-[13px]">
                  <span className="text-[#737373]">Inventory Type:</span>
                  <span className="font-medium text-[#111111]">{product.inventory_type === 'SERIALIZED' ? 'Serialized' : 'Non-Serialized'}</span>
                </div>
                <div className="grid grid-cols-[140px_1fr] px-4 py-3.5 text-[13px]">
                  <span className="text-[#737373]">Status:</span>
                  <span className="font-medium text-[#047857] capitalize">{product.status}</span>
                </div>
              </div>
            </div>

            {/* Section: Stock & Pricing */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-semibold text-[#111111]">Stock & Pricing</h3>
                <ChevronUp className="w-4 h-4 text-[#a3a3a3]" />
              </div>
              <div className="border border-[#e5e5e5] rounded-[8px] bg-white overflow-hidden">
                <div className="grid grid-cols-[140px_1fr] border-b border-[#e5e5e5] px-4 py-3.5 text-[13px]">
                  <span className="text-[#737373]">Total Stock:</span>
                  <span className="font-medium text-[#111111]">{stats.totalUnits} Units</span>
                </div>
                <div className="grid grid-cols-[140px_1fr] border-b border-[#e5e5e5] px-4 py-3.5 text-[13px]">
                  <span className="text-[#737373]">Base Price:</span>
                  <span className="font-medium text-[#111111]">{product.base_price ? `₹${product.base_price.toLocaleString()}` : '-'}</span>
                </div>
                {product.rental_price && (
                  <div className="grid grid-cols-[140px_1fr] border-b border-[#e5e5e5] px-4 py-3.5 text-[13px]">
                    <span className="text-[#737373]">Rental Price / Mo:</span>
                    <span className="font-medium text-[#111111]">₹{product.rental_price.toLocaleString()}</span>
                  </div>
                )}
                <div className="grid grid-cols-[140px_1fr] px-4 py-3.5 text-[13px]">
                  <span className="text-[#737373]">Last Updated:</span>
                  <span className="font-medium text-[#111111]">{new Date(product.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Section: Description */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-semibold text-[#111111]">Description</h3>
                <ChevronUp className="w-4 h-4 text-[#a3a3a3]" />
              </div>
              <div className="border border-[#e5e5e5] rounded-[8px] bg-white px-4 py-3.5 text-[13px] text-[#41454d] leading-relaxed">
                {product.description || 'No description provided.'}
              </div>
            </div>

            {/* Specifications */}
            {product?.specifications && Object.entries(product.specifications).map(([sectionTitle, specs]) => (
              <div key={sectionTitle} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-[15px] font-semibold text-[#111111]">{sectionTitle}</h3>
                  <ChevronUp className="w-4 h-4 text-[#a3a3a3]" />
                </div>
                <div className="border border-[#e5e5e5] rounded-[8px] bg-white overflow-hidden">
                  {Object.entries(specs).map(([key, value], index, arr) => (
                    <div key={key} className={`grid grid-cols-[140px_1fr] px-4 py-3.5 text-[13px] ${index !== arr.length - 1 ? 'border-b border-[#e5e5e5]' : ''}`}>
                      <span className="text-[#737373]">{key}:</span>
                      <span className="font-medium text-[#111111]">{Array.isArray(value) ? value.join(', ') : value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#f0f0f0] bg-white flex items-center gap-3 shrink-0">
          <Button variant="outline" className="flex-1 h-10 rounded-[6px] border-[#e5e5e5] bg-white text-[#111111] hover:bg-[#f5f5f5] text-[13px] font-medium flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" /> View Public Page
          </Button>
          <Button className="flex-1 h-10 rounded-[6px] bg-[#6366f1] hover:bg-[#4f46e5] text-white text-[13px] font-medium flex items-center justify-center gap-2">
            <Edit className="w-4 h-4" /> Edit Product
          </Button>
        </div>

      </SheetContent>
    </Sheet>
  );
}
