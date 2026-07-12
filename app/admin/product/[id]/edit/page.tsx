"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save, Check } from "lucide-react";
import { AddProductState } from '../../add/components/types';

import { Step1BasicInfo } from '../../add/components/Step1BasicInfo';
import { Step2Images } from '../../add/components/Step2Images';
import { Step3Specifications } from '../../add/components/Step3Specifications';
import { Step4Variants } from '../../add/components/Step4Variants';
import { Step5Inventory } from '../../add/components/Step5Inventory';
import { Step6Review } from '../../add/components/Step6Review';

const STEPS = [
  { id: 1, title: 'Basic Info' },
  { id: 2, title: 'Images' },
  { id: 3, title: 'Specifications' },
  { id: 4, title: 'Variants' },
  { id: 5, title: 'Inventory' },
  { id: 6, title: 'Review' },
];

export default function EditProductWizard() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Main State Object
  const [state, setState] = useState<AddProductState>({
    basicInfo: {
      productCode: 'PRD-' + Math.floor(100000 + Math.random() * 900000).toString(),
      categoryGroupId: '',
      categoryId: '',
      brand: '',
      series: '',
      modelName: '',
      shortDescription: '',
      description: '',
      status: 'Draft',
      hasVariants: 'NO',
      inventoryMode: 'Quantity'
    },
    images: [],
    specifications: [],
    variants: [],
    serializedInventory: [],
    quantityInventory: null
  });

  // Hydration & Data Fetch
  useEffect(() => {
    setIsClient(true);
    
    async function fetchProduct() {
      if (!productId) return;
      try {
        const supabase = (await import('@/lib/supabase/client')).createClient();
        
        // Fetch model
        const { data: model, error: modelError } = await supabase
          .from('product_models')
          .select('*, categories(group_id, inventory_mode, variant_support)')
          .eq('id', productId)
          .single();
          
        if (modelError) throw modelError;
        
        // Fetch variants & inventory
        const { data: variants } = await supabase
          .from('product_variants')
          .select('*, inventory_units(*)')
          .eq('model_id', productId);
          
        // Map to state...
        // For brevity, we'll setup the basics
        const isQuantity = model.categories.inventory_mode === 'Quantity';
        
        let mappedVariants = [];
        let mappedSerialized = [];
        let mappedQuantity = null;
        
        if (variants && variants.length > 0) {
          if (variants.length === 1 && variants[0].sku.endsWith('-DEFAULT')) {
            // It's a no-variant product
            if (isQuantity) {
               const u = variants[0].inventory_units?.[0];
               if (u) {
                 mappedQuantity = {
                   currentQuantity: u.quantity || 0,
                   minimumStock: 0,
                   reorderLevel: 0,
                   purchasePrice: u.purchase_price || 0,
                   sellingPrice: u.selling_price_override || variants[0].selling_price || 0,
                   rentalPrice: u.rental_price || 0,
                   supplier: u.supplier_id || '',
                   warehouse: 'Main Warehouse - Bangalore',
                   shelfLocation: u.rack_location || ''
                 };
               }
            } else {
               mappedSerialized = (variants[0].inventory_units || []).map(u => ({
                 id: u.id,
                 serialNumber: u.serial_number || '',
                 assetCode: u.asset_code || '',
                 conditionGrade: u.condition_grade || 'A+',
                 purchasePrice: u.purchase_price || 0,
                 sellingPrice: u.selling_price_override || variants[0].selling_price || 0,
                 rentalPrice: u.rental_price || 0,
                 supplier: u.supplier_id || '',
                 purchaseDate: u.created_at,
                 warrantyExpiry: '',
                 currentStatus: u.status === 'available' ? 'Available' : 'Sold',
                 warehouse: 'Main Warehouse - Bangalore',
                 shelfLocation: u.rack_location || '',
                 notes: u.notes || '',
                 images: []
               }));
            }
          } else {
            // Has real variants
            mappedVariants = variants.map(v => ({
              id: v.id,
              name: `Variant ${v.sku}`, // approximation
              sku: v.sku,
              attributes: v.specifications || {},
              images: [],
              basePrice: v.selling_price,
              sellingPrice: v.selling_price,
              costPrice: v.cost_price || 0,
              taxClass: 'Standard',
              status: v.status === 'active' ? 'Active' : 'Inactive'
            }));
            
            if (!isQuantity) {
               variants.forEach(v => {
                 (v.inventory_units || []).forEach(u => {
                   mappedSerialized.push({
                     id: u.id,
                     serialNumber: u.serial_number || '',
                     assetCode: u.asset_code || '',
                     conditionGrade: u.condition_grade || 'A+',
                     purchasePrice: u.purchase_price || 0,
                     sellingPrice: u.selling_price_override || v.selling_price || 0,
                     rentalPrice: u.rental_price || 0,
                     supplier: u.supplier_id || '',
                     purchaseDate: u.created_at,
                     warrantyExpiry: '',
                     currentStatus: u.status === 'available' ? 'Available' : 'Sold',
                     warehouse: 'Main Warehouse - Bangalore',
                     shelfLocation: u.rack_location || '',
                     notes: u.notes || '',
                     images: []
                   });
                 });
               });
            }
          }
        }
        
        setState({
          basicInfo: {
            productCode: model.code,
            categoryGroupId: model.categories?.group_id || '',
            categoryId: model.category_id || '',
            brand: model.brand_id || '',
            series: model.series_id || 'none',
            modelName: model.name,
            shortDescription: model.short_description || '',
            description: model.description || '',
            status: model.status === 'draft' ? 'Draft' : model.status === 'archived' ? 'Archived' : 'Active',
            hasVariants: (variants && variants.length > 0 && !variants[0].sku.endsWith('-DEFAULT')) ? 'YES' : 'NO',
            inventoryMode: isQuantity ? 'Quantity' : 'Serialized'
          },
          images: [],
          specifications: [],
          variants: mappedVariants,
          serializedInventory: mappedSerialized,
          quantityInventory: mappedQuantity
        });
      } catch (e) {
        console.error("Failed to load product", e);
      } finally {
        setIsLoadingData(false);
      }
    }
    
    fetchProduct();
  }, [productId]);

  // Auto-save
  useEffect(() => {
    if (isClient) {
      // Don't save File objects directly in sessionStorage as they won't serialize well,
      // but for this mockup it's fine for simple state.
      const stateToSave = { ...state, images: state.images.map(img => ({ ...img, file: undefined })) };
      sessionStorage.setItem('klarone_add_product_v1', JSON.stringify(stateToSave));
    }
  }, [state, isClient]);

  const nextStep = () => {
    if (currentStep < 6) {
      // Skip variants if hasVariants == 'NO'
      if (currentStep === 3 && state.basicInfo.hasVariants === 'NO') {
        setCurrentStep(5);
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      if (currentStep === 5 && state.basicInfo.hasVariants === 'NO') {
        setCurrentStep(3);
      } else {
        setCurrentStep(prev => prev - 1);
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const supabase = (await import('@/lib/supabase/client')).createClient();

      // Update product_models
      const { data: modelData, error: modelError } = await supabase
        .from('product_models')
        .update({
          category_id: state.basicInfo.categoryId,
          brand_id: state.basicInfo.brand,
          series_id: state.basicInfo.series && state.basicInfo.series !== 'none' ? state.basicInfo.series : null,
          name: state.basicInfo.modelName,
          code: state.basicInfo.productCode,
          description: state.basicInfo.description,
          short_description: state.basicInfo.shortDescription,
          status: state.basicInfo.status.toLowerCase()
        })
        .eq('id', productId)
        .select()
        .single();

      if (modelError) throw modelError;

      // NOTE: For V1 Edit, we only update the base product model fields. 
      // Updating complex nested variants and inventory units requires a robust diffing 
      // algorithm (to avoid deleting units tied to orders). 
      // For now, we will skip variant/inventory updates on edit.

      alert("Product Basic Info Updated Successfully! (Variants/Inventory updates coming soon)");
      router.push('/admin/product');
    } catch (e: any) {
      console.error(e);
      alert("Error updating product: " + e.message);
    }
  };

  if (!isClient) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      
      {/* Header & Progress */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add New Product</h1>
            <p className="text-slate-500 text-sm mt-1">Complete the steps below to add a product to the catalog.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.push('/admin/product')}>Cancel</Button>
            <Button variant="default" onClick={handleUpdate} className="flex items-center gap-2"><Save className="w-4 h-4"/> Update Product</Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 bg-slate-100 rounded-full z-0 overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300" 
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
          <div className="relative z-10 flex justify-between">
            {STEPS.map((step) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              
              // Logic to fade out skipped step 4
              const isSkipped = step.id === 4 && state.basicInfo.hasVariants === 'NO';

              return (
                <div key={step.id} className={`flex flex-col items-center gap-2 ${isSkipped ? 'opacity-30' : ''}`}>
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors
                    ${isCompleted ? 'bg-blue-600 text-white border-2 border-blue-600' : 
                      isCurrent ? 'bg-white text-blue-600 border-2 border-blue-600' : 
                      'bg-white text-slate-400 border-2 border-slate-200'}
                  `}>
                    {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${isCurrent || isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {currentStep === 1 && (
          <Step1BasicInfo 
            data={state.basicInfo} 
            onChange={(updates) => setState({ ...state, basicInfo: { ...state.basicInfo, ...updates } })} 
          />
        )}
        
        {currentStep === 2 && (
          <Step2Images 
            data={state.images} 
            onChange={(updates) => setState({ ...state, images: updates })} 
          />
        )}
        
        {currentStep === 3 && (
          <Step3Specifications 
            categoryGroupId={state.basicInfo.categoryGroupId}
            categoryId={state.basicInfo.categoryId}
            data={state.specifications} 
            onChange={(updates) => setState({ ...state, specifications: updates })} 
          />
        )}
        
        {currentStep === 4 && (
          <Step4Variants 
            categoryId={state.basicInfo.categoryId}
            categoryGroupId={state.basicInfo.categoryGroupId}
            hasVariants={state.basicInfo.hasVariants}
            data={state.variants} 
            onChange={(updates) => setState({ ...state, variants: updates })} 
          />
        )}
        
        {currentStep === 5 && (
          <Step5Inventory 
            inventoryMode={state.basicInfo.inventoryMode}
            serializedData={state.serializedInventory}
            quantityData={state.quantityInventory}
            onSerializedChange={(updates) => setState({ ...state, serializedInventory: updates })}
            onQuantityChange={(updates) => setState({ ...state, quantityInventory: updates })}
          />
        )}
        
        {currentStep === 6 && (
          <Step6Review state={state} />
        )}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-6 border-t mt-12">
        <Button 
          variant="outline" 
          onClick={prevStep} 
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>

        {currentStep < 6 ? (
          <Button onClick={nextStep} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            Next Step <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={handleUpdate} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Check className="w-4 h-4" /> Update Product
          </Button>
        )}
      </div>

    </div>
  );
}
