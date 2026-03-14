"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { OtpType } from "@/generated/prisma/client";
import { sendOtpEmail } from "@/lib/email";
import { randomInt } from "crypto";

const OTP_EXPIRY_MINUTES = 10;
const RESET_TOKEN_EXPIRY_MINUTES = 15;

function generateOtp(): string {
  return randomInt(100_000, 999_999).toString();
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    return { error: "Email already in use" };
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const org = await prisma.organization.create({
    data: { name: `${data.name ?? data.email}'s Organization` },
  });

  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      hashedPassword,
      organizationId: org.id,
    },
  });

  const code = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  await prisma.verificationCode.create({
    data: { email: data.email, code, type: OtpType.Registration, expiresAt },
  });

  const result = await sendOtpEmail(data.email, code, "registration");
  if (!result.success) {
    return { error: "Failed to send verification email. Please try again." };
  }

  return { success: true as const, redirectTo: `/otp?email=${encodeURIComponent(data.email)}&type=registration` };
}

/** Send OTP for forgot password. */
export async function sendForgotPasswordOtp(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "If an account exists, we sent a code to your email." };
  }

  const code = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  await prisma.verificationCode.create({
    data: { email, code, type: OtpType.PasswordReset, expiresAt },
  });

  const result = await sendOtpEmail(email, code, "password_reset");
  if (!result.success) {
    return { error: "Failed to send email. Please try again." };
  }

  return { success: true as const, redirectTo: `/otp?email=${encodeURIComponent(email)}&type=password_reset` };
}

/** Verify OTP and return next step. */
export async function verifyOtp(email: string, code: string, type: "registration" | "password_reset") {
  const otpType = type === "registration" ? OtpType.Registration : OtpType.PasswordReset;
  const record = await prisma.verificationCode.findFirst({
    where: { email, code, type: otpType },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    return { error: "Invalid or expired code." };
  }
  if (record.expiresAt < new Date()) {
    return { error: "Code has expired. Please request a new one." };
  }

  await prisma.verificationCode.deleteMany({ where: { email, type: otpType } });

  if (type === "password_reset") {
    const token = randomInt(100_000, 999_999).toString(36) + Date.now().toString(36);
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000);
    await prisma.passwordResetToken.create({
      data: { email, token, expiresAt },
    });
    return { success: true as const, redirectTo: `/reset-password?token=${encodeURIComponent(token)}` };
  }

  return { success: true as const, redirectTo: "/sign-in?verified=1" };
}

/** Reset password using token from email link. */
export async function resetPassword(token: string, newPassword: string) {
  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
  });
  if (!record || record.expiresAt < new Date()) {
    return { error: "Invalid or expired link. Please request a new password reset." };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { email: record.email },
    data: { hashedPassword },
  });
  await prisma.passwordResetToken.delete({ where: { id: record.id } });
  return { success: true };
}

export async function authenticate(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
}
