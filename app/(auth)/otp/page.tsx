"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod/v3";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { verifyOtp } from "@/lib/actions";

const formSchema = z.object({
  otp: z.string().min(6, "Please enter the 6-digit code"),
});

function OTPForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const type = (searchParams.get("type") ?? "registration") as "registration" | "password_reset";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: "" },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!email) {
      toast.error("Missing email. Please start from sign up or forgot password.");
      return;
    }
    setIsLoading(true);
    const result = await verifyOtp(email, data.otp, type);
    if (result.error) {
      toast.error(result.error);
      setIsLoading(false);
      return;
    }
    toast.success(type === "password_reset" ? "Code verified. Set your new password." : "Email verified. You can sign in.");
    if (result.redirectTo) router.push(result.redirectTo);
  }

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-base tracking-tight">
          Enter verification code
        </CardTitle>
        <CardDescription>
          Please enter the 6-digit code we sent to {email || "your email"}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-3"
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-2" disabled={isLoading}>
              {isLoading && <Loader2 className="animate-spin" />}
              Verify
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="px-8 text-center text-sm text-muted-foreground">
          Haven&apos;t received it?{" "}
          <Link
            href={type === "password_reset" ? "/forgot-password" : "/sign-up"}
            className="underline underline-offset-4 hover:text-primary"
          >
            {type === "password_reset" ? "Try forgot password again" : "Back to sign up"}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default function OTPPage() {
  return (
    <Suspense fallback={<div className="flex min-h-svh items-center justify-center p-6">Loading...</div>}>
      <OTPForm />
    </Suspense>
  );
}
