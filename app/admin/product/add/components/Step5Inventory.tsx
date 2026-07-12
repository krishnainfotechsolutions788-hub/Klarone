import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InventoryMode, SerializedUnit, QuantityInventory } from './types';
import { Plus, Trash2, Copy, FileDown } from 'lucide-react';

interface Step5InventoryProps {
  inventoryMode: InventoryMode;
  serializedData: SerializedUnit[];
  quantityData: QuantityInventory | null;
  onSerializedChange: (updates: SerializedUnit[]) => void;
  onQuantityChange: (updates: QuantityInventory) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const MOCK_WAREHOUSES = ["Main Warehouse - Bangalore", "Store - Koramangala", "Transit"];

export function Step5Inventory({ 
  inventoryMode, 
  serializedData, 
  quantityData, 
  onSerializedChange, 
  onQuantityChange 
}: Step5InventoryProps) {

  // --- Serialized Handlers ---
  const addSerializedUnit = () => {
    const newUnit: SerializedUnit = {
      id: generateId(),
      serialNumber: '',
      assetCode: '',
      conditionGrade: 'A+',
      purchasePrice: 0,
      sellingPrice: 0,
      rentalPrice: 0,
      supplier: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      warrantyExpiry: '',
      currentStatus: 'Available',
      warehouse: MOCK_WAREHOUSES[0],
      shelfLocation: '',
      notes: '',
      images: []
    };
    onSerializedChange([...serializedData, newUnit]);
  };

  const duplicateUnit = (unit: SerializedUnit) => {
    const duplicated = {
      ...unit,
      id: generateId(),
      serialNumber: `${unit.serialNumber}-COPY`,
      assetCode: `${unit.assetCode}-COPY`
    };
    onSerializedChange([...serializedData, duplicated]);
  };

  const deleteUnit = (id: string) => {
    onSerializedChange(serializedData.filter(u => u.id !== id));
  };

  const updateUnit = (id: string, field: keyof SerializedUnit, value: any) => {
    onSerializedChange(serializedData.map(u => u.id === id ? { ...u, [field]: value } : u));
  };

  // --- Quantity Handlers ---
  const updateQuantity = (field: keyof QuantityInventory, value: any) => {
    const current = quantityData || {
      currentQuantity: 0,
      minimumStock: 0,
      reorderLevel: 0,
      purchasePrice: 0,
      sellingPrice: 0,
      supplier: '',
      warehouse: MOCK_WAREHOUSES[0],
      shelfLocation: ''
    };
    onQuantityChange({ ...current, [field]: value });
  };


  if (inventoryMode === 'Quantity') {
    const q = quantityData || {
      currentQuantity: 0,
      minimumStock: 0,
      reorderLevel: 0,
      purchasePrice: 0,
      sellingPrice: 0,
      supplier: '',
      warehouse: MOCK_WAREHOUSES[0],
      shelfLocation: ''
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quantity Inventory</CardTitle>
            <CardDescription>Manage stock levels for this product. No individual serial numbers tracked.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Quantity <span className="text-red-500">*</span></label>
              <Input type="number" value={q.currentQuantity} onChange={e => updateQuantity('currentQuantity', parseInt(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum Stock</label>
              <Input type="number" value={q.minimumStock} onChange={e => updateQuantity('minimumStock', parseInt(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Reorder Level</label>
              <Input type="number" value={q.reorderLevel} onChange={e => updateQuantity('reorderLevel', parseInt(e.target.value) || 0)} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Purchase Price <span className="text-red-500">*</span></label>
              <Input type="number" value={q.purchasePrice} onChange={e => updateQuantity('purchasePrice', parseFloat(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Selling Price <span className="text-red-500">*</span></label>
              <Input type="number" value={q.sellingPrice} onChange={e => updateQuantity('sellingPrice', parseFloat(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Rental Price</label>
              <Input type="number" value={q.rentalPrice || ''} onChange={e => updateQuantity('rentalPrice', parseFloat(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Supplier</label>
              <Input value={q.supplier} onChange={e => updateQuantity('supplier', e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Warehouse</label>
              <Select value={q.warehouse} onValueChange={v => updateQuantity('warehouse', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MOCK_WAREHOUSES.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Shelf / Rack Location</label>
              <Input value={q.shelfLocation} onChange={e => updateQuantity('shelfLocation', e.target.value)} placeholder="e.g. A1-Rack-02" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // SERIALIZED MODE
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Serialized Inventory</h2>
          <p className="text-sm text-slate-500">Track individual physical units with unique serial numbers.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <FileDown className="w-4 h-4" /> Bulk Import
          </Button>
          <Button onClick={addSerializedUnit} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Unit
          </Button>
        </div>
      </div>

      {serializedData.length === 0 ? (
        <Card>
          <CardContent className="py-12 flex flex-col items-center justify-center text-slate-500 gap-4">
            <p>No units added yet.</p>
            <Button onClick={addSerializedUnit} variant="outline">Add First Unit</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {serializedData.map((unit, i) => (
            <Card key={unit.id} className="relative overflow-visible border-l-4 border-l-blue-500">
              <div className="absolute -top-3 -right-3 flex gap-2">
                <Button size="icon" variant="outline" className="h-8 w-8 bg-white hover:bg-slate-50 rounded-full shadow-sm text-slate-500 hover:text-blue-600" onClick={() => duplicateUnit(unit)}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="outline" className="h-8 w-8 bg-white hover:bg-red-50 rounded-full shadow-sm text-slate-500 hover:text-red-600" onClick={() => deleteUnit(unit.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-md">UNIT #{i+1}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Serial Number *</label>
                    <Input value={unit.serialNumber} onChange={e => updateUnit(unit.id, 'serialNumber', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Asset Code</label>
                    <Input value={unit.assetCode} onChange={e => updateUnit(unit.id, 'assetCode', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Current Status</label>
                    <Select value={unit.currentStatus} onValueChange={(val: any) => updateUnit(unit.id, 'currentStatus', val)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Reserved">Reserved</SelectItem>
                        <SelectItem value="Sold">Sold</SelectItem>
                        <SelectItem value="Rented">Rented</SelectItem>
                        <SelectItem value="Testing">Testing</SelectItem>
                        <SelectItem value="Repair">Repair</SelectItem>
                        <SelectItem value="Returned">Returned</SelectItem>
                        <SelectItem value="Scrapped">Scrapped</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Condition Grade</label>
                  <Input value={unit.conditionGrade} onChange={e => updateUnit(unit.id, 'conditionGrade', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Battery Health</label>
                  <Input value={unit.batteryHealth || ''} onChange={e => updateUnit(unit.id, 'batteryHealth', e.target.value)} placeholder="e.g. 98%" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Purchase Price</label>
                  <Input type="number" value={unit.purchasePrice} onChange={e => updateUnit(unit.id, 'purchasePrice', parseFloat(e.target.value))} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Selling Price</label>
                  <Input type="number" value={unit.sellingPrice} onChange={e => updateUnit(unit.id, 'sellingPrice', parseFloat(e.target.value))} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Rental Price (Opt)</label>
                  <Input type="number" value={unit.rentalPrice || ''} onChange={e => updateUnit(unit.id, 'rentalPrice', parseFloat(e.target.value))} />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Warehouse</label>
                  <Select value={unit.warehouse} onValueChange={v => updateUnit(unit.id, 'warehouse', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {MOCK_WAREHOUSES.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Shelf Location</label>
                  <Input value={unit.shelfLocation} onChange={e => updateUnit(unit.id, 'shelfLocation', e.target.value)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
