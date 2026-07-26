"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Database, Pencil, Trash2, Loader2, Server, Search, ChevronDown, Filter, FileDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { GlobalSearch } from "@/components/search/GlobalSearch";
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
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { deleteV2KnowledgeMaster, deleteV2KnowledgeMasters, getV2KnowledgeCatalog, getV2KnowledgeCatalogAllIds } from "@/app/actions/knowledge";
import { MoreHorizontal, Eye, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function KnowledgeCatalogPage() {
  const [masterProducts, setMasterProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const pageSize = 20;

  useEffect(() => {
    async function fetchCatalog() {
      setIsLoading(true);
      const result = await getV2KnowledgeCatalog(page, pageSize, searchQuery, statusFilter);
      if (result.success && result.data) {
        setMasterProducts(result.data);
        setTotalCount(result.count || 0);
      }
      setIsLoading(false);
    }
    const timeoutId = setTimeout(() => {
      fetchCatalog();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [page, searchQuery, statusFilter]);

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedProducts.length} items? This action cannot be undone.`)) return;
    
    setIsLoading(true);
    await deleteV2KnowledgeMasters(selectedProducts);
    setSelectedProducts([]);
    
    const result = await getV2KnowledgeCatalog(page, pageSize, searchQuery, statusFilter);
    if (result.success && result.data) {
      setMasterProducts(result.data);
      setTotalCount(result.count || 0);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this master product? This will also delete all associated variants and specifications.")) return;
    
    // Optimistic update
    setMasterProducts(prev => prev.filter(p => p.id !== id));
    
    const result = await deleteV2KnowledgeMaster(id);
    if (!result.success) {
      alert(result.error);
      // Revert if failed by fetching again
      const fetchResult = await getV2KnowledgeCatalog();
      if (fetchResult.success && fetchResult.data) {
        setMasterProducts(fetchResult.data);
      }
    }
  };

  const toggleSelectAll = async () => {
    if (selectedProducts.length === totalCount && totalCount > 0) {
      setSelectedProducts([]);
    } else {
      setIsLoading(true);
      const result = await getV2KnowledgeCatalogAllIds(searchQuery, statusFilter);
      if (result.success && result.data) {
        setSelectedProducts(result.data);
      }
      setIsLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((pId) => pId !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto text-white">
      
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] border border-white/10 mb-2 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00A7B5]"></span>
            <span className="text-[12px] font-normal text-white/70 tracking-wide">Specification Core</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">Master Knowledge Catalog</h1>
          <p className="text-sm text-white/50 mt-1">Manage global hardware benchmark specifications, Icecat imports, and model definitions.</p>
        </div>
      </div>

      <Card className="border-white/10 shadow-2xl rounded-2xl overflow-hidden p-0 gap-0 bg-[#111113]/90 backdrop-blur-xl text-white">
        
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0A0A0C] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 w-full sm:max-w-xs bg-[#121215] rounded-full border border-white/10 px-3.5 focus-within:border-[#00A7B5] transition-colors">
            <Search className="w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Search catalog..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="flex-1 bg-transparent border-none outline-none py-2 text-[13.5px] text-white placeholder:text-white/40"
            />
          </div>
          <div className="flex items-center gap-3">
            {selectedProducts.length > 0 && (
              <span className="text-[13px] text-white/60 font-normal">
                {selectedProducts.length} selected
              </span>
            )}
            
            <Link href="/admin/acquisition">
              <Button variant="outline" className="h-9 px-3.5 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white text-[13px] shadow-none flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-[#00A7B5]" />
                Icecat Acquisition
              </Button>
            </Link>
            
            <Link href="/admin/knowledge-catalog/import">
              <Button className="h-9 px-4 rounded-full bg-white hover:bg-white/90 text-black text-[13px] font-medium shadow-sm flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                Manual Entry
              </Button>
            </Link>

            <div className="w-px h-6 bg-white/10 mx-1"></div>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" disabled={selectedProducts.length === 0} className="h-9 px-3.5 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white text-[13px] shadow-none flex items-center gap-1.5 disabled:opacity-40">
                    Bulk Actions <ChevronDown className="w-3.5 h-3.5 text-white/40" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="bg-[#141416] border-white/10 text-white rounded-xl shadow-2xl">
                <DropdownMenuItem onClick={handleBulkDelete} className="cursor-pointer text-rose-400 focus:bg-rose-500/10 focus:text-rose-300 py-2">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" className="h-9 px-3.5 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white text-[13px] shadow-none flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-white/40" />
                    Filters
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="bg-[#141416] border-white/10 text-white rounded-xl shadow-2xl w-[200px]">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal text-white/50 text-xs">Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuCheckboxItem 
                    checked={statusFilter === ''} 
                    onCheckedChange={() => { setStatusFilter(''); setPage(1); }}
                    className="cursor-pointer text-white focus:bg-white/10"
                  >
                    All Statuses
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={statusFilter === 'Draft'} 
                    onCheckedChange={() => { setStatusFilter('Draft'); setPage(1); }}
                    className="cursor-pointer text-white focus:bg-white/10"
                  >
                    Draft
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={statusFilter === 'Published'} 
                    onCheckedChange={() => { setStatusFilter('Published'); setPage(1); }}
                    className="cursor-pointer text-white focus:bg-white/10"
                  >
                    Published
                  </DropdownMenuCheckboxItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" className="h-9 px-3.5 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white text-[13px] shadow-none flex items-center gap-1.5">
              <FileDown className="w-3.5 h-3.5 text-white/40" />
              Export
            </Button>
          </div>
        </div>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-white/40 min-h-[550px] flex items-center justify-center font-normal">Loading catalog data...</div>
          ) : masterProducts.length === 0 ? (
            <div className="p-12 text-center text-white/40 flex flex-col items-center justify-center min-h-[550px]">
              <Database className="w-12 h-12 text-white/20 mb-4" />
              <p className="mb-4 text-white/60 font-normal">The Master Catalog is currently empty.</p>
              <Link href="/admin/acquisition">
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/10 rounded-full">Search Icecat for products</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto min-h-[550px]">
              <Table>
                <TableHeader className="bg-[#0A0A0C] border-b border-white/10">
                  <TableRow className="border-none hover:bg-transparent">
                    <TableHead className="w-[50px] px-6 text-white/50">
                      <Checkbox 
                        checked={selectedProducts.length === totalCount && totalCount > 0}
                        onCheckedChange={toggleSelectAll}
                        className="border-white/20 data-[state=checked]:bg-[#00A7B5] data-[state=checked]:border-[#00A7B5] rounded-md"
                      />
                    </TableHead>
                    <TableHead className="text-[11.5px] font-normal uppercase tracking-wider text-white/50">Brand</TableHead>
                    <TableHead className="text-[11.5px] font-normal uppercase tracking-wider text-white/50">Master Model</TableHead>
                    <TableHead className="text-[11.5px] font-normal uppercase tracking-wider text-white/50">Added On</TableHead>
                    <TableHead className="w-[100px] text-right text-[11.5px] font-normal uppercase tracking-wider text-white/50 px-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {masterProducts.map((product) => (
                    <TableRow key={product.id} className="border-b border-white/[0.06] hover:bg-white/[0.03] transition-colors cursor-pointer group">
                      <TableCell className="px-6 py-4">
                        <Checkbox 
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={() => toggleSelect(product.id)}
                          className="border-white/20 data-[state=checked]:bg-[#00A7B5] data-[state=checked]:border-[#00A7B5] rounded-md"
                        />
                      </TableCell>
                      <TableCell className="px-6 py-4 font-normal text-white">{product.kc_brands?.name || 'Unknown'}</TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="font-normal text-white truncate max-w-[300px] sm:max-w-[400px]" title={product.model}>
                          {product.model}
                        </div>
                        <div className="text-[12px] text-white/40 mt-0.5 truncate max-w-[300px]">{product.series || 'Standard Series'}</div>
                      </TableCell>
                      <TableCell className="px-6 py-4 font-mono text-[12.5px] text-white/60">
                        {new Date(product.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10 rounded-full">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            }
                          />
                          <DropdownMenuContent align="end" className="bg-[#141416] border-white/10 text-white rounded-xl shadow-2xl">
                            <Link href={`/admin/knowledge-catalog/${product.id}`}>
                              <DropdownMenuItem className="cursor-pointer text-white focus:bg-white/10 py-2">
                                <Pencil className="w-4 h-4 mr-2 text-white/50" />
                                Edit Product
                              </DropdownMenuItem>
                            </Link>
                            <Link href={`/admin/knowledge-catalog/${product.id}/view`}>
                              <DropdownMenuItem className="cursor-pointer text-white focus:bg-white/10 py-2">
                                <Eye className="w-4 h-4 mr-2 text-[#00A7B5]" />
                                View Details
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(product.id)}
                              className="cursor-pointer text-rose-400 focus:bg-rose-500/10 focus:text-rose-300 py-2"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Pagination */}
          {totalCount > 0 && (() => {
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
                <div className="text-[13px] text-white/50 font-normal">
                  Showing <strong className="text-white font-medium">{(page - 1) * pageSize + 1}</strong> to <strong className="text-white font-medium">{Math.min(page * pageSize, totalCount)}</strong> of <strong className="text-white font-medium">{totalCount}</strong> entries
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
