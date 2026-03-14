import { Resend } from "resend";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "StockFlow <onboarding@resend.dev>";

export async function sendOtpEmail(to: string, code: string, purpose: "registration" | "password_reset") {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[email] RESEND_API_KEY is not set");
    return { success: false as const, error: "Email service is not configured (missing API key)." };
  }

  const resend = new Resend(apiKey);

  const subject =
    purpose === "registration"
      ? "Verify your StockFlow account"
      : "Your StockFlow password reset code";
  const html = `
    <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto;">
      <h2>${purpose === "registration" ? "Verify your email" : "Password reset"}</h2>
      <p>Your verification code is:</p>
      <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px;">${code}</p>
      <p style="color: #666;">This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("[email] Resend API error:", JSON.stringify(error));
      return { success: false as const, error: error.message };
    }
    return { success: true as const, id: data?.id };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown email error";
    console.error("[email] Exception sending email:", msg);
    return { success: false as const, error: msg };
  }
}
