"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error?.message, error?.digest);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8">
      <AlertCircle className="h-12 w-12 text-destructive" />
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="max-w-md text-center text-sm text-muted-foreground">
        The dashboard couldn&apos;t load. This is often due to a missing or invalid environment
        variable in production (e.g. <code className="rounded bg-muted px-1">DATABASE_URL</code>,{" "}
        <code className="rounded bg-muted px-1">AUTH_SECRET</code>). Check your deployment logs for
        the exact error.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/sign-in">Sign in</Link>
        </Button>
      </div>
    </div>
  );
}
