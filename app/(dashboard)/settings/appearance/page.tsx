"use client";

import { useTheme } from "next-themes";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ContentSection } from "../content-section";

export default function SettingsAppearancePage() {
  const { theme, setTheme } = useTheme();

  return (
    <ContentSection
      title="Appearance"
      desc="Customize the appearance of the app. Automatically switch between day and night themes."
    >
      <div className="space-y-6">
        <div className="space-y-1">
          <label className="text-sm font-medium">Theme</label>
          <p className="text-sm text-muted-foreground">
            Select the theme for the dashboard.
          </p>
        </div>
        <div className="grid max-w-md grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => {
              setTheme("light");
              toast.success("Theme set to light");
            }}
            className={cn(
              "flex flex-col items-center gap-2 rounded-md border-2 p-4",
              theme === "light" ? "border-primary" : "border-muted"
            )}
          >
            <div className="w-full space-y-2 rounded-sm bg-[#ecedef] p-2">
              <div className="space-y-1 rounded-md bg-white p-2 shadow-sm">
                <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
              </div>
              <div className="flex items-center gap-1 rounded-md bg-white p-2 shadow-sm">
                <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
              </div>
            </div>
            <span className="text-xs font-medium">Light</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTheme("dark");
              toast.success("Theme set to dark");
            }}
            className={cn(
              "flex flex-col items-center gap-2 rounded-md border-2 p-4",
              theme === "dark" ? "border-primary" : "border-muted"
            )}
          >
            <div className="w-full space-y-2 rounded-sm bg-slate-950 p-2">
              <div className="space-y-1 rounded-md bg-slate-800 p-2 shadow-sm">
                <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
              </div>
              <div className="flex items-center gap-1 rounded-md bg-slate-800 p-2 shadow-sm">
                <div className="h-4 w-4 rounded-full bg-slate-400" />
                <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
              </div>
            </div>
            <span className="text-xs font-medium">Dark</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTheme("system");
              toast.success("Theme set to system");
            }}
            className={cn(
              "flex flex-col items-center gap-2 rounded-md border-2 p-4",
              theme === "system" ? "border-primary" : "border-muted"
            )}
          >
            <div className="w-full overflow-hidden rounded-sm">
              <div className="flex">
                <div className="w-1/2 space-y-2 bg-[#ecedef] p-2">
                  <div className="rounded-md bg-white p-1 shadow-sm">
                    <div className="h-2 w-full rounded-lg bg-[#ecedef]" />
                  </div>
                </div>
                <div className="w-1/2 space-y-2 bg-slate-950 p-2">
                  <div className="rounded-md bg-slate-800 p-1 shadow-sm">
                    <div className="h-2 w-full rounded-lg bg-slate-400" />
                  </div>
                </div>
              </div>
            </div>
            <span className="text-xs font-medium">System</span>
          </button>
        </div>
        <Button onClick={() => toast.success("Appearance settings saved")}>
          Update preferences
        </Button>
      </div>
    </ContentSection>
  );
}
