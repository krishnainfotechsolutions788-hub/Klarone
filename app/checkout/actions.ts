"use server";

import { createClient } from "@/lib/supabase/server";

export async function fetchUserAddresses() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("customer_addresses")
    .select("*")
    .eq("customer_id", userData.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching addresses:", error);
    return [];
  }
  
  return data || [];
}

export async function addCustomerAddress(addressData: any) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("customer_addresses")
    .insert([
      {
        ...addressData,
        customer_id: userData.user.id,
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Error adding address:", error);
    throw new Error("Failed to add address");
  }

  return data;
}

export async function placeOrder(cartItems: { id: string, quantity: number }[], addressId: string, shippingMethod: string, paymentMethod: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    throw new Error("Unauthorized");
  }

  if (!cartItems || cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  // 1. Fetch real variant prices from DB to prevent tampering
  const variantIds = cartItems.map(item => item.id);
  const { data: variants, error: variantsError } = await supabase
    .from("product_variants")
    .select("*, product_models(*, brands(name), series(name))")
    .in("id", variantIds);

  if (variantsError || !variants || variants.length === 0) {
    throw new Error("Invalid products in cart");
  }

  // 2. Calculate totals
  let subtotal = 0;
  const orderItemsData = [];
  
  for (const cartItem of cartItems) {
    const variant = variants.find(v => v.id === cartItem.id);
    if (!variant) continue;
    
    // Fallback logic for mock data if selling_price is missing
    let price = variant.selling_price || 0;
    if (price === 0) {
      const charCode = variant.id.charCodeAt(0) || 0;
      price = 3500 + (charCode % 5) * 2000;
    }
    
    const itemSubtotal = price * cartItem.quantity;
    subtotal += itemSubtotal;
    
    orderItemsData.push({
      variant_id: variant.id,
      quantity: cartItem.quantity,
      unit_price: price,
      subtotal: itemSubtotal,
      product_name: variant.product_models?.name || "Unknown",
      brand: variant.product_models?.brands?.name || "",
      model: variant.product_models?.series?.name || "",
      selected_specifications: variant.variant_attribute_values || {},
      primary_image: ""
    });
  }

  const shippingCost = shippingMethod === "express" ? 499 : 0;
  const grandTotal = subtotal + shippingCost;
  
  const orderNumber = `KLR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  // 3. Create the Order
  const { data: order, error: orderError } = await supabase
    .from("customer_orders")
    .insert({
      order_number: orderNumber,
      customer_id: userData.user.id,
      subtotal,
      shipping_cost: shippingCost,
      grand_total: grandTotal,
      currency: "INR",
      payment_status: paymentMethod === "cod" ? "pending" : "paid",
      order_status: "order_placed"
    })
    .select()
    .single();

  if (orderError) {
    console.error("Order creation failed:", orderError);
    throw new Error("Order creation failed");
  }

  // 4. Create Order Address Snapshot
  const { data: address } = await supabase
    .from("customer_addresses")
    .select("*")
    .eq("id", addressId)
    .single();

  if (address) {
    await supabase.from("order_addresses").insert({
      order_id: order.id,
      type: "shipping",
      name: address.name,
      phone: address.phone,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      landmark: address.landmark
    });
  }

  // 5. Create Order Items
  const finalOrderItems = orderItemsData.map(item => ({ ...item, order_id: order.id }));
  await supabase.from("order_items").insert(finalOrderItems);

  // 6. Create Payment Record
  await supabase.from("payments").insert({
    order_id: order.id,
    payment_provider: paymentMethod === "cod" ? "cash" : "mock_gateway",
    amount: grandTotal,
    currency: "INR",
    status: paymentMethod === "cod" ? "pending" : "paid",
    payment_method: paymentMethod
  });

  return { success: true, order_number: order.order_number };
}
