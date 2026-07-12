"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Server, Laptop, Brain, Pencil, Database, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getV2KnowledgeMaster } from "@/app/actions/knowledge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ViewKnowledgeCatalogPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [masterData, setMasterData] = useState<any>({});
  const [variantsData, setVariantsData] = useState<any[]>([]);
  const [specificationsData, setSpecificationsData] = useState<any[]>([]);
  const [intelligencesData, setIntelligencesData] = useState<any[]>([]);
  
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
        
        setSpecificationsData(result.data.specifications || []);
        setIntelligencesData(result.data.intelligences || (result.data.intelligence ? [result.data.intelligence] : []));
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

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
  const activeVariantSpecs = specificationsData.filter(s => s.variant_id === selectedVariantId);

  return (
    <div className="flex flex-col gap-6 max-w-[1200px] mx-auto pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/knowledge-catalog">
            <Button variant="outline" size="icon" className="shrink-0 rounded-full h-9 w-9 border-[#dddddd] shadow-none text-[#5f6368] hover:text-[#181d26]">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold font-sora text-gray-900 tracking-tight">
              {masterData.kc_brands?.name} {masterData.model}
            </h1>
            <p className="text-gray-500 mt-1 text-[13px]">
              Master Product View &bull; ID: {masterData.id?.substring(0,8)}...
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/admin/knowledge-catalog/${id}`}>
            <Button variant="outline" className="h-9 px-4 rounded-[6px] border-[#dddddd] text-[#181d26] text-[13px] hover:bg-[#f8fafc] shadow-none flex items-center gap-1.5">
              <Pencil className="w-3.5 h-3.5" />
              Edit Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Images & Specs */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-[#dddddd] shadow-none rounded-[10px] overflow-hidden p-0">
            <CardHeader className="bg-[#f8fafc] border-b border-[#dddddd] py-3 px-4">
              <CardTitle className="text-[13px] font-medium text-[#181d26] flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-[#5f6368]" />
                Media Gallery
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {images.length > 0 ? (
                <div className="space-y-4">
                  <div className="aspect-[4/3] bg-white rounded-[8px] border border-[#dddddd] flex items-center justify-center p-4">
                    <img src={images[0].url || images[0]} alt="Primary" className="w-full h-full object-contain" />
                  </div>
                  {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 mt-4">
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

          <Card className="border-[#dddddd] shadow-none rounded-[10px] overflow-hidden">
            <CardHeader className="bg-[#f8fafc] border-b border-[#dddddd] py-3 px-4">
              <CardTitle className="text-[13px] font-medium text-[#181d26] flex items-center gap-2">
                <Database className="w-4 h-4 text-[#5f6368]" />
                Identity & Identifiers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col text-[13px] divide-y divide-[#dddddd]">
                <div className="flex justify-between p-4">
                  <span className="text-[#5f6368]">Brand</span>
                  <span className="font-medium text-[#181d26]">{masterData.kc_brands?.name}</span>
                </div>
                <div className="flex justify-between p-4">
                  <span className="text-[#5f6368]">Model</span>
                  <span className="font-medium text-[#181d26]">{masterData.model}</span>
                </div>
                <div className="flex justify-between p-4">
                  <span className="text-[#5f6368]">Series</span>
                  <span className="font-medium text-[#181d26]">{masterData.series || 'N/A'}</span>
                </div>
                <div className="flex justify-between p-4">
                  <span className="text-[#5f6368]">GTIN / EAN</span>
                  <span className="font-mono text-[#181d26]">{masterData.gtin || 'N/A'}</span>
                </div>
                <div className="flex justify-between p-4 bg-[#f8fafc]">
                  <span className="text-[#5f6368]">Icecat ID</span>
                  <span className="font-mono text-[#181d26]">{masterData.icecat_id || 'N/A'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#dddddd] shadow-none rounded-[10px] overflow-hidden p-0">
            <CardHeader className="bg-[#f8fafc] border-b border-[#dddddd] py-3 px-4">
              <CardTitle className="text-[13px] font-medium text-[#181d26] flex items-center gap-2">
                <List className="w-4 h-4 text-[#5f6368]" />
                Detailed Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {activeVariantSpecs.length === 0 ? (
                <div className="p-6 text-center text-[#9297a0] text-[13px]">No specifications available.</div>
              ) : (
                <div className="flex flex-col text-[12px] divide-y divide-[#dddddd] max-h-[600px] overflow-y-auto">
                  {activeVariantSpecs.map((spec: any, idx: number) => (
                    <div key={idx} className="flex justify-between p-3 hover:bg-[#f8fafc]">
                      <span className="text-[#5f6368] pr-4">{spec.attribute_name}</span>
                      <span className="font-medium text-[#181d26] text-right">
                        {spec.value} {spec.unit || ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
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
              <div className="text-[14px] text-[#41454d] leading-relaxed">{masterData.model || "N/A"}</div>
            </CardContent>
          </Card>

          <Card className="border-[#dddddd] shadow-none rounded-[10px] overflow-hidden p-0">
            <CardHeader className="bg-[#f8fafc] border-b border-[#dddddd] py-3 px-4">
              <CardTitle className="text-[13px] font-medium text-[#181d26] flex items-center gap-2">
                <Server className="w-4 h-4 text-[#5f6368]" />
                Master Description
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {masterData.official_descriptions ? (
                <div 
                  className="prose prose-sm max-w-none text-[#41454d] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: masterData.official_descriptions }}
                />
              ) : (
                <p className="text-[#9297a0] italic text-[14px]">No description available for this master product.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-[#dddddd] shadow-none rounded-[10px] overflow-hidden p-0">
            <CardHeader className="bg-[#f8fafc] border-b border-[#dddddd] py-3 px-4 flex flex-row items-center justify-between">
              <CardTitle className="text-[13px] font-medium text-[#181d26] flex items-center gap-2">
                <Laptop className="w-4 h-4 text-[#5f6368]" />
                Associated Variants ({variantsData.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {variantsData.length === 0 ? (
                <div className="p-8 text-center text-[#9297a0] text-[14px]">No variants found for this master product.</div>
              ) : (
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

                  {/* Active Variant Details */}
                  <div className="p-4 bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold text-[#181d26]">Variant Details</div>
                        <div className="text-[12px] text-[#9297a0] font-mono mt-0.5">ID: {activeVariant.id}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      <div className="bg-white border border-[#dddddd] rounded-[6px] p-3">
                        <div className="text-[11px] text-[#9297a0] uppercase font-semibold mb-1">Processor</div>
                        <div className="text-[13px] text-[#181d26] font-medium line-clamp-2" title={activeVariant.cpu}>{activeVariant.cpu || 'Unknown'}</div>
                      </div>
                      <div className="bg-white border border-[#dddddd] rounded-[6px] p-3">
                        <div className="text-[11px] text-[#9297a0] uppercase font-semibold mb-1">Memory (RAM)</div>
                        <div className="text-[13px] text-[#181d26] font-medium line-clamp-2">{activeVariant.ram || 'Unknown'}</div>
                      </div>
                      <div className="bg-white border border-[#dddddd] rounded-[6px] p-3">
                        <div className="text-[11px] text-[#9297a0] uppercase font-semibold mb-1">Storage</div>
                        <div className="text-[13px] text-[#181d26] font-medium line-clamp-2">{activeVariant.storage || 'Unknown'}</div>
                      </div>
                      <div className="bg-white border border-[#dddddd] rounded-[6px] p-3">
                        <div className="text-[11px] text-[#9297a0] uppercase font-semibold mb-1">Display</div>
                        <div className="text-[13px] text-[#181d26] font-medium line-clamp-2" title={activeVariant.display}>{activeVariant.display || 'Unknown'}</div>
                      </div>
                      <div className="bg-white border border-[#dddddd] rounded-[6px] p-3 col-span-2 md:col-span-4">
                        <div className="text-[11px] text-[#9297a0] uppercase font-semibold mb-1">Battery</div>
                        <div className="text-[13px] text-[#181d26] font-medium line-clamp-2" title={activeVariant.battery}>{activeVariant.battery || 'Unknown'}</div>
                      </div>
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
