/* ---------------- CHECKOUT PAGE ---------------- */
let selectedPaymentMethod = 'zelle';
let squareCard = null;
let squareInitStarted = false;

let ordersSupabaseClient = null;
if (typeof supabase !== "undefined" && typeof SUPABASE_URL !== "undefined" && SUPABASE_URL && typeof SUPABASE_ANON_KEY !== "undefined" && SUPABASE_ANON_KEY) {
  ordersSupabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

async function saveOrderRecord(paidByCard, name, phone, email, time){
  if(!ordersSupabaseClient) return;
  try{
    await ordersSupabaseClient.from('orders').insert([{
      customer_name: name,
      phone: phone,
      email: email || null,
      pickup_time: time || 'flexible',
      items: cart,
      subtotal: checkoutSubtotal(),
      tax: checkoutTax(),
      total: checkoutGrandTotal(),
      payment_method: paidByCard ? 'card' : selectedPaymentMethod,
      confirmed: paidByCard,
    }]);
  }catch(e){
    // Non-blocking — the order email/WhatsApp message is the primary channel.
  }
}

async function sendReceiptEmail(paidByCard, name, email, phone, time){
  if(!email) return;
  if(typeof SUPABASE_URL === 'undefined' || !SUPABASE_URL) return;
  try{
    await fetch(`${SUPABASE_URL}/functions/v1/send-order-receipt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        customerEmail: email,
        customerName: name,
        phone: phone,
        pickupTime: time || 'flexible',
        items: cart,
        subtotal: checkoutSubtotal(),
        tax: checkoutTax(),
        total: checkoutGrandTotal(),
        paymentMethod: paidByCard ? 'card' : selectedPaymentMethod,
      }),
    });
  }catch(e){
    // Non-blocking — the order email to the business is the primary channel.
  }
}

async function notifyBusinessOfOrder(paidByCard, name, phone, email, time){
  if(typeof SUPABASE_URL === 'undefined' || !SUPABASE_URL) return;
  try{
    await fetch(`${SUPABASE_URL}/functions/v1/notify-new-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        customerName: name,
        phone: phone,
        customerEmail: email,
        pickupTime: time || 'flexible',
        items: cart,
        subtotal: checkoutSubtotal(),
        tax: checkoutTax(),
        total: checkoutGrandTotal(),
        paymentMethod: paidByCard ? 'card' : selectedPaymentMethod,
      }),
    });
  }catch(e){
    // Non-blocking — this is a best-effort alert, not the source of truth (that's the admin dashboard).
  }
}

function formatPickupDate(dateStr){
  if(!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {weekday:'short', month:'short', day:'numeric', year:'numeric'});
}

function getPickupLabel(){
  const date = document.getElementById('coDate').value;
  const time = document.getElementById('coTime').value.trim();
  if(!date) return time || 'flexible';
  return formatPickupDate(date) + (time ? ' — ' + time : '');
}

function setMinPickupDate(){
  const dateInput = document.getElementById('coDate');
  if(!dateInput) return;
  const min = new Date(Date.now() + 24*3600*1000);
  const yyyy = min.getFullYear();
  const mm = String(min.getMonth()+1).padStart(2,'0');
  const dd = String(min.getDate()).padStart(2,'0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}

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
  const sendBtn = document.getElementById('sendOrderBtn');
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
  const email = document.getElementById('coEmail').value.trim();
  const date = document.getElementById('coDate').value;
  if(!name || !phone || !email || !date){
    alert('Please enter your name, phone number, email address and pickup date.');
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
    status.textContent = 'Payment received — emailing your order...';
    sendOrderEmail(true);
  }catch(e){
    status.className = 'form-status error';
    status.textContent = e.message || 'Something went wrong with the card payment — please try again or use Zelle or the PayPal QR code instead.';
  }finally{
    payBtn.disabled = false;
  }
}

function sendOrderEmail(paidByCard){
  const name = document.getElementById('coName').value.trim();
  const phone = document.getElementById('coPhone').value.trim();
  const email = document.getElementById('coEmail').value.trim();
  const date = document.getElementById('coDate').value;
  if(!name || !phone || !email || !date){
    alert('Please enter your name, phone number, email address and pickup date.');
    return;
  }
  const time = getPickupLabel();
  saveOrderRecord(paidByCard, name, phone, email, time);
  notifyBusinessOfOrder(paidByCard, name, phone, email, time);
  sendReceiptEmail(paidByCard, name, email, phone, time);
  let body = `Hi Ennieskitchen! I'd like to place an order:\n\n`;
  cart.forEach(l=>{
    body += `${l.name} (${l.size}) x${l.qty} - ${money(l.price*l.qty)}\n`;
  });
  body += `\nSubtotal: ${money(checkoutSubtotal())}\nSales tax: ${money(checkoutTax())}\nTotal: ${money(checkoutGrandTotal())}`;
  body += `\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nPickup time: ${time || 'flexible'}`;
  body += `\nPayment: Paid by card via Square`;

  const mailto = `mailto:Ennieskitchen259@gmail.com?subject=${encodeURIComponent('Order from ' + name)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
  clearCart();
}

function sendOrderWhatsApp(){
  const name = document.getElementById('coName').value.trim();
  const phone = document.getElementById('coPhone').value.trim();
  const email = document.getElementById('coEmail').value.trim();
  const date = document.getElementById('coDate').value;
  if(!name || !phone || !email || !date){
    alert('Please enter your name, phone number, email address and pickup date.');
    return;
  }
  const time = getPickupLabel();
  saveOrderRecord(false, name, phone, email, time);
  notifyBusinessOfOrder(false, name, phone, email, time);

  let msg = `Hi Ennieskitchen! I'd like to place an order:%0A%0A`;
  cart.forEach(l=>{
    msg += `${l.name} (${l.size}) x${l.qty} - ${money(l.price*l.qty)}%0A`;
  });
  msg += `%0ASubtotal: ${money(checkoutSubtotal())}%0ASales tax: ${money(checkoutTax())}%0ATotal: ${money(checkoutGrandTotal())}`;
  msg += `%0A%0AName: ${name}%0APhone: ${phone}%0AEmail: ${email}%0APickup time: ${time || 'flexible'}`;
  msg += `%0APayment method: ${selectedPaymentMethod}`;
  msg += `%0A%0AI'll send a screenshot of my payment confirmation next.`;

  window.open(`https://wa.me/13235786993?text=${msg}`, '_blank');
  clearCart();
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderCheckout();
  renderPickupNotes();
  setMinPickupDate();
});
