// ============================================================
// STATE
// ============================================================
let uploadedFiles = [];      // Array of { file, dataUrl, name }
let extractedData = [];      // Array of items per plan data model
let processingCancelled = false;
let tesseractWorker = null;
let successfulFiles = []; // { name, itemCount, total }
let failedFiles = [];     // { name, reason, uploadIndex }
let removedFiles = [];    // { name, source } - source: 'successful' or 'failed'

// ============================================================
// ABBREVIATION DICTIONARY
// ============================================================
const DEFAULT_ABBREVS = {
  "GV":"Great Value","GRT VL":"Great Value","GRTVL":"Great Value",
  "ORG":"Organic","ORGN":"Organic","WHL":"Whole","MLK":"Milk",
  "CKN":"Chicken","CHKN":"Chicken","BF":"Beef","GRND":"Ground",
  "BNLS":"Boneless","SKNLS":"Skinless","BRST":"Breast","THGH":"Thigh",
  "LG":"Large","SM":"Small","MD":"Medium","XL":"Extra Large",
  "FRZ":"Frozen","FRZN":"Frozen","CND":"Canned","PKG":"Package",
  "BRD":"Bread","WHT":"White","WW":"Whole Wheat","MLT":"Multi",
  "GRN":"Green","RED":"Red","YLW":"Yellow","FRH":"Fresh",
  "VEG":"Vegetable","VEGS":"Vegetables","FRT":"Fruit","FRTS":"Fruits",
  "JCE":"Juice","WTR":"Water","SDR":"Soda","SPRT":"Sprite",
  "BTR":"Butter","CHS":"Cheese","CHDR":"Cheddar","MOZ":"Mozzarella",
  "YGT":"Yogurt","YGRT":"Yogurt","CRM":"Cream","SR CRM":"Sour Cream",
  "EGG":"Eggs","EGGS":"Eggs","DZ":"Dozen",
  "RC":"Rice","PST":"Pasta","SPAG":"Spaghetti","MAC":"Macaroni",
  "SG":"Sugar","FLR":"Flour","OL":"Oil","OLV":"Olive",
  "SLT":"Salt","PPR":"Pepper","SSNNG":"Seasoning","SPC":"Spice",
  "SAU":"Sauce","KTCHP":"Ketchup","MSTRD":"Mustard","MAYO":"Mayonnaise",
  "TP":"Toilet Paper","TLTP":"Toilet Paper","PT":"Paper Towels","PPTW":"Paper Towels",
  "DET":"Detergent","LNDRY":"Laundry","DSHWSH":"Dishwasher","CLNR":"Cleaner",
  "SHMP":"Shampoo","CNDTNR":"Conditioner","TPST":"Toothpaste","DDRNT":"Deodorant",
  "BCON":"Bacon","SAUS":"Sausage","HM":"Ham","TRKY":"Turkey",
  "TUNA":"Tuna","SLMN":"Salmon","SHRMP":"Shrimp",
  "CRCKR":"Crackers","CHP":"Chips","CHPS":"Chips","CKIE":"Cookie","CKIES":"Cookies",
  "CRL":"Cereal","OTM":"Oatmeal","PNCKE":"Pancake",
  "TMT":"Tomato","TMTS":"Tomatoes","PTT":"Potato","PTTS":"Potatoes",
  "ONI":"Onion","ONIS":"Onions","GRLIC":"Garlic","CRRT":"Carrot",
  "BRCLI":"Broccoli","SPNCH":"Spinach","LTCE":"Lettuce",
  "APL":"Apple","APLS":"Apples","BNN":"Banana","BNNS":"Bananas",
  "ORNGE":"Orange","ORNGS":"Oranges","STRW":"Strawberry","STRWS":"Strawberries",
  "BLUBY":"Blueberry","BLUBYS":"Blueberries","GRP":"Grape","GRPS":"Grapes",
  "LMN":"Lemon","LME":"Lime","AVCD":"Avocado",
  "BN":"Bean","BNS":"Beans","CRN":"Corn","PEA":"Peas",
  "SNDWCH":"Sandwich","WRAP":"Wrap","TRTLA":"Tortilla",
  "CF":"Coffee","TEA":"Tea","CHOC":"Chocolate","VNL":"Vanilla",
  "PNT":"Peanut","ALMND":"Almond","WLNT":"Walnut",
  "BBY":"Baby","DIPR":"Diaper","DPRS":"Diapers","WIPE":"Wipes",
  "DOG":"Dog","CAT":"Cat","PET":"Pet","FD":"Food",
  "SNCK":"Snack","SNKS":"Snacks","BAR":"Bar","BARS":"Bars",
  "ICE CRM":"Ice Cream","ICRM":"Ice Cream","PZZA":"Pizza","PSTA":"Pasta",
  "SHP":"Shop","MRKT":"Market","SS":"Stainless Steel","PLSTC":"Plastic",
  "GALLN":"Gallon","GAL":"Gallon","QT":"Quart","OZ":"Ounce","LB":"Pound","CT":"Count","PK":"Pack",
  "KS":"Kirkland Signature","MM":"Members Mark","MKT":"Marketside","SS":"Simply","HMSTL":"Homestyle"
};

function loadAbbrevDict() {
  const saved = localStorage.getItem('scanner_abbrevDict');
  if (saved) {
    try { return { ...DEFAULT_ABBREVS, ...JSON.parse(saved) }; } catch(e) {}
  }
  return { ...DEFAULT_ABBREVS };
}
function saveAbbrevDict(dict) {
  const custom = {};
  for (const [k,v] of Object.entries(dict)) {
    if (!DEFAULT_ABBREVS[k] || DEFAULT_ABBREVS[k] !== v) custom[k] = v;
  }
  localStorage.setItem('scanner_abbrevDict', JSON.stringify(custom));
}

let abbrevDict = loadAbbrevDict();

function bigrams(s) {
  s = s.toUpperCase();
  const b = [];
  for (let i = 0; i < s.length - 1; i++) b.push(s.slice(i, i+2));
  return b;
}
function diceCoefficient(a, b) {
  const ba = bigrams(a), bb = bigrams(b);
  if (!ba.length && !bb.length) return 1;
  if (!ba.length || !bb.length) return 0;
  const setB = new Set(bb);
  let matches = 0;
  for (const bg of ba) if (setB.has(bg)) matches++;
  return (2 * matches) / (ba.length + bb.length);
}
function fuzzyMatch(token, dict) {
  let best = null, bestScore = 0;
  const up = token.toUpperCase();
  for (const [abbr, full] of Object.entries(dict)) {
    const score = diceCoefficient(up, abbr);
    if (score > bestScore && score >= 0.6) { best = full; bestScore = score; }
  }
  return best;
}
function decodeAbbreviation(rawName) {
  const tokens = rawName.trim().split(/\s+/);
  const decoded = tokens.map(t => {
    const up = t.toUpperCase();
    if (abbrevDict[up]) return abbrevDict[up];
    const fm = fuzzyMatch(up, abbrevDict);
    if (fm) return fm;
    return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
  });
  return decoded.join(' ');
}

// ============================================================
// CATEGORY ASSIGNMENT
// ============================================================
const CATEGORY_KEYWORDS = {
  "Dairy & Eggs":["milk","cheese","yogurt","butter","cream","egg","sour cream","cottage","cheddar","mozzarella","parmesan","whip","creamer","half & half"],
  "Meat & Seafood":["chicken","beef","pork","turkey","salmon","shrimp","fish","steak","sausage","bacon","ham","ground","tilapia","tuna","crab","ribs","lamb","hot dog","deli","roast"],
  "Produce":["apple","banana","orange","grape","strawberr","blueberr","raspberr","avocado","tomato","potato","onion","garlic","lettuce","spinach","broccoli","carrot","pepper","celery","cucumber","mushroom","lemon","lime","watermelon","mango","pineapple","peach","pear","kiwi","corn","zucchini","squash","cabbage","cilantro","basil","ginger","berry"],
  "Bakery & Bread":["bread","bagel","muffin","roll","tortilla","bun","croissant","cake","donut","pie crust","biscuit","pita","english muffin"],
  "Frozen":["frozen","ice cream","pizza","waffle","popsicle","ice pop","freezer","lean cuisine","hot pocket","tv dinner","eggo"],
  "Canned & Packaged":["canned","can ","soup","beans","broth","stock","tomato sauce","diced tomato","paste","tuna can","spam","vienna","ramen","noodle","mac & cheese","mac and cheese","instant","cup noodle","chef boyardee"],
  "Snacks & Candy":["chips","cookie","cracker","pretzel","popcorn","candy","chocolate","gummy","granola bar","trail mix","nut","snack","goldfish","cheez","oreo","doritos","lays","pringles","m&m"],
  "Beverages":["water","juice","soda","cola","tea","coffee","drink","gatorade","powerade","lemonade","sprite","pepsi","coke","fanta","kool","capri sun","v8","wine","beer"],
  "Condiments & Sauces":["ketchup","mustard","mayo","sauce","dressing","salsa","soy sauce","hot sauce","vinegar","bbq","ranch","honey","syrup","jam","jelly","peanut butter","nutella","relish","marinade","oil","olive oil"],
  "Grains & Pasta":["rice","pasta","spaghetti","macaroni","penne","flour","oat","cereal","granola","quinoa","couscous","cornmeal","grits","pancake mix","stuffing"],
  "Baking & Cooking":["sugar","baking","vanilla","yeast","cocoa","frosting","sprinkles","cornstarch","baking soda","baking powder","shortening","extract","food color","pie filling","marshmallow"],
  "Baby Products":["baby","diaper","wipes","formula","gerber","enfamil","similac","sippy","pacifier","baby food","infant"],
  "Pet Supplies":["dog","cat","pet","puppy","kitten","treats","kibble","litter","purina","pedigree","meow"],
  "Other Grocery":["seasoning","spice","salt","pepper","herb","cumin","paprika","oregano","cinnamon","garlic powder","onion powder"],
  "Cleaning Products":["cleaner","bleach","lysol","windex","clorox","mop","broom","sponge","trash bag","garbage bag","disinfect","scrub","pine sol","ajax","dawn dish"],
  "Paper Products":["paper towel","toilet paper","tissue","napkin","plate","cup ","bowl ","aluminum foil","plastic wrap","ziploc","glad","dixie","bounty","charmin"],
  "Personal Care":["shampoo","conditioner","body wash","soap","toothpaste","toothbrush","deodorant","lotion","razor","shaving","cotton","q-tip","floss","mouthwash","feminine","tampon","pad ","dove","pantene","crest","colgate"],
  "Health & Medicine":["vitamin","medicine","tylenol","advil","bandaid","band-aid","first aid","cough","cold ","allergy","antacid","ibuprofen","thermometer","alcohol","peroxide","neosporin"],
  "Kitchen & Home":["container","storage","candle","light bulb","battery","extension","hanger","glue","tape","scissors","towel","rug","curtain"],
  "Laundry":["detergent","laundry","fabric softener","dryer sheet","stain","tide","downy","oxiclean","bleach"],
  "Electronics & Misc":["charger","cable","usb","phone","headphone","adapter","flash drive","memory card"],
  "Other Non-Grocery":[]
};

