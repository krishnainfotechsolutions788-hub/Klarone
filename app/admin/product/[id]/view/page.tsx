"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Server, Laptop, Database, Pencil, Box, MoreHorizontal, AlertCircle, Plus, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getV2KnowledgeMaster } from "@/app/actions/knowledge";
import { getInventoryByMasterId, deleteInventoryItem } from "@/app/actions/inventory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ViewInventoryPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [masterData, setMasterData] = useState<any>({});
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [variantsData, setVariantsData] = useState<any[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [masterResult, inventoryResult] = await Promise.all([
          getV2KnowledgeMaster(id),
          getInventoryByMasterId(id)
        ]);

        if (!masterResult.success || !masterResult.data) {
          throw new Error(masterResult.error || "Failed to load master product");
        }
        
        setMasterData(masterResult.data.master || {});
        
        const allVariants = masterResult.data.variants || (masterResult.data.variant ? [masterResult.data.variant] : []);
        const inventory = (inventoryResult.success && inventoryResult.data) ? inventoryResult.data : [];
        
        const variantsWithInventory = allVariants.filter((v: any) => inventory.some((item: any) => item.variant_id === v.id));
        
        setVariantsData(variantsWithInventory);
        if (variantsWithInventory.length > 0) {
          setSelectedVariantId(variantsWithInventory[0].id);
        }
        
        setInventoryItems(inventory);
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this inventory item?")) return;
    const res = await deleteInventoryItem(itemId);
    if (res.success) {
      setInventoryItems(prev => prev.filter(item => item.id !== itemId));
    } else {
      alert("Failed to delete item: " + res.error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 min-h-[600px]">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#181d26]" />
        <p>Loading inventory details...</p>
      </div>
    );
  }

  if (errorMsg && !masterData.id) {
    return (
      <div className="bg-red-50 text-[#d92d20] p-6 rounded-[10px] border border-red-100 max-w-2xl mx-auto mt-8">
        <h3 className="font-bold mb-2">Error</h3>
        <p>{errorMsg}</p>
        <Link href="/admin/product" className="inline-block mt-4 text-[13px] font-medium underline">Go Back</Link>
      </div>
    );
  }

  const totalStock = inventoryItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const activeVariant = variantsData.find(v => v.id === selectedVariantId) || variantsData[0] || {};
  const activeInventory = inventoryItems.filter(item => item.variant_id === selectedVariantId);

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/product">
            <Button variant="outline" size="icon" className="shrink-0 rounded-full h-9 w-9 border-[#dddddd] shadow-none text-[#5f6368] hover:text-[#181d26]">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold font-sora text-gray-900 tracking-tight">
              {masterData.kc_brands?.name} {masterData.model}
            </h1>
            <p className="text-gray-500 mt-1 text-[13px]">
              Inventory Details &bull; Total Stock: {totalStock}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => router.push(`/admin/product/add?kc_id=${id}`)}
            className="h-9 px-4 rounded-[6px] bg-[#181d26] hover:bg-[#0d1218] text-white text-[13px] font-medium shadow-none flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add More Inventory
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Images & Identity */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-[#dddddd] shadow-none rounded-[10px] overflow-hidden p-0">
            <CardHeader className="bg-[#f8fafc] border-b border-[#dddddd] py-3 px-4">
              <CardTitle className="text-[13px] font-medium text-[#181d26] flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-[#5f6368]" />
                Media Gallery
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {masterData.official_images && masterData.official_images.length > 0 ? (
                <div className="space-y-4">
                  <div className="aspect-[4/3] bg-white rounded-[8px] border border-[#dddddd] flex items-center justify-center p-4">
                    <img src={masterData.official_images[0].url || masterData.official_images[0]} alt="Primary" className="w-full h-full object-contain" />
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
        </div>

        {/* Right Column: Description & Stock Ledger */}
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

          <Card className="border-[#dddddd] shadow-none rounded-[10px] overflow-hidden flex flex-col gap-0 p-0">
            <CardHeader className="bg-[#f8fafc] border-b border-[#dddddd] py-3 px-4 flex flex-row items-center justify-between">
              <CardTitle className="text-[13px] font-medium text-[#181d26] flex items-center gap-2">
                <Laptop className="w-4 h-4 text-[#5f6368]" />
                Associated Variants ({variantsData.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex flex-col min-h-[500px]">
              {variantsData.length === 0 ? (
                <div className="p-8 text-center text-[#9297a0] text-[14px]">No variants found for this master product.</div>
              ) : (
                <div className="flex flex-col flex-1">
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
                  <div className="p-4 bg-white border-b border-[#dddddd]">
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
                  
                  {/* Stock Ledger for Active Variant */}
                  <div className="bg-[#f8fafc] px-4 py-3 border-b border-[#dddddd] flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#5f6368]" />
                    <span className="text-[13px] font-medium text-[#181d26]">Inventory for this Variant ({activeInventory.length} Records)</span>
                  </div>
                  <div className="overflow-x-auto flex-1">
                    <Table>
                      <TableHeader className="bg-white [&_tr]:border-b-[#dddddd]">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="font-medium text-[#41454d] text-[12px] uppercase tracking-wider py-3 px-6">Variant SKU</TableHead>
                          <TableHead className="font-medium text-[#41454d] text-[12px] uppercase tracking-wider py-3">Serial / ID</TableHead>
                          <TableHead className="font-medium text-[#41454d] text-[12px] uppercase tracking-wider py-3 text-right">Selling Price</TableHead>
                          <TableHead className="font-medium text-[#41454d] text-[12px] uppercase tracking-wider py-3 text-center">Condition</TableHead>
                          <TableHead className="font-medium text-[#41454d] text-[12px] uppercase tracking-wider py-3 text-center">Status</TableHead>
                          <TableHead className="w-[80px] py-3 text-right text-[12px] font-medium text-[#41454d] uppercase tracking-wider px-6">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeInventory.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="h-32 text-center text-[#9297a0]">
                              <div className="flex flex-col items-center justify-center gap-2">
                                <AlertCircle className="w-6 h-6 text-[#9297a0]/50" />
                                <p>No inventory units found for this specific variant.</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : activeInventory.map((item) => {
                          const isSerialized = item.inventory_mode === 'serialized';
                          return (
                            <TableRow key={item.id} className="border-b-[#dddddd] transition-colors bg-white hover:bg-[#f8fafc]">
                              <TableCell className="py-3 px-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-[4px] bg-[#f0f2f5] border border-[#dddddd] flex items-center justify-center shrink-0">
                                    {isSerialized ? <Laptop className="w-4 h-4 text-[#5f6368]" /> : <Box className="w-4 h-4 text-[#5f6368]" />}
                                  </div>
                                  <span className="font-medium text-[#181d26] text-[13px]">
                                    {item.kc_variants?.sku || 'N/A'}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="py-3">
                                <span className="text-[#181d26] text-[13px] block">
                                  {isSerialized ? item.serial_number || 'No Serial' : `Quantity: ${item.quantity}`}
                                </span>
                                <span className="text-[#9297a0] text-[11px] uppercase tracking-wider">
                                  {isSerialized ? 'Serialized' : 'Bulk'}
                                </span>
                              </TableCell>
                              <TableCell className="py-3 text-right">
                                <div className="flex flex-col items-end">
                                  <span className="text-[#181d26] text-[13px] font-medium">₹{item.selling_price}</span>
                                  <span className="text-[#9297a0] text-[11px]">Purchase: ₹{item.purchase_price}</span>
                                </div>
                              </TableCell>
                              <TableCell className="py-3 text-center">
                                <span className="text-[#41454d] text-[12px]">{item.condition}</span>
                              </TableCell>
                              <TableCell className="py-3 text-center">
                                <Badge variant="outline" className="bg-[#ecfdf5] text-[#047857] border-[#a7f3d0] text-[11px]">
                                  {item.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="py-3 text-right px-6">
                                <DropdownMenu>
                                  <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-[6px] h-8 w-8 p-0 text-[#9297a0] hover:text-[#181d26] hover:bg-[#e2e8f0] outline-none">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-[140px] rounded-[8px] border-[#dddddd] shadow-sm">
                                    <DropdownMenuItem className="text-[12px] text-[#c5221f] focus:bg-[#fce8e6] focus:text-[#c5221f] cursor-pointer" onClick={() => handleDelete(item.id)}>
                                      Delete Item
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
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
