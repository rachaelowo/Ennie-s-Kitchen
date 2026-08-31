/* ---------------- MENU DATA ---------------- */
const MENU = [
  {name:"Jollof Rice", cat:"Rice", sizes:[["Quarter Tray",40],["Half Tray",55],["Large Tray",100]], featured:true},
  {name:"Fried Rice", cat:"Rice", sizes:[["Quarter Tray",45],["Half Tray",60],["Large Tray",110]]},
  {name:"Asun Rice", cat:"Rice", sizes:[["Quarter Tray",55],["Half Tray",110],["Large Tray",240]]},
  {name:"Native Rice", cat:"Rice", sizes:[["Quarter Tray",55],["Half Tray",125],["Large Tray",240]]},
  {name:"Seafood Fried Rice", cat:"Rice", sizes:[["Quarter Tray",70],["Half Tray",150],["Large Tray",240]]},
  {name:"Steamed White Rice", cat:"Rice", sizes:[["Quarter Tray",20],["Half Tray",40],["Large Tray",70]]},
  {name:"Egusi", cat:"Nigerian Soups", sizes:[["Quarter Tray",70],["Half Tray",150],["Large Tray",280]], proteins:[["Beef",0],["Fish",0],["Chicken",0],["Goat Meat",10]], featured:true},
  {name:"Efo Riro", cat:"Nigerian Soups", sizes:[["Quarter Tray",70],["Half Tray",150],["Large Tray",300]], proteins:[["Beef",0],["Fish",0],["Chicken",0],["Goat Meat",10]], featured:true},
  {name:"Okra", cat:"Nigerian Soups", sizes:[["Quarter Tray",70],["Half Tray",130],["Large Tray",260]], proteins:[["Beef",0],["Fish",0],["Chicken",0],["Goat Meat",10]]},
  {name:"Ogbono", cat:"Nigerian Soups", sizes:[["Quarter Tray",70],["Half Tray",150],["Large Tray",300]]},
  {name:"Fisherman Soup", cat:"Nigerian Soups", sizes:[["Quarter Tray",100],["Half Tray",180],["Large Tray",350]]},
  {name:"Seafood Okro", cat:"Nigerian Soups", sizes:[["Quarter Tray",100],["Half Tray",180],["Large Tray",350]]},
  {name:"Ofada Sauce", cat:"Sauces", sizes:[["Quarter Tray",70],["Half Tray",150],["Large Tray",300]]},
  {name:"Poundo, Eba, Amala", cat:"Swallows & More", sizes:[["Per Serving",3]], minQty:12},
  {name:"Mackerel Stew", cat:"Stews", sizes:[["Quarter Tray",70],["Half Tray",110],["Large Tray",120]]},
  {name:"Hake Fish Stew", cat:"Stews", sizes:[["Quarter Tray",70],["Half Tray",110],["Large Tray",280]]},
  {name:"Beef Stew", cat:"Stews", sizes:[["Quarter Tray",70],["Half Tray",150],["Large Tray",280]]},
  {name:"Turkey Stew", cat:"Stews", sizes:[["Quarter Tray",70],["Half Tray",130],["Large Tray",260]]},
  {name:"Goat Meat Stew", cat:"Stews", sizes:[["Quarter Tray",90],["Half Tray",160],["Large Tray",360]]},
  {name:"Assorted Buka Stew", cat:"Stews", sizes:[["Quarter Tray",90],["Half Tray",150],["Large Tray",300]]},
  {name:"Tilapia Fish Stew", cat:"Stews", sizes:[["Quarter Tray",70],["Half Tray",110],["Large Tray",250]]},
  {name:"Chicken Stew", cat:"Stews", sizes:[["Quarter Tray",70],["Half Tray",120],["Large Tray",240]]},
  {name:"Ata Din Din", cat:"Stews", sizes:[["Quarter Tray",70],["Half Tray",150],["Large Tray",300]]},
  {name:"Fish Pepper Soup", cat:"Pepper Soups", sizes:[["Quarter Tray",70],["Half Tray",150],["Large Tray",300]], addons:"Yam, Plantain, Potatoes"},
  {name:"Goat Meat Pepper Soup", cat:"Pepper Soups", sizes:[["Quarter Tray",70],["Half Tray",170],["Large Tray",350]], addons:"Yam, Plantain, Potatoes"},
  {name:"Peppered Fish", cat:"Peppered Protein", sizes:[["Quarter Tray",70],["Half Tray",140],["Large Tray",280]]},
  {name:"Peppered Beef", cat:"Peppered Protein", sizes:[["Quarter Tray",70],["Half Tray",150],["Large Tray",300]]},
  {name:"Peppered Turkey", cat:"Peppered Protein", sizes:[["Quarter Tray",70],["Half Tray",130],["Large Tray",260]]},
  {name:"Peppered Chicken", cat:"Peppered Protein", sizes:[["Quarter Tray",65],["Half Tray",100],["Large Tray",170]]},
  {name:"Peppered Goat Meat", cat:"Peppered Protein", sizes:[["Quarter Tray",70],["Half Tray",160],["Large Tray",320]]},
  {name:"Creamy Alfredo Pasta", cat:"Pasta", sizes:[["Quarter Tray",70],["Half Tray",100],["Large Tray",170]]},
  {name:"Jollof Pasta", cat:"Pasta", sizes:[["Quarter Tray",50],["Half Tray",80],["Large Tray",160]]},
  {name:"Gizdodo", cat:"Sides", sizes:[["Quarter Tray",55],["Half Tray",110],["Large Tray",240]]},
  {name:"Nigerian Salad", cat:"Sides", sizes:[["Quarter Tray",40],["Half Tray",60],["Large Tray",120]]},
  {name:"Plantain", cat:"Sides", sizes:[["Quarter Tray",40],["Half Tray",60],["Large Tray",120]]},
  {name:"Moi Moi with Protein", cat:"Sides", sizes:[["12 Pieces",84]], featured:true},
  {name:"Plain Moi Moi", cat:"Sides", sizes:[["12 Pieces",72]]},
  {name:"Meat Pie", cat:"Small Chops", sizes:[["12 Pieces",30]]},
  {name:"Large Meat Pie", cat:"Small Chops", sizes:[["12 Pieces",48]]},
  {name:"Samosa", cat:"Small Chops", sizes:[["12 Pieces",30]]},
  {name:"Fish Roll", cat:"Small Chops", sizes:[["12 Pieces",30]]},
  {name:"Chapman", cat:"Drinks", sizes:[["12 x 12oz",48],["12 x 16oz",60]]},
];