const NON_GROCERY_CATS = new Set(["Cleaning Products","Paper Products","Personal Care","Health & Medicine","Kitchen & Home","Laundry","Electronics & Misc","Other Non-Grocery"]);

function assignCategory(productName) {
  const lower = productName.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) return cat;
    }
  }
  return "Other Grocery";
}
function isNonGrocery(category) { return NON_GROCERY_CATS.has(category); }

// ============================================================
// STORE DETECTION
// ============================================================
const STORE_PATTERNS = [
  { regex: /walmart|wal[\s-]*mart|wm\s*supercenter/i, name: "Walmart" },
  { regex: /publix/i, name: "Publix" },
  { regex: /target/i, name: "Target" },
  { regex: /costco/i, name: "Costco" },
  { regex: /kroger/i, name: "Kroger" },
  { regex: /aldi/i, name: "Aldi" },
  { regex: /h[\s-]*e[\s-]*b\b/i, name: "HEB" },
  { regex: /trader\s*joe/i, name: "Trader Joes" },
  { regex: /whole\s*foods/i, name: "Whole Foods" },
  { regex: /safeway/i, name: "Safeway" },
  { regex: /albertson/i, name: "Albertsons" },
  { regex: /meijer/i, name: "Meijer" },
  { regex: /food\s*lion/i, name: "Food Lion" },
  { regex: /winco/i, name: "WinCo" },
  { regex: /wegman/i, name: "Wegmans" },
  { regex: /sprout/i, name: "Sprouts" },
  { regex: /sam'?s\s*club/i, name: "Sams Club" },
  { regex: /bj'?s/i, name: "BJs" },
  { regex: /dollar\s*(tree|general)/i, name: "Dollar Store" },
  { regex: /cvs/i, name: "CVS" },
  { regex: /walgreen/i, name: "Walgreens" }
];

function detectStore(text) {
  for (const sp of STORE_PATTERNS) {
    if (sp.regex.test(text)) return sp.name;
  }
  return "Unknown Store";
}

function extractDate(text) {
  // Try various date formats
  const patterns = [
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/,
    /(\w{3,9})\s+(\d{1,2}),?\s+(\d{2,4})/i,
    /(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+(\d{2,4})/i
  ];
  const months = {jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12,
    january:1,february:2,march:3,april:4,may:5,june:6,july:7,august:8,september:9,october:10,november:11,december:12};

  for (const p of patterns) {
    const m = text.match(p);
    if (m) {
      let month, day;
      if (/\d/.test(m[1])) {
        // Numeric format MM/DD/YYYY
        month = parseInt(m[1]); day = parseInt(m[2]);
        if (month > 12) { const t = month; month = day; day = t; }
      } else {
        // Named month
        month = months[m[1].toLowerCase()];
        day = parseInt(m[2]);
      }
      if (month && day && month <= 12 && day <= 31) {
        return String(month).padStart(2,'0') + '/' + String(day).padStart(2,'0');
      }
    }
  }
  // No date found — leave blank for user to fill in
  return '';
}

// ============================================================
// RECEIPT LINE PARSERS
// ============================================================

// Fix common OCR digit/letter swaps in price strings
function fixOcrPrice(s) {
  return s.replace(/[OoQ]/g, '0').replace(/[Il!]/g, '1').replace(/[Ss]/g, '5').replace(/[Bb]/g, '8').replace(/[,]/g, '.');
}

// Try to extract a price from a line (handles OCR noise, multiple formats)
function extractTrailingPrice(line) {
  let m;
  // 1. Standard with 2+ spaces: "ITEM NAME   1.99" / "$1.99" / "1.99 N"
  m = line.match(/^(.+?)\s{2,}[\$]?(\d{1,3}[.,]\d{2})\s*[A-Za-z]?\s*$/);
  if (m) return { name: m[1].trim(), price: parseFloat(fixOcrPrice(m[2])) };
  // 2. Single space before price: "ITEM NAME 1.99"
  m = line.match(/^(.{3,}?)\s+[\$]?(\d{1,3}\.\d{2})\s*[A-Za-z]?\s*$/);
  if (m && !/^\d+$/.test(m[1].trim())) return { name: m[1].trim(), price: parseFloat(m[2]) };
  // 3. Price with $ anywhere: "ITEM NAME $1.99"
  m = line.match(/^(.{2,}?)\s*\$(\d{1,3}\.\d{2})\s*[A-Za-z]?\s*$/);
  if (m) return { name: m[1].trim(), price: parseFloat(m[2]) };
  // 4. OCR reads period as comma or space: "1,99" or "1 99"
  m = line.match(/^(.{3,}?)\s+[\$]?(\d{1,3})[,\s](\d{2})\s*[A-Za-z]?\s*$/);
  if (m) return { name: m[1].trim(), price: parseFloat(m[2] + '.' + m[3]) };
  // 5. Negative/refund: "-1.99" or "- $1.99"
  m = line.match(/^(.+?)\s+-?\s*[\$]?(\d{1,3}\.\d{2})\s*-\s*$/);
  if (m) return { name: m[1].trim(), price: -parseFloat(m[2]) };
  m = line.match(/^(.+?)\s{2,}-\s*[\$]?(\d{1,3}\.\d{2})\s*[A-Za-z]?\s*$/);
  if (m) return { name: m[1].trim(), price: -parseFloat(m[2]) };
  // 6. Price stuck to name (no space): "MILK3.99" — last resort
  m = line.match(/^([A-Za-z].{2,}?)(\d{1,3}\.\d{2})\s*[A-Za-z]?\s*$/);
  if (m) return { name: m[1].trim(), price: parseFloat(m[2]) };
  // 7. Two prices on line (original + discounted): "ITEM  5.99  4.99" — take last price
  m = line.match(/^(.+?)\s+\d+\.\d{2}\s+[\$]?(\d{1,3}\.\d{2})\s*[A-Za-z]?\s*$/);
  if (m) return { name: m[1].trim(), price: parseFloat(m[2]) };
  return null;
}

// Lines to skip (non-item content)
const SKIP_RE = /subtotal|sub\s*total|^\s*total\b|sales?\s*tax|change\s*due|cash\s*tend|credit|debit|visa|master\s*card|amex|discover|account|balance|tend|thank|welcome|store\s*#|receipt|phone|address|www\.|\.com|\.net|member|saving|you\s*saved|regular\s*price|orig\s*price|price\s*reduced|loyalty|rewards|coupon|^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|^\s*\d{3,4}\s*$|ebt|snap|payment|approved|chip|swipe|pin|transaction|cashier|register|terminal|tc#|ref#|auth|appr|items?\s*sold|number of items/i;
const SKIP_LINE_RE = /^\*|^\-{2,}|^={2,}|^#{2,}|^_+$|^\s*\d+\s*$/;

function parseReceiptLines(text, store) {
  switch(store) {
    case 'Walmart': return parseWalmart(text);
    case 'Target': return parseTarget(text);
    case 'Costco': return parseCostco(text);
    case 'Publix': return parsePublix(text);
    default: return parseGeneric(text);
  }
}

function parseWalmart(text) {
  const items = [];
  const lines = text.split('\n');
  const qtyRe = /^(\d+)\s*[@xX]\s*\$?(\d{1,3}[.,]\d{2})/;
  let pendingQty = null;
  let pendingName = null;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;
    if (SKIP_RE.test(trimmed) || SKIP_LINE_RE.test(trimmed)) { pendingName = null; continue; }

    // Check for quantity line
    const qm = trimmed.match(qtyRe);
    if (qm) { pendingQty = { qty: parseInt(qm[1]), unit: parseFloat(fixOcrPrice(qm[2])) }; continue; }

    // Try to extract price from this line
    const result = extractTrailingPrice(trimmed);
    if (result && result.price > 0 && result.price <= 500 && result.name.length >= 2) {
      const qty = pendingQty ? pendingQty.qty : 1;
      const unit = pendingQty ? pendingQty.unit : result.price;
      items.push({ rawName: result.name, qty, unitPrice: unit, total: result.price });
      pendingQty = null;
      pendingName = null;
    } else if (trimmed.length >= 3 && !/^\d+$/.test(trimmed)) {
      // Line with no price — could be item name with price on next line
      pendingName = trimmed;
    }

    // Check if next line is just a price (multi-line item)
    if (pendingName && i + 1 < lines.length) {
      const nextTrimmed = lines[i + 1].trim();
      const priceOnly = nextTrimmed.match(/^[\$]?(\d{1,3}[.,]\d{2})\s*[A-Za-z]?\s*$/);
      if (priceOnly) {
        const price = parseFloat(fixOcrPrice(priceOnly[1]));
        if (price > 0 && price <= 500 && pendingName.length >= 2) {
          const qty = pendingQty ? pendingQty.qty : 1;
          const unit = pendingQty ? pendingQty.unit : price;
          items.push({ rawName: pendingName, qty, unitPrice: unit, total: price });
          pendingQty = null;
          pendingName = null;
          i++; // Skip the price line
        }
      }
    }
  }
  return items;
}

function parseTarget(text) {
  return parseGeneric(text);
}

function parseCostco(text) {
  const items = [];
  const lines = text.split('\n');
  // Costco: item number (5-7 digits) + description + price
  const re = /^\d{4,}\s+(.+?)\s{2,}[\$]?(\d{1,3}[.,]\d{2})\s*[A-Za-z]?\s*$/;
  for (const line of lines) {
    const trimmed = line.trim();
    if (SKIP_RE.test(trimmed)) continue;
    const m = trimmed.match(re);
    if (m) {
      const name = m[1].trim();
      const price = parseFloat(fixOcrPrice(m[2]));
      if (name.length >= 2 && price > 0 && price <= 500) {
        items.push({ rawName: name, qty: 1, unitPrice: price, total: price });
      }
    }
  }
  if (items.length === 0) return parseGeneric(text);
  return items;
}

function parsePublix(text) {
  return parseGeneric(text);
}

function parseGeneric(text) {
  const items = [];
  const lines = text.split('\n');
  const qtyPriceRe = /^(\d+)\s*[@xX]\s*\$?(\d{1,3}[.,]\d{2})/i;
  let pendingQty = null;
  let pendingName = null;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed || trimmed.length < 3) continue;
    if (SKIP_RE.test(trimmed) || SKIP_LINE_RE.test(trimmed)) { pendingName = null; continue; }

    // Check for quantity line
    const qm = trimmed.match(qtyPriceRe);
    if (qm) { pendingQty = { qty: parseInt(qm[1]), unit: parseFloat(fixOcrPrice(qm[2])) }; continue; }

    // Try to extract price from this line
    const result = extractTrailingPrice(trimmed);
    if (result) {
      let name = result.name.replace(/^\d{4,}\s*/, '').trim(); // Strip item codes
      const price = result.price;
      if (name.length >= 2 && Math.abs(price) > 0 && Math.abs(price) <= 500) {
        const qty = pendingQty ? pendingQty.qty : 1;
        const unit = pendingQty ? pendingQty.unit : Math.abs(price);
        items.push({ rawName: name, qty, unitPrice: unit, total: Math.abs(price) });
        pendingQty = null;
        pendingName = null;
        continue;
      }
    }

    // No price found — might be item name with price on next line
    if (trimmed.length >= 3 && !/^\d+$/.test(trimmed)) {
      pendingName = trimmed;
    }

    // Check if next line is just a price (multi-line item: name on one line, price on next)
    if (pendingName && i + 1 < lines.length) {
      const nextTrimmed = lines[i + 1].trim();
      const priceOnly = nextTrimmed.match(/^[\$]?(\d{1,3}[.,]\d{2})\s*[A-Za-z]?\s*$/);
      if (priceOnly) {
        const price = parseFloat(fixOcrPrice(priceOnly[1]));
        if (price > 0 && price <= 500) {
          let name = pendingName.replace(/^\d{4,}\s*/, '').trim();
          if (name.length >= 2) {
            const qty = pendingQty ? pendingQty.qty : 1;
            const unit = pendingQty ? pendingQty.unit : price;
            items.push({ rawName: name, qty, unitPrice: unit, total: price });
            pendingQty = null;
            pendingName = null;
            i++; // Skip the price line
            continue;
          }
        }
      }
    }
  }
  return items;
}

