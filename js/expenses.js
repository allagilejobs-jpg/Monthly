/* ============================================================
   ALL EXPENSES DASHBOARD — V2
   ============================================================ */

// ── PDF.js worker ──
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

// ── Category colors ──
const CATEGORY_LIST = [
  "Housing","Utilities","Groceries","Dining & Restaurants","Transportation",
  "Gas & Fuel","Shopping","Entertainment","Subscriptions","Health & Medical",
  "Insurance","Personal Care","Education","Gifts & Donations","Travel",
  "Fees & Charges","ATM & Cash","Transfers","Other"
];
const CATEGORY_COLORS = {};
const CAT_PALETTE = [
  "#3b82f6","#22c55e","#f59e0b","#f43f5e","#a855f7",
  "#06b6d4","#14b8a6","#ec4899","#84cc16","#6366f1",
  "#f97316","#0ea5e9","#d946ef","#10b981","#eab308",
  "#ef4444","#8b5cf6","#64748b","#78716c"
];
CATEGORY_LIST.forEach((c,i) => CATEGORY_COLORS[c] = CAT_PALETTE[i % CAT_PALETTE.length]);

// Dynamic category color assignment for user-created categories
const catColorPool = [...CAT_PALETTE];
let catColorIdx = CATEGORY_LIST.length;
function getCatColor(cat) {
  if (CATEGORY_COLORS[cat]) return CATEGORY_COLORS[cat];
  CATEGORY_COLORS[cat] = catColorPool[catColorIdx % catColorPool.length];
  catColorIdx++;
  return CATEGORY_COLORS[cat];
}

// ── Auto-categorization keywords ──
// ══════════════════════════════════════════════════════════
// MERCHANT MAP — known merchants → { name, cat }
// Checked AFTER cleaning, BEFORE keyword fallback
// ══════════════════════════════════════════════════════════
const MERCHANT_MAP = {
  // ── Groceries ──
  "walmart": { name: "Walmart", cat: "Groceries" }, "wal-mart": { name: "Walmart", cat: "Groceries" },
  "wal mart": { name: "Walmart", cat: "Groceries" }, "publix": { name: "Publix", cat: "Groceries" },
  "kroger": { name: "Kroger", cat: "Groceries" }, "aldi": { name: "Aldi", cat: "Groceries" },
  "trader joe": { name: "Trader Joe's", cat: "Groceries" }, "whole foods": { name: "Whole Foods", cat: "Groceries" },
  "safeway": { name: "Safeway", cat: "Groceries" }, "costco": { name: "Costco", cat: "Groceries" },
  "sam's club": { name: "Sam's Club", cat: "Groceries" }, "samsclub": { name: "Sam's Club", cat: "Groceries" },
  "heb ": { name: "H-E-B", cat: "Groceries" }, "h-e-b": { name: "H-E-B", cat: "Groceries" },
  "meijer": { name: "Meijer", cat: "Groceries" }, "food lion": { name: "Food Lion", cat: "Groceries" },
  "piggly wiggly": { name: "Piggly Wiggly", cat: "Groceries" }, "winn-dixie": { name: "Winn-Dixie", cat: "Groceries" },
  "winn dixie": { name: "Winn-Dixie", cat: "Groceries" }, "sprouts": { name: "Sprouts", cat: "Groceries" },
  "instacart": { name: "Instacart", cat: "Groceries" }, "amazon fresh": { name: "Amazon Fresh", cat: "Groceries" },
  "food city": { name: "Food City", cat: "Groceries" }, "ingles": { name: "Ingles", cat: "Groceries" },
  "lidl": { name: "Lidl", cat: "Groceries" }, "save a lot": { name: "Save-A-Lot", cat: "Groceries" },
  "fresh market": { name: "Fresh Market", cat: "Groceries" }, "shoprite": { name: "ShopRite", cat: "Groceries" },
  "stop & shop": { name: "Stop & Shop", cat: "Groceries" }, "stop and shop": { name: "Stop & Shop", cat: "Groceries" },
  "giant food": { name: "Giant", cat: "Groceries" }, "giant eagle": { name: "Giant Eagle", cat: "Groceries" },
  "wegmans": { name: "Wegmans", cat: "Groceries" }, "harris teeter": { name: "Harris Teeter", cat: "Groceries" },
  "food4less": { name: "Food 4 Less", cat: "Groceries" }, "winco": { name: "WinCo", cat: "Groceries" },
  "bi-lo": { name: "BI-LO", cat: "Groceries" }, "albertsons": { name: "Albertsons", cat: "Groceries" },
  "vons": { name: "Vons", cat: "Groceries" }, "jewel-osco": { name: "Jewel-Osco", cat: "Groceries" },
  "hannaford": { name: "Hannaford", cat: "Groceries" }, "market basket": { name: "Market Basket", cat: "Groceries" },

  // ── Dining & Restaurants ──
  "mcdonald": { name: "McDonald's", cat: "Dining & Restaurants" },
  "burger king": { name: "Burger King", cat: "Dining & Restaurants" },
  "wendy's": { name: "Wendy's", cat: "Dining & Restaurants" }, "wendys": { name: "Wendy's", cat: "Dining & Restaurants" },
  "chick-fil-a": { name: "Chick-fil-A", cat: "Dining & Restaurants" }, "chickfila": { name: "Chick-fil-A", cat: "Dining & Restaurants" },
  "chick fil a": { name: "Chick-fil-A", cat: "Dining & Restaurants" },
  "chipotle": { name: "Chipotle", cat: "Dining & Restaurants" },
  "subway": { name: "Subway", cat: "Dining & Restaurants" },
  "starbucks": { name: "Starbucks", cat: "Dining & Restaurants" },
  "dunkin": { name: "Dunkin'", cat: "Dining & Restaurants" },
  "domino": { name: "Domino's", cat: "Dining & Restaurants" },
  "pizza hut": { name: "Pizza Hut", cat: "Dining & Restaurants" },
  "papa john": { name: "Papa John's", cat: "Dining & Restaurants" },
  "taco bell": { name: "Taco Bell", cat: "Dining & Restaurants" },
  "popeyes": { name: "Popeyes", cat: "Dining & Restaurants" },
  "chili's": { name: "Chili's", cat: "Dining & Restaurants" }, "chilis": { name: "Chili's", cat: "Dining & Restaurants" },
  "olive garden": { name: "Olive Garden", cat: "Dining & Restaurants" },
  "applebee": { name: "Applebee's", cat: "Dining & Restaurants" },
  "panera": { name: "Panera Bread", cat: "Dining & Restaurants" },
  "wingstop": { name: "Wingstop", cat: "Dining & Restaurants" },
  "five guys": { name: "Five Guys", cat: "Dining & Restaurants" },
  "raising cane": { name: "Raising Cane's", cat: "Dining & Restaurants" },
  "sonic drive": { name: "Sonic", cat: "Dining & Restaurants" },
  "jack in the box": { name: "Jack in the Box", cat: "Dining & Restaurants" },
  "waffle house": { name: "Waffle House", cat: "Dining & Restaurants" },
  "ihop": { name: "IHOP", cat: "Dining & Restaurants" },
  "denny's": { name: "Denny's", cat: "Dining & Restaurants" }, "dennys": { name: "Denny's", cat: "Dining & Restaurants" },
  "cracker barrel": { name: "Cracker Barrel", cat: "Dining & Restaurants" },
  "buffalo wild wing": { name: "Buffalo Wild Wings", cat: "Dining & Restaurants" },
  "red robin": { name: "Red Robin", cat: "Dining & Restaurants" },
  "red lobster": { name: "Red Lobster", cat: "Dining & Restaurants" },
  "outback steak": { name: "Outback Steakhouse", cat: "Dining & Restaurants" },
  "texas roadhouse": { name: "Texas Roadhouse", cat: "Dining & Restaurants" },
  "panda express": { name: "Panda Express", cat: "Dining & Restaurants" },
  "zaxby": { name: "Zaxby's", cat: "Dining & Restaurants" },
  "jimmy john": { name: "Jimmy John's", cat: "Dining & Restaurants" },
  "jersey mike": { name: "Jersey Mike's", cat: "Dining & Restaurants" },
  "firehouse sub": { name: "Firehouse Subs", cat: "Dining & Restaurants" },
  "little caesar": { name: "Little Caesars", cat: "Dining & Restaurants" },
  "arby's": { name: "Arby's", cat: "Dining & Restaurants" }, "arbys": { name: "Arby's", cat: "Dining & Restaurants" },
  "kfc": { name: "KFC", cat: "Dining & Restaurants" }, "kentucky fried": { name: "KFC", cat: "Dining & Restaurants" },
  "whataburger": { name: "Whataburger", cat: "Dining & Restaurants" },
  "cookout": { name: "Cook Out", cat: "Dining & Restaurants" },
  "doordash": { name: "DoorDash", cat: "Dining & Restaurants" },
  "uber eats": { name: "Uber Eats", cat: "Dining & Restaurants" }, "ubereats": { name: "Uber Eats", cat: "Dining & Restaurants" },
  "grubhub": { name: "Grubhub", cat: "Dining & Restaurants" },
  "postmates": { name: "Postmates", cat: "Dining & Restaurants" },
  "seamless": { name: "Seamless", cat: "Dining & Restaurants" },

  // ── Gas & Fuel ──
  "shell oil": { name: "Shell", cat: "Gas & Fuel" }, "shell service": { name: "Shell", cat: "Gas & Fuel" },
  "chevron": { name: "Chevron", cat: "Gas & Fuel" }, "exxon": { name: "ExxonMobil", cat: "Gas & Fuel" },
  "mobil ": { name: "Mobil", cat: "Gas & Fuel" },
  "bp#": { name: "BP", cat: "Gas & Fuel" }, "bp ": { name: "BP", cat: "Gas & Fuel" },
  "marathon petr": { name: "Marathon", cat: "Gas & Fuel" }, "marathon gas": { name: "Marathon", cat: "Gas & Fuel" },
  "circle k": { name: "Circle K", cat: "Gas & Fuel" }, "speedway": { name: "Speedway", cat: "Gas & Fuel" },
  "wawa ": { name: "Wawa", cat: "Gas & Fuel" },
  "racetrac": { name: "RaceTrac", cat: "Gas & Fuel" }, "murphy usa": { name: "Murphy USA", cat: "Gas & Fuel" },
  "murphy oil": { name: "Murphy", cat: "Gas & Fuel" }, "sunoco": { name: "Sunoco", cat: "Gas & Fuel" },
  "quiktrip": { name: "QuikTrip", cat: "Gas & Fuel" }, "qt ": { name: "QuikTrip", cat: "Gas & Fuel" },
  "sheetz": { name: "Sheetz", cat: "Gas & Fuel" }, "pilot ": { name: "Pilot", cat: "Gas & Fuel" },
  "love's": { name: "Love's", cat: "Gas & Fuel" }, "loves travel": { name: "Love's", cat: "Gas & Fuel" },
  "citgo": { name: "Citgo", cat: "Gas & Fuel" }, "phillips 66": { name: "Phillips 66", cat: "Gas & Fuel" },
  "valero": { name: "Valero", cat: "Gas & Fuel" }, "sinclair": { name: "Sinclair", cat: "Gas & Fuel" },

  // ── Shopping ──
  "amazon.com": { name: "Amazon", cat: "Shopping" }, "amzn": { name: "Amazon", cat: "Shopping" },
  "amazon mktp": { name: "Amazon", cat: "Shopping" }, "amazon market": { name: "Amazon", cat: "Shopping" },
  "target": { name: "Target", cat: "Shopping" },
  "best buy": { name: "Best Buy", cat: "Shopping" }, "bestbuy": { name: "Best Buy", cat: "Shopping" },
  "home depot": { name: "Home Depot", cat: "Shopping" }, "homedepot": { name: "Home Depot", cat: "Shopping" },
  "lowe's": { name: "Lowe's", cat: "Shopping" }, "lowes": { name: "Lowe's", cat: "Shopping" },
  "ikea": { name: "IKEA", cat: "Shopping" },
  "t.j. maxx": { name: "TJ Maxx", cat: "Shopping" }, "tjmaxx": { name: "TJ Maxx", cat: "Shopping" },
  "tj maxx": { name: "TJ Maxx", cat: "Shopping" },
  "marshalls": { name: "Marshalls", cat: "Shopping" }, "ross store": { name: "Ross", cat: "Shopping" },
  "nordstrom": { name: "Nordstrom", cat: "Shopping" }, "macy's": { name: "Macy's", cat: "Shopping" },
  "macys": { name: "Macy's", cat: "Shopping" },
  "old navy": { name: "Old Navy", cat: "Shopping" }, "gap ": { name: "Gap", cat: "Shopping" },
  "nike": { name: "Nike", cat: "Shopping" }, "adidas": { name: "Adidas", cat: "Shopping" },
  "dollar tree": { name: "Dollar Tree", cat: "Shopping" }, "dollar general": { name: "Dollar General", cat: "Shopping" },
  "five below": { name: "Five Below", cat: "Shopping" },
  "bath & body": { name: "Bath & Body Works", cat: "Shopping" },
  "bed bath": { name: "Bed Bath & Beyond", cat: "Shopping" },
  "kohl's": { name: "Kohl's", cat: "Shopping" }, "kohls": { name: "Kohl's", cat: "Shopping" },
  "jcpenney": { name: "JCPenney", cat: "Shopping" }, "jc penney": { name: "JCPenney", cat: "Shopping" },
  "hobby lobby": { name: "Hobby Lobby", cat: "Shopping" },
  "michael's": { name: "Michael's", cat: "Shopping" }, "michaels": { name: "Michael's", cat: "Shopping" },
  "temu": { name: "Temu", cat: "Shopping" }, "shein": { name: "Shein", cat: "Shopping" },
  "ebay": { name: "eBay", cat: "Shopping" }, "etsy": { name: "Etsy", cat: "Shopping" },
  "wayfair": { name: "Wayfair", cat: "Shopping" },
  "chewy": { name: "Chewy", cat: "Pet" },
  "williams-sonoma": { name: "Williams-Sonoma", cat: "Shopping" },
  "pottery barn": { name: "Pottery Barn", cat: "Shopping" },
  "crate & barrel": { name: "Crate & Barrel", cat: "Shopping" },

  // ── Subscriptions ──
  "netflix": { name: "Netflix", cat: "Subscriptions" }, "hulu": { name: "Hulu", cat: "Subscriptions" },
  "disney plus": { name: "Disney+", cat: "Subscriptions" }, "disney+": { name: "Disney+", cat: "Subscriptions" },
  "disneyplus": { name: "Disney+", cat: "Subscriptions" },
  "spotify": { name: "Spotify", cat: "Subscriptions" }, "apple music": { name: "Apple Music", cat: "Subscriptions" },
  "hbo max": { name: "HBO Max", cat: "Subscriptions" }, "hbomax": { name: "HBO Max", cat: "Subscriptions" },
  "youtube prem": { name: "YouTube Premium", cat: "Subscriptions" },
  "amazon prime": { name: "Amazon Prime", cat: "Subscriptions" }, "prime video": { name: "Prime Video", cat: "Subscriptions" },
  "paramount+": { name: "Paramount+", cat: "Subscriptions" }, "paramount plus": { name: "Paramount+", cat: "Subscriptions" },
  "peacock": { name: "Peacock", cat: "Subscriptions" },
  "adobe": { name: "Adobe", cat: "Subscriptions" }, "microsoft 365": { name: "Microsoft 365", cat: "Subscriptions" },
  "msft ": { name: "Microsoft", cat: "Subscriptions" }, "microsoft": { name: "Microsoft", cat: "Subscriptions" },
  "icloud": { name: "iCloud", cat: "Subscriptions" }, "apple.com/bill": { name: "Apple", cat: "Subscriptions" },
  "google storage": { name: "Google One", cat: "Subscriptions" }, "google one": { name: "Google One", cat: "Subscriptions" },
  "chatgpt": { name: "ChatGPT", cat: "Subscriptions" }, "openai": { name: "OpenAI", cat: "Subscriptions" },
  "claude": { name: "Claude", cat: "Subscriptions" }, "anthropic": { name: "Anthropic", cat: "Subscriptions" },
  "audible": { name: "Audible", cat: "Subscriptions" }, "kindle": { name: "Kindle", cat: "Subscriptions" },
  "dropbox": { name: "Dropbox", cat: "Subscriptions" }, "notion": { name: "Notion", cat: "Subscriptions" },
  "crunchyroll": { name: "Crunchyroll", cat: "Subscriptions" },
  "apple tv": { name: "Apple TV+", cat: "Subscriptions" },
  "max.com": { name: "Max", cat: "Subscriptions" },
  "youtube tv": { name: "YouTube TV", cat: "Subscriptions" },
  "sling tv": { name: "Sling TV", cat: "Subscriptions" },

  // ── Transportation ──
  "uber trip": { name: "Uber", cat: "Transportation" }, "uber ": { name: "Uber", cat: "Transportation" },
  "lyft": { name: "Lyft", cat: "Transportation" },

  // ── Entertainment ──
  "amc theatre": { name: "AMC Theatres", cat: "Entertainment" }, "amc entertain": { name: "AMC Theatres", cat: "Entertainment" },
  "regal cinema": { name: "Regal Cinemas", cat: "Entertainment" }, "regal entertain": { name: "Regal Cinemas", cat: "Entertainment" },
  "cinemark": { name: "Cinemark", cat: "Entertainment" },
  "dave & buster": { name: "Dave & Buster's", cat: "Entertainment" }, "dave and buster": { name: "Dave & Buster's", cat: "Entertainment" },
  "topgolf": { name: "TopGolf", cat: "Entertainment" },
  "main event": { name: "Main Event", cat: "Entertainment" },
  "six flags": { name: "Six Flags", cat: "Entertainment" },

  // ── Utilities ──
  "comcast": { name: "Comcast", cat: "Utilities" }, "xfinity": { name: "Xfinity", cat: "Utilities" },
  "spectrum": { name: "Spectrum", cat: "Utilities" }, "at&t": { name: "AT&T", cat: "Utilities" },
  "verizon": { name: "Verizon", cat: "Utilities" }, "vzwrlss": { name: "Verizon", cat: "Utilities" },
  "t-mobile": { name: "T-Mobile", cat: "Utilities" }, "tmobile": { name: "T-Mobile", cat: "Utilities" },
  "sprint": { name: "Sprint", cat: "Utilities" }, "cox comm": { name: "Cox", cat: "Utilities" },
  "centurylink": { name: "CenturyLink", cat: "Utilities" }, "lumen": { name: "Lumen", cat: "Utilities" },
  "frontier comm": { name: "Frontier", cat: "Utilities" },
  "google fi": { name: "Google Fi", cat: "Utilities" }, "mint mobile": { name: "Mint Mobile", cat: "Utilities" },
  "cricket": { name: "Cricket", cat: "Utilities" }, "boost mobile": { name: "Boost Mobile", cat: "Utilities" },

  // ── Health & Medical ──
  "cvs": { name: "CVS", cat: "Health & Medical" }, "walgreens": { name: "Walgreens", cat: "Health & Medical" },
  "rite aid": { name: "Rite Aid", cat: "Health & Medical" },
  "labcorp": { name: "LabCorp", cat: "Health & Medical" }, "lab corp": { name: "LabCorp", cat: "Health & Medical" },
  "quest diag": { name: "Quest Diagnostics", cat: "Health & Medical" },

  // ── Fitness ──
  "planet fitness": { name: "Planet Fitness", cat: "Fitness" },
  "la fitness": { name: "LA Fitness", cat: "Fitness" }, "equinox": { name: "Equinox", cat: "Fitness" },
  "anytime fitness": { name: "Anytime Fitness", cat: "Fitness" },
  "ymca": { name: "YMCA", cat: "Fitness" }, "crossfit": { name: "CrossFit", cat: "Fitness" },
  "orangetheory": { name: "Orangetheory", cat: "Fitness" }, "gold's gym": { name: "Gold's Gym", cat: "Fitness" },
  "golds gym": { name: "Gold's Gym", cat: "Fitness" }, "crunch fitness": { name: "Crunch Fitness", cat: "Fitness" },

  // ── Insurance ──
  "geico": { name: "GEICO", cat: "Insurance" }, "state farm": { name: "State Farm", cat: "Insurance" },
  "allstate": { name: "Allstate", cat: "Insurance" }, "progressive": { name: "Progressive", cat: "Insurance" },
  "usaa": { name: "USAA", cat: "Insurance" }, "farmers ins": { name: "Farmers", cat: "Insurance" },
  "liberty mutual": { name: "Liberty Mutual", cat: "Insurance" }, "nationwide": { name: "Nationwide", cat: "Insurance" },

  // ── Pet ──
  "petsmart": { name: "PetSmart", cat: "Pet" }, "petco": { name: "Petco", cat: "Pet" },
  "barkbox": { name: "BarkBox", cat: "Pet" },

  // ── Auto ──
  "autozone": { name: "AutoZone", cat: "Auto" }, "o'reilly auto": { name: "O'Reilly Auto", cat: "Auto" },
  "oreilly auto": { name: "O'Reilly Auto", cat: "Auto" },
  "advance auto": { name: "Advance Auto Parts", cat: "Auto" },
  "jiffy lube": { name: "Jiffy Lube", cat: "Auto" },
  "discount tire": { name: "Discount Tire", cat: "Auto" }, "firestone": { name: "Firestone", cat: "Auto" },
  "pep boys": { name: "Pep Boys", cat: "Auto" }, "napa auto": { name: "NAPA Auto Parts", cat: "Auto" },
  "valvoline": { name: "Valvoline", cat: "Auto" }, "meineke": { name: "Meineke", cat: "Auto" },
  "maaco": { name: "Maaco", cat: "Auto" }, "safelite": { name: "Safelite", cat: "Auto" },

  // ── Personal Care ──
  "great clips": { name: "Great Clips", cat: "Personal Care" },
  "supercuts": { name: "Supercuts", cat: "Personal Care" },
  "ulta": { name: "Ulta Beauty", cat: "Personal Care" }, "sephora": { name: "Sephora", cat: "Personal Care" },
  "sport clips": { name: "Sport Clips", cat: "Personal Care" },
  "european wax": { name: "European Wax Center", cat: "Personal Care" },

  // ── Education ──
  "udemy": { name: "Udemy", cat: "Education" }, "coursera": { name: "Coursera", cat: "Education" },
  "skillshare": { name: "Skillshare", cat: "Education" }, "masterclass": { name: "MasterClass", cat: "Education" },
  "linkedin learn": { name: "LinkedIn Learning", cat: "Education" },

  // ── Travel ──
  "delta air": { name: "Delta Airlines", cat: "Travel" }, "united air": { name: "United Airlines", cat: "Travel" },
  "american air": { name: "American Airlines", cat: "Travel" },
  "southwest air": { name: "Southwest Airlines", cat: "Travel" },
  "jetblue": { name: "JetBlue", cat: "Travel" }, "spirit air": { name: "Spirit Airlines", cat: "Travel" },
  "frontier air": { name: "Frontier Airlines", cat: "Travel" },
  "marriott": { name: "Marriott", cat: "Travel" }, "hilton": { name: "Hilton", cat: "Travel" },
  "hyatt": { name: "Hyatt", cat: "Travel" }, "best western": { name: "Best Western", cat: "Travel" },
  "airbnb": { name: "Airbnb", cat: "Travel" }, "vrbo": { name: "VRBO", cat: "Travel" },
  "booking.com": { name: "Booking.com", cat: "Travel" }, "expedia": { name: "Expedia", cat: "Travel" },
  "hotels.com": { name: "Hotels.com", cat: "Travel" }, "kayak": { name: "Kayak", cat: "Travel" },

  // ── Transfers ──
  "zelle": { name: "Zelle", cat: "Transfers" }, "venmo": { name: "Venmo", cat: "Transfers" },
  "paypal": { name: "PayPal", cat: "Transfers" }, "cash app": { name: "Cash App", cat: "Transfers" },
  "cashapp": { name: "Cash App", cat: "Transfers" }, "wire transfer": { name: "Wire Transfer", cat: "Transfers" }
};

