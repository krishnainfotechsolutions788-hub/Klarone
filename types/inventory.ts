export type InventoryType = 'SERIALIZED' | 'NON_SERIALIZED';
export type ItemStatus = 'active' | 'draft' | 'archived';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: ItemStatus;
}

export interface Product {
  id: string;
  category_id: string;
  brand: string;
  series: string;
  model_name: string;
  slug: string;
  description?: string;
  thumbnail_image?: string;
  inventory_type: InventoryType;
  base_price?: number;
  rental_price?: number;
  specifications?: Record<string, Record<string, string | string[]>>;
  status: ItemStatus;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  cpu?: string;
  ram?: string;
  ssd?: string;
  gpu?: string;
  color?: string;
  screen_size?: string;
  touch_screen?: boolean;
  base_price: number;
  rental_price?: number;
  status: ItemStatus;
  created_at: string;
  updated_at: string;
}

export type ConditionGrade = 'new' | 'open_box' | 'refurbished_a' | 'refurbished_b' | 'refurbished_c';
export type InventoryStatus = 'available' | 'reserved' | 'sold' | 'rented' | 'under_inspection' | 'repair' | 'returned' | 'scrapped';

// Only used when inventory_type = SERIALIZED
export interface InventoryUnit {
  id: string;
  product_id: string;
  variant_id?: string;
  inventory_code: string;
  serial_number: string;
  battery_health?: number;
  condition_grade: ConditionGrade;
  purchase_price: number;
  selling_price: number;
  rental_price?: number;
  status: InventoryStatus;
  notes?: string;
  has_actual_photos?: boolean;
  created_at: string;
  updated_at: string;
}

// Only used when inventory_type = NON_SERIALIZED
export interface InventoryStock {
  id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  purchase_price: number;
  selling_price: number;
  reorder_level?: number;
  updated_at: string;
}

export type MovementActionType = 'Added' | 'Sold' | 'Returned' | 'Adjusted' | 'Transferred' | 'Rental Started' | 'Rental Ended' | 'Repair' | 'Scrapped';

export interface InventoryMovement {
  id: string;
  product_id: string;
  variant_id: string;
  inventory_type: InventoryType;
  action_type: MovementActionType;
  quantity: number;
  remarks?: string;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface VariantImage {
  id: string;
  variant_id: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface InventoryUnitImage {
  id: string;
  inventory_unit_id: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
  created_at: string;
}
