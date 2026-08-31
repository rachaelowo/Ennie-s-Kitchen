/* ---------------- MENU PAGE ---------------- */
let activeCat = "All";
let searchTerm = "";

function renderCatPills(){
  document.getElementById('catPills').innerHTML = CATEGORIES.map(c=>
    `<button class="pill ${c===activeCat?'active':''}" onclick="setCat('${c}')">${c}</button>`
  ).join('');
}
function setCat(c){
  activeCat = c;
  renderCatPills();
  renderMenuList();
}

function setSearch(term){
  searchTerm = term;
  renderMenuList();
}

let renderedItems = [];

function renderMenuList(){
  const q = searchTerm.trim().toLowerCase();
  const items = MENU.filter(m=>
    (activeCat==="All" || m.cat===activeCat) &&
    (!q || m.name.toLowerCase().includes(q))
  );
  renderedItems = items;
  const emptyEl = document.getElementById('menuEmpty');
  if(emptyEl) emptyEl.classList.toggle('hidden', items.length>0);
  document.getElementById('menuList').innerHTML = items.map((m,i)=>{
    const id = 'item_'+i;
    const sizesHtml = m.sizes.map((s,si)=>{
      const serves = servesFor(s[0]);
      return `
      <label class="size-row" for="${id}_${si}">
        <span><input type="radio" name="${id}_size" id="${id}_${si}" value="${si}" ${si===0?'checked':''} onchange="updateItemPrice('${id}')"> ${s[0]}${serves?' <span class="serves">'+serves+'</span>':''}</span>
        <span class="size-price">${money(s[1])}</span>
      </label>
    `;}).join('');
    const proteinsHtml = m.proteins ? `
      <div class="protein-group">
        <span class="protein-group-label">Protein:</span>
        <div class="protein-options">
          ${m.proteins.map((p,pi)=>`
            <label class="protein-pick" for="${id}_protein_${pi}">
              <input type="radio" name="${id}_protein" id="${id}_protein_${pi}" value="${pi}" data-add="${p[1]}" ${pi===0?'checked':''} onchange="updateItemPrice('${id}')"> ${p[0]}${p[1]?' (+'+money(p[1])+')':''}
            </label>
          `).join('')}
        </div>
      </div>
    ` : '';
    const minQty = m.minQty || 1;
    return `
      <div class="menu-item">
        ${dishImg(m.name, i, 'menu-item-photo')}
        <div class="menu-item-top">
          <h4>${m.name}</h4>
          <span class="cat-label">${m.cat}</span>
        </div>
        ${m.addons ? `<div class="addons">Add-ons available: ${m.addons}</div>` : ''}
        <div>${sizesHtml}</div>
        ${proteinsHtml}
        <div class="qty-add-row">
          <div class="qty-box">
            <button onclick="changeQty('${id}', -1, ${minQty})">−</button>
            <span id="${id}_qty">${minQty}</span>
            <button onclick="changeQty('${id}', 1, ${minQty})">+</button>
          </div>
          <button class="add-btn" onclick="addFromMenu('${id}', ${i}, ${minQty})">${PLUS_ICON}Add · <span id="${id}_price">${money(m.sizes[0][1]*minQty)}</span></button>
        </div>
      </div>
    `;
  }).join('');
}

function updateItemPrice(id){
  const qty = parseInt(document.getElementById(id+'_qty').textContent);
  const checked = document.querySelector(`input[name="${id}_size"]:checked`);
  const row = checked.closest('.size-row');
  const priceText = row.querySelector('.size-price').textContent.replace('$','');
  let unitPrice = parseFloat(priceText);
  const checkedProtein = document.querySelector(`input[name="${id}_protein"]:checked`);
  if(checkedProtein) unitPrice += parseFloat(checkedProtein.dataset.add || 0);
  document.getElementById(id+'_price').textContent = money(unitPrice*qty);
}

function changeQty(id, delta, min){
  const el = document.getElementById(id+'_qty');
  let val = parseInt(el.textContent) + delta;
  if(val < min) val = min;
  el.textContent = val;
  updateItemPrice(id);
}

function addFromMenu(id, itemIndex, minQty){
  const m = renderedItems[itemIndex];
  const checked = document.querySelector(`input[name="${id}_size"]:checked`);
  const sizeIdx = parseInt(checked.value);
  const qty = parseInt(document.getElementById(id+'_qty').textContent);
  let sizeLabel = m.sizes[sizeIdx][0];
  let price = m.sizes[sizeIdx][1];
  if(m.proteins){
    const checkedProtein = document.querySelector(`input[name="${id}_protein"]:checked`);
    const protein = m.proteins[parseInt(checkedProtein.value)];
    sizeLabel += ' — ' + protein[0];
    price += protein[1];
  }
  addToCart(m.name, sizeLabel, price, qty);
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderCatPills();
  renderMenuList();
  renderPickupNotes();
});
