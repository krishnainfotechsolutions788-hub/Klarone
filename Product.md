# Klarone Product Module Design (Locked V1)

## Purpose

This document defines the locked architecture for Klarone's Product
Module, including:

-   Product hierarchy
-   Add Product workflow
-   Product Listing (Admin)
-   Inventory philosophy
-   Variant philosophy
-   Image inheritance
-   Future scalability

------------------------------------------------------------------------

# Product Hierarchy

``` text
Category Group
    ↓
Category
    ↓
Brand
    ↓
Series (Optional)
    ↓
Model
    ↓
Variant (Optional)
    ↓
Inventory
```

## Category Groups

-   Computers
-   Components
-   Peripherals
-   Accessories
-   Security
-   Networking
-   Storage

Each Category belongs to one Category Group.

Examples:

  Category Group   Categories
  ---------------- --------------------------------------
  Computers        Laptop, Desktop PC, Workstation
  Components       CPU, RAM, SSD, HDD, GPU, Motherboard
  Peripherals      Monitor, Keyboard, Mouse, Webcam
  Accessories      Charger, Dock, Laptop Bag, USB Hub
  Security         CCTV Camera, DVR, NVR

------------------------------------------------------------------------

# Product Levels

## 1. Model

Represents the actual product.

Example:

-   Brand: Lenovo
-   Series: ThinkPad
-   Model: T480

Model stores:

-   Category
-   Brand
-   Series
-   Model Name
-   Description
-   Product Images
-   Status
-   Product Code
-   Specification Template

No pricing or inventory belongs here.

------------------------------------------------------------------------

## 2. Variant

Represents a sellable configuration.

Example:

ThinkPad T480

Variant A

-   Intel i5
-   8GB RAM
-   256GB SSD

Variant B

-   Intel i7
-   16GB RAM
-   512GB SSD

Variant stores:

-   SKU
-   Dynamic Attributes
-   Price
-   Cost
-   Variant Images
-   Status

Variants are optional and controlled by Category configuration.

------------------------------------------------------------------------

## 3. Inventory

Represents real stock.

Two inventory modes:

### Serialized

Examples

-   Laptop
-   Desktop
-   Printer

Each unit stores:

-   Serial Number
-   Asset Code
-   Condition
-   Battery Health
-   Purchase Price
-   Selling Price
-   Rental Price
-   Supplier
-   Warehouse
-   Rack
-   Unit Images

### Quantity

Examples

-   RAM
-   SSD
-   Mouse
-   Keyboard

Stores:

-   Quantity
-   Reorder Level
-   Rental Price
-   Supplier
-   Warehouse

------------------------------------------------------------------------

# Image Inheritance

Priority:

1.  Unit Images
2.  Variant Images
3.  Product Images

If a level has no images, inherit from the previous level.

------------------------------------------------------------------------

# Add Product Wizard

## Step 1 -- Basic Information

-   Category Group
-   Category
-   Brand
-   Series
-   Model Name
-   Product Code (auto)
-   Status
-   Short Description
-   Product Description

Category automatically loads:

-   Specification Template
-   Variant Support
-   Inventory Mode

------------------------------------------------------------------------

## Step 2 -- Product Images

Upload:

-   Thumbnail
-   Gallery

Official images only.

------------------------------------------------------------------------

## Step 3 -- Product Specifications

Generated dynamically from the Specification Template.

Examples:

Laptop:

-   CPU
-   RAM
-   Storage
-   GPU
-   Display

SSD:

-   Capacity
-   Interface
-   Read Speed

Camera:

-   Resolution
-   Lens
-   Night Vision

No hardcoded fields.

------------------------------------------------------------------------

## Step 4 -- Variants

Displayed only if Variant Support = Enabled.

Each Variant includes:

-   SKU
-   Dynamic Attributes
-   Pricing
-   Status
-   Variant Images

Support:

-   Add Variant
-   Duplicate Variant
-   Delete Variant

------------------------------------------------------------------------

## Step 5 -- Inventory

Serialized:

Create multiple units.

Quantity:

