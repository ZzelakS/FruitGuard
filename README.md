# FruitGuard — Next.js 14 E-Commerce

Premium cold-pressed organic juice storefront with authenticated admin panel and Firebase Firestore product management.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Firebase Firestore |
| Auth | JWT via `jose` (HTTP-only cookies) |
| Charts | Recharts |
| Icons | Lucide React |
| Animations | CSS transitions + IntersectionObserver |

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Firebase
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Firestore Database** (start in test mode for development)
4. Go to **Project Settings → Your Apps → Web App** and copy your config

### 3. Configure environment variables
```bash
cp .env.example .env.local
```
Fill in your Firebase credentials and JWT secret in `.env.local`.

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Pages

### Storefront
| Route | Description |
|---|---|
| `/` | Home — hero, featured products (live from Firestore), why us, testimonials |
| `/products` | Full catalogue — sidebar filters, sort, grid/list view |
| `/about` | Brand story, timeline, team, values, certifications |
| `/contact` | Contact form, info cards, animated FAQ accordion |
| `/checkout` | Multi-step checkout with 4 payment methods |
| `/success` | Order confirmation with reference number |

### Admin (JWT-protected)
| Route | Description |
|---|---|
| `/admin/login` | Animated login page |
| `/admin/dashboard` | KPI cards, revenue chart, recent orders, quick actions |
| `/admin/products` | **Firebase CRUD** — add, edit, delete products with live sync |
| `/admin/orders` | Orders table with status filter and detail modal |
| `/admin/customers` | Customer table with tier classification |

---

## Admin Credentials

| Field | Value |
|---|---|
| Email | `admin@fruitguard.com` |
| Password | `FruitGuard@2025` |

---

## Firebase Setup (Firestore)

Products are stored in a `products` collection. Each document has these fields:

```
name        string
desc        string
price       number
category    'citrus' | 'tropical' | 'berry' | 'green' | 'blend'
badge       'hot' | 'new' | 'sale' | ''
rating      number  (1–5)
reviews     number
stock       number
createdAt   timestamp
```

**To seed initial data:** Go to `/admin/products` and click the **"Seed Data"** button (only shown when the collection is empty).

### Firestore Security Rules (recommended)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{doc} {
      allow read: if true;         // public reads for storefront
      allow write: if false;       // writes only via admin (server-side in production)
    }
  }
}
```

---

## Project Structure

```
fruitguard-next/
├── app/
│   ├── page.tsx                    # Home
│   ├── products/page.tsx           # Products catalogue
│   ├── about/page.tsx              # About us
│   ├── contact/page.tsx            # Contact
│   ├── checkout/page.tsx           # Checkout
│   ├── success/page.tsx            # Order confirmed
│   ├── layout.tsx                  # Root layout (CartProvider, fonts)
│   ├── globals.css                 # Tailwind + animation utilities
│   ├── api/auth/
│   │   ├── login/route.ts          # POST: validate + set JWT cookie
│   │   └── logout/route.ts         # POST: clear cookie
│   └── admin/
│       ├── layout.tsx              # Checks session, renders sidebar
│       ├── login/page.tsx          # Animated login form
│       ├── dashboard/page.tsx
│       ├── products/page.tsx       # Firebase CRUD
│       ├── orders/page.tsx
│       └── customers/page.tsx
├── components/
│   ├── shop/
│   │   ├── Navbar.tsx              # Desktop nav + mobile hamburger/offcanvas
│   │   ├── CartDrawer.tsx          # Slide-in cart
│   │   ├── ProductCard.tsx
│   │   ├── HomeClient.tsx          # Home page content (live Firebase)
│   │   ├── ProductsClient.tsx      # Products page (live Firebase)
│   │   ├── AboutContent.tsx        # About page with scroll animations
│   │   ├── ContactContent.tsx      # Contact form + FAQ accordion
│   │   ├── CheckoutClient.tsx      # Checkout form (cart context)
│   │   ├── SuccessClient.tsx       # Order confirmation
│   │   └── Footer.tsx
│   └── admin/
│       ├── AdminSidebar.tsx
│       ├── DashboardCharts.tsx     # Recharts area + bar chart
│       ├── ProductsTable.tsx       # Firebase CRUD table + modal
│       ├── OrdersTable.tsx
│       └── CustomersTable.tsx
├── context/
│   └── CartContext.tsx             # Global cart state
├── lib/
│   ├── firebase.ts                 # Firebase app init
│   ├── products.ts                 # Firestore CRUD + types
│   ├── auth.ts                     # JWT helpers
│   └── data.ts                     # Static mock data (orders, customers)
└── middleware.ts                   # Protects all /admin/* routes
```

---

## Deployment (Vercel)

```bash
npm i -g vercel
vercel
```

Add all `.env.local` variables to your Vercel project's Environment Variables.