// ══════════════════════════════════════════════════════════
// CATEGORY KEYWORDS — pattern-based fallback when MERCHANT_MAP misses
// ══════════════════════════════════════════════════════════
const CATEGORY_KEYWORDS = {
  // Groceries
  "grocery": "Groceries", "supermarket": "Groceries", "food store": "Groceries",
  // Dining patterns
  "restaurant": "Dining & Restaurants", "cafe": "Dining & Restaurants", "coffee": "Dining & Restaurants",
  "diner": "Dining & Restaurants", "grill": "Dining & Restaurants", "bistro": "Dining & Restaurants",
  "sushi": "Dining & Restaurants", "pizza": "Dining & Restaurants", "burger": "Dining & Restaurants",
  "wing": "Dining & Restaurants", "bbq": "Dining & Restaurants", "barbeque": "Dining & Restaurants",
  "bakery": "Dining & Restaurants", "brewery": "Dining & Restaurants", "brew pub": "Dining & Restaurants",
  "tap house": "Dining & Restaurants", "steakhouse": "Dining & Restaurants",
  "taqueria": "Dining & Restaurants", "cantina": "Dining & Restaurants",
  "food truck": "Dining & Restaurants", "kitchen": "Dining & Restaurants",
  // Gas patterns
  "gas station": "Gas & Fuel", "fuel": "Gas & Fuel", "petrol": "Gas & Fuel",
  // Transportation
  "parking": "Transportation", "toll": "Transportation", "transit": "Transportation",
  "taxi": "Transportation", "cab ": "Transportation",
  // Shopping patterns
  "amazon": "Shopping", "shop": "Shopping", "store": "Shopping", "mart": "Shopping",
  // Entertainment
  "cinema": "Entertainment", "movie": "Entertainment", "theater": "Entertainment",
  "bowling": "Entertainment", "arcade": "Entertainment", "amusement": "Entertainment",
  "concert": "Entertainment", "ticket": "Entertainment",
  // Utilities
  "electric": "Utilities", "power": "Utilities", "water util": "Utilities",
  "gas bill": "Utilities", "internet": "Utilities", "broadband": "Utilities",
  "wireless": "Utilities", "cellular": "Utilities", "mobile phone": "Utilities",
  // Housing
  "rent": "Housing", "mortgage": "Housing", "property tax": "Housing",
  "hoa": "Housing", "lease": "Housing", "apartment": "Housing",
  // Health patterns
  "pharmacy": "Health & Medical", "hospital": "Health & Medical", "clinic": "Health & Medical",
  "doctor": "Health & Medical", "dental": "Health & Medical", "optom": "Health & Medical",
  "urgent care": "Health & Medical", "medical": "Health & Medical", "health": "Health & Medical",
  "ortho": "Health & Medical", "derma": "Health & Medical", "pediatr": "Health & Medical",
  // Fitness
  "gym": "Fitness", "fitness": "Fitness", "workout": "Fitness",
  // Insurance
  "insurance": "Insurance", "insur ": "Insurance",
  // Pet
  "pet ": "Pet", "veterinar": "Pet", "vet clinic": "Pet", "animal hospital": "Pet",
  // Auto
  "auto part": "Auto", "car wash": "Auto", "tire": "Auto", "mechanic": "Auto",
  "lube": "Auto", "oil change": "Auto", "auto repair": "Auto", "body shop": "Auto",
  // Personal Care
  "salon": "Personal Care", "barber": "Personal Care", "spa ": "Personal Care",
  "nail": "Personal Care", "haircut": "Personal Care", "beauty": "Personal Care",
  "dry clean": "Personal Care", "laundry": "Personal Care", "tailor": "Personal Care",
  // Education
  "tuition": "Education", "school": "Education", "university": "Education",
  "college": "Education", "academy": "Education",
  // Travel
  "airline": "Travel", "hotel": "Travel", "flight": "Travel", "travel": "Travel",
  // Fees
  "fee": "Fees & Charges", "overdraft": "Fees & Charges", "late charge": "Fees & Charges",
  "interest charge": "Fees & Charges", "annual fee": "Fees & Charges", "service charge": "Fees & Charges",
  // ATM
  "atm": "ATM & Cash", "cash withdrawal": "ATM & Cash", "cash advance": "ATM & Cash",
  // Transfers
  "transfer": "Transfers",
  // Gifts
  "donation": "Gifts & Donations", "charity": "Gifts & Donations",
  "gofundme": "Gifts & Donations", "church": "Gifts & Donations", "tithe": "Gifts & Donations",
  // Childcare
  "daycare": "Childcare", "childcare": "Childcare", "learning center": "Childcare",
  "preschool": "Childcare",
  // Home
  "storage": "Housing", "u-haul": "Housing", "public storage": "Housing"
};

// ══════════════════════════════════════════════════════════
// MERCHANT NAME CLEANING — strip all bank junk
// ══════════════════════════════════════════════════════════
var _US_STATES = 'AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|DC|PR';
var _STATES_RE = new RegExp('\\s+(' + _US_STATES + ')$', 'i');

function cleanMerchant(desc) {
  if (!desc) return 'Unknown';
  var m = desc.trim();

  // 1. Strip POS system prefixes
  m = m.replace(/^(SQ\s?\*|TST\s?\*|PP\s?\*|APL\s?\*|APPL\s?\*|WPY\s?\*|CKE\s?\*|CHK\s?\*|PAY\s?\*|SP\s+\*?|IN\s+\*?)\s*/i, '');

  // 2. Strip transaction type prefixes
  m = m.replace(/^(PURCHASE AUTHORIZED ON\s+\d{2}\/\d{2}\s*|CHECKCARD\s+\d{2}\d{2}\s*|POS\s+(DEBIT|PURCHASE|REFUND)\s*|DEBIT CARD PURCHASE\s*|RECURRING DEBIT\s*|RECURRING PAYMENT\s*|ACH\s+(DEBIT|CREDIT|PAYMENT)\s*|ONLINE\s+(PAYMENT|PURCHASE)\s*|MOBILE\s+PAYMENT\s*|VISA\s+(DIRECT|DEBIT)\s*|PREAUTHORIZED\s+DEBIT\s*|PENDING\s+)/i, '');

  // 3. Strip ACH metadata (ORIG CO NAME:..., DES:..., CO ID:..., etc.)
  m = m.replace(/\s*(ORIG CO NAME|DES|INDN|CO ID|SEC|PPD ID|CCD ID|WEB ID|TEL ID|TRACE)\s*:.*/i, '');

  // 4. Strip trailing auth codes and merchant IDs
  m = m.replace(/\s+AUTH(?:\s+CODE|\s*#)?\s*\d+/gi, '');
  m = m.replace(/\s+MER(?:\s+ID)?\s*\d+/gi, '');
  m = m.replace(/\s+REF\s*#?\s*\d+/gi, '');
  m = m.replace(/\s+TRANS(?:ACTION)?\s*#?\s*\d+/gi, '');

  // 5. Strip trailing reference numbers (4+ digits), dates, card numbers
  m = m.replace(/\s+\d{4,}$/g, '');
  m = m.replace(/\s+\d{2}\/\d{2}(\/\d{2,4})?$/g, '');
  m = m.replace(/\s+\d{2}-\d{2}(-\d{2,4})?$/g, '');
  m = m.replace(/\s+#\d+/g, '');
  m = m.replace(/\s+(xx|x{2,})\d{2,}/gi, '');
  m = m.replace(/\s+\*+\d+/g, '');

  // 6. Strip trailing domains
  m = m.replace(/\s*\.(com|net|org|io|co|us|edu)\b/gi, '');

  // 7. Strip trailing location: WORD(S) XX 12345
  m = m.replace(/\s+\w+\s+[A-Z]{2}\s+\d{5}(-\d{4})?$/g, '');
  // Strip standalone state+zip
  m = m.replace(/\s+[A-Z]{2}\s*\d{5}(-\d{4})?$/g, '');
  // Strip all 50 US state abbreviations at end
  m = m.replace(_STATES_RE, '');
  // Strip trailing US/USA/country
  m = m.replace(/\s+(US|USA|UNITED STATES)$/gi, '');

  // 8. Handle asterisk-separated: MERCHANT*LOCATION → keep MERCHANT
  if (/\*/.test(m) && !/\b(amazon|amzn)\b/i.test(m)) {
    var parts = m.split('*');
    if (parts[0].trim().length >= 3) m = parts[0];
  }

  // 9. Strip leading/trailing non-alphanumeric
  m = m.replace(/^[^a-zA-Z0-9]+/, '').replace(/[^a-zA-Z0-9)]+$/, '');

  // 10. Normalize whitespace
  m = m.replace(/\s+/g, ' ').trim();

  // 11. Title-case ALL CAPS (but preserve short acronyms like CVS, ATM, KFC)
  if (m === m.toUpperCase() && m.length > 4) {
    m = m.replace(/\b\w+/g, function(t) {
      if (t.length <= 3) return t; // keep short words uppercase (CVS, KFC, ATM, etc.)
      return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase();
    });
  }

  return m || 'Unknown';
}

// ══════════════════════════════════════════════════════════
// MERCHANT IDENTIFICATION & CATEGORIZATION
// ══════════════════════════════════════════════════════════

// Look up cleaned name in MERCHANT_MAP → { name, cat } or null
function identifyMerchant(cleanedName) {
  var lower = cleanedName.toLowerCase();
  for (var key in MERCHANT_MAP) {
    if (MERCHANT_MAP.hasOwnProperty(key) && lower.indexOf(key) !== -1) {
      return MERCHANT_MAP[key];
    }
  }
  return null;
}

// Keyword-only categorization (no learned rules — those are checked separately)
function categorizeByKeyword(merchant) {
  var lower = merchant.toLowerCase();
  for (var keyword in CATEGORY_KEYWORDS) {
    if (CATEGORY_KEYWORDS.hasOwnProperty(keyword) && lower.indexOf(keyword) !== -1) {
      return CATEGORY_KEYWORDS[keyword];
    }
  }
  return 'Other';
}

// Full resolution: clean desc → identify merchant → categorize
// Priority: learned rules > MERCHANT_MAP > CATEGORY_KEYWORDS > "Other"
function resolveMerchant(desc) {
  var cleaned = cleanMerchant(desc);
  var match = identifyMerchant(cleaned);
  var merchant = match ? match.name : cleaned;
  var rules = loadCategoryRules();
  var cat = rules[merchant.toLowerCase()] || (match ? match.cat : null) || categorizeByKeyword(merchant);
  return { merchant: merchant, category: cat };
}

// Keep legacy categorize() for backward compatibility
function categorize(merchant) {
  var rules = loadCategoryRules();
  var lower = merchant.toLowerCase();
  if (rules[lower]) return rules[lower];
  var match = identifyMerchant(lower);
  if (match) return match.cat;
  return categorizeByKeyword(merchant);
}

// ── UUID generator ──
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

// ── Dollar formatting ──
function fmt(v) {
  var str = "$" + Math.abs(v).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return v < 0 ? "-" + str : str;
}

// ── localStorage helpers ──
const _isDemo = typeof DEMO_MODE !== 'undefined' && DEMO_MODE;
function loadMonths() {
  try { return JSON.parse((_isDemo ? demoGet("expenses_months") : localStorage.getItem("expenses_months")) || '[]'); }
  catch { return []; }
}
function saveMonths(arr) {
  if (_isDemo) demoSet("expenses_months", JSON.stringify(arr));
  else localStorage.setItem("expenses_months", JSON.stringify(arr));
}
function loadData(key) {
  try { return JSON.parse((_isDemo ? demoGet("expenses_data_" + key) : localStorage.getItem("expenses_data_" + key)) || '[]'); }
  catch { return []; }
}
function saveData(key, data) {
  if (_isDemo) demoSet("expenses_data_" + key, JSON.stringify(data));
  else { localStorage.setItem("expenses_data_" + key, JSON.stringify(data)); if (typeof syncToCloud === 'function') syncToCloud(); }
}
function loadEdits(key) {
  try { return JSON.parse((_isDemo ? demoGet("expenses_edits_" + key) : localStorage.getItem("expenses_edits_" + key)) || '{}'); }
  catch { return {}; }
}
function saveEdits(key, edits) {
  if (_isDemo) demoSet("expenses_edits_" + key, JSON.stringify(edits));
  else { localStorage.setItem("expenses_edits_" + key, JSON.stringify(edits)); if (typeof syncToCloud === 'function') syncToCloud(); }
}
function loadCategoryRules() {
  try { return JSON.parse((_isDemo ? demoGet("expenses_categoryRules") : localStorage.getItem("expenses_categoryRules")) || '{}'); }
  catch { return {}; }
}
function saveCategoryRules(rules) {
  if (_isDemo) demoSet("expenses_categoryRules", JSON.stringify(rules));
  else { localStorage.setItem("expenses_categoryRules", JSON.stringify(rules)); if (typeof syncToCloud === 'function') syncToCloud(); }
}

// ── Global state ──
let activeData = [];
let ctx = {};
let charts = {};
let currentView = 'overview';
let editingId = null;
let filtersInitialized = false;
let uploadStep = 0;
let uploadFiles = [];
let parsedTransactions = [];
let parsedMonthBuckets = {};
let processLog = [];
let sortCol = null;
let sortDir = 'asc';

// ── Month context ──
function buildMonthContext(monthKey) {
  const [yearStr, monthStr] = monthKey.split("_");
  const year = parseInt(yearStr);
  const month = parseInt(monthStr);
  const daysInMonth = new Date(year, month, 0).getDate();
  const monthNames = ["","January","February","March","April","May","June","July","August","September","October","November","December"];
  const monthAbbrs = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const weeks = [];
  for (let start = 1; start <= daysInMonth; start += 7) {
    const end = Math.min(start + 6, daysInMonth);
    weeks.push({ start, end, label: monthAbbrs[month] + " " + start + "-" + end });
  }
  return {
    month, year, monthName: monthNames[month], monthAbbr: monthAbbrs[month],
    daysInMonth, weeks, monthKey,
    editsKey: "expenses_edits_" + monthKey,
    storageKey: "expenses_data_" + monthKey
  };
}

// ── Apply edits to data ──
function applyEdits(data, monthKey) {
  const edits = loadEdits(monthKey);
  data.forEach(t => {
    // Re-resolve merchant/category from original description using latest cleanup logic
    if (t.description) {
      try {
        var resolved = resolveMerchant(t.description);
        // Only apply if not manually edited
        if (!t._manualCategory && !(edits[t.id] && edits[t.id].category)) {
          t.merchant = resolved.merchant;
          t.category = resolved.category;
        } else if (!(edits[t.id] && edits[t.id].merchant)) {
          // Still clean merchant name even if category was manually set
          t.merchant = resolved.merchant;
        }
      } catch(e) {
        console.error('resolveMerchant error for:', t.description, e);
      }
    }
    // Then apply manual edits on top (these always win)
    if (edits[t.id]) {
      if (edits[t.id].category) { t.category = edits[t.id].category; t._manualCategory = true; }
      if (edits[t.id].merchant) t.merchant = edits[t.id].merchant;
    }
  });
  return data;
}

// ── Recompute derived values ──
let totalExpenses = 0, txCount = 0, avgPerTx = 0;
let catGroups = [], merchantGroups = [];

function recomputeAll() {
  totalExpenses = activeData.reduce((s, t) => s + t.amount, 0);
  txCount = activeData.length;
  avgPerTx = txCount ? totalExpenses / txCount : 0;

  // Group by category
  const catMap = {};
  activeData.forEach(t => {
    if (!catMap[t.category]) catMap[t.category] = { name: t.category, total: 0, count: 0 };
    catMap[t.category].total += t.amount;
    catMap[t.category].count++;
  });
  catGroups = Object.values(catMap).sort((a, b) => b.total - a.total);

  // Group by merchant
  const merchMap = {};
  activeData.forEach(t => {
    if (!merchMap[t.merchant]) merchMap[t.merchant] = { name: t.merchant, total: 0, count: 0 };
    merchMap[t.merchant].total += t.amount;
    merchMap[t.merchant].count++;
  });
  merchantGroups = Object.values(merchMap).sort((a, b) => b.total - a.total);
}

// ── Chart management ──
function destroyAllCharts() {
  Object.values(charts).forEach(c => { if (c && c.destroy) c.destroy(); });
  charts = {};
}

// ── Switch month ──
function switchMonth(monthKey) {
  if (!monthKey) return;
  if (_isDemo) demoSet("expenses_activeMonth", monthKey);
  else localStorage.setItem("expenses_activeMonth", monthKey);
  ctx = buildMonthContext(monthKey);
  activeData = applyEdits(loadData(monthKey), monthKey);
  filtersInitialized = false;
  recomputeAll();
  destroyAllCharts();
  updateSubtitle();
  renderAll();
}

function updateSubtitle() {
  const sub = document.getElementById("dashboard-subtitle");
  if (activeData.length === 0) {
    sub.textContent = "Upload bank statements to track all your spending";
  } else {
    const merchants = new Set(activeData.map(t => t.merchant)).size;
    const cats = new Set(activeData.map(t => t.category)).size;
    sub.textContent = ctx.monthName + " " + ctx.year + " \u2022 " + fmt(totalExpenses) + " across " + txCount + " transactions \u2022 " + merchants + " merchants \u2022 " + cats + " categories";
  }
}

// ── Render all views ──
function renderAll() {
  renderOverview();
  renderCategories();
  renderMerchants();
  renderTrends();
  renderTransactions();
  renderCompare();
  updateMonthNav();
}

// ── Show / hide views ──
function showView(id, filterOpts) {
  currentView = id;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + id).classList.add('active');
  fadeInView('view-' + id);
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => {
    if (t.textContent.toLowerCase().replace(/\s+/g,'') === id ||
        (id === 'overview' && t.textContent === 'Overview') ||
        (id === 'categories' && t.textContent === 'By Category') ||
        (id === 'merchants' && t.textContent === 'By Merchant') ||
        (id === 'trends' && t.textContent === 'Trends') ||
        (id === 'transactions' && t.textContent === 'All Transactions') ||
        (id === 'compare' && t.textContent === 'Compare'))
      t.classList.add('active');
  });
  if (id === 'transactions' && filterOpts) {
    setTimeout(() => applyTransactionFilter(filterOpts), 50);
  }
  if (id === 'merchant-detail' && filterOpts && filterOpts.merchant) {
    showMerchantDetail(filterOpts.merchant, filterOpts.source || 'merchants');
  }
  if (id === 'category-detail' && filterOpts && filterOpts.category) {
    showCategoryDetail(filterOpts.category, filterOpts.source || 'categories');
  }
}

// ── Month navigation ──
function updateMonthNav() {
  const months = loadMonths();
  const sel = document.getElementById("month-select");
  const active = (_isDemo ? demoGet("expenses_activeMonth") : localStorage.getItem("expenses_activeMonth")) || "";
  sel.innerHTML = "";
  if (months.length === 0) {
    sel.innerHTML = '<option value="">No data loaded</option>';
    document.getElementById("tab-compare").style.display = "none";
    return;
  }
  months.sort().reverse().forEach(mk => {
    const c = buildMonthContext(mk);
    const opt = document.createElement("option");
    opt.value = mk;
    opt.textContent = c.monthName + " " + c.year;
    if (mk === active) opt.selected = true;
    sel.appendChild(opt);
  });
  document.getElementById("tab-compare").style.display = months.length >= 2 ? "" : "none";
}

// ══════════════════════════════════════════════════════════
// CSV PARSER
// ══════════════════════════════════════════════════════════
function parseCSV(text) {
  // Strip BOM
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];
  // Detect delimiter
  const delim = lines[0].includes('\t') ? '\t' : ',';
  // Smart CSV line parser (handles quoted fields)
  function parseLine(line) {
    const result = []; let current = ''; let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQuotes = !inQuotes; }
      else if (ch === delim && !inQuotes) { result.push(current.trim()); current = ''; }
      else { current += ch; }
    }
    result.push(current.trim());
    return result;
  }

  // Check if first row looks like headers or data
  const firstCols = parseLine(lines[0]).map(h => h.replace(/"/g,'').trim().toLowerCase());
  var isHeaderless = false;
  // If first column of first row looks like a date, it's headerless
  if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(firstCols[0])) {
    isHeaderless = true;
  }

  var headers, dataStart;
  if (isHeaderless) {
    // Auto-detect column layout: find date col, desc col, amount col
    headers = _inferHeaderlessLayout(firstCols);
    dataStart = 0; // first row is data
  } else {
    headers = firstCols;
    dataStart = 1; // skip header row
  }

  const bank = detectBank(headers);
  const transactions = [];
  for (let i = dataStart; i < lines.length; i++) {
    const cols = parseLine(lines[i]);
    if (cols.length < 3) continue;
    const tx = extractTransaction(headers, cols, bank);
    if (tx && tx.amount !== 0) transactions.push(tx);
  }
  // Detect sign convention: if most amounts are negative, this is credit card format
  // (negative = charges, positive = credits). Flip all signs so charges are positive.
  var negCount = transactions.filter(function(t) { return t.amount < 0; }).length;
  if (negCount > transactions.length / 2) {
    transactions.forEach(function(t) { t.amount = -t.amount; });
  }
  // Re-categorize credits (negative amounts) as Refund after sign flip
  transactions.forEach(function(t) {
    if (t.amount < 0) { t.category = 'Refund'; t._origCategory = 'Refund'; }
  });
  return transactions;
}

