# ORA PARFUM

عطور فاخرة — Luxury Perfume E-Commerce Website

ORA PARFUM is a premium Arabic-only e-commerce platform for a luxury Moroccan perfume brand. Built with Next.js 16 and featuring a complete shopping experience with WhatsApp-based ordering.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Icons:** React Icons
- **Auth:** Jose (JWT for admin dashboard)
- **Font:** Cairo (Google Fonts)

## Features

### Customer
- Arabic-only RTL interface
- Product browsing with search, filters, and sorting
- Product details page with full information
- Shopping cart with localStorage persistence
- Cart side drawer (opens from header cart icon)
- WhatsApp checkout with auto-generated order message
- Floating WhatsApp contact button
- Fully responsive (desktop, tablet, mobile)

### Admin Dashboard
- Secure login with JWT authentication
- Dashboard overview with statistics
- Product management (CRUD)
- Order management with status tracking
- WhatsApp message/order management
- Site settings configuration

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Admin Access

Navigate to `/admin/login` and sign in with:

- **Username:** `admin`
- **Password:** `ora2024`

## Build

```bash
# Production build
npm run build

# Start production server
npm run start
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── admin/        # Admin dashboard pages
│   ├── api/          # API routes
│   ├── cart/         # Cart page
│   ├── contact/      # Contact page
│   ├── product/      # Product details page
│   └── store/        # Shop / products listing
├── components/       # Reusable UI components
├── context/          # React contexts (Cart)
├── data/             # Mock product data
├── lib/              # Utility functions
└── types/            # TypeScript type definitions
```

## Deployment

### Deploy to Vercel

1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **Add New** → **Project**.
4. Import your GitHub repository.
5. Configure environment variables (if any):
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` — WhatsApp business number
6. Click **Deploy**.

The build command and output directory are auto-detected by Vercel.

## WhatsApp Order Flow

1. Customer browses products and adds to cart.
2. Opens cart drawer and clicks "شراء عبر واتساب".
3. WhatsApp opens with a pre-formatted order message.
4. Admin receives the order and can manage it from the dashboard.

## License

Private — All rights reserved. ORA PARFUM
