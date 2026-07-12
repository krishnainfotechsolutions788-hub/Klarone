import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AddProductState } from './types';
import { mockCategoryGroups, mockTemplates } from './mock-data';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface Step6ReviewProps {
  state: AddProductState;
}

export function Step6Review({ state }: Step6ReviewProps) {
  
  const group = mockCategoryGroups.find(g => g.id === state.basicInfo.categoryGroupId);
  const category = group?.categories.find(c => c.id === state.basicInfo.categoryId);
  const template = mockTemplates.find(t => t.id === category?.templateId);

  // Simple validation logic
  const validate = () => {
    const errors: string[] = [];
    
    if (!state.basicInfo.categoryGroupId) errors.push("Missing Category Group");
    if (!state.basicInfo.categoryId) errors.push("Missing Category");
    if (!state.basicInfo.brand) errors.push("Missing Brand");
    if (!state.basicInfo.modelName) errors.push("Missing Model Name");
    
    if (!state.images.find(img => img.type === 'Primary')) {
      errors.push("Missing Primary Image");
    }

    if (state.basicInfo.hasVariants === 'YES' && state.variants.length === 0) {
      errors.push("This category requires at least one variant.");
    }

    if (state.basicInfo.inventoryMode === 'Serialized' && state.serializedInventory.length === 0) {
      errors.push("No units added to serialized inventory. Adding a product with 0 stock is allowed but double check.");
    }

    return errors;
  };

  const errors = validate();

  return (
    <div className="space-y-6">
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex flex-col gap-2">
          <div className="font-semibold flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> Validation Errors
          </div>
          <ul className="list-disc list-inside text-sm space-y-1 ml-1">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {errors.length === 0 && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="font-medium text-sm">All required fields are complete. Ready to publish!</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="block text-slate-500 font-medium mb-1">Group & Category</span>
            <span className="font-semibold">{group?.name} / {category?.name}</span>
          </div>
          <div>
            <span className="block text-slate-500 font-medium mb-1">Brand & Series</span>
            <span className="font-semibold">{state.basicInfo.brand} {state.basicInfo.series ? `/ ${state.basicInfo.series}` : ''}</span>
          </div>
          <div>
            <span className="block text-slate-500 font-medium mb-1">Model</span>
            <span className="font-semibold">{state.basicInfo.modelName}</span>
          </div>
          <div>
            <span className="block text-slate-500 font-medium mb-1">Status</span>
            <span className="font-semibold inline-flex px-2 py-0.5 rounded-full bg-slate-100 border text-xs">{state.basicInfo.status}</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {template?.fields.map(field => {
              const spec = state.specifications.find(s => s.fieldId === field.id);
              return (
                <div key={field.id} className="flex justify-between border-b pb-2 text-sm">
                  <span className="text-slate-500">{field.name}</span>
                  <span className="font-medium text-right max-w-[200px] truncate">
                    {spec?.value?.toString() || '-'}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Variants ({state.variants.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {state.variants.length === 0 ? (
                <span className="text-sm text-slate-500">No variants</span>
              ) : (
                <div className="space-y-2">
                  {state.variants.map(v => (
                    <div key={v.id} className="flex justify-between items-center text-sm border border-slate-100 p-2 rounded-lg bg-slate-50">
                      <div>
                        <span className="font-medium block">{v.name}</span>
                        <span className="text-xs text-slate-500">{v.sku}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-blue-600">₹{v.sellingPrice}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {state.basicInfo.inventoryMode === 'Serialized' ? (
                <div className="text-sm space-y-1">
                  <span className="text-slate-500">Mode: </span><span className="font-medium">Serialized</span><br/>
                  <span className="text-slate-500">Total Units Added: </span><span className="font-medium text-lg">{state.serializedInventory.length}</span>
                </div>
              ) : (
                <div className="text-sm space-y-1">
                  <span className="text-slate-500">Mode: </span><span className="font-medium">Quantity</span><br/>
                  <span className="text-slate-500">Total Quantity: </span><span className="font-medium text-lg">{state.quantityInventory?.currentQuantity || 0}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
