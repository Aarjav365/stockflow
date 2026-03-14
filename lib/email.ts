import { Resend } from "resend";

export async function sendOtpEmail(to: string, code: string, purpose: "registration" | "password_reset") {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[email] RESEND_API_KEY is not set");
    return { success: false as const, error: "Email service is not configured (missing API key)." };
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || "StockFlow <noreply@stock-flow.dev>";
  console.log("[email] Sending to:", to, "from:", fromEmail);

  if (fromEmail.includes("resend.dev")) {
    console.warn(
      "[email] Using resend.dev test domain — emails can only be sent to your own address. " +
      "Set RESEND_FROM_EMAIL to use your verified domain (e.g. noreply@stock-flow.dev)."
    );
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
      from: fromEmail,
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("[email] Resend API error:", JSON.stringify(error));
      return { success: false as const, error: error.message };
    }
    console.log("[email] Sent successfully, id:", data?.id);
    return { success: true as const, id: data?.id };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown email error";
    console.error("[email] Exception sending email:", msg);
    return { success: false as const, error: msg };
  }
}
