<div align="center">

# StockFlow

**Enterprise-grade Warehouse & Inventory Management System**

Built with Next.js 16 &bull; PostgreSQL &bull; Prisma ORM &bull; Tailwind CSS

![Build Status](https://img.shields.io/badge/build-passing-brightgreen?logo=github-actions&logoColor=white)
![Uptime](https://img.shields.io/badge/uptime-99.9%25-brightgreen)
![Version](https://img.shields.io/badge/version-0.1.0-blue)
[![Website](https://img.shields.io/badge/Live-stock--flow.dev-0ea5e9?logo=vercel&logoColor=white)](https://stock-flow.dev)
[![License](https://img.shields.io/badge/License-Private-red)]()

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Private-red)]()
[![Website](https://img.shields.io/badge/Live-stock--flow.dev-0ea5e9?logo=vercel&logoColor=white)](https://stock-flow.dev)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Team](#team)

---

## Overview

StockFlow is a full-stack warehouse and inventory management platform designed for businesses that need real-time visibility into stock levels, document-driven operations, and multi-warehouse support. It provides a complete workflow for receiving goods, fulfilling deliveries, transferring stock between locations, and reconciling inventory through adjustments — all backed by a comprehensive stock ledger for full traceability.

---

## Features

### Inventory & Products
- Product catalog with SKU management, categories, and units of measure
- Real-time stock levels across multiple warehouses
- Low-stock alerts with configurable reorder thresholds
- Full stock ledger with audit trail for every quantity change

### Warehouse Operations
- **Receipts** — Receive goods from suppliers with line-level tracking (ordered vs. received)
- **Deliveries** — Fulfill customer orders with delivery document management
- **Transfers** — Move inventory between warehouses with from/to tracking
- **Adjustments** — Reconcile physical counts against recorded quantities
- **Move History** — Chronological ledger of all stock movements across the system

### Document Workflow
- Draft &rarr; Waiting &rarr; Ready &rarr; Done lifecycle for all operation types
- Auto-generated document numbers (REC-0001, DEL-0001, TRF-0001, ADJ-0001)
- Collision-safe numbering with automatic retry on concurrent creation

### Multi-Tenancy
- Organization-based data isolation
- Automatic organization provisioning for new users
- Scoped queries — users only see data belonging to their organization

### Authentication & Security
- Email/password authentication with bcrypt hashing
- OTP-based email verification via Resend
- Password reset flow with time-limited tokens
- JWT session strategy with middleware-enforced route protection

### User Experience
- Responsive sidebar layout with collapsible navigation
- Command palette for quick navigation (Ctrl+K)
- Dark/light/system theme support
- Toast notifications for all operations
- Data tables with sorting, filtering, and pagination

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Server Components, Server Actions) |
| **Language** | TypeScript 5 |
| **UI** | React 19, Tailwind CSS 4, shadcn/ui, Radix UI |
| **Data Tables** | TanStack Table v8 |
| **Charts** | Recharts |
| **Forms** | React Hook Form + Zod validation |
| **Database** | PostgreSQL (Supabase-hosted) |
| **ORM** | Prisma 7 |
| **Auth** | NextAuth.js v5 (Credentials provider, JWT strategy) |
| **Email** | Resend |
| **Package Manager** | pnpm |

---

## Architecture

```
Client (React 19)
    │
    ├── Server Components ──── Data fetching (read operations)
    │                              │
    │                              ▼
    ├── Server Actions ─────── Mutations (write operations)
    │                              │
    │                              ▼
    │                         Prisma ORM
    │                              │
    │                              ▼
    │                         PostgreSQL
    │
    ├── Middleware ─────────── Auth gate (JWT verification)
    │
    └── Resend API ────────── Transactional email (OTP)
```

**Key architectural decisions:**

- **Server Actions with structured results** — All mutations return `ActionResult<T>` (`{ success, data }` | `{ success, error }`) instead of throwing, ensuring graceful error handling in production where Next.js masks server-side exceptions.
- **Organization-scoped queries** — Every data access function resolves the current user's organization through a robust 3-level fallback (session &rarr; database lookup &rarr; auto-provision).
- **Collision-safe document numbering** — Document numbers are derived from the highest existing number (not count-based) with automatic retry on unique constraint violations.

---

## Getting Started

### Prerequisites

- **Node.js** &ge; 18.x
- **pnpm** &ge; 8.x
- **PostgreSQL** database (local or hosted — e.g., Supabase, Neon)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/stock-flow.git
cd stock-flow

# Production URL: https://stock-flow.dev

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and secrets (see below)

# Push the schema to your database
pnpm db:push

# Start the development server
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

| Variable | Description | Required |
|---|---|:---:|
| `DATABASE_URL` | PostgreSQL connection string (pooled) | Yes |
| `DIRECT_URL` | PostgreSQL direct connection (for migrations) | Yes |
| `AUTH_SECRET` | Random 256-bit hex string for NextAuth JWT signing | Yes |
| `RESEND_API_KEY` | API key from [resend.com](https://resend.com) | Yes |
| `RESEND_FROM_EMAIL` | Sender address, e.g. `"StockFlow <noreply@yourdomain.com>"` | Yes |

Generate an `AUTH_SECRET`:

```bash
openssl rand -hex 32
```

---

## Database

### Schema Overview

```
Organization
 ├── User
 ├── Category
 │    └── Product
 │         ├── StockLevel (per warehouse)
 │         └── StockLedgerEntry (audit trail)
 └── Warehouse
      ├── Receipt → ReceiptLine
      ├── DeliveryOrder → DeliveryLine
      ├── InternalTransfer → TransferLine
      └── StockAdjustment
```

### Commands

| Command | Description |
|---|---|
| `pnpm db:push` | Push schema changes to the database (no migration files) |
| `pnpm db:migrate` | Create and apply migration files |
| `pnpm db:generate` | Regenerate the Prisma client |
| `pnpm db:studio` | Open Prisma Studio (visual database browser) |

---

## Project Structure

```
stock-flow/
├── app/
│   ├── (auth)/                    # Auth pages (sign-in, sign-up, OTP, etc.)
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   ├── otp/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── (dashboard)/               # Protected dashboard pages
│   │   ├── page.tsx               # Dashboard home (stats, charts, alerts)
│   │   ├── products/              # Product catalog & stock levels
│   │   ├── operations/
│   │   │   ├── receipts/          # Goods receipt management
│   │   │   ├── deliveries/        # Customer delivery management
│   │   │   ├── transfers/         # Inter-warehouse transfers
│   │   │   ├── adjustments/       # Stock count adjustments
│   │   │   └── move-history/      # Full movement ledger
│   │   ├── settings/
│   │   │   ├── warehouses/        # Warehouse configuration
│   │   │   ├── account/
│   │   │   ├── appearance/
│   │   │   └── ...
│   │   └── layout.tsx             # Sidebar + top nav layout
│   ├── error.tsx                  # Global error boundary
│   └── layout.tsx                 # Root layout (providers, fonts)
├── components/
│   ├── ui/                        # shadcn/ui primitives
│   ├── layout/                    # Sidebar, header, nav components
│   ├── data-table/                # Reusable table components
│   └── ...                        # Feature-specific components
├── lib/
│   ├── inventory.ts               # Server actions (all CRUD + business logic)
│   ├── actions.ts                 # Auth actions (register, OTP, password reset)
│   ├── email.ts                   # Resend email integration
│   └── prisma.ts                  # Prisma client singleton
├── prisma/
│   └── schema.prisma              # Database schema
├── auth.ts                        # NextAuth configuration
├── auth.config.ts                 # Auth callbacks & route protection
└── middleware.ts                  # Auth middleware
```

---

## Deployment

### Build

```bash
pnpm build
```

This runs `prisma generate` followed by `next build`, producing an optimized production bundle.

### Production

```bash
pnpm start
```

### Hosting

StockFlow is optimized for deployment on platforms that support Next.js server-side rendering:

- **Vercel** (recommended) — Zero-config deployment. Add environment variables in Project Settings > Environment Variables.
- **Railway / Render** — Set environment variables in the service dashboard and use `pnpm build` as the build command.
- **Self-hosted** — Run `pnpm build && pnpm start` behind a reverse proxy (nginx, Caddy).

> **Important:** Environment variables defined in `.env` are **not** deployed. You must configure `DATABASE_URL`, `AUTH_SECRET`, `RESEND_API_KEY`, and `RESEND_FROM_EMAIL` directly in your hosting provider's environment variable settings.

---

## Team

| Name | Role |
|---|---|
| **Dhruv** | Developer |
| **Dhyey** | Developer |
| **Aarjav** | Developer |

---

<div align="center">

**StockFlow** &mdash; Inventory management, simplified.

[https://stock-flow.dev](https://stock-flow.dev)

</div>
