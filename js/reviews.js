/* ---------------- CUSTOMER REVIEWS ---------------- */
let supabaseClient = null;
if (typeof supabase !== "undefined" && SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function starRow(rating) {
  let out = "";
  for (let i = 1; i <= 5; i++) out += `<span class="star${i <= rating ? " filled" : ""}">★</span>`;
  return `<div class="star-row" aria-label="${rating} out of 5 stars">${out}</div>`;
}

function reviewCardHTML(r) {
  return `<div class="review-card">
    ${starRow(r.rating)}
    <p>"${escapeHTML(r.comment)}"</p>
    <span>— ${escapeHTML(r.name)}</span>
  </div>`;
}

async function loadReviews() {
  const list = document.getElementById("liveReviews");
  if (!list || !supabaseClient) return;
  const { data, error } = await supabaseClient
    .from("reviews")
    .select("name, rating, comment, created_at")
    .order("created_at", { ascending: false })
    .limit(20);
  if (error || !data || data.length === 0) return;
  list.innerHTML = data.map(reviewCardHTML).join("") + list.innerHTML;
}

let selectedRating = 0;
function setRating(n) {
  selectedRating = n;
  document.querySelectorAll("#starPicker .star-pick").forEach((el, i) => {
    el.classList.toggle("filled", i < n);
  });
  document.getElementById("reviewRating").value = n;
}

async function submitReview(e) {
  e.preventDefault();
  const status = document.getElementById("reviewStatus");
  const name = document.getElementById("revName").value.trim();
  const comment = document.getElementById("revComment").value.trim();
  const rating = Number(document.getElementById("reviewRating").value);
  const honeypot = document.getElementById("revWebsite").value;

  if (honeypot) return;

  if (!name || !comment || !rating) {
    status.textContent = "Please add your name, a rating and a comment.";
    status.className = "form-status error";
    return;
  }

  if (!supabaseClient) {
    status.textContent = "Reviews aren't connected yet — please check back soon.";
    status.className = "form-status error";
    return;
  }

  const submitBtn = document.getElementById("reviewSubmitBtn");
  submitBtn.disabled = true;

  const { error } = await supabaseClient
    .from("reviews")
    .insert([{ name, rating, comment }]);

  submitBtn.disabled = false;

  if (error) {
    status.textContent = "Something went wrong — please try again.";
    status.className = "form-status error";
    return;
  }

  status.textContent = "Thank you for your review!";
  status.className = "form-status success";
  document.getElementById("reviewForm").reset();
  setRating(0);
  loadReviews();
}

document.addEventListener("DOMContentLoaded", loadReviews);
