# Klarone Knowledge Catalog Architecture (Locked V2)

> **Version:** 2.0 (Final)
>
> This document defines the final architecture of Klarone's Knowledge Catalog, Product Acquisition, Inventory, and Recommendation ecosystem.
>
> This is one of the core architecture documents of the project and should remain stable for future development.

---

# Vision

Klarone is **not just an online laptop store.**

Klarone is building a **Technology Platform** powered by a continuously growing **Knowledge Catalog**.

Inventory is only one consumer of that knowledge.

Everything in the future—including AI recommendations, buying guides, expert consultation, comparison tools, sourcing requests, and marketplace integrations—will consume the same Knowledge Catalog.

---

# High-Level Architecture

```text
                   External Data Sources
        ┌──────────────────────────────────────┐
        │ Icecat                             │
        │ Manufacturer APIs                  │
        │ CSV Imports                        │
        │ Manual Entry                       │
        │ Future Integrations                │
        └──────────────────────────────────────┘
                          │
                          ▼
             Product Acquisition Center
                          │
                          │
              Search • Preview • Import
             Sync • Merge • Update • Review
                          │
                          ▼
                 Review & Approval Queue
                          │
                          ▼
                Master Product Catalog
                          │
          ┌───────────────┴────────────────┐
          ▼                                ▼
 Knowledge Variants            Knowledge Intelligence
          │                                │
          │                                │
          └───────────────┬────────────────┘
                          ▼
        Recommendation & Ranking Engine
                          │
            ┌─────────────┴─────────────┐
            ▼                           ▼
     Inventory Module          Customer Platform
            │
            ▼
      Orders / Sales
```

---

# Core Philosophy

There are four completely independent domains inside Klarone.

---

## 1. Knowledge Catalog

Purpose:

Store official information about products available in the market.

Examples:

- Lenovo LOQ
- Dell Latitude
- MacBook Air M4
- HP Victus
- Asus ROG
- Acer Nitro

The Knowledge Catalog is independent of Klarone's inventory.

A laptop exists here even if Klarone has never owned or sold it.

---

## 2. Knowledge Intelligence

Purpose:

Store Klarone's own intelligence.

Examples:

- Recommendation scores
- AI analysis
- Student rating
- Gaming rating
- Business rating
- Creator rating
- Expert notes
- Pros
- Cons
- Benchmarks
- Buying guide
- Common issues
- Repairability score
- Upgradeability score

This is Klarone's proprietary data.

It is never imported from Icecat.

---

## 3. Inventory

Purpose:

Store products physically owned by Klarone.

Inventory only references Knowledge Variants.

Inventory stores:

- Quantity
- Serial Number
- Battery Health
- Purchase Price
- Selling Price
- Rental Price
- Warranty
- Refurbished Status
- Warehouse
- Rack Location
- Actual Product Photos

Inventory never stores official specifications.

---

## 4. Customer Platform

Purpose:

Deliver the experience to customers.

Examples:

- Website
- Mobile App
- Expert Consultation
- AI Assistant
- Knowledge Center
- Recommendation Wizard
- Product Comparison

Customer Platform consumes:

- Knowledge Catalog
- Knowledge Intelligence
- Inventory

---

# Product Acquisition Center

The Product Acquisition Center is responsible for importing products into Klarone.

Supported sources:

- Icecat
- Manufacturer APIs
- CSV Import
- Excel Import
- Manual Entry
- Future Connectors

---

## Responsibilities

- Search external products
- Preview products
- Import selected products
- Detect duplicates
- Merge existing products
- Refresh product information
- Archive discontinued products
- Schedule automatic sync
- Maintain source history

---

# Review & Approval Workflow

Every imported product follows this lifecycle.

```text
Imported

↓

Draft

↓

Reviewed

↓

Approved

↓

Published

↓

Visible Across Platform
```

Nothing is published automatically.

---

# Master Product Catalog

The Master Product Catalog stores the official product information.

Example

```
Brand

Lenovo

Series

LOQ

Model

15IRX9
```

This record is unique.

There is only ONE Master Product.

---

## Stores

- Brand
- Series
- Model
- Manufacturer Product Code
- GTIN
- Official Images
- Official Specifications
- Official Descriptions
- Documents
- Warranty
- External Source IDs
- MSRP / Official Price
- Release Date
- Status

---

# Knowledge Variants

One Master Product can have many variants.

Example

```
Master Product

Lenovo LOQ 15IRX9

↓

Variants

i5
8GB
512GB

↓

i5
16GB
512GB

↓

i7
16GB
512GB

↓

i7
32GB
1TB
```

Variants store configuration-specific information.

Examples

- CPU
- GPU
- RAM
- Storage
- Display
- Refresh Rate
- Keyboard
- Color
- OS
- MSRP
- Official Images (if different)
- Variant-specific specifications

No inventory is stored here.

---

# Knowledge Intelligence

Knowledge Intelligence stores Klarone's expertise.

Examples

Recommendation Scores

```
Student Score

92

Gaming Score

88

Programming Score

95

Business Score

90

Creator Score

84
```

Additional information

