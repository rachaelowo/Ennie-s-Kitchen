/* ---------------- HOME PAGE: SPREADS + FEATURED ---------------- */
function renderSpreads(){
  document.getElementById('spreadGrid').innerHTML = SPREADS.map((s,idx)=>{
    const total = s.items.reduce((sum,i)=>sum+i.price,0);
    return `
      <div class="spread-card">
        <div>
          <h4>${s.name}</h4>
          <div class="spread-serves">${s.serves}</div>
        </div>
        <ul class="spread-items">
          ${s.items.map(i=>`<li><span>${i.name} — ${i.size}</span><span>${money(i.price)}</span></li>`).join('')}
        </ul>
        <div class="spread-foot">
          <span class="spread-total">${money(total)}</span>
          <button class="add-btn" onclick="addSpread(${idx})">Add this spread</button>
        </div>
      </div>
    `;
  }).join('');
}

function addSpread(idx){
  SPREADS[idx].items.forEach(i=>{
    addToCartQuiet(i.name, i.size, i.price, 1);
  });
  renderCart();
  openCart();
}

function renderFeatured(){
  const picks = MENU.filter(m=>["Jollof Rice","Egusi","Efo Riro","Moi Moi with Protein"].includes(m.name));
  document.getElementById('featuredGrid').innerHTML = picks.map((m,i)=>`
    <div class="dish-card">
      <div class="dish-img">
        ${dishImg(m.name, i, 'dish-photo')}
        <span class="tag">${m.cat}</span>
      </div>
      <div class="dish-body">
        <h4>${m.name}</h4>
        <div class="dish-sizes">${m.sizes[0][0]} · ${servesFor(m.sizes[0][0])} · ${money(m.sizes[0][1])}</div>
        <div class="dish-footer">
          <span class="dish-price">${money(m.sizes[0][1])}</span>
          <button class="add-btn" onclick="addToCart('${m.name.replace(/'/g,"\\'")}','${m.sizes[0][0]}',${m.sizes[0][1]},1)">Add to cart</button>
        </div>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderFeatured();
  renderSpreads();
});
