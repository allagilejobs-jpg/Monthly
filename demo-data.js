// demo-data.js — Demo mode data and in-memory storage layer
// Loaded by all pages. Only activates when sessionStorage or URL param signals demo mode.

const DEMO_MODE = (function() {
  const fromSession = sessionStorage.getItem('demo_mode') === 'true';
  const fromUrl = new URLSearchParams(window.location.search).has('demo');
  if (fromUrl && !fromSession) sessionStorage.setItem('demo_mode', 'true');
  return fromSession || fromUrl;
})();

// ── In-memory store (replaces localStorage for demo) ──
const _demoStore = {};
function demoGet(key) { return _demoStore[key] || null; }
function demoSet(key, value) { _demoStore[key] = value; }
function demoRemove(key) { delete _demoStore[key]; }

// ── Grocery Demo Data: 2 months ──
const DEMO_GROCERY_DATA = {
  "2025_11": [
    // ── Nov 3 — Publix trip ──
    { d:"11/03", s:"Publix", r:"BNLS CHKN BRST", n:"Boneless Chicken Breast", c:"Proteins", q:2, u:5.99, t:11.98, ng:false },
    { d:"11/03", s:"Publix", r:"GRD BEEF 80/20", n:"Ground Beef 80/20", c:"Proteins", q:1, u:6.49, t:6.49, ng:false },
    { d:"11/03", s:"Publix", r:"LRG EGGS 18CT", n:"Large Eggs 18ct", c:"Dairy", q:1, u:4.29, t:4.29, ng:false },
    { d:"11/03", s:"Publix", r:"2% MILK GAL", n:"2% Milk Gallon", c:"Dairy", q:1, u:3.89, t:3.89, ng:false },
    { d:"11/03", s:"Publix", r:"BROCLI CROWNS", n:"Broccoli Crowns", c:"Produce", q:2, u:2.49, t:4.98, ng:false },
    { d:"11/03", s:"Publix", r:"BANANA LB", n:"Bananas", c:"Produce", q:3, u:0.69, t:2.07, ng:false },
    { d:"11/03", s:"Publix", r:"WHT BREAD", n:"White Bread Loaf", c:"Grains & Bread", q:1, u:3.29, t:3.29, ng:false },
    { d:"11/03", s:"Publix", r:"CHEERIOS 18OZ", n:"Cheerios Cereal 18oz", c:"Grains & Bread", q:1, u:4.99, t:4.99, ng:false },
    { d:"11/03", s:"Publix", r:"PAPER TOWEL 6P", n:"Paper Towels 6-Pack", c:"Household", q:1, u:8.99, t:8.99, ng:true },
    { d:"11/03", s:"Publix", r:"DISH SOAP", n:"Dawn Dish Soap", c:"Cleaning", q:1, u:3.49, t:3.49, ng:true },
    // ── Nov 5 — Walmart trip ──
    { d:"11/05", s:"Walmart", r:"ORNG JUICE 52OZ", n:"Orange Juice 52oz", c:"Beverages", q:1, u:3.98, t:3.98, ng:false },
    { d:"11/05", s:"Walmart", r:"SPGHTTI 1LB", n:"Spaghetti Pasta 1lb", c:"Grains & Bread", q:2, u:1.28, t:2.56, ng:false },
    { d:"11/05", s:"Walmart", r:"MRNRA SAUCE", n:"Marinara Sauce Jar", c:"Canned Goods", q:1, u:2.48, t:2.48, ng:false },
    { d:"11/05", s:"Walmart", r:"PNTR BTTR", n:"Peanut Butter 16oz", c:"Condiments", q:1, u:3.48, t:3.48, ng:false },
    { d:"11/05", s:"Walmart", r:"STRAWBERRIES", n:"Strawberries 1lb", c:"Produce", q:1, u:3.97, t:3.97, ng:false },
    { d:"11/05", s:"Walmart", r:"BABY WIPES 80CT", n:"Baby Wipes 80ct", c:"Baby", q:1, u:2.97, t:2.97, ng:true },
    { d:"11/05", s:"Walmart", r:"FROZ PIZZA", n:"Frozen Pizza DiGiorno", c:"Frozen", q:2, u:5.98, t:11.96, ng:false },
    { d:"11/05", s:"Walmart", r:"ICE CREAM PT", n:"Ice Cream Pint", c:"Frozen", q:1, u:4.48, t:4.48, ng:false },
    { d:"11/05", s:"Walmart", r:"CHIPS LAYS", n:"Lays Potato Chips", c:"Snacks", q:1, u:4.28, t:4.28, ng:false },
    { d:"11/05", s:"Walmart", r:"TOOTHPASTE", n:"Colgate Toothpaste", c:"Personal Care", q:1, u:3.47, t:3.47, ng:true },
    // ── Nov 8 — Costco trip ──
    { d:"11/08", s:"Costco", r:"RTSRE CHKN", n:"Rotisserie Chicken", c:"Proteins", q:1, u:4.99, t:4.99, ng:false },
    { d:"11/08", s:"Costco", r:"SALMON FILLET", n:"Atlantic Salmon Fillet 2lb", c:"Proteins", q:1, u:14.99, t:14.99, ng:false },
    { d:"11/08", s:"Costco", r:"SHRDD CHEESE 5LB", n:"Shredded Cheese 5lb", c:"Dairy", q:1, u:12.49, t:12.49, ng:false },
    { d:"11/08", s:"Costco", r:"GREEK YOGURT", n:"Greek Yogurt 32oz", c:"Dairy", q:2, u:5.99, t:11.98, ng:false },
    { d:"11/08", s:"Costco", r:"AVOCADOS 6PK", n:"Avocados 6-Pack", c:"Produce", q:1, u:6.99, t:6.99, ng:false },
    { d:"11/08", s:"Costco", r:"MIXED BERRIES", n:"Mixed Berries Frozen 3lb", c:"Frozen", q:1, u:9.99, t:9.99, ng:false },
    { d:"11/08", s:"Costco", r:"OLIVE OIL 1L", n:"Extra Virgin Olive Oil 1L", c:"Condiments", q:1, u:9.49, t:9.49, ng:false },
    { d:"11/08", s:"Costco", r:"PAPR TOWL 12PK", n:"Paper Towels 12-Pack", c:"Household", q:1, u:18.99, t:18.99, ng:true },
    { d:"11/08", s:"Costco", r:"TRASH BAGS 200", n:"Trash Bags 200ct", c:"Cleaning", q:1, u:15.99, t:15.99, ng:true },
    // ── Nov 11 — Target trip ──
    { d:"11/11", s:"Target", r:"ALMD MILK", n:"Almond Milk 64oz", c:"Dairy", q:1, u:3.49, t:3.49, ng:false },
    { d:"11/11", s:"Target", r:"GRANOLA BARS", n:"Nature Valley Granola Bars", c:"Snacks", q:2, u:3.99, t:7.98, ng:false },
    { d:"11/11", s:"Target", r:"APPLES 3LB", n:"Gala Apples 3lb Bag", c:"Produce", q:1, u:4.99, t:4.99, ng:false },
    { d:"11/11", s:"Target", r:"BABY FOOD 8PK", n:"Baby Food Variety 8-Pack", c:"Baby", q:1, u:8.99, t:8.99, ng:true },
    { d:"11/11", s:"Target", r:"SHAMPOO", n:"Pantene Shampoo", c:"Personal Care", q:1, u:6.99, t:6.99, ng:true },
    { d:"11/11", s:"Target", r:"RICE 5LB", n:"Jasmine Rice 5lb", c:"Grains & Bread", q:1, u:6.49, t:6.49, ng:false },
    { d:"11/11", s:"Target", r:"CANNED TUNA 4P", n:"Canned Tuna 4-Pack", c:"Canned Goods", q:1, u:5.29, t:5.29, ng:false },
    { d:"11/11", s:"Target", r:"GOLDFISH SNCK", n:"Goldfish Crackers", c:"Snacks", q:1, u:2.99, t:2.99, ng:false },
    // ── Nov 14 — Aldi trip ──
    { d:"11/14", s:"Aldi", r:"WHOLE CHKN", n:"Whole Chicken", c:"Proteins", q:1, u:5.49, t:5.49, ng:false },
    { d:"11/14", s:"Aldi", r:"BELL PEPPERS", n:"Bell Peppers 3-Pack", c:"Produce", q:1, u:2.69, t:2.69, ng:false },
    { d:"11/14", s:"Aldi", r:"ONION 3LB", n:"Yellow Onions 3lb", c:"Produce", q:1, u:1.99, t:1.99, ng:false },
    { d:"11/14", s:"Aldi", r:"BUTTER", n:"Unsalted Butter 1lb", c:"Dairy", q:1, u:3.49, t:3.49, ng:false },
    { d:"11/14", s:"Aldi", r:"TOMATO SOUP", n:"Tomato Soup Can", c:"Canned Goods", q:3, u:0.99, t:2.97, ng:false },
    { d:"11/14", s:"Aldi", r:"TORTILLA CHIPS", n:"Tortilla Chips", c:"Snacks", q:1, u:1.89, t:1.89, ng:false },
    { d:"11/14", s:"Aldi", r:"CHOC CHIP COOK", n:"Chocolate Chip Cookies", c:"Snacks", q:1, u:2.49, t:2.49, ng:false },
    { d:"11/14", s:"Aldi", r:"LAUNDRY DET", n:"Laundry Detergent", c:"Cleaning", q:1, u:5.99, t:5.99, ng:true },
    // ── Nov 17 — Publix trip ──
    { d:"11/17", s:"Publix", r:"TILAPIA FILLET", n:"Tilapia Fillet 1lb", c:"Proteins", q:1, u:7.99, t:7.99, ng:false },
    { d:"11/17", s:"Publix", r:"SOUR CREAM", n:"Sour Cream 16oz", c:"Dairy", q:1, u:2.79, t:2.79, ng:false },
    { d:"11/17", s:"Publix", r:"SPINACH BAG", n:"Baby Spinach 5oz", c:"Produce", q:2, u:2.99, t:5.98, ng:false },
    { d:"11/17", s:"Publix", r:"TOMATOES ROMA", n:"Roma Tomatoes 1lb", c:"Produce", q:1, u:1.99, t:1.99, ng:false },
    { d:"11/17", s:"Publix", r:"CRCKRS RITZ", n:"Ritz Crackers", c:"Snacks", q:1, u:3.99, t:3.99, ng:false },
    { d:"11/17", s:"Publix", r:"COFFEE GRND", n:"Folgers Ground Coffee", c:"Beverages", q:1, u:8.99, t:8.99, ng:false },
    { d:"11/17", s:"Publix", r:"WATER 24PK", n:"Bottled Water 24-Pack", c:"Beverages", q:1, u:3.99, t:3.99, ng:false },
    { d:"11/17", s:"Publix", r:"BAKING SODA", n:"Baking Soda 1lb", c:"Baking", q:1, u:0.99, t:0.99, ng:false },
    // ── Nov 20 — Trader Joe's trip ──
    { d:"11/20", s:"Trader Joe's", r:"ORG EGGS", n:"Organic Free Range Eggs", c:"Dairy", q:1, u:5.49, t:5.49, ng:false },
    { d:"11/20", s:"Trader Joe's", r:"CAULIFLWR RICE", n:"Cauliflower Rice Frozen", c:"Frozen", q:1, u:2.99, t:2.99, ng:false },
    { d:"11/20", s:"Trader Joe's", r:"MNDARIN ORNGS", n:"Mandarin Oranges Bag", c:"Produce", q:1, u:3.49, t:3.49, ng:false },
    { d:"11/20", s:"Trader Joe's", r:"HUMMUS", n:"Classic Hummus", c:"Condiments", q:1, u:2.99, t:2.99, ng:false },
    { d:"11/20", s:"Trader Joe's", r:"TRKY BURGER", n:"Turkey Burgers Frozen", c:"Proteins", q:1, u:4.99, t:4.99, ng:false },
    { d:"11/20", s:"Trader Joe's", r:"DARK CHOC BAR", n:"Dark Chocolate Bar 72%", c:"Snacks", q:2, u:1.99, t:3.98, ng:false },
    { d:"11/20", s:"Trader Joe's", r:"EVERYTHING BAGEL", n:"Everything Bagels 6-Pack", c:"Grains & Bread", q:1, u:3.49, t:3.49, ng:false },
    // ── Nov 23 — Walmart trip ──
    { d:"11/23", s:"Walmart", r:"PORK CHOPS", n:"Pork Chops Bone-In", c:"Proteins", q:1, u:5.97, t:5.97, ng:false },
    { d:"11/23", s:"Walmart", r:"CHEDDR CHEESE", n:"Cheddar Cheese Block", c:"Dairy", q:1, u:3.98, t:3.98, ng:false },
    { d:"11/23", s:"Walmart", r:"CARROTS 2LB", n:"Baby Carrots 2lb", c:"Produce", q:1, u:2.47, t:2.47, ng:false },
    { d:"11/23", s:"Walmart", r:"POTATOES 5LB", n:"Russet Potatoes 5lb", c:"Produce", q:1, u:3.97, t:3.97, ng:false },
    { d:"11/23", s:"Walmart", r:"MAC N CHEESE", n:"Kraft Mac & Cheese 3-Pack", c:"Grains & Bread", q:1, u:3.78, t:3.78, ng:false },
    { d:"11/23", s:"Walmart", r:"APPLE JUICE", n:"Apple Juice 64oz", c:"Beverages", q:1, u:2.98, t:2.98, ng:false },
    { d:"11/23", s:"Walmart", r:"FLOUR 5LB", n:"All Purpose Flour 5lb", c:"Baking", q:1, u:2.78, t:2.78, ng:false },
    { d:"11/23", s:"Walmart", r:"SUGAR 4LB", n:"Granulated Sugar 4lb", c:"Baking", q:1, u:2.98, t:2.98, ng:false },
    { d:"11/23", s:"Walmart", r:"BODY WASH", n:"Dove Body Wash", c:"Personal Care", q:1, u:5.97, t:5.97, ng:true },
    { d:"11/23", s:"Walmart", r:"HAND SOAP 3PK", n:"Hand Soap 3-Pack", c:"Cleaning", q:1, u:4.47, t:4.47, ng:true },
    // ── Nov 26 — Publix Thanksgiving trip ──
    { d:"11/26", s:"Publix", r:"TURKEY 12LB", n:"Whole Turkey 12lb", c:"Proteins", q:1, u:15.99, t:15.99, ng:false },
    { d:"11/26", s:"Publix", r:"CRANBERRY SCE", n:"Cranberry Sauce Can", c:"Canned Goods", q:2, u:1.89, t:3.78, ng:false },
    { d:"11/26", s:"Publix", r:"SWEET POTATOES", n:"Sweet Potatoes 3lb", c:"Produce", q:1, u:3.49, t:3.49, ng:false },
    { d:"11/26", s:"Publix", r:"GREEN BEANS", n:"Fresh Green Beans 1lb", c:"Produce", q:2, u:1.99, t:3.98, ng:false },
    { d:"11/26", s:"Publix", r:"PIE CRUST", n:"Frozen Pie Crust 2-Pack", c:"Baking", q:1, u:3.99, t:3.99, ng:false },
    { d:"11/26", s:"Publix", r:"WHIPPING CREAM", n:"Heavy Whipping Cream", c:"Dairy", q:1, u:3.99, t:3.99, ng:false },
    { d:"11/26", s:"Publix", r:"DINNER ROLLS", n:"Hawaiian Dinner Rolls 12ct", c:"Grains & Bread", q:1, u:4.49, t:4.49, ng:false },
    { d:"11/26", s:"Publix", r:"PUMPKIN CAN", n:"Canned Pumpkin 15oz", c:"Canned Goods", q:1, u:2.29, t:2.29, ng:false },
    { d:"11/26", s:"Publix", r:"NAPKINS 200CT", n:"Paper Napkins 200ct", c:"Household", q:1, u:3.49, t:3.49, ng:true },
    // ── Nov 28 — Aldi trip ──
    { d:"11/28", s:"Aldi", r:"BACON 1LB", n:"Bacon 1lb", c:"Proteins", q:1, u:4.99, t:4.99, ng:false },
    { d:"11/28", s:"Aldi", r:"GARLIC 3PK", n:"Garlic 3-Pack", c:"Produce", q:1, u:1.49, t:1.49, ng:false },
    { d:"11/28", s:"Aldi", r:"CUCUMBER", n:"English Cucumber", c:"Produce", q:2, u:0.89, t:1.78, ng:false },
    { d:"11/28", s:"Aldi", r:"WAFFLES FRZN", n:"Frozen Waffles 10ct", c:"Frozen", q:1, u:1.99, t:1.99, ng:false },
    { d:"11/28", s:"Aldi", r:"PRETZELS", n:"Mini Pretzels Bag", c:"Snacks", q:1, u:1.49, t:1.49, ng:false },
    { d:"11/28", s:"Aldi", r:"DEODORANT", n:"Old Spice Deodorant", c:"Personal Care", q:1, u:3.99, t:3.99, ng:true },
    { d:"11/28", s:"Aldi", r:"DIAPER SZ3 36", n:"Diapers Size 3 36ct", c:"Baby", q:1, u:6.49, t:6.49, ng:true }
  ],
  "2025_12": [
    // ── Dec 1 — Publix trip ──
    { d:"12/01", s:"Publix", r:"BNLS CHKN BRST", n:"Boneless Chicken Breast", c:"Proteins", q:2, u:6.29, t:12.58, ng:false },
    { d:"12/01", s:"Publix", r:"LRG EGGS 18CT", n:"Large Eggs 18ct", c:"Dairy", q:1, u:4.49, t:4.49, ng:false },
    { d:"12/01", s:"Publix", r:"2% MILK GAL", n:"2% Milk Gallon", c:"Dairy", q:2, u:3.89, t:7.78, ng:false },
    { d:"12/01", s:"Publix", r:"BANANA LB", n:"Bananas", c:"Produce", q:3, u:0.69, t:2.07, ng:false },
    { d:"12/01", s:"Publix", r:"BROCLI CROWNS", n:"Broccoli Crowns", c:"Produce", q:1, u:2.49, t:2.49, ng:false },
    { d:"12/01", s:"Publix", r:"CELERY STLK", n:"Celery Stalks", c:"Produce", q:1, u:1.89, t:1.89, ng:false },
    { d:"12/01", s:"Publix", r:"WHT BREAD", n:"White Bread Loaf", c:"Grains & Bread", q:1, u:3.29, t:3.29, ng:false },
    { d:"12/01", s:"Publix", r:"CHEERIOS 18OZ", n:"Cheerios Cereal 18oz", c:"Grains & Bread", q:1, u:4.99, t:4.99, ng:false },
    { d:"12/01", s:"Publix", r:"COFFEE GRND", n:"Folgers Ground Coffee", c:"Beverages", q:1, u:8.99, t:8.99, ng:false },
    { d:"12/01", s:"Publix", r:"PAPER TOWEL 6P", n:"Paper Towels 6-Pack", c:"Household", q:1, u:8.99, t:8.99, ng:true },
    // ── Dec 4 — Costco trip ──
    { d:"12/04", s:"Costco", r:"RTSRE CHKN", n:"Rotisserie Chicken", c:"Proteins", q:1, u:4.99, t:4.99, ng:false },
    { d:"12/04", s:"Costco", r:"BEEF STEW MEAT", n:"Beef Stew Meat 3lb", c:"Proteins", q:1, u:17.99, t:17.99, ng:false },
    { d:"12/04", s:"Costco", r:"SHRDD CHEESE 5LB", n:"Shredded Cheese 5lb", c:"Dairy", q:1, u:12.99, t:12.99, ng:false },
    { d:"12/04", s:"Costco", r:"GREEK YOGURT", n:"Greek Yogurt 32oz", c:"Dairy", q:2, u:5.99, t:11.98, ng:false },
    { d:"12/04", s:"Costco", r:"MIXED BERRIES", n:"Mixed Berries Frozen 3lb", c:"Frozen", q:1, u:9.99, t:9.99, ng:false },
    { d:"12/04", s:"Costco", r:"CROISSANTS 12", n:"Butter Croissants 12-Pack", c:"Grains & Bread", q:1, u:5.99, t:5.99, ng:false },
    { d:"12/04", s:"Costco", r:"OLIVE OIL 1L", n:"Extra Virgin Olive Oil 1L", c:"Condiments", q:1, u:9.49, t:9.49, ng:false },
    { d:"12/04", s:"Costco", r:"TRAIL MIX 2LB", n:"Trail Mix 2lb Bag", c:"Snacks", q:1, u:8.99, t:8.99, ng:false },
    { d:"12/04", s:"Costco", r:"TOILET PAPER 30", n:"Toilet Paper 30-Roll", c:"Household", q:1, u:22.99, t:22.99, ng:true },
    { d:"12/04", s:"Costco", r:"TRASH BAGS 200", n:"Trash Bags 200ct", c:"Cleaning", q:1, u:15.99, t:15.99, ng:true },
    // ── Dec 7 — Walmart trip ──
    { d:"12/07", s:"Walmart", r:"GRD TURKEY", n:"Ground Turkey 1lb", c:"Proteins", q:1, u:4.97, t:4.97, ng:false },
    { d:"12/07", s:"Walmart", r:"ORNG JUICE 52OZ", n:"Orange Juice 52oz", c:"Beverages", q:1, u:3.98, t:3.98, ng:false },
    { d:"12/07", s:"Walmart", r:"SPGHTTI 1LB", n:"Spaghetti Pasta 1lb", c:"Grains & Bread", q:2, u:1.28, t:2.56, ng:false },
    { d:"12/07", s:"Walmart", r:"ALFREDO SAUCE", n:"Alfredo Sauce Jar", c:"Canned Goods", q:1, u:2.78, t:2.78, ng:false },
    { d:"12/07", s:"Walmart", r:"STRAWBERRIES", n:"Strawberries 1lb", c:"Produce", q:1, u:3.97, t:3.97, ng:false },
    { d:"12/07", s:"Walmart", r:"BLUEBERRIES", n:"Blueberries 6oz", c:"Produce", q:2, u:2.97, t:5.94, ng:false },
    { d:"12/07", s:"Walmart", r:"FROZ PIZZA", n:"Frozen Pizza DiGiorno", c:"Frozen", q:2, u:5.98, t:11.96, ng:false },
    { d:"12/07", s:"Walmart", r:"CHIPS DORITOS", n:"Doritos Nacho Cheese", c:"Snacks", q:1, u:4.28, t:4.28, ng:false },
    { d:"12/07", s:"Walmart", r:"TOOTHPASTE", n:"Colgate Toothpaste", c:"Personal Care", q:2, u:3.47, t:6.94, ng:true },
    { d:"12/07", s:"Walmart", r:"BABY WIPES 80CT", n:"Baby Wipes 80ct", c:"Baby", q:2, u:2.97, t:5.94, ng:true },
    // ── Dec 10 — Target trip ──
    { d:"12/10", s:"Target", r:"ALMD MILK", n:"Almond Milk 64oz", c:"Dairy", q:2, u:3.49, t:6.98, ng:false },
    { d:"12/10", s:"Target", r:"GRANOLA BARS", n:"Nature Valley Granola Bars", c:"Snacks", q:1, u:3.99, t:3.99, ng:false },
    { d:"12/10", s:"Target", r:"RICE 5LB", n:"Jasmine Rice 5lb", c:"Grains & Bread", q:1, u:6.49, t:6.49, ng:false },
    { d:"12/10", s:"Target", r:"CANNED TUNA 4P", n:"Canned Tuna 4-Pack", c:"Canned Goods", q:1, u:5.29, t:5.29, ng:false },
    { d:"12/10", s:"Target", r:"CHOCOLATE MIX", n:"Hot Chocolate Mix 12ct", c:"Beverages", q:2, u:4.99, t:9.98, ng:false },
    { d:"12/10", s:"Target", r:"GIFT WRAP", n:"Holiday Gift Wrapping Paper", c:"Household", q:3, u:4.99, t:14.97, ng:true },
    { d:"12/10", s:"Target", r:"BABY FOOD 8PK", n:"Baby Food Variety 8-Pack", c:"Baby", q:1, u:8.99, t:8.99, ng:true },
    { d:"12/10", s:"Target", r:"GOLDFISH SNCK", n:"Goldfish Crackers", c:"Snacks", q:2, u:2.99, t:5.98, ng:false },
    // ── Dec 14 — Trader Joe's trip ──
    { d:"12/14", s:"Trader Joe's", r:"ORG EGGS", n:"Organic Free Range Eggs", c:"Dairy", q:1, u:5.49, t:5.49, ng:false },
    { d:"12/14", s:"Trader Joe's", r:"CAULIFLWR RICE", n:"Cauliflower Rice Frozen", c:"Frozen", q:2, u:2.99, t:5.98, ng:false },
    { d:"12/14", s:"Trader Joe's", r:"MNDARIN ORNGS", n:"Mandarin Oranges Bag", c:"Produce", q:1, u:3.49, t:3.49, ng:false },
    { d:"12/14", s:"Trader Joe's", r:"HUMMUS", n:"Classic Hummus", c:"Condiments", q:1, u:2.99, t:2.99, ng:false },
    { d:"12/14", s:"Trader Joe's", r:"TRKY BURGER", n:"Turkey Burgers Frozen", c:"Proteins", q:1, u:4.99, t:4.99, ng:false },
    { d:"12/14", s:"Trader Joe's", r:"PEPPERMNT BARK", n:"Peppermint Bark Box", c:"Snacks", q:2, u:3.99, t:7.98, ng:false },
    { d:"12/14", s:"Trader Joe's", r:"SOURDOUGH", n:"Sourdough Bread Loaf", c:"Grains & Bread", q:1, u:3.99, t:3.99, ng:false },
    { d:"12/14", s:"Trader Joe's", r:"SPARKLING WATER", n:"Sparkling Water 12-Pack", c:"Beverages", q:1, u:4.49, t:4.49, ng:false },
    // ── Dec 17 — Aldi trip ──
    { d:"12/17", s:"Aldi", r:"WHOLE CHKN", n:"Whole Chicken", c:"Proteins", q:1, u:5.49, t:5.49, ng:false },
    { d:"12/17", s:"Aldi", r:"BELL PEPPERS", n:"Bell Peppers 3-Pack", c:"Produce", q:1, u:2.69, t:2.69, ng:false },
    { d:"12/17", s:"Aldi", r:"ONION 3LB", n:"Yellow Onions 3lb", c:"Produce", q:1, u:1.99, t:1.99, ng:false },
    { d:"12/17", s:"Aldi", r:"BUTTER", n:"Unsalted Butter 1lb", c:"Dairy", q:2, u:3.49, t:6.98, ng:false },
    { d:"12/17", s:"Aldi", r:"CHKN BROTH 32", n:"Chicken Broth 32oz", c:"Canned Goods", q:2, u:1.29, t:2.58, ng:false },
    { d:"12/17", s:"Aldi", r:"CHOC CHIP COOK", n:"Chocolate Chip Cookies", c:"Snacks", q:2, u:2.49, t:4.98, ng:false },
    { d:"12/17", s:"Aldi", r:"LAUNDRY DET", n:"Laundry Detergent", c:"Cleaning", q:1, u:5.99, t:5.99, ng:true },
    { d:"12/17", s:"Aldi", r:"DIAPER SZ3 36", n:"Diapers Size 3 36ct", c:"Baby", q:1, u:6.49, t:6.49, ng:true },
    // ── Dec 20 — Publix trip ──
    { d:"12/20", s:"Publix", r:"PRIME RIB 4LB", n:"Prime Rib Roast 4lb", c:"Proteins", q:1, u:39.99, t:39.99, ng:false },
    { d:"12/20", s:"Publix", r:"SHRIMP 1LB", n:"Jumbo Shrimp 1lb", c:"Proteins", q:1, u:9.99, t:9.99, ng:false },
    { d:"12/20", s:"Publix", r:"SOUR CREAM", n:"Sour Cream 16oz", c:"Dairy", q:1, u:2.79, t:2.79, ng:false },
    { d:"12/20", s:"Publix", r:"CREAM CHEESE", n:"Cream Cheese Block", c:"Dairy", q:2, u:2.49, t:4.98, ng:false },
    { d:"12/20", s:"Publix", r:"ASPARAGUS BNCH", n:"Fresh Asparagus Bunch", c:"Produce", q:2, u:3.99, t:7.98, ng:false },
    { d:"12/20", s:"Publix", r:"MUSHROOMS 8OZ", n:"Baby Bella Mushrooms 8oz", c:"Produce", q:1, u:2.99, t:2.99, ng:false },
    { d:"12/20", s:"Publix", r:"DINNER ROLLS", n:"Hawaiian Dinner Rolls 12ct", c:"Grains & Bread", q:2, u:4.49, t:8.98, ng:false },
    { d:"12/20", s:"Publix", r:"WINE RED", n:"Red Wine Bottle", c:"Beverages", q:2, u:8.99, t:17.98, ng:false },
    { d:"12/20", s:"Publix", r:"VANILLA EXTRCT", n:"Pure Vanilla Extract", c:"Baking", q:1, u:6.49, t:6.49, ng:false },
    { d:"12/20", s:"Publix", r:"CHOC CHIPS 12", n:"Chocolate Chips 12oz", c:"Baking", q:2, u:3.49, t:6.98, ng:false },
    { d:"12/20", s:"Publix", r:"NAPKINS 200CT", n:"Paper Napkins 200ct", c:"Household", q:1, u:3.49, t:3.49, ng:true },
    // ── Dec 24 — Walmart last-minute trip ──
    { d:"12/24", s:"Walmart", r:"HAM SPIRAL 8LB", n:"Spiral Ham 8lb", c:"Proteins", q:1, u:18.97, t:18.97, ng:false },
    { d:"12/24", s:"Walmart", r:"WHIPPED CREAM", n:"Whipped Cream Can", c:"Dairy", q:2, u:2.98, t:5.96, ng:false },
    { d:"12/24", s:"Walmart", r:"EGGNOG QT", n:"Eggnog Quart", c:"Beverages", q:1, u:3.48, t:3.48, ng:false },
    { d:"12/24", s:"Walmart", r:"CRANBERRIES", n:"Fresh Cranberries 12oz", c:"Produce", q:1, u:2.47, t:2.47, ng:false },
    { d:"12/24", s:"Walmart", r:"POTATOES 5LB", n:"Russet Potatoes 5lb", c:"Produce", q:1, u:3.97, t:3.97, ng:false },
    { d:"12/24", s:"Walmart", r:"PIE CRUST", n:"Frozen Pie Crust 2-Pack", c:"Baking", q:1, u:3.48, t:3.48, ng:false },
    { d:"12/24", s:"Walmart", r:"CANNED CORN 3P", n:"Canned Sweet Corn 3-Pack", c:"Canned Goods", q:1, u:2.88, t:2.88, ng:false },
    { d:"12/24", s:"Walmart", r:"HAND SOAP 3PK", n:"Hand Soap 3-Pack", c:"Cleaning", q:1, u:4.47, t:4.47, ng:true },
    // ── Dec 28 — Aldi post-holiday trip ──
    { d:"12/28", s:"Aldi", r:"BACON 1LB", n:"Bacon 1lb", c:"Proteins", q:1, u:4.99, t:4.99, ng:false },
    { d:"12/28", s:"Aldi", r:"WAFFLES FRZN", n:"Frozen Waffles 10ct", c:"Frozen", q:2, u:1.99, t:3.98, ng:false },
    { d:"12/28", s:"Aldi", r:"GARLIC 3PK", n:"Garlic 3-Pack", c:"Produce", q:1, u:1.49, t:1.49, ng:false },
    { d:"12/28", s:"Aldi", r:"PRETZELS", n:"Mini Pretzels Bag", c:"Snacks", q:1, u:1.49, t:1.49, ng:false },
    { d:"12/28", s:"Aldi", r:"BODY WASH", n:"Dove Body Wash", c:"Personal Care", q:1, u:4.49, t:4.49, ng:true }
  ]
};

