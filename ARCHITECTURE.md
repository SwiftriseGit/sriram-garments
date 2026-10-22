# SriRam Garments (Swiftrise) — Architecture & Development Guide

> **Target Audience:** Future AI coding assistants and developers maintaining or extending this codebase.
> **Last Updated:** October 2026
> **Stack:** Next.js 16.3.6 (Turbopack, React 19), Tailwind CSS v4, shadcn UI (@base-ui/react), MongoDB (Mongoose), Cloudflare R2, Zustand.

---

## 1. Executive Architecture & Technology Stack

| Layer | Technology | Key Details |
|---|---|---|
| **Framework** | Next.js 16.3.6 (App Router) | React 19, Turbopack, React Compiler (`babel-plugin-react-compiler`), Cache Components enabled |
| **Database** | MongoDB Atlas via Mongoose 9 | Connection pooling via `lib/db.ts`, indexed models in `lib/models/` |
| **Object Storage** | Cloudflare R2 (S3-compatible) | S3 Presigner via `lib/r2.ts` and `actions/r2.ts`, public delivery via `/api/r2/[...key]` |
| **Authentication** | Stateless JWT (`jose` 6) | HTTP-only cookie (`sriram-session`), AES-256 HMAC-SHA256, 0 DB queries on navigation |
| **UI Primitives** | shadcn UI (`base-nova`) | Built on `@base-ui/react`, located in `components/ui/` |
| **Styling** | Tailwind CSS v4 | `@tailwindcss/postcss`, native CSS variables in `app/globals.css` |
| **Client State** | Zustand 5 | Cart (`sriram-cart`) and Wishlist (`sriram-wishlist`) persisted to `localStorage` |

---

## 2. Directory Structure & Organization

```
cloths/
├── actions/                  # Server Actions (mutations, auth, orders, products)
│   ├── addresses.ts          # Single source of truth for user address mutations
│   ├── auth.ts               # Login, signup, logout
│   ├── orders.ts             # Order creation, status updates, admin actions
│   ├── products.ts           # Product CRUD & updateTag("products") invalidation
│   ├── r2.ts                 # Presigned URL generation for Cloudflare R2
│   └── user.ts               # Profile updates and password changes
│
├── app/                      # Next.js 16 App Router
│   ├── (admin)/              # Route Group: Admin Portal (isolated shell & layout)
│   │   └── admin/            # /admin, /admin/products, /admin/orders, etc.
│   │
│   ├── (store)/              # Route Group: Public Storefront (SiteHeader, Footer)
│   │   ├── collections/      # /collections (filtering, sort, pagination)
│   │   ├── products/[slug]/  # /products/:slug (product detail, image carousel)
│   │   ├── profile/          # /profile, /orders, /addresses, /settings
│   │   ├── cart/ & checkout/ # /cart, /checkout
│   │   └── layout.tsx        # StoreLayout: TopBar, Suspense(SiteHeader), Footer
│   │
│   ├── api/                  # Route Handlers
│   │   ├── auth/me/          # GET: Stateless session verification for client
│   │   ├── r2/[...key]/      # GET: Proxy/stream R2 images
│   │   └── upload/           # POST: Multipart upload fallback
│   ├── error.tsx             # Root error boundary with deduplicated sonner toast
│   ├── globals.css           # Tailwind v4 theme & CSS design tokens
│   └── layout.tsx            # Root HTML & body shell, fonts, Sonner Toaster
│
├── components/               # React Components
│   ├── admin/                # Admin sidebar, header, data tables, image uploaders
│   ├── cart/                 # Cart components
│   ├── collections/          # Filters, pagination, facets, query providers
│   ├── product/              # ProductCard (auto-slide, dots, cart/wishlist buttons)
│   ├── profile/              # Profile forms, address manager, order cards
│   ├── ui/                   # shadcn UI components (dropdown-menu, sheet, button, etc.)
│   ├── SiteHeader.tsx        # Storefront navigation, search, wishlist & cart sheets
│   └── SiteFooter.tsx        # Storefront footer with SriRam branding
│
├── lib/                      # Core Logic & Utilities
│   ├── auth/                 # Stateless DAL (dal.ts), session encoding (session.ts)
│   ├── catalog/              # Catalog types, query parser/serializer, options
│   ├── data/                 # Cached DB queries: products.ts, orders.ts, admin.ts
│   ├── models/               # Mongoose Schemas: Product, User, Order, Address
│   ├── store/                # Zustand stores (cart.ts, wishlist.ts)
│   ├── db.ts                 # Mongoose cached connection singleton
│   ├── format.ts             # Currency and date formatters
│   └── utils.ts              # cn() utility helper
│
├── public/                   # Static assets (logo, icons, illustrations)
└── scripts/                  # Database migration and seed scripts (seed.ts)
```

---

## 3. Server Components vs Client Components

