"use client";

import { useState, useEffect } from "react";
import { Search, Filter, MoreHorizontal, ChevronDown, Plus, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "../components/Pagination";

import { fetchAdminCustomers } from "./actions";

export default function CustomerPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [customers, setCustomers] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  useEffect(() => {
    async function loadCustomers() {
      setLoading(true);
      try {
        const data = await fetchAdminCustomers(page, pageSize);
        setCustomers(data.customers);
        setTotalItems(data.totalCount);
      } catch (error) {
        console.error("Failed to load customers:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, [page, pageSize]);

  const toggleSelectAll = () => {
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(customers.map((c) => c.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers(selectedCustomers.filter((c) => c !== id));
    } else {
      setSelectedCustomers([...selectedCustomers, id]);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-[1600px] mx-auto">
      
      {/* Main Table Card */}
      <Card className="border-hairline shadow-none rounded-[10px] overflow-hidden p-0 gap-0">
        
        {/* Table Toolbar */}
        <div className="p-4 border-b border-hairline bg-success-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:max-w-xs bg-success-foreground rounded-[6px] border border-hairline px-3 focus-within:border-link transition-colors">
            <Search className="w-4 h-4 text-[#41454d]" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="flex-1 bg-transparent border-none outline-none py-2 text-[14px] text-[#181d26] placeholder:text-[#41454d]"
            />
          </div>
          <div className="flex items-center gap-3">
            {selectedCustomers.length > 0 && (
              <span className="text-[13px] text-[#41454d] font-medium">
                {selectedCustomers.length} selected
              </span>
            )}
            <Button variant="outline" className="h-9 px-3 rounded-[6px] border-hairline text-[#181d26] text-[13px] hover:bg-soft shadow-none flex items-center gap-1.5">
              Bulk Actions <ChevronDown className="w-3.5 h-3.5 text-[#9297a0]" />
            </Button>
            <Button variant="outline" className="h-9 px-3 rounded-[6px] border-hairline text-[#181d26] text-[13px] hover:bg-soft shadow-none flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              Filters
            </Button>
            <Button className="h-9 px-4 rounded-[6px] bg-[#181d26] hover:bg-[#0d1218] text-white text-[13px] font-medium shadow-none flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Add Customer
            </Button>
          </div>
        </div>

        {/* Table Content */}
        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[550px]">
            <Table>
              <TableHeader className="bg-soft hover:bg-soft border-b border-hairline">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="w-[50px] px-6 text-[#41454d]">
                    <Checkbox 
                      checked={selectedCustomers.length === customers.length && customers.length > 0}
                      onCheckedChange={toggleSelectAll}
                      className="border-[#9297a0] data-[state=checked]:bg-[#181d26] data-[state=checked]:border-[#181d26] rounded-[4px]"
                    />
                  </TableHead>
                  <TableHead className="text-[12px] font-medium uppercase tracking-wider text-[#41454d]">Customer</TableHead>
                  <TableHead className="text-[12px] font-medium uppercase tracking-wider text-[#41454d]">Contact</TableHead>
                  <TableHead className="text-[12px] font-medium uppercase tracking-wider text-[#41454d]">Orders</TableHead>
                  <TableHead className="text-[12px] font-medium uppercase tracking-wider text-[#41454d] text-right">Total Spent</TableHead>
                  <TableHead className="text-[12px] font-medium uppercase tracking-wider text-[#41454d]">Status</TableHead>
                  <TableHead className="w-[80px] text-right text-[12px] font-medium uppercase tracking-wider text-[#41454d] px-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center text-muted-foreground animate-pulse">
                      Loading customers...
                    </TableCell>
                  </TableRow>
                ) : customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center text-muted-foreground">
                      No customers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.slice((page - 1) * pageSize, page * pageSize).map((customer) => (
                  <TableRow key={customer.id} className="border-b border-hairline last:border-0 hover:bg-surface-strong transition-colors group cursor-pointer">
                    <TableCell className="px-6 py-4">
                      <Checkbox 
                        checked={selectedCustomers.includes(customer.id)}
                        onCheckedChange={() => toggleSelect(customer.id)}
                        className="border-[#9297a0] data-[state=checked]:bg-[#181d26] data-[state=checked]:border-[#181d26] rounded-[4px]"
                      />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border border-hairline">
                          {customer.avatar ? (
                            <AvatarImage src={customer.avatar} alt={customer.name} className="object-cover" />
                          ) : (
                            <AvatarFallback className="bg-soft text-[#41454d]">
                              <UserCircle2 className="w-5 h-5" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-[14px] font-medium text-[#181d26] leading-tight">{customer.name}</span>
                          <span className="text-[12px] text-[#9297a0] mt-0.5">Joined {new Date(customer.join_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="text-[13px] text-[#181d26] leading-tight">{customer.email}</span>
                        <span className="text-[12px] text-[#9297a0] mt-0.5">{customer.phone || 'No phone'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-[14px] font-medium text-[#181d26]">{customer.total_orders}</span>
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <span className="text-[14px] font-medium text-[#181d26]">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(customer.total_spent)}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      {customer.status?.toLowerCase() === "active" ? (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-[6px] w-fit bg-[#e6f4ea] text-[#137333]">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#137333]"></div>
                          <span className="text-[12px] font-medium tracking-wide">Active</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-[6px] w-fit bg-[#f1f3f4] text-[#41454d]">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#9297a0]"></div>
                          <span className="text-[12px] font-medium tracking-wide">Inactive</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-[6px] text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 hover:bg-surface-strong hover:text-[#181d26] h-8 w-8 p-0 text-[#41454d] border-none bg-transparent outline-none">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px] rounded-[10px] border-hairline shadow-lg bg-success-foreground p-1">
                          <DropdownMenuLabel className="text-[11px] font-medium text-[#9297a0] uppercase tracking-wider px-2 py-1.5">Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="text-[13px] text-[#181d26] rounded-[6px] focus:bg-soft cursor-pointer">
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-[13px] text-[#181d26] rounded-[6px] focus:bg-soft cursor-pointer">
                            Email Customer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-hairline my-1" />
                          <DropdownMenuItem className="text-[13px] text-[#c5221f] rounded-[6px] focus:bg-[#fce8e6] cursor-pointer">
                            Delete Customer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )))}
              </TableBody>
            </Table>
          </div>
          <div className="border-t border-hairline">
            <Pagination 
              currentPage={page} 
              totalPages={Math.ceil(totalItems / pageSize) || 1} 
              onPageChange={setPage}
              totalItems={totalItems}
              itemsPerPage={pageSize}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
