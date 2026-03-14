import {
  LayoutDashboard,
  Package,
  Settings,
  UserCog,
  Wrench,
  Palette,
  Bell,
  Monitor,
  ShieldCheck,
  Bug,
  Lock,
  UserX,
  FileX,
  ServerOff,
  Construction,
  Command,
  AudioWaveform,
  PackagePlus,
  PackageMinus,
  ArrowLeftRight,
  ClipboardList,
  History,
  Warehouse,
} from "lucide-react";
import { type SidebarData } from "../types";

export const sidebarData: SidebarData = {
  user: {
    name: "StockFlow",
    email: "admin@StockFlow.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "StockFlow",
      logo: Command,
      plan: "Inventory Management",
    },
  ],
  navGroups: [
    {
      title: "Main",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: LayoutDashboard,
        },
        {
          title: "Products",
          url: "/products",
          icon: Package,
        },
        {
          title: "Operations",
          icon: ClipboardList,
          items: [
            {
              title: "Receipts",
              url: "/operations/receipts",
              icon: PackagePlus,
            },
            {
              title: "Delivery Orders",
              url: "/operations/deliveries",
              icon: PackageMinus,
            },
            {
              title: "Internal Transfers",
              url: "/operations/transfers",
              icon: ArrowLeftRight,
            },
            {
              title: "Inventory Adjustment",
              url: "/operations/adjustments",
              icon: Wrench,
            },
            {
              title: "Move History",
              url: "/operations/move-history",
              icon: History,
            },
          ],
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          title: "Settings",
          icon: Settings,
          items: [
            {
              title: "Warehouse",
              url: "/settings/warehouses",
              icon: Warehouse,
            },
            {
              title: "Profile",
              url: "/settings",
              icon: UserCog,
            },
            {
              title: "Account",
              url: "/settings/account",
              icon: Wrench,
            },
            {
              title: "Appearance",
              url: "/settings/appearance",
              icon: Palette,
            },
            {
              title: "Notifications",
              url: "/settings/notifications",
              icon: Bell,
            },
            {
              title: "Display",
              url: "/settings/display",
              icon: Monitor,
            },
          ],
        },
      ],
    },
    {
      title: "Pages",
      items: [
        {
          title: "Auth",
          icon: ShieldCheck,
          items: [
            { title: "Sign In", url: "/sign-in" },
            { title: "Sign Up", url: "/sign-up" },
            { title: "Forgot Password", url: "/forgot-password" },
            { title: "OTP", url: "/otp" },
          ],
        },
        {
          title: "Errors",
          icon: Bug,
          items: [
            { title: "Unauthorized", url: "/errors/unauthorized", icon: Lock },
            { title: "Forbidden", url: "/errors/forbidden", icon: UserX },
            { title: "Not Found", url: "/errors/not-found", icon: FileX },
            {
              title: "Internal Server Error",
              url: "/errors/internal-server-error",
              icon: ServerOff,
            },
            {
              title: "Maintenance Error",
              url: "/errors/maintenance-error",
              icon: Construction,
            },
          ],
        },
      ],
    },
  ],
};
