import { Button } from "@/components/ui/button";

export default function MaintenanceErrorPage() {
  return (
    <div className="flex h-[calc(100svh-4rem)] items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-[7rem] leading-tight font-bold">503</h1>
        <span className="font-medium">Website is under maintenance!</span>
        <p className="text-center text-muted-foreground">
          The site is not available at the moment. <br />
          We&apos;ll be back online shortly.
        </p>
        <div className="mt-6 flex gap-4">
          <Button variant="outline">Learn more</Button>
        </div>
      </div>
    </div>
  );
}
