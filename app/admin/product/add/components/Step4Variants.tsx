import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductVariant, PimTemplate } from './types';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Plus, Trash2, Copy } from 'lucide-react';

interface Step4VariantsProps {
  categoryId: string;
  categoryGroupId: string;
  hasVariants: 'YES' | 'NO' | 'OPTIONAL';
  data: ProductVariant[];
  onChange: (updates: ProductVariant[]) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export function Step4Variants({ categoryId, categoryGroupId, hasVariants, data, onChange }: Step4VariantsProps) {

  const [variantAttributesList, setVariantAttributesList] = React.useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    async function loadVariantAttributes() {
      if (!categoryId) return;
      setIsLoading(true);
      try {
        const supabase = createClient();
        
        const { data: catData } = await supabase
          .from('categories')
          .select('template_id')
          .eq('id', categoryId)
          .single();
          
        if (!catData?.template_id) return;

        // For variants, we usually want attributes that define the variants (like Dropdowns)
        // In a full PIM, there is an `is_variant_attribute` flag. For V1, we'll fetch Dropdown attributes.
        const { data: attrs } = await supabase
          .from('template_attributes')
          .select('attribute_id, attribute:attributes(id, name, data_type)')
          .eq('template_id', catData.template_id);
          
        if (attrs) {
          const variantAttrs = attrs
            .filter((a: any) => {
              const attr = Array.isArray(a.attribute) ? a.attribute[0] : a.attribute;
              return attr?.data_type === 'Dropdown';
            })
            .map((a: any) => {
              const attr = Array.isArray(a.attribute) ? a.attribute[0] : a.attribute;
              return { id: a.attribute_id, name: attr?.name };
            });
          setVariantAttributesList(variantAttrs);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadVariantAttributes();
  }, [categoryId]);

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: generateId(),
      name: `Variant ${data.length + 1}`,
      sku: '',
      attributes: {},
      images: [],
      basePrice: 0,
      sellingPrice: 0,
      taxClass: 'Standard',
      status: 'Active'
    };
    onChange([...data, newVariant]);
  };

  const duplicateVariant = (variant: ProductVariant) => {
    const duplicated = {
      ...variant,
      id: generateId(),
      name: `${variant.name} (Copy)`,
      sku: `${variant.sku}-COPY`
    };
    onChange([...data, duplicated]);
  };

  const deleteVariant = (id: string) => {
    onChange(data.filter(v => v.id !== id));
  };

  const updateVariant = (id: string, field: keyof ProductVariant, value: any) => {
    onChange(data.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const updateAttribute = (variantId: string, attrKey: string, value: string) => {
    onChange(data.map(v => {
      if (v.id === variantId) {
        return {
          ...v,
          attributes: { ...v.attributes, [attrKey]: value }
        };
      }
      return v;
    }));
  };

  if (hasVariants === 'NO') {
    return (
      <Card>
        <CardContent className="py-10 text-center text-slate-500">
          This product category does not support variants. You can skip to the Inventory step.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Product Variants</h2>
          <p className="text-sm text-slate-500">Manage different versions of this product.</p>
        </div>
        <Button onClick={addVariant} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Variant
        </Button>
      </div>

      {data.length === 0 ? (
        <Card>
          <CardContent className="py-12 flex flex-col items-center justify-center text-slate-500 gap-4">
            <p>No variants added yet.</p>
            {hasVariants === 'OPTIONAL' && <p className="text-sm text-slate-400">Variants are optional for this category. You can skip this step.</p>}
            <Button onClick={addVariant} variant="outline" className="mt-2">Create First Variant</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {data.map((variant, index) => (
            <Card key={variant.id} className="relative overflow-visible">
              <div className="absolute -top-3 -right-3 flex gap-2">
                <Button size="icon" variant="outline" className="h-8 w-8 bg-white hover:bg-slate-50 rounded-full shadow-sm text-slate-500 hover:text-blue-600" onClick={() => duplicateVariant(variant)}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="outline" className="h-8 w-8 bg-white hover:bg-red-50 rounded-full shadow-sm text-slate-500 hover:text-red-600" onClick={() => deleteVariant(variant.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Variant Name</label>
                    <Input 
                      value={variant.name} 
                      onChange={(e) => updateVariant(variant.id, 'name', e.target.value)} 
                      className="font-medium"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">SKU</label>
                    <Input 
                      value={variant.sku} 
                      onChange={(e) => updateVariant(variant.id, 'sku', e.target.value)} 
                      placeholder="e.g. LNV-T480-I7-16"
                    />
                  </div>
                  <div className="w-32 space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Status</label>
                    <Select value={variant.status} onValueChange={(val: any) => updateVariant(variant.id, 'status', val)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Discontinued">Discontinued</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div> 
                    Attributes
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {variantAttributesList.map(attr => (
                      <div key={attr.id} className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-600">{attr.name}</label>
                        <Input 
                          value={variant.attributes[attr.id] || ''} 
                          onChange={(e) => updateAttribute(variant.id, attr.id, e.target.value)} 
                          placeholder={`Enter ${attr.name}`}
                          className="bg-white text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">Base Price</label>
                    <Input 
                      type="number"
                      value={variant.basePrice} 
                      onChange={(e) => updateVariant(variant.id, 'basePrice', parseFloat(e.target.value))} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">Selling Price</label>
                    <Input 
                      type="number"
                      value={variant.sellingPrice} 
                      onChange={(e) => updateVariant(variant.id, 'sellingPrice', parseFloat(e.target.value))} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">Cost Price (Opt)</label>
                    <Input 
                      type="number"
                      value={variant.costPrice || ''} 
                      onChange={(e) => updateVariant(variant.id, 'costPrice', parseFloat(e.target.value))} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">Tax Class</label>
                    <Select value={variant.taxClass} onValueChange={(val: any) => updateVariant(variant.id, 'taxClass', val)}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Standard">Standard (18%)</SelectItem>
                        <SelectItem value="Reduced">Reduced (12%)</SelectItem>
                        <SelectItem value="Exempt">Exempt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