// ── Expenses Demo Data: 2 months ──
const DEMO_EXPENSES_DATA = {
  "2025_11": [
    // Housing & Utilities
    { id:"d-001", date:"2025-11-01", description:"RENT PAYMENT - NOVEMBER", merchant:"Apartment Rent", category:"Housing", amount:1850.00, source:"csv", bank:"Chase", _origCategory:"Housing", _manualCategory:false },
    { id:"d-002", date:"2025-11-03", description:"GEORGIA POWER BILL", merchant:"Georgia Power", category:"Utilities", amount:142.50, source:"csv", bank:"Chase", _origCategory:"Utilities", _manualCategory:false },
    { id:"d-003", date:"2025-11-05", description:"SPECTRUM INTERNET NOV", merchant:"Spectrum", category:"Utilities", amount:79.99, source:"csv", bank:"Chase", _origCategory:"Utilities", _manualCategory:false },
    { id:"d-004", date:"2025-11-08", description:"ATLANTA WATERSHED MGMT", merchant:"Atlanta Water", category:"Utilities", amount:68.30, source:"csv", bank:"Chase", _origCategory:"Utilities", _manualCategory:false },
    // Subscriptions
    { id:"d-005", date:"2025-11-01", description:"NETFLIX.COM", merchant:"Netflix", category:"Subscriptions", amount:15.49, source:"csv", bank:"Chase", _origCategory:"Subscriptions", _manualCategory:false },
    { id:"d-006", date:"2025-11-01", description:"SPOTIFY USA", merchant:"Spotify", category:"Subscriptions", amount:10.99, source:"csv", bank:"Chase", _origCategory:"Subscriptions", _manualCategory:false },
    { id:"d-007", date:"2025-11-03", description:"PLANET FITNESS MONTHLY", merchant:"Planet Fitness", category:"Subscriptions", amount:24.99, source:"csv", bank:"Chase", _origCategory:"Subscriptions", _manualCategory:false },
    { id:"d-008", date:"2025-11-05", description:"APPLE.COM/BILL ICLOUD", merchant:"Apple iCloud", category:"Subscriptions", amount:2.99, source:"csv", bank:"Chase", _origCategory:"Subscriptions", _manualCategory:false },
    { id:"d-009", date:"2025-11-10", description:"AMAZON PRIME MEMBER", merchant:"Amazon Prime", category:"Subscriptions", amount:14.99, source:"csv", bank:"Chase", _origCategory:"Subscriptions", _manualCategory:false },
    // Transportation & Gas
    { id:"d-010", date:"2025-11-02", description:"SHELL OIL 57442 ATLANTA GA", merchant:"Shell", category:"Gas & Fuel", amount:48.52, source:"csv", bank:"BoA", _origCategory:"Gas & Fuel", _manualCategory:false },
    { id:"d-011", date:"2025-11-10", description:"QT 5289 DECATUR GA", merchant:"QuikTrip", category:"Gas & Fuel", amount:42.18, source:"csv", bank:"BoA", _origCategory:"Gas & Fuel", _manualCategory:false },
    { id:"d-012", date:"2025-11-19", description:"SHELL OIL 57442 ATLANTA GA", merchant:"Shell", category:"Gas & Fuel", amount:45.90, source:"csv", bank:"BoA", _origCategory:"Gas & Fuel", _manualCategory:false },
    { id:"d-013", date:"2025-11-06", description:"MARTA BREEZE CARD RELOAD", merchant:"MARTA Transit", category:"Transportation", amount:45.00, source:"csv", bank:"Chase", _origCategory:"Transportation", _manualCategory:false },
    // Dining
    { id:"d-014", date:"2025-11-02", description:"STARBUCKS #12345 ATLANTA GA", merchant:"Starbucks", category:"Dining", amount:6.45, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-015", date:"2025-11-04", description:"CHICK-FIL-A #2198", merchant:"Chick-fil-A", category:"Dining", amount:11.42, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-016", date:"2025-11-07", description:"CHIPOTLE ONLINE 3847", merchant:"Chipotle", category:"Dining", amount:14.85, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-017", date:"2025-11-09", description:"WAFFLE HOUSE #1052", merchant:"Waffle House", category:"Dining", amount:18.30, source:"csv", bank:"BoA", _origCategory:"Dining", _manualCategory:false },
    { id:"d-018", date:"2025-11-12", description:"STARBUCKS #12345 ATLANTA GA", merchant:"Starbucks", category:"Dining", amount:5.75, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-019", date:"2025-11-15", description:"PIZZA HUT DELIVERY 0912", merchant:"Pizza Hut", category:"Dining", amount:24.99, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-020", date:"2025-11-18", description:"PANDA EXPRESS 0482", merchant:"Panda Express", category:"Dining", amount:12.80, source:"csv", bank:"BoA", _origCategory:"Dining", _manualCategory:false },
    { id:"d-021", date:"2025-11-21", description:"STARBUCKS #12345 ATLANTA GA", merchant:"Starbucks", category:"Dining", amount:7.20, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-022", date:"2025-11-25", description:"OLIVE GARDEN #1284", merchant:"Olive Garden", category:"Dining", amount:52.40, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-023", date:"2025-11-28", description:"IHOP #8291 ATLANTA GA", merchant:"IHOP", category:"Dining", amount:28.50, source:"csv", bank:"BoA", _origCategory:"Dining", _manualCategory:false },
    // Groceries
    { id:"d-024", date:"2025-11-03", description:"PUBLIX #1247 ATLANTA GA", merchant:"Publix", category:"Groceries", amount:87.42, source:"csv", bank:"Chase", _origCategory:"Groceries", _manualCategory:false },
    { id:"d-025", date:"2025-11-05", description:"WALMART SUPERCENTER 2841", merchant:"Walmart", category:"Groceries", amount:64.30, source:"csv", bank:"BoA", _origCategory:"Groceries", _manualCategory:false },
    { id:"d-026", date:"2025-11-08", description:"COSTCO WHSE #1182", merchant:"Costco", category:"Groceries", amount:132.80, source:"csv", bank:"Chase", _origCategory:"Groceries", _manualCategory:false },
    { id:"d-027", date:"2025-11-14", description:"ALDI 35017 DECATUR GA", merchant:"Aldi", category:"Groceries", amount:42.65, source:"csv", bank:"Chase", _origCategory:"Groceries", _manualCategory:false },
    { id:"d-028", date:"2025-11-20", description:"TRADER JOE'S #128", merchant:"Trader Joe's", category:"Groceries", amount:56.20, source:"csv", bank:"Chase", _origCategory:"Groceries", _manualCategory:false },
    { id:"d-029", date:"2025-11-26", description:"PUBLIX #1247 ATLANTA GA", merchant:"Publix", category:"Groceries", amount:98.40, source:"csv", bank:"Chase", _origCategory:"Groceries", _manualCategory:false },
    // Shopping
    { id:"d-030", date:"2025-11-06", description:"AMAZON.COM*2K8YH1PP3", merchant:"Amazon", category:"Shopping", amount:34.99, source:"csv", bank:"Chase", _origCategory:"Shopping", _manualCategory:false },
    { id:"d-031", date:"2025-11-11", description:"TARGET T-2145 ATLANTA GA", merchant:"Target", category:"Shopping", amount:45.80, source:"csv", bank:"Chase", _origCategory:"Shopping", _manualCategory:false },
    { id:"d-032", date:"2025-11-15", description:"AMAZON.COM*3M2KL9QR7", merchant:"Amazon", category:"Shopping", amount:22.49, source:"csv", bank:"Chase", _origCategory:"Shopping", _manualCategory:false },
    { id:"d-033", date:"2025-11-22", description:"OLD NAVY #0982", merchant:"Old Navy", category:"Shopping", amount:38.50, source:"csv", bank:"BoA", _origCategory:"Shopping", _manualCategory:false },
    // Entertainment
    { id:"d-034", date:"2025-11-08", description:"AMC THEATRES #2841", merchant:"AMC Theatres", category:"Entertainment", amount:28.00, source:"csv", bank:"Chase", _origCategory:"Entertainment", _manualCategory:false },
    { id:"d-035", date:"2025-11-16", description:"DAVE & BUSTERS 1028", merchant:"Dave & Busters", category:"Entertainment", amount:45.00, source:"csv", bank:"BoA", _origCategory:"Entertainment", _manualCategory:false },
    // Healthcare & Insurance
    { id:"d-036", date:"2025-11-05", description:"CVS/PHARMACY #4182", merchant:"CVS Pharmacy", category:"Healthcare", amount:15.80, source:"csv", bank:"Chase", _origCategory:"Healthcare", _manualCategory:false },
    { id:"d-037", date:"2025-11-12", description:"KAISER PERMANENTE COPAY", merchant:"Kaiser Permanente", category:"Healthcare", amount:30.00, source:"csv", bank:"Chase", _origCategory:"Healthcare", _manualCategory:false },
    { id:"d-038", date:"2025-11-15", description:"STATE FARM INSURANCE", merchant:"State Farm", category:"Insurance", amount:156.00, source:"csv", bank:"Chase", _origCategory:"Insurance", _manualCategory:false },
    // Personal Care
    { id:"d-039", date:"2025-11-09", description:"GREAT CLIPS #7291", merchant:"Great Clips", category:"Personal Care", amount:22.00, source:"csv", bank:"Chase", _origCategory:"Personal Care", _manualCategory:false },
    // Misc
    { id:"d-040", date:"2025-11-14", description:"USPS PO 0519281234", merchant:"USPS", category:"Misc", amount:8.50, source:"csv", bank:"Chase", _origCategory:"Misc", _manualCategory:false },
    { id:"d-041", date:"2025-11-20", description:"DRY CLEAN SUPER CENTER", merchant:"Dry Cleaners", category:"Misc", amount:18.00, source:"csv", bank:"BoA", _origCategory:"Misc", _manualCategory:false }
  ],
  "2025_12": [
    // Housing & Utilities
    { id:"d-101", date:"2025-12-01", description:"RENT PAYMENT - DECEMBER", merchant:"Apartment Rent", category:"Housing", amount:1850.00, source:"csv", bank:"Chase", _origCategory:"Housing", _manualCategory:false },
    { id:"d-102", date:"2025-12-04", description:"GEORGIA POWER BILL", merchant:"Georgia Power", category:"Utilities", amount:168.20, source:"csv", bank:"Chase", _origCategory:"Utilities", _manualCategory:false },
    { id:"d-103", date:"2025-12-05", description:"SPECTRUM INTERNET DEC", merchant:"Spectrum", category:"Utilities", amount:79.99, source:"csv", bank:"Chase", _origCategory:"Utilities", _manualCategory:false },
    { id:"d-104", date:"2025-12-09", description:"ATLANTA WATERSHED MGMT", merchant:"Atlanta Water", category:"Utilities", amount:72.10, source:"csv", bank:"Chase", _origCategory:"Utilities", _manualCategory:false },
    // Subscriptions
    { id:"d-105", date:"2025-12-01", description:"NETFLIX.COM", merchant:"Netflix", category:"Subscriptions", amount:15.49, source:"csv", bank:"Chase", _origCategory:"Subscriptions", _manualCategory:false },
    { id:"d-106", date:"2025-12-01", description:"SPOTIFY USA", merchant:"Spotify", category:"Subscriptions", amount:10.99, source:"csv", bank:"Chase", _origCategory:"Subscriptions", _manualCategory:false },
    { id:"d-107", date:"2025-12-03", description:"PLANET FITNESS MONTHLY", merchant:"Planet Fitness", category:"Subscriptions", amount:24.99, source:"csv", bank:"Chase", _origCategory:"Subscriptions", _manualCategory:false },
    { id:"d-108", date:"2025-12-05", description:"APPLE.COM/BILL ICLOUD", merchant:"Apple iCloud", category:"Subscriptions", amount:2.99, source:"csv", bank:"Chase", _origCategory:"Subscriptions", _manualCategory:false },
    { id:"d-109", date:"2025-12-10", description:"AMAZON PRIME MEMBER", merchant:"Amazon Prime", category:"Subscriptions", amount:14.99, source:"csv", bank:"Chase", _origCategory:"Subscriptions", _manualCategory:false },
    { id:"d-110", date:"2025-12-12", description:"DISNEY+ SUBSCRIPTION", merchant:"Disney+", category:"Subscriptions", amount:13.99, source:"csv", bank:"Chase", _origCategory:"Subscriptions", _manualCategory:false },
    // Transportation & Gas
    { id:"d-111", date:"2025-12-02", description:"SHELL OIL 57442 ATLANTA GA", merchant:"Shell", category:"Gas & Fuel", amount:52.40, source:"csv", bank:"BoA", _origCategory:"Gas & Fuel", _manualCategory:false },
    { id:"d-112", date:"2025-12-11", description:"QT 5289 DECATUR GA", merchant:"QuikTrip", category:"Gas & Fuel", amount:44.85, source:"csv", bank:"BoA", _origCategory:"Gas & Fuel", _manualCategory:false },
    { id:"d-113", date:"2025-12-20", description:"BP #891024 ATLANTA GA", merchant:"BP", category:"Gas & Fuel", amount:49.20, source:"csv", bank:"BoA", _origCategory:"Gas & Fuel", _manualCategory:false },
    { id:"d-114", date:"2025-12-06", description:"MARTA BREEZE CARD RELOAD", merchant:"MARTA Transit", category:"Transportation", amount:45.00, source:"csv", bank:"Chase", _origCategory:"Transportation", _manualCategory:false },
    { id:"d-115", date:"2025-12-22", description:"UBER *TRIP ATLANTA", merchant:"Uber", category:"Transportation", amount:18.50, source:"csv", bank:"Chase", _origCategory:"Transportation", _manualCategory:false },
    // Dining
    { id:"d-116", date:"2025-12-01", description:"STARBUCKS #12345 ATLANTA GA", merchant:"Starbucks", category:"Dining", amount:7.85, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-117", date:"2025-12-03", description:"CHICK-FIL-A #2198", merchant:"Chick-fil-A", category:"Dining", amount:13.20, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-118", date:"2025-12-06", description:"CHIPOTLE ONLINE 3847", merchant:"Chipotle", category:"Dining", amount:16.40, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-119", date:"2025-12-08", description:"CRACKER BARREL #582", merchant:"Cracker Barrel", category:"Dining", amount:42.60, source:"csv", bank:"BoA", _origCategory:"Dining", _manualCategory:false },
    { id:"d-120", date:"2025-12-11", description:"STARBUCKS #12345 ATLANTA GA", merchant:"Starbucks", category:"Dining", amount:6.20, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-121", date:"2025-12-14", description:"MELLOW MUSHROOM ATL", merchant:"Mellow Mushroom", category:"Dining", amount:38.90, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-122", date:"2025-12-17", description:"STARBUCKS #12345 ATLANTA GA", merchant:"Starbucks", category:"Dining", amount:5.95, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-123", date:"2025-12-20", description:"THE CHEESECAKE FACTORY", merchant:"Cheesecake Factory", category:"Dining", amount:68.50, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-124", date:"2025-12-23", description:"ZAXBYS #10842", merchant:"Zaxby's", category:"Dining", amount:14.80, source:"csv", bank:"BoA", _origCategory:"Dining", _manualCategory:false },
    { id:"d-125", date:"2025-12-25", description:"WAFFLE HOUSE #1052", merchant:"Waffle House", category:"Dining", amount:22.40, source:"csv", bank:"BoA", _origCategory:"Dining", _manualCategory:false },
    { id:"d-126", date:"2025-12-28", description:"PANDA EXPRESS 0482", merchant:"Panda Express", category:"Dining", amount:15.60, source:"csv", bank:"BoA", _origCategory:"Dining", _manualCategory:false },
    // Groceries
    { id:"d-127", date:"2025-12-01", description:"PUBLIX #1247 ATLANTA GA", merchant:"Publix", category:"Groceries", amount:92.80, source:"csv", bank:"Chase", _origCategory:"Groceries", _manualCategory:false },
    { id:"d-128", date:"2025-12-04", description:"COSTCO WHSE #1182", merchant:"Costco", category:"Groceries", amount:158.40, source:"csv", bank:"Chase", _origCategory:"Groceries", _manualCategory:false },
    { id:"d-129", date:"2025-12-07", description:"WALMART SUPERCENTER 2841", merchant:"Walmart", category:"Groceries", amount:78.50, source:"csv", bank:"BoA", _origCategory:"Groceries", _manualCategory:false },
    { id:"d-130", date:"2025-12-14", description:"TRADER JOE'S #128", merchant:"Trader Joe's", category:"Groceries", amount:62.30, source:"csv", bank:"Chase", _origCategory:"Groceries", _manualCategory:false },
    { id:"d-131", date:"2025-12-17", description:"ALDI 35017 DECATUR GA", merchant:"Aldi", category:"Groceries", amount:48.90, source:"csv", bank:"Chase", _origCategory:"Groceries", _manualCategory:false },
    { id:"d-132", date:"2025-12-20", description:"PUBLIX #1247 ATLANTA GA", merchant:"Publix", category:"Groceries", amount:142.60, source:"csv", bank:"Chase", _origCategory:"Groceries", _manualCategory:false },
    { id:"d-133", date:"2025-12-24", description:"WALMART SUPERCENTER 2841", merchant:"Walmart", category:"Groceries", amount:68.40, source:"csv", bank:"BoA", _origCategory:"Groceries", _manualCategory:false },
    // Shopping (holiday increase)
    { id:"d-134", date:"2025-12-02", description:"AMAZON.COM*8K3PL7MN2", merchant:"Amazon", category:"Shopping", amount:89.99, source:"csv", bank:"Chase", _origCategory:"Shopping", _manualCategory:false },
    { id:"d-135", date:"2025-12-06", description:"TARGET T-2145 ATLANTA GA", merchant:"Target", category:"Shopping", amount:62.40, source:"csv", bank:"Chase", _origCategory:"Shopping", _manualCategory:false },
    { id:"d-136", date:"2025-12-10", description:"AMAZON.COM*4J2KN8QR1", merchant:"Amazon", category:"Shopping", amount:124.50, source:"csv", bank:"Chase", _origCategory:"Shopping", _manualCategory:false },
    { id:"d-137", date:"2025-12-12", description:"BEST BUY #582 ATLANTA GA", merchant:"Best Buy", category:"Shopping", amount:149.99, source:"csv", bank:"Chase", _origCategory:"Shopping", _manualCategory:false },
    { id:"d-138", date:"2025-12-15", description:"AMAZON.COM*9P5ML3VX8", merchant:"Amazon", category:"Shopping", amount:56.80, source:"csv", bank:"Chase", _origCategory:"Shopping", _manualCategory:false },
    { id:"d-139", date:"2025-12-18", description:"NORDSTROM RACK #0412", merchant:"Nordstrom Rack", category:"Shopping", amount:78.50, source:"csv", bank:"BoA", _origCategory:"Shopping", _manualCategory:false },
    // Gifts (holiday)
    { id:"d-140", date:"2025-12-08", description:"HALLMARK #5291", merchant:"Hallmark", category:"Gifts", amount:32.50, source:"csv", bank:"Chase", _origCategory:"Gifts", _manualCategory:false },
    { id:"d-141", date:"2025-12-14", description:"BATH & BODY WORKS #892", merchant:"Bath & Body Works", category:"Gifts", amount:48.00, source:"csv", bank:"Chase", _origCategory:"Gifts", _manualCategory:false },
    // Entertainment
    { id:"d-142", date:"2025-12-07", description:"AMC THEATRES #2841", merchant:"AMC Theatres", category:"Entertainment", amount:36.00, source:"csv", bank:"Chase", _origCategory:"Entertainment", _manualCategory:false },
    { id:"d-143", date:"2025-12-21", description:"MAIN EVENT ENTERTAINMENT", merchant:"Main Event", category:"Entertainment", amount:55.00, source:"csv", bank:"BoA", _origCategory:"Entertainment", _manualCategory:false },
    // Healthcare & Insurance
    { id:"d-144", date:"2025-12-03", description:"CVS/PHARMACY #4182", merchant:"CVS Pharmacy", category:"Healthcare", amount:42.50, source:"csv", bank:"Chase", _origCategory:"Healthcare", _manualCategory:false },
    { id:"d-145", date:"2025-12-15", description:"STATE FARM INSURANCE", merchant:"State Farm", category:"Insurance", amount:156.00, source:"csv", bank:"Chase", _origCategory:"Insurance", _manualCategory:false },
    // Personal Care
    { id:"d-146", date:"2025-12-10", description:"GREAT CLIPS #7291", merchant:"Great Clips", category:"Personal Care", amount:22.00, source:"csv", bank:"Chase", _origCategory:"Personal Care", _manualCategory:false },
    // Misc
    { id:"d-147", date:"2025-12-05", description:"USPS PO 0519281234", merchant:"USPS", category:"Misc", amount:14.20, source:"csv", bank:"Chase", _origCategory:"Misc", _manualCategory:false },
    { id:"d-148", date:"2025-12-19", description:"DRY CLEAN SUPER CENTER", merchant:"Dry Cleaners", category:"Misc", amount:24.00, source:"csv", bank:"BoA", _origCategory:"Misc", _manualCategory:false }
  ]
};

// ── Seed the in-memory store on load ──
function seedDemoStore() {
  const groceryMonths = Object.keys(DEMO_GROCERY_DATA).sort();
  _demoStore['grocery_months'] = JSON.stringify(groceryMonths);
  _demoStore['grocery_activeMonth'] = groceryMonths[groceryMonths.length - 1];
  groceryMonths.forEach(function(mk) {
    _demoStore['data_' + mk] = JSON.stringify(DEMO_GROCERY_DATA[mk]);
  });

  const expenseMonths = Object.keys(DEMO_EXPENSES_DATA).sort();
  _demoStore['expenses_months'] = JSON.stringify(expenseMonths);
  _demoStore['expenses_activeMonth'] = expenseMonths[expenseMonths.length - 1];
  _demoStore['expenses_categoryRules'] = '{}';
  expenseMonths.forEach(function(mk) {
    _demoStore['expenses_data_' + mk] = JSON.stringify(DEMO_EXPENSES_DATA[mk]);
  });
}

if (DEMO_MODE) {
  seedDemoStore();
}

// ── Shared demo UI functions ──
function injectDemoBanner(color) {
  color = color || 'green';
  var c1 = color === 'blue' ? '#1a2740' : '#1e3a2f';
  var c2 = color === 'blue' ? '#1e2a3f' : '#1a2740';
  var accent = color === 'blue' ? 'rgba(59,130,246,0.3)' : 'rgba(34,197,94,0.3)';
  var accentVar = color === 'blue' ? '#3b82f6' : '#22c55e';
  var banner = document.createElement('div');
  banner.id = 'demo-banner';
  banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:10000;background:linear-gradient(135deg,' + c1 + ',' + c2 + ');border-bottom:1px solid ' + accent + ';padding:10px 20px;display:flex;justify-content:center;align-items:center;gap:16px;font-size:13px;color:#e4e4e7;flex-wrap:wrap;';
  banner.innerHTML = '<span style="font-weight:700;color:' + accentVar + '">DEMO MODE</span>' +
    '<span style="color:#71717a">Exploring with sample data</span>' +
    '<button onclick="exitDemoAndSignUp()" style="background:rgba(' + (color === 'blue' ? '59,130,246' : '34,197,94') + ',0.15);border:1px solid ' + accent + ';color:' + accentVar + ';border-radius:6px;padding:6px 16px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;">Sign Up to Save Your Data</button>' +
    '<button onclick="exitDemo()" style="background:none;border:none;color:#71717a;cursor:pointer;font-size:12px;text-decoration:underline;font-family:inherit;">Exit Demo</button>';
  document.body.prepend(banner);
  // Push down the header and content
  var header = document.querySelector('.header');
  if (header) header.style.top = '41px';
  var container = document.querySelector('.container');
  if (container) {
    var currentPad = parseInt(getComputedStyle(container).paddingTop) || 0;
    container.style.paddingTop = (currentPad + 41) + 'px';
  }
}

function exitDemo() {
  sessionStorage.removeItem('demo_mode');
  window.location.href = window.location.pathname.includes('/Groceries/') || window.location.pathname.includes('/Expenses/') || window.location.pathname.includes('/Scanner/') ? '../' : './';
}

function exitDemoAndSignUp() {
  sessionStorage.removeItem('demo_mode');
  var base = window.location.pathname.includes('/Groceries/') || window.location.pathname.includes('/Expenses/') || window.location.pathname.includes('/Scanner/') ? '../' : './';
  window.location.href = base + '?signup=true';
}

function showDemoUpgradePrompt(message) {
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:10001;display:flex;justify-content:center;align-items:center;padding:20px;';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
  overlay.innerHTML = '<div style="background:#1a1b23;border:1px solid #2a2b35;border-radius:16px;padding:32px;max-width:400px;text-align:center">' +
    '<div style="font-size:36px;margin-bottom:12px">&#128274;</div>' +
    '<div style="font-size:16px;font-weight:700;color:#22c55e;margin-bottom:8px">Create a Free Account</div>' +
    '<div style="font-size:14px;color:#71717a;margin-bottom:20px;line-height:1.6">' + message + '</div>' +
    '<div style="display:flex;gap:10px;justify-content:center">' +
      '<button onclick="this.closest(\'div[style]\').parentElement.remove()" style="padding:10px 20px;border-radius:8px;border:1px solid #2a2b35;background:rgba(255,255,255,0.06);color:#71717a;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;">Continue Demo</button>' +
      '<button onclick="exitDemoAndSignUp()" style="padding:10px 20px;border-radius:8px;border:1px solid rgba(34,197,94,0.3);background:rgba(34,197,94,0.15);color:#22c55e;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;">Sign Up Free</button>' +
    '</div></div>';
  document.body.appendChild(overlay);
}

// Rewrite cross-dashboard links to preserve demo mode
function demofyLinks() {
  if (!DEMO_MODE) return;
  document.querySelectorAll('a').forEach(function(a) {
    var href = a.getAttribute('href') || '';
    if ((href.includes('Groceries/') || href.includes('Expenses/') || href.includes('../Groceries') || href.includes('../Expenses')) && !href.includes('demo')) {
      a.setAttribute('href', href + (href.includes('?') ? '&' : '?') + 'demo=true');
    }
  });
}