### Default Rule: Every file in `app/` is a Server Component unless specified.
- **Server Components (`async function Page()`)**:
  - Fetch data directly from MongoDB (`await getProducts()`, `await ProductModel.find()`).
  - Read cookies / headers directly on the server without client-side network roundtrips.
  - Zero client JavaScript bundle overhead.
- **Client Components (`"use client"` at the top)**:
  - Used **ONLY** when required:
    1. React Hooks (`useState`, `useEffect`, `useRef`, `useTransition`, `useOptimistic`).
    2. Event listeners (`onClick`, `onChange`, `onSubmit`).
    3. Browser APIs (`localStorage`, `window`, `navigator`).
    4. Zustand store hooks (`useCartStore`, `useWishlistStore`).

### The Leaf-Node Boundary Pattern
Do NOT mark whole page layouts as `"use client"`. Keep client components at the leaves of the tree:
```tsx
// ✅ CORRECT: Page is Server Component, renders fast static shell + passes data down
export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return (
    <div>
      <h1>{product.name}</h1>
      <ProductInteractiveArea product={product} /> {/* "use client" leaf */}
    </div>
  );
}
```

---

## 4. Why and How `<Suspense>` is Used (Next.js 16 Partial Prerendering)

Next.js 16 uses **Partial Prerendering (PPR)** and **Instant Navigation**.
If a Server Component reads dynamic request data outside `<Suspense>`:
- `await searchParams`
- `cookies()`
- `headers()`
- `connection()`

Next.js will throw a **Blocking Prerender / Dynamic Error** because the entire route becomes blocked from instant navigation.

### The Static Shell + Dynamic Slot Pattern
Always wrap dynamic parts in `<Suspense>` with a Skeleton fallback:
```tsx
// app/(store)/profile/page.tsx
export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* 1. Static shell renders INSTANTLY */}
      <h1 className="text-2xl font-bold">My Account</h1>
      
      {/* 2. Dynamic DB access isolated inside Suspense */}
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileDataLoader />
      </Suspense>
    </div>
  );
}

async function ProfileDataLoader() {
  const session = await verifySession(); // Reads cookies
  const user = await getUser(session.userId); // Reads DB
  return <ProfileForm user={user} />;
}
```

### Admin Routes Pattern (`export const instant = false`)
Admin routes are private, secure, and always require fresh runtime authentication. They should be explicitly marked as dynamic blocking routes:
```tsx
// app/(admin)/admin/orders/page.tsx
export const instant = false; // Tells Next.js 16 this route is dynamically rendered on demand
```

---

## 5. Caching & Revalidation Architecture

Next.js 16 uses the `'use cache'` directive instead of older `unstable_cache`.

### How Catalog Queries are Cached
In `lib/data/products.ts`:
```tsx
export async function getProducts(query: CollectionQuery): Promise<ProductPage> {
  "use cache";
  cacheLife("catalog"); // 5m fresh, 15m SWR window, 24h hard expire (next.config.ts)
  cacheTag("products"); // Tagged for instant invalidation

  await connectDB();
  const filter = buildMongoFilter(query);
  const sort = getMongoSort(query.sort);
  
  // Real MongoDB queries executed on server
  const total = await ProductModel.countDocuments(filter);
  const docs = await ProductModel.find(filter)
    .sort(sort)
    .skip((query.page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .lean();

  return { items: docs.map(toProduct), total, page: query.page, totalPages, pageSize: PAGE_SIZE };
}
```

### On-Demand Invalidation via Server Actions
Whenever products are created, modified, or deleted in the admin portal:
```tsx
// actions/products.ts
"use server";
import { updateTag } from "next/cache";

export async function saveProduct(formData: FormData) {
  await requireAdmin();
  // ... save product to MongoDB ...
  updateTag("products"); // Instantly purges cached catalog on edge
}
```

### What MUST NOT Be Cached
- **User sessions & auth checks**: Never cache per-user auth or cookies.
- **Cart & Wishlist**: Lives client-side in localStorage.
- **User orders & addresses**: Dynamic, fetched per authenticated user.

---

## 6. Authentication & Data Access Layer (DAL)

### Pure Stateless JWT Verification (0 DB Queries on Navigation)
Do **NOT** query MongoDB on every page hit or route navigation to check if a user is logged in.
- All essential identity data (`userId`, `email`, `role`, `firstName`) is embedded directly inside the signed JWT payload.
- In `lib/auth/dal.ts`:
```tsx
export const verifySession = async () => {
  const session = await getSession(); // jose jwtVerify() from HTTP-only cookie
  if (!session?.userId) redirect("/login");
  return { isAuth: true, userId: session.userId, role: session.role, firstName: session.firstName };
};

export const requireAdmin = async () => {
  const session = await verifySession();
  if (session.role !== "admin") redirect("/");
  return session;
};
```
- Only hit MongoDB when full profile documents are explicitly required (e.g., editing personal information via `getUser()`).

