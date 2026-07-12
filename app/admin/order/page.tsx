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
    <div className="flex flex-col gap-4 max-w-[1600px] mx-auto">
      
      {/* Main Table Card */}
      <Card className="border-[#dddddd] shadow-none rounded-[10px] overflow-hidden p-0 gap-0">
        
        {/* Table Toolbar */}
        <div className="p-4 border-b border-[#dddddd] bg-[#ffffff] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:max-w-xs bg-[#ffffff] rounded-[6px] border border-[#dddddd] px-3 focus-within:border-[#1b61c9] transition-colors">
            <Search className="w-4 h-4 text-[#41454d]" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="flex-1 bg-transparent border-none outline-none py-2 text-[14px] text-[#181d26] placeholder:text-[#41454d]"
            />
          </div>
          <div className="flex items-center gap-3">
            {selectedOrders.length > 0 && (
              <span className="text-[13px] text-[#41454d] font-medium">
                {selectedOrders.length} selected
              </span>
            )}
            <Button variant="outline" className="h-9 px-3 rounded-[6px] border-[#dddddd] text-[#181d26] text-[13px] hover:bg-[#f8fafc] shadow-none flex items-center gap-1.5">
              Bulk Actions <ChevronDown className="w-3.5 h-3.5 text-[#9297a0]" />
            </Button>
            <Button variant="outline" className="h-9 px-3 rounded-[6px] border-[#dddddd] text-[#181d26] text-[13px] hover:bg-[#f8fafc] shadow-none flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              Filters
            </Button>
            <Button className="h-9 px-4 rounded-[6px] bg-[#181d26] hover:bg-[#0d1218] text-white text-[13px] font-medium shadow-none flex items-center gap-1.5">
              <FileDown className="w-3.5 h-3.5" />
              Export
            </Button>
          </div>
        </div>

        {/* Table Content */}
        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[550px]">
            <Table>
              <TableHeader className="bg-[#f8fafc] hover:bg-[#f8fafc] border-b border-[#dddddd]">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="w-[50px] px-6 text-[#41454d]">
                    <Checkbox 
                      checked={selectedOrders.length === orders.length && orders.length > 0}
                      onCheckedChange={toggleSelectAll}
                      className="border-[#9297a0] data-[state=checked]:bg-[#181d26] data-[state=checked]:border-[#181d26] rounded-[4px]"
                    />
                  </TableHead>
                  <TableHead className="text-[12px] font-medium uppercase tracking-wider text-[#41454d]">Order ID</TableHead>
                  <TableHead className="text-[12px] font-medium uppercase tracking-wider text-[#41454d]">Customer</TableHead>
                  <TableHead className="text-[12px] font-medium uppercase tracking-wider text-[#41454d]">Date</TableHead>
                  <TableHead className="text-[12px] font-medium uppercase tracking-wider text-[#41454d]">Status</TableHead>
                  <TableHead className="text-[12px] font-medium uppercase tracking-wider text-[#41454d]">Payment</TableHead>
                  <TableHead className="text-[12px] font-medium uppercase tracking-wider text-[#41454d] text-right">Total</TableHead>
                  <TableHead className="w-[80px] text-right text-[12px] font-medium uppercase tracking-wider text-[#41454d] px-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-64 text-center text-muted-foreground">
                      Loading orders...
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-64 text-center text-muted-foreground">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                  <TableRow key={order.id} className="border-b-[#dddddd] hover:bg-[#f8fafc] cursor-pointer transition-colors group">
                    <TableCell className="px-6 py-4">
                      <Checkbox 
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={() => toggleSelect(order.id)}
                        className="border-[#9297a0] data-[state=checked]:bg-[#181d26] data-[state=checked]:border-[#181d26] rounded-[4px]"
                      />
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-[14px] font-medium text-[#181d26] leading-tight">{order.id}</span>
                      <div className="text-[12px] text-[#9297a0] mt-0.5">{order.items} {order.items === 1 ? 'item' : 'items'}</div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-medium text-[#181d26] leading-tight">{order.customerName}</span>
                        <span className="text-[12px] text-[#9297a0] mt-0.5">{order.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-[13px] text-[#41454d]">{order.date}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      {order.status === "delivered" && (
                        <div className="flex items-center gap-1.5 text-[#137333] bg-[#e6f4ea] px-2 py-1 rounded-[6px] w-fit">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-[12px] font-medium tracking-wide">Delivered</span>
                        </div>
                      )}
                      {order.status === "processing" && (
                        <div className="flex items-center gap-1.5 text-[#b06000] bg-[#fef2e0] px-2 py-1 rounded-[6px] w-fit">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-[12px] font-medium tracking-wide">Processing</span>
                        </div>
                      )}
                      {order.status === "shipped" && (
                        <div className="flex items-center gap-1.5 text-[#1b61c9] bg-[#e8f0fe] px-2 py-1 rounded-[6px] w-fit">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-[12px] font-medium tracking-wide">Shipped</span>
                        </div>
                      )}
                      {order.status === "cancelled" && (
                        <div className="flex items-center gap-1.5 text-[#c5221f] bg-[#fce8e6] px-2 py-1 rounded-[6px] w-fit">
                          <XCircle className="w-3.5 h-3.5" />
                          <span className="text-[12px] font-medium tracking-wide">Cancelled</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-[13px] text-[#41454d]">{order.paymentMethod}</span>
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <span className="text-[14px] font-medium text-[#181d26]">{order.total}</span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-[6px] text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 hover:bg-[#e0e2e6] hover:text-[#181d26] h-8 w-8 p-0 text-[#41454d] border-none bg-transparent outline-none">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px] rounded-[10px] border-[#dddddd] shadow-lg bg-[#ffffff] p-1">
                          <div className="text-[11px] font-medium text-[#9297a0] uppercase tracking-wider px-2 py-1.5">Actions</div>
                          <DropdownMenuItem 
                            className="text-[13px] text-[#181d26] rounded-[6px] focus:bg-[#f8fafc] cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/admin/order/${order.id}`);
                            }}
                          >
                            View Order
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-[13px] text-[#181d26] rounded-[6px] focus:bg-[#f8fafc] cursor-pointer">
                            Update Status
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-[#dddddd] my-1" />
                          <DropdownMenuItem className="text-[13px] text-[#c5221f] rounded-[6px] focus:bg-[#fce8e6] cursor-pointer">
                            Cancel Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )))}
              </TableBody>
            </Table>
          </div>
          
          <div className="border-t border-[#dddddd]">
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
