import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductBasicInfo } from './types';
import { Settings, Plus, X } from 'lucide-react';
import { createClient } from "@/lib/supabase/client";

interface Step1BasicInfoProps {
  data: ProductBasicInfo;
  onChange: (updates: Partial<ProductBasicInfo>) => void;
}

export function Step1BasicInfo({ data, onChange }: Step1BasicInfoProps) {
  const [isAddingNewSeries, setIsAddingNewSeries] = useState(false);
  const [newSeriesValue, setNewSeriesValue] = useState("");
  
  const [groups, setGroups] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [seriesList, setSeriesList] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data: g } = await supabase.from('category_groups').select('*');
      const { data: c } = await supabase.from('categories').select('*');
      const { data: b } = await supabase.from('brands').select('*');
      const { data: s } = await supabase.from('series').select('*');
      
      if (g) setGroups(g);
      if (c) setCategories(c);
      if (b) setBrands(b);
      if (s) setSeriesList(s);
    }
    fetchData();
  }, [supabase]);

  // Find available categories based on selected group
  const availableCategories = useMemo(() => {
    if (!data.categoryGroupId) return [];
    return categories.filter(c => c.group_id === data.categoryGroupId);
  }, [data.categoryGroupId, categories]);

  const selectedCategoryObj = useMemo(() => {
    return availableCategories.find(c => c.id === data.categoryId);
  }, [availableCategories, data.categoryId]);

  const availableSeries = useMemo(() => {
    if (!data.brand) return [];
    return seriesList.filter(s => s.brand_id === data.brand);
  }, [data.brand, seriesList]);

  // Handle Group Change
  const handleGroupChange = (val: string) => {
    onChange({
      categoryGroupId: val,
      categoryId: '',
      hasVariants: 'NO',
      inventoryMode: 'Quantity'
    });
  };

  // Handle Category Change
  const handleCategoryChange = (val: string) => {
    const category = availableCategories.find(c => c.id === val);
    if (category) {
      onChange({
        categoryId: val,
        hasVariants: category.variant_support ? 'YES' : 'NO',
        inventoryMode: category.inventory_mode === 'serialized' ? 'Serialized' : 'Quantity'
      });
    }
  };

  const handleBrandChange = (val: string) => {
    onChange({ brand: val, series: '' });
    setIsAddingNewSeries(false);
    setNewSeriesValue("");
  };

  const saveNewSeries = () => {
    if (newSeriesValue.trim()) {
      // Typically we'd save this to the DB here or later
      onChange({ series: newSeriesValue.trim() }); // using series ID or name depending on the flow
    }
    setIsAddingNewSeries(false);
  };

  return (
    <div className="space-y-6">
      


      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Select the core categorization for this product.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">

          
          <div className="space-y-2">
             <label className="text-sm font-medium">Status</label>
             <Select value={data.status} onValueChange={(val: any) => onChange({ status: val })}>
               <SelectTrigger>
                 <SelectValue />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="Draft">Draft</SelectItem>
                 <SelectItem value="Active">Active</SelectItem>
                 <SelectItem value="Archived">Archived</SelectItem>
               </SelectContent>
             </Select>
          </div>

          <div className="space-y-2 border-t pt-4 md:col-span-2 md:border-none md:pt-0" />

          <div className="space-y-2">
            <label className="text-sm font-medium">Category Group <span className="text-red-500">*</span></label>
            <Select value={data.categoryGroupId} onValueChange={handleGroupChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Group">
                  {data.categoryGroupId ? (groups.find(g => g.id === data.categoryGroupId)?.name || 'Loading...') : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {groups.map(g => (
                  <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category <span className="text-red-500">*</span></label>
            <Select value={data.categoryId} onValueChange={handleCategoryChange} disabled={!data.categoryGroupId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category">
                  {data.categoryId ? (availableCategories.find(c => c.id === data.categoryId)?.name || 'Loading...') : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Brand <span className="text-red-500">*</span></label>
            <Select value={data.brand} onValueChange={handleBrandChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Brand">
                  {data.brand ? (brands.find(b => b.id === data.brand)?.name || 'Loading...') : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {brands.map(b => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex justify-between">
              Series (Optional)
              {!isAddingNewSeries && data.brand && (
                <button 
                  type="button" 
                  onClick={() => setIsAddingNewSeries(true)}
                  className="text-xs text-blue-600 hover:underline flex items-center"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add New
                </button>
              )}
            </label>
            
            {!data.brand ? (
              <Input disabled placeholder="Select Brand first" className="bg-slate-50" />
            ) : isAddingNewSeries ? (
              <div className="flex gap-2">
                <Input 
                  value={newSeriesValue} 
                  onChange={e => setNewSeriesValue(e.target.value)} 
                  placeholder="Enter new series name" 
                  autoFocus
                />
                <Button variant="outline" size="icon" onClick={() => setIsAddingNewSeries(false)}>
                  <X className="w-4 h-4 text-slate-500" />
                </Button>
                <Button size="sm" onClick={saveNewSeries}>Add</Button>
              </div>
            ) : (
              <Select value={data.series} onValueChange={(val) => onChange({ series: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Series">
                    {data.series === 'none' ? 'No predefined series' : (availableSeries.find(s => s.id === data.series)?.name || data.series || undefined)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableSeries.length === 0 && !data.series && (
                    <SelectItem value="none" disabled>No predefined series</SelectItem>
                  )}
                  {data.series && !availableSeries.find(s => s.id === data.series) && (
                    <SelectItem value={data.series}>{data.series}</SelectItem>
                  )}
                  {availableSeries.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Model Name <span className="text-red-500">*</span></label>
            <textarea 
              rows={3}
              value={data.modelName} 
              onChange={(e) => onChange({ modelName: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-y"
              placeholder="e.g. ThinkPad T480" 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
