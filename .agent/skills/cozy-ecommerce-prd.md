---
name: cozy-ecommerce-prd
description: Product Requirements Document and Business Context for the Cozy Maassluis Ecommerce Project
---

# Cozy Maassluis - Product Requirements Document (PRD)

## 1. Executive Summary
**Project Name:** Cozy2 (Cozy Maassluis Redesign)
**Client Context:** Cozy Maassluis is a boutique and lifestyle store looking to modernize their ecommerce presence without creating the administrative burden of running a "second store."
**Business Goal:** Facilitate steady business growth and increase foot traffic to the physical store, rather than focusing purely on massive online sales. The digital experience must reflect the physical store's "warm home feeling" and personal touch.
**Business Goal 2:** When designing frontend, keep in mind that our task is conversion rates, and not the coolest website of all time.
We need people to buy products, not be distracted from buying them.

## 2. Target Audience & USP (Unique Selling Proposition)
- **Primary Audience:** Existing loyal customers and new local/regional shoppers discovering the brand via Instagram.
- **USP:** "Personal Touch." The brand is heavily driven by the owner's curation (e.g., "Sharon's Lievelings" / Sharon's Favorites), own photography, and a warm, inviting aesthetic.

## 3. Core Problems Identified (Customer Discovery)
1. **Time Constraints:** The team spends significant time on purchasing (inkoop), researching trends, and managing socials. They fear a new webshop will consume too much time.
2. **Inventory Management:** Currently done "by eye." Out-of-stock items are manually managed and often mix confusingly with available stock on the current site.
3. **Outdated UX/UI (Jouwweb):**
    - The current site looks like an outdated 2015 template.
    - Boxy product pages with poor use of whitespace.
    - Poor color contrast (grey text on pink background) causing accessibility issues.
    - Lack of filtering (price, color, size) and sorting options leads to endless scrolling and user drop-off.
4. **Information Architecture Constraints:**
    - Cluttered homepage lacking clear Call-to-Actions (CTAs).
    - Messy navigation (mixing brand names with product categories).
5. **Marketing Integration Gaps:**
    - Highly active on Instagram (answering DMs, reserving items), but the current site only has a static QR code instead of a live feed or seamless integration.
    - No newsletter system, though emails are collected.
    - SEO knowledge is outdated; the business struggles to rank against larger competitors (e.g., Bijenkorf).

## 4. Product Requirements & Solutions

### 4.1. Technology Stack Requirements
- **Backend:** Medusa.js (Solves inventory management synchronization and separates ecommerce logic from the frontend).
- **Frontend:** Next.js / React with Tailwind CSS (Allows for a highly custom, modern, whitespace-driven design).
- **Payments:** Mollie (currently used), with the mandatory addition of **Klarna** integration.
- **Marketing:** Mailchimp or Klaviyo integration for newsletters.

### 4.2. UX/UI & Design System Specs
- **Aesthetic:** "Copenhagen Playful" – Premium, clean, minimalist with strategic use of whitespace.
- **Color Palette:** Mint, White, Pink. Strict color-blocking vertical flow. High contrast typography to fix previous accessibility issues.
- **Layout:** Avoid boxy, outdated grids. Use modern asymmetrical or structured minimalist layouts (e.g., solid 1px zinc-950 borders for products).
- **Navigation:** Clean hierarchy separating Categories (Vazen, Klokken) from Brand collections (HKliving, Anna+Nina).
- **Homepage:** Clear, defined sections with strong CTAs. A personal section highlighted ("Sharon's Favorites").

### 4.3. Functional Features
- **Product Discovery:** Robust filtering (Size, Color, Price) and sorting (Price Low-High, Newest).
- **Inventory Sync:** Automated handling of out-of-stock items (pushing them to the bottom of lists or hiding them).
- **Checkout & Shipping:** Free shipping above a specified threshold. Returns paid by the customer. Multiple payment gates (iDeal, Klarna).
- **Social Proof:** Live Instagram feed integration to replace the static QR code and capture organic social traffic.

## 5. Implementation Strategy & Tone
- **"Jip en Janneke" Language:** All client communication and handovers regarding the CMS and operations must be extremely simple, avoiding heavy developer jargon.
- **Automation First:** The Medusa admin panel must act as a single source of truth to minimize the administrative overhead that the client fears.

---
**Usage for AI Agents:**
*Reference this PRD when making architectural, design, or feature decisions for the Cozy2 project. Ensure all UI/UX changes align with the "Personal Touch" USP and solve the core navigability and time-constraint problems outlined above.*
