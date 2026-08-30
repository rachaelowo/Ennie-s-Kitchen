/* ---------------- FAQ PAGE ---------------- */
function renderFAQ(){
  document.getElementById('faqList').innerHTML = FAQS.map((f,i)=>`
    <div class="faq-item" id="faq_${i}">
      <div class="faq-q" onclick="toggleFaq(${i})"><span>${f[0]}</span><span class="faq-icon">+</span></div>
      <div class="faq-a" id="faqA_${i}"><p>${f[1]}</p></div>
    </div>
  `).join('');
}
function toggleFaq(i){
  const item = document.getElementById('faq_'+i);
  const a = document.getElementById('faqA_'+i);
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(el=>{
    el.classList.remove('open');
    el.querySelector('.faq-a').style.maxHeight = null;
  });
  if(!isOpen){
    item.classList.add('open');
    a.style.maxHeight = a.scrollHeight + 'px';
  }
}

document.addEventListener('DOMContentLoaded', renderFAQ);