// ============================================================
// IMAGE PREPROCESSING
// ============================================================

// Otsu's method — finds optimal threshold by minimizing intra-class variance
function otsuThreshold(histogram) {
  const total = histogram.reduce((a, b) => a + b, 0);
  let sum = 0;
  for (let i = 0; i < 256; i++) sum += i * histogram[i];
  let sumB = 0, wB = 0, wF = 0, maxVariance = 0, threshold = 128;
  for (let t = 0; t < 256; t++) {
    wB += histogram[t];
    if (wB === 0) continue;
    wF = total - wB;
    if (wF === 0) break;
    sumB += t * histogram[t];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const variance = wB * wF * (mB - mF) * (mB - mF);
    if (variance > maxVariance) { maxVariance = variance; threshold = t; }
  }
  return threshold;
}

// Adaptive local thresholding — uses mean of local window
function adaptiveThreshold(grayPixels, w, h, blockSize, C) {
  const out = new Uint8Array(w * h);
  const half = Math.floor(blockSize / 2);
  // Build integral image for fast local mean
  const integral = new Float64Array((w + 1) * (h + 1));
  for (let y = 0; y < h; y++) {
    let rowSum = 0;
    for (let x = 0; x < w; x++) {
      rowSum += grayPixels[y * w + x];
      integral[(y + 1) * (w + 1) + (x + 1)] = integral[y * (w + 1) + (x + 1)] + rowSum;
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const x1 = Math.max(0, x - half), y1 = Math.max(0, y - half);
      const x2 = Math.min(w - 1, x + half), y2 = Math.min(h - 1, y + half);
      const count = (x2 - x1 + 1) * (y2 - y1 + 1);
      const sum = integral[(y2 + 1) * (w + 1) + (x2 + 1)]
                - integral[y1 * (w + 1) + (x2 + 1)]
                - integral[(y2 + 1) * (w + 1) + x1]
                + integral[y1 * (w + 1) + x1];
      const localMean = sum / count;
      out[y * w + x] = grayPixels[y * w + x] > (localMean - C) ? 255 : 0;
    }
  }
  return out;
}

function preprocessImage(dataUrl, mode) {
  // mode: 'adaptive' (default), 'otsu', 'raw' (grayscale only, no threshold)
  mode = mode || 'adaptive';
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      let w = img.width, h = img.height;
      // Scale up aggressively — receipts need high resolution for OCR
      // Target at least 2400px wide for good Tesseract results
      const scale = w < 1200 ? 3 : w < 2000 ? 2 : 1;
      w *= scale; h *= scale;
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      // Use high-quality interpolation
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, w, h);

      const imageData = ctx.getImageData(0, 0, w, h);
      const d = imageData.data;
      const grayPixels = new Uint8Array(w * h);

      // Step 1: Convert to grayscale
      for (let i = 0; i < d.length; i += 4) {
        grayPixels[i / 4] = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
      }

      // Step 2: Sharpen (3x3 unsharp kernel)
      const sharpened = new Uint8Array(w * h);
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const idx = y * w + x;
          // 3x3 sharpening: center*5 - neighbors
          const val = 5 * grayPixels[idx]
            - grayPixels[(y - 1) * w + x]
            - grayPixels[(y + 1) * w + x]
            - grayPixels[y * w + (x - 1)]
            - grayPixels[y * w + (x + 1)];
          sharpened[idx] = Math.max(0, Math.min(255, val));
        }
      }
      // Copy edges
      for (let x = 0; x < w; x++) { sharpened[x] = grayPixels[x]; sharpened[(h - 1) * w + x] = grayPixels[(h - 1) * w + x]; }
      for (let y = 0; y < h; y++) { sharpened[y * w] = grayPixels[y * w]; sharpened[y * w + w - 1] = grayPixels[y * w + w - 1]; }

      let finalPixels;
      if (mode === 'raw') {
        // No thresholding — just sharpened grayscale (lets Tesseract do its own binarization)
        finalPixels = sharpened;
      } else if (mode === 'otsu') {
        // Otsu's global threshold
        const histogram = new Array(256).fill(0);
        for (let i = 0; i < sharpened.length; i++) histogram[sharpened[i]]++;
        const thresh = otsuThreshold(histogram);
        finalPixels = sharpened.map(v => v > thresh ? 255 : 0);
      } else {
        // Adaptive local threshold (best for receipts with uneven lighting)
        const blockSize = Math.max(15, Math.round(Math.min(w, h) / 30) | 1);
        finalPixels = adaptiveThreshold(sharpened, w, h, blockSize, 10);
      }

      // Write back to canvas
      for (let i = 0; i < finalPixels.length; i++) {
        const v = finalPixels[i];
        d[i * 4] = v; d[i * 4 + 1] = v; d[i * 4 + 2] = v;
      }
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = dataUrl;
  });
}

// ============================================================
// FILE UPLOAD HANDLING
// ============================================================
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const thumbGrid = document.getElementById('thumbGrid');
const uploadActions = document.getElementById('uploadActions');

dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  handleFiles(e.dataTransfer.files);
});
fileInput.addEventListener('change', () => { handleFiles(fileInput.files); fileInput.value = ''; });

const MAX_PDF_PAGES = 20;

async function renderPdfPages(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = Math.min(pdf.numPages, MAX_PDF_PAGES);

  if (pdf.numPages > MAX_PDF_PAGES) {
    log(`PDF has ${pdf.numPages} pages — processing first ${MAX_PDF_PAGES} only.`, 'error');
  }

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    const page = await pdf.getPage(i);
    const scale = 2;
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport }).promise;

    // Check if page is blank (mostly white)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let darkPixels = 0;
    for (let p = 0; p < pixels.length; p += 16) {
      if (pixels[p] < 240 || pixels[p+1] < 240 || pixels[p+2] < 240) darkPixels++;
    }
    if (darkPixels < (pixels.length / 16) * 0.01) {
      continue; // skip blank page
    }

    const dataUrl = canvas.toDataURL('image/png');
    pages.push({
      dataUrl,
      name: `${file.name} (page ${i}${totalPages > 1 ? '/' + totalPages : ''})`,
      pageNum: i,
      totalPages
    });
  }

  if (!pages.length) throw new Error('PDF appears to be empty or contains only blank pages');
  return pages;
}