const CATEGORIES = ["All", ...new Set(MENU.map(m=>m.cat))];

/* ---------------- QUICK-START SPREADS ---------------- */
const SPREADS = [
  {
    name:"Weeknight dinner",
    serves:"feeds 3-4",
    items:[
      {name:"Jollof Rice", size:"Quarter Tray", price:40},
      {name:"Chicken Stew", size:"Quarter Tray", price:70},
    ]
  },
  {
    name:"Small gathering",
    serves:"feeds 6-8",
    items:[
      {name:"Jollof Rice", size:"Half Tray", price:55},
      {name:"Egusi", size:"Half Tray", price:150},
      {name:"Moi Moi with Protein", size:"12 Pieces", price:84},
    ]
  },
  {
    name:"Big party",
    serves:"feeds 12-16",
    items:[
      {name:"Jollof Rice", size:"Large Tray", price:100},
      {name:"Assorted Buka Stew", size:"Large Tray", price:300},
      {name:"Peppered Chicken", size:"Large Tray", price:170},
      {name:"Meat Pie", size:"12 Pieces", price:30},
    ]
  }
];

/* ---------------- FAQ DATA ---------------- */
const FAQS = [
  ["How do I place an order?", "Browse the Menu page, add trays or items to your cart, then go to checkout. Add your name, phone number and preferred pickup time, choose a payment method, and send your order — we'll confirm it and start prepping once payment is received."],
  ["Do you offer delivery?", "No — pickup only in Gardena, California. You're welcome to arrange your own third-party courier, like Uber or Lyft, to pick it up on your behalf."],
  ["Where are you located, and what areas do you serve?", "We're based in Gardena, California, and serve customers throughout the greater Los Angeles area, including the South Bay. The exact pickup address is shared once your order is confirmed."],
  ["What type of food do you serve?", "Authentic Nigerian cuisine — rice dishes like jollof and fried rice, soups like egusi and efo riro, stews, pepper soups, swallows, small chops, pasta and drinks. See the full Menu page for sizes and prices."],
  ["How far in advance should I place my order?", "Regular menu orders need a minimum of 24 hours notice. Catering orders need a minimum of 48–72 hours notice, and larger events may need more lead time — the earlier you reach out, the more flexibility we have."],
  ["What payment methods do you accept?", "Zelle, PayPal, PayPal QR code, and debit/credit card at checkout. Orders are prepared fresh once payment is confirmed, so please complete payment before your pickup time."],
  ["Is sales tax included in the price?", "Menu prices are shown before tax. California/Gardena sales tax is calculated automatically at checkout and shown as a separate line, along with your subtotal and final total, before you pay."],
  ["What is your cancellation and refund policy?", "Because everything is cooked fresh to order, cancellations are easiest before we've started preparing your food. Reach out by phone or WhatsApp as soon as possible if plans change — see our Cancellation & Refunds policy for full details, or contact us directly to discuss your specific order."],
  ["Can I make changes to my order after I've placed it?", "Reach out by phone, WhatsApp or email as soon as possible. Whether we can adjust items, sizes or the pickup time depends on how far along your order already is."],
  ["Do you cater for events?", "Yes — weddings, birthdays, corporate events, baby showers, graduations, family gatherings and more. Request a quote on the Catering page and tell us about your event."],
  ["How much notice do you need for catering?", "A minimum of 48–72 hours for most catering orders. For larger events (weddings, corporate functions, big parties), we recommend reaching out at least 1–2 weeks ahead so we can plan quantities, timing and any custom requests."],
  ["Do you offer custom catering menus?", "Yes — tell us your preferences, guest count and budget in the catering quote form and we'll build a menu around your event. We're also happy to work from a theme or a must-have dish."],
  ["Is there a minimum order size for catering?", "Catering minimums depend on the event and menu you choose — mention your expected guest count in the quote request and we'll let you know what works best, including whether a smaller party-tray order might suit you better than full catering."],
  ["Do you accommodate dietary restrictions or allergies?", "Let us know your dietary restrictions or allergies when ordering or requesting a catering quote, and we'll do our best to accommodate — just note that our kitchen handles common allergens, so we can't guarantee a fully allergen-free environment."],
  ["Can I adjust the spice level of my dish?", "Yes — Nigerian food can run spicy. Let us know in your order notes or when you message us on WhatsApp if you'd like a dish made milder or extra spicy."],
  ["How should I store and reheat my food?", "Refrigerate leftovers within two hours of pickup and eat within 3–4 days, or freeze for longer storage. Reheat rice and stews on the stove or in the microwave until steaming hot throughout."],
  ["What sizes do your trays come in?", "Most dishes come in Quarter, Half and Large trays. Quarter feeds about 3–4 people, Half feeds 6–8, and Large feeds 12–16 — exact serving sizes are shown next to each dish on the Menu page."],
  ["Can I order for a small get-together, not just big events?", "Absolutely — our Quarter and Half trays are sized for family dinners and small gatherings, not just parties. Check out the ready-made spreads on the homepage for quick ideas."],
  ["How can I contact Ennieskitchen?", "Call or WhatsApp +1 (323) 578-6993, or email Ennieskitchen259@gmail.com. WhatsApp is usually the fastest way to reach us."]
];

