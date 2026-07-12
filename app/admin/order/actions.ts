"use server";

import { createClient } from "@/lib/supabase/server";

export async function fetchAdminOrders(page: number, pageSize: number) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error("Unauthorized");
  }

  // Calculate range
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Fetch orders
  const { data: orders, error, count } = await supabase
    .from("customer_orders")
    .select(`
      *,
      order_addresses(*),
      order_items(quantity)
    `, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching admin orders:", error);
    throw new Error("Failed to fetch orders");
  }

  // Process data for the UI
  const processedOrders = orders?.map(order => {
    const billingAddress = order.order_addresses?.find((a: any) => a.type === 'billing') || order.order_addresses?.[0];
    const totalItems = order.order_items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;

    return {
      id: order.order_number,
      customerName: billingAddress?.name || 'Unknown Customer',
      email: billingAddress?.phone || 'No phone', // Using phone as fallback since email isn't in address
      date: new Date(order.created_at).toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'short', 
        day: '2-digit' 
      }),
      status: order.order_status === 'pending_payment' ? 'processing' :
              order.order_status === 'order_placed' ? 'processing' :
              order.order_status === 'confirmed' ? 'shipped' :
              order.order_status === 'cancelled' ? 'cancelled' : 'delivered',
      total: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(order.grand_total),
      items: totalItems,
      paymentMethod: order.payment_status === 'paid' ? 'Prepaid' : 'COD'
    };
  }) || [];

  return {
    orders: processedOrders,
    totalCount: count || 0
  };
}

export async function fetchAdminOrderDetails(orderId: string) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error("Unauthorized");
  }

  const { data: order, error } = await supabase
    .from("customer_orders")
    .select(`
      *,
      order_addresses(*),
      order_items(
        *,
        product_variants(
          *,
          product_models(
            *,
            product_images(*)
          )
        )
      ),
      order_notes(*),
      order_timeline_events(*),
      order_assignments(*)
    `)
    .eq("order_number", orderId)
    .single();

  if (error) {
    console.error("Error fetching order details:", error);
    throw new Error("Failed to fetch order details");
  }

  return order;
}