function handleFiles(fileList) {
  // Demo mode: allow 1 file only, then require sign-up
  const isDemo = typeof DEMO_MODE !== 'undefined' && DEMO_MODE;
  if (isDemo && uploadedFiles.length >= 1) {
    if (typeof showDemoUpgradePrompt === 'function') {
      showDemoUpgradePrompt('Demo mode is limited to 1 file. Sign up for a free account to scan unlimited receipts, PDFs, and online orders.');
    }
    return;
  }

  const files = Array.from(fileList);
  const imageFiles = files.filter(f => f.type.startsWith('image/') || /\.(heic|tif|tiff)$/i.test(f.name));
  const pdfFiles = files.filter(f => f.type === 'application/pdf' || /\.pdf$/i.test(f.name));

  // Demo mode: limit to 1 file total
  const maxFiles = isDemo ? 1 : 100;
  const remaining = maxFiles - uploadedFiles.length;

  // Process images directly
  const imagesToAdd = imageFiles.slice(0, remaining);
  let added = imagesToAdd.length;

  for (const file of imagesToAdd) {
    const reader = new FileReader();
    reader.onload = () => {
      uploadedFiles.push({ file, dataUrl: reader.result, name: file.name, isPdf: false });
      renderThumbnails();
    };
    reader.readAsDataURL(file);
  }

  // Process PDFs — render pages to images
  const pdfsToAdd = pdfFiles.slice(0, Math.max(0, remaining - added));
  for (const file of pdfsToAdd) {
    renderPdfPages(file).then(pages => {
      const space = maxFiles - uploadedFiles.length;
      const pagesToAdd = pages.slice(0, space);
      for (const pg of pagesToAdd) {
        uploadedFiles.push({ file, dataUrl: pg.dataUrl, name: pg.name, isPdf: true, pageNum: pg.pageNum, totalPages: pg.totalPages });
      }
      renderThumbnails();
    }).catch(err => {
      log(`Failed to load PDF "${file.name}": ${err.message}`, 'error');
    });
  }

  const skipped = files.length - imageFiles.length - pdfFiles.length;
  if (skipped > 0) log(`${skipped} unsupported file(s) skipped.`, 'error');
  if (imageFiles.length + pdfFiles.length > remaining) {
    log(`Only adding ${remaining} more files (${maxFiles} max).`, 'error');
  }

  if (imagesToAdd.length || pdfsToAdd.length) setTimeout(renderThumbnails, 100);
}

function renderThumbnails() {
  thumbGrid.innerHTML = '';
  for (let i = 0; i < uploadedFiles.length; i++) {
    const uf = uploadedFiles[i];
    const card = document.createElement('div');
    card.className = 'thumb-card';
    let badge = '';
    if (uf.isPdf) badge = `<div class="thumb-badge">PDF p${uf.pageNum}</div>`;
    card.innerHTML = `<img src="${uf.dataUrl}" alt="${uf.name}">${badge}<div class="thumb-name" title="${uf.name}">${uf.name}</div><button class="thumb-remove" onclick="removeFile(${i})">&times;</button>`;
    thumbGrid.appendChild(card);
  }
  uploadActions.style.display = uploadedFiles.length ? 'flex' : 'none';
  const count = uploadedFiles.length;
  document.getElementById('uploadCount').textContent = count + ' file' + (count !== 1 ? 's' : '');
  document.getElementById('btnProcess').disabled = !count;
}

function removeFile(idx) {
  uploadedFiles.splice(idx, 1);
  renderThumbnails();
}
function clearAll() {
  uploadedFiles = [];
  renderThumbnails();
}

// ============================================================
// MODE SELECTOR
// ============================================================
let scanMode = 'ai'; // 'ai' or 'ocr'

function selectMode(mode) {
  scanMode = mode;
  localStorage.setItem('scanner_mode', mode);
  document.querySelectorAll('.mode-card').forEach(c => {
    const isSelected = c.dataset.mode === mode;
    c.classList.toggle('selected', isSelected);
    c.querySelector('.mode-badge').textContent = isSelected ? 'Selected' : 'Select';
  });
  document.getElementById('preprocessLabel').style.display = mode === 'ocr' ? '' : 'none';
}

// ============================================================
// STEP NAVIGATION
// ============================================================
function goToStep(n) {
  document.querySelectorAll('.step-item').forEach(el => {
    const s = parseInt(el.dataset.step);
    el.classList.toggle('active', s === n);
    el.classList.toggle('done', s < n);
  });
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById(['','panelUpload','panelProcessing','panelReview','panelExport'][n]).classList.add('active');
}

// ============================================================
// PROCESSING (OCR)
// ============================================================
function log(msg, type='') {
  const box = document.getElementById('logBox');
  if (!box) return;
  const div = document.createElement('div');
  div.className = 'log-line ' + type;
  div.textContent = msg;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

async function startProcessing() {
  if (!uploadedFiles.length) return;
  processingCancelled = false;
  extractedData = [];
  successfulFiles = [];
  failedFiles = [];
  removedFiles = [];
  goToStep(2);
  document.getElementById('logBox').innerHTML = '';

  const doPreprocess = document.getElementById('chkPreprocess').checked;
  const doAutoDetect = document.getElementById('chkAutoDetect').checked;
  const useGemini = scanMode === 'ai';

  const total = uploadedFiles.length;
  log(`Starting scan of ${total} receipt(s)...`, 'info');
  if (useGemini) log('Mode: AI-Powered (Gemini Vision)', 'info');
  else log('Mode: Offline OCR (Tesseract.js)', 'info');

  // Initialize Tesseract worker if not using Gemini
  if (!useGemini) {
    log('Initializing OCR engine...');
    try {
      tesseractWorker = await Tesseract.createWorker('eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            const pct = Math.round((m.progress || 0) * 100);
            document.getElementById('currentFileFill').style.width = pct + '%';
          }
        }
      });
      log('OCR engine ready', 'success');
    } catch(e) {
      log('Failed to initialize OCR: ' + e.message, 'error');
      return;
    }
  }

  for (let i = 0; i < total; i++) {
    if (processingCancelled) { log('Processing cancelled by user', 'error'); break; }
    const uf = uploadedFiles[i];
    const pct = Math.round(((i) / total) * 100);
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('progressPct').textContent = pct + '%';
    document.getElementById('progressText').textContent = `Processing ${i+1} of ${total}`;
    document.getElementById('currentFileText').textContent = uf.name;
    document.getElementById('currentFileFill').style.width = '0%';

    log(`[${i+1}/${total}] ${uf.name}`);

    try {
      let items;
      if (useGemini) {
        items = await processWithGemini(uf, doAutoDetect);
      } else {
        items = await processWithTesseract(uf, doPreprocess, doAutoDetect);
      }
      if (items.length) {
        log(`  Found ${items.length} item(s)`, 'success');
        extractedData.push(...items);
        successfulFiles.push({ name: uf.name, itemCount: items.length, total: items.reduce((s, it) => s + (it.t || 0), 0) });
      } else {
        log(`  No items detected`, 'error');
        failedFiles.push({ name: uf.name, reason: 'No items detected', uploadIndex: i });
      }
    } catch(e) {
      log(`  Error: ${e.message}`, 'error');
      failedFiles.push({ name: uf.name, reason: e.message, uploadIndex: i });
    }
  }

  // Cleanup
  if (tesseractWorker) {
    try { await tesseractWorker.terminate(); } catch(e) {}
    tesseractWorker = null;
  }

  document.getElementById('progressFill').style.width = '100%';
  document.getElementById('progressFill').classList.add('done');
  document.getElementById('progressPct').textContent = '100%';
  document.getElementById('progressText').textContent = 'Complete!';
  document.getElementById('currentFileFill').style.width = '100%';
  document.getElementById('currentFileFill').classList.add('done');
  document.getElementById('currentFileText').textContent = 'Done';

  log(`\nScan complete: ${extractedData.length} total items from ${total} receipt(s)`, 'success');

  if (extractedData.length > 0 || failedFiles.length > 0) {
    setTimeout(() => {
      goToStep(3);
      renderReview();
    }, 1000);
  }
}

async function runOcrPass(imageData, psm, label) {
  log(`  Pass: ${label} (PSM ${psm})...`);
  await tesseractWorker.setParameters({
    tessedit_pageseg_mode: String(psm),
    preserve_interword_spaces: '1',
  });
  const result = await tesseractWorker.recognize(imageData);
  const text = result.data.text || '';
  const confidence = result.data.confidence || 0;
  const lineCount = text.split('\n').filter(l => l.trim()).length;
  log(`    ${lineCount} lines, ${Math.round(confidence)}% conf`);
  return { text, confidence, label };
}

async function processWithTesseract(uf, doPreprocess, doAutoDetect) {
  if (processingCancelled) return [];

  // Prepare image variants
  log('  Preparing images...');
  const rawScaled = await preprocessImage(uf.dataUrl, 'raw');       // scaled + sharpened grayscale
  const adaptive = doPreprocess ? await preprocessImage(uf.dataUrl, 'adaptive') : null;

  // Multi-pass: try different image+PSM combos, pick the one that parses the most items
  // PSM 6 = uniform block, PSM 4 = single column, PSM 3 = fully automatic
  const strategies = [
    { img: rawScaled,  psm: 6, label: 'Grayscale + block' },
    { img: rawScaled,  psm: 4, label: 'Grayscale + column' },
    { img: uf.dataUrl, psm: 6, label: 'Original + block' },
  ];
  if (adaptive) {
    strategies.push({ img: adaptive, psm: 6, label: 'Adaptive + block' });
  }

  let bestItems = [];
  let bestText = '';
  let bestConf = 0;
  let bestStore = 'Unknown Store';
  let bestDate = '';
  let bestLabel = '';

  for (const strat of strategies) {
    if (processingCancelled) return [];
    try {
      const pass = await runOcrPass(strat.img, strat.psm, strat.label);
      if (!pass.text || pass.text.trim().length < 10) continue;

      const store = doAutoDetect ? detectStore(pass.text) : 'Unknown Store';
      const date = extractDate(pass.text);
      const items = parseReceiptLines(pass.text, store);

      log(`    → parsed ${items.length} item(s)`);

      if (items.length > bestItems.length || (items.length === bestItems.length && pass.confidence > bestConf)) {
        bestItems = items;
        bestText = pass.text;
        bestConf = pass.confidence;
        bestStore = store;
        bestDate = date;
        bestLabel = strat.label;
      }

      // If we got a good result, no need to keep trying
      if (items.length >= 5 && pass.confidence >= 60) {
        log(`  Good result from "${strat.label}", skipping remaining passes`, 'success');
        break;
      }
    } catch(e) {
      log(`    Error: ${e.message}`, 'error');
    }
  }

  if (doAutoDetect && bestText) log(`  Store: ${bestStore}, Date: ${bestDate}`);
  log(`  Winner: "${bestLabel}" with ${bestItems.length} item(s), ${Math.round(bestConf)}% conf`);

  // Always log raw OCR text so user can see what Tesseract actually read
  if (bestText) {
    const ocrLines = bestText.split('\n').filter(l => l.trim());
    const preview = ocrLines.slice(0, 20).map(l => '    ' + l.trim()).join('\n');
    log(`  ── Raw OCR text (${ocrLines.length} lines) ──\n${preview}${ocrLines.length > 20 ? '\n    ...' : ''}`, 'info');
  }

  return bestItems.map(ri => {
    const fullName = decodeAbbreviation(ri.rawName);
    const category = assignCategory(fullName);
    return {
      d: bestDate,
      s: bestStore,
      r: ri.rawName,
      n: fullName,
      c: category,
      q: ri.qty,
      u: ri.unitPrice,
      t: ri.total,
      ng: isNonGrocery(category),
      _file: uf.name,
      _confidence: bestConf
    };
  });
}

