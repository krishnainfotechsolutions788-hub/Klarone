"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Save, Loader2, Package } from "lucide-react";
import { getV2KnowledgeMaster } from '@/app/actions/knowledge';
import { addInventoryItem } from '@/app/actions/inventory';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Tag, Layers, CheckCircle2 } from "lucide-react";

function AddInventoryForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kc_id = searchParams.get('kc_id');
  const [isClient, setIsClient] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [masterData, setMasterData] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    variantId: '',
    inventoryMode: 'serialized',
    serialNumber: '',
    quantity: 1,
    condition: 'New',
    purchasePrice: '',
    sellingPrice: ''
  });

  useEffect(() => {
    setIsClient(true);
    if (kc_id) {
      getV2KnowledgeMaster(kc_id).then(res => {
        if (res.success && res.data) {
          setMasterData(res.data.master);
          const variantList = res.data.variants || (res.data.variant ? [res.data.variant] : []);
          setVariants(variantList);
          if (variantList.length > 0) {
             setFormData(prev => ({ ...prev, variantId: variantList[0].id }));
          }
        } else {
          alert("Knowledge product not found");
          router.push('/admin/product');
        }
      });
    } else {
       router.push('/admin/product');
    }
  }, [kc_id, router]);

  const handleSave = async () => {
    if (!formData.variantId) {
      alert("Please select a variant.");
      return;
    }
    
    try {
      setIsPublishing(true);
      const res = await addInventoryItem({
        variantId: formData.variantId,
        inventoryMode: formData.inventoryMode,
        serialNumber: formData.serialNumber,
        quantity: formData.inventoryMode === 'quantity' ? Number(formData.quantity) : 1,
        condition: formData.condition,
        purchasePrice: Number(formData.purchasePrice),
        sellingPrice: Number(formData.sellingPrice)
      });

      if (!res.success) throw new Error(res.error);

      alert("Inventory Added Successfully!");
      router.push('/admin/product');
    } catch (e: any) {
      console.error(e);
      alert("Error adding inventory: " + e.message);
    } finally {
      setIsPublishing(false);
    }
  };

  if (!isClient || !masterData) return (
    <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
  );

  return (
    <div className="w-full space-y-6 pb-24 mt-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-[#dddddd] pb-6 gap-4">
        <div>
          <button 
            onClick={() => router.push('/admin/product')}
            className="flex items-center text-[13px] text-[#5f6368] hover:text-[#181d26] transition-colors mb-3 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Back to Inventory
          </button>
          <h1 className="text-[24px] font-bold font-sora text-[#181d26] tracking-tight">Add Physical Stock</h1>
          <p className="text-[#5f6368] text-[14px] mt-1.5 max-w-2xl leading-relaxed">
            Configure and stock inventory for <span className="font-semibold text-[#181d26]">{masterData.kc_brands?.name} {masterData.model}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outline" onClick={() => router.push('/admin/product')} className="border-[#dddddd] text-[#181d26] hover:bg-[#f8fafc] shadow-none">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPublishing} className="bg-[#181d26] hover:bg-[#0d1218] text-white shadow-none px-6">
            {isPublishing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2"/>} 
            Save to Inventory
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Form Sections */}
        <div className="md:col-span-2 space-y-6">
          
          <Card className="border-[#dddddd] shadow-none rounded-[10px] overflow-hidden">
            <CardHeader className="bg-[#f8fafc] border-b border-[#dddddd] py-4 px-5">
              <CardTitle className="text-[14px] font-semibold text-[#181d26] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#5f6368]" />
                1. Select Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="space-y-3">
                <Label className="text-[13px] text-[#5f6368]">Which variant are you stocking?</Label>
                <div className="grid grid-cols-1 gap-3">
                  {variants.map(v => (
                    <div 
                      key={v.id} 
                      className={`relative p-4 border rounded-[8px] cursor-pointer transition-all ${
                        formData.variantId === v.id 
                          ? 'border-[#1b61c9] bg-[#f0f6ff] ring-1 ring-[#1b61c9]' 
                          : 'border-[#dddddd] hover:border-[#9297a0] hover:bg-[#f8fafc]'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, variantId: v.id }))}
                    >
                      {formData.variantId === v.id && (
                        <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-[#1b61c9]" />
                      )}
                      <div className="flex items-center gap-4 pr-8">
                        <div className={`w-10 h-10 rounded-[6px] flex items-center justify-center shrink-0 ${
                          formData.variantId === v.id ? 'bg-[#1b61c9]/10 text-[#1b61c9]' : 'bg-[#f0f2f5] text-[#9297a0]'
                        }`}>
                          <Package className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <div className={`font-medium text-[14px] ${formData.variantId === v.id ? 'text-[#1b61c9]' : 'text-[#181d26]'}`}>
                            {v.cpu || v.ram || v.storage 
                              ? [v.cpu, v.ram, v.storage].filter(Boolean).join(' • ')
                              : (v.sku ? `SKU: ${v.sku}` : 'Default Configuration')
                            }
                          </div>
                          <div className="text-[12px] text-[#5f6368] mt-0.5">
                            Standard MSRP: ₹{v.selling_price || masterData?.msrp || 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {variants.length === 0 && <div className="text-[13px] text-[#d92d20] p-4 bg-[#fdf2f2] rounded-[6px] border border-[#fecdca]">No variants found for this product. You must add variants in the Master Catalog first.</div>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#dddddd] shadow-none rounded-[10px] overflow-hidden">
            <CardHeader className="bg-[#f8fafc] border-b border-[#dddddd] py-4 px-5">
              <CardTitle className="text-[14px] font-semibold text-[#181d26] flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#5f6368]" />
                2. Physical Stock Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <Label className="text-[13px] font-medium text-[#41454d]">Inventory Mode <span className="text-[#d92d20]">*</span></Label>
                  <select 
                    className="w-full h-10 px-3 rounded-[6px] border border-[#dddddd] bg-white text-[13px] text-[#181d26] outline-none focus:border-[#1b61c9] transition-colors"
                    value={formData.inventoryMode}
                    onChange={e => setFormData(prev => ({ ...prev, inventoryMode: e.target.value }))}
                  >
                    <option value="serialized">Serialized (Unique Item)</option>
                    <option value="quantity">Bulk Quantity</option>
                  </select>
                </div>
                
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <Label className="text-[13px] font-medium text-[#41454d]">Item Condition <span className="text-[#d92d20]">*</span></Label>
                  <select 
                    className="w-full h-10 px-3 rounded-[6px] border border-[#dddddd] bg-white text-[13px] text-[#181d26] outline-none focus:border-[#1b61c9] transition-colors"
                    value={formData.condition}
                    onChange={e => setFormData(prev => ({ ...prev, condition: e.target.value }))}
                  >
                    <option value="New">New</option>
                    <option value="Refurbished">Refurbished</option>
                    <option value="Used">Used</option>
                  </select>
                </div>

                {formData.inventoryMode === 'serialized' ? (
                  <div className="space-y-2 col-span-2">
                    <Label className="text-[13px] font-medium text-[#41454d]">Serial Number / Asset Tag <span className="text-[#d92d20]">*</span></Label>
                    <Input 
                      value={formData.serialNumber} 
                      onChange={e => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))} 
                      placeholder="e.g. PF34B7XX"
                      className="border-[#dddddd] h-10 rounded-[6px] text-[13px] focus-visible:ring-[#1b61c9]"
                    />
                  </div>
                ) : (
                  <div className="space-y-2 col-span-2">
                    <Label className="text-[13px] font-medium text-[#41454d]">Quantity to Add <span className="text-[#d92d20]">*</span></Label>
                    <Input 
                      type="number"
                      min={1}
                      value={formData.quantity} 
                      onChange={e => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))} 
                      className="border-[#dddddd] h-10 rounded-[6px] text-[13px] focus-visible:ring-[#1b61c9]"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Pricing & Summary */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-[#dddddd] shadow-none rounded-[10px] overflow-hidden">
            <CardHeader className="bg-[#f8fafc] border-b border-[#dddddd] py-4 px-5">
              <CardTitle className="text-[14px] font-semibold text-[#181d26]">Pricing Configuration</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              <div className="space-y-2">
                <Label className="text-[13px] font-medium text-[#41454d]">Purchase Price (₹) <span className="text-[#d92d20]">*</span></Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9297a0] text-[13px]">₹</span>
                  <Input 
                    type="number" 
                    value={formData.purchasePrice} 
                    onChange={e => setFormData(prev => ({ ...prev, purchasePrice: e.target.value }))} 
                    className="pl-7 border-[#dddddd] h-10 rounded-[6px] text-[13px] focus-visible:ring-[#1b61c9]"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] font-medium text-[#41454d]">Selling Price (₹) <span className="text-[#d92d20]">*</span></Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9297a0] text-[13px]">₹</span>
                  <Input 
                    type="number" 
                    value={formData.sellingPrice} 
                    onChange={e => setFormData(prev => ({ ...prev, sellingPrice: e.target.value }))} 
                    className="pl-7 border-[#dddddd] h-10 rounded-[6px] text-[13px] focus-visible:ring-[#1b61c9]"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

export default function AddInventorySinglePage() {
  return (
    <Suspense fallback={<div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>}>
      <AddInventoryForm />
    </Suspense>
  );
}
