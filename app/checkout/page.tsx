"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/shared/Footer";
import { Check, ChevronRight, Lock, MapPin, Truck, CreditCard, Receipt, ArrowRight, Loader2 } from "lucide-react";
import { fetchUserAddresses, addCustomerAddress, placeOrder } from "./actions";
import NotLoggedIn from "@/components/NotLoggedIn";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useStore();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<string>("standard");
  const [selectedPayment, setSelectedPayment] = useState<string>("upi");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    label: "home",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India"
  });

  // Load addresses on mount
  useEffect(() => {
    setMounted(true);
    const supabase = createClient();
    
    async function loadData() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        setUser(null);
        setLoading(false);
      } else {
        setUser(data.user);
        
        try {
          const userAddresses = await fetchUserAddresses();
          setAddresses(userAddresses);
          if (userAddresses.length > 0) {
            setSelectedAddress(userAddresses[0].id);
          } else {
            setShowAddAddress(true);
          }
        } catch (e) {
          console.error(e);
        }
        
        setLoading(false);
      }
    }
    
    loadData();
  }, [router]);

  useEffect(() => {
    if (mounted && cart.length === 0 && currentStep !== 5) {
      router.push("/cart");
    }
  }, [mounted, cart, router, currentStep]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const added = await addCustomerAddress(newAddress);
      setAddresses([added, ...addresses]);
      setSelectedAddress(added.id);
      setShowAddAddress(false);
    } catch (e) {
      alert("Failed to add address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return;
    
    setIsSubmitting(true);
    try {
      const result = await placeOrder(cart, selectedAddress, selectedShipping, selectedPayment);
      if (result.success) {
        clearCart();
        router.push(`/order-confirmation/${result.order_number}`);
      }
    } catch (e: any) {
      alert(e.message || "Failed to place order");
      setIsSubmitting(false);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <Header variant="shop" />
        <main className="flex-1 w-full mx-auto px-4 py-12 pt-32">
          <NotLoggedIn 
            title="Sign in to checkout" 
            message="You need an account to place an order securely."
          />
        </main>
        <Footer />
      </div>
    );
  }

  const steps = [
    { num: 1, title: "Shipping Address", icon: MapPin },
    { num: 2, title: "Delivery Method", icon: Truck },
    { num: 3, title: "Payment", icon: CreditCard },
    { num: 4, title: "Review Order", icon: Receipt },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header variant="shop" />
      
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold font-heading text-foreground mb-4">Secure Checkout</h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <Lock className="w-4 h-4 text-emerald-500" />
            <span>256-bit SSL Encryption. Your data is secure.</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex justify-between items-center max-w-3xl mx-auto mb-16 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -z-10 -translate-y-1/2"></div>
          {steps.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.num;
            const isCurrent = currentStep === step.num;
            
            return (
              <div key={step.num} className="flex flex-col items-center bg-background px-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isCompleted ? 'bg-emerald-500 text-white' : 
                  isCurrent ? 'bg-accent text-white ring-4 ring-accent/20' : 
                  'bg-secondary text-muted-foreground border-2 border-border'
                }`}>
                  {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={`text-xs font-medium mt-3 ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column - Steps */}
          <div className="lg:col-span-8">
            
            {/* Step 1: Address */}
            {currentStep === 1 && (
              <div className="bg-card border border-border rounded-xl p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-xl font-bold font-heading mb-6">Select Shipping Address</h2>
                
                {!showAddAddress ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      {addresses.map((address) => (
                        <div 
                          key={address.id}
                          onClick={() => setSelectedAddress(address.id)}
                          className={`border-2 rounded-lg p-5 cursor-pointer transition-all ${
                          selectedAddress === address.id ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-border hover:border-accent/50 bg-background"
                        }`}>
                          <div className="flex justify-between items-start mb-2">
                            <span className="inline-flex px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded bg-primary/10 text-primary">{address.label}</span>
                            {selectedAddress === address.id && <Check className="w-5 h-5 text-accent" />}
                          </div>
                          <p className="font-semibold text-foreground">{address.name}</p>
                          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                            {address.address_line_1}<br />
                            {address.address_line_2 && <>{address.address_line_2}<br /></>}
                            {address.city}, {address.state} {address.postal_code}<br />
                            {address.country}
                          </p>
                          <p className="text-sm text-foreground mt-3 font-medium">{address.phone}</p>
                        </div>
                      ))}
                      
                      {/* Add New Address Button */}
                      <div 
                        onClick={() => setShowAddAddress(true)}
                        className="border-2 border-dashed border-border rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/50 transition-colors h-full min-h-[200px]"
                      >
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-3">
                          <span className="text-xl text-foreground">+</span>
                        </div>
                        <p className="font-medium text-foreground">Add New Address</p>
                      </div>
                    </div>

                    <div className="flex justify-end border-t border-border pt-6">
                      <button 
                        disabled={!selectedAddress}
                        onClick={() => setCurrentStep(2)}
                        className="h-12 px-8 bg-foreground hover:bg-foreground/90 text-background rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors"
                      >
                        Continue to Delivery <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleAddAddress} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Full Name</label>
                        <input required type="text" className="w-full h-10 px-3 rounded-md border border-border" value={newAddress.name} onChange={(e) => setNewAddress({...newAddress, name: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Phone Number</label>
                        <input required type="text" className="w-full h-10 px-3 rounded-md border border-border" value={newAddress.phone} onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})} />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Address Line 1</label>
                      <input required type="text" className="w-full h-10 px-3 rounded-md border border-border" value={newAddress.address_line_1} onChange={(e) => setNewAddress({...newAddress, address_line_1: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Address Line 2 (Optional)</label>
                      <input type="text" className="w-full h-10 px-3 rounded-md border border-border" value={newAddress.address_line_2} onChange={(e) => setNewAddress({...newAddress, address_line_2: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">City</label>
                        <input required type="text" className="w-full h-10 px-3 rounded-md border border-border" value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">State</label>
                        <input required type="text" className="w-full h-10 px-3 rounded-md border border-border" value={newAddress.state} onChange={(e) => setNewAddress({...newAddress, state: e.target.value})} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">PIN Code</label>
                        <input required type="text" className="w-full h-10 px-3 rounded-md border border-border" value={newAddress.postal_code} onChange={(e) => setNewAddress({...newAddress, postal_code: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Address Label</label>
                        <select className="w-full h-10 px-3 rounded-md border border-border bg-transparent" value={newAddress.label} onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}>
                          <option value="home">Home</option>
                          <option value="work">Work</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                      {addresses.length > 0 && (
                        <button type="button" onClick={() => setShowAddAddress(false)} className="px-6 h-10 font-medium hover:bg-secondary rounded-md">Cancel</button>
                      )}
                      <button type="submit" disabled={isSubmitting} className="px-6 h-10 bg-foreground text-background font-medium rounded-md disabled:opacity-50">
                        {isSubmitting ? 'Saving...' : 'Save Address'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Step 2: Delivery */}
            {currentStep === 2 && (
              <div className="bg-card border border-border rounded-xl p-8 shadow-sm animate-in fade-in slide-in-from-right-8">
                <h2 className="text-xl font-bold font-heading mb-6">Delivery Method</h2>
                
                <div className="flex flex-col gap-4 mb-8">
                  <label className={`flex items-center p-5 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedShipping === "standard" ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-border hover:border-accent/50 bg-background"
                  }`}>
                    <input 
                      type="radio" 
                      name="shipping" 
                      className="w-5 h-5 text-accent border-border focus:ring-accent accent-accent" 
                      checked={selectedShipping === "standard"}
                      onChange={() => setSelectedShipping("standard")}
                    />
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-foreground">Standard Delivery</p>
                      <p className="text-sm text-muted-foreground mt-0.5">3-5 business days</p>
                    </div>
                    <span className="font-bold text-accent">Free</span>
                  </label>
                  
                  <label className={`flex items-center p-5 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedShipping === "express" ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-border hover:border-accent/50 bg-background"
                  }`}>
                    <input 
                      type="radio" 
                      name="shipping" 
                      className="w-5 h-5 text-accent border-border focus:ring-accent accent-accent"
                      checked={selectedShipping === "express"}
                      onChange={() => setSelectedShipping("express")}
                    />
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-foreground">Express Delivery</p>
                      <p className="text-sm text-muted-foreground mt-0.5">1-2 business days</p>
                    </div>
                    <span className="font-bold text-foreground">₹499</span>
                  </label>
                </div>

                <div className="flex justify-between border-t border-border pt-6">
                  <button 
                    onClick={() => setCurrentStep(1)}
                    className="h-12 px-6 text-foreground hover:bg-secondary rounded-lg font-medium transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setCurrentStep(3)}
                    className="h-12 px-8 bg-foreground hover:bg-foreground/90 text-background rounded-lg font-semibold flex items-center gap-2 transition-colors"
                  >
                    Continue to Payment <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div className="bg-card border border-border rounded-xl p-8 shadow-sm animate-in fade-in slide-in-from-right-8">
                <h2 className="text-xl font-bold font-heading mb-6">Payment Method</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {['upi', 'credit_card', 'debit_card', 'net_banking', 'cod'].map((method) => {
                    const labels: any = {
                      upi: "UPI (GPay, PhonePe, Paytm)",
                      credit_card: "Credit Card",
                      debit_card: "Debit Card",
                      net_banking: "Net Banking",
                      cod: "Cash on Delivery"
                    };
                    return (
                      <label key={method} className={`flex items-center p-5 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedPayment === method ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-border hover:border-accent/50 bg-background"
                      }`}>
                        <input 
                          type="radio" 
                          name="payment" 
                          className="w-5 h-5 text-accent border-border focus:ring-accent accent-accent"
                          checked={selectedPayment === method}
                          onChange={() => setSelectedPayment(method)}
                        />
                        <div className="ml-4">
                          <p className="font-semibold text-foreground">{labels[method]}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>

                <div className="flex justify-between border-t border-border pt-6">
                  <button 
                    onClick={() => setCurrentStep(2)}
                    className="h-12 px-6 text-foreground hover:bg-secondary rounded-lg font-medium transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setCurrentStep(4)}
                    className="h-12 px-8 bg-foreground hover:bg-foreground/90 text-background rounded-lg font-semibold flex items-center gap-2 transition-colors"
                  >
                    Review Order <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="bg-card border border-border rounded-xl p-8 shadow-sm animate-in fade-in slide-in-from-right-8">
                <h2 className="text-xl font-bold font-heading mb-6">Review Your Order</h2>
                
                <div className="bg-secondary/50 rounded-lg p-6 mb-8 border border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Shipping To</h3>
                      {(() => {
                        const addr = addresses.find(a => a.id === selectedAddress);
                        return addr ? (
                          <>
                            <p className="font-medium text-foreground">{addr.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">{addr.address_line_1}, {addr.city}</p>
                          </>
                        ) : null;
                      })()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Payment & Delivery</h3>
                      <p className="text-sm text-foreground mb-1"><span className="text-muted-foreground">Method:</span> {selectedPayment.toUpperCase()}</p>
                      <p className="text-sm text-foreground"><span className="text-muted-foreground">Delivery:</span> {selectedShipping === 'express' ? 'Express (1-2 days)' : 'Standard (3-5 days)'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-lg mb-8 text-sm">
                  <Check className="w-5 h-5 flex-shrink-0" />
                  <p>By placing your order, you agree to Klarone's Terms of Service and Privacy Policy.</p>
                </div>

                <div className="flex justify-between border-t border-border pt-6">
                  <button 
                    disabled={isSubmitting}
                    onClick={() => setCurrentStep(3)}
                    className="h-12 px-6 text-foreground hover:bg-secondary rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="h-12 px-10 bg-accent hover:bg-accent/90 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                    ) : (
                      "Place Order"
                    )}
                  </button>
                </div>
              </div>
            )}
            
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-4">
            <div className="bg-secondary/50 border border-border rounded-xl p-6 sticky top-32">
              <h3 className="font-bold font-heading text-lg mb-4">Summary</h3>
              
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-muted-foreground">Items ({cart.reduce((a,b)=>a+b.quantity, 0)})</span>
                <span className="font-medium">See Cart</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">{selectedShipping === 'express' ? '₹499' : 'Free'}</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-6 pb-6 border-b border-border">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">Included</span>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-foreground">Total</span>
                <span className="font-bold text-xl text-foreground">Calculated Securely</span>
              </div>
              <p className="text-[11px] text-muted-foreground text-right mb-6">Including GST</p>
              
              {/* Trust Badges */}
              <div className="flex gap-2 justify-center mt-8">
                <div className="h-8 w-12 bg-background border border-border rounded flex items-center justify-center text-[10px] font-bold text-muted-foreground">VISA</div>
                <div className="h-8 w-12 bg-background border border-border rounded flex items-center justify-center text-[10px] font-bold text-muted-foreground">UPI</div>
                <div className="h-8 w-12 bg-background border border-border rounded flex items-center justify-center text-[10px] font-bold text-muted-foreground">SSL</div>
              </div>
            </div>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