async function processWithGemini(uf, doAutoDetect) {
  log('  Sending to AI Scanner...');

  const base64 = uf.dataUrl.split(',')[1];
  const mimeType = uf.dataUrl.split(';')[0].split(':')[1] || 'image/jpeg';

  const resp = await fetch('https://receipt-proxy.vercel.app/api/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64, mimeType, autoDetect: doAutoDetect })
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error('Scan error: ' + (err.error || resp.status));
  }

  const data = await resp.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON in Gemini response');

  const parsed = JSON.parse(jsonMatch[0]);
  const store = (doAutoDetect && parsed.store) || 'Unknown Store';
  const date = (doAutoDetect && parsed.date) || '';

  const validCategories = new Set(ALL_CATEGORIES);
  return (parsed.items || []).map(item => {
    const fullName = item.fullName || item.rawName || '';
    const cat = (item.category && validCategories.has(item.category)) ? item.category : assignCategory(fullName);
    return {
      d: date,
      s: store,
      r: item.rawName || fullName,
      n: fullName,
      c: cat,
      q: item.quantity || 1,
      u: item.unitPrice || 0,
      t: item.total || (item.unitPrice * (item.quantity || 1)) || 0,
      ng: isNonGrocery(cat),
      _file: uf.name,
      _confidence: 95
    };
  });
}

function cancelProcessing() {
  processingCancelled = true;
  // Terminate worker immediately if running
  if (tesseractWorker) {
    try { tesseractWorker.terminate(); } catch(e) {}
    tesseractWorker = null;
  }
  // Reset progress bars and go back to upload
  document.getElementById('progressFill').style.width = '0%';
  document.getElementById('progressFill').classList.remove('done');
  document.getElementById('currentFileFill').style.width = '0%';
  document.getElementById('currentFileFill').classList.remove('done');
  goToStep(1);
}

// ============================================================
// REVIEW
// ============================================================
const ALL_CATEGORIES = [
  "Dairy & Eggs","Meat & Seafood","Produce","Bakery & Bread","Frozen",
  "Canned & Packaged","Snacks & Candy","Beverages","Condiments & Sauces",
  "Grains & Pasta","Baking & Cooking","Baby Products","Pet Supplies","Other Grocery",
  "Cleaning Products","Paper Products","Personal Care","Health & Medicine",
  "Kitchen & Home","Laundry","Electronics & Misc","Other Non-Grocery"
];

// ============================================================
// SCAN RESULTS SUMMARY
// ============================================================
const scanSectionCollapsed = { secSuccess: false, secFailed: false, secRemoved: true };

function renderScanSummary() {
  const container = document.getElementById('scanResultsSummary');
  if (!container) return;

  // Save current collapse state from DOM if sections exist
  ['secSuccess', 'secFailed', 'secRemoved'].forEach(id => {
    const body = document.getElementById(id);
    if (body) scanSectionCollapsed[id] = body.classList.contains('collapsed');
  });

  const sCount = successfulFiles.length;
  const fCount = failedFiles.length;
  const rCount = removedFiles.length;

  if (sCount + fCount + rCount === 0) { container.innerHTML = ''; return; }

  let html = '<div class="scan-results-summary">';

  // Badge row
  html += '<div class="scan-results-badges">';
  html += `<div class="scan-badge success" onclick="toggleScanSection('secSuccess')"><span class="badge-count">${sCount}</span> Successful</div>`;
  html += `<div class="scan-badge failed" onclick="toggleScanSection('secFailed')"><span class="badge-count">${fCount}</span> Failed</div>`;
  html += `<div class="scan-badge removed" onclick="toggleScanSection('secRemoved')"><span class="badge-count">${rCount}</span> Removed</div>`;
  html += '</div>';

  // Successful section
  html += '<div class="scan-section">';
  html += `<div class="scan-section-header${scanSectionCollapsed.secSuccess ? ' collapsed' : ''}" id="secSuccessHeader" onclick="toggleScanSection('secSuccess')">
    <span>Successful (${sCount})</span><span class="sec-chevron">&#9660;</span>
  </div>`;
  html += `<div class="scan-section-body${scanSectionCollapsed.secSuccess ? ' collapsed' : ''}" id="secSuccess">`;
  if (sCount === 0) {
    html += '<div class="scan-empty-state">No successful receipts</div>';
  } else {
    successfulFiles.forEach((f, i) => {
      html += `<div class="scan-file-entry" id="scanSucc_${i}">
        <div class="scan-file-info">
          <div class="scan-file-name">&#128206; ${escHtml(f.name)}</div>
          <div class="scan-file-detail">${f.itemCount} item(s) &middot; $${fmt(f.total)}</div>
        </div>
        <div class="scan-file-actions">
          <button class="scan-btn-remove" onclick="confirmRemoveReceipt(${i},'successful')" title="Remove receipt">&#10005;</button>
        </div>
      </div>`;
    });
  }
  html += '</div></div>';

  // Failed section
  html += '<div class="scan-section">';
  html += `<div class="scan-section-header${scanSectionCollapsed.secFailed ? ' collapsed' : ''}" id="secFailedHeader" onclick="toggleScanSection('secFailed')">
    <span>Failed (${fCount})</span><span class="sec-chevron">&#9660;</span>
  </div>`;
  html += `<div class="scan-section-body${scanSectionCollapsed.secFailed ? ' collapsed' : ''}" id="secFailed">`;
  if (fCount === 0) {
    html += '<div class="scan-empty-state">No failed receipts</div>';
  } else {
    failedFiles.forEach((f, i) => {
      html += `<div class="scan-file-entry" id="scanFail_${i}">
        <div class="scan-file-info">
          <div class="scan-file-name">&#128206; ${escHtml(f.name)}</div>
          <div class="scan-file-detail">${escHtml(f.reason)}</div>
        </div>
        <div class="scan-file-actions">
          <button class="scan-btn-retry" onclick="retryFailedReceipt(${i})" title="Retry scan">&#8635;</button>
          <button class="scan-btn-remove" onclick="confirmRemoveReceipt(${i},'failed')" title="Dismiss">&#10005;</button>
        </div>
      </div>`;
    });
  }
  html += '</div></div>';

  // Removed section (starts collapsed if empty)
  html += '<div class="scan-section">';
  html += `<div class="scan-section-header${scanSectionCollapsed.secRemoved ? ' collapsed' : ''}" id="secRemovedHeader" onclick="toggleScanSection('secRemoved')">
    <span>Removed (${rCount})</span><span class="sec-chevron">&#9660;</span>
  </div>`;
  html += `<div class="scan-section-body${scanSectionCollapsed.secRemoved ? ' collapsed' : ''}" id="secRemoved">`;
  if (rCount === 0) {
    html += '<div class="scan-empty-state">No removed receipts</div>';
  } else {
    removedFiles.forEach((f, i) => {
      html += `<div class="scan-file-entry">
        <div class="scan-file-info">
          <div class="scan-file-name" style="color:var(--muted)">&#128206; ${escHtml(f.name)}</div>
          <div class="scan-file-detail">Removed from ${escHtml(f.source)}</div>
        </div>
      </div>`;
    });
  }
  html += '</div></div>';

  html += '</div>';
  container.innerHTML = html;
}

function toggleScanSection(sectionId) {
  const body = document.getElementById(sectionId);
  const header = document.getElementById(sectionId + 'Header');
  if (body && header) {
    body.classList.toggle('collapsed');
    header.classList.toggle('collapsed');
  }
}

function confirmRemoveReceipt(index, source) {
  const prefix = source === 'successful' ? 'scanSucc' : 'scanFail';
  const entry = document.getElementById(`${prefix}_${index}`);
  if (!entry) return;

  // Don't show duplicate confirmation
  if (entry.querySelector('.scan-confirm-row')) return;

  const confirmHtml = `<div class="scan-confirm-row">
    <span>Remove this receipt?</span>
    <button class="scan-confirm-yes" onclick="executeRemoveReceipt(${index},'${source}')">Yes</button>
    <button class="scan-confirm-no" onclick="cancelRemoveReceipt(${index},'${source}')">No</button>
  </div>`;

  entry.insertAdjacentHTML('beforeend', confirmHtml);
}

function cancelRemoveReceipt(index, source) {
  const prefix = source === 'successful' ? 'scanSucc' : 'scanFail';
  const entry = document.getElementById(`${prefix}_${index}`);
  if (!entry) return;
  const confirmRow = entry.querySelector('.scan-confirm-row');
  if (confirmRow) confirmRow.remove();
}

