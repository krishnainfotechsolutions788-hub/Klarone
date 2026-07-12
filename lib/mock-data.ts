import { Category, Product, ProductVariant, InventoryUnit, InventoryStock, InventoryMovement, ProductImage, VariantImage, InventoryUnitImage } from '../types/inventory';

export const mockCategories: Category[] = [
  { id: 'cat_001', name: 'Laptop/Desktop', slug: 'laptop-desktop', status: 'active' },
  { id: 'cat_004', name: 'Accessories', slug: 'accessories', status: 'active' },
  { id: 'cat_006', name: 'CCTV Cameras', slug: 'cctv', status: 'active' },
];

export const mockProducts: Product[] = [
  {
    id: 'prod_001', category_id: 'cat_001', brand: 'Lenovo', series: 'ThinkPad', model_name: 'T480',
    slug: 'lenovo-thinkpad-t480', description: 'A robust business laptop.', inventory_type: 'SERIALIZED', status: 'active',
    specifications: {
      "Basic Info": { "Brand": "Lenovo", "Model Name": "IdeaPad Slim 3", "Screen Size": "15.3 Inches", "Colour": "Luna Grey | 16GB | 1TB", "Hard Disk Size": "1 TB", "CPU Model": "Core i7", "RAM Memory Installed Size": "16 GB", "Operating System": "Windows 11 Home", "Special Feature": "Anti Glare Coating, Backlit Keyboard, HD Audio", "Graphics Card Description": "Integrated" },
      "About this item": { "Processor": "Intel Core i7-13620H | Speed: 2.4 GHz (Base) - 4.9 GHz (Max)", "Display": "15.3\" FHD (1920x1200) | 300Nits Brightness | Anti Glare", "Memory and Storage": "8GB Soldered DDR5-4800 + 8GB SO-DIMM DDR5-4800 | 1TB SSD M.2", "OS and Software": "Windows 11 Home Single Language, English | Microsoft 365 Basic", "Camera": "FHD 1080p with Privacy Shutter", "Audio": "Stereo speakers, 2W x2, optimized with Dolby Audio" },
      "Additional details": { "Colour": "Luna Grey | 16GB | 1TB", "Hard Drive Size": "1 TB", "Operating System": "Windows 11 Home", "Other Special Features of the Product": "Anti Glare Coating, Backlit Keyboard, HD Audio", "Graphics Description": "Integrated", "Graphics Co Processor": "Intel UHD Graphics", "Item Weight": "1590 Grams" },
      "Display": { "Screen Size": "15.3 Inches", "Scanner Resolution": "1080p", "Native Resolution": "1920 x 1200 pixels", "Display Type": "LED" },
      "Connectivity": { "Network Connectivity Technology": "Bluetooth, HDMI, USB, Wi-Fi", "Wireless Technology": "Wi-Fi", "Bluetooth Version": "5.2" },
      "Input Devices": { "Human Interface Types": "Touch Pad", "Keyboard Description": "Backlit" },
      "Audio": { "Audio Output Type": "Headphones, Speakers", "Speaker Description": "User-facing stereo speakers, 2W x2" },
      "Processor": { "Processor Type": "Core i7", "Processor Speed": "2.4 GHz", "Processor Brand": "Intel", "CPU Model Generation": "13th Gen" },
      "Memory": { "RAM Memory Installed": "16 GB", "RAM Memory Technology": "DDR5", "Memory Speed": "4800 MHz" },
      "Battery": { "Battery Cell Type": "Lithium Polymer", "Battery Life": "5 Hours" }
    },
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_002', category_id: 'cat_001', brand: 'Dell', series: 'Latitude', model_name: '5410',
    slug: 'dell-latitude-5410', description: 'Small 14-inch business laptop.', inventory_type: 'SERIALIZED', status: 'active',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_003', category_id: 'cat_004', brand: 'Samsung', series: 'Pro', model_name: '990 Pro 1TB',
    slug: 'samsung-990-pro-1tb', description: 'PCIe 4.0 NVMe SSD.', inventory_type: 'NON_SERIALIZED', base_price: 9999, status: 'active',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  // --- New Products ---
  // Laptops
  {
    id: 'prod_004', category_id: 'cat_001', brand: 'Apple', series: 'MacBook Air', model_name: 'M1 2020',
    slug: 'apple-macbook-air-m1', description: 'Lightweight laptop with M1 chip.', inventory_type: 'SERIALIZED', status: 'active',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_005', category_id: 'cat_001', brand: 'HP', series: 'EliteBook', model_name: '840 G7',
    slug: 'hp-elitebook-840-g7', description: 'Premium business laptop.', inventory_type: 'SERIALIZED', status: 'active',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_006', category_id: 'cat_001', brand: 'Asus', series: 'ROG', model_name: 'Zephyrus G14',
    slug: 'asus-rog-g14', description: 'Gaming laptop with AMD Ryzen.', inventory_type: 'SERIALIZED', status: 'active',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  // Desktops
  {
    id: 'prod_007', category_id: 'cat_001', brand: 'Dell', series: 'OptiPlex', model_name: '7080 Micro',
    slug: 'dell-optiplex-7080-micro', description: 'Compact desktop PC.', inventory_type: 'SERIALIZED', status: 'active',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_008', category_id: 'cat_001', brand: 'Lenovo', series: 'ThinkCentre', model_name: 'M720q',
    slug: 'lenovo-thinkcentre-m720q', description: 'Tiny business desktop.', inventory_type: 'SERIALIZED', status: 'active',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_009', category_id: 'cat_001', brand: 'HP', series: 'EliteDesk', model_name: '800 G6 Mini',
    slug: 'hp-elitedesk-800-g6', description: 'Powerful mini PC.', inventory_type: 'SERIALIZED', status: 'active',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  // SSDs
  {
    id: 'prod_010', category_id: 'cat_004', brand: 'Crucial', series: 'P3', model_name: '500GB NVMe',
    slug: 'crucial-p3-500gb', description: 'Gen3 NVMe SSD.', inventory_type: 'NON_SERIALIZED', base_price: 3500, status: 'active',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_011', category_id: 'cat_004', brand: 'WD', series: 'Black', model_name: 'SN850X 2TB',
    slug: 'wd-black-sn850x-2tb', description: 'High performance gaming SSD.', inventory_type: 'NON_SERIALIZED', base_price: 16999, status: 'active',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_012', category_id: 'cat_004', brand: 'Kingston', series: 'A400', model_name: '240GB SATA',
    slug: 'kingston-a400-240gb', description: 'Reliable SATA SSD.', inventory_type: 'NON_SERIALIZED', base_price: 1500, status: 'active',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  // RAM
  {
    id: 'prod_013', category_id: 'cat_004', brand: 'Corsair', series: 'Vengeance LPX', model_name: '16GB (2x8GB) DDR4',
    slug: 'corsair-vengeance-16gb-ddr4', description: 'Performance desktop memory.', inventory_type: 'NON_SERIALIZED', base_price: 3800, status: 'active',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_014', category_id: 'cat_004', brand: 'Crucial', series: 'Basics', model_name: '8GB DDR4 Laptop RAM',
    slug: 'crucial-8gb-ddr4-laptop', description: 'Standard SO-DIMM memory.', inventory_type: 'NON_SERIALIZED', base_price: 1800, status: 'active',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_015', category_id: 'cat_004', brand: 'G.Skill', series: 'Trident Z5 RGB', model_name: '32GB DDR5',
    slug: 'gskill-trident-z5-32gb', description: 'Premium DDR5 memory.', inventory_type: 'NON_SERIALIZED', base_price: 12500, status: 'active',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  // CCTV
  {
    id: 'prod_016', category_id: 'cat_006', brand: 'Hikvision', series: 'Value Series', model_name: '2MP Dome Camera',
    slug: 'hikvision-2mp-dome', description: 'Indoor dome camera.', inventory_type: 'NON_SERIALIZED', base_price: 1200, status: 'active',
    specifications: {
      "Basic Info": { "Recommended Uses For Product": "Outdoor Security, Indoor Security", "Brand": "Qubo", "Connectivity Technology": "Wired, Wireless", "Special Feature": "2 Way Audio, HD Resolution, Motion Sensor, Night Vision", "Indoor/Outdoor Usage": "Indoor", "Compatible Devices": "Smartphone", "Power Source": "Corded Electric" },
      "Additional details": { "Other Special Features": "2 Way Audio, HD Resolution, Night Vision", "Installation Type": "Freestanding", "Enclosure Material": "Plastic", "Alert Type": "Motion Only", "Photo Sensor Resolution": "4 MP", "Control Method": "App" },
      "Power": { "Power Source": "Corded Electric", "Voltage": "12 Volts", "Wattage": "5 Watts", "Are Batteries Required": "No" },
      "Video": { "Number of Channels": "2", "Video Capture Format": "MPEG-4", "Night Vision": "Yes" }
    },
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_017', category_id: 'cat_006', brand: 'CP Plus', series: 'Cosmic', model_name: '4MP Bullet Camera',
    slug: 'cpplus-4mp-bullet', description: 'Outdoor bullet camera.', inventory_type: 'NON_SERIALIZED', base_price: 2100, status: 'active',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_018', category_id: 'cat_006', brand: 'Dahua', series: 'Cooper', model_name: '8-Channel DVR',
    slug: 'dahua-8ch-dvr', description: '8 channel digital video recorder.', inventory_type: 'NON_SERIALIZED', base_price: 3500, status: 'active',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  // Accessories & Networking
  {
    id: 'prod_019', category_id: 'cat_004', brand: 'Logitech', series: 'Master', model_name: 'MX Master 3S',
    slug: 'logitech-mx-master-3s', description: 'Advanced wireless mouse.', inventory_type: 'NON_SERIALIZED', base_price: 8995, status: 'active',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_020', category_id: 'cat_004', brand: 'Dell', series: 'UltraSharp', model_name: 'U2720Q',
    slug: 'dell-u2720q-monitor', description: '27-inch 4K USB-C monitor.', inventory_type: 'NON_SERIALIZED', base_price: 45000, status: 'active',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_021', category_id: 'cat_004', brand: 'Keychron', series: 'K2', model_name: 'Wireless Mechanical Keyboard',
    slug: 'keychron-k2', description: '75% layout mechanical keyboard.', inventory_type: 'NON_SERIALIZED', base_price: 7500, status: 'active',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_022', category_id: 'cat_007', brand: 'TP-Link', series: 'Archer', model_name: 'AX73 Wi-Fi 6 Router',
    slug: 'tplink-archer-ax73', description: 'Dual-band gigabit router.', inventory_type: 'NON_SERIALIZED', base_price: 8500, status: 'active',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  }
];

export const mockVariants: ProductVariant[] = [
  { id: 'var_001', product_id: 'prod_001', cpu: 'Intel Core i5 8th Gen', ram: '8GB', ssd: '256GB', touch_screen: false, base_price: 15999, rental_price: 1200, status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'var_002', product_id: 'prod_001', cpu: 'Intel Core i5 8th Gen', ram: '16GB', ssd: '512GB', touch_screen: false, base_price: 18999, rental_price: 1500, status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'var_003', product_id: 'prod_002', cpu: 'Intel Core i5 10th Gen', ram: '16GB', ssd: '256GB', touch_screen: true, base_price: 24999, rental_price: 2000, status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  // MacBook
  { id: 'var_004', product_id: 'prod_004', cpu: 'Apple M1', ram: '8GB', ssd: '256GB', touch_screen: false, base_price: 55000, rental_price: 3000, status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  // EliteBook
  { id: 'var_005', product_id: 'prod_005', cpu: 'Intel Core i7 10th Gen', ram: '16GB', ssd: '512GB', touch_screen: false, base_price: 35000, rental_price: 2500, status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  // Zephyrus
  { id: 'var_006', product_id: 'prod_006', cpu: 'AMD Ryzen 9', ram: '16GB', ssd: '1TB', gpu: 'RTX 3060', touch_screen: false, base_price: 85000, rental_price: 4500, status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  // OptiPlex
  { id: 'var_007', product_id: 'prod_007', cpu: 'Intel Core i5 10th Gen', ram: '16GB', ssd: '256GB', base_price: 20000, rental_price: 1500, status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  // ThinkCentre
  { id: 'var_008', product_id: 'prod_008', cpu: 'Intel Core i3 8th Gen', ram: '8GB', ssd: '256GB', base_price: 12000, rental_price: 1000, status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  // EliteDesk
  { id: 'var_009', product_id: 'prod_009', cpu: 'Intel Core i7 10th Gen', ram: '16GB', ssd: '512GB', base_price: 28000, rental_price: 2000, status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const mockUnits: InventoryUnit[] = [
  { id: 'unit_001', product_id: 'prod_001', variant_id: 'var_001', inventory_code: 'KLR-000001', serial_number: 'SN-T480-A01', condition_grade: 'refurbished_a', battery_health: 92, purchase_price: 10000, selling_price: 15999, rental_price: 1200, status: 'available', has_actual_photos: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'unit_002', product_id: 'prod_001', variant_id: 'var_001', inventory_code: 'KLR-000002', serial_number: 'SN-T480-A02', condition_grade: 'refurbished_b', battery_health: 84, purchase_price: 9000, selling_price: 14999, rental_price: 1000, status: 'available', has_actual_photos: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'unit_003', product_id: 'prod_001', variant_id: 'var_002', inventory_code: 'KLR-000003', serial_number: 'SN-T480-B01', condition_grade: 'refurbished_a', battery_health: 88, purchase_price: 12000, selling_price: 18999, rental_price: 1500, status: 'rented', has_actual_photos: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // MacBook
  { id: 'unit_004', product_id: 'prod_004', variant_id: 'var_004', inventory_code: 'KLR-000004', serial_number: 'C02F123456', condition_grade: 'open_box', battery_health: 100, purchase_price: 45000, selling_price: 55000, rental_price: 3000, status: 'available', has_actual_photos: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  // EliteBook
  { id: 'unit_005', product_id: 'prod_005', variant_id: 'var_005', inventory_code: 'KLR-000005', serial_number: '5CG123456', condition_grade: 'refurbished_a', battery_health: 95, purchase_price: 25000, selling_price: 35000, rental_price: 2500, status: 'available', has_actual_photos: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  // OptiPlex
  { id: 'unit_006', product_id: 'prod_007', variant_id: 'var_007', inventory_code: 'KLR-000006', serial_number: 'DP12345', condition_grade: 'refurbished_a', purchase_price: 15000, selling_price: 20000, rental_price: 1500, status: 'available', has_actual_photos: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const mockInventoryStock: InventoryStock[] = [
  // SSDs
  { id: 'stock_001', product_id: 'prod_003', quantity: 45, purchase_price: 8000, selling_price: 9999, reorder_level: 10, updated_at: new Date().toISOString() },
  { id: 'stock_002', product_id: 'prod_010', quantity: 120, purchase_price: 2800, selling_price: 3500, reorder_level: 20, updated_at: new Date().toISOString() },
  { id: 'stock_003', product_id: 'prod_011', quantity: 15, purchase_price: 14500, selling_price: 16999, reorder_level: 5, updated_at: new Date().toISOString() },
  { id: 'stock_004', product_id: 'prod_012', quantity: 80, purchase_price: 1100, selling_price: 1500, reorder_level: 25, updated_at: new Date().toISOString() },
  // RAM
  { id: 'stock_005', product_id: 'prod_013', quantity: 30, purchase_price: 3100, selling_price: 3800, reorder_level: 10, updated_at: new Date().toISOString() },
  { id: 'stock_006', product_id: 'prod_014', quantity: 65, purchase_price: 1300, selling_price: 1800, reorder_level: 15, updated_at: new Date().toISOString() },
  { id: 'stock_007', product_id: 'prod_015', quantity: 10, purchase_price: 10500, selling_price: 12500, reorder_level: 3, updated_at: new Date().toISOString() },
  // CCTV
  { id: 'stock_008', product_id: 'prod_016', quantity: 40, purchase_price: 900, selling_price: 1200, reorder_level: 10, updated_at: new Date().toISOString() },
  { id: 'stock_009', product_id: 'prod_017', quantity: 25, purchase_price: 1600, selling_price: 2100, reorder_level: 8, updated_at: new Date().toISOString() },
  { id: 'stock_010', product_id: 'prod_018', quantity: 8, purchase_price: 2800, selling_price: 3500, reorder_level: 2, updated_at: new Date().toISOString() },
  // Accessories
  { id: 'stock_011', product_id: 'prod_019', quantity: 12, purchase_price: 7500, selling_price: 8995, reorder_level: 4, updated_at: new Date().toISOString() },
  { id: 'stock_012', product_id: 'prod_020', quantity: 5, purchase_price: 40000, selling_price: 45000, reorder_level: 2, updated_at: new Date().toISOString() },
  { id: 'stock_013', product_id: 'prod_021', quantity: 18, purchase_price: 6000, selling_price: 7500, reorder_level: 5, updated_at: new Date().toISOString() },
  { id: 'stock_014', product_id: 'prod_022', quantity: 20, purchase_price: 7000, selling_price: 8500, reorder_level: 6, updated_at: new Date().toISOString() },
];

export const mockProductImages: ProductImage[] = [
  { id: 'img_prod_001', product_id: 'prod_001', image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80', alt_text: 'Lenovo ThinkPad Front', sort_order: 1, is_primary: true, created_at: new Date().toISOString() },
  { id: 'img_prod_001_2', product_id: 'prod_001', image_url: 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=800&q=80', alt_text: 'Lenovo ThinkPad Side', sort_order: 2, is_primary: false, created_at: new Date().toISOString() },
  { id: 'img_prod_001_3', product_id: 'prod_001', image_url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80', alt_text: 'Lenovo ThinkPad Keyboard', sort_order: 3, is_primary: false, created_at: new Date().toISOString() },
  { id: 'img_prod_001_4', product_id: 'prod_001', image_url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80', alt_text: 'Lenovo ThinkPad Screen', sort_order: 4, is_primary: false, created_at: new Date().toISOString() },
  { id: 'img_prod_002', product_id: 'prod_002', image_url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80', alt_text: 'Dell Latitude', sort_order: 1, is_primary: true, created_at: new Date().toISOString() },
];

export const mockVariantImages: VariantImage[] = [
  { id: 'img_var_001', variant_id: 'var_003', image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80', alt_text: 'Dell Latitude Silver', sort_order: 1, is_primary: true, created_at: new Date().toISOString() }
];

export const mockUnitImages: InventoryUnitImage[] = [
  { id: 'img_unit_001', inventory_unit_id: 'unit_001', image_url: 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800&q=80', alt_text: 'Actual photo', sort_order: 1, created_at: new Date().toISOString() }
];

export function getDisplayImages(productId: string, variantId?: string, unitId?: string) {
  const images: any[] = [];
  
  if (unitId) {
    const unitImages = mockUnitImages.filter(img => img.inventory_unit_id === unitId);
    images.push(...unitImages);
  }

  if (variantId) {
    const variantImages = mockVariantImages.filter(img => img.variant_id === variantId);
    images.push(...variantImages);
  }

  const productImages = mockProductImages.filter(img => img.product_id === productId);
  images.push(...productImages);

  return images;
}

export function getProductStats(productId: string) {
  const product = mockProducts.find(p => p.id === productId);
  const variants = mockVariants.filter(v => v.product_id === productId);
  
  if (!product) return { totalVariants: 0, totalUnits: 0, availableUnits: 0, rentedUnits: 0, soldUnits: 0, repairUnits: 0 };

  if (product.inventory_type === 'SERIALIZED') {
    const units = mockUnits.filter(u => u.product_id === productId);
    return {
      totalVariants: variants.length,
      totalUnits: units.length,
      availableUnits: units.filter(u => u.status === 'available').length,
      rentedUnits: units.filter(u => u.status === 'rented').length,
      soldUnits: units.filter(u => u.status === 'sold').length,
      repairUnits: units.filter(u => u.status === 'repair').length,
    };
  } else {
    const stockItems = mockInventoryStock.filter(s => s.product_id === productId);
    const totalStock = stockItems.reduce((acc, curr) => acc + curr.quantity, 0);
    return {
      totalVariants: variants.length,
      totalUnits: totalStock, // for non-serialized we treat quantity as total units available
      availableUnits: totalStock,
      rentedUnits: 0,
      soldUnits: 0,
      repairUnits: 0
    };
  }
}

export function getVariantStats(variantId: string) {
  const variant = mockVariants.find(v => v.id === variantId);
  const product = mockProducts.find(p => p.id === variant?.product_id);
  
  if (!product) return { totalUnits: 0, availableUnits: 0, rentedUnits: 0, soldUnits: 0, repairUnits: 0 };

  if (product.inventory_type === 'SERIALIZED') {
    const units = mockUnits.filter(u => u.variant_id === variantId);
    return {
      totalUnits: units.length,
      availableUnits: units.filter(u => u.status === 'available').length,
      rentedUnits: units.filter(u => u.status === 'rented').length,
      soldUnits: units.filter(u => u.status === 'sold').length,
      repairUnits: units.filter(u => u.status === 'repair').length,
    };
  } else {
    const stock = mockInventoryStock.find(s => s.variant_id === variantId);
    return {
      totalUnits: stock?.quantity || 0,
      availableUnits: stock?.quantity || 0,
      rentedUnits: 0,
      soldUnits: 0,
      repairUnits: 0,
    };
  }
}
