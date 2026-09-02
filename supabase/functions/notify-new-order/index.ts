// Supabase Edge Function: notify-new-order
//
// Sends an immediate email to the business the moment a customer places
// an order — before any payment proof is checked or confirmed. This is
// separate from send-order-receipt (which goes to the CUSTOMER, and for
// Zelle/PayPal only fires once the admin manually confirms the order).
//
// Deploy: supabase functions deploy notify-new-order
// Secrets (reuses what's already set for send-order-receipt):
//   RESEND_API_KEY   - from resend.com
//   RECEIPT_FROM     - sender address, e.g. "Ennieskitchen <receipts@ennieskitchen.com>"
//   BUSINESS_EMAIL   - where the alert goes (defaults to Ennieskitchen259@gmail.com)

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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
      customerName, phone, customerEmail, pickupTime,
      items, subtotal, tax, total, paymentMethod,
    } = await req.json();

    if (!Array.isArray(items)) {
      return jsonResponse({ success: false, error: "Missing order items." }, 400);
    }

    const apiKey = Deno.env.get("RESEND_API_KEY");
    const fromAddress = Deno.env.get("RECEIPT_FROM") ?? "Ennieskitchen <onboarding@resend.dev>";
    const businessEmail = Deno.env.get("BUSINESS_EMAIL") ?? "Ennieskitchen259@gmail.com";
    if (!apiKey) {
      return jsonResponse({ success: false, error: "Order notifications are not configured on the server." }, 500);
    }

    const money = (n: number) => `$${Number(n).toFixed(2)}`;
    const rows = (items as OrderItem[]).map(i =>
      `<tr><td style="padding:4px 0;">${escapeHtml(i.name)} (${escapeHtml(i.size)}) x${escapeHtml(String(i.qty))}</td><td style="text-align:right;">${money(i.price * i.qty)}</td></tr>`
    ).join("");

    const paidByCard = paymentMethod === "card";
    const statusLine = paidByCard
      ? "Paid by card — already confirmed via Square."
      : "Awaiting payment proof — check WhatsApp, then confirm in the admin dashboard.";

    const html = `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#3A2318;">
        <h2 style="color:#C1440E;">New order from ${escapeHtml(customerName || "")}</h2>
        <p style="font-weight:bold;">${escapeHtml(statusLine)}</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          ${rows}
          <tr><td style="padding-top:8px;">Subtotal</td><td style="text-align:right;padding-top:8px;">${money(subtotal)}</td></tr>
          <tr><td>Sales tax</td><td style="text-align:right;">${money(tax)}</td></tr>
          <tr><td style="font-weight:bold;padding-top:6px;border-top:1px solid #E4D5C0;">Total</td><td style="text-align:right;font-weight:bold;padding-top:6px;border-top:1px solid #E4D5C0;">${money(total)}</td></tr>
        </table>
        <p><strong>Payment method:</strong> ${escapeHtml(paymentMethod || "")}<br>
        <strong>Pickup time:</strong> ${escapeHtml(pickupTime || "flexible")}<br>
        <strong>Phone:</strong> ${escapeHtml(phone || "")}<br>
        <strong>Email:</strong> ${escapeHtml(customerEmail || "")}</p>
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
        to: [businessEmail],
        subject: `New order from ${customerName || "a customer"} — ${money(total)}`,
        html,
      }),
    });

    const data = await resendRes.json();
    if (!resendRes.ok) {
      return jsonResponse({ success: false, error: data?.message || "Notification email failed to send." }, 400);
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