function executeRemoveReceipt(index, source) {
  let removedFile;

  if (source === 'successful') {
    removedFile = successfulFiles.splice(index, 1)[0];
    if (removedFile) {
      extractedData = extractedData.filter(item => item._file !== removedFile.name);
      removedFiles.push({ name: removedFile.name, source: 'successful' });
    }
  } else if (source === 'failed') {
    removedFile = failedFiles.splice(index, 1)[0];
    if (removedFile) {
      removedFiles.push({ name: removedFile.name, source: 'failed' });
    }
  }

  renderReview();
}

async function retryFailedReceipt(index) {
  const failedFile = failedFiles[index];
  if (!failedFile) return;

  const uf = uploadedFiles[failedFile.uploadIndex];
  if (!uf) {
    showToast('Original file not found for retry.', 'warning');
    return;
  }

  const entry = document.getElementById(`scanFail_${index}`);
  const retryBtn = entry?.querySelector('.scan-btn-retry');
  if (retryBtn) {
    retryBtn.disabled = true;
    retryBtn.textContent = '...';
  }

  const doPreprocess = document.getElementById('chkPreprocess')?.checked ?? false;
  const doAutoDetect = document.getElementById('chkAutoDetect')?.checked ?? true;
  const useGemini = scanMode === 'ai';

  try {
    let items;
    if (useGemini) {
      items = await processWithGemini(uf, doAutoDetect);
    } else {
      tesseractWorker = await Tesseract.createWorker('eng', 1, {});
      items = await processWithTesseract(uf, doPreprocess, doAutoDetect);
      try { await tesseractWorker.terminate(); } catch(e) {}
      tesseractWorker = null;
    }

    if (items.length) {
      const currentIdx = failedFiles.indexOf(failedFile);
      if (currentIdx !== -1) failedFiles.splice(currentIdx, 1);
      extractedData.push(...items);
      successfulFiles.push({
        name: uf.name,
        itemCount: items.length,
        total: items.reduce((s, it) => s + (it.t || 0), 0)
      });
      showToast(`Retry successful: ${items.length} item(s) found`, 'success');
      renderReview();
    } else {
      showToast('Retry found no items. File remains in Failed list.', 'warning');
      const btn = document.getElementById(`scanFail_${index}`)?.querySelector('.scan-btn-retry');
      if (btn) { btn.disabled = false; btn.innerHTML = '&#8635;'; }
    }
  } catch(e) {
    showToast('Retry error: ' + e.message, 'error');
    const btn = document.getElementById(`scanFail_${index}`)?.querySelector('.scan-btn-retry');
    if (btn) { btn.disabled = false; btn.innerHTML = '&#8635;'; }
  }
}

function renderReview() {
  renderScanSummary();

  // If all successful receipts removed, show empty state
  if (successfulFiles.length === 0 && extractedData.length === 0) {
    document.getElementById('reviewSummary').innerHTML = `
      <div class="scan-empty-state" style="grid-column:1/-1; padding:32px;">
        No receipts to review. Go back to upload and scan more receipts.
      </div>`;
    document.getElementById('reviewGroups').innerHTML = '';
    return;
  }

  // Summary stats
  const totalItems = extractedData.length;
  const totalAmount = extractedData.reduce((s,i) => s + (i.t || 0), 0);
  const fileGroups = {};
  extractedData.forEach(item => {
    if (!fileGroups[item._file]) fileGroups[item._file] = [];
    fileGroups[item._file].push(item);
  });
  const fileCount = Object.keys(fileGroups).length;
  const storeSet = new Set(extractedData.map(i => i.s));

  document.getElementById('reviewSummary').innerHTML = `
    <div class="review-stat"><div class="val">${totalItems}</div><div class="lbl">Total Items</div></div>
    <div class="review-stat"><div class="val">$${fmt(totalAmount)}</div><div class="lbl">Total Amount</div></div>
    <div class="review-stat"><div class="val">${fileCount}</div><div class="lbl">Receipts</div></div>
    <div class="review-stat"><div class="val">${storeSet.size}</div><div class="lbl">Stores</div></div>
  `;

  // Per-receipt groups
  let groupsHtml = '';
  let globalIdx = 0;
  for (const [fileName, items] of Object.entries(fileGroups)) {
    const fileTotal = items.reduce((s,i) => s + (i.t || 0), 0);
    const store = items[0]?.s || 'Unknown';
    const date = items[0]?.d || '';
    const groupId = 'grp_' + globalIdx;

    groupsHtml += `<div class="receipt-group">`;
    groupsHtml += `<div class="receipt-header" onclick="toggleGroup('${groupId}')">
      <div class="file-name">&#128206; ${fileName} &mdash; ${items.length} item(s)</div>
      <div class="file-meta"><span>${store}</span><span>${date || 'No date'}</span><span>$${fmt(fileTotal)}</span><span class="chevron">&#9660;</span></div>
    </div>`;

    groupsHtml += `<div class="store-date-row" id="${groupId}_meta">
      <label>Store: <input type="text" value="${escHtml(store)}" onchange="updateGroupField('${fileName}','s',this.value)"></label>
      <label>Date: ${buildDateDropdowns(date, fileName)}</label>
    </div>`;

    groupsHtml += `<div class="receipt-body" id="${groupId}">`;
    groupsHtml += `<table class="review-table"><thead><tr>
      <th>Receipt Name</th><th>Full Name</th><th>Category</th><th>Qty</th><th>Unit $</th><th>Total</th><th>Non-Groc</th>
      ${items[0]?._confidence !== undefined ? '<th>Conf</th>' : ''}
      <th></th>
    </tr></thead><tbody>`;

    for (const item of items) {
      const idx = extractedData.indexOf(item);
      const catOptions = ALL_CATEGORIES.map(c => `<option value="${c}"${c===item.c?' selected':''}>${c}</option>`).join('');
      const lowConf = (item._confidence || 0) < 70;
      groupsHtml += `<tr>
        <td><input value="${escHtml(item.r)}" onchange="updateItem(${idx},'r',this.value)"></td>
        <td><input value="${escHtml(item.n)}" onchange="updateItemName(${idx},this.value)"></td>
        <td><select onchange="updateItem(${idx},'c',this.value);updateItem(${idx},'ng',isNonGrocery(this.value))">${catOptions}</select></td>
        <td><input type="number" class="num-input" value="${item.q}" min="1" onchange="updateItemNum(${idx},'q',this.value)"></td>
        <td><input type="number" class="num-input" value="${item.u.toFixed(2)}" step="0.01" min="0" onchange="updateItemNum(${idx},'u',this.value)"></td>
        <td><input type="number" class="num-input" value="${item.t.toFixed(2)}" step="0.01" min="0" onchange="updateItemNum(${idx},'t',this.value)"></td>
        <td style="text-align:center"><input type="checkbox" ${item.ng?'checked':''} onchange="updateItem(${idx},'ng',this.checked)"></td>
        ${item._confidence !== undefined ? `<td>${lowConf ? '<span class="low-confidence" title="Low OCR confidence">&#9888;</span>' : ''}${Math.round(item._confidence)}%</td>` : ''}
        <td style="text-align:center"><button class="line-item-remove" onclick="removeLineItem(${idx})" title="Remove item">&#10005;</button></td>
      </tr>`;
    }
    groupsHtml += `</tbody></table></div></div>`;
    globalIdx++;
  }

  document.getElementById('reviewGroups').innerHTML = groupsHtml;
}

function toggleGroup(groupId) {
  const body = document.getElementById(groupId);
  const header = body.previousElementSibling.previousElementSibling;
  body.classList.toggle('collapsed');
  header.classList.toggle('collapsed');
}

function updateItem(idx, field, value) {
  if (idx >= 0 && idx < extractedData.length) extractedData[idx][field] = value;
}
function updateItemNum(idx, field, value) {
  if (idx >= 0 && idx < extractedData.length) {
    extractedData[idx][field] = parseFloat(value) || 0;
    if (field === 'q' || field === 'u') {
      extractedData[idx].t = extractedData[idx].q * extractedData[idx].u;
    }
  }
}
function updateItemName(idx, value) {
  if (idx >= 0 && idx < extractedData.length) {
    const old = extractedData[idx];
    old.n = value;
    // Learn abbreviation
    if (old.r && value && old.r !== value) {
      abbrevDict[old.r.toUpperCase()] = value;
      saveAbbrevDict(abbrevDict);
    }
    // Re-categorize
    old.c = assignCategory(value);
    old.ng = isNonGrocery(old.c);
    renderReview();
  }
}
function updateGroupField(fileName, field, value) {
  extractedData.forEach(item => {
    if (item._file === fileName) item[field] = value;
  });
}

function removeLineItem(idx) {
  if (idx < 0 || idx >= extractedData.length) return;
  const item = extractedData[idx];
  extractedData.splice(idx, 1);

  // Update successfulFiles counts for this file
  const sf = successfulFiles.find(f => f.name === item._file);
  if (sf) {
    sf.itemCount = extractedData.filter(i => i._file === item._file).length;
    sf.total = extractedData.filter(i => i._file === item._file).reduce((s, i) => s + (i.t || 0), 0);

    // If no items left for this file, remove it from successful and add to removed
    if (sf.itemCount === 0) {
      const sfIdx = successfulFiles.indexOf(sf);
      if (sfIdx !== -1) successfulFiles.splice(sfIdx, 1);
      removedFiles.push({ name: item._file, source: 'successful' });
    }
  }

  renderReview();
}

function daysInMonth(month) {
  if (!month) return 31;
  const m = parseInt(month);
  if (m === 2) {
    const yr = new Date().getFullYear();
    return (yr % 4 === 0 && (yr % 100 !== 0 || yr % 400 === 0)) ? 29 : 28;
  }
  return [4,6,9,11].includes(m) ? 30 : 31;
}

function buildDayOptions(month, selDay) {
  const maxDay = daysInMonth(month);
  let dayOpts = '<option value="">Day</option>';
  for (let d = 1; d <= maxDay; d++) {
    const val = String(d).padStart(2,'0');
    dayOpts += `<option value="${val}"${val === selDay ? ' selected' : ''}>${d}</option>`;
  }
  return dayOpts;
}