// Infer synthetic headers for headerless CSVs by inspecting first data row
function _inferHeaderlessLayout(cols) {
  var headers = cols.map(function() { return ''; });
  var dateFound = false, descFound = false, amountFound = false;
  for (var i = 0; i < cols.length; i++) {
    var v = cols[i].replace(/"/g, '').trim();
    if (!dateFound && /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(v)) {
      headers[i] = 'date'; dateFound = true;
    } else if (!amountFound && /^-?\$?[\d,]+\.?\d*$/.test(v.replace(/[$,]/g, ''))) {
      // Could be amount — but only flag if it looks numeric
      if (!descFound) continue; // probably need desc before amount
      headers[i] = 'amount'; amountFound = true;
    } else if (!descFound && v.length > 2 && /[a-zA-Z]/.test(v)) {
      headers[i] = 'description'; descFound = true;
    }
  }
  // Second pass for amount if we didn't get it
  if (!amountFound) {
    for (var j = 0; j < cols.length; j++) {
      if (headers[j]) continue;
      var val = cols[j].replace(/"/g, '').replace(/[$,\s]/g, '');
      if (/^-?\d+\.?\d*$/.test(val) && parseFloat(val) !== 0) {
        headers[j] = 'amount'; break;
      }
    }
  }
  return headers;
}

function detectBank(headers) {
  const h = headers.join('|');
  if (h.includes('posting date') && h.includes('description') && h.includes('amount')) return 'chase';
  if (h.includes('payee') && h.includes('amount')) return 'bofa';
  if (h.includes('transaction date') && (h.includes('debit') || h.includes('credit'))) return 'capital_one';
  if (headers.includes('debit') && headers.includes('credit') && h.includes('description')) return 'citi';
  if (headers.length <= 5 && h.includes('date') && h.includes('description') && h.includes('amount')) return 'wells_fargo';
  return 'generic';
}

function extractTransaction(headers, cols, bank) {
  const get = name => {
    const idx = headers.indexOf(name);
    return idx >= 0 && idx < cols.length ? cols[idx] : '';
  };
  const getAny = (...names) => {
    for (const n of names) { const v = get(n); if (v) return v; }
    return '';
  };
  // Get a numeric value, stripping $ and commas
  const getNum = name => parseFloat((get(name) || '').replace(/[$,]/g, ''));
  const getAnyNum = (...names) => {
    for (const n of names) { const v = getNum(n); if (!isNaN(v)) return v; }
    return NaN;
  };
  let dateStr, desc, amount;

  switch (bank) {
    case 'chase':
      dateStr = getAny('posting date', 'transaction date', 'date');
      desc = get('description');
      amount = getNum('amount');
      if (isNaN(amount)) return null;
      amount = -amount; // Chase: negative = expense
      break;
    case 'bofa':
      dateStr = get('date');
      desc = getAny('payee', 'description');
      amount = getNum('amount');
      if (isNaN(amount)) return null;
      amount = -amount;
      break;
    case 'capital_one':
      dateStr = getAny('transaction date', 'date');
      desc = get('description');
      var debit = getNum('debit');
      var credit = getNum('credit');
      if (!isNaN(debit) && debit > 0) amount = debit;
      else if (!isNaN(credit) && credit > 0) amount = -credit;
      else return null;
      break;
    case 'citi':
      dateStr = get('date');
      desc = get('description');
      var deb = getNum('debit');
      if (!isNaN(deb) && deb > 0) amount = deb;
      else return null;
      break;
    case 'wells_fargo':
      dateStr = get('date');
      desc = get('description');
      amount = getNum('amount');
      if (isNaN(amount)) return null;
      amount = -amount;
      break;
    default: // generic — try to find date, description, and amount from any header names
      dateStr = ''; desc = ''; amount = NaN;
      var _debit = NaN, _credit = NaN;
      for (let i = 0; i < headers.length; i++) {
        var hdr = headers[i];
        if (!dateStr && /date|posted|trans.*dt/i.test(hdr)) dateStr = cols[i];
        if (!desc && /desc|memo|payee|narration|particular|merchant|name|detail|reference/i.test(hdr)) desc = cols[i];
        if (isNaN(amount) && /^amount$|^total$|^charge$|^sale/i.test(hdr)) {
          var v = parseFloat((cols[i] || '').replace(/[$,]/g, ''));
          if (!isNaN(v)) amount = v; // keep sign — convention detected later
        }
        if (isNaN(_debit) && /debit|withdrawal|expense|charge/i.test(hdr)) {
          var d = parseFloat((cols[i] || '').replace(/[$,]/g, ''));
          if (!isNaN(d) && d !== 0) _debit = Math.abs(d);
        }
        if (isNaN(_credit) && /credit|deposit|payment/i.test(hdr)) {
          var c = parseFloat((cols[i] || '').replace(/[$,]/g, ''));
          if (!isNaN(c) && c !== 0) _credit = Math.abs(c);
        }
      }
      // Prefer amount column, fall back to debit, then credit as negative (refund)
      if (isNaN(amount) && !isNaN(_debit)) amount = _debit;
      if (isNaN(amount) && !isNaN(_credit)) amount = -_credit;
      if (isNaN(amount)) {
        // Last resort: scan for any numeric column that isn't the date
        for (let i = 0; i < cols.length; i++) {
          if (headers[i] && /date/i.test(headers[i])) continue;
          if (headers[i] && /desc|memo|payee|merchant|name/i.test(headers[i])) continue;
          var num = parseFloat((cols[i] || '').replace(/[$,]/g, ''));
          if (!isNaN(num) && num !== 0) { amount = num; break; }
        }
      }
      if (isNaN(amount)) return null;
  }

  if (!dateStr || amount === 0) return null;
  var resolved = resolveMerchant(desc);
  return {
    id: uuid(), date: normalizeDate(dateStr), description: desc,
    merchant: resolved.merchant, category: resolved.category, amount: amount,
    source: 'csv', sourceType: '', bank, _origCategory: resolved.category, _manualCategory: false
  };
}

// ══════════════════════════════════════════════════════════
// PDF PARSER — line-based with credit/charge column detection
// ══════════════════════════════════════════════════════════
async function parsePDF(arrayBuffer) {
  var pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  var transactions = [];
  // Track column header X positions across pages (set once from header row)
  var creditX = -1, chargeX = -1;

  for (var p = 1; p <= pdf.numPages; p++) {
    var page = await pdf.getPage(p);
    var content = await page.getTextContent();
    var items = content.items.filter(function(it) { return it.str.trim(); });
    if (items.length === 0) continue;

    // Sort by Y (top-to-bottom descending), then X (left-to-right)
    items.sort(function(a, b) {
      var dy = b.transform[5] - a.transform[5];
      return Math.abs(dy) > 3 ? dy : a.transform[4] - b.transform[4];
    });

    // Group items into rows by Y position (keep item objects for X-position analysis)
    var rows = [];
    var rowItems = [items[0]];
    for (var i = 1; i < items.length; i++) {
      var y = Math.round(items[i].transform[5]);
      var prevY = Math.round(rowItems[rowItems.length - 1].transform[5]);
      if (Math.abs(y - prevY) > 3) {
        rows.push(rowItems.slice());
        rowItems = [];
      }
      rowItems.push(items[i]);
    }
    if (rowItems.length) rows.push(rowItems);

    // Scan for column headers: "Credits" and "Charges" (or "Debit"/"Credit")
    if (creditX < 0 || chargeX < 0) {
      for (var h = 0; h < rows.length; h++) {
        var rowText = rows[h].map(function(it) { return it.str; }).join(' ').toLowerCase();
        // Look for rows containing both credit and charge keywords
        if (/credits?/i.test(rowText) && /charges?|debit/i.test(rowText)) {
          for (var c = 0; c < rows[h].length; c++) {
            var txt = rows[h][c].str.trim().toLowerCase();
            if (/^credits?$/.test(txt)) creditX = rows[h][c].transform[4];
            if (/^charges?$|^debit$/.test(txt)) chargeX = rows[h][c].transform[4];
          }
          // If exact match failed, try partial match (PDF may merge text items)
          if (creditX < 0 || chargeX < 0) {
            for (var c2 = 0; c2 < rows[h].length; c2++) {
              var txt2 = rows[h][c2].str.trim().toLowerCase();
              if (creditX < 0 && /credit/i.test(txt2) && !/card/i.test(txt2)) creditX = rows[h][c2].transform[4];
              if (chargeX < 0 && /charge/i.test(txt2) && !/finance|other/i.test(txt2)) chargeX = rows[h][c2].transform[4];
            }
          }
          if (creditX > 0 && chargeX > 0) break;
        }
      }
    }

    // Parse each row: reconstruct text line + detect credit via X position
    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];
      var line = row.map(function(it) { return it.str; }).join(' ').replace(/\s+/g, ' ').trim();

      var tx = parsePDFLine(line);
      if (!tx) continue;

      // Determine if amount is a credit by checking X position of the dollar amount
      if (creditX > 0 && chargeX > 0) {
        // Find the rightmost dollar-amount item in this row
        var amountX = -1;
        for (var a = row.length - 1; a >= 0; a--) {
          var cleaned = row[a].str.replace(/[$,\s]/g, '');
          if (/^\d+\.\d{2}$/.test(cleaned)) {
            amountX = row[a].transform[4];
            break;
          }
        }
        if (amountX > 0) {
          var distToCredit = Math.abs(amountX - creditX);
          var distToCharge = Math.abs(amountX - chargeX);
          if (distToCredit < distToCharge) {
            tx.amount = -Math.abs(tx.amount);
            tx.isCredit = true;
            tx.category = 'Refund';
          }
        }
      }

      transactions.push(tx);
    }
  }
  return transactions;
}

// Reference number pattern: 10-25 alphanumeric chars containing at least one letter
// Wells Fargo uses codes like 5543687B53K2WS4TW, 0230537B5HEZ75KLM, etc.
var PDF_REF_NUM = /[A-Za-z0-9]*[A-Za-z][A-Za-z0-9]{8,24}/;

function parsePDFLine(line) {
  var dateStr, desc, amount, m;

  // Pattern 1: Wells Fargo — trans date, post date, reference number, description, amount(s)
  // e.g. "12/22 12/22 5543687B53K2WS4TW QUANTUM RADIOLOGY PC MARIETTA GA 74.79"
  m = line.match(/^(\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?)\s+\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?\s+[A-Za-z0-9]*[A-Za-z][A-Za-z0-9]{8,24}\s+(.+?)\s+(-?\$?[\d,]+\.\d{2})(?:\s+-?\$?[\d,]+\.\d{2})*\s*$/);

  if (!m) {
    // Pattern 2: trans date + post date, no reference number
    // e.g. "12/22 12/22 QUANTUM RADIOLOGY PC MARIETTA GA 74.79"
    m = line.match(/^(\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?)\s+\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?\s+(.+?)\s+(-?\$?[\d,]+\.\d{2})(?:\s+-?\$?[\d,]+\.\d{2})*\s*$/);
  }

  if (!m) {
    // Pattern 3: single date + description + amount(s)
    // e.g. "12/22 QUANTUM RADIOLOGY PC 74.79"
    m = line.match(/^(\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?)\s+(.+?)\s+(-?\$?[\d,]+\.\d{2})(?:\s+-?\$?[\d,]+\.\d{2})*\s*$/);
  }

  if (!m) return null;

  dateStr = m[1];
  desc = m[2].trim();
  amount = parseFloat(m[3].replace(/[$,]/g, ''));

  // Clean description: strip reference numbers that leaked into description start
  desc = desc.replace(/^[A-Za-z0-9]*[A-Za-z][A-Za-z0-9]{8,24}\s+/, '').trim();
  // Strip trailing dollar amounts that leaked into description
  desc = desc.replace(/\s+-?\$?[\d,]+\.\d{2}\s*$/g, '').trim();

  // Skip non-transaction lines (headers, totals, payments, credits)
  if (!desc) return null;
  if (/^(payment|thank you|credits?|refund|payment received|total|balance|previous|new balance|subtotal|finance charge)/i.test(desc)) return null;
  if (/\btotal\s+\d{10,}/i.test(line)) return null;
  if (/transaction (summary|details)/i.test(desc)) return null;
  if (isNaN(amount) || amount <= 0) return null;
  if (amount > 50000) return null;

  var resolved = resolveMerchant(desc);
  return {
    id: uuid(), date: normalizeDate(dateStr), description: desc,
    merchant: resolved.merchant, category: resolved.category, amount: Math.abs(amount),
    source: 'pdf', sourceType: '', bank: 'Wells Fargo', _origCategory: resolved.category, _manualCategory: false
  };
}

// ══════════════════════════════════════════════════════════
// EXCEL PARSER
// ══════════════════════════════════════════════════════════
function parseExcel(arrayBuffer) {
  const wb = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });
  // Find best sheet — prefer one with "transaction" in name, else first
  let sheetName = wb.SheetNames[0];
  for (const sn of wb.SheetNames) {
    if (/transaction|activity|history/i.test(sn)) { sheetName = sn; break; }
  }
  const data = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { defval: '' });
  if (data.length === 0) return [];
  // Map columns flexibly
  const keys = Object.keys(data[0]);
  const findCol = (...patterns) => keys.find(k => patterns.some(p => k.toLowerCase().includes(p))) || '';
  const dateCol = findCol('date');
  const descCol = findCol('description', 'desc', 'memo', 'payee', 'narration', 'particular');
  const amountCol = findCol('amount', 'debit', 'value', 'total');
  const creditCol = findCol('credit');
  const transactions = [];
  data.forEach(row => {
    let dateStr = row[dateCol];
    if (dateStr instanceof Date) dateStr = (dateStr.getMonth()+1) + '/' + dateStr.getDate() + '/' + dateStr.getFullYear();
    else dateStr = String(dateStr);
    const desc = String(row[descCol] || '');
    let amount = parseFloat(String(row[amountCol]).replace(/[$,]/g, ''));
    // If no amount but there's a credit column, import as negative
    if ((isNaN(amount) || amount === 0) && creditCol) {
      var cr = parseFloat(String(row[creditCol]).replace(/[$,]/g, ''));
      if (!isNaN(cr) && cr !== 0) amount = -Math.abs(cr);
    }
    if (isNaN(amount) || amount === 0) return;
    var resolved = resolveMerchant(desc);
    transactions.push({
      id: uuid(), date: normalizeDate(dateStr), description: desc,
      merchant: resolved.merchant, category: resolved.category, amount: amount,
      source: 'xlsx', sourceType: '', bank: 'unknown', _origCategory: resolved.category, _manualCategory: false
    });
  });
  // Detect sign convention: if most amounts negative, flip all (charges→positive, credits→negative)
  var negCount = transactions.filter(function(t) { return t.amount < 0; }).length;
  if (negCount > transactions.length / 2) {
    transactions.forEach(function(t) { t.amount = -t.amount; });
  }
  // Re-categorize credits (negative amounts) as Refund after sign flip
  transactions.forEach(function(t) {
    if (t.amount < 0) { t.category = 'Refund'; t._origCategory = 'Refund'; }
  });
  return transactions;
}

// ── Date normalization ──
function normalizeDate(str) {
  if (!str) return '';
  str = String(str).trim();
  // Try MM/DD/YYYY or MM-DD-YYYY
  let m = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (m) {
    let year = parseInt(m[3]);
    if (year < 100) year += 2000;
    return year + '-' + m[1].padStart(2,'0') + '-' + m[2].padStart(2,'0');
  }
  // Try YYYY-MM-DD
  m = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) return m[1] + '-' + m[2].padStart(2,'0') + '-' + m[3].padStart(2,'0');
  // Try MM/DD (assume current year)
  m = str.match(/^(\d{1,2})[\/\-](\d{1,2})$/);
  if (m) return new Date().getFullYear() + '-' + m[1].padStart(2,'0') + '-' + m[2].padStart(2,'0');
  return str;
}

// ── Detect month from transactions ──
function detectMonthKey(transactions) {
  const monthCounts = {};
  transactions.forEach(t => {
    if (t.date && t.date.length >= 7) {
      const key = t.date.substring(0, 4) + '_' + t.date.substring(5, 7);
      monthCounts[key] = (monthCounts[key] || 0) + 1;
    }
  });
  let best = null, bestCount = 0;
  for (const [k, c] of Object.entries(monthCounts)) {
    if (c > bestCount) { best = k; bestCount = c; }
  }
  return best;
}

// ══════════════════════════════════════════════════════════
// UPLOAD MODAL — Multi-file with month-splitting
// ══════════════════════════════════════════════════════════
function openUploadModal() {
  if (_isDemo) { showDemoUpgradePrompt("Upload your own bank statements by creating a free account."); return; }
  uploadFiles = []; uploadStep = 0; parsedTransactions = []; parsedMonthBuckets = {}; processLog = [];
  document.getElementById('file-input').value = '';
  var fileList = document.getElementById('upload-file-list');
  if (fileList) fileList.innerHTML = '';
  var actions = document.getElementById('upload-actions');
  if (actions) actions.style.display = 'none';
  goUploadStep(0);
  document.getElementById('upload-modal').classList.add('open');
}
function closeUploadModal() {
  document.getElementById('upload-modal').classList.remove('open');
}

function goUploadStep(step) {
  uploadStep = step;
  document.querySelectorAll('.upload-step').forEach(function(el, i) {
    el.classList.toggle('active', i === step);
  });
  document.querySelectorAll('.step-dot').forEach(function(el, i) {
    el.classList.remove('active', 'done');
    if (i === step) el.classList.add('active');
    else if (i < step) el.classList.add('done');
  });
}

// ── Auto-detect file format from extension ──
function detectFileFormat(fileName) {
  var ext = fileName.split('.').pop().toLowerCase();
  if (ext === 'csv' || ext === 'txt') return 'csv';
  if (ext === 'pdf') return 'pdf';
  if (ext === 'xlsx' || ext === 'xls') return 'xlsx';
  return null;
}

// ── Group transactions by month ──
function groupByMonth(transactions) {
  var buckets = {};
  transactions.forEach(function(t) {
    if (!t.date || t.date.length < 7) return;
    var key = t.date.substring(0, 4) + '_' + t.date.substring(5, 7);
    if (!buckets[key]) buckets[key] = [];
    buckets[key].push(t);
  });
  return buckets;
}

// ── Multi-file drop handler ──
function handleMultiDrop(e) {
  e.preventDefault();
  var dz = e.target.closest('.drop-zone');
  if (dz) dz.classList.remove('drag-over');
  handleMultiFiles(e.dataTransfer.files);
}

// ── Accept multiple files from input or drop ──
function handleMultiFiles(fileList) {
  var accepted = ['.csv', '.txt', '.pdf', '.xlsx', '.xls'];
  var newFiles = Array.from(fileList).filter(function(f) {
    var ext = '.' + f.name.split('.').pop().toLowerCase();
    return accepted.indexOf(ext) !== -1;
  });
  if (newFiles.length === 0 && fileList.length > 0) {
    showToast('No supported files found. Use CSV, PDF, or Excel.', 'error');
    return;
  }
  var remaining = 20 - uploadFiles.length;
  var toAdd = newFiles.slice(0, remaining);
  if (newFiles.length > remaining) {
    showToast('Only adding ' + remaining + ' more (20 max). ' + (newFiles.length - remaining) + ' skipped.', 'warning');
  }
  // Read file data into memory immediately so File references don't go stale
  // Store as Uint8Array copy — ArrayBuffers can get detached by PDF.js or other APIs
  toAdd.forEach(function(file) {
    var format = detectFileFormat(file.name);
    var reader = new FileReader();
    reader.onload = function() {
      var data = new Uint8Array(reader.result);
      uploadFiles.push({ name: file.name, size: file.size, format: format, data: data });
      renderUploadFileList();
    };
    reader.onerror = function() {
      showToast('Failed to read ' + file.name, 'error');
    };
    reader.readAsArrayBuffer(file);
  });
}

// ── Render file list with icons and remove buttons ──
function renderUploadFileList() {
  var container = document.getElementById('upload-file-list');
  var actions = document.getElementById('upload-actions');
  if (uploadFiles.length === 0) {
    container.innerHTML = '';
    actions.style.display = 'none';
    return;
  }
  var icons = { csv: '&#128196;', pdf: '&#128195;', xlsx: '&#128202;' };
  var fmtLabels = { csv: 'CSV', pdf: 'PDF', xlsx: 'Excel' };
  var html = '<div class="upload-file-grid">';
  uploadFiles.forEach(function(uf, i) {
    var sizeKB = (uf.size / 1024).toFixed(1);
    html += '<div class="upload-file-item">';
    html += '<span class="upload-file-icon">' + (icons[uf.format] || '&#128196;') + '</span>';
    html += '<div class="upload-file-info">';
    html += '<div class="upload-file-name" title="' + uf.name + '">' + uf.name + '</div>';
    html += '<div class="upload-file-meta">' + (fmtLabels[uf.format] || 'Unknown') + ' &bull; ' + sizeKB + ' KB</div>';
    html += '</div>';
    html += '<button class="upload-file-remove" onclick="removeUploadFile(' + i + ')">&times;</button>';
    html += '</div>';
  });
  html += '</div>';
  container.innerHTML = html;
  actions.style.display = 'flex';
  document.getElementById('upload-file-count').textContent = uploadFiles.length + ' file' + (uploadFiles.length !== 1 ? 's' : '');
}

function removeUploadFile(idx) {
  uploadFiles.splice(idx, 1);
  renderUploadFileList();
}
function clearUploadFiles() {
  uploadFiles = [];
  renderUploadFileList();
}

// ── Process all uploaded files sequentially ──
async function processUploadedFiles() {
  if (!uploadFiles.length) return;
  parsedTransactions = [];
  processLog = [];
  goUploadStep(1);

  var logEl = document.getElementById('process-log');
  logEl.innerHTML = '';
  var total = uploadFiles.length;

  function addLog(msg, type) {
    var div = document.createElement('div');
    div.className = 'process-log-line' + (type ? ' ' + type : '');
    div.textContent = msg;
    logEl.appendChild(div);
    logEl.scrollTop = logEl.scrollHeight;
  }

  addLog('Processing ' + total + ' file(s)...', 'info');

  for (var i = 0; i < total; i++) {
    var uf = uploadFiles[i];
    var pct = Math.round((i / total) * 100);
    document.getElementById('process-fill').style.width = pct + '%';
    document.getElementById('process-pct').textContent = pct + '%';
    document.getElementById('process-text').textContent = 'Processing file ' + (i + 1) + ' of ' + total + '...';

    try {
      var txns = [];
      if (uf.format === 'csv') {
        var text = new TextDecoder().decode(uf.data);
        txns = parseCSV(text);
        // If no transactions, show diagnostic info
        if (txns.length === 0 && text.trim()) {
          var firstLine = text.split(/\r?\n/)[0] || '';
          if (firstLine.length > 120) firstLine = firstLine.substring(0, 120) + '...';
          addLog('  Headers: ' + firstLine, 'info');
        }
      } else if (uf.format === 'pdf') {
        // PDF.js detaches the underlying buffer — make an independent copy
        var pdfData = new Uint8Array(uf.data);
        txns = await parsePDF(pdfData);
      } else if (uf.format === 'xlsx') {
        txns = parseExcel(uf.data);
      } else {
        addLog(uf.name + ': Unsupported format, skipped', 'error');
        processLog.push({ name: uf.name, count: 0, error: 'Unsupported format' });
        continue;
      }
      if (txns.length > 0) {
        addLog(uf.name + ': ' + txns.length + ' transactions found', 'success');
        parsedTransactions.push.apply(parsedTransactions, txns);
        processLog.push({ name: uf.name, count: txns.length });
      } else {
        addLog(uf.name + ': No transactions found', 'error');
        processLog.push({ name: uf.name, count: 0, error: 'No transactions' });
      }
    } catch (err) {
      addLog(uf.name + ': Error — ' + err.message, 'error');
      processLog.push({ name: uf.name, count: 0, error: err.message });
    }
  }

  // Finish progress
  document.getElementById('process-fill').style.width = '100%';
  document.getElementById('process-pct').textContent = '100%';
  document.getElementById('process-text').textContent = 'Processing complete!';

  if (parsedTransactions.length === 0) {
    addLog('No transactions found in any file.', 'error');
    setTimeout(function() { goUploadStep(0); }, 1500);
    return;
  }

  // Group by month
  parsedMonthBuckets = groupByMonth(parsedTransactions);
  var monthCount = Object.keys(parsedMonthBuckets).length;
  addLog(parsedTransactions.length + ' total transactions across ' + monthCount + ' month(s)', 'info');

  // Check for dropped transactions (bad dates)
  var bucketed = 0;
  Object.values(parsedMonthBuckets).forEach(function(arr) { bucketed += arr.length; });
  if (bucketed < parsedTransactions.length) {
    addLog((parsedTransactions.length - bucketed) + ' transaction(s) skipped (invalid date)', 'error');
  }

  setTimeout(function() {
    showMultiMonthPreview();
    goUploadStep(2);
  }, 800);
}

