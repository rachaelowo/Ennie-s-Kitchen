/* ---------------- SIDEBAR / MOBILE NAV ---------------- */
function openSidebar(){
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('navOverlay').classList.add('show');
  document.querySelector('.hamburger').classList.add('open');
}
function closeSidebar(){
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('navOverlay').classList.remove('show');
  const h = document.querySelector('.hamburger');
  if(h) h.classList.remove('open');
}
