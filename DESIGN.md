# Klarone Website V1 — Design System & Technical Standards

## Overview

Klarone is a high-confidence technology guidance platform. The landing page design system embodies a modern, ultra-clean, tech-focused aesthetic inspired by **Perplexity**, **Cursor**, **Linear**, and **Notion**. 

The base atmosphere is **pure dark mode (`#000000`)**, utilizing high-contrast typography, micro-interactions, subtle glassmorphism (`backdrop-blur`), and tailored scroll focus mechanisms.

---

## 1. Color Palette & Token System

### Core Brand Colors
- **Pure Black (Canvas)**: `#000000` — Universal default surface background across all sections.
- **Deep Matte (Cards)**: `#141416` / `#161618` — Container background for interactive components, cards, and accordion items.
- **Elevated Matte (Active/Hover)**: `#1C1C20` / `#222226` — Focused card states, active pills, and hover highlights.
- **Accent Teal (Klarone Highlight)**: `#00A7B5` — Primary brand highlight token used sparingly for confidence badges, state indicators, and key focus rings.
- **Primary White**: `#FFFFFF` — Display headings, hero text, and high-priority CTA text.

### Text & Contrast Tokens
- **Display Ink**: `#FFFFFF` (100% Opacity) — Used for H1 / H2 section titles and key focus items.
- **Sub-headline & Body**: `rgba(255, 255, 255, 0.70)` to `rgba(255, 255, 255, 0.60)` — Muted body paragraphs and card descriptions.
- **Scroll Baseline Muted**: `rgba(255, 255, 255, 0.38)` — Muted baseline opacity for inactive text during scroll focus interactions.
- **Subtle Hairline Border**: `rgba(255, 255, 255, 0.10)` / `rgba(255, 255, 255, 0.15)` — 1px borders on dark cards and rounded containers.

---

## 2. Typography Standards

### Font Families
- **Headings & Display**: `Poppins SemiBold` or `Sora SemiBold` (Fallback: `-apple-system, Segoe UI, sans-serif`).
- **Body & Controls**: `Inter` (Fallback: `system-ui, sans-serif`).

### Type Scale & Hierarchy

| Role | Size (Desktop) | Size (Mobile) | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| **Hero H1** | `54px – 62px` | `36px` | 600 (SemiBold) | `1.08` | `-0.02em` |
| **Section H2** | `44px – 50px` | `32px` | 500 (Medium) | `1.12` | `-0.015em` |
| **Scroll Intro Body** | `24px – 28px` | `20px` | 400 (Regular) | `1.45` | `0` |
| **Card Title / Question** | `15.5px – 18px` | `15px` | 500 (Medium) | `1.30` | `0` |
| **Body Standard** | `14px – 14.5px` | `13.5px` | 400 (Regular) | `1.50` | `0` |
| **Pill / Button Label** | `13px – 14.5px` | `13px` | 500 (Medium) | `1.0` | `0.01em` |

---

## 3. Header & Navigation Standard

- **Initial State (0px Scroll)**: `100% Transparent` background.
- **Scroll Active State**: Top-to-bottom dark linear gradient overlay:
  `linear-gradient(to bottom, rgba(10, 10, 12, 0.95) 0%, rgba(10, 10, 12, 0.50) 60%, rgba(10, 10, 12, 0) 100%)`
- **Navigation Controls**: Clean text links (*Shop, How it Works, Services, Top Picks, FAQ*).
- **CTA Button**: Single rounded pill (`px-5 py-2.5 rounded-full bg-white/90 text-black`) redirecting to `/find-laptop`. No redundant account/cart icons in default guidance mode.

---

## 4. Scroll Focus & Motion System

### Single-Paragraph Scroll Curve (ScrollIntroSection)
- **Target Container**: `#000000` pure black background with exact 0px separation from Hero.
- **Max Width**: `620px` centered column.
- **Focus Rule**: Exactly ONE paragraph lights up in pure white (`1.0` opacity) at a time based on its viewport scroll trigger point `[0, 0.35, 0.65, 1]`. All inactive paragraphs remain visible at muted baseline (`0.38`).

### FAQ Section Scroll & Interactive Rules
- **Category Tabs Stack**:
  - Standalone rounded pills (`rounded-full py-3.5 px-6`).
  - Active Tab: Dark matte container (`bg-[#222226] border border-white/15 text-white`).
  - Slide Translation: `useScroll` target bound to grid element, animating translateY from `0px` down to `200px – 220px` so it slides in real-time and rests directly above the **"Got Questions?"** card.
- **Accordion Cards**:
  - All questions closed by default (`openIndex = null`).
  - Hover State: `hover:bg-[#1A1A1E] hover:border-white/20 hover:shadow-md`.
  - Expanded State: `bg-[#1C1C20] border-white/25 shadow-xl` with rotating circular chevron icon.

---

## 5. UI Components & Layout Rules

### Border Radius Hierarchy
- **Pills & Buttons**: `rounded-full` (9999px).
- **Containers & Cards**: `rounded-2xl` (16px) or `rounded-3xl` (24px).
- **Subtle Framing**: All dark cards feature a 1px border (`border-white/10`).

### Footer Standard
- **Background**: `#000000` pure black with top `border-t border-white/10`.
- **Branding**: Full inverted Klarone logo (`/logo.webp`, `invert`).
- **Links Layout**: Grid layout with Product, Company, and Legal link columns.
- **Social Icons**: Minimal inline SVGs (Zap, Facebook, LinkedIn, X, Instagram) in muted white (`text-white/60 hover:text-white`).

---

## 6. Development & Design Principles

1. **Confidence Over Sales**: Never look like a generic retail catalog. Prioritize recommendation advisory aesthetics over inventory grids.
2. **Zero Gap Seamlessness**: Eliminate visible background gaps or color shifts between consecutive dark sections.
3. **Micro-Animations**: Use Framer Motion (`useScroll`, `useTransform`, `AnimatePresence`) for state transitions without introducing layout shifts.

---

## 7. Page Entrance & Transition Standards

To maintain consistency across the platform, **every standalone page route load (e.g. `/shop`, `/find-laptop`, `/shop/[id]`, `/compare`) MUST feature a smooth bottom-to-top entrance animation**:

- **Translation Vector**: `y: 24px` -> `y: 0px` (or `y: 30px` -> `y: 0px`).
- **Opacity Transition**: `opacity: 0` -> `opacity: 1`.
- **Easing Curve**: Smooth cubic bezier `[0.215, 0.61, 0.355, 1]` or `easeOut`.
- **Orchestration**: Parent containers use `staggerChildren: 0.08` with a `0.05s` initial delay so headers, hero titles, sidebars, and cards reveal progressively in a unified vertical upward flow.