// ── Build review with month cards ──
function showMultiMonthPreview() {
  var preview = document.getElementById('upload-preview');
  var monthKeys = Object.keys(parsedMonthBuckets).sort();
  var totalTx = parsedTransactions.length;
  var existingMonths = loadMonths();

  var html = '';

  // Summary
  html += '<div style="margin-bottom:16px">';
  html += '<span class="preview-stat"><strong>' + uploadFiles.length + '</strong> file(s) processed</span>';
  html += '<span class="preview-stat"><strong>' + totalTx + '</strong> transactions</span>';
  html += '<span class="preview-stat"><strong>' + monthKeys.length + '</strong> month(s)</span>';
  html += '</div>';

  // Source type input with info guide
  var detectedBank = (parsedTransactions[0] && parsedTransactions[0].bank) || '';
  var bankDefaults = {chase:'Chase Credit Card', bofa:'Bank of America', capital_one:'Capital One Credit Card', citi:'Citi Credit Card', wells_fargo:'Wells Fargo'};
  var defaultSource = bankDefaults[detectedBank] || '';
  html += '<div class="source-type-group">';
  html += '<label style="font-size:13px;font-weight:600;white-space:nowrap">Transaction Source</label>';
  html += '<input type="text" class="source-type-input" id="upload-source-type" placeholder="e.g. Chase Sapphire, BOA Checking" value="' + defaultSource + '">';
  html += '<span class="source-info-icon">&#9432;<span class="source-info-tip">Name the bank account or card these transactions came from. This helps you identify the source later when viewing transactions.<br><br><strong>Examples:</strong> Chase Sapphire, Wells Fargo Checking, BOA Debit Card, Capital One Quicksilver</span></span>';
  html += '</div>';

  // Month selection heading
  if (monthKeys.length > 1) {
    html += '<div style="margin-bottom:8px;font-size:12px;color:var(--text-muted)">Select which months to import:</div>';
  }

  // Month cards
  html += '<div class="month-bucket-grid">';
  monthKeys.forEach(function(mk) {
    var txns = parsedMonthBuckets[mk];
    var mkCtx = buildMonthContext(mk);
    var total = txns.reduce(function(s, t) { return s + t.amount; }, 0);
    var credits = txns.filter(function(t) { return t.amount < 0; });
    var creditTotal = credits.reduce(function(s, t) { return s + t.amount; }, 0);
    var dates = txns.map(function(t) { return t.date; }).filter(function(d) { return d; }).sort();
    var dateRange = dates.length ? dates[0] + ' to ' + dates[dates.length - 1] : '';
    var hasExisting = existingMonths.indexOf(mk) !== -1;

    html += '<div class="month-bucket-card" id="bucket-card-' + mk + '">';
    html += '<div class="month-bucket-header">';
    html += '<label class="month-bucket-select"><input type="checkbox" id="select-' + mk + '" checked onchange="toggleMonthSelect(\'' + mk + '\')"> <span class="month-bucket-name">' + mkCtx.monthName + ' ' + mkCtx.year + '</span></label>';
    html += '<span class="month-bucket-count">' + txns.length + ' txns</span>';
    html += '</div>';
    html += '<div class="month-bucket-total">' + fmt(total) + '</div>';
    if (credits.length > 0) {
      html += '<div style="font-size:12px;color:var(--green);margin-top:2px">' + credits.length + ' credit' + (credits.length > 1 ? 's' : '') + ': ' + fmt(creditTotal) + '</div>';
    }
    html += '<div class="month-bucket-dates">' + dateRange + '</div>';

    if (hasExisting) {
      var existingCount = loadData(mk).length;
      html += '<div class="month-bucket-conflict" id="conflict-' + mk + '">';
      html += '<div class="month-bucket-conflict-label">&#9888; ' + existingCount + ' existing transactions</div>';
      html += '<label class="month-bucket-radio"><input type="radio" name="merge-' + mk + '" value="replace" checked> Replace existing</label>';
      html += '<label class="month-bucket-radio"><input type="radio" name="merge-' + mk + '" value="merge"> Merge (add new)</label>';
      html += '</div>';
    }

    html += '</div>';
  });
  html += '</div>';

  // Validation warnings
  var vWarnings = [];
  var vNoCat = parsedTransactions.filter(function(t){ return !t.category || t.category === 'Uncategorized' || t.category === 'Other'; }).length;
  var vZero = parsedTransactions.filter(function(t){ return !t.amount || t.amount === 0; }).length;
  var vDups = 0;
  var seenKeys = {};
  parsedTransactions.forEach(function(t){ var k = (t.date||'') + '|' + (t.merchant||'') + '|' + (t.amount||0).toFixed(2); if (seenKeys[k]) vDups++; seenKeys[k] = true; });
  if (vNoCat) vWarnings.push('<span style="color:#f59e0b">&#9888; ' + vNoCat + ' transaction' + (vNoCat>1?'s':'') + ' will be "Uncategorized"</span>');
  if (vZero) vWarnings.push('<span style="color:#f59e0b">&#9888; ' + vZero + ' transaction' + (vZero>1?'s':'') + ' with $0 amount</span>');
  if (vDups) vWarnings.push('<span style="color:#f97316">&#9888; ' + vDups + ' possible duplicate' + (vDups>1?'s':'') + '</span>');
  if (vWarnings.length) {
    html += '<div style="display:flex;flex-wrap:wrap;gap:6px;margin:12px 0">';
    vWarnings.forEach(function(w){ html += '<span style="font-size:11px;padding:4px 10px;border-radius:6px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.2)">' + w + '</span>'; });
    html += '</div>';
  }

  // Sample transactions
  var allSorted = parsedTransactions.slice().sort(function(a, b) { return a.date.localeCompare(b.date); });
  html += '<div style="margin-top:16px"><span style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px">Sample Transactions</span>';
  html += '<div class="preview-table"><table><thead><tr><th>Date</th><th>Merchant</th><th>Category</th><th>Amount</th></tr></thead><tbody>';
  allSorted.slice(0, 5).forEach(function(t) {
    var amtStyle = t.amount < 0 ? ' style="color:var(--green)"' : '';
    html += '<tr><td>' + t.date + '</td><td>' + t.merchant + '</td><td>' + t.category + '</td><td class="amt"' + amtStyle + '>' + fmt(t.amount) + '</td></tr>';
  });
  if (parsedTransactions.length > 5) {
    html += '<tr><td colspan="4" style="color:var(--text-muted);text-align:center">... and ' + (parsedTransactions.length - 5) + ' more</td></tr>';
  }
  html += '</tbody></table></div>';

  // Expandable full transaction list
  if (parsedTransactions.length > 5) {
    html += '<div style="margin-top:8px;text-align:center"><button onclick="toggleExpFullList()" id="exp-preview-toggle" style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.25);color:var(--blue,#3b82f6);border-radius:8px;padding:8px 16px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit">View all ' + parsedTransactions.length + ' transactions</button></div>';
    html += '<div id="exp-full-preview" style="display:none;max-height:300px;overflow-y:auto;margin-top:8px"><table style="width:100%;font-size:11px"><thead><tr><th>Date</th><th>Merchant</th><th>Category</th><th>Amount</th></tr></thead><tbody>';
    allSorted.forEach(function(t) {
      var amtStyle = t.amount < 0 ? ' style="color:var(--green)"' : '';
      var rowWarn = (!t.category || t.category === 'Uncategorized' || t.category === 'Other' || !t.amount) ? ' style="background:rgba(245,158,11,0.06)"' : '';
      html += '<tr' + rowWarn + '><td>' + t.date + '</td><td>' + t.merchant + '</td><td>' + t.category + '</td><td class="amt"' + amtStyle + '>' + fmt(t.amount) + '</td></tr>';
    });
    html += '</tbody></table></div>';
  }

  // Top categories
  var cats = {};
  parsedTransactions.forEach(function(t) { cats[t.category] = (cats[t.category] || 0) + t.amount; });
  var topCats = Object.entries(cats).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 5);
  var totalAmt = parsedTransactions.reduce(function(s, t) { return s + t.amount; }, 0);
  html += '<div style="margin-top:12px"><span style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px">Top Categories</span>';
  topCats.forEach(function(entry) {
    var cat = entry[0], amt = entry[1];
    var pct = ((amt / totalAmt) * 100).toFixed(1);
    html += '<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:13px"><span style="color:' + getCatColor(cat) + '">' + cat + '</span><span class="amt">' + fmt(amt) + ' (' + pct + '%)</span></div>';
  });
  html += '</div>';

  preview.innerHTML = html;
  updateImportButton();
}

// Toggle month selection and update card visual state
function toggleExpFullList() {
  var el = document.getElementById('exp-full-preview');
  var btn = document.getElementById('exp-preview-toggle');
  if (!el) return;
  if (el.style.display === 'none') {
    el.style.display = '';
    if (btn) btn.textContent = 'Hide full list';
  } else {
    el.style.display = 'none';
    if (btn) btn.textContent = 'View all transactions';
  }
}

function toggleMonthSelect(mk) {
  var cb = document.getElementById('select-' + mk);
  var card = document.getElementById('bucket-card-' + mk);
  var conflict = document.getElementById('conflict-' + mk);
  if (!cb || !card) return;
  if (cb.checked) {
    card.classList.remove('month-bucket-deselected');
    if (conflict) conflict.style.display = '';
  } else {
    card.classList.add('month-bucket-deselected');
    if (conflict) conflict.style.display = 'none';
  }
  updateImportButton();
}

// Update import button text and enabled state based on selection
function updateImportButton() {
  var btn = document.querySelector('#upload-step-2 .modal-btn-save');
  if (!btn) return;
  var monthKeys = Object.keys(parsedMonthBuckets);
  var total = monthKeys.length;
  var selected = monthKeys.filter(function(mk) {
    var cb = document.getElementById('select-' + mk);
    return cb && cb.checked;
  }).length;
  if (selected === 0) {
    btn.textContent = 'No months selected';
    btn.disabled = true;
    btn.style.opacity = '0.4';
    btn.style.cursor = 'not-allowed';
  } else if (selected === total) {
    btn.textContent = 'Import All (' + total + ' month' + (total !== 1 ? 's' : '') + ')';
    btn.disabled = false;
    btn.style.opacity = '';
    btn.style.cursor = '';
  } else {
    btn.textContent = 'Import ' + selected + ' of ' + total + ' months';
    btn.disabled = false;
    btn.style.opacity = '';
    btn.style.cursor = '';
  }
}

// ── Deduplication key for merge ──
function txKey(t) { return t.date + '|' + t.merchant + '|' + t.amount.toFixed(2); }

// ── Import selected month buckets ──
function confirmMultiImport() {
  var allKeys = Object.keys(parsedMonthBuckets);
  // Only import months the user has checked
  var selectedKeys = allKeys.filter(function(mk) {
    var cb = document.getElementById('select-' + mk);
    return cb && cb.checked;
  });
  if (selectedKeys.length === 0) return;

  // Stamp source type on all transactions
  var sourceTypeVal = (document.getElementById('upload-source-type') || {}).value || '';
  sourceTypeVal = sourceTypeVal.trim();

  var months = loadMonths();
  var importedCount = 0;

  selectedKeys.forEach(function(mk) {
    var newTxns = parsedMonthBuckets[mk];
    newTxns.forEach(function(t) { t.sourceType = sourceTypeVal; });
    if (!newTxns || newTxns.length === 0) return;

    var mergeRadio = document.querySelector('input[name="merge-' + mk + '"]:checked');
    var mode = mergeRadio ? mergeRadio.value : 'replace';

    if (mode === 'merge' && months.indexOf(mk) !== -1) {
      var existing = loadData(mk);
      var existingKeys = {};
      existing.forEach(function(t) { existingKeys[txKey(t)] = true; });
      var unique = newTxns.filter(function(t) { return !existingKeys[txKey(t)]; });
      saveData(mk, existing.concat(unique));
      importedCount += unique.length;
    } else {
      saveData(mk, newTxns);
      importedCount += newTxns.length;
    }

    if (months.indexOf(mk) === -1) {
      months.push(mk);
    }
  });

  saveMonths(months);
  closeUploadModal();

  // Switch to most recent imported month
  var sorted = selectedKeys.sort();
  switchMonth(sorted[sorted.length - 1]);

  showToast('Imported ' + importedCount + ' transactions across ' + selectedKeys.length + ' month(s)', 'success');
}

// ══════════════════════════════════════════════════════════
// DATA MANAGER
// ══════════════════════════════════════════════════════════
function openDataManager() {
  if (_isDemo) { showDemoUpgradePrompt("Create an account to manage your own expense data."); return; }
  const months = loadMonths();
  const mc = document.getElementById('manager-content');
  if (months.length === 0) {
    mc.innerHTML = '<p style="color:var(--text-muted);font-size:13px">No expense data loaded yet. Use "Upload Statement" to get started.</p>';
  } else {
    let html = '';
    const active = localStorage.getItem("expenses_activeMonth") || "";
    months.sort().reverse().forEach(mk => {
      const c = buildMonthContext(mk);
      const data = loadData(mk);
      const size = (new Blob([JSON.stringify(data)]).size / 1024).toFixed(1);
      const isActive = mk === active;
      html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--card-border)">';
      html += '<div><span style="font-weight:700">' + c.monthName + ' ' + c.year + '</span>';
      if (isActive) html += ' <span style="font-size:11px;color:var(--blue);background:rgba(59,130,246,0.12);padding:2px 8px;border-radius:4px;margin-left:8px">Active</span>';
      html += '<br><span style="font-size:12px;color:var(--text-muted)">' + data.length + ' transactions \u2022 ' + size + ' KB</span></div>';
      html += '<button class="modal-btn modal-btn-reset" onclick="deleteMonth(\'' + mk + '\')" style="padding:6px 12px;font-size:12px">Delete</button>';
      html += '</div>';
    });
    // Storage usage
    let totalSize = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('expenses_')) totalSize += localStorage.getItem(k).length;
    }
    html += '<div style="margin-top:16px;font-size:12px;color:var(--text-muted)">Total storage: ' + (totalSize / 1024).toFixed(1) + ' KB of ~5,000 KB</div>';
    mc.innerHTML = html;
  }
  document.getElementById('manager-modal').classList.add('open');
}
function closeDataManager() { document.getElementById('manager-modal').classList.remove('open'); }

function deleteMonth(mk) {
  if (_isDemo) { showDemoUpgradePrompt("Create an account to manage your own expense data."); return; }
  // Snapshot before deleting
  var dataSnap = localStorage.getItem('expenses_data_' + mk);
  var editsSnap = localStorage.getItem('expenses_edits_' + mk);
  var monthsSnap = JSON.stringify(loadMonths());
  var label = mk.replace('_', ' ');

  localStorage.removeItem('expenses_data_' + mk);
  localStorage.removeItem('expenses_edits_' + mk);
  let months = loadMonths().filter(m => m !== mk);
  saveMonths(months);
  if (localStorage.getItem('expenses_activeMonth') === mk) {
    if (months.length > 0) switchMonth(months.sort().reverse()[0]);
    else { activeData = []; ctx = {}; recomputeAll(); destroyAllCharts(); updateSubtitle(); renderAll(); }
  }
  openDataManager();

  pushUndo(label + ' deleted', function() {
    if (dataSnap) localStorage.setItem('expenses_data_' + mk, dataSnap);
    if (editsSnap) localStorage.setItem('expenses_edits_' + mk, editsSnap);
    saveMonths(JSON.parse(monthsSnap));
    switchMonth(mk);
    if (typeof syncToCloud === 'function') syncToCloud();
  });
}

