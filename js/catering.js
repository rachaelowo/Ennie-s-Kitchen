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
