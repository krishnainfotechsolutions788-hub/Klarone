"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, ShoppingCart, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

const itemUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] as const } 
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

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
        color: "Space Black"
      };
    });
  }, [products, cart]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#000000] text-white relative overflow-hidden pt-15 pb-24">
      {/* Background Vignette Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-20 brightness-[0.7]"
        style={{ backgroundImage: "url('/tech-landscape.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        
        {loading ? (
          <div className="flex items-center justify-center text-white/40 font-normal">Loading shopping cart...</div>
        ) : cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center text-center py-16 sm:py-24 min-h-[50vh]"
          >
            <div className="relative w-52 sm:w-70 aspect-square mb-5 flex items-center justify-center">
              <img 
                src="/empty-cart.png" 
                alt="Empty Cart" 
                className="w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]" 
              />
            </div>
            <h2 className="text-2xl sm:text-3xl font-medium text-white mb-2 tracking-tight">Your Cart is Empty</h2>
            <p className="text-white/50 mb-6 max-w-[360px] text-xs sm:text-sm leading-relaxed font-normal">
              Explore our expert-reviewed laptop models and find the right device for your goals.
            </p>
            <Link href="/shop">
              <Button className="h-11 px-7 bg-white hover:bg-white/90 text-black rounded-full font-medium transition-all shadow-lg flex items-center gap-2 text-sm cursor-pointer">
                Browse <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Header Hero Section */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-6"
            >
              <div className="flex flex-col items-start">
                <motion.div variants={itemUpVariants} className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1A1A1A] border border-white/10 mb-6 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00A7B5]"></span>
                  <span className="text-[12px] font-medium text-white/80 tracking-wide">Reserved Configurations</span>
                </motion.div>

                <motion.h1 
                  variants={itemUpVariants}
                  className="text-[36px] sm:text-[48px] lg:text-[56px] font-normal text-white leading-tight tracking-tight mb-2"
                >
                  Your Shopping Cart
                </motion.h1>
                <motion.p 
                  variants={itemUpVariants}
                  className="text-base sm:text-lg text-white/60 max-w-[600px]"
                >
                  Review your selected technology hardware specs and proceed to secure checkout.
                </motion.p>
              </div>

              <motion.button 
                variants={itemUpVariants}
                onClick={clearCart} 
                className="text-xs font-normal text-white/50 hover:text-rose-400 border border-white/10 hover:border-rose-400/30 bg-white/5 px-4 py-2 rounded-full transition-all self-start sm:self-auto"
              >
                Clear Cart Selection
              </motion.button>
            </motion.div>
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
          >
            
            {/* Left Side: Cart Items */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
              
              {/* Main Items Container */}
              <div className="bg-[#111113]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
                
                {/* Header Row */}
                <div className="hidden sm:grid grid-cols-12 gap-4 pb-4 border-b border-white/10 text-[11.5px] font-normal text-white/50 uppercase tracking-wider">
                  <div className="col-span-7">Selected Hardware</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total Price</div>
                </div>

                <div className="flex flex-col divide-y divide-white/10">
                  {cartItems.map((item) => (
                    <motion.div 
                      key={item.id} 
                      variants={itemUpVariants}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-4 py-6 sm:py-8 items-center first:pt-4"
                    >
                      
                      {/* Product Info */}
                      <div className="sm:col-span-7 flex gap-5 items-center">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#0A0A0C] border border-white/10 rounded-2xl flex-shrink-0 relative overflow-hidden flex items-center justify-center p-3">
                          {item.image ? (
                            <>
                              <img src={item.image} alt={item.name} className="w-full h-full object-contain brightness-[0.9]" />
                              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/50 mix-blend-multiply pointer-events-none" />
                            </>
                          ) : (
                            <Laptop className="w-12 h-12 text-white/20" />
                          )}
                        </div>
                        <div className="flex flex-col gap-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-medium text-white leading-snug line-clamp-1">{item.name}</h3>
                          <p className="text-xs text-[#00A7B5] font-normal tracking-wide">{item.subtitle}</p>
                          <span className="text-[12px] text-white/40">Finish: {item.color}</span>
                          <button 
                            onClick={() => removeFromCart(item.id)} 
                            className="text-[12px] font-normal text-white/50 hover:text-rose-400 transition-colors mt-2 w-fit flex items-center gap-1.5 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove item
                          </button>
                        </div>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="sm:col-span-3 flex sm:justify-center items-center">
                        <div className="flex items-center border border-white/10 bg-[#0A0A0C] h-9 w-[110px] rounded-full overflow-hidden p-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="flex-1 text-center text-[13.5px] font-medium text-white">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="sm:col-span-2 sm:text-right">
                        <div className="text-base sm:text-lg font-medium text-white">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>

                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Trust & Guarantee Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3.5 bg-[#111113]/90 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                  <div className="p-2.5 rounded-full bg-[#00A7B5]/10 border border-[#00A7B5]/20 text-[#00A7B5]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">Verified Hardware Warranty</h4>
                    <p className="text-xs text-white/50 mt-1 leading-relaxed">Includes official brand warranty and Klarone hardware verification.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 bg-[#111113]/90 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                  <div className="p-2.5 rounded-full bg-[#00A7B5]/10 border border-[#00A7B5]/20 text-[#00A7B5]">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">Complimentary Delivery</h4>
                    <p className="text-xs text-white/50 mt-1 leading-relaxed">Insured transit across all major Indian tech hubs & pin codes.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Side: Order Summary */}
            <div className="lg:col-span-5 xl:col-span-4 sticky top-32">
              <div className="bg-[#111113]/90 backdrop-blur-xl border border-white/10 text-white p-6 sm:p-8 rounded-3xl shadow-2xl">
                <h2 className="text-xl font-medium tracking-tight text-white mb-6">Order Summary</h2>
                
                <div className="flex flex-col gap-4 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Subtotal</span>
                    <span className="font-medium text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Insured Shipping</span>
                    <span className="font-medium text-[#00A7B5]">Free</span>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="mb-6">
                  <label className="block text-[11px] font-normal text-white/50 uppercase tracking-wider mb-2">Discount Promo Code</label>
                  <div className="flex gap-2">
                    <Input 
                      type="text" 
                      placeholder="Enter promo code" 
                      className="bg-[#0A0A0C] border border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#00A7B5] h-11 rounded-full text-xs" 
                    />
                    <Button className="h-11 px-5 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium text-xs transition-colors border border-white/10">
                      Apply
                    </Button>
                  </div>
                </div>
                
                <div className="border-t border-white/10 pt-6 mb-6">
                  <div className="flex justify-between items-end">
                    <span className="text-sm text-white/70">Estimated Total</span>
                    <div className="text-right">
                      <span className="text-[11px] text-white/40 block mb-1">Includes all applicable taxes</span>
                      <span className="text-2xl sm:text-3xl font-medium text-white leading-none">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <Link href="/checkout" className="block w-full">
                  <Button className="w-full h-12 bg-white hover:bg-white/90 text-black rounded-full font-medium text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              
              {/* Back to Shop Navigation */}
              <div className="mt-6 text-center">
                <Link href="/shop" className="text-xs font-normal text-white/50 hover:text-white transition-colors border-b border-transparent hover:border-white/40 pb-0.5">
                  ← Continue Exploring Hardware
                </Link>
              </div>

            </div>
          </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
