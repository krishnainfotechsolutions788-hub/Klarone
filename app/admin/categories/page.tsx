"use client";

import { useRouter } from "next/navigation";
import { Search, Filter, MoreHorizontal, ChevronDown, Plus, Tags, Box, Database, Tag, Loader2, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StatCard from "../components/StatCard";
import { Pagination } from "../components/Pagination";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CategoriesPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState({ totalCategories: 0, activeCategories: 0, totalProducts: 0, totalInventoryUnits: 0 });

  // Add/Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryGroups, setCategoryGroups] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    group_id: '',
    inventory_mode: 'serialized',
    variant_support: false,
    template_id: '',
    status: 'active'
  });

  const supabase = createClient();

  // Generate slug from name
  useEffect(() => {
    if (!editingCategory && formData.name) {
      setFormData(prev => ({
        ...prev,
        slug: prev.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      }));
    }
  }, [formData.name, editingCategory]);

  const loadDependencies = async () => {
    try {
      const [{ data: groupsData }, { data: templatesData }] = await Promise.all([
        supabase.from('category_groups').select('id, name').order('name'),
        supabase.from('specification_templates').select('id, name').order('name')
      ]);
      if (groupsData) setCategoryGroups(groupsData);
      if (templatesData) setTemplates(templatesData);
    } catch (error) {
      console.error("Error loading dependencies", error);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await supabase
      .from('categories')
      .select(`
        id, 
        name, 
        slug,
        status,
        inventory_mode,
        group_id,
        variant_support,
        template_id,
        product_models (
          id,
          product_variants (
            inventory_units ( quantity )
          )
        )
      `, { count: 'exact' })
      .range(from, to)
      .order('name');

    if (error) {
      console.error("Supabase fetch categories error:", error);
    }

    if (!error && data) {
      setCategories(data);
      setTotalCount(count || 0);

      let tProds = 0;
      let tUnits = 0;
      let tActive = 0;
      
      data.forEach(c => {
        if (c.status === 'active') tActive++;
        if (c.product_models) {
           tProds += c.product_models.length;
           c.product_models.forEach((pm: any) => {
             if (pm.product_variants) {
               pm.product_variants.forEach((pv: any) => {
                 if (pv.inventory_units) {
                   tUnits += pv.inventory_units.reduce((acc: number, u: any) => acc + (u.quantity || 1), 0);
                 }
               });
             }
           });
        }
      });
      
      setStats({
         totalCategories: count || 0,
         activeCategories: tActive,
         totalProducts: tProds,
         totalInventoryUnits: tUnits
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
    loadDependencies();
  }, [page]);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      group_id: categoryGroups.length > 0 ? categoryGroups[0].id : '',
      inventory_mode: 'serialized',
      variant_support: false,
      template_id: '',
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      group_id: category.group_id || '',
      inventory_mode: category.inventory_mode || 'serialized',
      variant_support: category.variant_support || false,
      template_id: category.template_id || '',
      status: category.status || 'active'
    });
    setIsModalOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!formData.name || !formData.group_id) {
      alert("Name and Group are required.");
      return;
    }

    setIsSaving(true);
    
    const payload = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      group_id: formData.group_id,
      inventory_mode: formData.inventory_mode,
      variant_support: formData.variant_support,
      template_id: formData.template_id || null,
      status: formData.status
    };

    try {
      if (editingCategory) {
        const { error } = await supabase.from('categories').update(payload).eq('id', editingCategory.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('categories').insert([payload]);
        if (error) throw error;
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (e: any) {
      console.error("Save error:", e);
      alert(`Error saving category: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-10">
      
      {/* Aggregate Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Categories"
          icon={Tags}
          primaryValue={stats.totalCategories}
          primaryLabel="Categories"
        />
        <StatCard
          title="Active Categories"
          icon={Tags}
          primaryValue={stats.activeCategories}
          primaryLabel="Enabled"
        />
        <StatCard
          title="Page Products"
          icon={Tag}
          primaryValue={stats.totalProducts}
          primaryLabel="Models"
        />
        <StatCard
          title="Page Inventory"
          icon={Database}
          primaryValue={stats.totalInventoryUnits}
          primaryLabel="Units in Stock"
        />
      </div>

      {/* Main Table Card */}
      <Card className="border-[#dddddd] shadow-none rounded-[10px] overflow-hidden flex flex-col gap-0 p-0">
        
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-[#dddddd] bg-white gap-4">
          <div className="relative w-full sm:w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9297a0]" />
            <input 
              type="text" 
              placeholder="Search categories..." 
              className="w-full h-9 pl-9 pr-4 bg-[#f8fafc] border border-[#dddddd] rounded-[6px] text-[13px] text-[#181d26] outline-none focus:border-[#1b61c9] transition-colors placeholder:text-[#9297a0]"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" className="h-9 px-3 rounded-[6px] border-[#dddddd] text-[#181d26] text-[13px] hover:bg-[#f8fafc] shadow-none flex items-center gap-1.5">
              Bulk Actions <ChevronDown className="w-3.5 h-3.5 text-[#9297a0]" />
            </Button>
            <Button variant="outline" className="h-9 px-3 rounded-[6px] border-[#dddddd] text-[#181d26] text-[13px] hover:bg-[#f8fafc] shadow-none flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              Filters
            </Button>
            <Button onClick={handleOpenAdd} className="h-9 px-4 rounded-[6px] bg-[#181d26] hover:bg-[#0d1218] text-white text-[13px] font-medium shadow-none flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Add Category
            </Button>
          </div>
        </div>

        {/* Table Content */}
        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[550px]">
            <Table>
              <TableHeader className="bg-[#f8fafc] [&_tr]:border-b-[#dddddd]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[40px] px-4 py-3"><Checkbox className="border-[#dddddd] data-[state=checked]:bg-[#181d26] data-[state=checked]:border-[#181d26]" /></TableHead>
                  <TableHead className="font-medium text-[#41454d] text-[12px] uppercase tracking-wider py-3">Category Name</TableHead>
                  <TableHead className="font-medium text-[#41454d] text-[12px] uppercase tracking-wider py-3">Slug</TableHead>
                  <TableHead className="font-medium text-[#41454d] text-[12px] uppercase tracking-wider py-3 text-right">Products</TableHead>
                  <TableHead className="font-medium text-[#41454d] text-[12px] uppercase tracking-wider py-3 text-right">Total Units</TableHead>
                  <TableHead className="font-medium text-[#41454d] text-[12px] uppercase tracking-wider py-3">Status</TableHead>
                  <TableHead className="w-[50px] py-3"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-[#9297a0]">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-[#1b61c9]" />
                        <p>Loading categories...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-[#9297a0]">No categories found.</TableCell>
                  </TableRow>
                ) : categories.map((category) => {
                  let catTotalUnits = 0;
                  const catProducts = category.product_models ? category.product_models.length : 0;
                  
                  if (category.product_models) {
                    category.product_models.forEach((pm: any) => {
                       if (pm.product_variants) {
                         pm.product_variants.forEach((pv: any) => {
                           if (pv.inventory_units) {
                             catTotalUnits += pv.inventory_units.reduce((acc: number, cur: any) => acc + (cur.quantity || 1), 0);
                           }
                         });
                       }
                    });
                  }
                  
                  return (
                    <TableRow key={category.id} className="border-b-[#dddddd] hover:bg-[#f8fafc] transition-colors group">
                      <TableCell className="px-4 py-3">
                        <Checkbox className="border-[#dddddd] data-[state=checked]:bg-[#181d26] data-[state=checked]:border-[#181d26]" />
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-[6px] bg-[#f0f2f5] border border-[#dddddd] flex items-center justify-center shrink-0">
                            <Tags className="w-5 h-5 text-[#9297a0]" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[14px] font-medium text-[#181d26] group-hover:text-[#1b61c9] transition-colors">{category.name}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-[13px] text-[#41454d]">
                        {category.slug || '-'}
                      </TableCell>
                      <TableCell className="py-3 text-[13px] text-[#41454d] text-right font-medium">
                        {catProducts}
                      </TableCell>
                      <TableCell className="py-3 text-[13px] text-[#41454d] text-right font-medium">
                        {catTotalUnits}
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge variant="outline" className={`text-[11px] ${category.status === 'active' ? 'bg-[#e6f4ea] text-[#137333] border-[#ceead6]' : category.status === 'draft' ? 'bg-[#fef3c7] text-[#d97706] border-[#fde68a]' : 'bg-[#fce8e6] text-[#c5221f] border-[#fad2cf]'}`}>
                          {category.status ? category.status.charAt(0).toUpperCase() + category.status.slice(1) : 'Active'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 text-right px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-[6px] h-8 w-8 p-0 text-[#9297a0] hover:text-[#181d26] hover:bg-[#f0f2f5] outline-none transition-colors">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem onClick={() => handleOpenEdit(category)} className="text-[13px] cursor-pointer"><Edit className="w-4 h-4 mr-2"/> Edit Category</DropdownMenuItem>
                            <DropdownMenuItem className="text-[13px] text-[#c5221f] focus:text-[#c5221f] cursor-pointer"><Trash className="w-4 h-4 mr-2"/> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <div className="border-t border-[#dddddd]">
          <Pagination 
            currentPage={page} 
            totalPages={Math.ceil(totalCount / pageSize) || 1} 
            onPageChange={setPage}
            totalItems={totalCount}
            itemsPerPage={pageSize}
          />
        </div>
      </Card>
      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
            <DialogDescription>
              {editingCategory ? 'Update category details and configuration.' : 'Create a new product category.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            
            <div className="grid gap-2">
              <Label htmlFor="name">Category Name <span className="text-red-500">*</span></Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                placeholder="e.g. Laptops"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input 
                id="slug" 
                value={formData.slug} 
                onChange={(e) => setFormData({...formData, slug: e.target.value})} 
                placeholder="laptops"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Category Group <span className="text-red-500">*</span></Label>
                <Select value={formData.group_id || ""} onValueChange={(v) => setFormData({...formData, group_id: v || ""})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Group" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryGroups.map(g => (
                      <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Inventory Mode</Label>
                <Select value={formData.inventory_mode} onValueChange={(v) => setFormData({...formData, inventory_mode: v || ""})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="serialized">Serialized (Unique ID per unit)</SelectItem>
                    <SelectItem value="quantity">Quantity (Bulk)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>PIM Template</Label>
                <Select value={formData.template_id || ""} onValueChange={(v) => setFormData({...formData, template_id: v || ""})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None (No Specs)</SelectItem>
                    {templates.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v || ""})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch 
                id="variant-support" 
                checked={formData.variant_support}
                onCheckedChange={(c) => setFormData({...formData, variant_support: c})}
              />
              <Label htmlFor="variant-support">Supports Variants (e.g. Color, Storage Size options)</Label>
            </div>

          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCategory} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Save Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
