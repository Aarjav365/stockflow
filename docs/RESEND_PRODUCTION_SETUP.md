# Resend production setup – step-by-step

Follow these steps to send OTP emails from your own domain in production.

---

## Part 1: Resend dashboard

### Step 1: Log in to Resend

1. Go to [https://resend.com](https://resend.com) and sign in (or create an account).
2. Open the [Resend Dashboard](https://resend.com/overview).

### Step 2: Add your domain

1. In the left sidebar, click **Domains** (or go to [https://resend.com/domains](https://resend.com/domains)).
2. Click **Add Domain**.
3. Enter your production domain: `stack-flow.dev` (no `www`, no `https://`).
4. Click **Add** (or **Verify**).

### Step 3: Add DNS records

1. Resend will show you **DNS records** to add (SPF, DKIM, sometimes others).
2. Open your **DNS provider** (where you manage your domain: Cloudflare, Namecheap, GoDaddy, Vercel Domains, etc.).
3. For each record Resend shows, create a matching record:
  **Example (your values will differ):**

  | Type | Name / Host         | Value / Content                  |
  | ---- | ------------------- | -------------------------------- |
  | TXT  | `resend._domainkey` | (long string Resend gives you)   |
  | TXT  | `@` or your domain  | `v=spf1 include:resend.com ~all` |

4. Copy the **exact** Name and Value from Resend into your DNS.
5. Save the records at your DNS provider.

### Step 4: Verify the domain

1. Back in Resend → **Domains**, find your domain.
2. Click **Verify** (or wait; some providers auto-refresh).
3. DNS can take from a few minutes up to 24–48 hours. When status is **Verified**, you can send from that domain.

---

## Part 2: Production environment variables

### Step 5: Set env vars where the app runs

In your **production** host (e.g. Vercel, Railway, Render):

1. Open the project → **Settings** → **Environment Variables** (or **Config**).
2. Add or edit:
  **Required:**

  | Name                | Value                                    | Notes                    |
  | ------------------- | ---------------------------------------- | ------------------------ |
  | `RESEND_API_KEY`    | `re_xxxxxxxxxxxx`                        | From Resend → API Keys   |
  | `RESEND_FROM_EMAIL` | `CoreInventory <noreply@stack-flow.dev>` | Use your verified domain |

   For your domain use: `CoreInventory <noreply@stack-flow.dev>`. The part before `@` (e.g. `noreply`) can be anything you like (e.g. `info`, `hello`).
3. Save. Redeploy the app if your platform doesn’t auto-redeploy on env changes.

### Step 6: Get your API key (if needed)

1. In Resend: [API Keys](https://resend.com/api-keys).
2. Click **Create API Key**.
3. Name it (e.g. “Production”).
4. Copy the key (starts with `re_`) and paste it into `RESEND_API_KEY` in production. You can use the same key for dev and prod or create a separate one for prod.

---

## Part 3: Quick checks

### Step 7: Confirm in Resend

- **Domains:** Your domain status is **Verified**.
- **API Keys:** The key you use in production exists and is not revoked.

### Step 8: Test in production

1. Deploy the app with the env vars above.
2. On the live app: sign up with a real email or use “Forgot password.”
3. Check that the email arrives and that the **From** address is `noreply@stack-flow.dev` (or whatever you set in `RESEND_FROM_EMAIL`).

---

## Summary checklist

- Domain added in Resend → Domains  
- All DNS records (SPF, DKIM, etc.) added at your DNS provider  
- Domain status in Resend = **Verified**  
- `RESEND_API_KEY` set in production  
- `RESEND_FROM_EMAIL=CoreInventory <noreply@stack-flow.dev>` set in production  
- App redeployed after changing env vars  
- Tested sign-up or forgot-password email in production

---

## Troubleshooting

- **Emails not sending:** Check Resend → Logs for errors; confirm `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in production.
- **Domain not verifying:** Wait up to 48 hours; double-check DNS name/value and that you’re editing the correct zone (root vs subdomain).
- **Still using [onboarding@resend.dev](mailto:onboarding@resend.dev):** `RESEND_FROM_EMAIL` is not set or not loaded in production; redeploy after setting it.

