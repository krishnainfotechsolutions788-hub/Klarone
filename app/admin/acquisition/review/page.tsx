"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Save, Loader2, Server, Laptop, Brain, Database, AlertCircle, RefreshCw, PlusCircle, CheckCircle2, LayoutGrid, List, Bold, Italic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { saveV2KnowledgeData, matchKnowledgeProductAction } from "@/app/actions/knowledge";
import { MatchAction, MatchSuggestion } from "@/lib/services/ImportMatchingService";
import { useRef } from "react";

// A lightweight, dependency-free Rich Text Editor for React 19
function SimpleRichTextEditor({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const editorRef = useRef<HTMLDivElement>(null);
  
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
          <List className="w-3.5 h-3.5" />
        </button>
      </div>
      <div 
        ref={editorRef}
        contentEditable 
        onInput={handleInput}
        onBlur={handleInput}
        className="flex-1 p-3 outline-none overflow-y-auto text-[13px] text-[#181d26] prose prose-sm max-w-none leading-relaxed min-h-[150px]"
      />
    </div>
  );
}

function ReviewContent() {
  const searchParams = useSearchParams();
  const icecatId = searchParams.get("icecatId");
  const q = searchParams.get("q");
  const brand = searchParams.get("brand");
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [icecatData, setIcecatData] = useState<any>(null);

  // Mapped Data States
  const [masterData, setMasterData] = useState<any>({});
  const [variantData, setVariantData] = useState<any>({});
  const [intelligenceData, setIntelligenceData] = useState<any>({});

  // Matching States
  const [matchSuggestion, setMatchSuggestion] = useState<MatchSuggestion | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [selectedAction, setSelectedAction] = useState<MatchAction>('CREATE_PRODUCT');
  const [targetId, setTargetId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!icecatId && !q) return;

    async function fetchFullDatasheet() {
      try {
        const res = await fetch("/api/admin/icecat/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ icecatId, q, brand }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        const prod = data.data;
        const essential = prod.EssentialInfo || prod.GeneralInfo || prod;

        // Extract full specifications
        const specs: Record<string, Record<string, string>> = {};
        const featuresGroups = prod.FeaturesGroups || [];
        for (const group of featuresGroups) {
          const groupName = group.FeatureGroup?.Name?.Value || "General";
          if (!specs[groupName]) specs[groupName] = {};
          
          if (group.Features && Array.isArray(group.Features)) {
            for (const feature of group.Features) {
              const featureName = feature.Feature?.Name?.Value;
              const featureValue = feature.PresentationValue || feature.Value;
              if (featureName && featureValue) {
                specs[groupName][featureName] = featureValue;
              }
            }
          }
        }

        setIcecatData(prod);

        // Extract Images
        const images = [];
        if (prod.Image?.HighPic || prod.Image?.Pic500x500) {
          images.push({ url: prod.Image.HighPic || prod.Image.Pic500x500, is_primary: true });
        }
        if (prod.Gallery && Array.isArray(prod.Gallery)) {
          prod.Gallery.forEach((img: any) => {
            const pic = img.HighPic || img.Pic || img.Pic500x500;
            if (pic && !images.find(i => i.url === pic)) {
              images.push({ url: pic, is_primary: false });
            }
          });
        }
        
        // Extract Description
        const description = prod.GeneralInfo?.Description?.LongDesc || prod.GeneralInfo?.Description?.MiddleDesc || "";

        // Safe GTIN Extraction
        let gtinValue = "";
        if (essential.GTIN && Array.isArray(essential.GTIN)) gtinValue = essential.GTIN[0];
        else if (typeof essential.GTIN === "string") gtinValue = essential.GTIN;
        else if (essential.GTINs && Array.isArray(essential.GTINs) && essential.GTINs.length > 0) gtinValue = essential.GTINs[0].GTIN || "";

        // Extract Model (Prefer Title for long descriptive names, fallback to ProductName)
        let modelValue = essential.Title || essential.ProductName || "Unknown Model";

        // Extract Series (Combine Family and Series if available, like "ProBook 600")
        let seriesValue = "";
        if (essential.ProductFamily?.Value && essential.ProductSeries?.Value) {
          seriesValue = `${essential.ProductFamily.Value} ${essential.ProductSeries.Value}`;
        } else {
          seriesValue = essential.ProductSeries?.Value || essential.ProductFamily?.Value || "";
        }

        // Simple Mapping Logic (in a real app, this maps specific Icecat feature IDs to Klarone fields)
        setMasterData({
          brand: essential.Brand || essential.Supplier || "Unknown Brand",
          model: modelValue,
          series: seriesValue,
          gtin: gtinValue,
          icecat_id: icecatId || prod.Product_id || "Imported via MPN",
          msrp: 0,
          official_images: images,
          official_descriptions: description,
          official_specifications: specs
        });

        // Try to intelligently map variant data from specs
        const cpu = specs["Processor"]?.["Processor family"] 
          ? `${specs["Processor"]["Processor family"]} ${specs["Processor"]["Processor model"] || ""}` 
          : "Unknown CPU";
        const ram = specs["Memory"]?.["Internal memory"] || "Unknown RAM";
        const storage = specs["Storage"]?.["Total storage capacity"] || "Unknown Storage";
        const display = specs["Display"]?.["Display diagonal"] || "Unknown Display";
        const battery = specs["Battery"]?.["Battery capacity"] || "Unknown Battery";

        setVariantData({
          cpu: cpu,
          ram: ram,
          storage: storage,
          display: display,
          battery: battery,
        });

        setIntelligenceData({
          student_score: 85,
          gaming_score: 40,
          programming_score: 80,
          business_score: 88
        });

      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFullDatasheet();
  }, [icecatId]);

  useEffect(() => {
    if (masterData.model && variantData.cpu && !isMatching && !matchSuggestion) {
      async function runMatching() {
        setIsMatching(true);
        const res = await matchKnowledgeProductAction(masterData, variantData);
        if (res.success && res.data) {
          setMatchSuggestion(res.data);
          setSelectedAction(res.data.actionType);
          setTargetId(res.data.targetId);
        }
        setIsMatching(false);
      }
      runMatching();
    }
  }, [masterData, variantData]);

  const handleSpecChange = (category: string, name: string, value: string) => {
    setMasterData((prev: any) => ({
      ...prev,
      official_specifications: {
        ...prev.official_specifications,
        [category]: {
          ...(prev.official_specifications?.[category] || {}),
          [name]: value
        }
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg("");
    
    const result = await saveV2KnowledgeData({ 
      masterData, 
      variantData, 
      intelligenceData,
      actionType: selectedAction,
      targetId: targetId
    });
    
    if (result.success) {
      alert("Saved Draft to V2 Master Catalog!");
      router.push("/admin/knowledge-catalog");
    } else {
      setErrorMsg(result.error || "Failed to save draft");
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#00A7B5]" />
        <p>Downloading full datasheet from Icecat...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-100">
        <h3 className="font-bold mb-2">Failed to load Icecat Data</h3>
        <p>{errorMsg}</p>
        <Link href="/admin/acquisition" className="inline-block mt-4 text-sm font-medium underline">Go Back</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/acquisition">
            <Button variant="outline" size="icon" className="shrink-0 rounded-full h-9 w-9 border-[#dddddd] shadow-none text-[#5f6368] hover:text-[#181d26]">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold font-sora text-[#181d26] tracking-tight">Review Import</h1>
            <p className="text-[#5f6368] mt-1 text-[13px]">Review the mapped data before publishing to the V2 Master Catalog.</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="h-9 px-4 rounded-[6px] bg-[#00A7B5] hover:bg-[#0096a3] text-white text-[13px] font-medium shadow-none flex items-center gap-1.5">
          {isSaving ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
          Approve & Save Draft
        </Button>
      </div>

      {/* Import Matching Suggestion Card */}
      {isMatching ? (
        <Card className="border-[#dddddd] shadow-none rounded-[10px] overflow-hidden p-6 flex items-center justify-center text-[#5f6368] bg-[#f8fafc]">
          <Loader2 className="w-5 h-5 mr-3 animate-spin text-[#1b61c9]" />
          <span className="text-[13px] font-medium">Analyzing Master Catalog for existing matches...</span>
        </Card>
      ) : matchSuggestion ? (
        <Card className={`border shadow-none rounded-[10px] overflow-hidden ${
          matchSuggestion.confidence >= 95 ? 'bg-[#f0fdf4] border-[#bbf7d0]' : 
          matchSuggestion.confidence >= 80 ? 'bg-[#f0f9ff] border-[#bae6fd]' : 
          'bg-[#f8fafc] border-[#dddddd]'
        }`}>
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <CheckCircle2 className={`w-4 h-4 ${matchSuggestion.confidence >= 90 ? 'text-[#16a34a]' : 'text-[#0284c7]'}`} />
                  <h2 className="text-[14px] font-semibold text-[#181d26]">Import Assistant</h2>
                  <span className={`ml-2 px-2 py-0.5 rounded-[4px] border text-[11px] font-semibold ${matchSuggestion.confidence >= 95 ? 'bg-white border-[#bbf7d0] text-[#16a34a]' : 'bg-white border-[#bae6fd] text-[#0284c7]'}`}>
                    Confidence: {matchSuggestion.confidence}%
                  </span>
                </div>
                <p className="text-[#5f6368] text-[13px]">{matchSuggestion.reason}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-[8px] border border-[#dddddd] p-4">
              <h3 className="font-semibold text-[#181d26] mb-3 text-[11px] uppercase tracking-wide">Recommended Action</h3>
              <div className="space-y-2.5">
                
                <label className={`flex items-center p-3 rounded-[6px] border cursor-pointer transition-colors ${selectedAction === 'UPDATE_VARIANT' ? 'border-[#1b61c9] bg-[#eff6ff]' : 'border-[#dddddd] hover:bg-[#f8fafc]'}`}>
                  <input 
                    type="radio" 
                    name="importAction" 
                    value="UPDATE_VARIANT" 
                    checked={selectedAction === 'UPDATE_VARIANT'} 
                    onChange={() => setSelectedAction('UPDATE_VARIANT')}
                    disabled={!matchSuggestion.targetId && matchSuggestion.actionType !== 'UPDATE_VARIANT'}
                    className="w-3.5 h-3.5 text-[#1b61c9] border-[#dddddd] focus:ring-[#1b61c9]"
                  />
                  <div className="ml-3 flex items-center gap-2 text-[13px]">
                    <RefreshCw className="w-3.5 h-3.5 text-[#5f6368]" />
                    <span className="font-medium text-[#181d26]">Update Existing Variant</span>
                    {selectedAction === 'UPDATE_VARIANT' && matchSuggestion.existingVariant && (
                      <span className="text-[#5f6368] ml-1">(ID: {matchSuggestion.existingVariant.id.substring(0,8)}...)</span>
                    )}
                  </div>
                </label>

                <label className={`flex items-center p-3 rounded-[6px] border cursor-pointer transition-colors ${selectedAction === 'CREATE_VARIANT' ? 'border-[#1b61c9] bg-[#eff6ff]' : 'border-[#dddddd] hover:bg-[#f8fafc]'}`}>
                  <input 
                    type="radio" 
                    name="importAction" 
                    value="CREATE_VARIANT" 
                    checked={selectedAction === 'CREATE_VARIANT'} 
                    onChange={() => setSelectedAction('CREATE_VARIANT')}
                    disabled={!matchSuggestion.targetId && matchSuggestion.actionType !== 'CREATE_VARIANT'}
                    className="w-3.5 h-3.5 text-[#1b61c9] border-[#dddddd] focus:ring-[#1b61c9]"
                  />
                  <div className="ml-3 flex items-center gap-2 text-[13px]">
                    <PlusCircle className="w-3.5 h-3.5 text-[#5f6368]" />
                    <span className="font-medium text-[#181d26]">Create New Variant under Existing Master Product</span>
                    {selectedAction === 'CREATE_VARIANT' && matchSuggestion.existingProduct && (
                      <span className="text-[#5f6368] ml-1">({matchSuggestion.existingProduct.model})</span>
                    )}
                  </div>
                </label>

                <label className={`flex items-center p-3 rounded-[6px] border cursor-pointer transition-colors ${selectedAction === 'CREATE_PRODUCT' ? 'border-[#1b61c9] bg-[#eff6ff]' : 'border-[#dddddd] hover:bg-[#f8fafc]'}`}>
                  <input 
                    type="radio" 
                    name="importAction" 
                    value="CREATE_PRODUCT" 
                    checked={selectedAction === 'CREATE_PRODUCT'} 
                    onChange={() => {
                      setSelectedAction('CREATE_PRODUCT');
                      setTargetId(undefined); // No target needed for new product
                    }}
                    className="w-3.5 h-3.5 text-[#1b61c9] border-[#dddddd] focus:ring-[#1b61c9]"
                  />
                  <div className="ml-3 flex items-center gap-2 text-[13px]">
                    <Database className="w-3.5 h-3.5 text-[#5f6368]" />
                    <span className="font-medium text-[#181d26]">Create Entirely New Product & Variant</span>
                  </div>
                </label>

              </div>
            </div>
          </div>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-[#dddddd] shadow-none rounded-[10px] overflow-hidden p-0">
            <CardHeader className="bg-[#f8fafc] border-b border-[#dddddd] py-3 px-4">
              <CardTitle className="text-[13px] font-medium text-[#181d26] flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-[#5f6368]" />
                Official Media
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {masterData.official_images && masterData.official_images.length > 0 ? (
                <div className="space-y-4">
                  <div className="aspect-[4/3] bg-white rounded-[8px] border border-[#dddddd] flex items-center justify-center p-4 relative">
                    <img src={masterData.official_images[0].url || masterData.official_images[0]} alt="Primary" className="w-full h-full object-contain" />
                    {masterData.official_images[0].is_primary && (
                      <span className="absolute top-2 right-2 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                        PRIMARY
                      </span>
                    )}
                  </div>
                  {masterData.official_images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {masterData.official_images.slice(1).map((img: any, idx: number) => (
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
                  <span className="font-medium px-3 py-1.5 bg-[#f8fafc] rounded-[6px] border border-[#dddddd] text-[#181d26]">{masterData.brand || "Unknown Brand"}</span>
                </div>
                <div className="flex flex-col p-4">
                  <span className="text-[#5f6368] mb-2">Model</span>
                  <input type="text" value={masterData.model || ""} onChange={(e) => setMasterData({...masterData, model: e.target.value})} className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#1b61c9] text-[#181d26] bg-white" />
                </div>
                <div className="flex flex-col p-4">
                  <span className="text-[#5f6368] mb-2">Series</span>
                  <input type="text" value={masterData.series || ""} onChange={(e) => setMasterData({...masterData, series: e.target.value})} className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#1b61c9] text-[#181d26] bg-white" />
                </div>
                <div className="flex flex-col p-4">
                  <span className="text-[#5f6368] mb-2">GTIN / EAN</span>
                  <input type="text" value={masterData.gtin || ""} onChange={(e) => setMasterData({...masterData, gtin: e.target.value})} className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#1b61c9] text-[#181d26] bg-white font-mono" />
                </div>
                <div className="flex justify-between p-4 bg-[#f8fafc]">
                  <span className="text-[#5f6368]">Icecat ID</span>
                  <span className="font-mono text-[#181d26]">{masterData.icecat_id || 'N/A'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
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
              <div className="h-64">
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
              <div className="p-4 bg-[#f8fafc]">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-[11px] text-[#5f6368] uppercase font-semibold mb-2">Processor</div>
                    <input type="text" value={variantData.cpu || ""} onChange={(e) => setVariantData({...variantData, cpu: e.target.value})} className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#0284c7] text-[#181d26] text-[13px] bg-white" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#5f6368] uppercase font-semibold mb-2">Memory (RAM)</div>
                    <input type="text" value={variantData.ram || ""} onChange={(e) => setVariantData({...variantData, ram: e.target.value})} className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#0284c7] text-[#181d26] text-[13px] bg-white" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#5f6368] uppercase font-semibold mb-2">Storage</div>
                    <input type="text" value={variantData.storage || ""} onChange={(e) => setVariantData({...variantData, storage: e.target.value})} className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#0284c7] text-[#181d26] text-[13px] bg-white" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#5f6368] uppercase font-semibold mb-2">Display</div>
                    <input type="text" value={variantData.display || ""} onChange={(e) => setVariantData({...variantData, display: e.target.value})} className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#0284c7] text-[#181d26] text-[13px] bg-white" />
                  </div>
                  <div className="md:col-span-4 mt-2">
                    <div className="text-[11px] text-[#5f6368] uppercase font-semibold mb-2">Battery</div>
                    <input type="text" value={variantData.battery || ""} onChange={(e) => setVariantData({...variantData, battery: e.target.value})} className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#0284c7] text-[#181d26] text-[13px] bg-white" />
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
                  <input type="number" min="0" max="100" value={intelligenceData.student_score || 0} onChange={(e) => setIntelligenceData({...intelligenceData, student_score: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#9333ea] text-[#181d26] text-[13px] bg-white" />
                  <div className="w-full bg-gray-100 h-1.5 mt-2 rounded-full"><div className="bg-[#9333ea] h-full rounded-full" style={{ width: `${intelligenceData.student_score || 0}%` }}></div></div>
                </div>
                <div>
                  <label className="text-[#5f6368] text-[11px] uppercase font-semibold mb-2 block">Business</label>
                  <input type="number" min="0" max="100" value={intelligenceData.business_score || 0} onChange={(e) => setIntelligenceData({...intelligenceData, business_score: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#9333ea] text-[#181d26] text-[13px] bg-white" />
                  <div className="w-full bg-gray-100 h-1.5 mt-2 rounded-full"><div className="bg-[#9333ea] h-full rounded-full" style={{ width: `${intelligenceData.business_score || 0}%` }}></div></div>
                </div>
                <div>
                  <label className="text-[#5f6368] text-[11px] uppercase font-semibold mb-2 block">Gaming</label>
                  <input type="number" min="0" max="100" value={intelligenceData.gaming_score || 0} onChange={(e) => setIntelligenceData({...intelligenceData, gaming_score: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#9333ea] text-[#181d26] text-[13px] bg-white" />
                  <div className="w-full bg-gray-100 h-1.5 mt-2 rounded-full"><div className="bg-[#9333ea] h-full rounded-full" style={{ width: `${intelligenceData.gaming_score || 0}%` }}></div></div>
                </div>
                <div>
                  <label className="text-[#5f6368] text-[11px] uppercase font-semibold mb-2 block">Programming</label>
                  <input type="number" min="0" max="100" value={intelligenceData.programming_score || 0} onChange={(e) => setIntelligenceData({...intelligenceData, programming_score: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border border-[#dddddd] rounded-[6px] focus:outline-none focus:border-[#9333ea] text-[#181d26] text-[13px] bg-white" />
                  <div className="w-full bg-gray-100 h-1.5 mt-2 rounded-full"><div className="bg-[#9333ea] h-full rounded-full" style={{ width: `${intelligenceData.programming_score || 0}%` }}></div></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dynamic Specifications */}
          <Card className="border-[#dddddd] shadow-none rounded-[10px] overflow-hidden p-0">
            <CardHeader className="bg-[#f8fafc] border-b border-[#dddddd] py-3 px-4 flex flex-row items-center justify-between">
              <CardTitle className="text-[13px] font-medium text-[#181d26] flex items-center gap-2">
                <Database className="w-4 h-4 text-[#5f6368]" />
                Extracted Specifications (Edit)
              </CardTitle>
              <span className="text-[11px] text-[#5f6368] bg-white px-2 py-1 rounded-[4px] border border-[#dddddd]">{Object.keys(masterData.official_specifications || {}).length} Categories</span>
            </CardHeader>
            <CardContent className="p-5 max-h-[500px] overflow-y-auto">
              {Object.entries(masterData.official_specifications || {}).map(([category, specs]: [string, any]) => (
                <div key={category} className="mb-6 last:mb-0">
                  <h3 className="font-semibold text-[#181d26] mb-3 pb-1 border-b border-[#dddddd]">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 text-sm">
                    {Object.entries(specs).map(([name, value]: [string, any]) => (
                      <div key={name} className="flex flex-col py-1">
                        <span className="text-[#5f6368] text-[11px] font-semibold mb-1">{name}</span>
                        <input
                          type="text"
                          value={value || ""}
                          onChange={(e) => handleSpecChange(category, name, e.target.value)}
                          className="w-full px-2 py-1.5 border border-[#dddddd] rounded-[4px] focus:outline-none focus:border-[#1b61c9] text-[#181d26] text-[13px] bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {(!masterData.official_specifications || Object.keys(masterData.official_specifications).length === 0) && (
                <p className="text-[#9297a0] text-center py-4 text-[13px]">No specifications found in Icecat data.</p>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

export default function ReviewAcquisitionPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
      <ReviewContent />
    </Suspense>
  );
}
