import { cookies } from "next/headers";
import { cn } from "@/lib/utils";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { CommandPalette } from "@/components/command-palette";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden @container/content"
        )}
      >
        {children}
        <CommandPalette />
      </SidebarInset>
    </SidebarProvider>
  );
}
