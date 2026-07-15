# EMBER Pricing System

Production-quality frontend starter for an EMBER & CO. pricing and quotation workflow. The app helps workers calculate selling prices, manage quotations, configure rules, maintain categories and shipping methods, and approve special requests.

## Technology Stack

- React, Vite, JavaScript, and JSX
- Tailwind CSS with reusable UI components
- React Router for routes
- React Hook Form and Zod for validation
- Zustand for lightweight feature stores
- date-fns for date formatting
- lucide-react for icons
- clsx through `src/utils/classNames.js`
- Vercel Blob through a server API for backend-style JSON persistence

## Installation

```bash
npm install
npm run dev
```

## Commands

```bash
npm run dev
npm run build
npm run preview
npm run verify:pricing
```

## Roles

The starter has two local roles:

- `Owner Admin`: sees admin configuration, pricing rules, product categories, shipping methods, approvals, settings, calculator, and quotations.
- `Staff Quote Creator`: sees the price calculator and quotation workflow only.

The app starts at `/login`. Starter credentials are:

- Owner: `owner@ember.co` / `owner123`
- Staff: `staff@ember.co` / `staff123`

This is a frontend role model for now; replace it with real authentication and server-side authorization before production.

## Folder Structure

The project uses feature-based architecture:

- `src/app`: app shell, route configuration, providers, layout, and error boundary
- `src/components`: shared UI and layout components
- `src/features`: dashboard, quotations, pricing, categories, shipping, approvals, and settings
- `src/lib`: shared validation infrastructure
- `src/stores`: cross-feature stores such as toasts and preferences
- `src/utils`: reusable formatting and number helpers
- `scripts`: local verification scripts

## Architecture Rules

- Pages coordinate layout and feature components.
- Components render UI and handle interaction, but do not own pricing formulas or persistence.
- Pricing calculations live in `src/features/pricing/services/pricingService.js`.
- Validation schemas live beside their feature in `schemas`.
- Zustand stores are split by feature and call services for persistence.
- `src/services/persistenceService.js` is the only client-side persistence boundary.
- All saved app data goes through `/api/storage` and Vercel Blob.
- Business statuses and category keys are constants, not raw strings spread across JSX.

## Pricing Logic

Default pricing values live in `src/features/pricing/config/defaultPricingRules.js`.

- LUXE applies California tax, category profit, shipping, optional special request fee, and optional local delivery.
- Daily Essentials applies 15% profit, shipping, and optional charges.
- Electronics applies 10% shipping company fee, 25% profit, shipping, and optional charges.
- Supplements use temporary threshold rules: under $30 gets $8 profit, $30 or more gets $10 profit.
- All money calculations normalize numeric input and round to two decimal places through `src/features/pricing/utils/money.js`.

Run `npm run verify:pricing` to verify the required examples.

## Staff Price Calculator

The `Price Calculator` page is the fast staff workflow for entering website price, weight, category, shipping method, special request, and local delivery. It calls the same pricing service as the quotation form, so calculator results and saved quotations stay consistent.

## Invoice Generation

Quotation details include a `Download invoice` action. It generates a customer-ready PDF invoice in the browser. The invoice intentionally hides internal website cost, profit, tax logic, and shipping company fee. Customers see a product total, shipping, optional services, delivery, and total due.

## State Management

Zustand stores are intentionally small:

- `quotationStore`: quotation CRUD, status changes, special request decisions
- `pricingRulesStore`: editable pricing configuration
- `categoryStore`: product category CRUD and enable/disable
- `shippingMethodStore`: shipping method CRUD and enable/disable
- `toastStore`: transient notifications only
- `appStore`: small UI preferences only

Derived pricing summaries are not stored globally; they are recalculated through hooks and services.

## API Data Storage

The app uses `src/services/persistenceService.js` to call `/api/storage`. The API route stores JSON collections in Vercel Blob and is the only persistence layer for app data.

There is no mock quotation seed. New Blob stores start with an empty quotation list. Business configuration collections are initialized from default owner-managed rules when no Blob object exists yet.

Quotation reads do not write the empty fallback back to Blob. Only create, edit, status, approval, delete, or explicit replacement actions save `quotations.json`; this prevents startup hydration from overwriting a newly created quote with `[]`.

Storage API contract:

- `GET /api/storage?collection=quotations` reads a collection.
- `POST /api/storage?collection=quotations` with `{ "action": "save", "data": [...] }` writes a collection.
- `POST /api/storage?collection=quotations` with `{ "action": "delete" }` clears a collection.

Do not add browser-side persistence or mock quotation persistence. Persistent app data must go through `/api/storage`.

## Vercel Blob Setup

Create a private Blob store in Vercel and connect it to this project. Vercel can authenticate the SDK with OIDC when the store is connected to the project, or with `BLOB_READ_WRITE_TOKEN` for local/server environments. The React app never receives the Blob token; it talks to `/api/storage`, and the server function reads/writes private JSON blobs.

Blob is object storage, so the app stores each collection as a private JSON object:

- quotations
- pricing rules
- categories
- shipping methods
- app preferences

For heavy multi-user production use, replace the persistence service with a transactional database API.

## Adding a Pricing Category

1. Add the category in Product Categories, or add a default rule to `defaultPricingRules.js`.
2. Use an existing pricing type: `FIXED`, `PERCENTAGE`, or `PRICE_THRESHOLD`.
3. If it belongs to default business logic, add a constant in `quotationConstants.js`.
4. Verify the quotation form filters the category by business section.
5. Add or update a pricing verification case when business behavior changes.

## Adding a Quotation Field

1. Add the field to `QUOTATION_FORM_DEFAULTS`.
2. Update `quotationSchema.js`.
3. Add the input to the correct form section component.
4. Map it in `mapFormToQuotation` and `quotationToFormValues`.
5. Display it in details/list views only if it is operationally useful.

## Replacing Blob With Another API

Keep React components unchanged where possible. Replace persistence inside feature services:

- `quotationService.js`
- `pricingRulesService.js`
- `categoryService.js`
- `shippingMethodService.js`

The stores can continue calling feature services while those services point to the new API.

## Tailwind Styling

Shared UI variants live in `src/components/ui`. Prefer extending those components before adding long class strings in pages. Global Tailwind setup is in `tailwind.config.js` and `src/styles/index.css`.

## Business Assumptions

- All money is USD.
- California sales tax applies only to LUXE.
- Shipping is weight multiplied by the selected shipping method rate.
- Special requests add a fee and require management approval.
- Approval and sent actions are blocked until a special request is approved.
- New installations start with no quotations until staff or owner users create them.

## Supplement Warning

Supplement quotations display:

> Supplement pricing requires confirmation from management.

Keep this text centralized in `SUPPLEMENT_CONFIRMATION_WARNING`.

## Backend Integration Approach

Start with API endpoints for quotations, pricing rules, categories, shipping methods, and approvals. Keep pricing calculation either shared as a tested server module or validated server-side before final quotation approval. Add authentication and role-based approvals before enabling production submission workflows.

## Review Decisions

- Extracted pricing rules into focused sections so the page coordinates state instead of rendering every rule inline.
- Kept all calculations in pricing services and verified the required examples with `npm run verify:pricing`.
- Used feature stores for shared state and avoided storing transient form input globally.
- Kept quotation persistence API-first: routes fetch quote records from Vercel Blob through the quotation store instead of trusting already-loaded browser memory.
- Added duplicate code checks for categories and shipping methods.
- Replaced nested link/button markup with a shared `Button` that can render as a router link.
- Confirmed the production build succeeds with JavaScript and JSX only.
