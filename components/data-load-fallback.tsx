import Link from "next/link";

export function DataLoadFallback({ pageName = "page" }: { pageName?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8">
      <p className="text-sm text-muted-foreground">
        Unable to load {pageName}. Check DATABASE_URL and AUTH_SECRET in your deployment environment.
      </p>
      <Link href="/dashboard" className="text-sm text-primary underline">
        Try again
      </Link>
    </div>
  );
}
