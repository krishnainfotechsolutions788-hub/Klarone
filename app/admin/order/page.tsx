"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, MoreHorizontal, ChevronDown, CheckCircle2, Clock, XCircle, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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

import { useEffect } from "react";
import { fetchAdminOrders } from "./actions";

// --- Types ---
type OrderData = {
  id: string;
  customerName: string;
  email: string;
  date: string;
  status: string;
  total: string;
  items: number;
  paymentMethod: string;
};


export default function AdminOrderPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        const data = await fetchAdminOrders(page, pageSize);
        setOrders(data.orders);
        setTotalItems(data.totalCount);
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [page, pageSize]);

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length && orders.length > 0) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((o) => o.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter((o) => o !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto text-white">
      
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] border border-white/10 mb-2 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00A7B5]"></span>
            <span className="text-[12px] font-normal text-white/70 tracking-wide">Fulfillment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">Orders & Transactions</h1>
          <p className="text-sm text-white/50 mt-1">Manage customer device reservations, processing state, and invoices.</p>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="border-white/10 shadow-2xl rounded-2xl overflow-hidden p-0 gap-0 bg-[#111113]/90 backdrop-blur-xl text-white">
        
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0A0A0C] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 w-full sm:max-w-xs bg-[#121215] rounded-full border border-white/10 px-3.5 focus-within:border-[#00A7B5] transition-colors">
            <Search className="w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="flex-1 bg-transparent border-none outline-none py-2 text-[13.5px] text-white placeholder:text-white/40"
            />
          </div>
          <div className="flex items-center gap-3">
            {selectedOrders.length > 0 && (
              <span className="text-[13px] text-white/60 font-normal">
                {selectedOrders.length} selected
              </span>
            )}
            <Button variant="outline" className="h-9 px-3.5 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white text-[13px] shadow-none flex items-center gap-1.5">
              Bulk Actions <ChevronDown className="w-3.5 h-3.5 text-white/40" />
            </Button>
            <Button variant="outline" className="h-9 px-3.5 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white text-[13px] shadow-none flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-white/40" />
              Filters
            </Button>
            <Button className="h-9 px-4 rounded-full bg-white hover:bg-white/90 text-black text-[13px] font-medium shadow-sm flex items-center gap-1.5">
              <FileDown className="w-3.5 h-3.5" />
              Export
            </Button>
          </div>
        </div>

        {/* Table Content */}
        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[550px]">
            <Table>
              <TableHeader className="bg-[#0A0A0C] border-b border-white/10">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="w-[50px] px-6 text-white/50">
                    <Checkbox 
                      checked={selectedOrders.length === orders.length && orders.length > 0}
                      onCheckedChange={toggleSelectAll}
                      className="border-white/20 data-[state=checked]:bg-[#00A7B5] data-[state=checked]:border-[#00A7B5] rounded-md"
                    />
                  </TableHead>
                  <TableHead className="text-[11.5px] font-normal uppercase tracking-wider text-white/50">Order ID</TableHead>
                  <TableHead className="text-[11.5px] font-normal uppercase tracking-wider text-white/50">Customer</TableHead>
                  <TableHead className="text-[11.5px] font-normal uppercase tracking-wider text-white/50">Date</TableHead>
                  <TableHead className="text-[11.5px] font-normal uppercase tracking-wider text-white/50">Status</TableHead>
                  <TableHead className="text-[11.5px] font-normal uppercase tracking-wider text-white/50">Payment</TableHead>
                  <TableHead className="text-[11.5px] font-normal uppercase tracking-wider text-white/50 text-right">Total</TableHead>
                  <TableHead className="w-[80px] text-right text-[11.5px] font-normal uppercase tracking-wider text-white/50 px-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-64 text-center text-white/40 font-normal">
                      Loading orders...
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-64 text-center text-white/40 font-normal">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                  <TableRow key={order.id} className="border-b border-white/[0.06] hover:bg-white/[0.03] cursor-pointer transition-colors group">
                    <TableCell className="px-6 py-4">
                      <Checkbox 
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={() => toggleSelect(order.id)}
                        className="border-white/20 data-[state=checked]:bg-[#00A7B5] data-[state=checked]:border-[#00A7B5] rounded-md"
                      />
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-[14px] font-normal text-white leading-tight">{order.id}</span>
                      <div className="text-[12px] text-white/40 mt-0.5">{order.items} {order.items === 1 ? 'item' : 'items'}</div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-normal text-white leading-tight">{order.customerName}</span>
                        <span className="text-[12px] text-white/40 mt-0.5">{order.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-[13px] text-white/70 font-normal">{order.date}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      {order.status === "delivered" && (
                        <div className="flex items-center gap-1.5 text-[#00A7B5] bg-[#00A7B5]/10 border border-[#00A7B5]/20 px-2.5 py-1 rounded-full w-fit">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-[11.5px] font-medium tracking-wide">Delivered</span>
                        </div>
                      )}
                      {order.status === "processing" && (
                        <div className="flex items-center gap-1.5 text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-full w-fit">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-[11.5px] font-medium tracking-wide">Processing</span>
                        </div>
                      )}
                      {order.status === "shipped" && (
                        <div className="flex items-center gap-1.5 text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2.5 py-1 rounded-full w-fit">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-[11.5px] font-medium tracking-wide">Shipped</span>
                        </div>
                      )}
                      {order.status === "cancelled" && (
                        <div className="flex items-center gap-1.5 text-rose-400 bg-rose-400/10 border border-rose-400/20 px-2.5 py-1 rounded-full w-fit">
                          <XCircle className="w-3.5 h-3.5" />
                          <span className="text-[11.5px] font-medium tracking-wide">Cancelled</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-[13px] text-white/60 font-normal">{order.paymentMethod}</span>
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <span className="text-[14px] font-medium text-white">{order.total}</span>
                    </TableCell>
                    <TableCell className="py-4 text-right px-6" onClick={(e) => e.stopPropagation()}>
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
                          <DropdownMenuItem onClick={() => router.push(`/admin/order/${order.id}`)} className="focus:bg-white/10 focus:text-white cursor-pointer">
                            View Order Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer">
                            Update Status
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem className="text-rose-400 focus:bg-rose-500/10 focus:text-rose-300 cursor-pointer">
                            Cancel Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
              </TableBody>
            </Table>
          </div>
          
          {/* Table Footer / Pagination */}
          <div className="p-4 border-t border-white/10 bg-[#0A0A0C] flex items-center justify-between">
            <span className="text-[13px] text-white/50 font-normal">
              Showing <strong className="text-white font-medium">{orders.length > 0 ? (page - 1) * pageSize + 1 : 0}</strong> to <strong className="text-white font-medium">{Math.min(page * pageSize, totalItems)}</strong> of <strong className="text-white font-medium">{totalItems}</strong> orders
            </span>
            <Pagination 
              currentPage={page}
              totalPages={Math.ceil(totalItems / pageSize) || 1}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </CardContent>

      </Card>

    </div>
  );
}
