/* ---------------- CUSTOMER REVIEWS ---------------- */
let supabaseClient = null;
if (typeof supabase !== "undefined" && SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

const MAX_PHOTOS = 3;
const MAX_FILE_BYTES = 30 * 1024 * 1024; // 30MB, matches the storage bucket limit

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

function mediaHTML(media) {
  if (!Array.isArray(media) || media.length === 0) return "";
  const items = media.map(m => {
    if (m.type === "video") {
      return `<video class="review-media-item" src="${escapeHTML(m.url)}" controls preload="metadata"></video>`;
    }
    return `<img class="review-media-item" src="${escapeHTML(m.url)}" alt="Customer photo" loading="lazy">`;
  }).join("");
  return `<div class="review-media">${items}</div>`;
}

function reviewCardHTML(r) {
  return `<div class="review-card">
    ${starRow(r.rating)}
    <p>"${escapeHTML(r.comment)}"</p>
    ${mediaHTML(r.media)}
    <span>— ${escapeHTML(r.name)}</span>
  </div>`;
}

async function loadReviews() {
  const list = document.getElementById("liveReviews");
  if (!list || !supabaseClient) return;
  const { data, error } = await supabaseClient
    .from("reviews")
    .select("name, rating, comment, media, created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error || !data) return;
  list.innerHTML = data.length
    ? data.map(reviewCardHTML).join("")
    : '<p style="color:#D9E4DB;">No reviews yet — be the first to leave one!</p>';
}

let selectedRating = 0;
function setRating(n) {
  selectedRating = n;
  document.querySelectorAll("#starPicker .star-pick").forEach((el, i) => {
    el.classList.toggle("filled", i < n);
  });
  document.getElementById("reviewRating").value = n;
}

function validateFile(file) {
  if (file.size > MAX_FILE_BYTES) {
    return `"${file.name}" is too large (max 30MB).`;
  }
  if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
    return `"${file.name}" isn't a photo or video file.`;
  }
  return null;
}

async function uploadReviewMedia(file) {
  const ext = file.name.split(".").pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabaseClient.storage.from("review-media").upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
  });
  if (error) throw error;
  const { data } = supabaseClient.storage.from("review-media").getPublicUrl(path);
  return { url: data.publicUrl, type: file.type.startsWith("video/") ? "video" : "image" };
}

async function submitReview(e) {
  e.preventDefault();
  const status = document.getElementById("reviewStatus");
  const name = document.getElementById("revName").value.trim();
  const comment = document.getElementById("revComment").value.trim();
  const rating = Number(document.getElementById("reviewRating").value);
  const honeypot = document.getElementById("revWebsite").value;
  const photoInput = document.getElementById("revPhotos");
  const videoInput = document.getElementById("revVideo");

  if (honeypot) return;

  if (!name || !comment || !rating) {
    status.textContent = "Please add your name, a rating and a comment.";
    status.className = "form-status error";
    return;
  }

  const photoFiles = photoInput && photoInput.files ? Array.from(photoInput.files).slice(0, MAX_PHOTOS) : [];
  const videoFile = videoInput && videoInput.files && videoInput.files[0] ? videoInput.files[0] : null;
  const allFiles = videoFile ? [...photoFiles, videoFile] : photoFiles;

  for (const file of allFiles) {
    const err = validateFile(file);
    if (err) {
      status.textContent = err;
      status.className = "form-status error";
      return;
    }
  }

  if (!supabaseClient) {
    status.textContent = "Reviews aren't connected yet — please check back soon.";
    status.className = "form-status error";
    return;
  }

  const submitBtn = document.getElementById("reviewSubmitBtn");
  submitBtn.disabled = true;

  let media = [];
  if (allFiles.length) {
    status.className = "form-status";
    status.textContent = "Uploading photos/video...";
    try {
      media = await Promise.all(allFiles.map(uploadReviewMedia));
    } catch (err) {
      submitBtn.disabled = false;
      status.textContent = "Could not upload media — please try again.";
      status.className = "form-status error";
      return;
    }
  }

  status.textContent = "Submitting review...";
  const { error } = await supabaseClient
    .from("reviews")
    .insert([{ name, rating, comment, media: media.length ? media : null }]);

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
