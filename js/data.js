/* ---------------- MENU DATA ---------------- */
const MENU = [
  {name:"Jollof Rice", cat:"Rice", sizes:[["Quarter Tray",40],["Half Tray",55],["Large Tray",100]], featured:true},
  {name:"Fried Rice", cat:"Rice", sizes:[["Quarter Tray",45],["Half Tray",60],["Large Tray",110]]},
  {name:"Asun Rice", cat:"Rice", sizes:[["Quarter Tray",55],["Half Tray",110],["Large Tray",240]]},
  {name:"Native Rice", cat:"Rice", sizes:[["Quarter Tray",55],["Half Tray",125],["Large Tray",240]]},
  {name:"Seafood Fried Rice", cat:"Rice", sizes:[["Quarter Tray",70],["Half Tray",150],["Large Tray",240]]},
  {name:"Steamed White Rice", cat:"Rice", sizes:[["Quarter Tray",20],["Half Tray",40],["Large Tray",70]]},
  {name:"Egusi", cat:"Nigerian Soups", sizes:[["Quarter Tray",70],["Half Tray",150],["Large Tray",280]], featured:true},
  {name:"Efo Riro", cat:"Nigerian Soups", sizes:[["Quarter Tray",70],["Half Tray",150],["Large Tray",300]], featured:true},
  {name:"Okra", cat:"Nigerian Soups", sizes:[["Quarter Tray",70],["Half Tray",130],["Large Tray",260]]},
  {name:"Ogbono", cat:"Nigerian Soups", sizes:[["Quarter Tray",70],["Half Tray",150],["Large Tray",300]]},
  {name:"Fisherman Soup", cat:"Nigerian Soups", sizes:[["Quarter Tray",100],["Half Tray",180],["Large Tray",350]]},
  {name:"Seafood Okro", cat:"Nigerian Soups", sizes:[["Quarter Tray",100],["Half Tray",180],["Large Tray",350]]},
  {name:"Ofada Sauce", cat:"Sauces", sizes:[["Quarter Tray",70],["Half Tray",150],["Large Tray",300]]},
  {name:"Poundo, Eba, Amala", cat:"Swallows & More", sizes:[["Per Serving",3]], minQty:12},
  {name:"Beans Pottage", cat:"Swallows & More", sizes:[["Quarter Tray",50],["Half Tray",70],["Large Tray",140]]},
  {name:"Boiled Yam and Egg", cat:"Swallows & More", sizes:[["Quarter Tray",80],["Half Tray",100],["Large Tray",200]]},
  {name:"Combo — Half Rice + Half Beans + Half Ata Din Din", cat:"Swallows & More", sizes:[["Combo",220]], addons:"Plantain"},
  {name:"Akara", cat:"Swallows & More", sizes:[["Half Tray",55],["Large Tray",110]]},
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
  ["Do you offer delivery?", "No — pickup only in Gardena, California. You're welcome to arrange a third-party courier like Uber or Lyft."],
  ["Where are you located?", "Gardena, California / greater Los Angeles area. The exact pickup address is shared once your order is confirmed."],
  ["What type of food do you serve?", "Authentic Nigerian cuisine — rice dishes, soups, stews, pepper soups, swallows, small chops and more."],
  ["Do you cater for events?", "Yes — weddings, birthdays, corporate events, baby showers, graduations and more. Request a quote on the Catering page."],
  ["How far in advance should I place my order?", "Regular orders: minimum 24 hours notice. Catering orders: minimum 48–72 hours notice."],
  ["Do you accommodate dietary restrictions?", "Let us know your dietary restrictions or allergies when ordering or requesting a catering quote, and we'll do our best to accommodate."],
  ["What payment methods do you accept?", "Zelle and PayPal. Orders are prepared fresh once payment is received."],
  ["What is your cancellation policy?", "See our Cancellation & Refunds policy, or contact us directly to discuss your order."],
  ["Can I make changes to my order?", "Reach out by phone, WhatsApp or email as soon as possible — changes depend on how far along your order is."],
  ["How do I place an order?", "Browse the menu, add items to your cart, then send your order over WhatsApp and pay by Zelle or PayPal."],
  ["Do you offer custom catering menus?", "Yes — tell us your preferences in the catering quote form and we'll build a menu around your event."],
  ["How can I contact Ennieskitchen?", "Call or WhatsApp +1 (323) 578-6993, or email Ennieskitchen259@gmail.com."]
];

/* ---------------- SHARED HELPERS ---------------- */
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
  const colors = ['var(--amber)','var(--terracotta)','var(--green)','#D98A5F'];
  return colors[idx % colors.length];
}

function slugify(name){
  return name
    .toLowerCase()
    .replace(/&/g,'and')
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/^-+|-+$/g,'');
}

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
