"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { ArrowLeft, Save, Loader2, Server, Laptop, Brain, Database, LayoutGrid, List, Bold, Italic, List as ListIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getV2KnowledgeMaster, updateV2KnowledgeData } from "@/app/actions/knowledge";
import { useRef } from "react";

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
        className="flex-1 p-3 outline-none overflow-y-auto text-[13px] text-[#181d26] prose prose-sm max-w-none leading-relaxed"
      />
    </div>
  );
}

export default function EditKnowledgeCatalogPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Data States
  const [masterData, setMasterData] = useState<any>({});
  const [variantsData, setVariantsData] = useState<any[]>([]);
  const [intelligencesData, setIntelligencesData] = useState<any[]>([]);
  const [specificationsData, setSpecificationsData] = useState<any[]>([]);

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getV2KnowledgeMaster(id);
        if (!result.success || !result.data) {
          throw new Error(result.error || "Failed to load product");
        }
        
        
        setMasterData(result.data.master || {});
        
        const variants = result.data.variants || (result.data.variant ? [result.data.variant] : []);
        setVariantsData(variants);
        if (variants.length > 0) {
          setSelectedVariantId(variants[0].id);
        }
        
        setIntelligencesData(result.data.intelligences || (result.data.intelligence ? [result.data.intelligence] : []));
        setSpecificationsData(result.data.specifications || []);
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg("");
    
    const result = await updateV2KnowledgeData({ 
      id,
      masterData, 
      variantsData,
      intelligencesData,
      specificationsData 
    });
    
    if (result.success) {
      alert("Updated Successfully!");
      router.push("/admin/knowledge-catalog");
    } else {
      setErrorMsg(result.error || "Failed to update data");
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 min-h-[600px]">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#181d26]" />
        <p>Loading catalog entry...</p>
      </div>
    );
  }

  if (errorMsg && !masterData.id) {
    return (
      <div className="bg-red-50 text-[#d92d20] p-6 rounded-[10px] border border-red-100 max-w-2xl mx-auto mt-8">
        <h3 className="font-bold mb-2">Error</h3>
        <p>{errorMsg}</p>
        <Link href="/admin/knowledge-catalog" className="inline-block mt-4 text-[13px] font-medium underline">Go Back</Link>
      </div>
    );
  }

  const images = masterData.official_images || [];

  const activeVariant = variantsData.find(v => v.id === selectedVariantId) || variantsData[0] || {};
  const activeIntel = intelligencesData.find(i => i.variant_id === selectedVariantId) || intelligencesData[0] || {};
  const activeSpecs = specificationsData.filter(s => s.variant_id === selectedVariantId);

  // Group specifications by group_name for display
  const groupedSpecs = activeSpecs.reduce((acc, spec) => {
    if (!acc[spec.group_name]) acc[spec.group_name] = [];
    acc[spec.group_name].push(spec);
    return acc;
  }, {} as Record<string, any[]>);

  const updateActiveVariant = (field: string, value: string) => {
    setVariantsData(prev => prev.map(v => v.id === selectedVariantId ? { ...v, [field]: value } : v));
  };

  const updateActiveIntel = (field: string, value: number) => {
    setIntelligencesData(prev => prev.map(i => i.variant_id === selectedVariantId ? { ...i, [field]: value } : i));
  };

  const updateActiveSpec = (specId: string, value: string) => {
    setSpecificationsData(prev => prev.map(s => s.id === specId ? { ...s, value } : s));
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
            <h1 className="text-lg font-semibold font-sora text-gray-900 tracking-tight">Edit Product Entry</h1>
            <p className="text-gray-500 mt-1 text-[13px]">Modify master details, variants, and intelligence scores.</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="h-9 px-4 rounded-[6px] bg-[#181d26] hover:bg-[#0d1218] text-white text-[13px] font-medium shadow-none flex items-center gap-1.5">
          {isSaving ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
          Save Changes
        </Button>
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-[#d92d20] p-4 rounded-[8px] text-sm border border-red-100">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-[#dddddd] shadow-none rounded-[10px] overflow-hidden p-0">
            <CardHeader className="bg-[#f8fafc] border-b border-[#dddddd] py-3 px-4">
              <CardTitle className="text-[13px] font-medium text-[#181d26] flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-[#5f6368]" />
                Official Media
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {images.length > 0 ? (
                <div className="space-y-4">
                  <div className="aspect-[4/3] bg-white rounded-[8px] border border-[#dddddd] flex items-center justify-center p-4">
                    <img src={images[0].url || images[0]} alt="Primary" className="w-full h-full object-contain" />
                  </div>
                  {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {images.slice(1).map((img: any, idx: number) => (
                        <div key={idx} className="aspect-square bg-white rounded-[6px] border border-[#dddddd] flex items-center justify-center p-1 overflow-hidden">
                          <img src={img.url || img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-[4/3] bg-[#f8fafc] rounded-[8px] border border-[#dddddd] flex flex-col items-center justify-center text-[#9297a0]">
                  <Laptop className="w-12 h-12 mb-2 opacity-50" />
                  <span className="text-[13px]">No images available</span>
                </div>
              )}
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
                <div className="flex items-center justify-between p-4">
                  <span className="text-[#5f6368]">Brand</span>
                  <span className="font-medium px-3 py-1.5 bg-[#f8fafc] rounded-[6px] border border-[#dddddd] text-[#181d26]">{masterData.kc_brands?.name || "Unknown Brand"}</span>
                </div>
                <div className="flex flex-col p-4">
                  <span className="text-[#5f6368] mb-2">Model</span>
                  <input 
                    type="text" 
                    value={masterData.model || ""} 
                    onChange={(e) => setMasterData({...masterData, model: e.target.value})}
                    className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#1b61c9] text-[#181d26]"
                  />
                </div>
                <div className="flex flex-col p-4">
                  <span className="text-[#5f6368] mb-2">Series</span>
                  <input 
                    type="text" 
                    value={masterData.series || ""} 
                    onChange={(e) => setMasterData({...masterData, series: e.target.value})}
                    className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#1b61c9] text-[#181d26]"
                  />
                </div>
                <div className="flex flex-col p-4">
                  <span className="text-[#5f6368] mb-2">GTIN / EAN</span>
                  <input 
                    type="text" 
                    value={masterData.gtin || ""} 
                    onChange={(e) => setMasterData({...masterData, gtin: e.target.value})}
                    className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#1b61c9] text-[#181d26] font-mono"
                  />
                </div>
                <div className="flex flex-col p-4">
                  <span className="text-[#5f6368] mb-2">Status</span>
                  <select 
                    value={masterData.status || "Draft"}
                    onChange={(e) => setMasterData({...masterData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#1b61c9] text-[#181d26] bg-white"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Approved">Approved</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
                <div className="flex justify-between p-4 bg-[#f8fafc]">
                  <span className="text-[#5f6368]">Icecat ID</span>
                  <span className="font-mono text-[#181d26]">{masterData.icecat_id || 'N/A'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Description & Variants */}
        <div className="lg:col-span-2 space-y-6">
          
          <Card className="border-[#dddddd] shadow-none rounded-[10px] overflow-hidden p-0">
            <CardHeader className="bg-[#f8fafc] border-b border-[#dddddd] py-3 px-4">
              <CardTitle className="text-[13px] font-medium text-[#181d26] flex items-center gap-2">
                <Server className="w-4 h-4 text-[#5f6368]" />
                Full Product Title
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-white">
              <textarea 
                rows={3}
                value={masterData.model || ""} 
                onChange={(e) => setMasterData({...masterData, model: e.target.value})}
                className="w-full px-4 py-3 text-[14px] leading-relaxed border border-[#dddddd] rounded-[8px] focus:outline-none focus:border-[#1b61c9] text-[#41454d] shadow-sm resize-y"
                placeholder="e.g. Lenovo ThinkPad T14 Gen 2"
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
              <div className="h-72">
                <SimpleRichTextEditor
                  value={masterData.official_descriptions || ""} 
                  onChange={(value) => setMasterData({...masterData, official_descriptions: value})}
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
                {/* Variant Tabs */}
                <div className="flex items-center gap-2 p-3 bg-white border-b border-[#dddddd] overflow-x-auto">
                  {variantsData.map((variant, index) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`px-3 py-1.5 text-[12px] font-medium rounded-full whitespace-nowrap transition-colors ${
                        selectedVariantId === variant.id 
                          ? "bg-[#181d26] text-white" 
                          : "bg-[#f8fafc] text-[#5f6368] border border-[#dddddd] hover:bg-[#f1f5f9]"
                      }`}
                    >
                      Variant #{index + 1}
                    </button>
                  ))}
                </div>

                <div className="p-4 bg-[#f8fafc]">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      <div>
                        <div className="text-[11px] text-[#5f6368] uppercase font-semibold mb-2">Processor</div>
                        <input 
                          type="text" 
                          value={activeVariant.cpu || ""} 
                          onChange={(e) => updateActiveVariant("cpu", e.target.value)}
                          className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#0284c7] text-[#181d26] text-[13px]"
                        />
                      </div>
                      <div>
                        <div className="text-[11px] text-[#5f6368] uppercase font-semibold mb-2">Memory (RAM)</div>
                        <input 
                          type="text" 
                          value={activeVariant.ram || ""} 
                          onChange={(e) => updateActiveVariant("ram", e.target.value)}
                          className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#0284c7] text-[#181d26] text-[13px]"
                        />
                      </div>
                      <div>
                        <div className="text-[11px] text-[#5f6368] uppercase font-semibold mb-2">Storage</div>
                        <input 
                          type="text" 
                          value={activeVariant.storage || ""} 
                          onChange={(e) => updateActiveVariant("storage", e.target.value)}
                          className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#0284c7] text-[#181d26] text-[13px]"
                        />
                      </div>
                      <div>
                        <div className="text-[11px] text-[#5f6368] uppercase font-semibold mb-2">Display</div>
                        <input 
                          type="text" 
                          value={activeVariant.display || ""} 
                          onChange={(e) => updateActiveVariant("display", e.target.value)}
                          className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#0284c7] text-[#181d26] text-[13px]"
                        />
                      </div>
                      <div className="md:col-span-4 mt-2">
                        <div className="text-[11px] text-[#5f6368] uppercase font-semibold mb-2">Battery</div>
                        <input 
                          type="text" 
                          value={activeVariant.battery || ""} 
                          onChange={(e) => updateActiveVariant("battery", e.target.value)}
                          className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#0284c7] text-[#181d26] text-[13px]"
                        />
                      </div>
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Intelligence Score Section */}
          <Card className="border-[#dddddd] shadow-none rounded-[10px] overflow-hidden p-0">
            <CardHeader className="bg-[#faf5ff] border-b border-[#dddddd] py-3 px-4">
              <CardTitle className="text-[13px] font-medium text-[#7e22ce] flex items-center gap-2">
                <Brain className="w-4 h-4 text-[#9333ea]" />
                Intelligence Scores (0-100)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#f8fafc]">
                <div>
                  <label className="text-[#5f6368] text-[11px] uppercase font-semibold mb-2 block">Student</label>
                  <input 
                    type="number" 
                    min="0" max="100"
                    value={activeIntel.student_score || 0} 
                    onChange={(e) => updateActiveIntel("student_score", parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#9333ea] text-[#181d26] text-[13px]"
                  />
                </div>
                <div>
                  <label className="text-[#5f6368] text-[11px] uppercase font-semibold mb-2 block">Business</label>
                  <input 
                    type="number" 
                    min="0" max="100"
                    value={activeIntel.business_score || 0} 
                    onChange={(e) => updateActiveIntel("business_score", parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#9333ea] text-[#181d26] text-[13px]"
                  />
                </div>
                <div>
                  <label className="text-[#5f6368] text-[11px] uppercase font-semibold mb-2 block">Gaming</label>
                  <input 
                    type="number" 
                    min="0" max="100"
                    value={activeIntel.gaming_score || 0} 
                    onChange={(e) => updateActiveIntel("gaming_score", parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#9333ea] text-[#181d26] text-[13px]"
                  />
                </div>
                <div>
                  <label className="text-[#5f6368] text-[11px] uppercase font-semibold mb-2 block">Programming</label>
                  <input 
                    type="number" 
                    min="0" max="100"
                    value={activeIntel.programming_score || 0} 
                    onChange={(e) => updateActiveIntel("programming_score", parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#9333ea] text-[#181d26] text-[13px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dynamic Specifications */}
          <Card className="border-[#dddddd] shadow-none rounded-[10px] overflow-hidden p-0">
            <CardHeader className="bg-[#f8fafc] border-b border-[#dddddd] py-3 px-4 flex flex-row items-center justify-between">
              <CardTitle className="text-[13px] font-medium text-[#181d26] flex items-center gap-2">
                <Database className="w-4 h-4 text-[#5f6368]" />
                Dynamic Specifications (Edit)
              </CardTitle>
              <span className="text-[11px] text-[#5f6368] bg-white px-2 py-1 rounded-[4px] border border-[#dddddd]">{activeSpecs.length} Attributes</span>
            </CardHeader>
            <CardContent className="p-5 max-h-[500px] overflow-y-auto">
              {Object.entries(groupedSpecs).map(([category, specs]: [string, any]) => (
                <div key={category} className="mb-6 last:mb-0">
                  <h3 className="font-semibold text-[#181d26] mb-3 pb-1 border-b border-[#dddddd]">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 text-sm">
                    {specs.map((spec: any) => (
                      <div key={spec.id} className="flex flex-col py-1">
                        <span className="text-[#5f6368] text-[11px] font-semibold mb-1">{spec.attribute_name}</span>
                        <input
                          type="text"
                          value={spec.value || ""}
                          onChange={(e) => updateActiveSpec(spec.id, e.target.value)}
                          className="w-full px-2 py-1.5 border border-[#dddddd] rounded-[4px] focus:outline-none focus:border-[#1b61c9] text-[#181d26] text-[13px]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {activeSpecs.length === 0 && (
                <p className="text-[#9297a0] text-center py-4 text-[13px]">No specifications found for this variant.</p>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
