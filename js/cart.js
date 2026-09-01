/* ---------------- CART STATE (persisted across pages) ---------------- */
const CART_KEY = 'ennieskitchen_cart';

function loadCart(){
  try{
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){
    return [];
  }
}

function saveCart(){
  try{ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }catch(e){}
}

let cart = loadCart(); // {name, size, price, qty}

function addToCart(name, sizeLabel, price, qty){
  const existing = cart.find(l => l.name===name && l.size===sizeLabel);
  if(existing){ existing.qty += qty; }
  else{ cart.push({name, size:sizeLabel, price, qty}); }
  saveCart();
  renderCart();
  openCart();
}

function addToCartQuiet(name, sizeLabel, price, qty){
  const existing = cart.find(l => l.name===name && l.size===sizeLabel);
  if(existing){ existing.qty += qty; }
  else{ cart.push({name, size:sizeLabel, price, qty}); }
  saveCart();
}

function removeLine(idx){
  cart.splice(idx,1);
  saveCart();
  renderCart();
}

function clearCart(){
  cart = [];
  saveCart();
  renderCart();
}

function cartTotal(){
  return cart.reduce((s,l)=> s + l.price*l.qty, 0);
}

function renderCart(){
  const count = cart.reduce((s,l)=>s+l.qty,0);
  const countEl = document.getElementById('cartCount');
  const countElMobile = document.getElementById('cartCountMobile');
  if(countEl) countEl.textContent = count;
  if(countElMobile) countElMobile.textContent = count;
  [countEl, countElMobile].forEach(el=>{
    if(!el) return;
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
  });

  const itemsEl = document.getElementById('drawerItems');
  const footEl = document.getElementById('drawerFoot');
  if(itemsEl && footEl){
    if(cart.length===0){
      itemsEl.innerHTML = '<div class="drawer-empty">Your cart is empty.</div>';
      footEl.style.display = 'none';
    } else {
      footEl.style.display = 'block';
      itemsEl.innerHTML = cart.map((l,i)=>`
        <div class="cart-line">
          <div>
            <h5>${l.name}</h5>
            <div class="meta">${l.size} × ${l.qty}</div>
            <div class="remove" onclick="removeLine(${i})"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path></svg>Remove</div>
          </div>
          <div class="amt">${money(l.price*l.qty)}</div>
        </div>
      `).join('');
      const drawerTotalEl = document.getElementById('drawerTotal');
      if(drawerTotalEl) drawerTotalEl.textContent = money(cartTotal());
    }
  }

  if(typeof renderCheckout === 'function') renderCheckout();
}

function openCart(){
  document.getElementById('drawer').classList.add('show');
  document.getElementById('overlay').classList.add('show');
}
function closeCart(){
  document.getElementById('drawer').classList.remove('show');
  document.getElementById('overlay').classList.remove('show');
}
function goCheckout(){
  closeCart();
  window.location.href = 'checkout.html';
}

document.addEventListener('DOMContentLoaded', renderCart);
