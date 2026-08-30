/* ---------------- DARK MODE TOGGLE ---------------- */
const THEME_KEY = 'ennieskitchen_theme';

function toggleTheme(){
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const current = document.documentElement.getAttribute('data-theme') || (systemDark ? 'dark' : 'light');
  const next = current === 'dark' ? 'light' : 'dark';
  try{ localStorage.setItem(THEME_KEY, next); }catch(e){}
  document.documentElement.setAttribute('data-theme', next);
}
