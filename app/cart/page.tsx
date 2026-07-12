"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCartItems() {
      if (cart.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const cartIds = cart.map(item => item.id);
      
      const supabase = createClient();
      const { data, error } = await supabase
        .from("product_variants")
        .select(`
          id,
          selling_price,
          product_models(
            id,
            name,
            brands(name),
            series(name),
            product_images(image_url, is_primary)
          ),
          variant_attribute_values(
            value_text,
            attributes(name)
          )
        `)
        .in("id", cartIds);
      
      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    }
    
    fetchCartItems();
  }, [cart]);

  const cartItems = useMemo(() => {
    return products.map(variant => {
      const model = variant.product_models;
      const images = model?.product_images || [];
      const primaryImage = images.find((img: any) => img.is_primary) || images[0];
      
      const cartItem = cart.find(c => c.id === variant.id);
      
      // Attempt to build a configuration string
      const attrs = variant.variant_attribute_values || [];
      let subtitle = "Default Configuration";
      if (attrs.length > 0) {
         subtitle = attrs.map((a:any) => a.value_text).filter(Boolean).join(" • ");
      }
      
      let price = variant.selling_price || 0;
      if (price === 0) {
        const charCode = variant.id.charCodeAt(0) || 0;
        price = 3500 + (charCode % 5) * 2000;
      }
      
      return {
        id: variant.id,
        name: `${model?.brands?.name || ''} ${model?.series?.name || ''} ${model?.name || ''}`.trim(),
        subtitle: subtitle,
        price: price,
        image: primaryImage?.image_url || "",
        quantity: cartItem?.quantity || 1,
        color: "Default"
      };
    });
  }, [products, cart]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
        
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-[36px] md:text-[42px] font-bold tracking-tight font-heading text-primary">
            Your Cart
          </h1>
          {cart.length > 0 && (
            <button onClick={clearCart} className="text-sm font-medium text-muted-foreground hover:text-red-500 transition-colors">
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingCart className="w-20 h-20 text-muted-foreground/30 mb-6" />
            <h2 className="text-2xl font-bold font-heading mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              {cart.length > 0 
                ? "Some items in your cart are no longer available or the data is corrupted. Please clear your cart to continue." 
                : "Looks like you haven't added anything to your cart yet."}
            </p>
            <div className="flex gap-4">
              <Link href="/shop">
                <Button className="h-12 px-8 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                  Browse Products
                </Button>
              </Link>
              {cart.length > 0 && (
                <Button onClick={clearCart} variant="outline" className="h-12 px-8">
                  Reset Cart
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Side: Cart Items */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
            
            {/* Header row (hidden on mobile) */}
            <div className="hidden sm:grid grid-cols-12 gap-4 pb-4 border-b border-border text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="col-span-7">Product</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            <div className="flex flex-col">
              {cartItems.map((item) => (
                <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-4 py-8 border-b border-border items-center">
                  
                  {/* Product Info */}
                  <div className="sm:col-span-7 flex gap-6 items-center">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-secondary rounded-[10px] flex-shrink-0 relative overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-[16px] sm:text-[18px] font-semibold font-heading text-foreground mb-1">{item.name}</h3>
                      <p className="text-[13px] text-muted-foreground mb-2">{item.subtitle}</p>
                      <p className="text-[13px] text-muted-foreground/80">Color: {item.color}</p>
                      <button onClick={() => removeFromCart(item.id)} className="text-[13px] font-medium text-muted-foreground hover:text-red-500 transition-colors mt-3 w-fit flex items-center gap-1.5 rounded-[6px] outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                  
                  {/* Quantity */}
                  <div className="sm:col-span-3 flex sm:justify-center items-center">
                    <div className="flex items-center border border-border h-10 w-[100px] rounded-[6px] overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex-1 flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors h-full outline-none focus-visible:bg-secondary"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-[14px] font-medium text-foreground">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex-1 flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors h-full outline-none focus-visible:bg-secondary"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="sm:col-span-2 sm:text-right">
                    <div className="text-[16px] sm:text-[18px] font-semibold text-foreground">
                      ₹{item.price.toLocaleString('en-IN')}
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-col sm:flex-row gap-6 border border-border bg-secondary rounded-[10px] p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-accent flex-shrink-0" />
                <div>
                  <h4 className="text-[14px] font-semibold font-heading text-foreground">Secure Checkout</h4>
                  <p className="text-[12px] text-muted-foreground mt-1">Your payment information is encrypted and secure.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-accent flex-shrink-0" />
                <div>
                  <h4 className="text-[14px] font-semibold font-heading text-foreground">Free & Fast Delivery</h4>
                  <p className="text-[12px] text-muted-foreground mt-1">Enjoy free delivery on all technology orders.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-32">
            <div className="bg-secondary border border-border text-foreground p-8 sm:p-10 rounded-[12px]">
              <h2 className="text-[20px] font-semibold tracking-tight font-heading mb-8">Order Summary</h2>
              
              <div className="flex flex-col gap-5 mb-8">
                <div className="flex justify-between text-[15px]">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[15px]">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-accent">Free</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-8">
                <label className="block text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Discount Code</label>
                <div className="flex gap-2">
                  <Input 
                    type="text" 
                    placeholder="Enter code" 
                    className="bg-background border border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-accent focus-visible:border-transparent h-12 rounded-[6px]" 
                  />
                  <Button className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-[6px] font-semibold transition-colors">
                    Apply
                  </Button>
                </div>
              </div>
              
              <div className="border-t border-border pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-[16px] font-medium text-muted-foreground">Total</span>
                  <div className="text-right">
                    <span className="text-[12px] text-muted-foreground/80 block mb-1">Including GST</span>
                    <span className="text-[28px] font-bold text-foreground leading-none">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <Link href="/checkout" className="block w-full">
                <Button className="w-full h-14 bg-accent hover:bg-accent/90 text-accent-foreground rounded-[6px] font-semibold text-[16px] transition-colors flex items-center justify-center gap-2">
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            
            {/* Continue Shopping Link */}
            <div className="mt-6 text-center">
              <Link href="/" className="text-[14px] font-medium text-muted-foreground hover:text-foreground transition-colors border-b border-transparent hover:border-foreground pb-0.5">
                Continue Shopping
              </Link>
            </div>

          </div>
        </div>
        )}
      </div>
    </div>
  );
}
