"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod/v3";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { resetPassword } from "@/lib/actions";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/password-input";

const formSchema = z
  .object({
    password: z
      .string()
      .min(7, "Password must be at least 7 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!token) {
      toast.error("Invalid link. Please use the link from your email.");
      return;
    }
    setIsLoading(true);
    const result = await resetPassword(token, data.password);
    if (result.error) {
      toast.error(result.error);
      setIsLoading(false);
      return;
    }
    toast.success("Password updated. You can sign in now.");
    router.push("/sign-in");
  }

  if (!token) {
    return (
      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="text-lg tracking-tight">
            Invalid link
          </CardTitle>
          <CardDescription>
            This link is missing or invalid. Please request a new password reset
            from the forgot password page.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link href="/forgot-password">Forgot password</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-lg tracking-tight">
          Set new password
        </CardTitle>
        <CardDescription>
          Enter your new password below. You will be redirected to sign in after
          saving.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-2" disabled={isLoading}>
              {isLoading && <Loader2 className="animate-spin" />}
              Update password
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="mx-auto text-center text-sm text-muted-foreground">
          <Link href="/sign-in" className="underline underline-offset-4 hover:text-primary">
            Back to sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
