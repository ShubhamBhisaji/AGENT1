# Build Checklist

Updated and finalized for a CCTV + IT Services eCommerce website.

## 1) Project Goal
- [x] Objective is clearly defined
- [x] Target users are defined

Objective:
Build a production-ready eCommerce platform that sells CCTV hardware and IT services, allowing users to browse products, compare options, book service packages, and complete secure checkout.

Target users:
- Homeowners and small business owners needing surveillance systems
- Office/retail managers procuring CCTV bundles and support contracts
- Returning customers purchasing add-ons, upgrades, and maintenance plans

## 2) Tech Stack (React + TypeScript default)
- [x] Framework selected: Next.js or Vite React
- [x] Styling selected: Tailwind / CSS Modules / SCSS
- [x] State selected: Context / Zustand / Redux Toolkit
- [x] Data source selected: Static / API / DB
- [x] Package manager selected: npm / pnpm / yarn

Selected stack:
- Framework: Next.js (App Router) + TypeScript
- Styling: Tailwind CSS
- State: Zustand (cart + ui state), server state via Next.js fetch
- Data source: PostgreSQL (primary), API routes, optional static seed fallback
- Package manager: npm

## 3) Routes and Pages
- [x] Route list provided
- [x] Page purpose defined for each route

Routes:
- /: Homepage, hero, featured CCTV products, services overview, trust badges
- /products: Product catalog listing with search/filter/sort
- /products/[slug]: Product detail page (specs, stock, related products)
- /services: IT services listing (installation, AMC, network setup, audits)
- /services/[slug]: Service detail page with pricing tiers and booking CTA
- /cart: Cart summary and quantity adjustments
- /checkout: Address, schedule, payment, order review
- /auth/login: Customer sign-in
- /auth/register: Customer account creation
- /account: Profile, saved addresses, order history
- /orders/[id]: Order tracking and invoice summary
- /admin: Admin dashboard (optional role-gated)
- /admin/products: Product CRUD
- /admin/orders: Order management and status updates

## 4) Core Features
- [x] Product listing
- [x] Search
- [x] Filtering
- [x] Sorting
- [x] Cart flow
- [x] Checkout flow
- [x] Authentication (if needed)

Feature decisions:
- Product listing: Grid/list toggle with pagination
- Search: Name, SKU, brand, and use-case keyword search
- Filtering: Category, camera type, resolution, price range, stock status
- Sorting: Popularity, newest, price low-high, price high-low
- Cart flow: Add/edit/remove, quantity controls, stock-aware validation
- Checkout flow: Address + installation slot + payment + confirmation
- Authentication: Required for checkout and order history; guest browse allowed

## 5) Product Model
- [x] Categories listed
- [x] Required fields listed (name, sku, price, stock, image, etc.)
- [x] Validation rules defined

Categories:
- Dome Camera
- Bullet Camera
- PTZ Camera
- NVR/DVR
- Storage (HDD/SSD)
- Accessories (cables, connectors, adapters, power)
- Service Packages (installation, maintenance, support)

Required fields:
- id (uuid)
- name
- slug
- sku
- category
- brand
- description
- price
- comparePrice (optional)
- stock
- images[]
- specs (json)
- warrantyMonths
- ratingAverage (optional)
- reviewCount (optional)
- isActive
- createdAt, updatedAt

Validation rules:
- name: 3-120 chars
- sku: uppercase alphanumeric with dashes, unique
- slug: lowercase kebab-case, unique
- price: number >= 0
- comparePrice: null or >= price
- stock: integer >= 0
- category: enum only
- images: at least 1 valid URL/path

## 6) Cart and Checkout Rules
- [x] Persistence rule defined (localStorage/session/backend)
- [x] Quantity and stock rules defined
- [x] Pricing rules defined (tax, shipping, discounts)
- [x] Success and failure behavior defined

Rules:
- Persistence: localStorage for guest cart, merged to account cart on login
- Quantity/stock: min 1, max available stock, enforce server-side on checkout
- Pricing:
  - Tax: 8% configurable
  - Shipping: free above $300, otherwise flat $15
  - Discounts: coupon support (percent or fixed), cannot reduce below $0
- Success behavior: order ID shown, confirmation email queued, cart cleared
- Failure behavior: preserve cart, show actionable error, allow retry

## 7) UI/UX Direction
- [x] Visual style keywords provided
- [x] Color direction provided
- [x] Typography direction provided
- [x] Mobile behavior expectations provided
- [x] Motion/animation expectations provided

Direction:
- Style keywords: premium security, technical, trustworthy, modern storefront
- Color direction: graphite, steel blue, safety amber accents, high contrast
- Typography: Sora for headings, Manrope for body
- Mobile behavior: thumb-friendly filters, sticky cart CTA, fast image loading
- Motion: subtle reveal on cards, smooth filter transitions, minimal checkout motion

## 8) Admin/Operations (Optional)
- [x] Admin panel needed
- [x] Product CRUD needed
- [x] Order management needed
- [x] Roles/permissions needed

Admin decisions:
- Admin panel: yes
- Product CRUD: yes
- Order management: yes
- Roles/permissions: admin, manager, customer

## 9) Non-Functional Requirements
- [x] Performance target defined
- [x] Accessibility target defined
- [x] SEO requirement defined
- [x] Browser support defined

Targets:
- Performance: Lighthouse >= 90 for Performance on key pages
- Accessibility: WCAG 2.1 AA baseline
- SEO: route metadata, product schema, sitemap, robots.txt
- Browser support: latest 2 versions of Chrome, Edge, Firefox, Safari

## 10) Delivery Scope
- [x] MVP or full build selected
- [x] Testing scope selected (unit/integration/e2e)
- [x] Seed/demo data required
- [x] README/run instructions required

Scope:
- Delivery: MVP first (customer storefront + checkout + basic admin)
- Testing: unit + integration for critical flows, e2e for browse-to-checkout
- Seed/demo data: required (minimum 24 products + 6 service packages)
- README/run instructions: required

## 11) Constraints
- [x] Deadline provided
- [x] Must-use libraries/tools provided
- [x] Prohibited tools/libraries provided

Constraints:
- Deadline: 3-week MVP timeline
- Must-use: Next.js, TypeScript, Tailwind, Zustand, Zod, Prisma, PostgreSQL
- Prohibited: jQuery, inline script tags, plain JS components, deprecated packages

## 12) Sign-off to Start Build
- [x] Checklist reviewed and finalized
- [x] Start implementation from this checklist

---

## Implementation Notes (Filled by AI)
- Status: Ready to start
- Current milestone: Requirements finalized and architecture-ready checklist prepared
- Blockers: None
- Next action: Scaffold storefront routes, domain models, and state management from this checklist
