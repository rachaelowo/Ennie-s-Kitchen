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
function submitCatering(e){
  e.preventDefault();
  const name = document.getElementById('catName').value.trim();
  const phone = document.getElementById('catPhone').value.trim();
  const date = document.getElementById('catDate').value;
  if(!name || !phone || !date){ return; }

  const body = [
    `Full name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${document.getElementById('catEmail').value}`,
    `Event type: ${document.getElementById('catType').value}`,
    `Event date: ${date}`,
    `Guest count: ${document.getElementById('catGuests').value}`,
    `Location: ${document.getElementById('catLocation').value}`,
    `Budget: ${document.getElementById('catBudget').value}`,
    `Food preferences: ${document.getElementById('catFoodPref').value}`,
    `Dietary restrictions: ${document.getElementById('catDietary').value}`,
    `Desired menu: ${document.getElementById('catMenu').value}`,
    `Additional details: ${document.getElementById('catDetails').value}`,
  ].join('\n');

  const mailto = `mailto:Ennieskitchen259@gmail.com?subject=${encodeURIComponent('Catering request from '+name)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
}
