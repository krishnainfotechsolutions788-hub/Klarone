# Klarone Dynamic Product Specification Architecture (Locked V1)

> Status: Locked
> Version: 1.0
> Owner: Klarone
> Last Updated: 2026

---

# Purpose

This document defines how Klarone stores product specifications inside the Knowledge Catalog.

The goal is to build a system that can support **millions of products** across **any category** without requiring database schema changes.

The architecture is inspired by modern Product Information Management (PIM) systems such as Icecat, Akeneo, Pimcore, and enterprise ecommerce platforms.

---

# Why We Need Dynamic Specifications

Different product categories have completely different specifications.

Example:

Laptop

- Processor
- RAM
- Storage
- GPU
- Battery

Monitor

- Refresh Rate
- Brightness
- HDR
- Panel Type

Keyboard

- Switch Type
- RGB
- Wireless

Printer

- Print Speed
- Duplex
- Paper Size
- Ink Type

Router

- WiFi Version
- Antennas
- LAN Ports
- WAN Ports

If we create one database column for every possible specification, our database would eventually contain thousands of mostly empty columns.

Example (BAD)

products

RAM
Storage
GPU
RefreshRate
HDR
Bluetooth
Battery
PrintSpeed
PaperSize
LANPorts
SwitchType
...

This architecture is impossible to maintain.

Therefore Klarone uses a Dynamic Specification System.

---

# Core Principle

Products NEVER own specification columns.

Instead every specification is stored as a record.

Instead of

RAM = 16GB

Storage = 512GB

GPU = RTX4060

we store

Attribute Name

Attribute Value

This allows Klarone to support every product category without changing the database schema.

---

# Overall Architecture

Knowledge Product

↓

Knowledge Variant

↓

Knowledge Specifications

Each product can have multiple variants.

Each variant can have unlimited specifications.

---

# Database Structure

## Knowledge Product

Stores general information.

Example

- Brand
- Product Family
- Series
- Model
- GTIN
- Icecat ID

No technical specifications are stored here.

---

## Knowledge Variant

Stores a sellable configuration.

Example

HP Victus

Variant 1

Intel i5

16GB

512GB SSD

RTX4050

Black

Variant 2

Intel i7

32GB

1TB SSD

RTX4060

Black

Variant 3

Ryzen 7

16GB

512GB SSD

White

Every configuration becomes one Variant.

---

# Knowledge Specification

Every specification is stored individually.

Example table

knowledge_specifications

id

variant_id

group_name

attribute_name

attribute_code

value

unit

display_order

source

last_synced

created_at

updated_at

---

# Example Records

Variant 101

Processor Family

Intel Core i5

Processor

Processor Frequency

4.8

GHz

Memory

RAM

16

GB

Storage

Capacity

512

GB

Storage

Type

SSD

Display

Size

15.6

inch

Battery

Capacity

70

Wh

Network

WiFi

Yes

Network

Bluetooth

5.3

Graphics

GPU

RTX4050

Graphics

VRAM

6

GB

Notice

There are NO RAM columns.

There are NO GPU columns.

Everything is dynamic.

---

# Group Structure

Specifications are grouped.

Example

General

Display

Processor

Graphics

Memory

Storage

Battery

Keyboard

Camera

Audio

Ports

Networking

Software

Security

Dimensions

Weight

Packaging

Warranty

Environmental

Accessories

Certification

Other

This makes rendering product pages easy.

---

# Supported Data Types

Every specification can have a type.

text

number

boolean

date

list

url

json

Examples

RAM

Number

Battery

Number

Bluetooth

Boolean

Color

Text

Warranty

Text

Release Date

Date

---

# Units

Units are stored separately.

Example

Value

16

Unit

GB

Instead of

16 GB

Store

value = 16

unit = GB

Benefits

Sorting

Filtering

Searching

Unit Conversion

Analytics

---

# Boolean Specifications

Instead of

Bluetooth

×

Store

attribute

Bluetooth

value

false

Instead of

WiFi

✓

Store

attribute

WiFi

value

true

---

# Multi-value Specifications

Some attributes have multiple values.

Example

Supported Memory

DDR4

DDR5

LPDDR5

Store as

JSON Array

or

Multiple Records

Depending on implementation.

---

# Attribute Codes

Every specification should have a stable internal code.

Example

processor_family

processor_model

processor_frequency

processor_threads

ram

storage_capacity

storage_type

gpu

battery_capacity

display_size

display_resolution

This prevents duplicate attributes.

Example

RAM

Memory

Installed Memory

System Memory

All map to

ram

---

# Source Tracking

Every specification stores its origin.

Possible values

Icecat

Manual

CSV

Admin

AI

Future Import

This allows future synchronization.

---

# Synchronization Rules

If source = Icecat

Automatically update during sync.

If source = Manual

Never overwrite.

If source = AI

Keep separated.

---

# Product Media

Media is NOT stored inside specifications.

Separate table

knowledge_media

Example

Images

Gallery

Videos

PDF

Manuals

Certificates

Feature Logos

Product Story

---

# Marketing Content

Separate table

knowledge_content

Contains

Short Description

Long Description

Summary

Bullet Points

Warranty

SEO Description

Product Story

---

# AI Intelligence

Separate table

knowledge_intelligence

Contains

Pros

Cons

Expert Review

Buying Guide

Student Score

Gaming Score

Office Score

Business Score

Repairability

Upgradeability

Recommendation Score

AI Summary

These fields never come from Icecat.

These belong only to Klarone.

---

# Inventory Relationship

Inventory NEVER stores specifications.

Inventory references Variant.

Inventory

↓

Knowledge Variant

↓

Specifications

This prevents duplicate product data.

---

# Search

Search works on

Brand

Series

Model

Product Code

GTIN

Attribute Name

Attribute Value

Example

Search

16GB RAM

RTX4060

IPS Panel

Bluetooth

144Hz

All should return products.

---

# Filters

Filters are generated dynamically.

Laptop

RAM

Storage

Processor

GPU

Monitor

Refresh Rate

HDR

Panel

Keyboard

RGB

Wireless

Switch Type

No hardcoded filters.

---

# Product Comparison

Comparison is generated dynamically.

Processor

RAM

Storage

Battery

Display

Weight

Every compared attribute comes directly from

knowledge_specifications.

---

# Future Ready

This architecture supports

Laptops

Desktops

Monitors

Phones

Tablets

Smart Watches

Printers

Routers

Servers

Graphics Cards

Motherboards

Processors

Accessories

Furniture

Medical Equipment

Industrial Products

Without database changes.

---

# Benefits

✅ Unlimited specifications

✅ Unlimited product categories

✅ Icecat compatible

✅ CSV compatible

✅ Manual entry compatible

✅ AI compatible

✅ Easy filtering

✅ Easy comparison

✅ Easy recommendations

✅ No schema changes required

✅ Enterprise scalable

---

# Final Rule (LOCKED)

The Knowledge Catalog stores only structured product knowledge.

Identity fields remain fixed.

Technical specifications are always stored dynamically.

Inventory references Knowledge Variants instead of copying specifications.

No future feature should introduce fixed specification columns such as RAM, Storage, GPU, Display, Battery, etc.

This architecture is considered LOCKED and will be used across the entire Klarone ecosystem.