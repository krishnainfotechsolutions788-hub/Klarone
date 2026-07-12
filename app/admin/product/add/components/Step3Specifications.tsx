import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ProductSpecification, PimTemplate } from './types';
import { Loader2 } from "lucide-react";
import { createClient } from '@/lib/supabase/client';

interface Step3SpecificationsProps {
  categoryId: string;
  categoryGroupId: string;
  data: ProductSpecification[];
  onChange: (updates: ProductSpecification[]) => void;
}

export function Step3Specifications({ categoryId, categoryGroupId, data, onChange }: Step3SpecificationsProps) {
  
  const [template, setTemplate] = useState<PimTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadTemplate() {
      if (!categoryId) return;
      setIsLoading(true);
      try {
        const supabase = createClient();
        
        // Find category's template
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('template_id')
          .eq('id', categoryId)
          .single();
          
        if (catError || !catData?.template_id) {
          setTemplate(null);
          return;
        }

        const templateId = catData.template_id;

        // Fetch template details
        const { data: tplData, error: tplError } = await supabase
          .from('specification_templates')
          .select('id, name')
          .eq('id', templateId)
          .single();

        // Fetch groups
        const { data: groupsData } = await supabase
          .from('attribute_groups')
          .select('*')
          .eq('template_id', templateId)
          .order('display_order', { ascending: true });

        // Fetch template_attributes linked to this template
        const { data: tplAttrsData } = await supabase
          .from('template_attributes')
          .select('*, attribute:attributes(*)')
          .eq('template_id', templateId)
          .order('display_order', { ascending: true });

        // Fetch options for all attributes
        const attrIds = tplAttrsData?.map(ta => ta.attribute_id) || [];
        const { data: optionsData } = await supabase
          .from('attribute_options')
          .select('*')
          .in('attribute_id', attrIds.length > 0 ? attrIds : ['00000000-0000-0000-0000-000000000000'])
          .order('display_order', { ascending: true });

        // Assemble PIM Template structure
        if (tplData) {
          const assembledGroups = (groupsData || []).map(g => {
            const groupAttrs = (tplAttrsData || [])
              .filter(ta => ta.group_id === g.id)
              .map(ta => {
                const attrOpts = (optionsData || []).filter(o => o.attribute_id === ta.attribute_id);
                return {
                  id: ta.id,
                  attributeId: ta.attribute_id,
                  groupId: ta.group_id,
                  isRequired: ta.is_required,
                  attribute: {
                    id: ta.attribute.id,
                    name: ta.attribute.name,
                    slug: ta.attribute.slug,
                    dataType: ta.attribute.data_type,
                    unit: ta.attribute.unit,
                    options: attrOpts.map(o => ({
                      id: o.id,
                      label: o.label,
                      value: o.value
                    }))
                  }
                };
              });

            return {
              id: g.id,
              name: g.name,
              templateAttributes: groupAttrs
            };
          });

          // Also handle attributes with no group (if any)
          const ungroupedAttrs = (tplAttrsData || [])
            .filter(ta => !ta.group_id)
            .map(ta => {
               const attrOpts = (optionsData || []).filter(o => o.attribute_id === ta.attribute_id);
               return {
                  id: ta.id,
                  attributeId: ta.attribute_id,
                  groupId: null,
                  isRequired: ta.is_required,
                  attribute: {
                    id: ta.attribute.id,
                    name: ta.attribute.name,
                    slug: ta.attribute.slug,
                    dataType: ta.attribute.data_type,
                    unit: ta.attribute.unit,
                    options: attrOpts.map(o => ({
                      id: o.id,
                      label: o.label,
                      value: o.value
                    }))
                  }
                };
            });

          if (ungroupedAttrs.length > 0) {
            assembledGroups.push({
              id: 'ungrouped',
              name: 'Other Specifications',
              templateAttributes: ungroupedAttrs
            });
          }

          setTemplate({
            id: tplData.id,
            name: tplData.name,
            groups: assembledGroups
          });
        }
      } catch (err) {
        console.error("Failed to load specification template", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadTemplate();
  }, [categoryId]);

  // Pre-fill data if template changes and data is empty
  useEffect(() => {
    if (template && data.length === 0) {
      let initialData: ProductSpecification[] = [];
      template.groups.forEach(g => {
        g.templateAttributes.forEach(ta => {
          initialData.push({
            fieldId: ta.attributeId,
            value: ta.attribute.dataType === 'Boolean' ? false : ''
          });
        });
      });
      onChange(initialData);
    }
  }, [template, data.length, onChange]);

  const handleChange = (fieldId: string, value: any) => {
    const existingIndex = data.findIndex(d => d.fieldId === fieldId);
    if (existingIndex >= 0) {
      const newData = [...data];
      newData[existingIndex] = { ...newData[existingIndex], value };
      onChange(newData);
    } else {
      onChange([...data, { fieldId, value }]);
    }
  };

  const getValue = (fieldId: string) => {
    return data.find(d => d.fieldId === fieldId)?.value ?? '';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-20 flex flex-col items-center justify-center text-slate-500 gap-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p>Loading Specification Template...</p>
        </CardContent>
      </Card>
    );
  }

  if (!template) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-slate-500">
          Please select a Category in Step 1 to load the specification template.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Technical Specifications</CardTitle>
          <CardDescription>Fill out the specific attributes for {template.name}.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {template.groups.map(group => (
            <div key={group.id} className="space-y-4">
              <h3 className="font-semibold text-slate-800 border-b pb-2">{group.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.templateAttributes.map(ta => {
                  const field = ta.attribute;
                  const val = getValue(field.id);
                  
                  return (
                    <div key={field.id} className="space-y-2">
                      <label className="text-sm font-medium">
                        {field.name}
                        {ta.isRequired && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      
                      {field.dataType === 'Text' && (
                        <Input 
                          value={val as string} 
                          onChange={(e) => handleChange(field.id, e.target.value)} 
                          placeholder={`Enter ${field.name}`}
                        />
                      )}

                      {field.dataType === 'Textarea' && (
                        <Textarea 
                          value={val as string} 
                          onChange={(e) => handleChange(field.id, e.target.value)} 
                          placeholder={`Enter ${field.name}`}
                        />
                      )}
                      
                      {(field.dataType === 'Number' || field.dataType === 'Decimal') && (
                        <Input 
                          type="number"
                          value={val as string} 
                          onChange={(e) => handleChange(field.id, e.target.value)} 
                          placeholder={`0`}
                        />
                      )}
                      
                      {field.dataType === 'Dropdown' && field.options && (
                        <Select value={val as string} onValueChange={(v) => handleChange(field.id, v)}>
                          <SelectTrigger>
                            <SelectValue placeholder={`Select ${field.name}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options.map(opt => (
                              <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      
                      {field.dataType === 'Boolean' && (
                        <div className="flex items-center h-10 border rounded-md px-3 bg-white">
                          <Switch 
                            checked={val as boolean} 
                            onCheckedChange={(c) => handleChange(field.id, c)} 
                          />
                          <span className="ml-3 text-sm text-slate-600">
                            {val ? 'Yes' : 'No'}
                          </span>
                        </div>
                      )}

                      {field.unit && <span className="text-xs text-slate-500 block mt-1">{field.unit}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