function buildDateDropdowns(date, fileName) {
  const parts = (date || '').split('/');
  const selMonth = parts[0] || '';
  const selDay = parts[1] || '';
  const monthNames = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  let monthOpts = '<option value="">Mo</option>';
  for (let m = 1; m <= 12; m++) {
    const val = String(m).padStart(2,'0');
    monthOpts += `<option value="${val}"${val === selMonth ? ' selected' : ''}>${monthNames[m]}</option>`;
  }

  const fn = escHtml(fileName);
  return `<select class="date-select" onchange="updateDateFromDropdowns('${fn}')" data-file="${fn}" data-part="month">${monthOpts}</select>
    <span class="date-slash">/</span>
    <select class="date-select" onchange="updateDateFromDropdowns('${fn}')" data-file="${fn}" data-part="day">${buildDayOptions(selMonth, selDay)}</select>`;
}

function updateDateFromDropdowns(fileName) {
  const monthSel = document.querySelector(`select[data-file="${fileName}"][data-part="month"]`);
  const daySel = document.querySelector(`select[data-file="${fileName}"][data-part="day"]`);
  const month = monthSel?.value || '';

  // Update day options when month changes
  const currentDay = daySel?.value || '';
  const maxDay = daysInMonth(month);
  daySel.innerHTML = buildDayOptions(month, currentDay);
  // If selected day exceeds new max, reset it
  if (currentDay && parseInt(currentDay) > maxDay) {
    daySel.value = '';
  }

  const day = daySel?.value || '';
  const date = (month && day) ? month + '/' + day : '';
  updateGroupField(fileName, 'd', date);
}

