"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchAdminOrderDetails } from "../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, Clock, MapPin, CreditCard, 
  Package, User, MessageSquare, History, CheckCircle2, AlertCircle, FileText
} from "lucide-react";
import Image from "next/image";

export default function OrderWorkspacePage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const data = await fetchAdminOrderDetails(id as string);
        setOrder(data);
      } catch (error) {
        console.error("Failed to load order:", error);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading workspace...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col h-[80vh] items-center justify-center gap-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <div className="text-xl font-medium">Order Not Found</div>
        <Button variant="outline" onClick={() => router.push('/admin/order')}>Return to Orders</Button>
      </div>
    );
  }

  const shippingAddress = order.order_addresses?.find((a: any) => a.type === 'shipping') || order.order_addresses?.[0];
  const billingAddress = order.order_addresses?.find((a: any) => a.type === 'billing') || shippingAddress;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending_payment': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/admin/order')} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-[#181d26]">Order {order.order_number}</h1>
              <Badge variant="outline" className={`px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(order.order_status)}`}>
                {order.order_status.replace('_', ' ')}
              </Badge>
              {order.payment_status === 'paid' && (
                <Badge variant="outline" className="px-2.5 py-0.5 text-xs font-medium bg-green-50 text-green-700 border-green-200">
                  Paid
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              {new Date(order.created_at).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-[13px]">Print Invoice</Button>
          <Button className="text-[13px] bg-black text-white hover:bg-black/90">Update Status</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT PANEL */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Items */}
          <Card className="shadow-none border-[#e5e7eb] rounded-xl overflow-hidden">
            <CardHeader className="bg-[#f9fafb] border-b border-[#e5e7eb] py-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2 text-[#111827]">
                <Package className="w-4 h-4 text-[#6b7280]" /> 
                Items ({order.order_items?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[#e5e7eb]">
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="p-5 flex gap-4">
                    <div className="w-16 h-16 bg-[#f3f4f6] rounded-lg border border-[#e5e7eb] overflow-hidden flex-shrink-0 relative">
                      {item.product_variants?.product_models?.product_images?.[0]?.image_url ? (
                        <Image 
                          src={item.product_variants.product_models.product_images[0].image_url} 
                          alt={item.product_variants.product_models.name}
                          fill
                          className="object-cover"
                        />
                      ) : item.product_variants?.product_models?.images?.[0] ? (
                        <Image 
                          src={item.product_variants.product_models.images[0]} 
                          alt={item.product_variants.product_models.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Package className="w-6 h-6 m-auto text-gray-400 absolute inset-0" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-[#111827]">{item.product_variants?.product_models?.name || 'Unknown Product'}</h4>
                      <p className="text-sm text-[#6b7280] mt-0.5">
                        {item.product_variants?.dynamic_attributes?.ram || 'Standard'} RAM • {item.product_variants?.dynamic_attributes?.storage || 'Standard'} SSD
                      </p>
                      <div className="text-sm font-medium mt-1 text-[#374151]">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.unit_price)} × {item.quantity}
                      </div>
                    </div>
                    <div className="text-right flex flex-col justify-between">
                      <div className="font-semibold text-[#111827]">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.total_price)}
                      </div>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 mt-2">
                        Unallocated
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-[#f9fafb] p-5 border-t border-[#e5e7eb]">
                <div className="flex justify-between text-sm mb-2 text-[#4b5563]">
                  <span>Subtotal</span>
                  <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2 text-[#4b5563]">
                  <span>Shipping</span>
                  <span>{order.shipping_cost > 0 ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(order.shipping_cost) : 'Free'}</span>
                </div>
                <div className="flex justify-between font-semibold text-base mt-4 pt-4 border-t border-[#e5e7eb] text-[#111827]">
                  <span>Total</span>
                  <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(order.grand_total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Details */}
            <Card className="shadow-none border-[#e5e7eb] rounded-xl">
              <CardHeader className="py-4 border-b border-[#e5e7eb]">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-[#111827]">
                  <User className="w-4 h-4 text-[#6b7280]" /> 
                  Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 text-sm space-y-3">
                <div>
                  <div className="font-medium text-[#111827] text-base">{shippingAddress?.name || 'Unknown Customer'}</div>
                  <div className="text-[#6b7280]">{order.customer?.email}</div>
                  <div className="text-[#6b7280]">{shippingAddress?.phone}</div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card className="shadow-none border-[#e5e7eb] rounded-xl">
              <CardHeader className="py-4 border-b border-[#e5e7eb]">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-[#111827]">
                  <CreditCard className="w-4 h-4 text-[#6b7280]" /> 
                  Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 text-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#4b5563]">Method</span>
                  <span className="font-medium capitalize">{order.payment_status === 'paid' ? 'Prepaid' : 'Cash on Delivery'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#4b5563]">Status</span>
                  <Badge variant="outline" className={order.payment_status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}>
                    {order.payment_status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Addresses */}
          <Card className="shadow-none border-[#e5e7eb] rounded-xl">
            <CardHeader className="py-4 border-b border-[#e5e7eb]">
              <CardTitle className="text-base font-semibold flex items-center gap-2 text-[#111827]">
                <MapPin className="w-4 h-4 text-[#6b7280]" /> 
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 text-sm">
              <p className="text-[#4b5563] leading-relaxed">
                {shippingAddress?.address_line_1} <br/>
                {shippingAddress?.address_line_2 && <>{shippingAddress.address_line_2}<br/></>}
                {shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.postal_code}<br/>
                {shippingAddress?.country}
              </p>
            </CardContent>
          </Card>

        </div>

        {/* RIGHT PANEL (Sticky Workspace) */}
        <div className="space-y-6">
          <div className="sticky top-6">
            <Tabs defaultValue="timeline" className="w-full">
              <TabsList className="w-full grid grid-cols-2 p-1 bg-[#f3f4f6]">
                <TabsTrigger value="timeline" className="text-xs">Timeline</TabsTrigger>
                <TabsTrigger value="notes" className="text-xs">Internal Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="timeline" className="mt-4 bg-white border border-[#e5e7eb] rounded-xl shadow-none">
                <div className="p-4 border-b border-[#e5e7eb] font-medium text-sm flex items-center gap-2 text-[#111827]">
                  <History className="w-4 h-4 text-[#6b7280]" /> Activity History
                </div>
                <div className="p-5 max-h-[500px] overflow-y-auto">
                  {order.order_timeline_events?.length > 0 ? (
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                      {/* Timeline items will go here */}
                    </div>
                  ) : (
                    <div className="text-center text-sm text-[#6b7280] py-8">
                      No timeline events recorded yet.
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="notes" className="mt-4 bg-white border border-[#e5e7eb] rounded-xl shadow-none">
                <div className="p-4 border-b border-[#e5e7eb] font-medium text-sm flex items-center gap-2 text-[#111827]">
                  <MessageSquare className="w-4 h-4 text-[#6b7280]" /> Staff Notes
                </div>
                <div className="p-5">
                  <div className="text-center text-sm text-[#6b7280] py-8">
                    No internal notes on this order.
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#e5e7eb]">
                    <textarea 
                      className="w-full text-sm border border-[#e5e7eb] rounded-md p-2.5 outline-none focus:border-black transition-colors resize-none"
                      placeholder="Add a note (visible only to staff)..."
                      rows={3}
                    />
                    <Button size="sm" className="w-full mt-2 bg-black text-white hover:bg-black/90">Add Note</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

      </div>
    </div>
  );
}