### Route Handler for Client Components (`/api/auth/me`)
Client components (like `SiteHeader.tsx`) check auth status via `/api/auth/me`. This route handler decodes the JWT cookie in memory and responds in `< 1ms` with 0 database queries.

---

## 7. Client-Side State: Cart, Wishlist & localStorage

- Stores are defined in `lib/store/cart.ts` and `lib/store/wishlist.ts` using Zustand with `persist`.
- **Unique Item Badge Rule**:
  - The cart badge count in `SiteHeader.tsx` must represent **unique items count** (`cartItems.length`), NOT total sum of quantities. (e.g., 2 shirts + 2 pants = badge count `2`).
  - Use `const cartItems = useCartStore((s) => s.items);` and calculate `cartCount = mounted ? cartItems.length : 0`.
- **Hydration Safe Pattern**:
  - Avoid hydration mismatches when reading from `localStorage` on initial render:
  ```tsx
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  <span suppressHydrationWarning>{mounted ? count : 0}</span>
  ```

---

## 8. shadcn UI & Component Guidelines

The project uses shadcn UI configured with `@base-ui/react` primitives in `components/ui/`.

### STRICT RULES FOR UI COMPONENTS:
1. **Never write manual DOM event listeners for UI primitives**:
   - ❌ **FORBIDDEN**: Writing `useEffect` with `document.addEventListener("mousedown", handleClick)` or `profileRef.contains(e.target)` to close dropdowns or popovers.
   - ✅ **MANDATORY**: Use shadcn's `<DropdownMenu>`, `<DropdownMenuTrigger>`, `<DropdownMenuContent>`, `<DropdownMenuItem>`.
2. **Never write manual slide-out overlays with `document.body.style.overflow = "hidden"`**:
   - ❌ **FORBIDDEN**: Creating custom fixed backdrops with translate CSS and body scroll locks.
   - ✅ **MANDATORY**: Use shadcn's `<Sheet>`, `<SheetTrigger>`, `<SheetContent>`.
3. **Always auto-close sheets/drawers on navigation**:
   - When placing `<Link>` inside `<SheetContent>`, provide `onClick={() => setIsOpen(false)}` so the drawer closes when the user navigates to `/checkout` or `/collections`.
4. **Never show disruptive toast notifications on basic card clicks**:
   - Clicking "Add to Cart" or "Wishlist" on a product card must provide instant visual feedback (e.g. checkmark `✓` or filled heart icon), without popping up multiple toast notifications.

---

## 9. Product Card Image Slideshow Architecture

In `components/product/ProductCard.tsx`:
- When a product has multiple images (`images.length > 1`):
  1. An automatic slideshow smoothly translates the images horizontally in a continuous loop (`translate-x-[index * 100%]`).
  2. **Hover Pause**: Moving the mouse over the product card immediately pauses the autoplay timer (`onMouseEnter={() => setIsHovered(true)}`), allowing the customer to examine the garment.
  3. **Lower-Middle Dots**: Centered dots overlay (`bottom-2.5 left-1/2 -translate-x-1/2`) indicates the active slide with an elongated white pill and allows manual clicking between images without navigating away.

---

## 10. Rules for Future AIs & Developers (Checklist)

Whenever adding or modifying code in this repository, you **MUST** adhere to these 10 commandments:

1. **Keep Auth Stateless**: Never add database queries to `dal.ts` or `session.ts` for simple session checks.
2. **Respect Suspense**: Always wrap dynamic page sections (`searchParams`, user cookies) in `<Suspense fallback={<Skeleton />}>`.
3. **Use shadcn Primitives**: Never invent custom dropdowns, dialogs, or drawers. Run `pnpm dlx shadcn add <component>` if a primitive is missing.
4. **Deduplicate Actions**: Do not create duplicate server actions. Address mutations must live exclusively in `actions/addresses.ts`.
5. **Preserve Embedded Snapshots**: Order line items in `Order.ts` must remain independent embedded snapshots (`name`, `price`, `image`, `color`, `size`) so future product edits or deletions never corrupt historical order records.
6. **No Client Filtering on Collections**: The `/collections` page must always query MongoDB via URL query parameters (`category`, `size`, `price`, `availability`, `sort`, `page`). Never fetch all products and `.filter()` in client memory.
7. **Maintain Responsive Image Layouts**: Always provide `sizes` and `priority` on Next.js `<Image>` components, and ensure parent containers have `relative` and explicit aspect ratios.
8. **Deduplicate Error Boundaries**: Avoid mounting duplicate toasts in `error.tsx` by using a unique toast ID (e.g. `toast.error(message, { id: "root-error" })`).
9. **Keep Types in Sync**: Any new field added to a Mongoose model must be reflected in `lib/catalog/types.ts` and `toProduct()` conversion functions.
10. **Verify Build**: Always run `pnpm exec tsc --noEmit` and `pnpm run build` after changes to verify all 40+ routes compile cleanly without any regression.
