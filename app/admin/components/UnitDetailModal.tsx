import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { InventoryUnit } from "@/types/inventory";
import { mockProducts, mockVariants, mockCategories, getDisplayImages } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Edit, FileText, Image as ImageIcon, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

interface UnitDetailModalProps {
  unit: InventoryUnit | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UnitDetailModal({ unit, isOpen, onClose }: UnitDetailModalProps) {
  const [mainImageIdx, setMainImageIdx] = useState(0);

  // Reset image index when a new unit is opened
  useEffect(() => {
    if (isOpen) {
      setMainImageIdx(0);
    }
  }, [isOpen, unit]);

  if (!unit) return null;

  const product = mockProducts.find(p => p.id === unit.product_id);
  const variant = mockVariants.find(v => v.id === unit.variant_id);
  const category = mockCategories.find(c => c.id === product?.category_id);
  const images = getDisplayImages(unit.product_id, unit.variant_id, unit.id);
  const mainImage = images[mainImageIdx] || images[0];

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-[500px]! w-full p-0 flex flex-col bg-white border-l-[#e5e5e5]">
        
        {/* Header */}
        <div className="px-6 py-6 border-b border-[#f0f0f0] shrink-0">
          <h2 className="text-[22px] font-semibold text-surface-dark tracking-tight">
            {product?.brand} {product?.series} {product?.model_name}
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide bg-[#fafafa]/30">
          <div className="flex flex-col gap-8">
            
            {/* Image Gallery */}
            <div className="flex flex-col gap-2">
              {images.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {/* Hero Image */}
                  <div className="w-full h-[320px] rounded-[8px] bg-[#f5f5f5] overflow-hidden border border-[#e5e5e5]">
                    <img src={mainImage.image_url} alt={mainImage.alt_text || 'Unit Main Image'} className="w-full h-full object-cover" />
                  </div>
                  {/* Thumbnails */}
                  {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                      {images.map((img, index) => (
                        <button 
                          key={index} 
                          onClick={() => setMainImageIdx(index)}
                          className={`w-[80px] h-[60px] shrink-0 rounded-[6px] overflow-hidden border-2 transition-colors ${mainImageIdx === index ? 'border-surface-dark' : 'border-transparent hover:border-hairline'}`}
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
                <h3 className="text-[15px] font-semibold text-surface-dark">Details</h3>
                <ChevronUp className="w-4 h-4 text-[#a3a3a3]" />
              </div>
              <div className="border border-[#e5e5e5] rounded-[8px] bg-white overflow-hidden">
                <div className="grid grid-cols-[140px_1fr] border-b border-[#e5e5e5] px-4 py-3.5 text-[13px]">
                  <span className="text-[#737373]">Inventory Code:</span>
                  <span className="font-medium text-surface-dark">{unit.inventory_code}</span>
                </div>
                <div className="grid grid-cols-[140px_1fr] border-b border-[#e5e5e5] px-4 py-3.5 text-[13px]">
                  <span className="text-[#737373]">Serial Number:</span>
                  <span className="font-medium text-surface-dark">{unit.serial_number}</span>
                </div>
                <div className="grid grid-cols-[140px_1fr] border-b border-[#e5e5e5] px-4 py-3.5 text-[13px]">
                  <span className="text-[#737373]">Category:</span>
                  <span className="font-medium text-surface-dark">{category?.name || '-'}</span>
                </div>
                <div className="grid grid-cols-[140px_1fr] px-4 py-3.5 text-[13px]">
                  <span className="text-[#737373]">Condition:</span>
                  <span className="font-medium text-surface-dark capitalize">{unit.condition_grade.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            {/* Section: Specs */}
            {variant && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-[15px] font-semibold text-surface-dark">Specs</h3>
                  <ChevronUp className="w-4 h-4 text-[#a3a3a3]" />
                </div>
                <div className="border border-[#e5e5e5] rounded-[8px] bg-white overflow-hidden">
                  <div className="grid grid-cols-[140px_1fr] border-b border-[#e5e5e5] px-4 py-3.5 text-[13px]">
                    <span className="text-[#737373]">Processor:</span>
                    <span className="font-medium text-surface-dark">{variant.cpu || '-'}</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] border-b border-[#e5e5e5] px-4 py-3.5 text-[13px]">
                    <span className="text-[#737373]">Memory (RAM):</span>
                    <span className="font-medium text-surface-dark">{variant.ram || '-'}</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] border-b border-[#e5e5e5] px-4 py-3.5 text-[13px]">
                    <span className="text-[#737373]">Storage:</span>
                    <span className="font-medium text-surface-dark">{variant.ssd || '-'}</span>
                  </div>
                  {unit.battery_health !== undefined && (
                    <div className="grid grid-cols-[140px_1fr] px-4 py-3.5 text-[13px]">
                      <span className="text-[#737373]">Battery Health:</span>
                      <span className="font-medium text-surface-dark">{unit.battery_health}%</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Section: Pricing */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-semibold text-surface-dark">Pricing</h3>
                <ChevronUp className="w-4 h-4 text-[#a3a3a3]" />
              </div>
              <div className="border border-[#e5e5e5] rounded-[8px] bg-white overflow-hidden">
                <div className="grid grid-cols-2 border-b border-[#e5e5e5] px-4 py-3 text-[12px] text-[#737373] bg-[#fafafa]">
                  <span>Type</span>
                  <span>Amount</span>
                </div>
                <div className="grid grid-cols-2 border-b border-[#e5e5e5] px-4 py-3.5 text-[13px]">
                  <span className="font-medium text-surface-dark">Selling Price</span>
                  <span className="font-medium text-surface-dark">₹{unit.selling_price.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-2 border-b border-[#e5e5e5] px-4 py-3.5 text-[13px]">
                  <span className="text-[#737373]">Purchase Price</span>
                  <span className="font-medium text-surface-dark">₹{unit.purchase_price.toLocaleString()}</span>
                </div>
                {unit.rental_price && (
                  <div className="grid grid-cols-2 px-4 py-3.5 text-[13px]">
                    <span className="text-[#737373]">Rental Price / Mo</span>
                    <span className="font-medium text-surface-dark">₹{unit.rental_price.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Section: Notes */}
            {unit.notes && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-[15px] font-semibold text-surface-dark">Notes</h3>
                  <ChevronUp className="w-4 h-4 text-[#a3a3a3]" />
                </div>
                <div className="border border-[#e5e5e5] rounded-[8px] bg-white px-4 py-3.5 text-[13px] text-[#41454d] leading-relaxed">
                  {unit.notes}
                </div>
              </div>
            )}

            {/* Specifications */}
            {product?.specifications && Object.entries(product.specifications).map(([sectionTitle, specs]) => (
              <div key={sectionTitle} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-[15px] font-semibold text-surface-dark">{sectionTitle}</h3>
                  <ChevronUp className="w-4 h-4 text-[#a3a3a3]" />
                </div>
                <div className="border border-[#e5e5e5] rounded-[8px] bg-white overflow-hidden">
                  {Object.entries(specs).map(([key, value], index, arr) => (
                    <div key={key} className={`grid grid-cols-[140px_1fr] px-4 py-3.5 text-[13px] ${index !== arr.length - 1 ? 'border-b border-[#e5e5e5]' : ''}`}>
                      <span className="text-[#737373]">{key}:</span>
                      <span className="font-medium text-surface-dark">{Array.isArray(value) ? value.join(', ') : value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#f0f0f0] bg-[#fafafa] flex items-center gap-3 shrink-0">
          <Button variant="outline" className="flex-1 h-10 rounded-[6px] border-[#e5e5e5] bg-white text-surface-dark hover:bg-[#f5f5f5] text-[13px] font-medium flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" /> Download Report
          </Button>
          <Button className="flex-1 h-10 rounded-[6px] bg-[#6366f1] hover:bg-[#4f46e5] text-white text-[13px] font-medium flex items-center justify-center gap-2">
            <Edit className="w-4 h-4" /> Edit Details
          </Button>
        </div>

      </SheetContent>
    </Sheet>
  );
}