function escHtml(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function fmt(n) {
  return Number(n||0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ============================================================
// EXPORT SELECTION
// ============================================================
let selectedExport = null;

function populateMonthYearDropdowns(monthSelId, yearSelId, selectedMonth, selectedYear) {
  const monthNames = ['','January','February','March','April','May','June','July','August','September','October','November','December'];
  const monthSel = document.getElementById(monthSelId);
  const yearSel = document.getElementById(yearSelId);

  monthSel.innerHTML = '<option value="">Month</option>';
  for (let m = 1; m <= 12; m++) {
    const val = String(m).padStart(2,'0');
    monthSel.innerHTML += `<option value="${val}"${val === selectedMonth ? ' selected' : ''}>${monthNames[m]}</option>`;
  }

  const currentYear = new Date().getFullYear();
  yearSel.innerHTML = '<option value="">Year</option>';
  for (let y = currentYear - 2; y <= currentYear + 1; y++) {
    yearSel.innerHTML += `<option value="${y}"${String(y) === selectedYear ? ' selected' : ''}>${y}</option>`;
  }
}

function getMonthVal(monthSelId, yearSelId) {
  const mo = document.getElementById(monthSelId)?.value || '';
  const yr = document.getElementById(yearSelId)?.value || '';
  if (!mo || !yr) return '';
  return yr + '-' + mo;
}

function selectExport(type) {
  selectedExport = type;
  document.getElementById('exportExcel').classList.toggle('selected', type === 'excel');
  document.getElementById('exportDashboard').classList.toggle('selected', type === 'dashboard');
  document.getElementById('excelOptions').style.display = type === 'excel' ? 'block' : 'none';
  document.getElementById('dashboardOptions').style.display = type === 'dashboard' ? 'block' : 'none';
  document.getElementById('exportResult').style.display = 'none';

  // Try to infer month from receipt dates
  const dates = extractedData.map(i => i.d).filter(Boolean);
  let selMonth = '', selYear = '';
  if (dates.length) {
    const monthCounts = {};
    dates.forEach(d => { const m = d.split('/')[0]; monthCounts[m] = (monthCounts[m]||0) + 1; });
    const topMonth = Object.entries(monthCounts).sort((a,b)=>b[1]-a[1])[0]?.[0];
    if (topMonth) selMonth = topMonth;
    selYear = String(new Date().getFullYear());
  }

  if (type === 'excel') {
    populateMonthYearDropdowns('excelMonthSel', 'excelYearSel', selMonth, selYear);
  }
  if (type === 'dashboard') {
    populateMonthYearDropdowns('dashMonthSel', 'dashYearSel', selMonth, selYear);
    if (selMonth && selYear) {
      checkExistingMonth(selYear + '_' + selMonth);
    } else {
      document.getElementById('mergeWarning').style.display = 'none';
    }
  }
}

function checkExistingMonth(monthKey) {
  const existing = localStorage.getItem('data_' + monthKey);
  document.getElementById('mergeWarning').style.display = existing ? 'block' : 'none';
}

function onDashMonthChange() {
  const mo = document.getElementById('dashMonthSel')?.value || '';
  const yr = document.getElementById('dashYearSel')?.value || '';
  if (mo && yr) {
    checkExistingMonth(yr + '_' + mo);
  } else {
    document.getElementById('mergeWarning').style.display = 'none';
  }
}

// ============================================================
// EXCEL EXPORT
// ============================================================
async function doExcelExport() {
  const monthVal = getMonthVal('excelMonthSel', 'excelYearSel');
  if (!monthVal) { showToast('Please select a month and year.', 'warning'); return; }
  const [yr, mo] = monthVal.split('-');
  const monthName = new Date(yr, parseInt(mo)-1).toLocaleString('default',{month:'long'});

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Receipt Scanner';

  const headerFill = { type:'pattern', pattern:'solid', fgColor:{argb:'FF2F5496'} };
  const headerFont = { bold:true, color:{argb:'FFFFFFFF'}, size:11 };
  const currFmt = '$#,##0.00';
  const yellowFill = { type:'pattern', pattern:'solid', fgColor:{argb:'FFFFF2CC'} };
  const thinBorder = {
    top:{style:'thin',color:{argb:'FFD0D0D0'}},
    bottom:{style:'thin',color:{argb:'FFD0D0D0'}},
    left:{style:'thin',color:{argb:'FFD0D0D0'}},
    right:{style:'thin',color:{argb:'FFD0D0D0'}}
  };

  // Aggregate data first
  const byStore = {};
  const byCat = {};
  const byProduct = {};
  const grandTotal = extractedData.reduce((s,i) => s + i.t, 0);
  const tripSet = new Set(); // unique date+store combos

  extractedData.forEach(i => {
    // By Store
    if (!byStore[i.s]) byStore[i.s] = { items: 0, total: 0, trips: new Set() };
    byStore[i.s].items += i.q;
    byStore[i.s].total += i.t;
    byStore[i.s].trips.add(i.d + '|' + i.s);
    tripSet.add(i.d + '|' + i.s);
    // By Category
    if (!byCat[i.c]) byCat[i.c] = { items: 0, total: 0 };
    byCat[i.c].items += i.q;
    byCat[i.c].total += i.t;
    // By Product
    const k = i.n;
    if (!byProduct[k]) byProduct[k] = { cat: i.c, total: 0, count: 0 };
    byProduct[k].total += i.t;
    byProduct[k].count += i.q;
  });

  // Sheet 1: Summary (matches original — first sheet)
  const ws1 = workbook.addWorksheet('Summary');
  ws1.getColumn(1).width = 35;
  ws1.getColumn(2).width = 20;
  const titleRow = ws1.addRow([monthName.toUpperCase() + ' ' + yr + ' \u2013 FAMILY GROCERY SPEND ANALYSIS']);
  titleRow.getCell(1).font = { bold: true, size: 14, color: { argb: 'FF2F5496' } };
  ws1.addRow([]);
  const summaryData = [
    ['Total Spend', grandTotal],
    ['Total Items', extractedData.length],
    ['Unique Products', Object.keys(byProduct).length],
    ['Stores Visited', Object.keys(byStore).length],
    ['Shopping Trips', tripSet.size],
    ['Categories', Object.keys(byCat).length],
    ['Avg per Item', grandTotal / (extractedData.length || 1)],
    ['Avg per Trip', grandTotal / (tripSet.size || 1)],
    ['Receipts Scanned', new Set(extractedData.map(i => i._file)).size]
  ];
  summaryData.forEach(r => {
    const row = ws1.addRow(r);
    row.getCell(1).font = { bold: true };
    if (typeof r[1] === 'number') row.getCell(2).numFmt = currFmt;
  });

  // Sheet 2: All Transactions (9 columns — no Source File)
  const ws2 = workbook.addWorksheet('All Transactions');
  ws2.columns = [
    { header: 'Date', key: 'd', width: 10 },
    { header: 'Store', key: 's', width: 16 },
    { header: 'Receipt Name', key: 'r', width: 22 },
    { header: 'Full Product Name', key: 'n', width: 30 },
    { header: 'Category', key: 'c', width: 18 },
    { header: 'Qty', key: 'q', width: 6 },
    { header: 'Unit Price', key: 'u', width: 12 },
    { header: 'Line Total', key: 't', width: 12 },
    { header: 'Non-Grocery?', key: 'ng', width: 13 }
  ];
  ws2.getRow(1).eachCell(cell => { cell.fill = headerFill; cell.font = headerFont; cell.border = thinBorder; });
  extractedData.forEach(item => {
    const row = ws2.addRow({ d: item.d, s: item.s, r: item.r, n: item.n, c: item.c, q: item.q, u: item.u, t: item.t, ng: item.ng ? 'Yes' : 'No' });
    row.getCell('u').numFmt = currFmt;
    row.getCell('t').numFmt = currFmt;
    row.eachCell(cell => { cell.border = thinBorder; });
    if (item.ng) row.eachCell(cell => { cell.fill = yellowFill; });
  });

  // Sheet 3: By Store (Store, Total Items, Number of Trips, Total Spent, % of Total Spend)
  const ws3 = workbook.addWorksheet('By Store');
  ws3.columns = [
    { header: 'Store', key: 'store', width: 20 },
    { header: 'Total Items', key: 'items', width: 12 },
    { header: 'Number of Trips', key: 'trips', width: 16 },
    { header: 'Total Spent', key: 'total', width: 14 },
    { header: '% of Total Spend', key: 'pct', width: 16 }
  ];
  ws3.getRow(1).eachCell(cell => { cell.fill = headerFill; cell.font = headerFont; cell.border = thinBorder; });
  Object.entries(byStore).sort((a, b) => b[1].total - a[1].total).forEach(([store, data]) => {
    const row = ws3.addRow({ store, items: data.items, trips: data.trips.size, total: data.total, pct: (data.total / grandTotal * 100).toFixed(1) + '%' });
    row.getCell('total').numFmt = currFmt;
    row.eachCell(cell => { cell.border = thinBorder; });
  });

  // Sheet 4: By Category (Category, Total Items, Total Spent, % of Total Spend, Grocery/Non-Grocery)
  const ws4 = workbook.addWorksheet('By Category');
  ws4.columns = [
    { header: 'Category', key: 'cat', width: 22 },
    { header: 'Total Items', key: 'items', width: 12 },
    { header: 'Total Spent', key: 'total', width: 14 },
    { header: '% of Total Spend', key: 'pct', width: 16 },
    { header: 'Grocery/Non-Grocery', key: 'type', width: 20 }
  ];
  ws4.getRow(1).eachCell(cell => { cell.fill = headerFill; cell.font = headerFont; cell.border = thinBorder; });
  Object.entries(byCat).sort((a, b) => b[1].total - a[1].total).forEach(([cat, data]) => {
    const ng = isNonGrocery(cat);
    const row = ws4.addRow({ cat, items: data.items, total: data.total, pct: (data.total / grandTotal * 100).toFixed(1) + '%', type: ng ? 'Non-Grocery' : 'Grocery' });
    row.getCell('total').numFmt = currFmt;
    row.eachCell(cell => { cell.border = thinBorder; });
    if (ng) row.eachCell(cell => { cell.fill = yellowFill; });
  });

  // Sheet 5: Top Spent Items (Rank, Product Name, Category, Total Qty Bought, Total Spent)
  const ws5 = workbook.addWorksheet('Top Spent Items');
  ws5.columns = [
    { header: 'Rank', key: 'rank', width: 8 },
    { header: 'Product Name', key: 'name', width: 30 },
    { header: 'Category', key: 'cat', width: 18 },
    { header: 'Total Qty Bought', key: 'count', width: 16 },
    { header: 'Total Spent', key: 'total', width: 14 }
  ];
  ws5.getRow(1).eachCell(cell => { cell.fill = headerFill; cell.font = headerFont; cell.border = thinBorder; });
  Object.entries(byProduct).sort((a, b) => b[1].total - a[1].total).slice(0, 20).forEach(([name, data], idx) => {
    const row = ws5.addRow({ rank: idx + 1, name, cat: data.cat, count: data.count, total: data.total });
    row.getCell('total').numFmt = currFmt;
    row.eachCell(cell => { cell.border = thinBorder; });
  });

  // Sheet 6: Frequently Purchased (Product Name, Category, Times/Qty Bought, Total Spent, Avg Cost Per Unit)
  const ws6 = workbook.addWorksheet('Frequently Purchased');
  ws6.columns = [
    { header: 'Product Name', key: 'name', width: 30 },
    { header: 'Category', key: 'cat', width: 18 },
    { header: 'Times/Qty Bought', key: 'count', width: 16 },
    { header: 'Total Spent', key: 'total', width: 14 },
    { header: 'Avg Cost Per Unit', key: 'avg', width: 16 }
  ];
  ws6.getRow(1).eachCell(cell => { cell.fill = headerFill; cell.font = headerFont; cell.border = thinBorder; });
  Object.entries(byProduct).sort((a, b) => b[1].count - a[1].count).slice(0, 20).forEach(([name, data]) => {
    const row = ws6.addRow({ name, cat: data.cat, count: data.count, total: data.total, avg: data.total / (data.count || 1) });
    row.getCell('total').numFmt = currFmt;
    row.getCell('avg').numFmt = currFmt;
    row.eachCell(cell => { cell.border = thinBorder; });
  });

  // Generate and download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${monthName}_${yr}_Family_Grocery_Analysis.xlsx`;
  a.click();
  URL.revokeObjectURL(url);

  document.getElementById('exportResult').style.display = 'block';
  document.getElementById('exportResult').innerHTML = `
    <div class="check">&#9989;</div>
    <div class="msg">Excel file downloaded!</div>
    <div class="sub">${monthName}_${yr}_Family_Grocery_Analysis.xlsx &mdash; ${extractedData.length} items across 6 sheets</div>
    <button class="btn btn-secondary" onclick="goToStep(1);resetAll()">Scan More Receipts</button>
  `;
}

// ============================================================
// DASHBOARD IMPORT
// ============================================================
function doDashboardImport() {
  const monthVal = getMonthVal('dashMonthSel', 'dashYearSel');
  if (!monthVal) { showToast('Please select a month and year.', 'warning'); return; }
  const [yr, mo] = monthVal.split('-');
  const monthKey = yr + '_' + mo;

  // Prepare items without internal fields
  const items = extractedData.map(item => ({
    d: item.d, s: item.s, r: item.r, n: item.n, c: item.c,
    q: item.q, u: item.u, t: item.t, ng: item.ng
  }));

  // Backup existing data before overwriting
  const existing = localStorage.getItem('data_' + monthKey);
  if (existing) {
    localStorage.setItem('backup_data_' + monthKey, existing);
  }

  // Check merge mode
  let finalItems = items;
  if (existing) {
    const mergeMode = document.querySelector('input[name="mergeMode"]:checked')?.value || 'merge';
    if (mergeMode === 'merge') {
      try {
        const prev = JSON.parse(existing);
        finalItems = [...prev, ...items];
      } catch(e) {
        finalItems = items;
      }
    }
  }

  // Write to localStorage (same pattern as V1)
  localStorage.setItem('data_' + monthKey, JSON.stringify(finalItems));
  const months = JSON.parse(localStorage.getItem('grocery_months') || '[]');
  if (!months.includes(monthKey)) {
    months.push(monthKey);
    months.sort();
    localStorage.setItem('grocery_months', JSON.stringify(months));
  }
  localStorage.setItem('grocery_activeMonth', monthKey);

  const monthLabel = new Date(yr, parseInt(mo)-1).toLocaleString('default',{month:'long'}) + ' ' + yr;
  const hasBackup = !!existing;

  document.getElementById('exportResult').style.display = 'block';
  document.getElementById('dashboardOptions').style.display = 'none';
  document.getElementById('exportResult').innerHTML = `
    <div class="check">&#128640;</div>
    <div class="msg">Imported to Dashboard!</div>
    <div class="sub">${finalItems.length} items loaded for ${monthLabel}</div>
    <a href="../Groceries/" class="btn btn-green">Open Groceries Dashboard &#8594;</a>
    <button class="btn btn-secondary" style="margin-left:12px" onclick="goToStep(1);resetAll()">Scan More</button>
    ${hasBackup ? `<button class="btn btn-danger" style="margin-left:12px" onclick="undoImport('${monthKey}', '${monthLabel}')">Undo Import</button>` : ''}
  `;
  if (typeof syncToCloud === 'function') syncToCloud();
}

function undoImport(monthKey, monthLabel) {
  const backup = localStorage.getItem('backup_data_' + monthKey);
  if (!backup) {
    showToast('No backup found to restore.', 'warning');
    return;
  }
  if (!confirm('Restore previous data for ' + monthLabel + '? This will undo the import.')) return;

  localStorage.setItem('data_' + monthKey, backup);
  localStorage.removeItem('backup_data_' + monthKey);

  document.getElementById('exportResult').innerHTML = `
    <div class="check" style="color:var(--green)">&#10003;</div>
    <div class="msg">Data Restored!</div>
    <div class="sub">Previous data for ${monthLabel} has been restored.</div>
    <a href="../Groceries/" class="btn btn-green">Open Groceries Dashboard &#8594;</a>
    <button class="btn btn-secondary" style="margin-left:12px" onclick="goToStep(1);resetAll()">Scan More</button>
  `;
  if (typeof syncToCloud === 'function') syncToCloud();
}

function resetAll() {
  uploadedFiles = [];
  extractedData = [];
  selectedExport = null;
  renderThumbnails();
  document.getElementById('exportResult').style.display = 'none';
  document.getElementById('excelOptions').style.display = 'none';
  document.getElementById('dashboardOptions').style.display = 'none';
  document.getElementById('exportExcel').classList.remove('selected');
  document.getElementById('exportDashboard').classList.remove('selected');
  document.getElementById('logBox').innerHTML = '';
  document.getElementById('progressFill').style.width = '0%';
  document.getElementById('progressFill').classList.remove('done');
  document.getElementById('currentFileFill').style.width = '0%';
  document.getElementById('currentFileFill').classList.remove('done');
}

// ── Theme Toggle ──
function toggleTheme() {
  const isDemo = typeof DEMO_MODE !== 'undefined' && DEMO_MODE;
  const isLight = document.body.classList.toggle('light');
  if (isDemo) sessionStorage.setItem('demo_app_theme', isLight ? 'light' : 'dark');
  else localStorage.setItem('app_theme', isLight ? 'light' : 'dark');
  document.getElementById('theme-toggle').innerHTML = isLight ? '&#9788;' : '&#9790;';
}

// Load saved settings
(function(){
  // Restore theme (defaults to light)
  const isDemo = typeof DEMO_MODE !== 'undefined' && DEMO_MODE;
  const savedTheme = isDemo ? sessionStorage.getItem('demo_app_theme') : localStorage.getItem('app_theme');
  if (savedTheme !== 'dark') {
    document.body.classList.add('light');
    document.getElementById('theme-toggle').innerHTML = '&#9788;';
  }

  // Restore scan mode — reset old 'ocr' default to 'ai'
  let savedMode = localStorage.getItem('scanner_mode');
  if (!savedMode || savedMode === 'ocr') { savedMode = 'ai'; localStorage.setItem('scanner_mode', 'ai'); }
  selectMode(savedMode);
})();
