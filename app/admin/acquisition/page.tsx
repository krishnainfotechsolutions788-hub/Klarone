"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Package, Plus, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AcquisitionCenterPage() {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setErrorMsg("");
    setResults([]);

    try {
      const searchUrl = brand.trim() 
        ? `/api/admin/icecat/search?q=${encodeURIComponent(query)}&brand=${encodeURIComponent(brand)}`
        : `/api/admin/icecat/search?q=${encodeURIComponent(query)}`;
        
      const res = await fetch(searchUrl);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to search Icecat");
      }

      // Icecat returns an array of products or a single product
      const products = Array.isArray(data.data) ? data.data : [data.data];
      setResults(products);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold font-sora text-gray-900 tracking-tight">Product Acquisition Center</h1>
        <p className="text-gray-500 mt-1">Search the global Icecat database and import official product data into Klarone.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <form onSubmit={handleSearch} className="flex items-center gap-3">
          <div className="w-1/4">
            <input 
              type="text" 
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Brand (e.g. Lenovo)" 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00A7B5]/20 focus:border-[#00A7B5] bg-gray-50/50"
            />
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="GTIN, or Manufacturer Product Code..." 
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00A7B5]/20 focus:border-[#00A7B5] bg-gray-50/50"
            />
          </div>
          <Button type="submit" disabled={isSearching || !query.trim()} className="bg-surface-dark hover:bg-gray-800 text-white px-8 py-6 h-auto">
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search Icecat"}
          </Button>
        </form>
        {errorMsg && <p className="text-red-500 text-sm mt-3">{errorMsg}</p>}
        <p className="text-gray-500 text-xs mt-3">Note: If searching by Product Code instead of GTIN, you <b>must</b> provide the Brand name.</p>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Search Results</h2>
          <div className="grid grid-cols-1 gap-4">
            {results.map((item, idx) => {
              const product = item.EssentialInfo ? item.EssentialInfo : item;
              const title = product.ProductName || product.Title || "Unknown Product";
              const brand = product.Brand || product.Supplier || "Brand";
              const productCode = product.ProductCode || product.Prod_id || "";
              const gtin = (product.GTINs && product.GTINs.length > 0) ? product.GTINs[0] : (product.GTIN || "");
              const icecatId = product.icecat_id || product.Product_id;
              
              const reviewUrl = icecatId 
                ? `/admin/acquisition/review?icecatId=${encodeURIComponent(icecatId)}` 
                : `/admin/acquisition/review?q=${encodeURIComponent(productCode || gtin)}&brand=${encodeURIComponent(brand)}`;

              return (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center p-2 shrink-0">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[#00A7B5] uppercase tracking-wider">{brand}</span>
                      <span className="text-xs text-gray-400 border-l pl-2">{productCode} {gtin && `(${gtin})`}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{title}</h3>
                  </div>
                </div>
                
                <Link href={reviewUrl}>
                  <Button variant="outline" className="shrink-0 group">
                    Review & Import <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            )})}
          </div>
        </div>
      )}
    </div>
  );
}
