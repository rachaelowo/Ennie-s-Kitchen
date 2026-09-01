// Supabase Edge Function: send-order-receipt
//
// Sends an order-confirmation receipt email to the customer via Resend,
// after checkout has already saved the order and (separately) opened a
// mailto to notify the business. This function only handles the
// customer-facing receipt.
//
// Deploy: supabase functions deploy send-order-receipt
// Secrets (set once, via `supabase secrets set` or the Dashboard):
//   RESEND_API_KEY   - from resend.com (Settings -> API Keys)
//   RECEIPT_FROM     - e.g. "Ennieskitchen <receipts@ennieskitchen.com>"
//                      Must use a domain verified in Resend. Until a
//                      domain is verified, Resend will only deliver to
//                      the email address the Resend account was created
//                      with — real customer delivery starts working the
//                      moment the domain is verified, no code changes.

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface OrderItem {
  name: string;
  size: string;
  qty: number;
  price: number;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    const {
      customerEmail, customerName, phone, pickupTime,
      items, subtotal, tax, total, paymentMethod,
    } = await req.json();

    if (!customerEmail || typeof customerEmail !== "string" || !EMAIL_RE.test(customerEmail)) {
      return jsonResponse({ success: false, error: "Missing or invalid customer email." }, 400);
    }
    if (!Array.isArray(items)) {
      return jsonResponse({ success: false, error: "Missing order items." }, 400);
    }

    const apiKey = Deno.env.get("RESEND_API_KEY");
    const fromAddress = Deno.env.get("RECEIPT_FROM") ?? "Ennieskitchen <onboarding@resend.dev>";
    if (!apiKey) {
      return jsonResponse({ success: false, error: "Receipt email is not configured on the server." }, 500);
    }

    const money = (n: number) => `$${Number(n).toFixed(2)}`;
    const rows = (items as OrderItem[]).map(i =>
      `<tr><td style="padding:4px 0;">${escapeHtml(i.name)} (${escapeHtml(i.size)}) x${escapeHtml(String(i.qty))}</td><td style="text-align:right;">${money(i.price * i.qty)}</td></tr>`
    ).join("");

    const html = `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#3A2318;">
        <h2 style="color:#C1440E;">Thanks for your order, ${escapeHtml(customerName || "")}!</h2>
        <p>Here's your receipt from Ennieskitchen.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          ${rows}
          <tr><td style="padding-top:8px;">Subtotal</td><td style="text-align:right;padding-top:8px;">${money(subtotal)}</td></tr>
          <tr><td>Sales tax</td><td style="text-align:right;">${money(tax)}</td></tr>
          <tr><td style="font-weight:bold;padding-top:6px;border-top:1px solid #E4D5C0;">Total</td><td style="text-align:right;font-weight:bold;padding-top:6px;border-top:1px solid #E4D5C0;">${money(total)}</td></tr>
        </table>
        <p><strong>Pickup time:</strong> ${escapeHtml(pickupTime || "flexible")}<br>
        <strong>Payment method:</strong> ${escapeHtml(paymentMethod || "")}<br>
        <strong>Phone:</strong> ${escapeHtml(phone || "")}</p>
        <p style="color:#6B5142;font-size:13px;">Pickup only, in Gardena, CA. We'll confirm your order and reach out if anything needs adjusting.</p>
      </div>
    `;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [customerEmail],
        subject: "Your Ennieskitchen order receipt",
        html,
      }),
    });

    const data = await resendRes.json();
    if (!resendRes.ok) {
      return jsonResponse({ success: false, error: data?.message || "Receipt email failed to send." }, 400);
    }

    return jsonResponse({ success: true, id: data.id });
  } catch (err) {
    return jsonResponse({ success: false, error: "Unexpected server error." }, 500);
  }
});

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}
