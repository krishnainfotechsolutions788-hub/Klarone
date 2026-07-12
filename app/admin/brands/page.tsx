"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, MoreHorizontal, ChevronDown, Plus, Bookmark, Box, Database, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { mockProducts, mockVariants, getProductStats } from "@/lib/mock-data";
import StatCard from "../components/StatCard";
import { Pagination } from "../components/Pagination";

export default function BrandsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Aggregate Brand Data
  const brandsMap = new Map<string, { products: number, variants: number, inventory: number }>();

  mockProducts.forEach(product => {
    const brandName = product.brand;
    const stats = getProductStats(product.id);
    
    if (!brandsMap.has(brandName)) {
      brandsMap.set(brandName, { products: 0, variants: 0, inventory: 0 });
    }
    
    const brandStats = brandsMap.get(brandName)!;
    brandStats.products += 1;
    brandStats.variants += stats.totalVariants;
    brandStats.inventory += stats.totalUnits;
  });

  const uniqueBrands = Array.from(brandsMap.keys()).sort();
  const totalBrands = uniqueBrands.length;
  
  const totalProducts = mockProducts.length;
  const totalVariants = mockVariants.length;
  const totalInventory = Array.from(brandsMap.values()).reduce((acc, b) => acc + b.inventory, 0);

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-10">
      
      {/* Aggregate Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Brands"
          icon={Bookmark}
          primaryValue={totalBrands}
          primaryLabel="Brands"
        />
        <StatCard
          title="Total Products"
          icon={Tag}
          primaryValue={totalProducts}
          primaryLabel="Models"
        />
        <StatCard
          title="Total Variants"
          icon={Box}
          primaryValue={totalVariants}
          primaryLabel="Configurations"
        />
        <StatCard
          title="Total Inventory"
          icon={Database}
          primaryValue={totalInventory}
          primaryLabel="Units in Stock"
        />
      </div>

      {/* Main Table Card */}
      <Card className="border-[#dddddd] shadow-none rounded-[10px] overflow-hidden flex flex-col gap-0 p-0">
        
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-[#dddddd] bg-white gap-4">
          <div className="relative w-full sm:w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9297a0]" />
            <input 
              type="text" 
              placeholder="Search brands..." 
              className="w-full h-9 pl-9 pr-4 bg-[#f8fafc] border border-[#dddddd] rounded-[6px] text-[13px] text-[#181d26] outline-none focus:border-[#1b61c9] transition-colors placeholder:text-[#9297a0]"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" className="h-9 px-3 rounded-[6px] border-[#dddddd] text-[#181d26] text-[13px] hover:bg-[#f8fafc] shadow-none flex items-center gap-1.5">
              Bulk Actions <ChevronDown className="w-3.5 h-3.5 text-[#9297a0]" />
            </Button>
            <Button variant="outline" className="h-9 px-3 rounded-[6px] border-[#dddddd] text-[#181d26] text-[13px] hover:bg-[#f8fafc] shadow-none flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              Filters
            </Button>
            <Button className="h-9 px-4 rounded-[6px] bg-[#181d26] hover:bg-[#0d1218] text-white text-[13px] font-medium shadow-none flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Add Brand
            </Button>
          </div>
        </div>

        {/* Table Content */}
        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[550px]">
            <Table>
              <TableHeader className="bg-[#f8fafc] [&_tr]:border-b-[#dddddd]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[40px] px-4 py-3"><Checkbox className="border-[#dddddd] data-[state=checked]:bg-[#181d26] data-[state=checked]:border-[#181d26]" /></TableHead>
                  <TableHead className="font-medium text-[#41454d] text-[12px] uppercase tracking-wider py-3">Brand Name</TableHead>
                  <TableHead className="font-medium text-[#41454d] text-[12px] uppercase tracking-wider py-3 text-right">Products</TableHead>
                  <TableHead className="font-medium text-[#41454d] text-[12px] uppercase tracking-wider py-3 text-right">Variants</TableHead>
                  <TableHead className="font-medium text-[#41454d] text-[12px] uppercase tracking-wider py-3 text-right">Total Inventory</TableHead>
                  <TableHead className="w-[50px] py-3"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uniqueBrands.slice((page - 1) * pageSize, page * pageSize).map((brandName) => {
                  const stats = brandsMap.get(brandName)!;
                  
                  return (
                    <TableRow key={brandName} className="border-b-[#dddddd] hover:bg-[#f8fafc] transition-colors group">
                      <TableCell className="px-4 py-3">
                        <Checkbox className="border-[#dddddd] data-[state=checked]:bg-[#181d26] data-[state=checked]:border-[#181d26]" />
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-[6px] bg-[#f0f2f5] border border-[#dddddd] flex items-center justify-center shrink-0">
                            <Bookmark className="w-5 h-5 text-[#9297a0]" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[14px] font-medium text-[#181d26] group-hover:text-[#1b61c9] transition-colors">{brandName}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-[13px] text-[#41454d] text-right font-medium">
                        {stats.products}
                      </TableCell>
                      <TableCell className="py-3 text-[13px] text-[#41454d] text-right font-medium">
                        {stats.variants}
                      </TableCell>
                      <TableCell className="py-3 text-[13px] text-[#41454d] text-right font-medium">
                        {stats.inventory}
                      </TableCell>
                      <TableCell className="py-3 text-right px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-[6px] h-8 w-8 p-0 text-[#9297a0] hover:text-[#181d26] hover:bg-[#f0f2f5] outline-none transition-colors">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem className="text-[13px]">Edit Brand</DropdownMenuItem>
                            <DropdownMenuItem className="text-[13px] text-[#c5221f] focus:text-[#c5221f]">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <div className="border-t border-[#dddddd]">
          <Pagination 
            currentPage={page} 
            totalPages={Math.ceil(uniqueBrands.length / pageSize)} 
            onPageChange={setPage}
            totalItems={uniqueBrands.length}
            itemsPerPage={pageSize}
          />
        </div>
      </Card>
    </div>
  );
}
