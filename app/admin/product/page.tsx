"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, MoreHorizontal, ChevronDown, ChevronRight, Plus, Laptop, Database, Tag, Users, AlertCircle, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { getInventoryList, deleteInventoryItem } from "@/app/actions/inventory";
import { getV2KnowledgeCatalog } from "@/app/actions/knowledge";
import StatCard from "../components/StatCard";

export default function ProductPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;
  const [kcItems, setKcItems] = useState<any[]>([]);

  const groupedInventory = React.useMemo(() => {
    const groups: Record<string, { master: any; items: any[]; totalStock: number }> = {};
    
    items.forEach(item => {
      const master = item.kc_variants?.kc_master_products;
      if (!master) return;
      
      const masterId = master.id;
      if (!groups[masterId]) {
        groups[masterId] = {
          master,
          items: [],
          totalStock: 0
        };
      }
      
      groups[masterId].items.push(item);
      groups[masterId].totalStock += (item.quantity || 1);
    });
    
    return Object.values(groups);
  }, [items]);

  useEffect(() => {
    if (isImportModalOpen && kcItems.length === 0) {
      getV2KnowledgeCatalog().then(res => {
        if (res.success && res.data) {
          setKcItems(res.data);
        }
      });
    }
  }, [isImportModalOpen]);

  useEffect(() => {
    async function fetchInventory() {
      setLoading(true);
      const res = await getInventoryList(page, pageSize, searchQuery);
      if (res.success && res.data) {
        setItems(res.data);
        setTotalCount(res.count || 0);
      }
      setLoading(false);
    }
    const timeoutId = setTimeout(() => {
      fetchInventory();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [page, searchQuery]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inventory item?")) return;
    const res = await deleteInventoryItem(id);
    if (res.success) {
      setItems(prev => prev.filter(item => item.id !== id));
    } else {
      alert("Failed to delete item: " + res.error);
    }
  };

  const totalUnitsAll = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const lowStockProducts = 0;

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-10 text-white">
      
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] border border-white/10 mb-2 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00A7B5]"></span>
            <span className="text-[12px] font-normal text-white/70 tracking-wide">Catalog & Stock</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">Inventory Management</h1>
          <p className="text-sm text-white/50 mt-1">Manage physical hardware stock, price bounds, and master catalog links.</p>
        </div>
      </div>

      {/* Aggregate Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Inventory" icon={Database} primaryValue={totalUnitsAll} primaryLabel="Physical Stock" />
        <StatCard title="Active Rentals" icon={Users} primaryValue={0} primaryLabel="Currently Rented" />
        <StatCard title="Low Stock Alerts" icon={AlertCircle} primaryValue={lowStockProducts} primaryLabel="Needs Reorder" />
        <StatCard title="Unique Items" icon={Tag} primaryValue={items.length} primaryLabel="Rows" />
      </div>

      {/* Main Table Card */}
      <Card className="border-white/10 shadow-2xl rounded-2xl overflow-hidden flex flex-col gap-0 p-0 bg-[#111113]/90 backdrop-blur-xl text-white">
        
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#0A0A0C] gap-4">
          <div className="relative w-full sm:w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full h-9 pl-9 pr-4 bg-[#121215] border border-white/10 rounded-full text-[13.5px] text-white outline-none focus:border-[#00A7B5] transition-colors placeholder:text-white/40"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
              <DialogTrigger>
                <Button className="h-9 px-4 rounded-full bg-white hover:bg-white/90 text-black text-[13px] font-medium shadow-sm flex items-center gap-1.5 cursor-pointer">
                  <Plus className="w-3.5 h-3.5" />
                  Add Inventory (from Master Catalog)
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl h-[80vh] flex flex-col p-0 gap-0 overflow-hidden bg-[#111113] border-white/10 text-white shadow-2xl rounded-2xl">
                <DialogHeader className="px-6 py-4 border-b border-white/10 bg-[#0A0A0C] shrink-0">
                  <DialogTitle className="text-[17px] font-medium text-white">Select Master Product</DialogTitle>
                  <p className="text-[13px] text-white/50 mt-1">Choose a product from your knowledge catalog to start adding physical stock.</p>
                  
                  <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by brand, model, or series..."
                      className="w-full h-9 pl-9 pr-4 bg-[#121215] border border-white/10 rounded-full text-[13px] text-white outline-none focus:border-[#00A7B5] transition-colors placeholder:text-white/40"
                    />
                  </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 bg-[#111113]">
                  <div className="flex flex-col gap-3">
                    {kcItems.length === 0 ? (
                      <div className="text-center text-sm text-white/40 py-12 flex flex-col items-center">
                        <Box className="w-8 h-8 mb-3 opacity-30 text-[#00A7B5]" />
                        Loading catalog devices...
                      </div>
                    ) : (
                      kcItems
                        .filter(item => {
                          const searchStr = `${item.kc_brands?.name || ''} ${item.model} ${item.series || ''}`.toLowerCase();
                          return searchStr.includes(searchQuery.toLowerCase());
                        })
                        .map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border border-white/10 rounded-xl hover:border-white/20 hover:bg-white/5 transition-all group gap-6 bg-[#0A0A0C]">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                              <Box className="w-5 h-5 text-[#00A7B5]" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <div className="font-medium text-[14px] text-white truncate">{item.kc_brands?.name} {item.model}</div>
                              <div className="text-[12px] text-white/40 mt-0.5 truncate">{item.series || 'No Series'} • GTIN: {item.gtin || 'N/A'}</div>
                            </div>
                          </div>
                          <Button 
                            onClick={() => router.push(`/admin/product/add?kc_id=${item.id}`)}
                            size="sm"
                            className="bg-white hover:bg-white/90 text-black shadow-sm h-8 px-4 rounded-full text-[12px] font-medium shrink-0"
                          >
                            Add Inventory
                          </Button>
                        </div>
                      ))
                    )}
                    
                    {kcItems.length > 0 && kcItems.filter(item => `${item.kc_brands?.name || ''} ${item.model} ${item.series || ''}`.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                      <div className="text-center text-sm text-white/40 py-12 flex flex-col items-center">
                        No catalog products match your search query.
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Table Content */}
        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[550px]">
            <Table>
              <TableHeader className="bg-[#0A0A0C] border-b border-white/10">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="w-[40px] px-4 py-3"></TableHead>
                  <TableHead className="font-normal text-white/50 text-[11.5px] uppercase tracking-wider py-3">Product / Variant</TableHead>
                  <TableHead className="font-normal text-white/50 text-[11.5px] uppercase tracking-wider py-3">Stock / ID</TableHead>
                  <TableHead className="font-normal text-white/50 text-[11.5px] uppercase tracking-wider py-3 text-right">Price Range</TableHead>
                  <TableHead className="font-normal text-white/50 text-[11.5px] uppercase tracking-wider py-3 text-center">Status</TableHead>
                  <TableHead className="w-[80px] py-3 text-right text-[11.5px] font-normal text-white/50 uppercase tracking-wider px-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-white/40 font-normal">Loading inventory catalog...</TableCell>
                  </TableRow>
                ) : groupedInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-white/40 font-normal">No inventory items found.</TableCell>
                  </TableRow>
                ) : groupedInventory.map((group) => {
                  const master = group.master;
                  const brandName = master?.kc_brands?.name || '';
                  const modelName = master?.model || 'Unknown';
                  
                  // Calculate master row aggregates
                  const minPrice = Math.min(...group.items.map(i => i.selling_price || 0));
                  const maxPrice = Math.max(...group.items.map(i => i.selling_price || 0));
                  const priceStr = minPrice === maxPrice 
                    ? `₹${minPrice.toLocaleString()}` 
                    : `₹${minPrice.toLocaleString()} - ₹${maxPrice.toLocaleString()}`;
                  const hasStock = group.totalStock > 0;
                  
                  return (
                    <TableRow 
                      key={master.id}
                      className="border-b border-white/[0.06] transition-colors group hover:bg-white/[0.03] cursor-pointer"
                    >
                      <TableCell className="px-4 py-3.5">
                        <Checkbox className="border-white/20 data-[state=checked]:bg-[#00A7B5] data-[state=checked]:border-[#00A7B5] rounded-md" />
                      </TableCell>
                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#08080A] border border-white/[0.06] flex items-center justify-center shrink-0">
                            <Laptop className="w-5 h-5 text-white/40 group-hover:text-[#00A7B5] transition-colors" />
                          </div>
                          <div className="flex flex-col min-w-0 max-w-[250px] sm:max-w-[300px] md:max-w-[400px]">
                            <span className="font-normal text-white text-[14px] truncate" title={`${brandName} ${modelName}`}>
                              {brandName} {modelName}
                            </span>
                            <span className="text-white/40 text-[12px] truncate" title={`${group.items.length} Variant(s)`}>
                              {group.items.length} Variant(s) Included
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5">
                        <span className="text-white/90 text-[13px] font-normal block">Total Stock: <strong className="text-white font-medium">{group.totalStock}</strong></span>
                      </TableCell>
                      <TableCell className="py-3.5 text-right">
                        <span className="text-white text-[13.5px] font-medium">{priceStr}</span>
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        {hasStock ? (
                          <div className="inline-flex items-center gap-1.5 text-[#00A7B5] bg-[#00A7B5]/10 border border-[#00A7B5]/20 px-2.5 py-1 rounded-full">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#00A7B5]"></span>
                            <span className="text-[11.5px] font-medium tracking-wide">In Stock</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 text-rose-400 bg-rose-400/10 border border-rose-400/20 px-2.5 py-1 rounded-full">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-400"></span>
                            <span className="text-[11.5px] font-medium tracking-wide">Out of Stock</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="py-3.5 text-right px-6" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10 rounded-full">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            }
                          />
                          <DropdownMenuContent align="end" className="bg-[#141416] border-white/10 text-white rounded-xl shadow-2xl">
                            <DropdownMenuLabel className="text-white/50 text-xs">Actions</DropdownMenuLabel>
                            <DropdownMenuItem 
                              className="focus:bg-white/10 focus:text-white cursor-pointer"
                              onClick={(e) => { e.stopPropagation(); router.push(`/admin/product/${master.id}/view`); }}
                            >
                              <Box className="w-4 h-4 mr-2 text-white/50" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="focus:bg-white/10 focus:text-white cursor-pointer"
                              onClick={(e) => { e.stopPropagation(); router.push(`/admin/product/add?kc_id=${master.id}`); }}
                            >
                              <Plus className="w-4 h-4 mr-2 text-[#00A7B5]" />
                              Add Stock
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
          
          {/* Table Footer / Pagination */}
          {totalCount > pageSize && (() => {
            const totalPages = Math.ceil(totalCount / pageSize);
            const getPageNumbers = () => {
              const pages = [];
              if (totalPages <= 5) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                if (page <= 3) {
                  pages.push(1, 2, 3, 4, '...', totalPages);
                } else if (page >= totalPages - 2) {
                  pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                } else {
                  pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
                }
              }
              return pages;
            };
            const pageNumbers = getPageNumbers();

            return (
              <div className="flex items-center justify-between p-4 border-t border-white/10 bg-[#0A0A0C]">
                <div className="text-[13px] text-white/50">
                  Showing <strong className="text-white">{(page - 1) * pageSize + 1}</strong> to <strong className="text-white">{Math.min(page * pageSize, totalCount)}</strong> of <strong className="text-white">{totalCount}</strong> entries
                </div>
                <Pagination className="w-auto mx-0">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setPage(p => Math.max(1, p - 1))} 
                        className={page === 1 ? "pointer-events-none opacity-40 text-white" : "cursor-pointer text-white hover:bg-white/10"} 
                      />
                    </PaginationItem>
                    
                    {pageNumbers.map((num, i) => (
                      <PaginationItem key={i}>
                        {num === '...' ? (
                          <PaginationEllipsis className="text-white/40" />
                        ) : (
                          <PaginationLink
                            isActive={page === num}
                            onClick={() => setPage(num as number)}
                            className={`cursor-pointer ${page === num ? 'bg-white text-black font-medium' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                          >
                            {num}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setPage(p => (p * pageSize < totalCount ? p + 1 : p))} 
                        className={page * pageSize >= totalCount ? "pointer-events-none opacity-40 text-white" : "cursor-pointer text-white hover:bg-white/10"} 
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
}