// ══════════════════════════════════════════════════════════
// DOWNLOAD / LOAD DATA
// ══════════════════════════════════════════════════════════
function downloadAllData() {
  if (_isDemo) { showDemoUpgradePrompt("Sign up to download your expense data."); return; }
  const keys = {};
  const months = localStorage.getItem("expenses_months");
  if (months) keys["expenses_months"] = months;
  const active = localStorage.getItem("expenses_activeMonth");
  if (active) keys["expenses_activeMonth"] = active;
  const rules = localStorage.getItem("expenses_categoryRules");
  if (rules) keys["expenses_categoryRules"] = rules;
  const allMonths = JSON.parse(months || '[]');
  allMonths.forEach(mk => {
    const d = localStorage.getItem("expenses_data_" + mk);
    if (d) keys["expenses_data_" + mk] = d;
    const e = localStorage.getItem("expenses_edits_" + mk);
    if (e) keys["expenses_edits_" + mk] = e;
  });
  const blob = new Blob([JSON.stringify({ version: 1, type: "expenses", exported: new Date().toISOString(), keys }, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "expenses_backup_" + new Date().toISOString().slice(0, 10) + ".json";
  a.click();
  URL.revokeObjectURL(a.href);
}

function loadDataFile(event) {
  if (_isDemo) { showDemoUpgradePrompt("Sign up to load your own data."); return; }
  const file = event.target.files[0];
  if (!file) return;
  event.target.value = "";
  const reader = new FileReader();
  reader.onload = function() {
    try {
      const data = JSON.parse(reader.result);
      if (!data.keys || data.type !== "expenses") { showToast("Invalid expenses backup file.", "error"); return; }
      const hasExisting = loadMonths().length > 0;
      if (hasExisting) {
        if (!confirm("This will overwrite your existing expense data on this device. Continue?")) return;
      }
      Object.entries(data.keys).forEach(([k, v]) => localStorage.setItem(k, v));
      showToast("Data loaded successfully! Reloading...", "success"); setTimeout(function(){ location.reload(); }, 1500);
    } catch(e) {
      showToast("Error reading file: " + e.message, "error");
    }
  };
  reader.readAsText(file);
}

// ══════════════════════════════════════════════════════════
// EDIT MODAL
// ══════════════════════════════════════════════════════════
function openEditModal(id) {
  const tx = activeData.find(t => t.id === id);
  if (!tx) return;
  editingId = id;
  document.getElementById('edit-desc').textContent = tx.description + ' \u2022 ' + tx.date + ' \u2022 ' + fmt(tx.amount);
  // Populate category dropdown
  const sel = document.getElementById('edit-category');
  const allCats = [...new Set([...CATEGORY_LIST, ...catGroups.map(g => g.name)])];
  sel.innerHTML = allCats.map(c => '<option value="' + c + '"' + (c === tx.category ? ' selected' : '') + '>' + c + '</option>').join('');
  sel.innerHTML += '<option value="__new__">+ New Category...</option>';
  document.getElementById('edit-orig-cat').textContent = 'Original: ' + tx._origCategory;
  document.getElementById('edit-merchant').value = tx.merchant;
  document.getElementById('edit-orig-merchant').textContent = 'Raw: ' + tx.description;
  document.getElementById('edit-apply-all').checked = false;
  document.getElementById('edit-remember').checked = false;
  document.getElementById('edit-modal').classList.add('open');
}
function closeEditModal() { document.getElementById('edit-modal').classList.remove('open'); editingId = null; }

function saveEdit() {
  if (!editingId || !ctx.monthKey) return;
  let newCat = document.getElementById('edit-category').value;
  if (newCat === '__new__') {
    newCat = prompt('Enter new category name:');
    if (!newCat) return;
  }
  const newMerchant = document.getElementById('edit-merchant').value.trim();
  const applyAll = document.getElementById('edit-apply-all').checked;
  const remember = document.getElementById('edit-remember').checked;

  const tx = activeData.find(t => t.id === editingId);
  if (!tx) return;
  const edits = loadEdits(ctx.monthKey);

  if (applyAll) {
    // Apply to all transactions from this merchant
    activeData.forEach(t => {
      if (t.merchant === tx.merchant || t.merchant === newMerchant) {
        t.category = newCat; t._manualCategory = true;
        if (newMerchant && newMerchant !== t.merchant) t.merchant = newMerchant;
        edits[t.id] = { category: newCat, merchant: newMerchant || t.merchant };
      }
    });
  } else {
    tx.category = newCat; tx._manualCategory = true;
    if (newMerchant) tx.merchant = newMerchant;
    edits[editingId] = { category: newCat, merchant: newMerchant || tx.merchant };
  }
  saveEdits(ctx.monthKey, edits);

  if (remember) {
    const rules = loadCategoryRules();
    rules[tx.merchant.toLowerCase()] = newCat;
    if (newMerchant) rules[newMerchant.toLowerCase()] = newCat;
    saveCategoryRules(rules);
  }

  recomputeAll();
  destroyAllCharts();
  renderAll();
  closeEditModal();
}

// ══════════════════════════════════════════════════════════
// HELP MODAL
// ══════════════════════════════════════════════════════════
function openHelpModal() { document.getElementById('help-modal').classList.add('open'); }
function closeHelpModal() { document.getElementById('help-modal').classList.remove('open'); }

// ══════════════════════════════════════════════════════════
// ADD EXPENSE MODAL
// ══════════════════════════════════════════════════════════
function openAddModal() {
  if (!ctx || !ctx.monthKey) { showToast('Please select a month first.', 'warning'); return; }
  // Set default date to first day of current month
  var defaultDate = ctx.year + '-' + String(ctx.month).padStart(2, '0') + '-01';
  document.getElementById('add-date').value = defaultDate;
  document.getElementById('add-merchant').value = '';
  document.getElementById('add-amount').value = '';
  document.getElementById('add-source-type').value = '';
  // Populate category dropdown
  var sel = document.getElementById('add-category');
  var allCats = [...new Set([...CATEGORY_LIST, ...catGroups.map(g => g.name)])];
  sel.innerHTML = allCats.map(c => '<option value="' + c + '">' + c + '</option>').join('');
  sel.innerHTML += '<option value="__new__">+ New Category...</option>';
  document.getElementById('add-modal').classList.add('open');
}
function closeAddModal() { document.getElementById('add-modal').classList.remove('open'); }

function saveAddExpense() {
  var dateVal = document.getElementById('add-date').value;
  var merchantVal = document.getElementById('add-merchant').value.trim();
  var catVal = document.getElementById('add-category').value;
  var amountVal = parseFloat(document.getElementById('add-amount').value);
  var sourceTypeVal = document.getElementById('add-source-type').value.trim();

  if (!dateVal) { showToast('Please enter a date.', 'warning'); return; }
  if (!merchantVal) { showToast('Please enter a merchant or description.', 'warning'); return; }
  if (isNaN(amountVal) || amountVal <= 0) { showToast('Please enter a valid amount.', 'warning'); return; }

  if (catVal === '__new__') {
    catVal = prompt('Enter new category name:');
    if (!catVal) return;
  }

  var resolved = resolveMerchant(merchantVal);
  var tx = {
    id: uuid(), date: dateVal, description: merchantVal,
    merchant: resolved.merchant, category: catVal, amount: amountVal,
    source: 'manual', sourceType: sourceTypeVal, bank: 'manual',
    _origCategory: catVal, _manualCategory: true
  };

  activeData.push(tx);
  saveData(ctx.monthKey, activeData);
  recomputeAll();
  destroyAllCharts();
  renderAll();
  closeAddModal();
  showToast('Expense added successfully!', 'success');
}

function deleteTx(id) {
  var tx = activeData.find(function(t){ return t.id === id; });
  var edits = loadEdits(ctx.monthKey);
  var editSnap = edits[id] ? JSON.parse(JSON.stringify(edits[id])) : null;
  var mkSnap = ctx.monthKey;

  activeData = activeData.filter(function(t){ return t.id !== id; });
  delete edits[id];
  saveData(ctx.monthKey, activeData);
  saveEdits(ctx.monthKey, edits);
  recomputeAll();
  destroyAllCharts();
  renderAll();

  if (tx) {
    pushUndo('Transaction deleted', function() {
      activeData.push(tx);
      if (editSnap) {
        var e = loadEdits(mkSnap);
        e[id] = editSnap;
        saveEdits(mkSnap, e);
      }
      saveData(mkSnap, activeData);
      recomputeAll();
      destroyAllCharts();
      renderAll();
    });
  }
}

function resetEdit() {
  if (!editingId || !ctx.monthKey) return;
  const tx = activeData.find(t => t.id === editingId);
  if (!tx) return;
  tx.category = tx._origCategory;
  tx._manualCategory = false;
  const edits = loadEdits(ctx.monthKey);
  delete edits[editingId];
  saveEdits(ctx.monthKey, edits);
  recomputeAll();
  destroyAllCharts();
  renderAll();
  closeEditModal();
}

// ══════════════════════════════════════════════════════════
// CHART HELPER
// ══════════════════════════════════════════════════════════
function makeChartClickable(chart, canvas, labels, filterKey) {
  canvas.style.cursor = 'pointer';
  canvas.onclick = e => {
    const pts = chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, false);
    if (pts.length) {
      const label = labels[pts[0].index];
      showView('transactions', { [filterKey]: label });
    }
  };
}

// ══════════════════════════════════════════════════════════
// RENDER: OVERVIEW
// ══════════════════════════════════════════════════════════
function renderOverview() {
  const el = document.getElementById('view-overview');
  if (activeData.length === 0) {
    el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128200;</div><div class="empty-state-title">No Expense Data Yet</div><div class="empty-state-text">Upload a bank statement (CSV, PDF, or Excel) to start tracking your expenses. You can download CSV files from most bank websites under "Transactions" or "Activity".</div><button class="empty-state-btn" onclick="openUploadModal()">Upload Your First Statement</button></div>';
    return;
  }

  const topCat = catGroups.length ? catGroups[0] : { name: '-', total: 0 };
  const topMerch = merchantGroups.length ? merchantGroups[0] : { name: '-', total: 0 };
  const uniqueMerchants = merchantGroups.length;

  let html = '<div class="kpi-grid">';
  html += '<div class="kpi-card" onclick="showView(\'transactions\')"><div class="kpi-label">Total Expenses</div><div class="kpi-value amt">' + fmt(totalExpenses) + '</div><div class="kpi-sub">' + txCount + ' transactions</div></div>';
  html += '<div class="kpi-card" onclick="showView(\'transactions\')"><div class="kpi-label">Avg / Transaction</div><div class="kpi-value">' + fmt(avgPerTx) + '</div><div class="kpi-sub">' + txCount + ' total</div></div>';
  html += '<div class="kpi-card" onclick="showView(\'categories\')"><div class="kpi-label">Top Category</div><div class="kpi-value" style="font-size:18px;color:' + getCatColor(topCat.name) + '">' + topCat.name + '</div><div class="kpi-sub">' + fmt(topCat.total) + '</div></div>';
  html += '<div class="kpi-card" onclick="showView(\'merchants\')"><div class="kpi-label">Top Merchant</div><div class="kpi-value" style="font-size:18px">' + topMerch.name + '</div><div class="kpi-sub">' + fmt(topMerch.total) + '</div></div>';
  html += '<div class="kpi-card" onclick="showView(\'merchants\')"><div class="kpi-label">Unique Merchants</div><div class="kpi-value">' + uniqueMerchants + '</div><div class="kpi-sub">' + catGroups.length + ' categories</div></div>';
  html += '</div>';

  // Charts row
  html += '<div class="grid-2">';
  html += '<div class="card"><div class="card-title">Spending by Category</div><div class="chart-wrap"><canvas id="chart-cat-pie"></canvas></div></div>';
  html += '<div class="card"><div class="card-title">Top 10 Merchants</div><div class="chart-wrap-tall"><canvas id="chart-merchant-bar"></canvas></div></div>';
  html += '</div>';

  // Daily chart
  html += '<div class="card"><div class="card-title">Daily Spending</div><div class="chart-wrap"><canvas id="chart-daily-overview"></canvas></div></div>';

  // Smart Insights
  html += '<div class="card"><div class="card-title">Smart Insights</div><div class="grid-2" style="margin-top:8px">';

  // 1. Spending concentration
  if (catGroups.length >= 2) {
    const top3Cats = catGroups.slice(0, 3);
    const top3Total = top3Cats.reduce((s, g) => s + g.total, 0);
    const top3Pct = ((top3Total / totalExpenses) * 100).toFixed(0);
    html += '<div class="insight" onclick="showView(\'categories\')"><div class="insight-title">Spending Concentration</div><div class="insight-text">Top 3 categories account for <span class="insight-val">' + top3Pct + '%</span> of spending: ' + top3Cats.map(c => c.name).join(', ') + '</div></div>';
  }

  // 2. Top category share
  if (catGroups.length) {
    const topCatPct = ((catGroups[0].total / totalExpenses) * 100).toFixed(1);
    html += '<div class="insight" onclick="showView(\'transactions\',{category:\'' + catGroups[0].name.replace(/'/g,"\\'") + '\'})"><div class="insight-title">Top Category</div><div class="insight-text"><span class="insight-val">' + catGroups[0].name + '</span> takes up ' + topCatPct + '% of total spending (' + fmt(catGroups[0].total) + ')</div></div>';
  }

  // 3. Biggest single expense
  const biggest = activeData.reduce((a, b) => a.amount > b.amount ? a : b, activeData[0]);
  html += '<div class="insight" onclick="showView(\'merchant-detail\',{merchant:\'' + biggest.merchant.replace(/'/g,"\\'") + '\',source:\'overview\'})"><div class="insight-title">Biggest Single Expense</div><div class="insight-text"><span class="insight-val">' + fmt(biggest.amount) + '</span> at ' + biggest.merchant + ' on ' + biggest.date + '</div></div>';

  // 4. Most frequent merchant
  const mostFreqMerch = merchantGroups.reduce((a, b) => a.count > b.count ? a : b, merchantGroups[0]);
  html += '<div class="insight" onclick="showView(\'merchant-detail\',{merchant:\'' + mostFreqMerch.name.replace(/'/g,"\\'") + '\',source:\'overview\'})"><div class="insight-title">Most Frequent Merchant</div><div class="insight-text"><span class="insight-val">' + mostFreqMerch.name + '</span> \u2014 ' + mostFreqMerch.count + ' transactions totaling ' + fmt(mostFreqMerch.total) + '</div></div>';

  // 5. Biggest shopping day
  if (ctx.daysInMonth) {
    const dailyTotals = {};
    activeData.forEach(t => { dailyTotals[t.date] = (dailyTotals[t.date] || 0) + t.amount; });
    const entries = Object.entries(dailyTotals);
    if (entries.length) {
      const topDay = entries.sort((a, b) => b[1] - a[1])[0];
      const topDayTxCount = activeData.filter(t => t.date === topDay[0]).length;
      html += '<div class="insight" onclick="showView(\'transactions\',{date:\'' + topDay[0] + '\'})"><div class="insight-title">Highest Spending Day</div><div class="insight-text"><span class="insight-val">' + topDay[0] + '</span> \u2014 ' + fmt(topDay[1]) + ' across ' + topDayTxCount + ' transactions</div></div>';
    }
  }

  // 6. Day-of-week pattern
  const dowNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const dowTotals = new Array(7).fill(0);
  activeData.forEach(t => { const d = new Date(t.date + 'T00:00:00'); if (!isNaN(d)) dowTotals[d.getDay()] += t.amount; });
  const topDowIdx = dowTotals.indexOf(Math.max(...dowTotals));
  html += '<div class="insight" onclick="showView(\'trends\')"><div class="insight-title">Spending Pattern</div><div class="insight-text">Most spending happens on <span class="insight-val">' + dowNames[topDowIdx] + 's</span> (' + fmt(dowTotals[topDowIdx]) + ' total this month)</div></div>';

  // 7. Average transaction size
  const medianAmounts = [...activeData].sort((a, b) => a.amount - b.amount);
  const median = medianAmounts.length % 2 === 0
    ? (medianAmounts[medianAmounts.length / 2 - 1].amount + medianAmounts[medianAmounts.length / 2].amount) / 2
    : medianAmounts[Math.floor(medianAmounts.length / 2)].amount;
  html += '<div class="insight" onclick="showView(\'transactions\')"><div class="insight-title">Transaction Size</div><div class="insight-text">Median: <span class="insight-val">' + fmt(median) + '</span> \u2022 Average: ' + fmt(avgPerTx) + ' across ' + txCount + ' transactions</div></div>';

  // 8. Merchant loyalty (top merchant share)
  if (merchantGroups.length) {
    const topMerchPct = ((merchantGroups[0].total / totalExpenses) * 100).toFixed(1);
    html += '<div class="insight" onclick="showView(\'merchant-detail\',{merchant:\'' + merchantGroups[0].name.replace(/'/g,"\\'") + '\',source:\'overview\'})"><div class="insight-title">Top Merchant Share</div><div class="insight-text"><span class="insight-val">' + merchantGroups[0].name + '</span> accounts for ' + topMerchPct + '% of total spending (' + merchantGroups[0].count + ' transactions)</div></div>';
  }

  // 9. Small vs large transactions
  const smallTx = activeData.filter(t => t.amount < 20);
  const largeTx = activeData.filter(t => t.amount >= 100);
  html += '<div class="insight" onclick="showView(\'transactions\')"><div class="insight-title">Transaction Breakdown</div><div class="insight-text"><span class="insight-val">' + smallTx.length + '</span> small (under $20) vs <span class="insight-val">' + largeTx.length + '</span> large ($100+) transactions</div></div>';

  html += '</div></div>';

  // Spending Streaks — separate card
  if (ctx.daysInMonth) {
    const streakDays = new Set();
    activeData.forEach(t => { const day = parseInt(t.date.substring(8, 10)); if (day >= 1 && day <= ctx.daysInMonth) streakDays.add(day); });
    let mxS = 0, cS = 0, mxN = 0, cN = 0, sStart = 0, bestSStart = 0, nStart = 0, bestNStart = 0;
    for (let d = 1; d <= ctx.daysInMonth; d++) {
      if (streakDays.has(d)) {
        cS++; if (cS === 1) sStart = d;
        if (cS > mxS) { mxS = cS; bestSStart = sStart; }
        if (cN > mxN) { mxN = cN; bestNStart = nStart; }
        cN = 0;
      } else {
        cN++; if (cN === 1) nStart = d;
        if (cN > mxN) { mxN = cN; bestNStart = nStart; }
        if (cS > mxS) { mxS = cS; bestSStart = sStart; }
        cS = 0;
      }
    }
    html += '<div class="card" style="cursor:pointer" onclick="showView(\'trends\')"><div class="card-title">Spending Streaks</div>';
    html += '<div class="grid-3" style="margin-top:8px">';
    html += '<div class="insight" style="cursor:pointer"><div class="insight-title">Longest Spend Streak</div><div class="insight-text"><span class="insight-val">' + mxS + ' day' + (mxS !== 1 ? 's' : '') + '</span> in a row' + (mxS > 0 ? ' (' + ctx.monthAbbr + ' ' + bestSStart + '\u2013' + (bestSStart + mxS - 1) + ')' : '') + '</div></div>';
    html += '<div class="insight" style="cursor:pointer"><div class="insight-title">Longest No-Spend Streak</div><div class="insight-text"><span class="insight-val">' + mxN + ' day' + (mxN !== 1 ? 's' : '') + '</span> without spending' + (mxN > 0 ? ' (' + ctx.monthAbbr + ' ' + bestNStart + '\u2013' + (bestNStart + mxN - 1) + ')' : '') + '</div></div>';
    html += '<div class="insight" style="cursor:pointer"><div class="insight-title">Active Spending Days</div><div class="insight-text"><span class="insight-val">' + streakDays.size + '/' + ctx.daysInMonth + '</span> days with expenses (' + ((streakDays.size / ctx.daysInMonth) * 100).toFixed(0) + '% of the month)</div></div>';
    html += '</div></div>';
  }

  // Recurring & Subscriptions (enhanced with tracking)
  const recurring = detectRecurring();
  const trackedRecurring = loadTrackedRecurring();
  // Check for missing or changed recurring expenses
  var recurringAlerts = [];
  Object.keys(trackedRecurring).forEach(function(key) {
    var tr = trackedRecurring[key];
    if (!tr.active) return;
    var found = activeData.find(function(t) { return t.merchant.toLowerCase() === key.toLowerCase(); });
    if (!found) {
      recurringAlerts.push({ type: 'missing', merchant: key, expected: tr.expected, category: tr.category });
    } else if (tr.expected > 0 && Math.abs(found.amount - tr.expected) > 0.50) {
      recurringAlerts.push({ type: 'changed', merchant: key, expected: tr.expected, actual: found.amount, category: tr.category });
    }
  });

  // Recurring KPI
  var trackedCount = Object.values(trackedRecurring).filter(function(r) { return r.active; }).length;
  var trackedTotal = Object.values(trackedRecurring).filter(function(r) { return r.active; }).reduce(function(s, r) { return s + (r.expected || 0); }, 0);

  if (recurring.length > 0 || recurringAlerts.length > 0) {
    html += '<div class="card"><div class="card-title" style="display:flex;justify-content:space-between;align-items:center">Recurring & Subscriptions';
    if (trackedCount > 0) html += '<span style="font-size:12px;font-weight:600;color:var(--blue)">' + trackedCount + ' tracked &bull; ' + fmt(trackedTotal) + '/mo</span>';
    html += '</div>';

    // Alerts for tracked recurring
    if (recurringAlerts.length > 0) {
      recurringAlerts.forEach(function(a) {
        if (a.type === 'missing') {
          html += '<div style="padding:10px 14px;margin-bottom:10px;border-radius:8px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);font-size:12px;display:flex;align-items:center;gap:8px">';
          html += '<span style="font-size:16px">&#9888;&#65039;</span>';
          html += '<div><span style="font-weight:700;color:var(--amber)">' + a.merchant + '</span> — expected ' + fmt(a.expected) + ', not found this month</div>';
          html += '</div>';
        } else if (a.type === 'changed') {
          var diff = a.actual - a.expected;
          var diffColor = diff > 0 ? 'var(--rose)' : 'var(--green)';
          html += '<div style="padding:10px 14px;margin-bottom:10px;border-radius:8px;background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.15);font-size:12px;display:flex;align-items:center;gap:8px">';
          html += '<span style="font-size:16px">&#8505;&#65039;</span>';
          html += '<div><span style="font-weight:700">' + a.merchant + '</span> — expected ' + fmt(a.expected) + ', charged <span style="color:' + diffColor + ';font-weight:700">' + fmt(a.actual) + '</span> (' + (diff > 0 ? '+' : '') + fmt(diff) + ')</div>';
          html += '</div>';
        }
      });
    }

    recurring.forEach(r => {
      const confColor = r.confidence === 'high' ? 'var(--green)' : r.confidence === 'medium' ? 'var(--amber)' : 'var(--text-muted)';
      const confBg = r.confidence === 'high' ? 'rgba(34,197,94,0.12)' : r.confidence === 'medium' ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.05)';
      const catColor = getCatColor(r.category);
      var mKey = r.merchant.toLowerCase();
      var isTracked = trackedRecurring[mKey] && trackedRecurring[mKey].active;
      var expectedAmt = trackedRecurring[mKey] ? trackedRecurring[mKey].expected : r.avgAmount;
      // Check if paid this month
      var paidThisMonth = activeData.find(function(t) { return t.merchant === r.merchant; });
      var statusBadge = '';
      if (isTracked) {
        statusBadge = paidThisMonth
          ? '<span class="tag" style="background:rgba(34,197,94,0.12);color:var(--green)">&#10003; Paid</span>'
          : '<span class="tag" style="background:rgba(245,158,11,0.12);color:var(--amber)">&#9888; Missing</span>';
      }

      html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.04);gap:8px">';
      html += '<div style="flex:1;min-width:0;cursor:pointer" onclick="showView(\'merchant-detail\',{merchant:\'' + r.merchant.replace(/'/g,"\\'") + '\',source:\'overview\'})">';
      html += '<div style="font-weight:600;font-size:14px;margin-bottom:3px">' + r.merchant + '</div>';
      html += '<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center">';
      html += '<span class="tag" style="background:' + catColor + '22;color:' + catColor + '">' + r.category + '</span>';
      html += '<span style="font-size:11px;color:var(--text-muted)">' + r.frequency + '</span>';
      html += statusBadge;
      html += '</div></div>';
      html += '<div style="display:flex;align-items:center;gap:8px;flex-shrink:0">';
      html += '<div style="font-size:16px;font-weight:700;color:var(--amber);white-space:nowrap">' + fmt(r.avgAmount) + '</div>';
      // Track toggle
      var toggleChecked = isTracked ? ' checked' : '';
      html += '<label style="position:relative;display:inline-block;width:36px;height:20px;flex-shrink:0" title="Track as recurring">';
      html += '<input type="checkbox"' + toggleChecked + ' onchange="toggleRecurringTrack(\'' + r.merchant.replace(/'/g,"\\'") + '\',' + r.avgAmount.toFixed(2) + ',\'' + r.category.replace(/'/g,"\\'") + '\',this.checked)" style="opacity:0;width:0;height:0">';
      html += '<span style="position:absolute;cursor:pointer;inset:0;background:' + (isTracked ? 'var(--blue,#3b82f6)' : 'rgba(113,113,122,0.3)') + ';border-radius:20px;transition:background .2s"></span>';
      html += '<span style="position:absolute;left:' + (isTracked ? '18px' : '2px') + ';top:2px;width:16px;height:16px;background:#fff;border-radius:50%;transition:left .2s"></span>';
      html += '</label>';
      html += '</div></div>';
    });
    html += '</div>';
  }

  // Anomaly Detection
  try {
  const anomalies = detectAnomalies();
  if (anomalies.length > 0) {
    html += '<div class="card"><div class="card-title" style="color:var(--rose)">Unusual Transactions</div>';
    html += '<div style="font-size:12px;color:var(--text-muted);margin:-8px 0 14px">Transactions with amounts significantly above their average</div>';
    anomalies.forEach(a => {
      let description = '';
      let suggestions = '';
      const suggStart = '<div style="margin-top:10px;padding:10px 14px;background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.15);border-radius:8px"><div style="font-size:11px;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Suggestions</div><div style="font-size:12px;color:var(--text-muted);line-height:1.7">';
      const suggEnd = '</div></div>';
      if (a.type === 'merchant') {
        const overpay = a.amount - a.avg;
        const txCount = activeData.filter(t => t.merchant === a.merchant).length;
        description = 'A charge of <span style="color:var(--amber);font-weight:600">' + fmt(a.amount) + '</span> at <span style="font-weight:600">' + a.merchant + '</span> is <span style="color:var(--rose);font-weight:600">' + fmt(overpay) + ' more</span> than your usual average of ' + fmt(a.avg) + ' across ' + txCount + ' transactions. This is ' + a.ratio + 'x your typical spend at this merchant.';
        suggestions = suggStart;
        suggestions += '\u2022 Verify this charge is legitimate and not a billing error or duplicate<br>';
        suggestions += '\u2022 Check if this was a one-time purchase (annual renewal, bulk buy) vs. a recurring increase<br>';
        suggestions += '\u2022 If this merchant is a subscription, confirm you weren\'t upgraded to a higher tier<br>';
        suggestions += '\u2022 Click to view full transaction history for this merchant';
        suggestions += suggEnd;
      } else {
        const catMatch = catGroups.find(c => c.name === (a.transaction ? a.transaction.category : ''));
        const pctOfCat = catMatch ? ((a.amount / catMatch.total) * 100).toFixed(0) : '?';
        const catName = a.transaction ? a.transaction.category : 'this category';
        description = 'A single transaction of <span style="color:var(--amber);font-weight:600">' + fmt(a.amount) + '</span> at <span style="font-weight:600">' + a.merchant + '</span> makes up <span style="color:var(--rose);font-weight:600">' + pctOfCat + '%</span> of all ' + catName + ' spending. This is ' + a.ratio + 'x the category average of ' + fmt(a.avg) + ', heavily skewing your ' + catName + ' budget.';
        suggestions = suggStart;
        suggestions += '\u2022 Consider if this belongs in a different category \u2014 click to edit if miscategorized<br>';
        suggestions += '\u2022 If this is an annual or infrequent expense, note it won\'t repeat monthly<br>';
        suggestions += '\u2022 Review whether this category needs a higher budget allocation<br>';
        suggestions += '\u2022 Click to view all transactions at this merchant';
        suggestions += suggEnd;
      }
      html += '<div class="insight" style="border-color:rgba(244,63,94,0.2);background:rgba(244,63,94,0.04);cursor:pointer" onclick="showView(\'merchant-detail\',{merchant:\'' + a.merchant.replace(/'/g,"\\'") + '\',source:\'overview\'})">';
      html += '<div class="insight-title" style="color:var(--rose)">' + a.merchant + '</div>';
      html += '<div style="font-size:11px;color:var(--text-muted);margin-bottom:6px">' + a.ratio + 'x above average \u2022 ' + fmt(a.amount) + '</div>';
      html += '<div class="insight-text" style="margin-bottom:6px">' + description + '</div>';
      html += suggestions;
      html += '</div>';
    });
    html += '</div>';
  }
  } catch(e) { console.error('Anomaly detection error:', e); }

  el.innerHTML = html;
  animateKPICards('.kpi-grid');

  // Category pie
  const catPieLabels = catGroups.slice(0, 10).map(g => g.name);
  const catPieData = catGroups.slice(0, 10).map(g => g.total);
  const catPieColors = catPieLabels.map(c => getCatColor(c));
  const catPieCanvas = document.getElementById('chart-cat-pie');
  charts.catPie = new Chart(catPieCanvas, {
    type: 'doughnut',
    data: { labels: catPieLabels, datasets: [{ data: catPieData, backgroundColor: catPieColors, borderWidth: 0 }] },
    options: withChartAnimation({ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#e4e4e7', font: { size: 11 }, padding: 8 } } } })
  });
  makeChartClickable(charts.catPie, catPieCanvas, catPieLabels, 'category');

  // Top merchants bar
  const top10 = merchantGroups.slice(0, 10);
  const merchCanvas = document.getElementById('chart-merchant-bar');
  charts.merchBar = new Chart(merchCanvas, {
    type: 'bar',
    data: {
      labels: top10.map(m => m.name),
      datasets: [{ data: top10.map(m => m.total), backgroundColor: 'rgba(59,130,246,0.6)', borderRadius: 4 }]
    },
    options: withChartAnimation({
      responsive: true, maintainAspectRatio: false, indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#71717a', callback: v => '$' + v.toLocaleString() } },
        y: { grid: { display: false }, ticks: { color: '#e4e4e7', font: { size: 11 } } }
      }
    })
  });
  makeChartClickable(charts.merchBar, merchCanvas, top10.map(m => m.name), 'merchant');

  // Daily spending
  if (ctx.daysInMonth) {
    const dailyData = new Array(ctx.daysInMonth).fill(0);
    activeData.forEach(t => {
      const day = parseInt(t.date.substring(8, 10));
      if (day >= 1 && day <= ctx.daysInMonth) dailyData[day - 1] += t.amount;
    });
    const dailyLabels = Array.from({ length: ctx.daysInMonth }, (_, i) => ctx.monthAbbr + ' ' + (i + 1));
    charts.dailyOverview = new Chart(document.getElementById('chart-daily-overview'), {
      type: 'bar',
      data: { labels: dailyLabels, datasets: [{ data: dailyData, backgroundColor: 'rgba(59,130,246,0.5)', borderRadius: 3 }] },
      options: withChartAnimation({
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#71717a', font: { size: 10 }, maxRotation: 45 } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#71717a', callback: v => '$' + v } }
        }
      })
    });
  }
}

// ══════════════════════════════════════════════════════════
// RENDER: BY CATEGORY
// ══════════════════════════════════════════════════════════
function renderCategories() {
  const el = document.getElementById('view-categories');
  if (activeData.length === 0) { el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128194;</div><div class="empty-state-title">No Data</div><div class="empty-state-text">Upload a statement to see category breakdowns.</div></div>'; return; }

  let html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px">';
  catGroups.forEach(g => {
    const pct = ((g.total / totalExpenses) * 100).toFixed(1);
    const avg = (g.total / g.count).toFixed(2);
    html += '<div class="cat-card" onclick="showView(\'category-detail\',{category:\'' + g.name.replace(/'/g,"\\'") + '\',source:\'categories\'})">';
    html += '<div class="cat-card-name" style="color:' + getCatColor(g.name) + '">' + g.name + '</div>';
    html += '<div class="cat-card-amount">' + fmt(g.total) + '</div>';
    html += '<div class="cat-card-meta">' + g.count + ' transactions \u2022 ' + pct + '% of total \u2022 avg ' + fmt(parseFloat(avg)) + '</div>';
    html += '<div class="cat-card-bar"><div class="cat-card-fill" style="width:' + pct + '%;background:' + getCatColor(g.name) + '"></div></div>';
    html += '</div>';
  });
  html += '</div>';
  el.innerHTML = html;
}

// ══════════════════════════════════════════════════════════
// RENDER: BY MERCHANT
// ══════════════════════════════════════════════════════════
function renderMerchants() {
  const el = document.getElementById('view-merchants');
  if (activeData.length === 0) { el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#127978;</div><div class="empty-state-title">No Data</div><div class="empty-state-text">Upload a statement to see merchant breakdowns.</div></div>'; return; }

  let html = '<div class="filter-bar"><input type="text" placeholder="Search merchants..." id="merchant-search" oninput="filterMerchantTable()"></div>';
  html += '<div class="card"><table id="merchant-table"><thead><tr>';
  html += '<th class="sortable' + (merchantSortCol === 'name' ? (merchantSortDir === 'asc' ? ' sort-asc' : ' sort-desc') : '') + '" onclick="sortMerchantTable(\'name\')">Merchant</th>';
  html += '<th class="sortable text-right' + (merchantSortCol === 'total' ? (merchantSortDir === 'asc' ? ' sort-asc' : ' sort-desc') : '') + '" onclick="sortMerchantTable(\'total\')">Total</th>';
  html += '<th class="sortable text-right' + (merchantSortCol === 'count' ? (merchantSortDir === 'asc' ? ' sort-asc' : ' sort-desc') : '') + '" onclick="sortMerchantTable(\'count\')">Transactions</th>';
  html += '<th class="sortable text-right' + (merchantSortCol === 'avg' ? (merchantSortDir === 'asc' ? ' sort-asc' : ' sort-desc') : '') + '" onclick="sortMerchantTable(\'avg\')">Avg</th>';
  html += '</tr></thead><tbody id="merchant-tbody"></tbody></table></div>';
  el.innerHTML = html;
  renderMerchantRows(merchantGroups);
}

function renderMerchantRows(data) {
  const tbody = document.getElementById('merchant-tbody');
  if (!tbody) return;
  tbody.innerHTML = data.map(m => {
    const avg = m.total / m.count;
    return '<tr style="cursor:pointer" onclick="showView(\'merchant-detail\',{merchant:\'' + m.name.replace(/'/g,"\\'") + '\',source:\'merchants\'})">' +
      '<td style="font-weight:600">' + m.name + '</td>' +
      '<td class="text-right amt">' + fmt(m.total) + '</td>' +
      '<td class="text-right">' + m.count + '</td>' +
      '<td class="text-right mono">' + fmt(avg) + '</td></tr>';
  }).join('');
}

let merchantSortCol = 'total', merchantSortDir = 'desc';
function sortMerchantTable(col) {
  if (merchantSortCol === col) merchantSortDir = merchantSortDir === 'asc' ? 'desc' : 'asc';
  else { merchantSortCol = col; merchantSortDir = col === 'name' ? 'asc' : 'desc'; }
  updateMerchantSortHeaders();
  const sorted = [...merchantGroups].sort((a, b) => {
    let va, vb;
    if (col === 'name') { va = a.name.toLowerCase(); vb = b.name.toLowerCase(); }
    else if (col === 'total') { va = a.total; vb = b.total; }
    else if (col === 'count') { va = a.count; vb = b.count; }
    else { va = a.total / a.count; vb = b.total / b.count; }
    return merchantSortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
  });
  renderMerchantRows(sorted);
}

function updateMerchantSortHeaders() {
  var table = document.getElementById('merchant-table');
  if (!table) return;
  table.querySelectorAll('thead th.sortable').forEach(function(th) {
    th.classList.remove('sort-asc', 'sort-desc');
  });
  var cols = ['name', 'total', 'count', 'avg'];
  var ths = table.querySelectorAll('thead th.sortable');
  cols.forEach(function(c, i) {
    if (c === merchantSortCol && ths[i]) {
      ths[i].classList.add(merchantSortDir === 'asc' ? 'sort-asc' : 'sort-desc');
    }
  });
}

function filterMerchantTable() {
  const q = (document.getElementById('merchant-search')?.value || '').toLowerCase();
  const filtered = merchantGroups.filter(m => m.name.toLowerCase().includes(q));
  renderMerchantRows(filtered);
}

// ══════════════════════════════════════════════════════════
// RENDER: TRENDS
// ══════════════════════════════════════════════════════════
function renderTrends() {
  const el = document.getElementById('view-trends');
  if (activeData.length === 0 || !ctx.daysInMonth) {
    el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128200;</div><div class="empty-state-title">No Data</div><div class="empty-state-text">Upload a statement to see spending trends.</div></div>';
    return;
  }

  let html = '<div class="grid-2">';
  html += '<div class="card"><div class="card-title">Daily Spending</div><div class="chart-wrap"><canvas id="chart-daily"></canvas></div></div>';
  html += '<div class="card"><div class="card-title">Cumulative Spending</div><div class="chart-wrap"><canvas id="chart-cumulative"></canvas></div></div>';
  html += '</div>';
  html += '<div class="grid-2">';
  html += '<div class="card"><div class="card-title">Weekly Category Breakdown</div><div class="chart-wrap-tall"><canvas id="chart-weekly-cat"></canvas></div></div>';
  html += '<div class="card"><div class="card-title">Spending by Day of Week</div><div class="chart-wrap"><canvas id="chart-dow"></canvas></div></div>';
  html += '</div>';
  el.innerHTML = html;

  const dailyData = new Array(ctx.daysInMonth).fill(0);
  activeData.forEach(t => {
    const day = parseInt(t.date.substring(8, 10));
    if (day >= 1 && day <= ctx.daysInMonth) dailyData[day - 1] += t.amount;
  });
  const labels = Array.from({ length: ctx.daysInMonth }, (_, i) => ctx.monthAbbr + ' ' + (i + 1));

  // Daily
  charts.daily = new Chart(document.getElementById('chart-daily'), {
    type: 'line',
    data: { labels, datasets: [{ data: dailyData, borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.3, pointRadius: 2 }] },
    options: withChartAnimation({ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false }, ticks: { color: '#71717a', font: { size: 10 }, maxTicksLimit: 10 } },
               y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#71717a', callback: v => '$' + v } } } })
  });

  // Cumulative
  const cumData = []; let cum = 0;
  dailyData.forEach(d => { cum += d; cumData.push(cum); });
  charts.cumulative = new Chart(document.getElementById('chart-cumulative'), {
    type: 'line',
    data: { labels, datasets: [{ data: cumData, borderColor: '#a855f7', backgroundColor: 'rgba(168,85,247,0.1)', fill: true, tension: 0.3, pointRadius: 0 }] },
    options: withChartAnimation({ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false }, ticks: { color: '#71717a', font: { size: 10 }, maxTicksLimit: 10 } },
               y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#71717a', callback: v => '$' + v.toLocaleString() } } } })
  });

  // Weekly category breakdown
  const topCats = catGroups.slice(0, 6).map(g => g.name);
  const weeklyDatasets = topCats.map(cat => {
    const data = ctx.weeks.map(w => {
      let total = 0;
      activeData.forEach(t => {
        if (t.category === cat) {
          const day = parseInt(t.date.substring(8, 10));
          if (day >= w.start && day <= w.end) total += t.amount;
        }
      });
      return total;
    });
    return { label: cat, data, backgroundColor: getCatColor(cat), borderRadius: 3 };
  });
  charts.weeklyCat = new Chart(document.getElementById('chart-weekly-cat'), {
    type: 'bar',
    data: { labels: ctx.weeks.map(w => w.label), datasets: weeklyDatasets },
    options: withChartAnimation({ responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#e4e4e7', font: { size: 10 } } } },
      scales: { x: { stacked: true, grid: { display: false }, ticks: { color: '#71717a' } },
               y: { stacked: true, grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#71717a', callback: v => '$' + v } } } })
  });

  // Day of week
  const dowLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dowData = new Array(7).fill(0);
  const dowCount = new Array(7).fill(0);
  activeData.forEach(t => {
    const d = new Date(t.date + 'T00:00:00');
    if (!isNaN(d)) { dowData[d.getDay()] += t.amount; dowCount[d.getDay()]++; }
  });
  charts.dow = new Chart(document.getElementById('chart-dow'), {
    type: 'bar',
    data: { labels: dowLabels, datasets: [{ data: dowData, backgroundColor: dowLabels.map((_, i) => i === 0 || i === 6 ? 'rgba(244,63,94,0.5)' : 'rgba(59,130,246,0.5)'), borderRadius: 6 }] },
    options: withChartAnimation({ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false },
      tooltip: { callbacks: { afterLabel: (ttCtx) => dowCount[ttCtx.dataIndex] + ' transactions' } } },
      scales: { x: { grid: { display: false }, ticks: { color: '#e4e4e7' } },
               y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#71717a', callback: v => '$' + v } } } })
  });

  // ── Spending Streaks ──
  const daysWithSpend = new Set();
  activeData.forEach(t => { const day = parseInt(t.date.substring(8, 10)); if (day >= 1 && day <= ctx.daysInMonth) daysWithSpend.add(day); });
  let maxSpend = 0, curSpend = 0, maxNoSpend = 0, curNoSpend = 0;
  for (let d = 1; d <= ctx.daysInMonth; d++) {
    if (daysWithSpend.has(d)) { curSpend++; curNoSpend = 0; } else { curNoSpend++; curSpend = 0; }
    if (curSpend > maxSpend) maxSpend = curSpend;
    if (curNoSpend > maxNoSpend) maxNoSpend = curNoSpend;
  }
  const streakEl = document.getElementById('view-trends');
  let streakHtml = '<div class="grid-2" style="margin-top:20px">';
  streakHtml += '<div class="card"><div class="card-title">Spending Streaks</div>';
  streakHtml += '<div class="kpi-grid" style="margin-top:12px">';
  streakHtml += '<div class="kpi-card" style="cursor:default"><div class="kpi-label">Longest Spend Streak</div><div class="kpi-value" style="color:var(--rose)">' + maxSpend + ' days</div><div class="kpi-sub">Consecutive days with expenses</div></div>';
  streakHtml += '<div class="kpi-card" style="cursor:default"><div class="kpi-label">Longest No-Spend Streak</div><div class="kpi-value" style="color:var(--green)">' + maxNoSpend + ' days</div><div class="kpi-sub">Consecutive days with no expenses</div></div>';
  streakHtml += '<div class="kpi-card" style="cursor:default"><div class="kpi-label">Active Spending Days</div><div class="kpi-value">' + daysWithSpend.size + '/' + ctx.daysInMonth + '</div><div class="kpi-sub">' + ((daysWithSpend.size / ctx.daysInMonth) * 100).toFixed(0) + '% of the month</div></div>';
  streakHtml += '</div></div>';

  // Calendar heatmap
  streakHtml += '<div class="card"><div class="card-title">Spending Calendar</div>';
  const maxDaily = Math.max(...dailyData);
  const firstDow = new Date(ctx.year, ctx.month - 1, 1).getDay();
  streakHtml += '<div class="heatmap-grid" style="margin-top:12px">';
  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => { streakHtml += '<div class="heatmap-label">' + d + '</div>'; });
  for (let i = 0; i < firstDow; i++) streakHtml += '<div></div>';
  for (let d = 1; d <= ctx.daysInMonth; d++) {
    const val = dailyData[d - 1];
    const intensity = maxDaily > 0 ? val / maxDaily : 0;
    let bg, color;
    if (val === 0) { bg = 'rgba(255,255,255,0.03)'; color = 'var(--text-muted)'; }
    else if (intensity < 0.25) { bg = 'rgba(59,130,246,0.15)'; color = '#93c5fd'; }
    else if (intensity < 0.5) { bg = 'rgba(59,130,246,0.3)'; color = '#60a5fa'; }
    else if (intensity < 0.75) { bg = 'rgba(59,130,246,0.5)'; color = '#3b82f6'; }
    else { bg = 'rgba(59,130,246,0.7)'; color = '#fff'; }
    var dateKey = ctx.year + '-' + String(ctx.month).padStart(2,'0') + '-' + String(d).padStart(2,'0');
    var clickAttr = val > 0 ? ' style="background:' + bg + ';color:' + color + ';cursor:pointer;transition:transform 0.15s" onclick="showView(\'transactions\',{date:\'' + dateKey + '\'})" onmouseover="this.style.transform=\'scale(1.1)\'" onmouseout="this.style.transform=\'scale(1)\'"' : ' style="background:' + bg + ';color:' + color + '"';
    streakHtml += '<div class="heatmap-cell"' + clickAttr + ' title="' + ctx.monthAbbr + ' ' + d + ': ' + fmt(val) + '">' + d + '</div>';
  }
  streakHtml += '</div>';
  streakHtml += '<div style="display:flex;align-items:center;gap:8px;margin-top:12px;justify-content:center">';
  streakHtml += '<span style="font-size:11px;color:var(--text-muted)">Less</span>';
  ['rgba(255,255,255,0.03)','rgba(59,130,246,0.15)','rgba(59,130,246,0.3)','rgba(59,130,246,0.5)','rgba(59,130,246,0.7)'].forEach(c => {
    streakHtml += '<div style="width:16px;height:16px;border-radius:4px;background:' + c + '"></div>';
  });
  streakHtml += '<span style="font-size:11px;color:var(--text-muted)">More</span>';
  streakHtml += '</div></div>';
  streakHtml += '</div>';
  streakEl.insertAdjacentHTML('beforeend', streakHtml);
}

// ══════════════════════════════════════════════════════════
// RENDER: ALL TRANSACTIONS
// ══════════════════════════════════════════════════════════
let txFilterCat = 'All', txFilterMerchant = '', txFilterDate = 'All';
let txSortCol = 'date', txSortDir = 'asc';
let txPerPage = 100, txCurrentPage = 1;

function renderTransactions() {
  const el = document.getElementById('view-transactions');
  if (activeData.length === 0) {
    el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128203;</div><div class="empty-state-title">No Transactions</div><div class="empty-state-text">Upload a statement or <a href="#" onclick="event.preventDefault();openAddModal()" style="color:var(--blue)">add an expense manually</a>.</div></div>';
    return;
  }

  // Build filter bar
  let html = '<div class="filter-bar" style="display:flex;flex-wrap:wrap;align-items:center;gap:8px">';
  html += '<button class="btn-add-expense" onclick="openAddModal()">+ Add Expense</button>';
  html += '<select id="tx-filter-date"><option value="All">All Dates</option>';
  const dates = [...new Set(activeData.map(t => t.date))].sort();
  dates.forEach(d => { html += '<option value="' + d + '">' + d + '</option>'; });
  html += '</select>';
  html += '<select id="tx-filter-cat"><option value="All">All Categories</option>';
  catGroups.forEach(g => { html += '<option value="' + g.name + '">' + g.name + '</option>'; });
  html += '</select>';
  html += '<input type="text" placeholder="Search merchant..." id="tx-filter-merchant">';
  html += '<button class="btn-clear" onclick="clearTxFilters()">Clear</button>';
  html += '</div>';

  html += '<div style="display:flex;justify-content:flex-end;margin-bottom:8px"><button class="btn-select-mode" id="btn-select-mode" onclick="toggleSelectMode()">Select</button></div>';
  html += '<div class="card" style="overflow-x:auto"><table id="tx-table"><thead><tr>';
  html += '<th class="tx-check-col"><input type="checkbox" class="tx-check" onchange="toggleAllTx(this.checked)"></th>';
  html += '<th class="sortable' + (txSortCol === 'date' ? (txSortDir === 'asc' ? ' sort-asc' : ' sort-desc') : '') + '" onclick="sortTxTable(\'date\')">Date</th>';
  html += '<th class="sortable' + (txSortCol === 'merchant' ? (txSortDir === 'asc' ? ' sort-asc' : ' sort-desc') : '') + '" onclick="sortTxTable(\'merchant\')">Merchant</th>';
  html += '<th class="sortable' + (txSortCol === 'category' ? (txSortDir === 'asc' ? ' sort-asc' : ' sort-desc') : '') + '" onclick="sortTxTable(\'category\')">Category</th>';
  html += '<th class="sortable text-right' + (txSortCol === 'amount' ? (txSortDir === 'asc' ? ' sort-asc' : ' sort-desc') : '') + '" onclick="sortTxTable(\'amount\')">Amount</th>';
  html += '<th class="text-center">Source</th>';
  html += '<th class="text-center">Import</th>';
  html += '<th></th>';
  html += '</tr></thead><tbody id="tx-tbody"></tbody></table></div>';
  html += '<div id="tx-count" style="font-size:12px;color:var(--text-muted);margin-top:-12px;margin-bottom:20px"></div>';

  el.innerHTML = html;

  if (!filtersInitialized) {
    document.getElementById('tx-filter-date').addEventListener('change', () => { txFilterDate = document.getElementById('tx-filter-date').value; txCurrentPage = 1; renderTxRows(); });
    document.getElementById('tx-filter-cat').addEventListener('change', () => { txFilterCat = document.getElementById('tx-filter-cat').value; txCurrentPage = 1; renderTxRows(); });
    document.getElementById('tx-filter-merchant').addEventListener('input', () => { txFilterMerchant = document.getElementById('tx-filter-merchant').value; txCurrentPage = 1; renderTxRows(); });
    filtersInitialized = true;
  }
  renderTxRows();
}

function renderTxRows() {
  let filtered = [...activeData];
  if (txFilterDate !== 'All') filtered = filtered.filter(t => t.date === txFilterDate);
  if (txFilterCat !== 'All') filtered = filtered.filter(t => t.category === txFilterCat);
  if (txFilterMerchant) {
    const q = txFilterMerchant.toLowerCase();
    filtered = filtered.filter(t => t.merchant.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
  }
  // Sort
  filtered.sort((a, b) => {
    let va, vb;
    if (txSortCol === 'date') { va = a.date; vb = b.date; }
    else if (txSortCol === 'merchant') { va = a.merchant.toLowerCase(); vb = b.merchant.toLowerCase(); }
    else if (txSortCol === 'category') { va = a.category; vb = b.category; }
    else { va = a.amount; vb = b.amount; }
    return txSortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
  });
  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / txPerPage));
  if (txCurrentPage > totalPages) txCurrentPage = totalPages;
  const startIdx = (txCurrentPage - 1) * txPerPage;
  const pageData = filtered.slice(startIdx, startIdx + txPerPage);

  const tbody = document.getElementById('tx-tbody');
  if (!tbody) return;
  const edits = loadEdits(ctx.monthKey || '');
  tbody.innerHTML = pageData.map(t => {
    const edited = edits[t.id];
    const editDot = edited ? '<span class="edit-dot" title="Edited"></span>' : '';
    return '<tr><td class="tx-check-col"><input type="checkbox" class="tx-check" data-id="' + t.id + '" onchange="updateBulkBar()"></td>' +
      '<td class="mono">' + t.date + '</td>' +
      '<td style="font-weight:600">' + t.merchant + editDot + '</td>' +
      '<td><span class="tag" style="background:' + getCatColor(t.category) + '22;color:' + getCatColor(t.category) + '">' + t.category + '</span></td>' +
      '<td class="text-right amt"' + (t.amount < 0 ? ' style="color:var(--green)"' : '') + '>' + fmt(t.amount) + '</td>' +
      '<td class="text-center" style="font-size:12px">' + (t.sourceType || '\u2014') + '</td>' +
      '<td class="text-center"><span class="tag" style="background:rgba(255,255,255,0.05);color:var(--text-muted)">' + (t.source || '').toUpperCase() + '</span></td>' +
      '<td><span class="edit-icon" onclick="event.stopPropagation();openEditModal(\'' + t.id + '\')" title="Edit">&#9998;</span> <span class="delete-icon" onclick="event.stopPropagation();deleteTx(\'' + t.id + '\')" title="Delete">&#128465;</span></td></tr>';
  }).join('');
  const countEl = document.getElementById('tx-count');
  if (countEl) countEl.textContent = 'Showing ' + (startIdx+1) + '\u2013' + Math.min(startIdx+txPerPage,filtered.length) + ' of ' + filtered.length + ' transactions' + (filtered.length !== activeData.length ? ' (filtered from ' + activeData.length + ')' : '') + ' \u2022 Total: ' + fmt(filtered.reduce((s, t) => s + t.amount, 0));

  // Pagination controls
  let pgEl = document.getElementById('tx-pagination');
  if (!pgEl) {
    pgEl = document.createElement('div');
    pgEl.id = 'tx-pagination';
    pgEl.className = 'pagination-bar';
    const tableCard = document.getElementById('tx-table').closest('.card');
    if (tableCard) tableCard.after(pgEl);
  }
  if (filtered.length <= 20) { pgEl.innerHTML = ''; return; }
  let pgHtml = '<div class="page-size-wrap"><label>Show</label><select class="page-size-select" onchange="txPerPage=+this.value;txCurrentPage=1;renderTxRows()">';
  [20,50,100].forEach(function(n) { pgHtml += '<option value="'+n+'"'+(txPerPage===n?' selected':'')+'>'+n+'</option>'; });
  pgHtml += '</select><label>per page</label></div>';
  pgHtml += '<div class="page-info">Page '+txCurrentPage+' of '+totalPages+'</div>';
  pgHtml += '<div class="page-btns">';
  pgHtml += '<button class="page-btn" onclick="txCurrentPage=1;renderTxRows()"'+(txCurrentPage<=1?' disabled':'')+'>&#171;</button>';
  pgHtml += '<button class="page-btn" onclick="txCurrentPage--;renderTxRows()"'+(txCurrentPage<=1?' disabled':'')+'>&#8249;</button>';
  for (var p = 1; p <= totalPages; p++) {
    if (totalPages <= 7 || Math.abs(p - txCurrentPage) <= 2 || p === 1 || p === totalPages) {
      pgHtml += '<button class="page-btn'+(p===txCurrentPage?' active':'')+'" onclick="txCurrentPage='+p+';renderTxRows()">'+p+'</button>';
    } else if (p === 2 && txCurrentPage > 4) { pgHtml += '<span style="padding:0 4px;color:var(--text-muted)">\u2026</span>'; }
    else if (p === totalPages - 1 && txCurrentPage < totalPages - 3) { pgHtml += '<span style="padding:0 4px;color:var(--text-muted)">\u2026</span>'; }
  }
  pgHtml += '<button class="page-btn" onclick="txCurrentPage++;renderTxRows()"'+(txCurrentPage>=totalPages?' disabled':'')+'>&#8250;</button>';
  pgHtml += '<button class="page-btn" onclick="txCurrentPage='+totalPages+';renderTxRows()"'+(txCurrentPage>=totalPages?' disabled':'')+'>&#187;</button>';
  pgHtml += '</div>';
  pgEl.innerHTML = pgHtml;
}

function sortTxTable(col) {
  if (txSortCol === col) txSortDir = txSortDir === 'asc' ? 'desc' : 'asc';
  else { txSortCol = col; txSortDir = col === 'amount' ? 'desc' : 'asc'; }
  txCurrentPage = 1;
  updateTxSortHeaders();
  renderTxRows();
}

function updateTxSortHeaders() {
  var table = document.getElementById('tx-table');
  if (!table) return;
  table.querySelectorAll('thead th.sortable').forEach(function(th) {
    th.classList.remove('sort-asc', 'sort-desc');
  });
  var cols = ['date', 'merchant', 'category', 'amount'];
  var ths = table.querySelectorAll('thead th.sortable');
  cols.forEach(function(c, i) {
    if (c === txSortCol && ths[i]) {
      ths[i].classList.add(txSortDir === 'asc' ? 'sort-asc' : 'sort-desc');
    }
  });
}

function clearTxFilters() {
  txFilterDate = 'All'; txFilterCat = 'All'; txFilterMerchant = '';
  const fd = document.getElementById('tx-filter-date'); if (fd) fd.value = 'All';
  const fc = document.getElementById('tx-filter-cat'); if (fc) fc.value = 'All';
  const fm = document.getElementById('tx-filter-merchant'); if (fm) fm.value = '';
  txCurrentPage = 1;
  renderTxRows();
}

function applyTransactionFilter(opts) {
  if (opts.category) {
    txFilterCat = opts.category;
    const fc = document.getElementById('tx-filter-cat');
    if (fc) fc.value = opts.category;
  }
  if (opts.merchant) {
    txFilterMerchant = opts.merchant;
    const fm = document.getElementById('tx-filter-merchant');
    if (fm) fm.value = opts.merchant;
  }
  if (opts.date) {
    txFilterDate = opts.date;
    const fd = document.getElementById('tx-filter-date');
    if (fd) fd.value = opts.date;
  }
  renderTxRows();
}

// ══════════════════════════════════════════════════════════
// RENDER: COMPARE
// ══════════════════════════════════════════════════════════
function renderCompare() {
  // Destroy previous compare charts before re-rendering
  ['compareTotals', 'compareCats'].forEach(k => { if (charts[k]) { charts[k].destroy(); delete charts[k]; } });
  const el = document.getElementById('view-compare');
  const months = loadMonths().sort();
  if (months.length < 2) {
    el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128202;</div><div class="empty-state-title">Need More Data</div><div class="empty-state-text">Upload at least 2 months of statements to compare spending over time.</div><button class="empty-state-btn" onclick="openUploadModal()">Upload Another Month</button></div>';
    return;
  }

  // Load all months' data
  const allMonths = months.map(mk => {
    const data = applyEdits(loadData(mk), mk);
    const c = buildMonthContext(mk);
    const total = data.reduce((s, t) => s + t.amount, 0);
    const cats = {};
    data.forEach(t => { cats[t.category] = (cats[t.category] || 0) + t.amount; });
    return { key: mk, ctx: c, data, total, count: data.length, cats };
  });

  // Current month — default to active month, but user can change via dropdown
  if (!window._expCompareCurrKey || !allMonths.find(m => m.key === window._expCompareCurrKey)) {
    window._expCompareCurrKey = ctx.monthKey;
  }
  const curr = allMonths.find(m => m.key === window._expCompareCurrKey) || allMonths[allMonths.length - 1];
  const otherMonths = allMonths.filter(m => m.key !== curr.key);
  const defaultPrev = otherMonths.reduce((best, m) => m.key < curr.key && (!best || m.key > best.key) ? m : best, null) || otherMonths[0];
  if (!window._expCompareAgainstKey || window._expCompareAgainstKey === curr.key || !otherMonths.find(m => m.key === window._expCompareAgainstKey)) {
    window._expCompareAgainstKey = defaultPrev.key;
  }
  const prev = allMonths.find(m => m.key === window._expCompareAgainstKey) || defaultPrev;

  const spendChange = curr.total - prev.total;
  const spendPct = prev.total ? ((spendChange / prev.total) * 100).toFixed(1) : 0;
  const countChange = curr.count - prev.count;
  const avgCurr = curr.count ? curr.total / curr.count : 0;
  const avgPrev = prev.count ? prev.total / prev.count : 0;
  const avgChange = avgCurr - avgPrev;

  // Dropdowns for both months
  var selectStyle = 'background:var(--card);border:1px solid var(--card-border);border-radius:8px;padding:8px 12px;color:var(--text);font-family:inherit;font-size:13px;cursor:pointer';
  let html = '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap">';
  html += '<select id="exp-compare-curr" onchange="window._expCompareCurrKey=this.value;if(window._expCompareAgainstKey===this.value){window._expCompareAgainstKey=null;}renderCompare()" style="' + selectStyle + '">';
  allMonths.forEach(m => {
    html += '<option value="' + m.key + '"' + (m.key === curr.key ? ' selected' : '') + '>' + m.ctx.monthName + ' ' + m.ctx.year + '</option>';
  });
  html += '</select>';
  html += '<span style="font-size:13px;color:var(--text-muted)">compared to</span>';
  html += '<select id="exp-compare-against" onchange="window._expCompareAgainstKey=this.value;renderCompare()" style="' + selectStyle + '">';
  otherMonths.forEach(m => {
    html += '<option value="' + m.key + '"' + (m.key === prev.key ? ' selected' : '') + '>' + m.ctx.monthName + ' ' + m.ctx.year + '</option>';
  });
  html += '</select></div>';

  var currLabel = curr.ctx.monthAbbr + ' ' + curr.ctx.year;
  var prevLabel = prev.ctx.monthAbbr + ' ' + prev.ctx.year;
  html += '<div class="delta-grid">';
  var vsSpan = ' <span style="color:var(--text-muted)">vs</span> <span style="color:var(--cyan)">' + prevLabel + '</span>';
  html += '<div class="delta-card"><div class="kpi-label">Total Spend</div><div style="font-size:11px;color:var(--blue);margin-bottom:4px">' + currLabel + '</div><div class="delta-value amt">' + fmt(curr.total) + '</div><div class="delta-change ' + (spendChange > 0 ? 'delta-up' : 'delta-down') + '">' + (spendChange > 0 ? '+' : '') + fmt(spendChange) + ' (' + (spendChange > 0 ? '+' : '') + spendPct + '%)' + vsSpan + '</div></div>';
  html += '<div class="delta-card"><div class="kpi-label">Transactions</div><div style="font-size:11px;color:var(--blue);margin-bottom:4px">' + currLabel + '</div><div class="delta-value">' + curr.count + '</div><div class="delta-change ' + (countChange > 0 ? 'delta-up' : 'delta-down') + '">' + (countChange > 0 ? '+' : '') + countChange + vsSpan + '</div></div>';
  html += '<div class="delta-card"><div class="kpi-label">Avg / Transaction</div><div style="font-size:11px;color:var(--blue);margin-bottom:4px">' + currLabel + '</div><div class="delta-value">' + fmt(avgCurr) + '</div><div class="delta-change ' + (avgChange > 0 ? 'delta-up' : 'delta-down') + '">' + (avgChange > 0 ? '+' : '') + fmt(avgChange) + vsSpan + '</div></div>';
  html += '</div>';

  html += '<div class="grid-2">';
  html += '<div class="card"><div class="card-title">Monthly Totals</div><div class="chart-wrap"><canvas id="chart-compare-totals"></canvas></div></div>';
  html += '<div class="card"><div class="card-title">Category Comparison</div><div class="chart-wrap-tall"><canvas id="chart-compare-cats"></canvas></div></div>';
  html += '</div>';

  // Top movers
  const allCatNames = [...new Set(allMonths.flatMap(m => Object.keys(m.cats)))];
  const movers = allCatNames.map(cat => {
    const currAmt = curr.cats[cat] || 0;
    const prevAmt = prev.cats[cat] || 0;
    return { name: cat, change: currAmt - prevAmt, curr: currAmt, prev: prevAmt };
  }).filter(m => m.change !== 0).sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 6);

  if (movers.length) {
    html += '<div class="card"><div class="card-title">Top Movers vs ' + prev.ctx.monthName + '</div>';
    movers.forEach(m => {
      const dir = m.change > 0 ? 'delta-up' : 'delta-down';
      html += '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.03)">';
      html += '<span style="font-weight:600;color:' + getCatColor(m.name) + '">' + m.name + '</span>';
      html += '<span class="' + dir + '" style="font-weight:700">' + (m.change > 0 ? '+' : '') + fmt(m.change) + '</span>';
      html += '</div>';
    });
    html += '</div>';
  }

  el.innerHTML = html;

  // Monthly totals line chart
  charts.compareTotals = new Chart(document.getElementById('chart-compare-totals'), {
    type: 'line',
    data: {
      labels: allMonths.map(m => m.ctx.monthAbbr + ' ' + m.ctx.year),
      datasets: [{ label: 'Total', data: allMonths.map(m => m.total), borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.3, pointRadius: 5, pointBackgroundColor: '#3b82f6' }]
    },
    options: withChartAnimation({ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false }, ticks: { color: '#e4e4e7' } },
               y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#71717a', callback: v => '$' + v.toLocaleString() } } } })
  });

  // Category grouped bar
  const compareCats = allCatNames.sort().slice(0, 10);
  const datasets = allMonths.slice(-3).map((m, i) => ({
    label: m.ctx.monthAbbr + ' ' + m.ctx.year,
    data: compareCats.map(cat => m.cats[cat] || 0),
    backgroundColor: ['rgba(59,130,246,0.6)', 'rgba(168,85,247,0.6)', 'rgba(34,197,94,0.6)'][i % 3],
    borderRadius: 3
  }));
  charts.compareCats = new Chart(document.getElementById('chart-compare-cats'), {
    type: 'bar',
    data: { labels: compareCats, datasets },
    options: withChartAnimation({ responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#e4e4e7', font: { size: 11 } } } },
      scales: { x: { grid: { display: false }, ticks: { color: '#e4e4e7', font: { size: 10 }, maxRotation: 45 } },
               y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#71717a', callback: v => '$' + v } } } })
  });
}

// ══════════════════════════════════════════════════════════
// GLOBAL SEARCH
// ══════════════════════════════════════════════════════════
let searchTimeout = null;
function onGlobalSearch(query) {
  clearTimeout(searchTimeout);
  const wrap = document.getElementById('global-search-results');
  if (!query || query.length < 2 || activeData.length === 0) { wrap.style.display = 'none'; return; }
  searchTimeout = setTimeout(() => {
    const q = query.toLowerCase();
    let html = '';

    // Search merchants
    const matchedMerchants = merchantGroups.filter(m => m.name.toLowerCase().includes(q)).slice(0, 5);
    if (matchedMerchants.length) {
      html += '<div class="search-group-header">Merchants</div>';
      matchedMerchants.forEach(m => {
        const highlighted = m.name.replace(new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ')', 'gi'), '<mark>$1</mark>');
        html += '<div class="search-result" onclick="closeSearch();showView(\'merchant-detail\',{merchant:\'' + m.name.replace(/'/g,"\\'") + '\',source:\'search\'})">';
        html += '<div><div class="search-result-name">' + highlighted + '</div>';
        html += '<div class="search-result-meta">' + m.count + ' transactions</div></div>';
        html += '<div class="search-result-amount">' + fmt(m.total) + '</div></div>';
      });
    }

    // Search categories
    const matchedCats = catGroups.filter(c => c.name.toLowerCase().includes(q)).slice(0, 5);
    if (matchedCats.length) {
      html += '<div class="search-group-header">Categories</div>';
      matchedCats.forEach(c => {
        const highlighted = c.name.replace(new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ')', 'gi'), '<mark>$1</mark>');
        html += '<div class="search-result" onclick="closeSearch();showView(\'transactions\',{category:\'' + c.name.replace(/'/g,"\\'") + '\'})">';
        html += '<div><div class="search-result-name">' + highlighted + '</div>';
        html += '<div class="search-result-meta">' + c.count + ' transactions</div></div>';
        html += '<div class="search-result-amount">' + fmt(c.total) + '</div></div>';
      });
    }

    // Search individual transactions by description
    const matchedTx = activeData.filter(t => t.description.toLowerCase().includes(q) || t.merchant.toLowerCase().includes(q)).slice(0, 5);
    if (matchedTx.length && !matchedMerchants.length) {
      html += '<div class="search-group-header">Transactions</div>';
      matchedTx.forEach(t => {
        const name = t.merchant || t.description;
        const highlighted = name.replace(new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ')', 'gi'), '<mark>$1</mark>');
        html += '<div class="search-result" onclick="closeSearch();showView(\'transactions\',{merchant:\'' + t.merchant.replace(/'/g,"\\'") + '\'})">';
        html += '<div><div class="search-result-name">' + highlighted + '</div>';
        html += '<div class="search-result-meta">' + t.date + ' \u2022 ' + t.category + '</div></div>';
        html += '<div class="search-result-amount">' + fmt(t.amount) + '</div></div>';
      });
    }

    if (!html) html = '<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:13px">No results for "' + query + '"</div>';
    wrap.innerHTML = html;
    wrap.style.display = 'block';
  }, 200);
}

function closeSearch() {
  document.getElementById('global-search-results').style.display = 'none';
  document.getElementById('global-search').value = '';
}

document.addEventListener('click', e => {
  const wrap = document.getElementById('global-search-wrap');
  if (wrap && !wrap.contains(e.target)) {
    document.getElementById('global-search-results').style.display = 'none';
  }
});

// ══════════════════════════════════════════════════════════
// THEME TOGGLE
// ══════════════════════════════════════════════════════════
function toggleTheme() {
  const isLight = document.body.classList.toggle('light');
  if (_isDemo) sessionStorage.setItem('demo_app_theme', isLight ? 'light' : 'dark');
  else localStorage.setItem('app_theme', isLight ? 'light' : 'dark');
  document.getElementById('theme-toggle').innerHTML = isLight ? '&#9788;' : '&#9790;';
}

// ══════════════════════════════════════════════════════════
// DETAIL PAGINATION HELPER
// ══════════════════════════════════════════════════════════
let _detailTxs = [];
let _detailPage = 1;
let _detailPerPage = 50;
let _detailType = 'merchant'; // 'merchant' or 'category'

function renderDetailTxPage() {
  var tbody = document.getElementById('detail-tx-tbody');
  if (!tbody) return;
  var total = _detailTxs.length;
  var totalPages = Math.max(1, Math.ceil(total / _detailPerPage));
  if (_detailPage > totalPages) _detailPage = totalPages;
  var start = (_detailPage - 1) * _detailPerPage;
  var page = _detailTxs.slice(start, start + _detailPerPage);

  tbody.innerHTML = page.map(function(t) {
    var row = _detailType === 'category'
      ? '<tr style="cursor:pointer" onclick="showView(\'merchant-detail\',{merchant:\'' + t.merchant.replace(/'/g,"\\'") + '\',source:\'categories\'})">'
        + '<td class="mono">' + t.date + '</td>'
        + '<td style="font-weight:600">' + t.merchant + '</td>'
        + '<td style="font-size:12px;color:var(--text-muted);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="' + (t.description || '').replace(/"/g,'&quot;') + '">' + (t.description || t.merchant) + '</td>'
        + '<td class="text-right amt"' + (t.amount < 0 ? ' style="color:var(--green)"' : '') + '>' + fmt(t.amount) + '</td>'
        + '<td class="text-center" style="font-size:12px">' + (t.sourceType || '\u2014') + '</td>'
        + '<td class="text-center"><span class="tag" style="background:rgba(255,255,255,0.05);color:var(--text-muted)">' + (t.source || '').toUpperCase() + '</span></td></tr>'
      : '<tr><td class="mono">' + t.date + '</td>'
        + '<td style="font-size:12px;color:var(--text-muted);max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="' + (t.description || '').replace(/"/g, '&quot;') + '">' + (t.description || t.merchant) + '</td>'
        + '<td><span class="tag" style="background:' + getCatColor(t.category) + '22;color:' + getCatColor(t.category) + '">' + t.category + '</span></td>'
        + '<td class="text-right amt"' + (t.amount < 0 ? ' style="color:var(--green)"' : '') + '>' + fmt(t.amount) + '</td>'
        + '<td class="text-center" style="font-size:12px">' + (t.sourceType || '\u2014') + '</td>'
        + '<td class="text-center"><span class="tag" style="background:rgba(255,255,255,0.05);color:var(--text-muted)">' + (t.source || '').toUpperCase() + '</span></td></tr>';
    return row;
  }).join('');

  var pgEl = document.getElementById('detail-tx-pagination');
  if (!pgEl) return;
  if (total <= 20) { pgEl.innerHTML = ''; return; }
  var h = '<div class="page-size-wrap"><label>Show</label><select class="page-size-select" onchange="_detailPerPage=+this.value;_detailPage=1;renderDetailTxPage()">';
  [20,50,100].forEach(function(n) { h += '<option value="'+n+'"'+(_detailPerPage===n?' selected':'')+'>'+n+'</option>'; });
  h += '</select><label>per page</label></div>';
  h += '<div class="page-info">'+( start+1)+'\u2013'+Math.min(start+_detailPerPage,total)+' of '+total+'</div>';
  h += '<div class="page-btns">';
  h += '<button class="page-btn" onclick="_detailPage=1;renderDetailTxPage()"'+(_detailPage<=1?' disabled':'')+'>&#171;</button>';
  h += '<button class="page-btn" onclick="_detailPage--;renderDetailTxPage()"'+(_detailPage<=1?' disabled':'')+'>&#8249;</button>';
  for (var p=1;p<=totalPages;p++){
    if(totalPages<=7||Math.abs(p-_detailPage)<=2||p===1||p===totalPages){
      h+='<button class="page-btn'+(p===_detailPage?' active':'')+'" onclick="_detailPage='+p+';renderDetailTxPage()">'+p+'</button>';
    } else if(p===2&&_detailPage>4){h+='<span style="padding:0 4px;color:var(--text-muted)">\u2026</span>';}
    else if(p===totalPages-1&&_detailPage<totalPages-3){h+='<span style="padding:0 4px;color:var(--text-muted)">\u2026</span>';}
  }
  h += '<button class="page-btn" onclick="_detailPage++;renderDetailTxPage()"'+(_detailPage>=totalPages?' disabled':'')+'>&#8250;</button>';
  h += '<button class="page-btn" onclick="_detailPage='+totalPages+';renderDetailTxPage()"'+(_detailPage>=totalPages?' disabled':'')+'>&#187;</button>';
  h += '</div>';
  pgEl.innerHTML = h;
}

// ══════════════════════════════════════════════════════════
// MERCHANT DETAIL VIEW
// ══════════════════════════════════════════════════════════
function showMerchantDetail(merchantName, source) {
  source = source || 'merchants';
  const container = document.getElementById('merchant-detail-content');
  const backBtn = document.getElementById('merchant-detail-back');

  // Hide all views and show merchant detail
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-merchant-detail').classList.add('active');
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

  // Back button
  const backMap = { merchants: 'merchants', overview: 'overview', search: 'overview', transactions: 'transactions' };
  const backView = backMap[source] || 'merchants';
  backBtn.onclick = () => showView(backView);

  // Get transactions for this merchant
  const txs = activeData.filter(t => t.merchant === merchantName).sort((a, b) => a.date < b.date ? -1 : 1);
  if (txs.length === 0) { container.innerHTML = '<div class="empty-state"><div class="empty-state-title">No transactions found</div></div>'; return; }

  const total = txs.reduce((s, t) => s + t.amount, 0);
  const avg = total / txs.length;
  const minTx = txs.reduce((a, b) => a.amount < b.amount ? a : b);
  const maxTx = txs.reduce((a, b) => a.amount > b.amount ? a : b);
  const categories = [...new Set(txs.map(t => t.category))];
  const dateRange = txs[0].date + ' \u2014 ' + txs[txs.length - 1].date;

  let html = '';

  // Header card
  html += '<div class="card" style="border-left:4px solid var(--blue)">';
  html += '<div style="font-size:22px;font-weight:700;margin-bottom:4px">' + merchantName + '</div>';
  html += '<div style="font-size:13px;color:var(--text-muted)">' + categories.join(', ') + ' \u2022 ' + dateRange + '</div>';
  html += '</div>';

  // KPI cards
  html += '<div class="kpi-grid">';
  html += '<div class="kpi-card" style="cursor:default"><div class="kpi-label">Total Spent</div><div class="kpi-value amt">' + fmt(total) + '</div><div class="kpi-sub">' + txs.length + ' transactions</div></div>';
  html += '<div class="kpi-card" style="cursor:default"><div class="kpi-label">Average</div><div class="kpi-value">' + fmt(avg) + '</div><div class="kpi-sub">per transaction</div></div>';
  html += '<div class="kpi-card" style="cursor:default"><div class="kpi-label">Range</div><div class="kpi-value">' + fmt(minTx.amount) + ' \u2014 ' + fmt(maxTx.amount) + '</div><div class="kpi-sub">min \u2014 max</div></div>';
  html += '</div>';

  // Price tracker (if multiple transactions)
  if (txs.length > 1) {
    html += '<div class="card"><div class="card-title">Amount Tracker</div>';
    html += '<table><thead><tr><th>Date</th><th>Category</th><th class="text-right">Amount</th><th class="text-right">Change</th></tr></thead><tbody>';
    txs.forEach((t, i) => {
      let changeHtml = '<span style="color:var(--text-muted)">\u2014</span>';
      if (i > 0) {
        const diff = t.amount - txs[i - 1].amount;
        const pct = txs[i - 1].amount ? ((diff / txs[i - 1].amount) * 100).toFixed(1) : 0;
        if (diff > 0) changeHtml = '<span style="color:var(--rose)">\u25B2 +' + fmt(diff) + ' (+' + pct + '%)</span>';
        else if (diff < 0) changeHtml = '<span style="color:var(--green)">\u25BC ' + fmt(diff) + ' (' + pct + '%)</span>';
        else changeHtml = '<span style="color:var(--text-muted)">\u2014 no change</span>';
      }
      html += '<tr><td class="mono">' + t.date + '</td>';
      html += '<td><span class="tag" style="background:' + getCatColor(t.category) + '22;color:' + getCatColor(t.category) + '">' + t.category + '</span></td>';
      html += '<td class="text-right amt"' + (t.amount < 0 ? ' style="color:var(--green)"' : '') + '>' + fmt(t.amount) + '</td>';
      html += '<td class="text-right" style="font-size:12px">' + changeHtml + '</td></tr>';
    });
    html += '</tbody></table></div>';
  }

  // All transactions (paginated)
  html += '<div class="card"><div class="card-title">All Transactions (' + txs.length + ')</div>';
  html += '<table><thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="text-right">Amount</th><th>Source</th><th>Import</th></tr></thead><tbody id="detail-tx-tbody"></tbody></table>';
  html += '<div id="detail-tx-pagination" class="pagination-bar"></div></div>';

  container.innerHTML = html;
  _detailTxs = txs; _detailPage = 1; _detailType = 'merchant';
  renderDetailTxPage();
}

// ══════════════════════════════════════════════════════════
// CATEGORY DETAIL VIEW
// ══════════════════════════════════════════════════════════
function showCategoryDetail(categoryName, source) {
  source = source || 'categories';
  const container = document.getElementById('category-detail-content');
  const backBtn = document.getElementById('category-detail-back');

  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-category-detail').classList.add('active');
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

  const backMap = { categories: 'categories', overview: 'overview' };
  backBtn.onclick = () => showView(backMap[source] || 'categories');

  const txs = activeData.filter(t => t.category === categoryName).sort((a, b) => a.date < b.date ? -1 : 1);
  if (txs.length === 0) { container.innerHTML = '<div class="empty-state"><div class="empty-state-title">No transactions found</div></div>'; return; }

  const total = txs.reduce((s, t) => s + t.amount, 0);
  const avg = total / txs.length;
  const pctOfTotal = ((total / totalExpenses) * 100).toFixed(1);
  const merchants = {};
  txs.forEach(t => {
    if (!merchants[t.merchant]) merchants[t.merchant] = { name: t.merchant, total: 0, count: 0 };
    merchants[t.merchant].total += t.amount;
    merchants[t.merchant].count++;
  });
  const merchList = Object.values(merchants).sort((a, b) => b.total - a.total);
  const dateRange = txs[0].date + ' \u2014 ' + txs[txs.length - 1].date;
  const catColor = getCatColor(categoryName);

  let html = '';

  // Header
  html += '<div class="card" style="border-left:4px solid ' + catColor + '">';
  html += '<div style="font-size:22px;font-weight:700;margin-bottom:4px;color:' + catColor + '">' + categoryName + '</div>';
  html += '<div style="font-size:13px;color:var(--text-muted)">' + merchList.length + ' merchants \u2022 ' + dateRange + '</div>';
  html += '</div>';

  // KPIs
  html += '<div class="kpi-grid">';
  html += '<div class="kpi-card" style="cursor:default"><div class="kpi-label">Total Spent</div><div class="kpi-value amt">' + fmt(total) + '</div><div class="kpi-sub">' + pctOfTotal + '% of all expenses</div></div>';
  html += '<div class="kpi-card" style="cursor:default"><div class="kpi-label">Transactions</div><div class="kpi-value">' + txs.length + '</div><div class="kpi-sub">avg ' + fmt(avg) + ' each</div></div>';
  html += '<div class="kpi-card" style="cursor:default"><div class="kpi-label">Top Merchant</div><div class="kpi-value" style="font-size:18px">' + merchList[0].name + '</div><div class="kpi-sub">' + fmt(merchList[0].total) + ' (' + merchList[0].count + ' transactions)</div></div>';
  html += '</div>';

  // Top merchants in this category
  html += '<div class="card"><div class="card-title">Merchants in ' + categoryName + '</div>';
  html += '<table><thead><tr><th>Merchant</th><th class="text-right">Total</th><th class="text-right">Count</th><th class="text-right">Avg</th><th class="text-right">Share</th></tr></thead><tbody>';
  merchList.forEach(m => {
    const mPct = ((m.total / total) * 100).toFixed(1);
    html += '<tr style="cursor:pointer" onclick="showView(\'merchant-detail\',{merchant:\'' + m.name.replace(/'/g,"\\'") + '\',source:\'categories\'})">';
    html += '<td style="font-weight:600">' + m.name + '</td>';
    html += '<td class="text-right amt">' + fmt(m.total) + '</td>';
    html += '<td class="text-right">' + m.count + '</td>';
    html += '<td class="text-right mono">' + fmt(m.total / m.count) + '</td>';
    html += '<td class="text-right">' + mPct + '%</td></tr>';
  });
  html += '</tbody></table></div>';

  // Spending trend within month
  if (ctx.daysInMonth) {
    html += '<div class="card"><div class="card-title">Daily Spending in ' + categoryName + '</div><div class="chart-wrap"><canvas id="chart-cat-detail-daily"></canvas></div></div>';
  }

  // All transactions (paginated)
  html += '<div class="card"><div class="card-title">All Transactions (' + txs.length + ')</div>';
  html += '<table><thead><tr><th>Date</th><th>Merchant</th><th>Description</th><th class="text-right">Amount</th><th>Source</th><th>Import</th></tr></thead><tbody id="detail-tx-tbody"></tbody></table>';
  html += '<div id="detail-tx-pagination" class="pagination-bar"></div></div>';

  container.innerHTML = html;
  _detailTxs = txs; _detailPage = 1; _detailType = 'category';
  renderDetailTxPage();

  // Render daily chart
  if (ctx.daysInMonth) {
    const dailyData = new Array(ctx.daysInMonth).fill(0);
    txs.forEach(t => { const day = parseInt(t.date.substring(8, 10)); if (day >= 1 && day <= ctx.daysInMonth) dailyData[day - 1] += t.amount; });
    const labels = Array.from({ length: ctx.daysInMonth }, (_, i) => ctx.monthAbbr + ' ' + (i + 1));
    new Chart(document.getElementById('chart-cat-detail-daily'), {
      type: 'bar',
      data: { labels, datasets: [{ data: dailyData, backgroundColor: catColor + '80', borderRadius: 3 }] },
      options: withChartAnimation({ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
        scales: { x: { grid: { display: false }, ticks: { color: '#71717a', font: { size: 10 }, maxRotation: 45 } },
                 y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#71717a', callback: v => '$' + v } } } })
    });
  }
}

// ══════════════════════════════════════════════════════════
// ANOMALY DETECTION
// ══════════════════════════════════════════════════════════
function detectAnomalies() {
  if (activeData.length < 5) return [];
  const anomalies = [];

  // Per-merchant anomalies: transactions significantly above average for that merchant
  merchantGroups.forEach(mg => {
    if (mg.count < 2) return;
    const txs = activeData.filter(t => t.merchant === mg.name);
    const avg = mg.total / mg.count;
    const stdDev = Math.sqrt(txs.reduce((s, t) => s + Math.pow(t.amount - avg, 2), 0) / txs.length);
    if (stdDev === 0) return;
    txs.forEach(t => {
      const zScore = (t.amount - avg) / stdDev;
      if (zScore >= 1.8 && t.amount > avg * 1.5) {
        anomalies.push({
          type: 'merchant',
          transaction: t,
          merchant: t.merchant,
          amount: t.amount,
          avg: avg,
          ratio: (t.amount / avg).toFixed(1),
          message: fmt(t.amount) + ' at ' + t.merchant + ' is ' + (t.amount / avg).toFixed(1) + 'x your usual (' + fmt(avg) + ' avg)'
        });
      }
    });
  });

  // Per-category anomalies: single transaction that's a large chunk of category total
  catGroups.forEach(cg => {
    if (cg.count < 3) return;
    const txs = activeData.filter(t => t.category === cg.name);
    const avg = cg.total / cg.count;
    txs.forEach(t => {
      const pctOfCat = t.amount / cg.total;
      if (pctOfCat > 0.4 && t.amount > avg * 2) {
        const exists = anomalies.find(a => a.transaction.id === t.id);
        if (!exists) {
          anomalies.push({
            type: 'category',
            transaction: t,
            merchant: t.merchant,
            amount: t.amount,
            avg: avg,
            ratio: (t.amount / avg).toFixed(1),
            message: fmt(t.amount) + ' at ' + t.merchant + ' is ' + ((pctOfCat * 100).toFixed(0)) + '% of all ' + cg.name + ' spending'
          });
        }
      }
    });
  });

  return anomalies.sort((a, b) => parseFloat(b.ratio) - parseFloat(a.ratio)).slice(0, 5);
}

// ══════════════════════════════════════════════════════════
// RECURRING EXPENSE DETECTION
// ══════════════════════════════════════════════════════════
const RECURRING_KEYWORDS = [
  "netflix","spotify","hulu","disney","hbo","paramount","peacock","apple music","youtube premium",
  "amazon prime","insurance","geico","state farm","allstate","progressive",
  "gym","planet fitness","la fitness","ymca","membership","subscription",
  "utility","electric","power","water","sewer","gas bill","internet","comcast","xfinity",
  "at&t","verizon","t-mobile","sprint","wireless","phone","mobile",
  "mortgage","rent","lease","hoa","property",
  "adobe","microsoft","google storage","icloud","dropbox","chatgpt","openai"
];

// ── Recurring Expense Tracking ──
function loadTrackedRecurring() {
  try { return JSON.parse((_isDemo ? demoGet('expenses_recurring') : localStorage.getItem('expenses_recurring')) || '{}'); }
  catch(e) { return {}; }
}
function saveTrackedRecurring(data) {
  if (_isDemo) demoSet('expenses_recurring', JSON.stringify(data));
  else localStorage.setItem('expenses_recurring', JSON.stringify(data));
}
function toggleRecurringTrack(merchant, avgAmount, category, checked) {
  var tracked = loadTrackedRecurring();
  var key = merchant.toLowerCase();
  if (checked) {
    tracked[key] = { expected: avgAmount, category: category, active: true, merchant: merchant };
  } else {
    if (tracked[key]) tracked[key].active = false;
  }
  saveTrackedRecurring(tracked);
  if (typeof showToast === 'function') showToast(checked ? merchant + ' tracked as recurring' : merchant + ' untracked', 'info');
  // Update toggle visual state
  var label = event.target.parentElement;
  if (label) {
    var spans = label.querySelectorAll('span');
    if (spans.length >= 2) {
      spans[0].style.background = checked ? 'var(--blue,#3b82f6)' : 'rgba(113,113,122,0.3)';
      spans[1].style.left = checked ? '18px' : '2px';
    }
  }
}

function detectRecurring() {
  const results = [];
  const seen = new Set();
  const months = loadMonths().sort();

  // Cross-month detection (high confidence)
  if (months.length >= 2) {
    const allMonthData = {};
    months.forEach(mk => {
      const data = applyEdits(loadData(mk), mk);
      allMonthData[mk] = {};
      data.forEach(t => {
        if (!allMonthData[mk][t.merchant]) allMonthData[mk][t.merchant] = [];
        allMonthData[mk][t.merchant].push(t.amount);
      });
    });

    // Find merchants appearing in 2+ months
    const allMerchants = new Set();
    months.forEach(mk => Object.keys(allMonthData[mk]).forEach(m => allMerchants.add(m)));

    allMerchants.forEach(merchant => {
      const monthsPresent = months.filter(mk => allMonthData[mk][merchant] && allMonthData[mk][merchant].length > 0);
      if (monthsPresent.length < 2) return;

      const allAmounts = monthsPresent.flatMap(mk => allMonthData[mk][merchant]);
      const avg = allAmounts.reduce((s, a) => s + a, 0) / allAmounts.length;
      const maxDev = Math.max(...allAmounts.map(a => Math.abs(a - avg)));
      const isStable = avg > 0 && (maxDev / avg) <= 0.15;
      const isKnown = RECURRING_KEYWORDS.some(kw => merchant.toLowerCase().includes(kw));

      if (isStable || isKnown) {
        const cat = activeData.find(t => t.merchant === merchant)?.category || 'Other';
        results.push({
          merchant,
          avgAmount: avg,
          frequency: monthsPresent.length + '/' + months.length + ' months',
          months: monthsPresent.length,
          confidence: isStable ? 'high' : 'medium',
          category: cat
        });
        seen.add(merchant);
      }
    });
  }

  // Single-month detection (current month)
  merchantGroups.forEach(mg => {
    if (seen.has(mg.name)) return;
    const txs = activeData.filter(t => t.merchant === mg.name);
    if (txs.length < 2) {
      // Single transaction — check known keywords
      if (txs.length === 1) {
        const isKnown = RECURRING_KEYWORDS.some(kw => mg.name.toLowerCase().includes(kw));
        if (isKnown) {
          results.push({
            merchant: mg.name,
            avgAmount: txs[0].amount,
            frequency: 'Likely recurring',
            months: 1,
            confidence: 'medium',
            category: txs[0].category
          });
        }
      }
      return;
    }

    const avg = mg.total / mg.count;
    const maxDev = Math.max(...txs.map(t => Math.abs(t.amount - avg)));
    const isStable = avg > 0 && (maxDev / avg) <= 0.10;
    const isKnown = RECURRING_KEYWORDS.some(kw => mg.name.toLowerCase().includes(kw));

    if (isStable || isKnown) {
      results.push({
        merchant: mg.name,
        avgAmount: avg,
        frequency: mg.count + 'x this month',
        months: 1,
        confidence: isStable && isKnown ? 'high' : 'medium',
        category: txs[0].category
      });
    }
  });

  return results.sort((a, b) => b.avgAmount - a.avgAmount);
}

// ══════════════════════════════════════════════════════════
// BULK ACTIONS
// ══════════════════════════════════════════════════════════
var _selectMode = false;
function toggleSelectMode() {
  _selectMode = !_selectMode;
  var table = document.getElementById('tx-table');
  var btn = document.getElementById('btn-select-mode');
  if (_selectMode) {
    if (table) table.classList.add('select-mode');
    if (btn) { btn.classList.add('active'); btn.textContent = 'Cancel'; }
  } else {
    if (table) table.classList.remove('select-mode');
    if (btn) { btn.classList.remove('active'); btn.textContent = 'Select'; }
    clearBulkSelection();
  }
}
function getCheckedIds() {
  var checks = document.querySelectorAll('#tx-tbody .tx-check:checked');
  var ids = [];
  checks.forEach(function(cb) { if (cb.dataset.id) ids.push(cb.dataset.id); });
  return ids;
}
function updateBulkBar() {
  var ids = getCheckedIds();
  var bar = document.getElementById('bulk-bar');
  var countEl = document.getElementById('bulk-count');
  if (!bar) return;
  if (ids.length > 0) {
    bar.classList.add('active');
    if (countEl) countEl.textContent = ids.length + ' selected';
  } else {
    bar.classList.remove('active');
  }
  // Update header checkbox
  var headerCb = document.querySelector('#tx-table thead .tx-check');
  var allCbs = document.querySelectorAll('#tx-tbody .tx-check');
  if (headerCb && allCbs.length > 0) {
    headerCb.checked = ids.length === allCbs.length;
  }
}
function toggleAllTx(checked) {
  var checks = document.querySelectorAll('#tx-tbody .tx-check');
  checks.forEach(function(cb) { cb.checked = checked; });
  updateBulkBar();
}
function clearBulkSelection() {
  toggleAllTx(false);
  var headerCb = document.querySelector('#tx-table thead .tx-check');
  if (headerCb) headerCb.checked = false;
  updateBulkBar();
  // Exit select mode
  _selectMode = false;
  var table = document.getElementById('tx-table');
  var btn = document.getElementById('btn-select-mode');
  if (table) table.classList.remove('select-mode');
  if (btn) { btn.classList.remove('active'); btn.textContent = 'Select'; }
}
function bulkDelete() {
  var ids = getCheckedIds();
  if (ids.length === 0) return;
  // Snapshot for undo
  var deleted = [];
  var edits = loadEdits(ctx.monthKey);
  var editSnaps = {};
  ids.forEach(function(id) {
    var tx = activeData.find(function(t) { return t.id === id; });
    if (tx) deleted.push(JSON.parse(JSON.stringify(tx)));
    if (edits[id]) editSnaps[id] = JSON.parse(JSON.stringify(edits[id]));
  });
  var mkSnap = ctx.monthKey;

  activeData = activeData.filter(function(t) { return ids.indexOf(t.id) === -1; });
  ids.forEach(function(id) { delete edits[id]; });
  saveData(ctx.monthKey, activeData);
  saveEdits(ctx.monthKey, edits);
  recomputeAll();
  destroyAllCharts();
  renderAll();

  pushUndo(deleted.length + ' transaction' + (deleted.length > 1 ? 's' : '') + ' deleted', function() {
    deleted.forEach(function(tx) { activeData.push(tx); });
    var e = loadEdits(mkSnap);
    Object.keys(editSnaps).forEach(function(id) { e[id] = editSnaps[id]; });
    saveEdits(mkSnap, e);
    saveData(mkSnap, activeData);
    recomputeAll();
    destroyAllCharts();
    renderAll();
  });
}
function bulkRecategorize() {
  var ids = getCheckedIds();
  if (ids.length === 0) return;
  // Build category picker modal
  var overlay = document.createElement('div');
  overlay.id = 'bulk-recat-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:100001;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(4px)';
  var catHtml = '<div style="background:var(--card,#1a1b2e);border:1px solid var(--card-border,#2a2b35);border-radius:16px;padding:24px;max-width:360px;width:100%;max-height:80vh;overflow-y:auto">';
  catHtml += '<div style="font-size:16px;font-weight:700;margin-bottom:16px;text-align:center">Change Category (' + ids.length + ' selected)</div>';
  CATEGORY_LIST.forEach(function(cat) {
    var clr = getCatColor(cat);
    catHtml += '<button onclick="applyBulkCategory(\'' + cat.replace(/'/g,"\\'") + '\')" style="display:block;width:100%;padding:10px 14px;margin-bottom:6px;border-radius:8px;border:1px solid ' + clr + '33;background:' + clr + '11;color:' + clr + ';font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;text-align:left">' + cat + '</button>';
  });
  catHtml += '<button onclick="closeBulkRecat()" style="display:block;width:100%;padding:10px;margin-top:8px;border:none;background:none;color:var(--text-muted);font-size:13px;cursor:pointer;font-family:inherit">Cancel</button>';
  catHtml += '</div>';
  overlay.innerHTML = catHtml;
  document.body.appendChild(overlay);
}
function closeBulkRecat() {
  var overlay = document.getElementById('bulk-recat-overlay');
  if (overlay) overlay.parentNode.removeChild(overlay);
}
function applyBulkCategory(cat) {
  var ids = getCheckedIds();
  closeBulkRecat();
  if (ids.length === 0) return;
  // Snapshot for undo
  var prevCats = {};
  var prevEdits = {};
  var edits = loadEdits(ctx.monthKey);
  var mkSnap = ctx.monthKey;
  ids.forEach(function(id) {
    var tx = activeData.find(function(t) { return t.id === id; });
    if (tx) {
      prevCats[id] = tx.category;
      if (edits[id]) prevEdits[id] = JSON.parse(JSON.stringify(edits[id]));
      tx.category = cat;
      tx._manualCategory = true;
      if (!edits[id]) edits[id] = {};
      edits[id].category = cat;
    }
  });
  saveEdits(ctx.monthKey, edits);
  saveData(ctx.monthKey, activeData);
  recomputeAll();
  destroyAllCharts();
  renderAll();
  clearBulkSelection();
  pushUndo(ids.length + ' recategorized', function() {
    var e = loadEdits(mkSnap);
    ids.forEach(function(id) {
      var tx = activeData.find(function(t) { return t.id === id; });
      if (tx && prevCats[id]) {
        tx.category = prevCats[id];
        tx._manualCategory = false;
        if (prevEdits[id]) e[id] = prevEdits[id];
        else delete e[id];
      }
    });
    saveEdits(mkSnap, e);
    saveData(mkSnap, activeData);
    recomputeAll(); destroyAllCharts(); renderAll();
  });
  showToast(ids.length + ' transaction' + (ids.length > 1 ? 's' : '') + ' recategorized to ' + cat, 'success');
}

// ══════════════════════════════════════════════════════════
// INITIALIZATION
// ══════════════════════════════════════════════════════════
(function init() {
  // Restore theme (defaults to light)
  const savedTheme = _isDemo ? sessionStorage.getItem('demo_app_theme') : localStorage.getItem('app_theme');
  if (savedTheme !== 'dark') {
    document.body.classList.add('light');
    document.getElementById('theme-toggle').innerHTML = '&#9788;';
  }

  const months = loadMonths();
  if (months.length > 0) {
    const active = _isDemo ? demoGet("expenses_activeMonth") : localStorage.getItem("expenses_activeMonth");
    const mk = (active && months.includes(active)) ? active : months.sort().reverse()[0];
    switchMonth(mk);
  } else {
    updateMonthNav();
    renderAll();
  }

  // Demo mode: inject banner and update links
  if (_isDemo) {
    injectDemoBanner('blue');
    demofyLinks();
  }
})();

