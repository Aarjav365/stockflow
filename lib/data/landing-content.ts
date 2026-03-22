import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Command,
  LayoutDashboard,
  Mail,
  Monitor,
  Shield,
} from "lucide-react";

/** Verticals / operator types StockFlow is built for */
export const partners = [
  "Retail",
  "Wholesale",
  "3PL",
  "Manufacturing",
  "E‑commerce",
] as const;

export const processSteps: {
  step: string;
  title: string;
  body: string;
}[] = [
  {
    step: "01",
    title: "Your organization, isolated",
    body: "Multi-tenant by design—every query is scoped to your org. New users land in their workspace automatically.",
  },
  {
    step: "02",
    title: "Documents that mirror the floor",
    body: "Receipts, deliveries, transfers, and adjustments share one lifecycle: Draft → Waiting → Ready → Done—with numbers like REC-0001, DEL-0001, TRF-0001, ADJ-0001.",
  },
  {
    step: "03",
    title: "Stock you can trust",
    body: "Real-time levels per warehouse, low-stock alerts with reorder thresholds, and a full ledger so every quantity change has a paper trail.",
  },
  {
    step: "04",
    title: "Built for daily ops",
    body: "Responsive shell with a collapsible sidebar, Ctrl+K command palette, sortable tables with filters, toasts for outcomes, and dark / light / system themes.",
  },
];

export const workShowcase: {
  title: string;
  tag: string;
  description: string;
  image: string;
}[] = [
  {
    title: "Stock ledger",
    tag: "Traceability",
    description:
      "Every receipt line, transfer, and adjustment writes to the ledger—audit-ready history without spreadsheets.",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80",
  },
  {
    title: "Warehouse operations",
    tag: "Receive & ship",
    description:
      "Match ordered vs received on inbound; manage outbound deliveries with the same document rigor.",
    image:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
  },
  {
    title: "Transfers & adjustments",
    tag: "Reconcile",
    description:
      "Move stock between locations or post adjustments when the floor count and the system disagree.",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
  },
];

export const stackItems: {
  title: string;
  detail: string;
  Icon: LucideIcon;
}[] = [
  {
    title: "Command palette",
    detail:
      "Jump to any page or action from the keyboard—built for people who work in flow, not nested menus.",
    Icon: Command,
  },
  {
    title: "Sidebar that breathes",
    detail:
      "Collapse it on the floor or a tablet; expand when you need the full map of warehouses and modules.",
    Icon: LayoutDashboard,
  },
  {
    title: "Themes that respect the shift",
    detail:
      "Light for the office, dark for the dock—plus system so handoffs between desk and floor feel natural.",
    Icon: Monitor,
  },
  {
    title: "Toasts that tell the truth",
    detail:
      "Receipt posted, transfer blocked, adjustment saved—clear outcomes so nobody is guessing what happened.",
    Icon: Bell,
  },
  {
    title: "Sessions you can enforce",
    detail:
      "JWT-backed auth with middleware on protected routes—less “oops, wrong tab” and more control.",
    Icon: Shield,
  },
  {
    title: "Email that unlocks access",
    detail:
      "OTP verification and password resets through Resend—smooth onboarding without a separate help desk.",
    Icon: Mail,
  },
];

export const faqItems: { q: string; a: string }[] = [
  {
    q: "How does multi-tenancy work?",
    a: "Each organization’s data is isolated. Users only see warehouses, products, and documents that belong to their org—queries are scoped automatically, and new signups can provision an organization without sharing a database row with anyone else.",
  },
  {
    q: "What operations can I run in StockFlow?",
    a: "Receipts (inbound from suppliers with line-level ordered vs received), deliveries (outbound to customers), transfers between warehouses, and adjustments to reconcile physical counts. All of them follow the same Draft → Waiting → Ready → Done workflow.",
  },
  {
    q: "How are document numbers generated?",
    a: "Numbers like REC-0001 or DEL-0001 are auto-generated per type. Creation is collision-safe with automatic retry if two users create documents at the same time.",
  },
  {
    q: "How does authentication work?",
    a: "Email and password with bcrypt hashing, OTP email verification through Resend, password reset with time-limited tokens, and JWT-based sessions with middleware enforcing protected routes.",
  },
  {
    q: "Can I see how stock changed over time?",
    a: "Yes. The stock ledger records every quantity change with context, and move history gives you a chronological view of activity across the system—so you can answer “what happened to this SKU?” without digging through emails.",
  },
];
