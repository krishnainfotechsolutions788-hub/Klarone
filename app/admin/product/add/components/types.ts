export type InventoryMode = 'Serialized' | 'Quantity';

export interface CategoryData {
  id: string;
  name: string;
  hasVariants: 'YES' | 'NO' | 'OPTIONAL';
  inventoryMode: InventoryMode;
  templateId: string;
}

export interface CategoryGroupData {
  id: string;
  name: string;
  categories: CategoryData[];
}

export interface PimAttributeOption {
  id: string;
  label: string;
  value: string;
}

export interface PimAttribute {
  id: string;
  name: string;
  slug: string;
  dataType: 'Text' | 'Textarea' | 'Number' | 'Decimal' | 'Boolean' | 'Date' | 'Dropdown' | 'Multi Select' | 'Color' | 'URL' | 'Image';
  unit?: string;
  options?: PimAttributeOption[];
}

export interface PimTemplateAttribute {
  id: string;
  attributeId: string;
  groupId: string | null;
  isRequired: boolean;
  attribute: PimAttribute;
}

export interface PimAttributeGroup {
  id: string;
  name: string;
  templateAttributes: PimTemplateAttribute[];
}

export interface PimTemplate {
  id: string;
  name: string;
  groups: PimAttributeGroup[];
}

export interface ProductBasicInfo {
  productCode: string;
  categoryGroupId: string;
  categoryId: string;
  brand: string;
  series: string; // Optional
  modelName: string;
  shortDescription: string;
  description: string;
  status: 'Draft' | 'Active' | 'Archived';
  hasVariants: 'YES' | 'NO'; // Resolved
  inventoryMode: InventoryMode; // Resolved
}

export interface ProductImage {
  id: string;
  url: string;
  file?: File;
  type: 'Primary' | 'Gallery';
}

export interface ProductSpecification {
  fieldId: string;
  value: string | string[] | boolean | number;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  attributes: Record<string, string>; // e.g., { 'Processor': 'i7', 'RAM': '16GB' }
  images: ProductImage[];
  basePrice: number;
  sellingPrice: number;
  costPrice?: number;
  discount?: number;
  taxClass: string;
  status: 'Active' | 'Inactive' | 'Discontinued';
}

export interface SerializedUnit {
  id: string;
  serialNumber: string;
  assetCode: string;
  conditionGrade: string;
  batteryHealth?: string;
  purchasePrice: number;
  sellingPrice: number;
  rentalPrice?: number;
  supplier: string;
  purchaseDate: string;
  warrantyExpiry: string;
  currentStatus: 'Available' | 'Reserved' | 'Sold' | 'Rented' | 'Testing' | 'Repair' | 'Returned' | 'Scrapped';
  warehouse: string;
  shelfLocation: string;
  notes: string;
  images: ProductImage[];
}

export interface QuantityInventory {
  currentQuantity: number;
  minimumStock: number;
  reorderLevel: number;
  purchasePrice: number;
  sellingPrice: number;
  rentalPrice?: number;
  supplier: string;
  warehouse: string;
  shelfLocation: string;
}

export interface AddProductState {
  basicInfo: ProductBasicInfo;
  images: ProductImage[];
  specifications: ProductSpecification[];
  variants: ProductVariant[];
  serializedInventory: SerializedUnit[];
  quantityInventory: QuantityInventory | null;
}

export interface SpecTemplate {
  id: string;
  name: string;
  fields: {
    id: string;
    name: string;
    type: string;
    options?: string[];
  }[];
}
