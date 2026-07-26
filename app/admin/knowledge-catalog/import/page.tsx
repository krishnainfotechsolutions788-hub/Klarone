"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Sparkles, Loader2, Plus, Trash2, List, Server, Database, Laptop, LayoutGrid, Bold, Italic, List as ListIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { addV2ManualKnowledgeEntry } from "@/app/actions/knowledge";
import { extractSpecsWithAI } from "@/app/actions/extract";

// A lightweight, dependency-free Rich Text Editor for React 19
function SimpleRichTextEditor({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Set initial value only once to prevent cursor jumping
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const exec = (command: string) => {
    document.execCommand(command, false, "");
    editorRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full border border-white/10 rounded-xl overflow-hidden bg-[#121215] focus-within:border-[#00A7B5] transition-colors">
      <div className="flex items-center gap-1 p-2 border-b border-white/10 bg-[#0A0A0C]">
        <button type="button" onClick={() => exec('bold')} className="p-1.5 hover:bg-white/10 rounded-md text-white/70 hover:text-white transition-colors" title="Bold">
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => exec('italic')} className="p-1.5 hover:bg-white/10 rounded-md text-white/70 hover:text-white transition-colors" title="Italic">
          <Italic className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button type="button" onClick={() => exec('insertUnorderedList')} className="p-1.5 hover:bg-white/10 rounded-md text-white/70 hover:text-white transition-colors" title="Bullet List">
          <ListIcon className="w-3.5 h-3.5" />
        </button>
      </div>
      <div 
        ref={editorRef}
        contentEditable 
        onInput={handleInput}
        onBlur={handleInput}
        className="flex-1 p-3.5 outline-none overflow-y-auto text-[13.5px] text-white prose prose-invert max-w-none leading-relaxed min-h-[120px]"
      />
    </div>
  );
}

export default function ImportKnowledgePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [aiInputText, setAiInputText] = useState("");
  
  // Master State
  const [masterData, setMasterData] = useState({
    brandName: "",
    model: "",
    series: "",
    releaseYear: new Date().getFullYear().toString(),
    msrp: "",
    description: "",
    weight: "",
    productName: "",
  });

  const [images, setImages] = useState<string[]>([]);

  // Variant Core State
  const [variantData, setVariantData] = useState({
    cpu: "",
    gpu: "",
    ram: "",
    storage: "",
    display: "",
    battery: "",
  });

  // Dynamic Specs State
  const [dynamicSpecs, setDynamicSpecs] = useState([
    { id: "1", group: "Dimensions", name: "Dimensions (WxDxH)", value: "" },
    { id: "2", group: "Connectivity", name: "Wireless", value: "" },
    { id: "3", group: "Ports", name: "USB Ports", value: "" },
  ]);

  const handleMasterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setMasterData({ ...masterData, [e.target.name]: e.target.value });
  };

  const handleVariantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVariantData({ ...variantData, [e.target.name]: e.target.value });
  };

  const updateDynamicSpec = (id: string, field: "group" | "name" | "value", value: string) => {
    setDynamicSpecs(dynamicSpecs.map(spec => 
      spec.id === id ? { ...spec, [field]: value } : spec
    ));
  };

  const addDynamicSpec = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setDynamicSpecs([...dynamicSpecs, { id: newId, group: "General", name: "", value: "" }]);
  };

  const removeDynamicSpec = (id: string) => {
    setDynamicSpecs(dynamicSpecs.filter(spec => spec.id !== id));
  };

  const handleAIExtract = async () => {
    if (!aiInputText.trim()) return;
    setIsExtracting(true);
    setErrorMsg("");
    
    const res = await extractSpecsWithAI(aiInputText);
    
    if (res.success && res.data) {
      setMasterData(prev => ({
        ...prev,
        productName: res.data.productName || prev.productName,
        description: res.data.description || prev.description,
        brandName: res.data.brandName || prev.brandName,
        model: res.data.model || prev.model,
        series: res.data.series || prev.series,
        releaseYear: res.data.releaseYear?.toString() || prev.releaseYear,
        msrp: res.data.msrp?.toString() || prev.msrp,
        weight: res.data.weight?.toString() || prev.weight,
      }));
      setVariantData(prev => ({
        ...prev,
        cpu: res.data.cpu || prev.cpu,
        gpu: res.data.gpu || prev.gpu,
        ram: res.data.ram || prev.ram,
        storage: res.data.storage || prev.storage,
        display: res.data.display || prev.display,
        battery: res.data.battery || prev.battery,
      }));
      
      if (res.data.images && Array.isArray(res.data.images)) {
        setImages(prev => [...new Set([...prev, ...res.data.images])]);
      }
      
      if (res.data.dynamicSpecs && Array.isArray(res.data.dynamicSpecs)) {
        setDynamicSpecs(prev => {
          const newSpecs = res.data.dynamicSpecs.map((s: any) => ({
            id: Math.random().toString(36).substr(2, 9),
            group: s.group || "General",
            name: s.attribute || "",
            value: s.value || ""
          }));
          return [...prev, ...newSpecs];
        });
      }
      
      setAiInputText("");
    } else {
      setErrorMsg(res.error || "Failed to extract specs using AI.");
    }
    
    setIsExtracting(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const payload = {
      master: {
        ...masterData,
        model: masterData.productName || masterData.model,
        releaseYear: parseInt(masterData.releaseYear) || 0,
        weight: parseFloat(masterData.weight) || 0,
        msrp: parseFloat(masterData.msrp) || 0,
        images: images.join(','),
      },
      variant: variantData,
      dynamicSpecs: dynamicSpecs.filter(s => s.name.trim() !== "" && s.value.trim() !== "")
    };

    const res = await addV2ManualKnowledgeEntry(payload);

    setIsSubmitting(false);

    if (res.success) {
      router.push("/admin/knowledge-catalog");
      router.refresh();
    } else {
      setErrorMsg(res.error || "Failed to save laptop to catalog");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1200px] mx-auto pb-20 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/knowledge-catalog">
            <Button variant="outline" size="icon" className="shrink-0 rounded-full h-9 w-9 border-white/10 bg-white/5 hover:bg-white/10 text-white shadow-none">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#1A1A1A] border border-white/10 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00A7B5]"></span>
              <span className="text-[11.5px] font-normal text-white/70 tracking-wide">Manual Catalog Entry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">Create Master Device</h1>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="h-9 px-5 rounded-full bg-white hover:bg-white/90 text-black text-[13px] font-medium shadow-sm flex items-center gap-1.5 cursor-pointer">
          {isSubmitting ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
          {isSubmitting ? "Saving..." : "Save to Catalog"}
        </Button>
      </div>

      {/* AI Extraction Block */}
      <Card className="border-white/10 shadow-2xl rounded-2xl overflow-hidden p-0 bg-[#111113]/90 backdrop-blur-xl text-white">
        <CardHeader className="bg-[#0A0A0C] border-b border-white/10 py-3.5 px-5">
          <CardTitle className="text-[13.5px] font-normal text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00A7B5]" />
            AI Spec Auto-Fill
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 bg-[#111113]">
          <p className="text-white/50 text-[12.5px] mb-3">Paste raw specification copy from manufacturer datasheets below to let AI automatically parse all hardware attributes into form fields.</p>
          <div className="flex flex-col gap-3">
            <textarea 
              value={aiInputText} 
              onChange={(e) => setAiInputText(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 text-[13.5px] rounded-xl border border-white/10 bg-[#121215] text-white focus:outline-none focus:border-[#00A7B5] transition-colors resize-y placeholder:text-white/30"
              placeholder="Paste spec sheet raw copy here..."
            ></textarea>
            <Button 
              type="button"
              onClick={handleAIExtract}
              disabled={isExtracting || !aiInputText.trim()}
              className="self-end bg-white hover:bg-white/90 text-black font-medium shadow-sm text-[12.5px] h-8.5 px-4 rounded-full cursor-pointer disabled:opacity-40"
            >
              {isExtracting ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#00A7B5]" />}
              Extract Specs
            </Button>
          </div>
        </CardContent>
      </Card>

      {errorMsg && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-4 rounded-xl text-sm">
          {errorMsg}
        </div>
      )}

      <form id="manual-entry-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Product Identifiers */}
        <div className="lg:col-span-1 space-y-6">
          
          <Card className="border-white/10 shadow-2xl rounded-2xl overflow-hidden p-0 bg-[#111113]/90 backdrop-blur-xl text-white">
            <CardHeader className="bg-[#0A0A0C] border-b border-white/10 py-3.5 px-5">
              <CardTitle className="text-[13.5px] font-normal text-white flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-white/50" />
                Official Media
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 bg-[#111113]">
              <div className="flex flex-col gap-3">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                
                {images.length > 0 ? (
                  <div className="space-y-4">
                    <div className="relative aspect-[4/3] bg-[#0A0A0C] rounded-xl border border-white/10 flex items-center justify-center p-4 group">
                      <img src={images[0]} alt="Primary" referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                      <button type="button" onClick={() => removeImage(0)} className="absolute top-2 right-2 bg-black/80 p-1.5 rounded-full shadow-sm text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {images.slice(1).map((img, idx) => (
                          <div key={idx + 1} className="relative aspect-square bg-[#0A0A0C] rounded-lg border border-white/10 flex items-center justify-center p-1 overflow-hidden group">
                            <img src={img} alt={`Thumb ${idx}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removeImage(idx + 1)} className="absolute top-1 right-1 bg-black/80 p-1 rounded-full shadow-sm text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <label htmlFor="image-upload" className="flex items-center justify-center w-full py-2 border border-dashed border-[#00A7B5]/40 text-[#00A7B5] rounded-xl text-[12px] cursor-pointer hover:bg-[#00A7B5]/10 transition-colors">
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add More Images
                    </label>
                  </div>
                ) : (
                  <label htmlFor="image-upload" className="cursor-pointer aspect-[4/3] bg-[#0A0A0C] rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-white/40 hover:border-[#00A7B5]/50 hover:bg-white/[0.02] transition-colors">
                    <Laptop className="w-12 h-12 mb-2 text-[#00A7B5] opacity-60" />
                    <span className="text-[13px] font-normal text-white">Click to upload images</span>
                    <span className="text-[11px] mt-1 text-white/40">PNG, JPG, WEBP up to 5MB</span>
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 shadow-2xl rounded-2xl overflow-hidden p-0 bg-[#111113]/90 backdrop-blur-xl text-white">
            <CardHeader className="bg-[#0A0A0C] border-b border-white/10 py-3.5 px-5">
              <CardTitle className="text-[13.5px] font-normal text-white flex items-center gap-2">
                <List className="w-4 h-4 text-white/50" />
                Product Identifiers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col text-[13px] divide-y divide-white/10">
                <div className="flex flex-col p-4">
                  <span className="text-white/60 mb-2 font-normal">Brand Name *</span>
                  <input 
                    required 
                    name="brandName" 
                    value={masterData.brandName} 
                    onChange={handleMasterChange} 
                    className="w-full px-3.5 py-2 bg-[#121215] border border-white/10 rounded-xl focus:outline-none focus:border-[#00A7B5] text-white transition-colors"
                    placeholder="e.g. Lenovo"
                  />
                </div>
                <div className="flex flex-col p-4">
                  <span className="text-white/60 mb-2 font-normal">Model *</span>
                  <input 
                    required 
                    name="model" 
                    value={masterData.model} 
                    onChange={handleMasterChange} 
                    className="w-full px-3.5 py-2 bg-[#121215] border border-white/10 rounded-xl focus:outline-none focus:border-[#00A7B5] text-white transition-colors"
                    placeholder="e.g. ThinkPad T14 Gen 4"
                  />
                </div>
                <div className="flex flex-col p-4">
                  <span className="text-white/60 mb-2 font-normal">Series</span>
                  <input 
                    name="series" 
                    value={masterData.series} 
                    onChange={handleMasterChange} 
                    className="w-full px-3.5 py-2 bg-[#121215] border border-white/10 rounded-xl focus:outline-none focus:border-[#00A7B5] text-white transition-colors"
                    placeholder="e.g. ThinkPad"
                  />
                </div>
                <div className="flex flex-col p-4">
                  <span className="text-white/60 mb-2 font-normal">Release Year *</span>
                  <input 
                    required 
                    type="number" 
                    name="releaseYear" 
                    value={masterData.releaseYear} 
                    onChange={handleMasterChange} 
                    className="w-full px-3.5 py-2 bg-[#121215] border border-white/10 rounded-xl focus:outline-none focus:border-[#00A7B5] text-white font-mono transition-colors"
                  />
                </div>
                <div className="flex flex-col p-4">
                  <span className="text-white/60 mb-2 font-normal">MSRP (₹) *</span>
                  <input 
                    required 
                    type="number" 
                    name="msrp" 
                    value={masterData.msrp} 
                    onChange={handleMasterChange} 
                    className="w-full px-3.5 py-2 bg-[#121215] border border-white/10 rounded-xl focus:outline-none focus:border-[#00A7B5] text-white transition-colors"
                    placeholder="120000"
                  />
                </div>
                <div className="flex flex-col p-4 bg-[#0A0A0C]">
                  <span className="text-white/60 mb-2 font-normal">Weight (kg) *</span>
                  <input 
                    required 
                    type="number" 
                    step="0.01"
                    name="weight" 
                    value={masterData.weight} 
                    onChange={handleMasterChange} 
                    className="w-full px-3.5 py-2 bg-[#121215] border border-white/10 rounded-xl focus:outline-none focus:border-[#00A7B5] text-white transition-colors"
                    placeholder="1.45"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Description & Variants */}
        <div className="lg:col-span-2 space-y-6">
          
          <Card className="border-white/10 shadow-2xl rounded-2xl overflow-hidden p-0 bg-[#111113]/90 backdrop-blur-xl text-white">
            <CardHeader className="bg-[#0A0A0C] border-b border-white/10 py-3.5 px-5">
              <CardTitle className="text-[13.5px] font-normal text-white">
                Product Name
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 bg-[#111113]">
              <input 
                name="productName" 
                value={masterData.productName} 
                onChange={handleMasterChange} 
                className="w-full px-3.5 py-2.5 text-[13.5px] rounded-xl border border-white/10 bg-[#121215] text-white focus:outline-none focus:border-[#00A7B5] transition-colors" 
                placeholder="e.g. Lenovo ThinkPad T14 Gen 4" 
              />
            </CardContent>
          </Card>

          <Card className="border-white/10 shadow-2xl rounded-2xl overflow-hidden p-0 bg-[#111113]/90 backdrop-blur-xl text-white">
            <CardHeader className="bg-[#0A0A0C] border-b border-white/10 py-3.5 px-5">
              <CardTitle className="text-[13.5px] font-normal text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-white/50" />
                Master Description (Rich Text Editor)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 bg-[#111113]">
              <div className="h-64">
                <SimpleRichTextEditor 
                  value={masterData.description} 
                  onChange={(val) => setMasterData({ ...masterData, description: val })} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Knowledge Variant Section */}
          <Card className="border-white/10 shadow-2xl rounded-2xl overflow-hidden p-0 bg-[#111113]/90 backdrop-blur-xl text-white">
            <CardHeader className="bg-[#0A0A0C] border-b border-white/10 py-3.5 px-5">
              <CardTitle className="text-[13.5px] font-normal text-white flex items-center gap-2">
                <Laptop className="w-4 h-4 text-[#00A7B5]" />
                Variant Attributes Core
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 bg-[#111113]">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-[11px] text-white/50 uppercase font-normal mb-2">Processor *</div>
                  <input 
                    required
                    name="cpu"
                    type="text" 
                    value={variantData.cpu} 
                    onChange={handleVariantChange}
                    className="w-full px-3.5 py-2 border border-white/10 bg-[#121215] rounded-xl focus:outline-none focus:border-[#00A7B5] text-white text-[13px] transition-colors"
                    placeholder="e.g. Core i7"
                  />
                </div>
                <div>
                  <div className="text-[11px] text-white/50 uppercase font-normal mb-2">GPU</div>
                  <input 
                    name="gpu"
                    type="text" 
                    value={variantData.gpu} 
                    onChange={handleVariantChange}
                    className="w-full px-3.5 py-2 border border-white/10 bg-[#121215] rounded-xl focus:outline-none focus:border-[#00A7B5] text-white text-[13px] transition-colors"
                    placeholder="e.g. Iris Xe"
                  />
                </div>
                <div>
                  <div className="text-[11px] text-white/50 uppercase font-normal mb-2">Memory (RAM) *</div>
                  <input 
                    required
                    name="ram"
                    type="text" 
                    value={variantData.ram} 
                    onChange={handleVariantChange}
                    className="w-full px-3.5 py-2 border border-white/10 bg-[#121215] rounded-xl focus:outline-none focus:border-[#00A7B5] text-white text-[13px] transition-colors"
                    placeholder="e.g. 16GB"
                  />
                </div>
                <div>
                  <div className="text-[11px] text-white/50 uppercase font-normal mb-2">Storage *</div>
                  <input 
                    required
                    name="storage"
                    type="text" 
                    value={variantData.storage} 
                    onChange={handleVariantChange}
                    className="w-full px-3.5 py-2 border border-white/10 bg-[#121215] rounded-xl focus:outline-none focus:border-[#00A7B5] text-white text-[13px] transition-colors"
                    placeholder="e.g. 512GB SSD"
                  />
                </div>
                <div className="md:col-span-2 mt-2">
                  <div className="text-[11px] text-white/50 uppercase font-normal mb-2">Display *</div>
                  <input 
                    required
                    name="display"
                    type="text" 
                    value={variantData.display} 
                    onChange={handleVariantChange}
                    className="w-full px-3.5 py-2 border border-white/10 bg-[#121215] rounded-xl focus:outline-none focus:border-[#00A7B5] text-white text-[13px] transition-colors"
                    placeholder="e.g. 14 inch IPS"
                  />
                </div>
                <div className="md:col-span-2 mt-2">
                  <div className="text-[11px] text-white/50 uppercase font-normal mb-2">Battery *</div>
                  <input 
                    required
                    name="battery"
                    type="text" 
                    value={variantData.battery} 
                    onChange={handleVariantChange}
                    className="w-full px-3.5 py-2 border border-white/10 bg-[#121215] rounded-xl focus:outline-none focus:border-[#00A7B5] text-white text-[13px] transition-colors"
                    placeholder="e.g. 52.5Wh"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dynamic Specifications */}
          <Card className="border-white/10 shadow-2xl rounded-2xl overflow-hidden p-0 bg-[#111113]/90 backdrop-blur-xl text-white">
            <CardHeader className="bg-[#0A0A0C] border-b border-white/10 py-3.5 px-5 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-[13.5px] font-normal text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-white/50" />
                  Dynamic Specifications
                </CardTitle>
                <span className="text-[11px] text-white/60 bg-white/10 px-2.5 py-0.5 rounded-full ml-2">{dynamicSpecs.length} Attributes</span>
              </div>
              <Button type="button" onClick={addDynamicSpec} variant="outline" className="h-7 px-3 rounded-full text-[12px] shadow-none border-white/10 bg-white/5 text-white hover:bg-white/10 flex items-center gap-1.5 cursor-pointer">
                <Plus className="w-3 h-3" />
                Add Spec
              </Button>
            </CardHeader>
            <CardContent className="p-0 max-h-[500px] overflow-y-auto">
              {dynamicSpecs.length === 0 ? (
                <div className="p-8 text-center text-white/40 text-[13px] font-normal">No custom specifications added.</div>
              ) : (
                <div className="divide-y divide-white/10">
                  {/* Header row */}
                  <div className="grid grid-cols-12 gap-4 px-5 py-2.5 bg-[#0A0A0C] text-[11px] font-normal text-white/50 uppercase tracking-wider">
                    <div className="col-span-3">Group Name</div>
                    <div className="col-span-3">Attribute</div>
                    <div className="col-span-5">Value</div>
                    <div className="col-span-1 text-right">Action</div>
                  </div>
                  {/* Rows */}
                  {dynamicSpecs.map((spec) => (
                    <div key={spec.id} className="grid grid-cols-12 gap-4 p-4 items-start bg-[#111113]">
                      <div className="col-span-3">
                        <input 
                          value={spec.group} 
                          onChange={(e) => updateDynamicSpec(spec.id, 'group', e.target.value)} 
                          placeholder="e.g. Network"
                          className="w-full px-3 py-1.5 text-[12.5px] rounded-lg border border-white/10 bg-[#121215] text-white focus:outline-none focus:border-[#00A7B5]" 
                        />
                      </div>
                      <div className="col-span-3">
                        <input 
                          value={spec.name} 
                          onChange={(e) => updateDynamicSpec(spec.id, 'name', e.target.value)} 
                          placeholder="e.g. Wi-Fi"
                          className="w-full px-3 py-1.5 text-[12.5px] rounded-lg border border-white/10 bg-[#121215] text-white focus:outline-none focus:border-[#00A7B5]" 
                        />
                      </div>
                      <div className="col-span-5">
                        <input 
                          value={spec.value} 
                          onChange={(e) => updateDynamicSpec(spec.id, 'value', e.target.value)} 
                          placeholder="e.g. Wi-Fi 6E, 802.11ax 2x2"
                          className="w-full px-3 py-1.5 text-[12.5px] rounded-lg border border-white/10 bg-[#121215] text-white focus:outline-none focus:border-[#00A7B5]" 
                        />
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Button 
                          type="button" 
                          onClick={() => removeDynamicSpec(spec.id)}
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 rounded-full"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
