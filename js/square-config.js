/* ---------------- SQUARE CONFIG ----------------
   From developer.squareup.com -> your application -> Sandbox or
   Production tab. SQUARE_APP_ID and SQUARE_LOCATION_ID are public
   and safe to expose in client code.

   The secret Access Token must NEVER go here — it lives only as a
   Supabase Edge Function secret. See supabase/functions/create-square-payment.

   Start with "sandbox" + your Sandbox Application ID/Location ID to
   test with fake cards before switching to "production" + your live
   Application ID/Location ID. */
const SQUARE_APP_ID = "sq0idp-3WMY3kHz3ueAelT8O7Kciw";
const SQUARE_LOCATION_ID = "LWNM7NXKJRADC";
const SQUARE_ENVIRONMENT = "production"; // "sandbox" or "production"

/* The URL of your deployed Supabase Edge Function, e.g.
   https://YOUR-PROJECT-REF.supabase.co/functions/v1/create-square-payment */
const SQUARE_PAYMENT_ENDPOINT = "https://athnfiatmzrwigoblafr.supabase.co/functions/v1/create-square-payment";

/* Your Supabase anon public key (same one used in js/reviews-config.js) —
   Edge Functions require this as a bearer token even for public calls. */
const SQUARE_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0aG5maWF0bXpyd2lnb2JsYWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDYxNDksImV4cCI6MjEwMzcyMjE0OX0.T7awDW-zTn5TEH649AGQTGPnJCrAKR9eIKdz7aeU2EY";
