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
    <div className="flex flex-col gap-4 max-w-[1600px] mx-auto mt-2">
      <Card className="border-[#dddddd] shadow-none rounded-[10px] overflow-hidden p-0 gap-0">
        
        {/* Table Toolbar */}
        <div className="p-4 border-b border-[#dddddd] bg-[#ffffff] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:max-w-xs bg-[#ffffff] rounded-[6px] border border-[#dddddd] px-3 focus-within:border-[#1b61c9] transition-colors">
            <Search className="w-4 h-4 text-[#41454d]" />
            <input 
              type="text" 
              placeholder="Search catalog..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="flex-1 bg-transparent border-none outline-none py-2 text-[14px] text-[#181d26] placeholder:text-[#41454d]"
            />
          </div>
          <div className="flex items-center gap-3">
            {selectedProducts.length > 0 && (
              <span className="text-[13px] text-[#41454d] font-medium">
                {selectedProducts.length} selected
              </span>
            )}
            
            <Link href="/admin/acquisition">
              <Button variant="outline" className="h-9 px-3 rounded-[6px] border-[#dddddd] text-[#181d26] text-[13px] hover:bg-[#f8fafc] shadow-none flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                Icecat Acquisition
              </Button>
            </Link>
            
            <Link href="/admin/knowledge-catalog/import">
              <Button className="h-9 px-3 rounded-[6px] bg-[#181d26] hover:bg-[#0d1218] text-white text-[13px] font-medium shadow-none flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                Manual Entry
              </Button>
            </Link>

            <div className="w-px h-6 bg-[#dddddd] mx-1"></div>

            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" disabled={selectedProducts.length === 0} className="h-9 px-3 rounded-[6px] border-[#dddddd] text-[#181d26] text-[13px] hover:bg-[#f8fafc] shadow-none flex items-center gap-1.5 disabled:opacity-50" />}>
                Bulk Actions <ChevronDown className="w-3.5 h-3.5 text-[#9297a0]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px] rounded-[8px] border-[#dddddd] shadow-sm">
                <DropdownMenuItem onClick={handleBulkDelete} className="cursor-pointer text-[#d92d20] hover:bg-[#fdf2f2] focus:bg-[#fdf2f2] focus:text-[#d92d20] py-2">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" className="h-9 px-3 rounded-[6px] border-[#dddddd] text-[#181d26] text-[13px] hover:bg-[#f8fafc] shadow-none flex items-center gap-1.5" />}>
                <Filter className="w-3.5 h-3.5" />
                Filters
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] rounded-[8px] border-[#dddddd] shadow-sm">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-medium text-[#181d26]">Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#dddddd]" />
                  <DropdownMenuCheckboxItem 
                    checked={statusFilter === ''} 
                    onCheckedChange={() => { setStatusFilter(''); setPage(1); }}
                    className="cursor-pointer text-[#41454d]"
                  >
                    All Statuses
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={statusFilter === 'Draft'} 
                    onCheckedChange={() => { setStatusFilter('Draft'); setPage(1); }}
                    className="cursor-pointer text-[#41454d]"
                  >
                    Draft
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={statusFilter === 'Published'} 
                    onCheckedChange={() => { setStatusFilter('Published'); setPage(1); }}
                    className="cursor-pointer text-[#41454d]"
                  >
                    Published
                  </DropdownMenuCheckboxItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" className="h-9 px-3 rounded-[6px] border-[#dddddd] text-[#181d26] text-[13px] hover:bg-[#f8fafc] shadow-none flex items-center gap-1.5">
              <FileDown className="w-3.5 h-3.5" />
              Export
            </Button>
          </div>
        </div>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500 min-h-[550px] flex items-center justify-center">Loading catalog...</div>
          ) : masterProducts.length === 0 ? (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center min-h-[550px]">
              <Database className="w-12 h-12 text-gray-300 mb-4" />
              <p className="mb-4 text-[#41454d]">The V2 catalog is currently empty.</p>
              <Link href="/admin/acquisition">
                <Button variant="outline" className="border-[#dddddd] text-[#181d26]">Search Icecat for products</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto min-h-[550px]">
              <Table>
                <TableHeader className="bg-[#f8fafc] hover:bg-[#f8fafc] border-b border-[#dddddd]">
                  <TableRow className="border-none hover:bg-transparent">
                    <TableHead className="w-[50px] px-6 text-[#41454d]">
                      <Checkbox 
                        checked={selectedProducts.length === totalCount && totalCount > 0}
                        onCheckedChange={toggleSelectAll}
                        className="border-[#9297a0] data-[state=checked]:bg-[#181d26] data-[state=checked]:border-[#181d26] rounded-[4px]"
                      />
                    </TableHead>
                    <TableHead className="text-[12px] font-medium uppercase tracking-wider text-[#41454d]">Brand</TableHead>
                    <TableHead className="text-[12px] font-medium uppercase tracking-wider text-[#41454d]">Master Model</TableHead>
                    <TableHead className="text-[12px] font-medium uppercase tracking-wider text-[#41454d]">Added On</TableHead>
                    <TableHead className="w-[100px] text-right text-[12px] font-medium uppercase tracking-wider text-[#41454d] px-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {masterProducts.map((product) => (
                    <TableRow key={product.id} className="hover:bg-[#f8fafc]/50 border-b border-[#dddddd]/50 transition-colors">
                      <TableCell className="px-6 py-4">
                        <Checkbox 
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={() => toggleSelect(product.id)}
                          className="border-[#dddddd] data-[state=checked]:bg-[#181d26] data-[state=checked]:border-[#181d26] rounded-[4px]"
                        />
                      </TableCell>
                      <TableCell className="px-6 py-4 font-medium text-[#181d26]">{product.kc_brands?.name || 'Unknown'}</TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="font-medium text-[#181d26] truncate max-w-[300px] sm:max-w-[400px]" title={product.model}>
                          {product.model}
                        </div>
                        <div className="text-[13px] text-[#5f6368] mt-0.5 truncate max-w-[300px]">{product.series}</div>
                      </TableCell>
                      <TableCell className="px-6 py-4 font-mono text-[13px] text-[#5f6368]">
                        {new Date(product.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0 text-[#5f6368] hover:text-[#181d26]" />}>
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px] rounded-[8px] border-[#dddddd] shadow-sm">
                            <Link href={`/admin/knowledge-catalog/${product.id}`}>
                              <DropdownMenuItem className="cursor-pointer text-[#181d26] hover:bg-[#f8fafc] focus:bg-[#f8fafc] py-2">
                                <Pencil className="w-4 h-4 mr-2 text-[#5f6368]" />
                                Edit Product
                              </DropdownMenuItem>
                            </Link>
                            <Link href={`/admin/knowledge-catalog/${product.id}/view`}>
                              <DropdownMenuItem className="cursor-pointer text-[#181d26] hover:bg-[#f8fafc] focus:bg-[#f8fafc] py-2">
                                <Eye className="w-4 h-4 mr-2 text-[#5f6368]" />
                                View Details
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator className="bg-[#dddddd]" />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(product.id)}
                              className="cursor-pointer text-[#d92d20] hover:bg-[#fdf2f2] focus:bg-[#fdf2f2] focus:text-[#d92d20] py-2"
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
              <div className="flex items-center justify-between p-4 border-t border-[#dddddd] bg-white">
                <div className="text-[13px] text-[#5f6368]">
                  Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount} entries
                </div>
                <Pagination className="w-auto mx-0">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setPage(p => Math.max(1, p - 1))} 
                        className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                      />
                    </PaginationItem>
                    
                    {pageNumbers.map((num, i) => (
                      <PaginationItem key={i}>
                        {num === '...' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            isActive={page === num}
                            onClick={() => setPage(num as number)}
                            className="cursor-pointer"
                          >
                            {num}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setPage(p => (p * pageSize < totalCount ? p + 1 : p))} 
                        className={page * pageSize >= totalCount ? "pointer-events-none opacity-50" : "cursor-pointer"} 
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