/* ---------------- SHARED HELPERS ---------------- */
/* Gardena, CA combined sales tax rate (CDTFA, 2026). Confirm with your
   accountant/CDTFA if this ever needs to change. */
const TAX_RATE = 0.105;

function money(n){ return "$" + n.toFixed(2); }

function servesFor(sizeLabel){
  if(sizeLabel==="Quarter Tray") return "feeds 3-4";
  if(sizeLabel==="Half Tray") return "feeds 6-8";
  if(sizeLabel==="Large Tray") return "feeds 12-16";
  if(sizeLabel==="12 Pieces") return "feeds 4-6";
  if(sizeLabel==="Per Serving") return "1 serving";
  if(sizeLabel==="Combo") return "feeds 8-10";
  if(sizeLabel==="12 x 12oz" || sizeLabel==="12 x 16oz") return "12 servings";
  return "";
}

function dishColor(idx){
  const colors = ['#E8A33D','#C1440E','#3B5F45','#D98A5F'];
  return colors[idx % colors.length];
}

function slugify(name){
  return name
    .toLowerCase()
    .replace(/&/g,'and')
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/^-+|-+$/g,'');
}

const PLUS_ICON = `<svg class="icon icon-bump" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;

function dishImg(name, idx, className){
  const slug = slugify(name);
  const color = dishColor(idx);
  return `<div class="${className}" style="background:linear-gradient(135deg,${color}55,${color}22);">
    <img src="images/${slug}.jpg" alt="${name}" loading="lazy" onerror="this.remove()">
  </div>`;
}

function earliestPickup(hoursNotice){
  const d = new Date(Date.now() + hoursNotice*3600*1000);
  return d.toLocaleString('en-US', {weekday:'short', month:'short', day:'numeric', hour:'numeric', minute:'2-digit'});
}

function renderPickupNotes(){
  const regular = `Order today, earliest pickup <b>${earliestPickup(24)}</b> (24hrs notice)`;
  const menuNote = document.getElementById('menuPickupNote');
  if(menuNote) menuNote.innerHTML = regular;
  const coNote = document.getElementById('checkoutPickupNote');
  if(coNote) coNote.innerHTML = regular;
}
