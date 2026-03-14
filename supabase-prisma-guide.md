# Supabase + Prisma 7 + NextAuth v5 — Full Integration Guide

A step-by-step guide to wiring up a **Next.js 16** project with **Supabase PostgreSQL**, **Prisma 7**, and **NextAuth v5** (Auth.js) credentials authentication.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Install Dependencies](#2-install-dependencies)
3. [Environment Variables](#3-environment-variables)
4. [Prisma Setup (v7)](#4-prisma-setup-v7)
5. [Prisma Client Singleton](#5-prisma-client-singleton)
6. [NextAuth v5 Setup](#6-nextauth-v5-setup)
7. [Server Actions (Register & Login)](#7-server-actions-register--login)
8. [Root Layout Wiring](#8-root-layout-wiring)
9. [Project Config Files](#9-project-config-files)
10. [Common Gotchas](#10-common-gotchas)
11. [Useful Commands](#11-useful-commands)

---

## 1. Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- A Supabase project with PostgreSQL database
- A Next.js project initialized (`npx create-next-app@latest`)

---

## 2. Install Dependencies

```bash
# Prisma ORM + PostgreSQL adapter
pnpm add @prisma/adapter-pg @prisma/client pg dotenv
pnpm add -D prisma @types/pg

# NextAuth v5 + password hashing
pnpm add next-auth@beta bcryptjs
pnpm add -D @types/bcryptjs

# Allow Prisma build scripts (pnpm only)
# Add this to package.json manually — see section 9
```

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "postinstall": "prisma generate",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio"
  }
}
```

---

## 3. Environment Variables

Create a `.env` file in the project root. Prisma CLI reads `.env` (not `.env.local`).

```env
# Supabase connection pooling (port 6543) — used at runtime
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection (port 5432) — used for migrations/push
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-[REGION].pooler.supabase.com:5432/postgres"

# NextAuth secret — generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
AUTH_SECRET="your-generated-secret-here"
```

> **Important:** If your Supabase password contains special characters (`|`, `{`, `#`, `@`, etc.), you must URL-encode them:
>
> | Character | Encoded |
> |-----------|---------|
> | `\|`      | `%7C`   |
> | `{`       | `%7B`   |
> | `}`       | `%7D`   |
> | `#`       | `%23`   |
> | `@`       | `%40`   |

---

## 4. Prisma Setup (v7)

Prisma 7 introduced breaking changes. The `url` and `directUrl` fields are no longer set in `schema.prisma`. Instead, datasource URLs are configured in `prisma.config.ts`.

### `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User {
  id             String    @id @default(cuid())
  name           String?
  email          String    @unique
  emailVerified  DateTime?
  image          String?
  hashedPassword String?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}
```

Key changes from Prisma 6:
- Generator provider is `"prisma-client"` (not `"prisma-client-js"`)
- Output goes to `../generated/prisma` (outside `node_modules`)
- No `url` or `directUrl` in the datasource block

### `prisma.config.ts` (project root)

This file is **required in Prisma 7** for CLI operations (generate, push, migrate).

```typescript
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
```

### `package.json` — ESM + pnpm config

Prisma 7 requires ESM. Add these to `package.json`:

```json
{
  "type": "module",
  "pnpm": {
    "onlyBuiltDependencies": [
      "prisma",
      "@prisma/engines"
    ]
  }
}
```

### `.gitignore` — exclude generated client

```gitignore
# prisma
/generated/
```

### Push schema to database

```bash
pnpm db:push       # Sync schema to Supabase (no migration files)
pnpm db:generate   # Generate the Prisma client
```

---

## 5. Prisma Client Singleton

Prisma 7 uses driver adapters instead of built-in connection handling. The `PrismaPg` adapter connects to Supabase's connection pooler at runtime.

### `lib/prisma.ts`

```typescript
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

Why this pattern:
- **`PrismaPg` adapter**: Connects via `pg` driver to Supabase's pooler (port 6543)
- **Global singleton**: Prevents exhausting connections during Next.js hot reload in dev
- **Import path**: `@/generated/prisma/client` — the client is generated outside `node_modules`

---

## 6. NextAuth v5 Setup

NextAuth v5 (Auth.js) requires splitting the config into two files so the **middleware** (runs in Edge Runtime) doesn't import Prisma (Node.js-only).

### `auth.config.ts` — Edge-safe config (no Prisma)

```typescript
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isPublic =
        nextUrl.pathname.startsWith("/sign-in") ||
        nextUrl.pathname.startsWith("/sign-up") ||
        nextUrl.pathname.startsWith("/forgot-password") ||
        nextUrl.pathname.startsWith("/otp") ||
        nextUrl.pathname.startsWith("/api/auth");

      if (!isPublic) {
        if (isLoggedIn) return true;
        return false; // redirect to /sign-in
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [],
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;
```

### `auth.ts` — Full config with Prisma + Credentials

```typescript
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user?.hashedPassword) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword
        );

        if (!passwordMatch) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
});
```

### `middleware.ts` — Route protection

```typescript
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|images|sign-in|sign-up|forgot-password|otp).*)",
  ],
};
```

Why the split:
- `auth.config.ts` has **no Node.js imports** (no Prisma, no bcrypt) so it can run in Edge Runtime (middleware)
- `auth.ts` imports Prisma + bcrypt and runs only on the server (API routes, server components)
- Middleware uses `auth.config.ts` only, avoiding the "Node.js module in Edge Runtime" error

### `app/api/auth/[...nextauth]/route.ts`

```typescript
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
```

### `components/providers/session-provider.tsx`

```typescript
"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
```

---

## 7. Server Actions (Register & Login)

### `lib/actions.ts`

```typescript
"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    return { error: "Email already in use" };
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      hashedPassword,
    },
  });

  return { success: true };
}

export async function authenticate(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
}
```

Usage in a client component:

```typescript
// Sign in
import { signIn } from "next-auth/react";

const result = await signIn("credentials", {
  email: "user@example.com",
  password: "password123",
  redirect: false,
});

// Sign out
import { signOut } from "next-auth/react";
signOut({ callbackUrl: "/sign-in" });

// Access session
import { useSession } from "next-auth/react";
const { data: session } = useSession();
console.log(session?.user?.name);
```

---

## 8. Root Layout Wiring

### `app/layout.tsx`

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "@/components/providers/session-provider";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "My App",
  description: "My App Description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-sans antialiased", inter.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <TooltipProvider>
              {children}
              <Toaster richColors />
            </TooltipProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

Provider nesting order:
1. `ThemeProvider` (outermost — theme applies everywhere)
2. `SessionProvider` (NextAuth session context)
3. `TooltipProvider` (shadcn/ui tooltips)

---

## 9. Project Config Files

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

### Full `package.json`

```json
{
  "name": "my-app",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "eslint",
    "postinstall": "prisma generate",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/adapter-pg": "^7.5.0",
    "@prisma/client": "^7.5.0",
    "bcryptjs": "^3.0.3",
    "dotenv": "^17.3.1",
    "next": "16.1.6",
    "next-auth": "5.0.0-beta.30",
    "pg": "^8.20.0",
    "react": "19.2.3",
    "react-dom": "19.2.3"
  },
  "pnpm": {
    "onlyBuiltDependencies": [
      "prisma",
      "@prisma/engines"
    ]
  },
  "devDependencies": {
    "@types/bcryptjs": "^3.0.0",
    "@types/node": "^20",
    "@types/pg": "^8.18.0",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "prisma": "^7.5.0",
    "typescript": "^5"
  }
}
```

---

## 10. Common Gotchas

### Password special characters in Supabase URL
If your database password has `|`, `{`, `#`, etc., they must be URL-encoded in `.env`. A raw password like `o0T68w||{B6#_` becomes `o0T68w%7C%7C%7BB6%23_` in the connection string.

### Prisma 7 breaking changes from v6
| Prisma 6 | Prisma 7 |
|---|---|
| `provider = "prisma-client-js"` | `provider = "prisma-client"` |
| `url = env("DATABASE_URL")` in schema | Removed — use `prisma.config.ts` |
| Client imported from `@prisma/client` | Client imported from `@/generated/prisma/client` |
| Built-in connection handling | Requires driver adapter (`PrismaPg`) |
| No config file needed | `prisma.config.ts` required |

### Edge Runtime + Prisma
Prisma uses Node.js APIs (`node:path`, `node:buffer`, etc.) that don't work in Edge Runtime. Never import `@/lib/prisma` or `@/auth` (the full version) in middleware. Only import `auth.config.ts` in middleware.

### pnpm build scripts
pnpm blocks package build scripts by default. You must add `pnpm.onlyBuiltDependencies` to `package.json` to allow `prisma` and `@prisma/engines` to run their postinstall scripts.

### `"type": "module"` is required
Prisma 7 and `prisma.config.ts` require ESM. Add `"type": "module"` to `package.json`.

---

## 11. Useful Commands

```bash
# Push schema to database (no migration files)
pnpm db:push

# Create a migration
pnpm db:migrate

# Regenerate Prisma client after schema changes
pnpm db:generate

# Open Prisma Studio (visual database browser)
pnpm db:studio

# Generate a new AUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Full build (generates client + builds Next.js)
pnpm build
```

---

## File Tree Summary

```
├── .env                          # DATABASE_URL, DIRECT_URL, AUTH_SECRET
├── .gitignore                    # includes /generated/
├── package.json                  # "type": "module" + pnpm config
├── tsconfig.json
├── prisma.config.ts              # Prisma 7 CLI config (datasource URL)
├── prisma/
│   └── schema.prisma             # Models + generator + datasource
├── generated/
│   └── prisma/                   # Auto-generated (gitignored)
│       └── client.ts
├── lib/
│   ├── prisma.ts                 # Prisma client singleton with PrismaPg adapter
│   ├── actions.ts                # Server actions (register, authenticate)
│   └── utils.ts                  # cn() helper
├── auth.config.ts                # Edge-safe NextAuth config (no Prisma)
├── auth.ts                       # Full NextAuth config (Prisma + bcrypt)
├── middleware.ts                  # Route protection (uses auth.config.ts only)
├── components/
│   └── providers/
│       └── session-provider.tsx   # Client-side SessionProvider wrapper
├── app/
│   ├── layout.tsx                # Root layout with providers
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts      # NextAuth API route handler
│   ├── (auth)/                   # Public auth pages
│   │   ├── layout.tsx
│   │   ├── sign-in/
│   │   └── sign-up/
│   └── (dashboard)/              # Protected pages
│       ├── layout.tsx
│       └── page.tsx
```
