"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function InternalServerErrorPage() {
  const router = useRouter();
  return (
    <div className="flex h-[calc(100svh-4rem)] items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-[7rem] leading-tight font-bold">500</h1>
        <span className="font-medium">
          Oops! Something went wrong {`:')`}
        </span>
        <p className="text-center text-muted-foreground">
          We apologize for the inconvenience. <br /> Please try again later.
        </p>
        <div className="mt-6 flex gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button onClick={() => router.push("/")}>Back to Home</Button>
        </div>
      </div>
    </div>
  );
}
