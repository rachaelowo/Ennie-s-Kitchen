/* ---------------- CHECKOUT PAGE ---------------- */
let selectedPaymentMethod = 'zelle';
let squareCard = null;
let squareInitStarted = false;

function checkoutSubtotal(){ return cartTotal(); }
function checkoutTax(){ return checkoutSubtotal() * TAX_RATE; }
function checkoutGrandTotal(){ return checkoutSubtotal() + checkoutTax(); }

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
    document.getElementById('checkoutSubtotal').textContent = money(checkoutSubtotal());
    document.getElementById('checkoutTax').textContent = money(checkoutTax());
    document.getElementById('checkoutTotal').textContent = money(checkoutGrandTotal());
    const qrAmount = document.getElementById('qrAmount');
    if(qrAmount) qrAmount.textContent = money(checkoutGrandTotal());
    updateSquarePayAmount();
  }
}

function selectPayment(method){
  selectedPaymentMethod = method;
  document.querySelectorAll('#payTabs .pay-tab').forEach(btn=>{
    btn.classList.toggle('active', btn.dataset.method === method);
  });
  ['zelle','qr','card'].forEach(m=>{
    const panel = document.getElementById('payPanel-'+m);
    if(panel) panel.classList.toggle('hidden', m!==method);
  });
  const sendBtn = document.getElementById('sendWhatsAppBtn');
  if(sendBtn) sendBtn.classList.toggle('hidden', method==='card');

  if(method==='card') renderSquareCardForm();
  if(method==='card') updateSquarePayAmount();
}

function updateSquarePayAmount(){
  const amountEl = document.getElementById('squarePayAmount');
  if(amountEl) amountEl.textContent = money(checkoutGrandTotal());
}

function squareConfigured(){
  return typeof SQUARE_APP_ID !== 'undefined' && SQUARE_APP_ID
    && typeof SQUARE_LOCATION_ID !== 'undefined' && SQUARE_LOCATION_ID
    && typeof SQUARE_PAYMENT_ENDPOINT !== 'undefined' && SQUARE_PAYMENT_ENDPOINT;
}

async function renderSquareCardForm(){
  const container = document.getElementById('square-card-container');
  const textEl = document.getElementById('cardPayText');
  const payBtn = document.getElementById('squarePayBtn');
  if(!container) return;

  if(!squareConfigured()){
    container.innerHTML = '';
    payBtn.classList.add('hidden');
    if(textEl) textEl.textContent = "Card payment isn't set up yet — please use Zelle or the PayPal QR code instead.";
    return;
  }

  if(squareInitStarted) return;
  squareInitStarted = true;

  const sdkUrl = SQUARE_ENVIRONMENT === 'production'
    ? 'https://web.squarecdn.com/v1/square.js'
    : 'https://sandbox.web.squarecdn.com/v1/square.js';

  const script = document.createElement('script');
  script.src = sdkUrl;
  script.onload = async () => {
    try{
      const payments = Square.payments(SQUARE_APP_ID, SQUARE_LOCATION_ID);
      squareCard = await payments.card();
      await squareCard.attach('#square-card-container');
      payBtn.classList.remove('hidden');
    }catch(e){
      if(textEl) textEl.textContent = 'Card payment failed to load — please use Zelle or the PayPal QR code instead.';
    }
  };
  script.onerror = () => {
    if(textEl) textEl.textContent = 'Card payment failed to load — please use Zelle or the PayPal QR code instead.';
  };
  document.head.appendChild(script);
}

async function submitSquarePayment(){
  const status = document.getElementById('squarePayStatus');
  const payBtn = document.getElementById('squarePayBtn');
  if(!squareCard) return;

  const name = document.getElementById('coName').value.trim();
  const phone = document.getElementById('coPhone').value.trim();
  if(!name || !phone){
    alert('Please enter your name and phone number.');
    return;
  }

  payBtn.disabled = true;
  status.className = 'form-status';
  status.textContent = 'Processing payment...';

  try{
    const result = await squareCard.tokenize();
    if(result.status !== 'OK'){
      throw new Error(result.errors?.[0]?.message || 'Card was declined.');
    }

    const res = await fetch(SQUARE_PAYMENT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SQUARE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        sourceId: result.token,
        amount: Math.round(checkoutGrandTotal() * 100),
        currency: 'USD',
        orderNote: `Ennieskitchen order for ${name}`,
      }),
    });
    const data = await res.json();

    if(!data.success){
      throw new Error(data.error || 'Payment was declined.');
    }

    status.className = 'form-status success';
    status.textContent = 'Payment received — sending your order on WhatsApp...';
    sendWhatsApp(true);
  }catch(e){
    status.className = 'form-status error';
    status.textContent = e.message || 'Something went wrong with the card payment — please try again or use Zelle or the PayPal QR code instead.';
  }finally{
    payBtn.disabled = false;
  }
}

function sendWhatsApp(paidByCard){
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
  msg += `%0ASubtotal: ${money(checkoutSubtotal())}%0ASales tax: ${money(checkoutTax())}%0ATotal: ${money(checkoutGrandTotal())}`;
  msg += `%0A%0AName: ${name}%0APhone: ${phone}%0APickup time: ${time || 'flexible'}`;
  msg += paidByCard ? `%0APayment: Paid by card via Square` : `%0APayment method: ${selectedPaymentMethod}`;
  window.open(`https://wa.me/13235786993?text=${msg}`, '_blank');
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderCheckout();
  renderPickupNotes();
});
