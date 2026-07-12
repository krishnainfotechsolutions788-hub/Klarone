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
    <div className="flex flex-col h-full border border-[#dddddd] rounded-[6px] overflow-hidden bg-white focus-within:border-[#1b61c9]">
      <div className="flex items-center gap-1 p-1.5 border-b border-[#dddddd] bg-[#f8fafc]">
        <button type="button" onClick={() => exec('bold')} className="p-1.5 hover:bg-[#e2e8f0] rounded text-[#5f6368] transition-colors" title="Bold">
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => exec('italic')} className="p-1.5 hover:bg-[#e2e8f0] rounded text-[#5f6368] transition-colors" title="Italic">
          <Italic className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-4 bg-[#dddddd] mx-1" />
        <button type="button" onClick={() => exec('insertUnorderedList')} className="p-1.5 hover:bg-[#e2e8f0] rounded text-[#5f6368] transition-colors" title="Bullet List">
          <ListIcon className="w-3.5 h-3.5" />
        </button>
      </div>
      <div 
        ref={editorRef}
        contentEditable 
        onInput={handleInput}
        onBlur={handleInput}
        className="flex-1 p-3 outline-none overflow-y-auto text-[13px] text-[#181d26] prose prose-sm max-w-none leading-relaxed min-h-[100px]"
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
        model: masterData.productName || masterData.model, // Optional fallback
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
    <div className="flex flex-col gap-6 max-w-[1200px] mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/knowledge-catalog">
            <Button variant="outline" size="icon" className="shrink-0 rounded-full h-9 w-9 border-[#dddddd] shadow-none text-[#5f6368] hover:text-[#181d26]">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-sora text-gray-900 tracking-tight">Manual Entry</h1>
            <p className="text-gray-500 mt-1 text-[13px]">Create master details, variants, and dynamic specifications.</p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="h-9 px-4 rounded-[6px] bg-[#181d26] hover:bg-[#0d1218] text-white text-[13px] font-medium shadow-none flex items-center gap-1.5">
          {isSubmitting ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
          {isSubmitting ? "Saving..." : "Save to Catalog"}
        </Button>
      </div>

      {/* AI Extraction Block */}
      <Card className="border-[#dddddd] shadow-none rounded-[10px] overflow-hidden p-0">
        <CardHeader className="bg-[#f8fafc] border-b border-[#dddddd] py-3 px-4">
          <CardTitle className="text-[13px] font-medium text-[#181d26] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#5f6368]" />
            AI Spec Auto-Fill
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 bg-white">
          <p className="text-[#5f6368] text-[12px] mb-3">Paste the raw specification text from the manufacturer's website below, and let AI extract all the fields for you automatically.</p>
          <div className="flex flex-col gap-3">
            <textarea 
              value={aiInputText} 
              onChange={(e) => setAiInputText(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-[13px] rounded-[6px] border border-[#dddddd] focus:outline-none focus:ring-1 focus:ring-[#1b61c9] focus:border-[#1b61c9] resize-y"
              placeholder="Paste spec sheet here..."
            ></textarea>
            <Button 
              type="button"
              onClick={handleAIExtract}
              disabled={isExtracting || !aiInputText.trim()}
              className="self-end bg-[#181d26] hover:bg-[#0d1218] text-white shadow-none text-[13px] h-8 px-4 rounded-[6px]"
            >
              {isExtracting ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1.5" />}
              Extract Specs
            </Button>
          </div>
        </CardContent>
      </Card>

      {errorMsg && (
        <div className="bg-red-50 text-[#d92d20] p-4 rounded-[8px] text-sm border border-red-100">
          {errorMsg}
        </div>
      )}

      <form id="manual-entry-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Product Identifiers */}
        <div className="lg:col-span-1 space-y-6">
          
          <Card className="border-[#dddddd] shadow-none rounded-[10px] overflow-hidden p-0">
            <CardHeader className="bg-[#f8fafc] border-b border-[#dddddd] py-3 px-4">
              <CardTitle className="text-[13px] font-medium text-[#181d26] flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-[#5f6368]" />
                Official Media
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-white">
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
                    <div className="relative aspect-[4/3] bg-[#f8fafc] rounded-[8px] border border-[#dddddd] flex items-center justify-center p-4 group">
                      <img src={images[0]} alt="Primary" referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                      <button type="button" onClick={() => removeImage(0)} className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full shadow-sm text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {images.slice(1).map((img, idx) => (
                          <div key={idx + 1} className="relative aspect-square bg-white rounded-[6px] border border-[#dddddd] flex items-center justify-center p-1 overflow-hidden group">
                            <img src={img} alt={`Thumb ${idx}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removeImage(idx + 1)} className="absolute top-1 right-1 bg-white/80 p-1 rounded-full shadow-sm text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <label htmlFor="image-upload" className="flex items-center justify-center w-full py-2 border border-dashed border-[#1b61c9] text-[#1b61c9] rounded-[6px] text-[12px] cursor-pointer hover:bg-[#eff6ff] transition-colors">
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add More Images
                    </label>
                  </div>
                ) : (
                  <label htmlFor="image-upload" className="cursor-pointer aspect-[4/3] bg-[#f8fafc] rounded-[8px] border-2 border-dashed border-[#dddddd] flex flex-col items-center justify-center text-[#9297a0] hover:border-[#1b61c9] hover:bg-[#eff6ff] transition-colors">
                    <Laptop className="w-12 h-12 mb-2 opacity-50" />
                    <span className="text-[13px] font-medium text-[#181d26]">Click to upload images</span>
                    <span className="text-[11px] mt-1">PNG, JPG, WEBP up to 5MB</span>
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#dddddd] shadow-none rounded-[10px] overflow-hidden p-0">
            <CardHeader className="bg-[#f8fafc] border-b border-[#dddddd] py-3 px-4">
              <CardTitle className="text-[13px] font-medium text-[#181d26] flex items-center gap-2">
                <List className="w-4 h-4 text-[#5f6368]" />
                Product Identifiers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col text-[13px] divide-y divide-[#dddddd]">
                <div className="flex flex-col p-4">
                  <span className="text-[#5f6368] mb-2 font-semibold">Brand Name *</span>
                  <input 
                    required 
                    name="brandName" 
                    value={masterData.brandName} 
                    onChange={handleMasterChange} 
                    className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#1b61c9] text-[#181d26]"
                    placeholder="e.g. Lenovo"
                  />
                </div>
                <div className="flex flex-col p-4">
                  <span className="text-[#5f6368] mb-2 font-semibold">Model *</span>
                  <input 
                    required 
                    name="model" 
                    value={masterData.model} 
                    onChange={handleMasterChange} 
                    className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#1b61c9] text-[#181d26]"
                    placeholder="e.g. ThinkPad T14 Gen 4"
                  />
                </div>
                <div className="flex flex-col p-4">
                  <span className="text-[#5f6368] mb-2 font-semibold">Series</span>
                  <input 
                    name="series" 
                    value={masterData.series} 
                    onChange={handleMasterChange} 
                    className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#1b61c9] text-[#181d26]"
                    placeholder="e.g. ThinkPad"
                  />
                </div>
                <div className="flex flex-col p-4">
                  <span className="text-[#5f6368] mb-2 font-semibold">Release Year *</span>
                  <input 
                    required 
                    type="number" 
                    name="releaseYear" 
                    value={masterData.releaseYear} 
                    onChange={handleMasterChange} 
                    className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#1b61c9] text-[#181d26] font-mono"
                  />
                </div>
                <div className="flex flex-col p-4">
                  <span className="text-[#5f6368] mb-2 font-semibold">MSRP (₹) *</span>
                  <input 
                    required 
                    type="number" 
                    name="msrp" 
                    value={masterData.msrp} 
                    onChange={handleMasterChange} 
                    className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#1b61c9] text-[#181d26]"
                    placeholder="120000"
                  />
                </div>
                <div className="flex flex-col p-4 bg-[#f8fafc]">
                  <span className="text-[#5f6368] mb-2 font-semibold">Weight (kg) *</span>
                  <input 
                    required 
                    type="number" 
                    step="0.01"
                    name="weight" 
                    value={masterData.weight} 
                    onChange={handleMasterChange} 
                    className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#1b61c9] text-[#181d26]"
                    placeholder="1.45"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Description & Variants */}
        <div className="lg:col-span-2 space-y-6">
          
          <Card className="border-[#dddddd] shadow-none rounded-[10px] overflow-hidden p-0">
            <CardHeader className="bg-[#f8fafc] border-b border-[#dddddd] py-3 px-4">
              <CardTitle className="text-[13px] font-medium text-[#181d26]">
                Product Name
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-white">
              <input 
                name="productName" 
                value={masterData.productName} 
                onChange={handleMasterChange} 
                className="w-full px-3 py-2 text-[13px] rounded-[6px] border border-[#dddddd] focus:outline-none focus:ring-1 focus:ring-[#1b61c9] focus:border-[#1b61c9]" 
                placeholder="e.g. Lenovo ThinkPad T14 Gen 4" 
              />
            </CardContent>
          </Card>

          <Card className="border-[#dddddd] shadow-none rounded-[10px] overflow-hidden p-0">
            <CardHeader className="bg-[#f8fafc] border-b border-[#dddddd] py-3 px-4">
              <CardTitle className="text-[13px] font-medium text-[#181d26] flex items-center gap-2">
                <Server className="w-4 h-4 text-[#5f6368]" />
                Master Description (Edit)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-[#f8fafc]">
              <div className="h-64">
                <SimpleRichTextEditor 
                  value={masterData.description} 
                  onChange={(val) => setMasterData({ ...masterData, description: val })} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Knowledge Variant Section */}
          <Card className="border-[#dddddd] shadow-none rounded-[10px] overflow-hidden p-0">
            <CardHeader className="bg-[#f0f9ff] border-b border-[#dddddd] py-3 px-4">
              <CardTitle className="text-[13px] font-medium text-[#0369a1] flex items-center gap-2">
                <Laptop className="w-4 h-4 text-[#0284c7]" />
                Variant Attributes (Edit)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col">
                <div className="p-4 bg-[#f8fafc]">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-1">
                      <div>
                        <div className="text-[11px] text-[#5f6368] uppercase font-semibold mb-2">Processor *</div>
                        <input 
                          required
                          name="cpu"
                          type="text" 
                          value={variantData.cpu} 
                          onChange={handleVariantChange}
                          className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#0284c7] text-[#181d26] text-[13px]"
                          placeholder="e.g. Core i7"
                        />
                      </div>
                      <div>
                        <div className="text-[11px] text-[#5f6368] uppercase font-semibold mb-2">GPU</div>
                        <input 
                          name="gpu"
                          type="text" 
                          value={variantData.gpu} 
                          onChange={handleVariantChange}
                          className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#0284c7] text-[#181d26] text-[13px]"
                          placeholder="e.g. Iris Xe"
                        />
                      </div>
                      <div>
                        <div className="text-[11px] text-[#5f6368] uppercase font-semibold mb-2">Memory (RAM) *</div>
                        <input 
                          required
                          name="ram"
                          type="text" 
                          value={variantData.ram} 
                          onChange={handleVariantChange}
                          className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#0284c7] text-[#181d26] text-[13px]"
                          placeholder="e.g. 16GB"
                        />
                      </div>
                      <div>
                        <div className="text-[11px] text-[#5f6368] uppercase font-semibold mb-2">Storage *</div>
                        <input 
                          required
                          name="storage"
                          type="text" 
                          value={variantData.storage} 
                          onChange={handleVariantChange}
                          className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#0284c7] text-[#181d26] text-[13px]"
                          placeholder="e.g. 512GB SSD"
                        />
                      </div>
                      <div className="md:col-span-2 mt-2">
                        <div className="text-[11px] text-[#5f6368] uppercase font-semibold mb-2">Display *</div>
                        <input 
                          required
                          name="display"
                          type="text" 
                          value={variantData.display} 
                          onChange={handleVariantChange}
                          className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#0284c7] text-[#181d26] text-[13px]"
                          placeholder="e.g. 14 inch IPS"
                        />
                      </div>
                      <div className="md:col-span-2 mt-2">
                        <div className="text-[11px] text-[#5f6368] uppercase font-semibold mb-2">Battery *</div>
                        <input 
                          required
                          name="battery"
                          type="text" 
                          value={variantData.battery} 
                          onChange={handleVariantChange}
                          className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#0284c7] text-[#181d26] text-[13px]"
                          placeholder="e.g. 52.5Wh"
                        />
                      </div>
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dynamic Specifications */}
          <Card className="border-[#dddddd] shadow-none rounded-[10px] overflow-hidden p-0">
            <CardHeader className="bg-[#f8fafc] border-b border-[#dddddd] py-3 px-4 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-[13px] font-medium text-[#181d26] flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#5f6368]" />
                  Dynamic Specifications (Edit)
                </CardTitle>
                <span className="text-[11px] text-[#5f6368] bg-white px-2 py-1 rounded-[4px] border border-[#dddddd] ml-2">{dynamicSpecs.length} Attributes</span>
              </div>
              <Button type="button" onClick={addDynamicSpec} variant="outline" className="h-7 px-3 rounded-[4px] text-[12px] shadow-none border-[#dddddd] flex items-center gap-1.5 bg-white text-[#181d26] hover:bg-gray-50">
                <Plus className="w-3 h-3" />
                Add Spec
              </Button>
            </CardHeader>
            <CardContent className="p-0 max-h-[500px] overflow-y-auto">
              {dynamicSpecs.length === 0 ? (
                <div className="p-8 text-center text-[#9297a0] text-[13px]">No custom specifications added.</div>
              ) : (
                <div className="divide-y divide-[#dddddd]">
                  {/* Header row */}
                  <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-white text-[11px] font-medium text-[#5f6368] uppercase tracking-wider border-b border-[#dddddd]">
                    <div className="col-span-3">Group Name</div>
                    <div className="col-span-3">Attribute</div>
                    <div className="col-span-5">Value</div>
                    <div className="col-span-1 text-right">Action</div>
                  </div>
                  {/* Rows */}
                  {dynamicSpecs.map((spec) => (
                    <div key={spec.id} className="grid grid-cols-12 gap-4 p-4 items-start bg-white">
                      <div className="col-span-3">
                        <input 
                          value={spec.group} 
                          onChange={(e) => updateDynamicSpec(spec.id, 'group', e.target.value)} 
                          placeholder="e.g. Network"
                          className="w-full px-2 py-1.5 text-[12px] rounded-[4px] border border-[#dddddd] focus:outline-none focus:border-[#1b61c9]" 
                        />
                      </div>
                      <div className="col-span-3">
                        <input 
                          value={spec.name} 
                          onChange={(e) => updateDynamicSpec(spec.id, 'name', e.target.value)} 
                          placeholder="e.g. Wi-Fi"
                          className="w-full px-2 py-1.5 text-[12px] rounded-[4px] border border-[#dddddd] focus:outline-none focus:border-[#1b61c9]" 
                        />
                      </div>
                      <div className="col-span-5">
                        <input 
                          value={spec.value} 
                          onChange={(e) => updateDynamicSpec(spec.id, 'value', e.target.value)} 
                          placeholder="e.g. Wi-Fi 6E, 802.11ax 2x2"
                          className="w-full px-2 py-1.5 text-[12px] rounded-[4px] border border-[#dddddd] focus:outline-none focus:border-[#1b61c9]" 
                        />
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Button 
                          type="button" 
                          onClick={() => removeDynamicSpec(spec.id)}
                          variant="ghost" 
                          size="icon"
                          className="h-7 w-7 text-[#9297a0] hover:text-red-600 hover:bg-red-50 rounded-[4px]"
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