- Pros
- Cons
- AI Summary
- Expert Notes
- Buying Guide
- Upgradeability
- Battery Rating
- Repairability
- Thermal Rating
- Portability
- Value Score

This information is manually curated or AI-generated.

---

# Recommendation & Ranking Engine

This is Klarone's biggest differentiator.

The engine **does not recommend products based on stock.**

Instead it follows this process.

```
Customer Requirements

↓

Knowledge Catalog

↓

Knowledge Intelligence

↓

Ranking

↓

Best Products

↓

Inventory Check

↓

Available?

YES

↓

Show Buy Now

NO

↓

Notify Me

OR

Request Sourcing

OR

Show Similar Alternatives
```

This ensures unbiased recommendations.

---

# Inventory Module

Inventory references Knowledge Variants.

Relationship

```
Knowledge Variant

↓

Inventory Item 1

↓

Inventory Item 2

↓

Inventory Item 3
```

Example

Knowledge Variant

```
Lenovo LOQ

i5

16GB

512GB

Black
```

Inventory

```
SN001

Battery 96%

Refurbished

₹58,000
```

```
SN002

Battery 92%

Refurbished

₹56,000
```

```
SN003

New

₹63,000
```

Each inventory item represents an actual physical device.

---

# Images Strategy

Images are divided into three levels.

---

## Master Product Images

Purpose

Official marketing images.

Examples

- Front
- Back
- Side
- Lifestyle Images

Source

Icecat

Manufacturer

---

## Variant Images

Purpose

Configuration-specific images.

Example

Silver

Black

RGB Keyboard

Touch Version

OLED Version

---

## Inventory Images

Purpose

Real photographs of Klarone's stock.

Examples

Actual Laptop

Scratches

Battery Screenshot

Packaging

Accessories

These are uploaded manually.

---

# Pricing Strategy

There are three price layers.

---

## Knowledge Price

Source

Icecat

Manufacturer

Examples

- MSRP
- Launch Price
- Official Price

Read-only.

---

## Inventory Price

Maintained by Klarone.

Examples

Purchase Price

Selling Price

Rental Price

Offer Price

Exchange Price

---

## Customer Display

Customer sees

```
MRP

₹79,990

Klarone Price

₹64,990

You Save

₹15,000
```

---

# Duplicate Prevention

Every imported product stores external IDs.

Examples

- Icecat Product ID
- GTIN
- EAN
- UPC
- Manufacturer Product Code

These IDs are used before every import.

If a product already exists,

Never create a duplicate.

Instead

- Refresh
- Merge
- Update

---

# Immutable Import Rule

Imported data must remain read-only.

Developers must never modify imported fields directly.

If Klarone wants custom descriptions,

they should be stored in override tables.

Imported data can only be

- Refreshed
- Merged
- Archived

---

# Variant Rule

Never duplicate Master Products because of configuration changes.

Correct

```
Master Product

↓

Multiple Variants
```

Incorrect

```
Laptop i5

Laptop i7

Laptop i9

(as separate products)
```

---

# Recommendation Rule

Recommendations are generated using

Knowledge Catalog

+

Knowledge Intelligence

Inventory is checked **only after** products are ranked.

Never rank products because they are in stock.

---

# Future Expansion

This architecture supports

- AI Laptop Advisor
- Compare Products
- Buying Guides
- Smart Filters
- Budget Planner
- Student Recommendations
- Gaming Recommendations
- Office Recommendations
- Creator Recommendations
- Expert Consultation
- Marketplace Integration
- Vendor Management
- Multi-warehouse Inventory
- Repair Center
- Rental System
- Trade-in System
- International Expansion

without changing the core database architecture.

---

# Golden Rules

## Rule 1

Knowledge Catalog stores official information only.

---

## Rule 2

Knowledge Intelligence stores Klarone's expertise.

---

## Rule 3

Inventory stores only physical stock.

---

## Rule 4

Inventory references Knowledge Variants.

---

## Rule 5

Knowledge never stores stock.

---

## Rule 6

Inventory never stores official specifications.

---

## Rule 7

Never duplicate products because of CPU, RAM, Storage or Color.

Create Variants instead.

---

## Rule 8

Reference prices belong to Knowledge Catalog.

Selling prices belong to Inventory.

---

## Rule 9

Every import starts as Draft.

Nothing is automatically published.

---

## Rule 10

Never edit imported data directly.

Use override tables if customization is required.

---

## Rule 11

Recommendations always use the Knowledge Catalog first.

Inventory availability is checked only after ranking.

---

## Rule 12

The Knowledge Catalog must remain useful even if Klarone has zero inventory.

---

# Final Vision Statement

Klarone is not an inventory management system.

Klarone is a **technology-driven knowledge platform** centered around a continuously evolving **Knowledge Catalog**.

Inventory, recommendations, AI assistants, comparison tools, expert consultation, sourcing requests, buying guides, and future marketplace integrations are all independent consumers of this Knowledge Catalog.

By separating **Knowledge**, **Intelligence**, **Inventory**, and **Customer Experience**, Klarone becomes scalable, maintainable, and capable of evolving far beyond a traditional e-commerce platform.