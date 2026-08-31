// Supabase Edge Function: create-square-payment
//
// Receives a Square card nonce (source_id) and an amount from the
// checkout page, then charges the card via Square's Payments API
// using the secret Access Token (kept server-side as a function
// secret — never exposed to the browser).
//
// Deploy: supabase functions deploy create-square-payment
// Secrets (set once, via `supabase secrets set` or the Dashboard):
//   SQUARE_ACCESS_TOKEN  - from developer.squareup.com, Sandbox or Production tab
//   SQUARE_LOCATION_ID   - same page, must match js/square-config.js
//   SQUARE_ENVIRONMENT   - "sandbox" or "production"

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    const { sourceId, amount, currency, orderNote } = await req.json();

    if (!sourceId || typeof sourceId !== "string") {
      return jsonResponse({ success: false, error: "Missing card token." }, 400);
    }
    const amountCents = Math.round(Number(amount));
    if (!Number.isFinite(amountCents) || amountCents <= 0) {
      return jsonResponse({ success: false, error: "Invalid amount." }, 400);
    }

    const accessToken = Deno.env.get("SQUARE_ACCESS_TOKEN");
    const locationId = Deno.env.get("SQUARE_LOCATION_ID");
    const environment = Deno.env.get("SQUARE_ENVIRONMENT") ?? "sandbox";
    if (!accessToken || !locationId) {
      return jsonResponse({ success: false, error: "Square is not configured on the server." }, 500);
    }

    const apiBase = environment === "production"
      ? "https://connect.squareup.com"
      : "https://connect.squareupsandbox.com";

    const squareRes = await fetch(`${apiBase}/v2/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "Square-Version": "2025-01-23",
      },
      body: JSON.stringify({
        source_id: sourceId,
        idempotency_key: crypto.randomUUID(),
        location_id: locationId,
        amount_money: { amount: amountCents, currency: currency || "USD" },
        note: orderNote ? String(orderNote).slice(0, 500) : "Ennieskitchen order",
      }),
    });

    const data = await squareRes.json();

    if (!squareRes.ok) {
      const message = data?.errors?.[0]?.detail || "Payment was declined.";
      return jsonResponse({ success: false, error: message }, 400);
    }

    return jsonResponse({ success: true, paymentId: data.payment?.id });
  } catch (err) {
    return jsonResponse({ success: false, error: "Unexpected server error." }, 500);
  }
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}