Enter stock quantity.

------------------------------------------------------------------------

## Step 6 -- Review & Publish

Validate:

-   Duplicate SKU
-   Duplicate Model
-   Missing Images
-   Missing Required Specifications
-   Duplicate Serial Numbers

Actions:

-   Save Draft
-   Publish
-   Publish & Add Another

------------------------------------------------------------------------

# Product Listing (Admin)

## Header

-   Add Product
-   Import
-   Export
-   Refresh

## Summary Cards

-   Total Products
-   Active
-   Draft
-   Archived
-   Low Stock
-   Out of Stock

## Search

Search by:

-   Model
-   SKU
-   Brand
-   Series
-   Product Code

## Filters

-   Category Group
-   Category
-   Brand
-   Status
-   Inventory Mode
-   Variant Enabled
-   Warehouse

## Table Columns

-   Product
-   Brand
-   Category
-   Variants
-   Inventory
-   Status
-   Updated
-   Actions

Each Product row expands to show Variants.

Each Variant can expand to show Inventory Units.

Hierarchy:

``` text
Product
 ├── Variant A
 │      ├── Unit 1
 │      ├── Unit 2
 └── Variant B
        ├── Unit 3
```

## Row Actions

-   View
-   Edit
-   Duplicate
-   Archive
-   Delete (Soft)
-   Manage Inventory
-   Manage Variants

------------------------------------------------------------------------

# Design Principles

-   Generic product architecture.
-   Dynamic specification templates.
-   Variant support controlled by Category.
-   Inventory mode controlled by Category.
-   Image inheritance.
-   No duplicated data.
-   Scalable for future product categories.

------------------------------------------------------------------------

# Locked Decisions

-   Category Groups above Categories.
-   Series remains optional.
-   Variants are optional.
-   Dynamic specification templates.
-   Inventory supports Serialized and Quantity modes.
-   Product → Variant → Inventory hierarchy is fixed.
-   Products use inherited images.
-   Admin product listing supports hierarchical expansion.

# Database Schema & Relationships

The Product Module is powered by a relational database schema structured to handle deep hierarchies, dynamic configurations, and flexible inventory models.

### Tables & Relationships

**1. category_groups**
- Primary Key: `id`
- Purpose: High-level grouping (e.g., Computers, Components).

**2. categories**
- Primary Key: `id`
- Foreign Key: `group_id` references `category_groups(id)`
- Purpose: Specific types (e.g., Laptop, CPU). Determines `inventory_mode` and `variant_support`.

**3. brands**
- Primary Key: `id`
- Purpose: Manufacturers.

**4. series** (Optional)
- Primary Key: `id`
- Foreign Key: `brand_id` references `brands(id)`
- Purpose: Sub-brands or product families.

**5. product_models**
- Primary Key: `id`
- Foreign Keys: 
  - `category_id` references `categories(id)`
  - `brand_id` references `brands(id)`
  - `series_id` references `series(id)`
- Purpose: Base products containing shared description, highlights, and base images.

**6. product_variants**
- Primary Key: `id`
- Foreign Key: `model_id` references `product_models(id)`
- Purpose: Specific configurations. Uses `specifications` (JSONB) to store variable specs (e.g., RAM, SSD) without rigid columns. Stores pricing (`selling_price`, `cost_price`).

**7. inventory_units**
- Primary Key: `id`
- Foreign Keys:
  - `variant_id` references `product_variants(id)`
- Constraint: `variant_id` IS NOT NULL
- Purpose: Physical stock tracking. Holds `serial_number`, `condition_grade`, `selling_price_override`, and quantities.

### Key Workflows
- **Dynamic Attributes**: Handled entirely through JSONB columns (`specifications` on variants).
- **Default Variant Strategy**: For categories without variant support, the system auto-generates a Default Variant to ensure all inventory maps to a variant.
- **Navigation/Drill-Down**: The UI follows the DB schema directly: `product_models` view → `product_variants` view → `inventory_units` view.

------------------------------------------------------------------------

Version: Klarone Product Module V2 (Architecture Revision)
