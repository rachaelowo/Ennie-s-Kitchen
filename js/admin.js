/* ---------------- ADMIN DASHBOARD ---------------- */
let adminSupabase = null;
if (typeof supabase !== "undefined" && typeof SUPABASE_URL !== "undefined" && SUPABASE_URL && typeof SUPABASE_ANON_KEY !== "undefined" && SUPABASE_ANON_KEY) {
  adminSupabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

function showLoggedOut(){
  document.getElementById('loginBox').classList.remove('hidden');
  document.getElementById('adminDash').classList.add('hidden');
}

function showLoggedIn(){
  document.getElementById('loginBox').classList.add('hidden');
  document.getElementById('adminDash').classList.remove('hidden');
  loadDashboard();
}

async function checkSession(){
  if(!adminSupabase) return;
  const { data } = await adminSupabase.auth.getSession();
  if(data && data.session) showLoggedIn(); else showLoggedOut();
}

async function adminLogin(e){
  e.preventDefault();
  const status = document.getElementById('loginStatus');
  if(!adminSupabase){
    status.textContent = 'Admin login is not configured yet.';
    status.className = 'form-status error';
    return;
  }
  const email = document.getElementById('adminEmail').value.trim();
  const password = document.getElementById('adminPassword').value;
  status.textContent = 'Logging in...';
  status.className = 'form-status';
  const { error } = await adminSupabase.auth.signInWithPassword({ email, password });
  if(error){
    status.textContent = error.message;
    status.className = 'form-status error';
    return;
  }
  status.textContent = '';
  showLoggedIn();
}

async function adminLogout(){
  if(adminSupabase) await adminSupabase.auth.signOut();
  showLoggedOut();
}

async function loadDashboard(){
  await Promise.all([loadOrders(), loadReviewsAdmin(), loadCateringRequests()]);
}

async function loadCateringRequests(){
  const listEl = document.getElementById('cateringList');
  const { data, error } = await adminSupabase.from('catering_requests').select('*').order('created_at', { ascending: false });
  if(error){
    listEl.innerHTML = `<p class="form-status error">Could not load catering requests: ${escapeHTML(error.message)}</p>`;
    return;
  }

  document.getElementById('statCateringCount').textContent = data.length;

  listEl.innerHTML = data.length ? data.map(r=>`
    <div class="admin-row">
      <div class="admin-row-main">
        <strong>${escapeHTML(r.full_name)}</strong> — ${escapeHTML(r.event_type || 'event type not given')}
        <span class="admin-meta">${new Date(r.created_at).toLocaleString()} · event date: ${escapeHTML(r.event_date || '—')} · guests: ${escapeHTML(r.guest_count || '—')} · ${escapeHTML(r.phone)}${r.email ? ' · ' + escapeHTML(r.email) : ''}</span>
        <div class="admin-items">
          ${r.location ? `<div>Location: ${escapeHTML(r.location)}</div>` : ''}
          ${r.budget ? `<div>Budget: ${escapeHTML(r.budget)}</div>` : ''}
          ${r.food_preferences ? `<div>Food preferences: ${escapeHTML(r.food_preferences)}</div>` : ''}
          ${r.dietary_restrictions ? `<div>Dietary restrictions: ${escapeHTML(r.dietary_restrictions)}</div>` : ''}
          ${r.desired_menu ? `<div>Desired menu: ${escapeHTML(r.desired_menu)}</div>` : ''}
          ${r.additional_details ? `<div>Additional details: ${escapeHTML(r.additional_details)}</div>` : ''}
        </div>
      </div>
      <button class="btn-delete" onclick="deleteCateringRequest('${r.id}')">Delete</button>
    </div>
  `).join('') : '<p style="color:var(--ink-soft);font-size:14px;">No catering requests yet.</p>';
}

async function deleteCateringRequest(id){
  if(!confirm('Delete this catering request? This cannot be undone.')) return;
  await adminSupabase.from('catering_requests').delete().eq('id', id);
  loadCateringRequests();
}

async function loadOrders(){
  const listEl = document.getElementById('ordersList');
  const { data, error } = await adminSupabase.from('orders').select('*').order('created_at', { ascending: false });
  if(error){
    listEl.innerHTML = `<p class="form-status error">Could not load orders: ${escapeHTML(error.message)}</p>`;
    return;
  }

  const totalOrders = data.length;
  const totalRevenue = data.reduce((s,o)=>s + Number(o.total), 0);
  const byMethod = {};
  data.forEach(o=>{ byMethod[o.payment_method] = (byMethod[o.payment_method] || 0) + 1; });

  document.getElementById('statTotalOrders').textContent = totalOrders;
  document.getElementById('statTotalRevenue').textContent = money(totalRevenue);
  document.getElementById('statByMethod').textContent = Object.entries(byMethod).map(([m,c])=>`${m}: ${c}`).join(' · ') || '—';

  listEl.innerHTML = data.length ? data.map(o=>{
    const items = Array.isArray(o.items) ? o.items.map(i=>`${escapeHTML(i.name)} (${escapeHTML(i.size)}) x${i.qty}`).join(', ') : '';
    return `
      <div class="admin-row">
        <div class="admin-row-main">
          <strong>${escapeHTML(o.customer_name)}</strong> — ${money(Number(o.total))}
          <span class="admin-meta">${new Date(o.created_at).toLocaleString()} · ${escapeHTML(o.payment_method)} · pickup: ${escapeHTML(o.pickup_time || 'flexible')} · ${escapeHTML(o.phone)}</span>
          <div class="admin-items">${items}</div>
        </div>
        <button class="btn-delete" onclick="deleteOrder('${o.id}')">Delete</button>
      </div>
    `;
  }).join('') : '<p style="color:var(--ink-soft);font-size:14px;">No orders yet.</p>';
}

async function deleteOrder(id){
  if(!confirm('Delete this order record? This cannot be undone.')) return;
  await adminSupabase.from('orders').delete().eq('id', id);
  loadOrders();
}

async function loadReviewsAdmin(){
  const listEl = document.getElementById('reviewsAdminList');
  const { data, error } = await adminSupabase.from('reviews').select('*').order('created_at', { ascending: false });
  if(error){
    listEl.innerHTML = `<p class="form-status error">Could not load reviews: ${escapeHTML(error.message)}</p>`;
    return;
  }

  document.getElementById('statReviewCount').textContent = data.length;
  const avg = data.length ? (data.reduce((s,r)=>s + r.rating, 0) / data.length).toFixed(1) : '—';
  document.getElementById('statAvgRating').textContent = avg;

  listEl.innerHTML = data.length ? data.map(r=>`
    <div class="admin-row">
      <div class="admin-row-main">
        <strong>${escapeHTML(r.name)}</strong> — ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}
        <span class="admin-meta">${new Date(r.created_at).toLocaleString()}</span>
        <div class="admin-items">"${escapeHTML(r.comment)}"</div>
      </div>
      <button class="btn-delete" onclick="deleteReview('${r.id}')">Delete</button>
    </div>
  `).join('') : '<p style="color:var(--ink-soft);font-size:14px;">No reviews yet.</p>';
}

async function deleteReview(id){
  if(!confirm('Delete this review? This cannot be undone.')) return;
  await adminSupabase.from('reviews').delete().eq('id', id);
  loadReviewsAdmin();
}

document.addEventListener('DOMContentLoaded', checkSession);
