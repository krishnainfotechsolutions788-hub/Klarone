"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Save, Loader2, Package, ArrowLeft, Tag, Layers, CheckCircle2, 
  Sparkles, DollarSign, Box, ShieldCheck, Cpu, HardDrive, MemoryStick, Image as ImageIcon, Database, Server
} from "lucide-react";
import { getV2KnowledgeMaster } from '@/app/actions/knowledge';
import { addInventoryItem } from '@/app/actions/inventory';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function AddInventoryForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kc_id = searchParams.get('kc_id');
  const [isClient, setIsClient] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [masterData, setMasterData] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [intelligences, setIntelligences] = useState<any[]>([]);
  
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
          setIntelligences(res.data.intelligences || (res.data.intelligence ? [res.data.intelligence] : []));
          if (variantList.length > 0) {
             setFormData(prev => ({ 
               ...prev, 
               variantId: variantList[0].id,
               sellingPrice: String(variantList[0].msrp || res.data.master?.msrp || '') 
             }));
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

  const activeVariant = variants.find(v => v.id === formData.variantId) || variants[0];
  const activeIntel = intelligences.find(i => i.variant_id === formData.variantId) || intelligences[0];

  const handleSave = async () => {
    if (!formData.variantId) {
      alert("Please select a variant.");
      return;
    }
    
    if (formData.inventoryMode === 'serialized' && !formData.serialNumber.trim()) {
      alert("Please provide a Serial Number or Asset Tag for serialized stock.");
      return;
    }

    if (!formData.purchasePrice || !formData.sellingPrice) {
      alert("Please enter purchase price and selling price.");
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
    <div className="p-20 flex flex-col items-center justify-center space-y-4 text-white min-h-[600px]">
      <Loader2 className="w-8 h-8 animate-spin text-[#00A7B5]" />
      <p className="text-sm text-white/60 font-medium">Syncing with Knowledge Catalog...</p>
    </div>
  );

  const images = masterData.official_images || [];
  const primaryImage = images.length > 0 ? images[0] : null;

  // Margin calculation
  const margin = (Number(formData.sellingPrice) || 0) - (Number(formData.purchasePrice) || 0);
  const marginPct = Number(formData.purchasePrice) > 0 
    ? Math.round((margin / Number(formData.purchasePrice)) * 100) 
    : 0;

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto pb-24 text-white pt-2">
      
      {/* Top Header matching Master Catalog Theme */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => router.push('/admin/product')}
            className="shrink-0 rounded-full h-10 w-10 border-white/10 bg-white/5 hover:bg-white/10 text-white shadow-none"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#1A1A1A] border border-white/10 mb-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00A7B5]"></span>
              <span className="text-[11.5px] font-normal text-white/70 tracking-wide">Physical Stock Integration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white flex items-center gap-3">
              Stock Inventory Item
            </h1>
            <p className="text-white/60 text-xs sm:text-sm mt-1">
              Adding unit inventory for <span className="text-white font-medium">{masterData.kc_brands?.name} {masterData.model}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button 
            variant="outline" 
            onClick={() => router.push('/admin/product')}
            className="h-10 px-5 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white text-[13px] font-medium shadow-none"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isPublishing} 
            className="h-10 px-6 rounded-full bg-[#00A7B5] hover:bg-[#00929f] text-white text-[13px] font-medium shadow-lg shadow-[#00A7B5]/20 flex items-center gap-2"
          >
            {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isPublishing ? "Publishing..." : "Save to Inventory"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols): Variant Selection & Stock Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Variant Selection */}
          <Card className="border border-white/10 shadow-2xl rounded-2xl overflow-hidden bg-[#111113]/90 backdrop-blur-xl text-white">
            <CardHeader className="bg-[#0A0A0C] border-b border-white/10 py-4 px-6">
              <CardTitle className="text-[14px] font-normal text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#00A7B5]" />
                  1. Select Master Configuration
                </span>
                <span className="text-xs text-white/50">
                  {variants.length} Variant{variants.length !== 1 ? 's' : ''} Listed
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Label className="text-xs text-white/60 font-medium uppercase tracking-wider">Choose Hardware Variant</Label>
              <div className="grid grid-cols-1 gap-3">
                {variants.map(v => {
                  const isSelected = formData.variantId === v.id;
                  return (
                    <div 
                      key={v.id} 
                      className={`relative p-5 rounded-xl border cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'border-[#00A7B5] bg-[#00A7B5]/10 shadow-lg shadow-[#00A7B5]/5 ring-1 ring-[#00A7B5]' 
                          : 'border-white/10 bg-[#121215] hover:border-white/20 hover:bg-white/[0.02]'
                      }`}
                      onClick={() => {
                        setFormData(prev => ({ 
                          ...prev, 
                          variantId: v.id,
                          sellingPrice: String(v.msrp || masterData?.msrp || prev.sellingPrice)
                        }));
                      }}
                    >
                      {isSelected && (
                        <div className="absolute top-4 right-4">
                          <CheckCircle2 className="w-5 h-5 text-[#00A7B5]" />
                        </div>
                      )}
                      <div className="flex items-start gap-4 pr-8">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                          isSelected ? 'bg-[#00A7B5] text-white border-[#00A7B5]' : 'bg-white/5 text-white/50 border-white/10'
                        }`}>
                          <Package className="w-5 h-5" />
                        </div>
                        <div className="space-y-1.5">
                          <div className={`font-medium text-base ${isSelected ? 'text-[#00A7B5]' : 'text-white'}`}>
                            {v.cpu || v.ram || v.storage 
                              ? [v.cpu, v.ram, v.storage].filter(Boolean).join(' • ')
                              : (v.sku ? `SKU: ${v.sku}` : 'Standard Specifications')
                            }
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-3 text-xs text-white/60 pt-0.5">
                            {v.display && <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-[#00A7B5]" /> {v.display}</span>}
                            {v.battery && <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#00A7B5]" /> {v.battery}</span>}
                            <span className="font-semibold text-white/80">MSRP: ₹{Number(v.msrp || masterData?.msrp || 0).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {variants.length === 0 && (
                  <div className="text-xs text-amber-300 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                    No specific variants found. Defaulting to master product configuration.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Physical Stock Details */}
          <Card className="border border-white/10 shadow-2xl rounded-2xl overflow-hidden bg-[#111113]/90 backdrop-blur-xl text-white">
            <CardHeader className="bg-[#0A0A0C] border-b border-white/10 py-4 px-6">
              <CardTitle className="text-[14px] font-normal text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#00A7B5]" />
                2. Inventory & Stock Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-white/70">Tracking Mode <span className="text-red-400">*</span></Label>
                  <select 
                    className="w-full h-11 px-3.5 rounded-xl border border-white/10 bg-[#121215] text-sm text-white outline-none focus:border-[#00A7B5] transition-colors"
                    value={formData.inventoryMode}
                    onChange={e => setFormData(prev => ({ ...prev, inventoryMode: e.target.value }))}
                  >
                    <option value="serialized" className="bg-[#121215]">Serialized (Unique Serial #)</option>
                    <option value="quantity" className="bg-[#121215]">Bulk Quantity Stock</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-white/70">Hardware Condition <span className="text-red-400">*</span></Label>
                  <select 
                    className="w-full h-11 px-3.5 rounded-xl border border-white/10 bg-[#121215] text-sm text-white outline-none focus:border-[#00A7B5] transition-colors"
                    value={formData.condition}
                    onChange={e => setFormData(prev => ({ ...prev, condition: e.target.value }))}
                  >
                    <option value="New" className="bg-[#121215]">Brand New (Sealed Box)</option>
                    <option value="Refurbished" className="bg-[#121215]">Refurbished (Certified)</option>
                    <option value="Used" className="bg-[#121215]">Pre-Owned / Open Box</option>
                  </select>
                </div>

                {formData.inventoryMode === 'serialized' ? (
                  <div className="space-y-2 sm:col-span-2">
                    <Label className="text-xs font-medium text-white/70">Serial Number / Asset Tag <span className="text-red-400">*</span></Label>
                    <Input 
                      value={formData.serialNumber} 
                      onChange={e => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))} 
                      placeholder="e.g. SN-8942-PF34B7XX"
                      className="border-white/10 bg-[#121215] h-11 rounded-xl text-sm text-white focus-visible:ring-[#00A7B5]"
                    />
                    <p className="text-[11px] text-white/40">Unique serial identifier on outer packaging or hardware tag.</p>
                  </div>
                ) : (
                  <div className="space-y-2 sm:col-span-2">
                    <Label className="text-xs font-medium text-white/70">Stock Quantity <span className="text-red-400">*</span></Label>
                    <Input 
                      type="number"
                      min={1}
                      value={formData.quantity} 
                      onChange={e => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))} 
                      className="border-white/10 bg-[#121215] h-11 rounded-xl text-sm text-white focus-visible:ring-[#00A7B5]"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Pricing & Master Product Preview */}
        <div className="space-y-6">
          
          {/* Card 3: Pricing & Margins */}
          <Card className="border border-white/10 shadow-2xl rounded-2xl overflow-hidden bg-[#111113]/90 backdrop-blur-xl text-white">
            <CardHeader className="bg-[#0A0A0C] border-b border-white/10 py-4 px-6">
              <CardTitle className="text-[14px] font-normal text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#00A7B5]" />
                Pricing Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              
              <div className="space-y-2">
                <Label className="text-xs font-medium text-white/70">Procurement Cost (₹) <span className="text-red-400">*</span></Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-sm">₹</span>
                  <Input 
                    type="number" 
                    value={formData.purchasePrice} 
                    onChange={e => setFormData(prev => ({ ...prev, purchasePrice: e.target.value }))} 
                    className="pl-8 border-white/10 bg-[#121215] h-11 rounded-xl text-sm text-white focus-visible:ring-[#00A7B5]"
                    placeholder="e.g. 45000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-white/70">Listing / Selling Price (₹) <span className="text-red-400">*</span></Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-sm">₹</span>
                  <Input 
                    type="number" 
                    value={formData.sellingPrice} 
                    onChange={e => setFormData(prev => ({ ...prev, sellingPrice: e.target.value }))} 
                    className="pl-8 border-white/10 bg-[#121215] h-11 rounded-xl text-sm font-bold text-[#00A7B5] focus-visible:ring-[#00A7B5]"
                    placeholder="e.g. 52000"
                  />
                </div>
              </div>

              {/* Profit Margin Indicator */}
              <div className="pt-2 border-t border-white/10">
                <div className="bg-[#121215] rounded-xl p-4 flex items-center justify-between border border-white/5">
                  <div>
                    <p className="text-[11px] font-medium text-white/50">Expected Unit Margin</p>
                    <p className={`text-base font-bold ${margin >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ₹{margin.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    marginPct > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {marginPct > 0 ? `+${marginPct}%` : `${marginPct}%`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Catalog Reference Preview */}
          <Card className="border border-white/10 shadow-2xl rounded-2xl overflow-hidden bg-[#111113]/90 backdrop-blur-xl text-white">
            <CardHeader className="bg-[#0A0A0C] border-b border-white/10 py-4 px-6">
              <CardTitle className="text-[14px] font-normal text-white flex items-center gap-2">
                <Box className="w-4 h-4 text-[#00A7B5]" />
                Master Catalog Reference
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                {primaryImage ? (
                  <img 
                    src={primaryImage} 
                    alt={masterData.model} 
                    className="w-16 h-16 object-contain rounded-xl border border-white/10 p-1 shrink-0 bg-[#0A0A0C]"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-white/40">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-sm text-white">{masterData.kc_brands?.name} {masterData.model}</h4>
                  <p className="text-xs text-white/50 mt-0.5">{masterData.series || 'Standard Series'}</p>
                  {masterData.icecat_id && (
                    <span className="inline-block mt-1 text-[10px] bg-[#00A7B5]/10 text-[#00A7B5] border border-[#00A7B5]/20 px-2 py-0.5 rounded font-mono">
                      Icecat: {masterData.icecat_id}
                    </span>
                  )}
                </div>
              </div>

              {/* Dynamic Klarone ML Model Scores */}
              {activeIntel && (
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <p className="text-[10.5px] font-medium text-white/50 uppercase tracking-wider">Klarone ML Intelligence</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-[#121215] p-2.5 rounded-xl border border-white/5">
                      <p className="text-[10px] text-white/40">Gaming</p>
                      <p className="text-xs font-bold text-[#00A7B5]">{activeIntel.gaming_score || 70}/100</p>
                    </div>
                    <div className="bg-[#121215] p-2.5 rounded-xl border border-white/5">
                      <p className="text-[10px] text-white/40">Student</p>
                      <p className="text-xs font-bold text-[#00A7B5]">{activeIntel.student_score || 85}/100</p>
                    </div>
                    <div className="bg-[#121215] p-2.5 rounded-xl border border-white/5">
                      <p className="text-[10px] text-white/40">Business</p>
                      <p className="text-xs font-bold text-[#00A7B5]">{activeIntel.business_score || 80}/100</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}

export default function AddInventorySinglePage() {
  return (
    <Suspense fallback={<div className="p-20 flex flex-col items-center justify-center space-y-4 text-white min-h-[600px]"><Loader2 className="w-8 h-8 animate-spin text-[#00A7B5]" /><p className="text-sm text-white/60 font-medium">Syncing with Knowledge Catalog...</p></div>}>
      <AddInventoryForm />
    </Suspense>
  );
}
