# Product Schema ER Diagram

Below is the Entity-Relationship (ER) diagram representing the Klarone Product Module database schema. It illustrates the hierarchical relationship from high-level categories and brands down to physical inventory units.

```mermaid
erDiagram
    category_groups ||--o{ categories : "has"
    brands ||--o{ series : "has"
    categories ||--o{ product_models : "contains"
    brands ||--o{ product_models : "manufactures"
    series ||--o{ product_models : "groups"
    product_models ||--o{ product_variants : "has configurations"
    product_variants ||--o{ inventory_units : "tracks physical stock for"

    category_groups {
        UUID id PK
        TEXT name
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    
    categories {
        UUID id PK
        UUID group_id FK
        TEXT name
        BOOLEAN variant_support
        TEXT inventory_mode
        JSONB specification_template
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    
    brands {
        UUID id PK
        TEXT name
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    
    series {
        UUID id PK
        UUID brand_id FK
        TEXT name
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    
    product_models {
        UUID id PK
        UUID category_id FK
        UUID brand_id FK
        UUID series_id FK
        TEXT name
        TEXT code
        TEXT description
        TEXT short_description
        TEXT highlights
        JSONB images
        TEXT status
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    
    product_variants {
        UUID id PK
        UUID model_id FK
        TEXT sku
        JSONB specifications
        TEXT color
        TEXT condition
        DECIMAL selling_price
        DECIMAL cost_price
        JSONB images
        TEXT status
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    
    inventory_units {
        UUID id PK
        UUID variant_id FK
        TEXT inventory_mode
        TEXT serial_number
        TEXT asset_code
        INTEGER quantity
        TEXT condition_grade
        INTEGER battery_health
        DECIMAL purchase_price
        DECIMAL selling_price_override
        DECIMAL rental_price
        UUID supplier_id
        UUID warehouse_id
        TEXT rack_location
        TEXT notes
        TEXT status
        JSONB images
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
```

### Key Highlights
- **Product Models** act as the central anchor, tying together Categories, Brands, and optional Series.
- **Dynamic Configuration** is supported natively via the `specifications` JSONB column on the `product_variants` table.
- **Inventory Tracking** is strict: `inventory_units` MUST map directly to a `product_variant`. For products that do not use variants, a Default Variant is generated.
- **Stock Types** are governed by `inventory_mode`, dictating if a unit tracks an individual `serial_number` (like a laptop) or just an aggregate `quantity` (like cables).
