import { CategoryGroupData, SpecTemplate } from './types';

export const mockTemplates: SpecTemplate[] = [
  {
    id: 'tpl_laptop',
    name: 'Laptop Template',
    fields: [
      { id: 'f_cpu', name: 'Processor', type: 'Text' },
      { id: 'f_ram', name: 'RAM', type: 'Dropdown', options: ['4GB', '8GB', '16GB', '32GB', '64GB'] },
      { id: 'f_storage', name: 'Storage', type: 'Text' },
      { id: 'f_gpu', name: 'GPU', type: 'Text' },
      { id: 'f_display', name: 'Display', type: 'Text' },
      { id: 'f_os', name: 'Operating System', type: 'Dropdown', options: ['Windows 11', 'macOS', 'Linux', 'DOS'] },
      { id: 'f_battery', name: 'Battery Capacity', type: 'Text' },
      { id: 'f_weight', name: 'Weight', type: 'Number' },
      { id: 'f_touch', name: 'Touch Screen', type: 'Boolean' },
    ]
  },
  {
    id: 'tpl_ssd',
    name: 'SSD Template',
    fields: [
      { id: 'f_capacity', name: 'Capacity', type: 'Dropdown', options: ['256GB', '512GB', '1TB', '2TB', '4TB'] },
      { id: 'f_interface', name: 'Interface', type: 'Dropdown', options: ['SATA', 'NVMe PCIe 3.0', 'NVMe PCIe 4.0', 'NVMe PCIe 5.0'] },
      { id: 'f_read', name: 'Read Speed', type: 'Text' },
      { id: 'f_write', name: 'Write Speed', type: 'Text' },
      { id: 'f_nand', name: 'NAND Type', type: 'Text' },
      { id: 'f_form', name: 'Form Factor', type: 'Dropdown', options: ['2.5 inch', 'M.2 2280', 'M.2 2242'] },
    ]
  },
  {
    id: 'tpl_cctv',
    name: 'CCTV Template',
    fields: [
      { id: 'f_res', name: 'Resolution', type: 'Dropdown', options: ['2MP', '4MP', '5MP', '8MP (4K)'] },
      { id: 'f_lens', name: 'Lens', type: 'Text' },
      { id: 'f_night', name: 'Night Vision', type: 'Boolean' },
      { id: 'f_poe', name: 'PoE Support', type: 'Boolean' },
      { id: 'f_ip', name: 'IP Rating', type: 'Text' },
      { id: 'f_power', name: 'Power Source', type: 'Text' },
      { id: 'f_indoor', name: 'Indoor/Outdoor', type: 'Dropdown', options: ['Indoor', 'Outdoor', 'Both'] },
    ]
  },
  {
    id: 'tpl_monitor',
    name: 'Monitor Template',
    fields: [
      { id: 'f_m_size', name: 'Screen Size', type: 'Text' },
      { id: 'f_m_res', name: 'Resolution', type: 'Dropdown', options: ['1080p', '1440p', '4K', '5K', '8K'] },
      { id: 'f_m_hz', name: 'Refresh Rate', type: 'Dropdown', options: ['60Hz', '75Hz', '144Hz', '165Hz', '240Hz'] },
      { id: 'f_m_panel', name: 'Panel Type', type: 'Dropdown', options: ['IPS', 'VA', 'TN', 'OLED'] },
      { id: 'f_m_bright', name: 'Brightness', type: 'Text' },
      { id: 'f_m_resp', name: 'Response Time', type: 'Text' },
    ]
  },
  {
    id: 'tpl_mouse',
    name: 'Mouse Template',
    fields: [
      { id: 'f_ms_type', name: 'Type', type: 'Dropdown', options: ['Wired', 'Wireless', 'Bluetooth'] },
      { id: 'f_ms_dpi', name: 'Max DPI', type: 'Number' },
      { id: 'f_ms_sensor', name: 'Sensor Type', type: 'Dropdown', options: ['Optical', 'Laser'] },
    ]
  }
];

export const mockCategoryGroups: CategoryGroupData[] = [
  {
    id: 'cg_computers',
    name: 'Computers',
    categories: [
      { id: 'c_laptop', name: 'Laptop', hasVariants: 'YES', inventoryMode: 'Serialized', templateId: 'tpl_laptop' },
      { id: 'c_desktop', name: 'Desktop PC', hasVariants: 'YES', inventoryMode: 'Serialized', templateId: 'tpl_laptop' },
      { id: 'c_workstation', name: 'Workstation', hasVariants: 'YES', inventoryMode: 'Serialized', templateId: 'tpl_laptop' },
    ]
  },
  {
    id: 'cg_components',
    name: 'Components',
    categories: [
      { id: 'c_ssd', name: 'SSD', hasVariants: 'YES', inventoryMode: 'Quantity', templateId: 'tpl_ssd' },
      { id: 'c_ram', name: 'RAM', hasVariants: 'YES', inventoryMode: 'Quantity', templateId: 'tpl_laptop' }, // reusing laptop for now or create tpl_ram
      { id: 'c_gpu', name: 'GPU', hasVariants: 'YES', inventoryMode: 'Quantity', templateId: 'tpl_laptop' },
    ]
  },
  {
    id: 'cg_peripherals',
    name: 'Peripherals',
    categories: [
      { id: 'c_monitor', name: 'Monitor', hasVariants: 'OPTIONAL', inventoryMode: 'Quantity', templateId: 'tpl_monitor' },
      { id: 'c_keyboard', name: 'Keyboard', hasVariants: 'OPTIONAL', inventoryMode: 'Quantity', templateId: 'tpl_laptop' },
      { id: 'c_mouse', name: 'Mouse', hasVariants: 'OPTIONAL', inventoryMode: 'Quantity', templateId: 'tpl_mouse' },
    ]
  },
  {
    id: 'cg_security',
    name: 'Security',
    categories: [
      { id: 'c_cctv', name: 'CCTV Camera', hasVariants: 'OPTIONAL', inventoryMode: 'Serialized', templateId: 'tpl_cctv' },
      { id: 'c_nvr', name: 'DVR / NVR', hasVariants: 'OPTIONAL', inventoryMode: 'Serialized', templateId: 'tpl_cctv' },
    ]
  }
];

export const mockBrands = [
  "Lenovo", "Dell", "HP", "Apple", "Samsung", "Logitech", "Hikvision", "CP Plus", "WD", "Crucial"
];

export const mockBrandSeries: Record<string, string[]> = {
  "Lenovo": ["ThinkPad", "IdeaPad", "Legion", "Yoga"],
  "Dell": ["Latitude", "XPS", "Inspiron", "Alienware", "OptiPlex"],
  "HP": ["EliteBook", "ProBook", "Spectre", "Pavilion", "Omen"],
  "Apple": ["MacBook Pro", "MacBook Air", "iMac", "Mac mini"],
  "Samsung": ["Galaxy Book", "Odyssey", "Pro", "EVO"],
  "Logitech": ["MX Master", "G Series", "Ergo"],
  "Hikvision": ["ColorVu", "AcuSense", "Pro Series"],
  "WD": ["Black", "Blue", "Red", "Gold"],
  "Crucial": ["P3", "P5 Plus", "MX500"]
};
