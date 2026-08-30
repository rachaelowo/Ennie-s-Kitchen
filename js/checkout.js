/* ---------------- CHECKOUT PAGE ---------------- */
function renderCheckout(){
  const empty = document.getElementById('checkoutEmpty');
  const full = document.getElementById('checkoutFull');
  if(!empty) return;
  if(cart.length===0){
    empty.classList.remove('hidden');
    full.classList.add('hidden');
  } else {
    empty.classList.add('hidden');
    full.classList.remove('hidden');
    document.getElementById('checkoutLines').innerHTML = cart.map(l=>`
      <div class="co-line"><span>${l.name} (${l.size}) × ${l.qty}</span><span>${money(l.price*l.qty)}</span></div>
    `).join('');
    document.getElementById('checkoutTotal').textContent = money(cartTotal());
  }
}

function sendWhatsApp(){
  const name = document.getElementById('coName').value.trim();
  const phone = document.getElementById('coPhone').value.trim();
  const time = document.getElementById('coTime').value.trim();
  if(!name || !phone){
    alert('Please enter your name and phone number.');
    return;
  }
  let msg = `Hi Ennieskitchen! I'd like to place an order:%0A%0A`;
  cart.forEach(l=>{
    msg += `${l.name} (${l.size}) x${l.qty} - ${money(l.price*l.qty)}%0A`;
  });
  msg += `%0ATotal: ${money(cartTotal())}%0A%0AName: ${name}%0APhone: ${phone}%0APickup time: ${time || 'flexible'}`;
  window.open(`https://wa.me/13235786993?text=${msg}`, '_blank');
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderCheckout();
  renderPickupNotes();
});
