/* ---------------- CATERING GALLERY ---------------- */
const GALLERY_ITEMS = [
  ["full-catering-spread.jpg", "Full catering spread"],
  ["grilled-chicken-garnish.jpg", "Grilled peppered chicken"],
  ["efo-riro-seafood-plate.jpg", "Efo riro with shrimp and fish"],
  ["party-fried-rice-tray.jpg", "Party fried rice"],
  ["jollof-pasta-tray.jpg", "Jollof pasta"],
  ["peppered-fish-pot.jpg", "Peppered fish"],
  ["ofada-stew-bowl.jpg", "Ofada stew"],
  ["grilled-fish-moimoi-wrap.jpg", "Grilled fish with moi moi wrap"],
  ["ata-din-din-eggs.jpg", "Ata din din with boiled egg"],
  ["small-chops-box.jpg", "Assorted small chops"],
];

function renderCateringGallery(){
  const el = document.getElementById('cateringGallery');
  if(!el) return;
  el.innerHTML = GALLERY_ITEMS.map(([file, caption])=>`
    <div class="gallery-item">
      <div class="gallery-photo">
        <img src="images/catering-gallery/${file}" alt="${caption}" loading="lazy" onerror="this.closest('.gallery-item').remove()">
      </div>
      <div class="gallery-caption">${caption}</div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', renderCateringGallery);

/* ---------------- CATERING FORM ---------------- */
let cateringSupabaseClient = null;
if (typeof supabase !== "undefined" && typeof SUPABASE_URL !== "undefined" && SUPABASE_URL && typeof SUPABASE_ANON_KEY !== "undefined" && SUPABASE_ANON_KEY) {
  cateringSupabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

async function saveCateringRequest(fields){
  if(!cateringSupabaseClient) return;
  try{
    await cateringSupabaseClient.from('catering_requests').insert([{
      full_name: fields.name,
      phone: fields.phone,
      email: fields.email || null,
      event_type: fields.eventType || null,
      event_date: fields.eventDate || null,
      guest_count: fields.guestCount || null,
      location: fields.location || null,
      budget: fields.budget || null,
      food_preferences: fields.foodPref || null,
      dietary_restrictions: fields.dietary || null,
      desired_menu: fields.menu || null,
      additional_details: fields.details || null,
    }]);
  }catch(e){
    // Non-blocking — the email is the primary channel.
  }
}

function submitCatering(e){
  e.preventDefault();
  const name = document.getElementById('catName').value.trim();
  const phone = document.getElementById('catPhone').value.trim();
  const date = document.getElementById('catDate').value;
  if(!name || !phone || !date){ return; }

  const email = document.getElementById('catEmail').value.trim();
  const eventType = document.getElementById('catType').value.trim();
  const guestCount = document.getElementById('catGuests').value.trim();
  const location = document.getElementById('catLocation').value.trim();
  const budget = document.getElementById('catBudget').value.trim();
  const foodPref = document.getElementById('catFoodPref').value.trim();
  const dietary = document.getElementById('catDietary').value.trim();
  const menu = document.getElementById('catMenu').value.trim();
  const details = document.getElementById('catDetails').value.trim();

  saveCateringRequest({ name, phone, email, eventType, eventDate: date, guestCount, location, budget, foodPref, dietary, menu, details });

  const body = [
    `Full name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Event type: ${eventType}`,
    `Event date: ${date}`,
    `Guest count: ${guestCount}`,
    `Location: ${location}`,
    `Budget: ${budget}`,
    `Food preferences: ${foodPref}`,
    `Dietary restrictions: ${dietary}`,
    `Desired menu: ${menu}`,
    `Additional details: ${details}`,
  ].join('\n');

  const mailto = `mailto:Ennieskitchen259@gmail.com?subject=${encodeURIComponent('Catering request from '+name)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
}
