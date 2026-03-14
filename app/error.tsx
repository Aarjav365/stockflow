"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error?.message, error?.digest);
  }, [error]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background p-8 font-sans">
      <AlertCircle className="h-12 w-12 text-destructive" aria-hidden />
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="max-w-md text-center text-sm text-muted-foreground">
        An error occurred while rendering. In production builds the exact message is hidden.
        Ensure <code className="rounded bg-muted px-1">AUTH_SECRET</code> and{" "}
        <code className="rounded bg-muted px-1">DATABASE_URL</code> are set in your deployment
        environment, then redeploy and try again.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/sign-in">Go to sign in</Link>
        </Button>
      </div>
    </div>
  );
}
