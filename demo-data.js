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

// ── Grocery Demo Data: 5 months ──
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
  ],
  "2026_01": [
    // ── Jan 3 — Publix trip (post-holiday reset) ──
    { d:"01/03", s:"Publix", r:"BNLS CHKN BRST", n:"Boneless Chicken Breast", c:"Proteins", q:2, u:6.29, t:12.58, ng:false },
    { d:"01/03", s:"Publix", r:"LRG EGGS 18CT", n:"Large Eggs 18ct", c:"Dairy", q:1, u:4.49, t:4.49, ng:false },
    { d:"01/03", s:"Publix", r:"2% MILK GAL", n:"2% Milk Gallon", c:"Dairy", q:1, u:3.89, t:3.89, ng:false },
    { d:"01/03", s:"Publix", r:"BANANA LB", n:"Bananas", c:"Produce", q:3, u:0.69, t:2.07, ng:false },
    { d:"01/03", s:"Publix", r:"BROCLI CROWNS", n:"Broccoli Crowns", c:"Produce", q:1, u:2.49, t:2.49, ng:false },
    { d:"01/03", s:"Publix", r:"WHT BREAD", n:"White Bread Loaf", c:"Grains & Bread", q:1, u:3.29, t:3.29, ng:false },
    { d:"01/03", s:"Publix", r:"CHEERIOS 18OZ", n:"Cheerios Cereal 18oz", c:"Grains & Bread", q:1, u:5.09, t:5.09, ng:false },
    { d:"01/03", s:"Publix", r:"COFFEE GRND", n:"Folgers Ground Coffee", c:"Beverages", q:1, u:9.19, t:9.19, ng:false },
    { d:"01/03", s:"Publix", r:"PAPER TOWEL 6P", n:"Paper Towels 6-Pack", c:"Household", q:1, u:9.19, t:9.19, ng:true },
    // ── Jan 5 — Walmart trip ──
    { d:"01/05", s:"Walmart", r:"GRD TURKEY", n:"Ground Turkey 1lb", c:"Proteins", q:1, u:4.97, t:4.97, ng:false },
    { d:"01/05", s:"Walmart", r:"ORNG JUICE 52OZ", n:"Orange Juice 52oz", c:"Beverages", q:1, u:4.08, t:4.08, ng:false },
    { d:"01/05", s:"Walmart", r:"SPGHTTI 1LB", n:"Spaghetti Pasta 1lb", c:"Grains & Bread", q:2, u:1.28, t:2.56, ng:false },
    { d:"01/05", s:"Walmart", r:"MRNRA SAUCE", n:"Marinara Sauce Jar", c:"Canned Goods", q:1, u:2.58, t:2.58, ng:false },
    { d:"01/05", s:"Walmart", r:"PNTR BTTR", n:"Peanut Butter 16oz", c:"Condiments", q:1, u:3.58, t:3.58, ng:false },
    { d:"01/05", s:"Walmart", r:"CARROTS 2LB", n:"Baby Carrots 2lb", c:"Produce", q:1, u:2.47, t:2.47, ng:false },
    { d:"01/05", s:"Walmart", r:"FROZ PIZZA", n:"Frozen Pizza DiGiorno", c:"Frozen", q:1, u:5.98, t:5.98, ng:false },
    { d:"01/05", s:"Walmart", r:"CHIPS LAYS", n:"Lays Potato Chips", c:"Snacks", q:1, u:4.38, t:4.38, ng:false },
    { d:"01/05", s:"Walmart", r:"TOOTHPASTE", n:"Colgate Toothpaste", c:"Personal Care", q:1, u:3.57, t:3.57, ng:true },
    // ── Jan 8 — Costco trip ──
    { d:"01/08", s:"Costco", r:"RTSRE CHKN", n:"Rotisserie Chicken", c:"Proteins", q:1, u:4.99, t:4.99, ng:false },
    { d:"01/08", s:"Costco", r:"SHRDD CHEESE 5LB", n:"Shredded Cheese 5lb", c:"Dairy", q:1, u:12.99, t:12.99, ng:false },
    { d:"01/08", s:"Costco", r:"GREEK YOGURT", n:"Greek Yogurt 32oz", c:"Dairy", q:2, u:6.09, t:12.18, ng:false },
    { d:"01/08", s:"Costco", r:"MIXED BERRIES", n:"Mixed Berries Frozen 3lb", c:"Frozen", q:1, u:10.19, t:10.19, ng:false },
    { d:"01/08", s:"Costco", r:"OLIVE OIL 1L", n:"Extra Virgin Olive Oil 1L", c:"Condiments", q:1, u:9.69, t:9.69, ng:false },
    { d:"01/08", s:"Costco", r:"PAPR TOWL 12PK", n:"Paper Towels 12-Pack", c:"Household", q:1, u:19.29, t:19.29, ng:true },
    { d:"01/08", s:"Costco", r:"TRASH BAGS 200", n:"Trash Bags 200ct", c:"Cleaning", q:1, u:16.29, t:16.29, ng:true },
    { d:"01/08", s:"Costco", r:"ALMOND BUTTER", n:"Almond Butter 26oz", c:"Condiments", q:1, u:7.99, t:7.99, ng:false },
    // ── Jan 11 — Target trip ──
    { d:"01/11", s:"Target", r:"ALMD MILK", n:"Almond Milk 64oz", c:"Dairy", q:1, u:3.59, t:3.59, ng:false },
    { d:"01/11", s:"Target", r:"GRANOLA BARS", n:"Nature Valley Granola Bars", c:"Snacks", q:1, u:4.09, t:4.09, ng:false },
    { d:"01/11", s:"Target", r:"APPLES 3LB", n:"Gala Apples 3lb Bag", c:"Produce", q:1, u:5.09, t:5.09, ng:false },
    { d:"01/11", s:"Target", r:"RICE 5LB", n:"Jasmine Rice 5lb", c:"Grains & Bread", q:1, u:6.59, t:6.59, ng:false },
    { d:"01/11", s:"Target", r:"CANNED TUNA 4P", n:"Canned Tuna 4-Pack", c:"Canned Goods", q:1, u:5.39, t:5.39, ng:false },
    { d:"01/11", s:"Target", r:"GOLDFISH SNCK", n:"Goldfish Crackers", c:"Snacks", q:1, u:3.09, t:3.09, ng:false },
    { d:"01/11", s:"Target", r:"BABY FOOD 8PK", n:"Baby Food Variety 8-Pack", c:"Baby", q:1, u:9.09, t:9.09, ng:true },
    { d:"01/11", s:"Target", r:"SHAMPOO", n:"Pantene Shampoo", c:"Personal Care", q:1, u:7.09, t:7.09, ng:true },
    // ── Jan 14 — Aldi trip ──
    { d:"01/14", s:"Aldi", r:"WHOLE CHKN", n:"Whole Chicken", c:"Proteins", q:1, u:5.59, t:5.59, ng:false },
    { d:"01/14", s:"Aldi", r:"BELL PEPPERS", n:"Bell Peppers 3-Pack", c:"Produce", q:1, u:2.79, t:2.79, ng:false },
    { d:"01/14", s:"Aldi", r:"ONION 3LB", n:"Yellow Onions 3lb", c:"Produce", q:1, u:2.09, t:2.09, ng:false },
    { d:"01/14", s:"Aldi", r:"BUTTER", n:"Unsalted Butter 1lb", c:"Dairy", q:1, u:3.59, t:3.59, ng:false },
    { d:"01/14", s:"Aldi", r:"TOMATO SOUP", n:"Tomato Soup Can", c:"Canned Goods", q:2, u:1.05, t:2.10, ng:false },
    { d:"01/14", s:"Aldi", r:"TORTILLA CHIPS", n:"Tortilla Chips", c:"Snacks", q:1, u:1.95, t:1.95, ng:false },
    { d:"01/14", s:"Aldi", r:"CHOC CHIP COOK", n:"Chocolate Chip Cookies", c:"Snacks", q:1, u:2.59, t:2.59, ng:false },
    { d:"01/14", s:"Aldi", r:"LAUNDRY DET", n:"Laundry Detergent", c:"Cleaning", q:1, u:6.09, t:6.09, ng:true },
    // ── Jan 18 — Trader Joe's trip ──
    { d:"01/18", s:"Trader Joe's", r:"ORG EGGS", n:"Organic Free Range Eggs", c:"Dairy", q:1, u:5.59, t:5.59, ng:false },
    { d:"01/18", s:"Trader Joe's", r:"CAULIFLWR RICE", n:"Cauliflower Rice Frozen", c:"Frozen", q:1, u:2.99, t:2.99, ng:false },
    { d:"01/18", s:"Trader Joe's", r:"MNDARIN ORNGS", n:"Mandarin Oranges Bag", c:"Produce", q:1, u:3.59, t:3.59, ng:false },
    { d:"01/18", s:"Trader Joe's", r:"HUMMUS", n:"Classic Hummus", c:"Condiments", q:1, u:2.99, t:2.99, ng:false },
    { d:"01/18", s:"Trader Joe's", r:"TRKY BURGER", n:"Turkey Burgers Frozen", c:"Proteins", q:1, u:5.09, t:5.09, ng:false },
    { d:"01/18", s:"Trader Joe's", r:"DARK CHOC BAR", n:"Dark Chocolate Bar 72%", c:"Snacks", q:1, u:1.99, t:1.99, ng:false },
    { d:"01/18", s:"Trader Joe's", r:"EVERYTHING BAGEL", n:"Everything Bagels 6-Pack", c:"Grains & Bread", q:1, u:3.49, t:3.49, ng:false },
    { d:"01/18", s:"Trader Joe's", r:"GREEN PLANT MILK", n:"Oat Milk 64oz", c:"Dairy", q:1, u:3.79, t:3.79, ng:false },
    // ── Jan 22 — Walmart trip ──
    { d:"01/22", s:"Walmart", r:"PORK CHOPS", n:"Pork Chops Bone-In", c:"Proteins", q:1, u:6.07, t:6.07, ng:false },
    { d:"01/22", s:"Walmart", r:"CHEDDR CHEESE", n:"Cheddar Cheese Block", c:"Dairy", q:1, u:4.08, t:4.08, ng:false },
    { d:"01/22", s:"Walmart", r:"POTATOES 5LB", n:"Russet Potatoes 5lb", c:"Produce", q:1, u:3.97, t:3.97, ng:false },
    { d:"01/22", s:"Walmart", r:"MAC N CHEESE", n:"Kraft Mac & Cheese 3-Pack", c:"Grains & Bread", q:1, u:3.88, t:3.88, ng:false },
    { d:"01/22", s:"Walmart", r:"APPLE JUICE", n:"Apple Juice 64oz", c:"Beverages", q:1, u:2.98, t:2.98, ng:false },
    { d:"01/22", s:"Walmart", r:"BABY WIPES 80CT", n:"Baby Wipes 80ct", c:"Baby", q:1, u:3.07, t:3.07, ng:true },
    { d:"01/22", s:"Walmart", r:"HAND SOAP 3PK", n:"Hand Soap 3-Pack", c:"Cleaning", q:1, u:4.57, t:4.57, ng:true },
    { d:"01/22", s:"Walmart", r:"BODY WASH", n:"Dove Body Wash", c:"Personal Care", q:1, u:6.07, t:6.07, ng:true }
  ],
  "2026_02": [
    // ── Feb 1 — Publix trip ──
    { d:"02/01", s:"Publix", r:"BNLS CHKN BRST", n:"Boneless Chicken Breast", c:"Proteins", q:2, u:6.39, t:12.78, ng:false },
    { d:"02/01", s:"Publix", r:"GRD BEEF 80/20", n:"Ground Beef 80/20", c:"Proteins", q:1, u:6.79, t:6.79, ng:false },
    { d:"02/01", s:"Publix", r:"LRG EGGS 18CT", n:"Large Eggs 18ct", c:"Dairy", q:1, u:4.59, t:4.59, ng:false },
    { d:"02/01", s:"Publix", r:"2% MILK GAL", n:"2% Milk Gallon", c:"Dairy", q:2, u:3.95, t:7.90, ng:false },
    { d:"02/01", s:"Publix", r:"BANANA LB", n:"Bananas", c:"Produce", q:3, u:0.71, t:2.13, ng:false },
    { d:"02/01", s:"Publix", r:"BROCLI CROWNS", n:"Broccoli Crowns", c:"Produce", q:2, u:2.59, t:5.18, ng:false },
    { d:"02/01", s:"Publix", r:"WHT BREAD", n:"White Bread Loaf", c:"Grains & Bread", q:1, u:3.39, t:3.39, ng:false },
    { d:"02/01", s:"Publix", r:"CHEERIOS 18OZ", n:"Cheerios Cereal 18oz", c:"Grains & Bread", q:1, u:5.19, t:5.19, ng:false },
    { d:"02/01", s:"Publix", r:"COFFEE GRND", n:"Folgers Ground Coffee", c:"Beverages", q:1, u:9.29, t:9.29, ng:false },
    { d:"02/01", s:"Publix", r:"PAPER TOWEL 6P", n:"Paper Towels 6-Pack", c:"Household", q:1, u:9.29, t:9.29, ng:true },
    { d:"02/01", s:"Publix", r:"DISH SOAP", n:"Dawn Dish Soap", c:"Cleaning", q:1, u:3.69, t:3.69, ng:true },
    // ── Feb 4 — Walmart trip ──
    { d:"02/04", s:"Walmart", r:"ORNG JUICE 52OZ", n:"Orange Juice 52oz", c:"Beverages", q:1, u:4.18, t:4.18, ng:false },
    { d:"02/04", s:"Walmart", r:"SPGHTTI 1LB", n:"Spaghetti Pasta 1lb", c:"Grains & Bread", q:2, u:1.32, t:2.64, ng:false },
    { d:"02/04", s:"Walmart", r:"MRNRA SAUCE", n:"Marinara Sauce Jar", c:"Canned Goods", q:1, u:2.58, t:2.58, ng:false },
    { d:"02/04", s:"Walmart", r:"PNTR BTTR", n:"Peanut Butter 16oz", c:"Condiments", q:1, u:3.58, t:3.58, ng:false },
    { d:"02/04", s:"Walmart", r:"STRAWBERRIES", n:"Strawberries 1lb", c:"Produce", q:1, u:3.97, t:3.97, ng:false },
    { d:"02/04", s:"Walmart", r:"FROZ PIZZA", n:"Frozen Pizza DiGiorno", c:"Frozen", q:2, u:6.08, t:12.16, ng:false },
    { d:"02/04", s:"Walmart", r:"ICE CREAM PT", n:"Ice Cream Pint", c:"Frozen", q:1, u:4.58, t:4.58, ng:false },
    { d:"02/04", s:"Walmart", r:"CHIPS LAYS", n:"Lays Potato Chips", c:"Snacks", q:1, u:4.38, t:4.38, ng:false },
    { d:"02/04", s:"Walmart", r:"TOOTHPASTE", n:"Colgate Toothpaste", c:"Personal Care", q:1, u:3.57, t:3.57, ng:true },
    { d:"02/04", s:"Walmart", r:"BABY WIPES 80CT", n:"Baby Wipes 80ct", c:"Baby", q:1, u:3.07, t:3.07, ng:true },
    // ── Feb 7 — Costco trip ──
    { d:"02/07", s:"Costco", r:"RTSRE CHKN", n:"Rotisserie Chicken", c:"Proteins", q:1, u:4.99, t:4.99, ng:false },
    { d:"02/07", s:"Costco", r:"SALMON FILLET", n:"Atlantic Salmon Fillet 2lb", c:"Proteins", q:1, u:15.49, t:15.49, ng:false },
    { d:"02/07", s:"Costco", r:"SHRDD CHEESE 5LB", n:"Shredded Cheese 5lb", c:"Dairy", q:1, u:13.29, t:13.29, ng:false },
    { d:"02/07", s:"Costco", r:"GREEK YOGURT", n:"Greek Yogurt 32oz", c:"Dairy", q:2, u:6.19, t:12.38, ng:false },
    { d:"02/07", s:"Costco", r:"AVOCADOS 6PK", n:"Avocados 6-Pack", c:"Produce", q:1, u:7.29, t:7.29, ng:false },
    { d:"02/07", s:"Costco", r:"MIXED BERRIES", n:"Mixed Berries Frozen 3lb", c:"Frozen", q:1, u:10.29, t:10.29, ng:false },
    { d:"02/07", s:"Costco", r:"OLIVE OIL 1L", n:"Extra Virgin Olive Oil 1L", c:"Condiments", q:1, u:9.79, t:9.79, ng:false },
    { d:"02/07", s:"Costco", r:"PAPR TOWL 12PK", n:"Paper Towels 12-Pack", c:"Household", q:1, u:19.29, t:19.29, ng:true },
    { d:"02/07", s:"Costco", r:"TRASH BAGS 200", n:"Trash Bags 200ct", c:"Cleaning", q:1, u:16.29, t:16.29, ng:true },
    // ── Feb 10 — Target trip ──
    { d:"02/10", s:"Target", r:"ALMD MILK", n:"Almond Milk 64oz", c:"Dairy", q:1, u:3.59, t:3.59, ng:false },
    { d:"02/10", s:"Target", r:"GRANOLA BARS", n:"Nature Valley Granola Bars", c:"Snacks", q:2, u:4.09, t:8.18, ng:false },
    { d:"02/10", s:"Target", r:"APPLES 3LB", n:"Gala Apples 3lb Bag", c:"Produce", q:1, u:5.19, t:5.19, ng:false },
    { d:"02/10", s:"Target", r:"RICE 5LB", n:"Jasmine Rice 5lb", c:"Grains & Bread", q:1, u:6.69, t:6.69, ng:false },
    { d:"02/10", s:"Target", r:"CANNED TUNA 4P", n:"Canned Tuna 4-Pack", c:"Canned Goods", q:1, u:5.39, t:5.39, ng:false },
    { d:"02/10", s:"Target", r:"GOLDFISH SNCK", n:"Goldfish Crackers", c:"Snacks", q:1, u:3.09, t:3.09, ng:false },
    { d:"02/10", s:"Target", r:"BABY FOOD 8PK", n:"Baby Food Variety 8-Pack", c:"Baby", q:1, u:9.19, t:9.19, ng:true },
    { d:"02/10", s:"Target", r:"SHAMPOO", n:"Pantene Shampoo", c:"Personal Care", q:1, u:7.19, t:7.19, ng:true },
    // ── Feb 13 — Trader Joe's trip (Valentine's week) ──
    { d:"02/13", s:"Trader Joe's", r:"ORG EGGS", n:"Organic Free Range Eggs", c:"Dairy", q:1, u:5.69, t:5.69, ng:false },
    { d:"02/13", s:"Trader Joe's", r:"CAULIFLWR RICE", n:"Cauliflower Rice Frozen", c:"Frozen", q:1, u:3.09, t:3.09, ng:false },
    { d:"02/13", s:"Trader Joe's", r:"MNDARIN ORNGS", n:"Mandarin Oranges Bag", c:"Produce", q:1, u:3.59, t:3.59, ng:false },
    { d:"02/13", s:"Trader Joe's", r:"HUMMUS", n:"Classic Hummus", c:"Condiments", q:1, u:2.99, t:2.99, ng:false },
    { d:"02/13", s:"Trader Joe's", r:"TRKY BURGER", n:"Turkey Burgers Frozen", c:"Proteins", q:1, u:5.09, t:5.09, ng:false },
    { d:"02/13", s:"Trader Joe's", r:"DARK CHOC BAR", n:"Dark Chocolate Bar 72%", c:"Snacks", q:3, u:1.99, t:5.97, ng:false },
    { d:"02/13", s:"Trader Joe's", r:"SOURDOUGH", n:"Sourdough Bread Loaf", c:"Grains & Bread", q:1, u:4.09, t:4.09, ng:false },
    { d:"02/13", s:"Trader Joe's", r:"SPARKLING WATER", n:"Sparkling Water 12-Pack", c:"Beverages", q:1, u:4.59, t:4.59, ng:false },
    { d:"02/13", s:"Trader Joe's", r:"FLOWERS BOUQT", n:"Fresh Flower Bouquet", c:"Household", q:1, u:5.99, t:5.99, ng:true },
    // ── Feb 16 — Aldi trip ──
    { d:"02/16", s:"Aldi", r:"WHOLE CHKN", n:"Whole Chicken", c:"Proteins", q:1, u:5.59, t:5.59, ng:false },
    { d:"02/16", s:"Aldi", r:"BELL PEPPERS", n:"Bell Peppers 3-Pack", c:"Produce", q:1, u:2.79, t:2.79, ng:false },
    { d:"02/16", s:"Aldi", r:"ONION 3LB", n:"Yellow Onions 3lb", c:"Produce", q:1, u:2.09, t:2.09, ng:false },
    { d:"02/16", s:"Aldi", r:"BUTTER", n:"Unsalted Butter 1lb", c:"Dairy", q:1, u:3.59, t:3.59, ng:false },
    { d:"02/16", s:"Aldi", r:"TOMATO SOUP", n:"Tomato Soup Can", c:"Canned Goods", q:3, u:1.05, t:3.15, ng:false },
    { d:"02/16", s:"Aldi", r:"TORTILLA CHIPS", n:"Tortilla Chips", c:"Snacks", q:1, u:1.95, t:1.95, ng:false },
    { d:"02/16", s:"Aldi", r:"CHOC CHIP COOK", n:"Chocolate Chip Cookies", c:"Snacks", q:1, u:2.59, t:2.59, ng:false },
    { d:"02/16", s:"Aldi", r:"LAUNDRY DET", n:"Laundry Detergent", c:"Cleaning", q:1, u:6.19, t:6.19, ng:true },
    // ── Feb 19 — Publix trip ──
    { d:"02/19", s:"Publix", r:"TILAPIA FILLET", n:"Tilapia Fillet 1lb", c:"Proteins", q:1, u:8.29, t:8.29, ng:false },
    { d:"02/19", s:"Publix", r:"SOUR CREAM", n:"Sour Cream 16oz", c:"Dairy", q:1, u:2.89, t:2.89, ng:false },
    { d:"02/19", s:"Publix", r:"SPINACH BAG", n:"Baby Spinach 5oz", c:"Produce", q:2, u:3.09, t:6.18, ng:false },
    { d:"02/19", s:"Publix", r:"TOMATOES ROMA", n:"Roma Tomatoes 1lb", c:"Produce", q:1, u:2.09, t:2.09, ng:false },
    { d:"02/19", s:"Publix", r:"CRCKRS RITZ", n:"Ritz Crackers", c:"Snacks", q:1, u:4.09, t:4.09, ng:false },
    { d:"02/19", s:"Publix", r:"WATER 24PK", n:"Bottled Water 24-Pack", c:"Beverages", q:1, u:4.19, t:4.19, ng:false },
    { d:"02/19", s:"Publix", r:"BAKING SODA", n:"Baking Soda 1lb", c:"Baking", q:1, u:1.09, t:1.09, ng:false },
    { d:"02/19", s:"Publix", r:"NAPKINS 200CT", n:"Paper Napkins 200ct", c:"Household", q:1, u:3.59, t:3.59, ng:true },
    // ── Feb 22 — Walmart trip ──
    { d:"02/22", s:"Walmart", r:"PORK CHOPS", n:"Pork Chops Bone-In", c:"Proteins", q:1, u:6.17, t:6.17, ng:false },
    { d:"02/22", s:"Walmart", r:"CHEDDR CHEESE", n:"Cheddar Cheese Block", c:"Dairy", q:1, u:4.08, t:4.08, ng:false },
    { d:"02/22", s:"Walmart", r:"POTATOES 5LB", n:"Russet Potatoes 5lb", c:"Produce", q:1, u:4.07, t:4.07, ng:false },
    { d:"02/22", s:"Walmart", r:"MAC N CHEESE", n:"Kraft Mac & Cheese 3-Pack", c:"Grains & Bread", q:1, u:3.88, t:3.88, ng:false },
    { d:"02/22", s:"Walmart", r:"APPLE JUICE", n:"Apple Juice 64oz", c:"Beverages", q:1, u:3.08, t:3.08, ng:false },
    { d:"02/22", s:"Walmart", r:"FLOUR 5LB", n:"All Purpose Flour 5lb", c:"Baking", q:1, u:2.88, t:2.88, ng:false },
    { d:"02/22", s:"Walmart", r:"SUGAR 4LB", n:"Granulated Sugar 4lb", c:"Baking", q:1, u:3.08, t:3.08, ng:false },
    { d:"02/22", s:"Walmart", r:"HAND SOAP 3PK", n:"Hand Soap 3-Pack", c:"Cleaning", q:1, u:4.57, t:4.57, ng:true },
    { d:"02/22", s:"Walmart", r:"DIAPER SZ3 36", n:"Diapers Size 3 36ct", c:"Baby", q:1, u:6.97, t:6.97, ng:true }
  ],
  "2026_03": [
    // ── Mar 1 — Publix trip ──
    { d:"03/01", s:"Publix", r:"BNLS CHKN BRST", n:"Boneless Chicken", c:"Proteins", q:2, u:6.49, t:12.98, ng:false },
    { d:"03/01", s:"Publix", r:"GRD BEEF 80/20", n:"Ground Beef 80/20", c:"Proteins", q:1, u:6.99, t:6.99, ng:false },
    { d:"03/01", s:"Publix", r:"LRG EGGS 18CT", n:"Large Eggs 18ct", c:"Dairy", q:1, u:4.69, t:4.69, ng:false },
    { d:"03/01", s:"Publix", r:"2% MILK GAL", n:"2% Milk Gallon", c:"Dairy", q:2, u:3.99, t:7.98, ng:false },
    { d:"03/01", s:"Publix", r:"BROCLI CROWNS", n:"Broccoli Crowns", c:"Produce", q:2, u:2.69, t:5.38, ng:false },
    { d:"03/01", s:"Publix", r:"BANANA LB", n:"Bananas", c:"Produce", q:3, u:0.72, t:2.16, ng:false },
    { d:"03/01", s:"Publix", r:"ASPARAGUS BNCH", n:"Fresh Asparagus Bunch", c:"Produce", q:1, u:3.49, t:3.49, ng:false },
    { d:"03/01", s:"Publix", r:"WHT BREAD", n:"White Bread Loaf", c:"Grains & Bread", q:1, u:3.49, t:3.49, ng:false },
    { d:"03/01", s:"Publix", r:"CHEERIOS 18OZ", n:"Cheerios Cereal 18oz", c:"Grains & Bread", q:1, u:5.29, t:5.29, ng:false },
    { d:"03/01", s:"Publix", r:"COFFEE GRND", n:"Folgers Ground Coffee", c:"Beverages", q:1, u:9.49, t:9.49, ng:false },
    { d:"03/01", s:"Publix", r:"PAPER TOWEL 6P", n:"Paper Towels 6-Pack", c:"Household", q:1, u:9.49, t:9.49, ng:true },
    { d:"03/01", s:"Publix", r:"DISH SOAP", n:"Dawn Dish Soap", c:"Cleaning", q:1, u:3.79, t:3.79, ng:true },
    // ── Mar 4 — Walmart trip ──
    { d:"03/04", s:"Walmart", r:"ORNG JUICE 52OZ", n:"Orange Juice 52oz", c:"Beverages", q:1, u:4.28, t:4.28, ng:false },
    { d:"03/04", s:"Walmart", r:"SPGHTTI 1LB", n:"Spaghetti Pasta 1lb", c:"Grains & Bread", q:2, u:1.38, t:2.76, ng:false },
    { d:"03/04", s:"Walmart", r:"MRNRA SAUCE", n:"Marinara Sauce Jar", c:"Canned Goods", q:1, u:2.68, t:2.68, ng:false },
    { d:"03/04", s:"Walmart", r:"PNTR BTTR", n:"Peanut Butter 16oz", c:"Condiments", q:1, u:3.68, t:3.68, ng:false },
    { d:"03/04", s:"Walmart", r:"STRAWBERRIES", n:"Strawberries 1lb", c:"Produce", q:2, u:3.47, t:6.94, ng:false },
    { d:"03/04", s:"Walmart", r:"FROZ PIZZA", n:"Frozen Pizza DiGiorno", c:"Frozen", q:2, u:6.28, t:12.56, ng:false },
    { d:"03/04", s:"Walmart", r:"ICE CREAM PT", n:"Ice Cream Pint", c:"Frozen", q:1, u:4.68, t:4.68, ng:false },
    { d:"03/04", s:"Walmart", r:"CHIPS LAYS", n:"Lays Potato Chips", c:"Snacks", q:1, u:4.48, t:4.48, ng:false },
    { d:"03/04", s:"Walmart", r:"TOOTHPASTE", n:"Colgate Toothpaste", c:"Personal Care", q:1, u:3.67, t:3.67, ng:true },
    { d:"03/04", s:"Walmart", r:"BABY WIPES 80CT", n:"Baby Wipes 80ct", c:"Baby", q:1, u:3.17, t:3.17, ng:true },
    // ── Mar 7 — Costco trip ──
    { d:"03/07", s:"Costco", r:"RTSRE CHKN", n:"Rotisserie Chicken", c:"Proteins", q:1, u:4.99, t:4.99, ng:false },
    { d:"03/07", s:"Costco", r:"SALMON FILLET", n:"Atlantic Salmon Fillet 2lb", c:"Proteins", q:1, u:15.99, t:15.99, ng:false },
    { d:"03/07", s:"Costco", r:"SHRDD CHEESE 5LB", n:"Shredded Cheese 5lb", c:"Dairy", q:1, u:13.49, t:13.49, ng:false },
    { d:"03/07", s:"Costco", r:"GREEK YOGURT", n:"Greek Yogurt Plain 32oz", c:"Dairy", q:2, u:6.29, t:12.58, ng:false },
    { d:"03/07", s:"Costco", r:"AVOCADOS 6PK", n:"Avocados 6-Pack", c:"Produce", q:1, u:7.49, t:7.49, ng:false },
    { d:"03/07", s:"Costco", r:"MIXED BERRIES", n:"Mixed Berries Frozen 3lb", c:"Frozen", q:1, u:10.49, t:10.49, ng:false },
    { d:"03/07", s:"Costco", r:"OLIVE OIL 1L", n:"Extra Virgin Olive Oil 1 Liter", c:"Condiments", q:1, u:9.99, t:9.99, ng:false },
    { d:"03/07", s:"Costco", r:"PAPR TOWL 12PK", n:"Paper Towels 12-Pack", c:"Household", q:1, u:19.49, t:19.49, ng:true },
    { d:"03/07", s:"Costco", r:"TRASH BAGS 200", n:"Trash Bags 200ct", c:"Cleaning", q:1, u:16.49, t:16.49, ng:true },
    // ── Mar 10 — Target trip ──
    { d:"03/10", s:"Target", r:"ALMD MILK", n:"Almond Milk 64oz", c:"Dairy", q:1, u:3.69, t:3.69, ng:false },
    { d:"03/10", s:"Target", r:"GRANOLA BARS", n:"Nature Valley Granola Bars", c:"Snacks", q:2, u:4.19, t:8.38, ng:false },
    { d:"03/10", s:"Target", r:"APPLES 3LB", n:"Gala Apples 3lb Bag", c:"Produce", q:1, u:5.29, t:5.29, ng:false },
    { d:"03/10", s:"Target", r:"RICE 5LB", n:"Jasmine Rice 5lb", c:"Grains & Bread", q:1, u:6.79, t:6.79, ng:false },
    { d:"03/10", s:"Target", r:"CANNED TUNA 4P", n:"Canned Tuna 4-Pack", c:"Canned Goods", q:1, u:5.49, t:5.49, ng:false },
    { d:"03/10", s:"Target", r:"GOLDFISH SNCK", n:"Goldfish Crackers", c:"Snacks", q:1, u:3.19, t:3.19, ng:false },
    { d:"03/10", s:"Target", r:"BABY FOOD 8PK", n:"Baby Food Variety 8-Pack", c:"Baby", q:1, u:9.29, t:9.29, ng:true },
    { d:"03/10", s:"Target", r:"SHAMPOO", n:"Pantene Shampoo", c:"Personal Care", q:1, u:7.29, t:7.29, ng:true },
    // ── Mar 13 — Aldi trip ──
    { d:"03/13", s:"Aldi", r:"WHOLE CHKN", n:"Whole Chicken", c:"Proteins", q:1, u:5.69, t:5.69, ng:false },
    { d:"03/13", s:"Aldi", r:"BELL PEPPERS", n:"Bell Peppers 3-Pack", c:"Produce", q:1, u:2.89, t:2.89, ng:false },
    { d:"03/13", s:"Aldi", r:"ONION 3LB", n:"Yellow Onions 3lb", c:"Produce", q:1, u:2.19, t:2.19, ng:false },
    { d:"03/13", s:"Aldi", r:"BUTTER", n:"Unsalted Butter 1lb", c:"Dairy", q:1, u:3.69, t:3.69, ng:false },
    { d:"03/13", s:"Aldi", r:"TOMATO SOUP", n:"Tomato Soup Can", c:"Canned Goods", q:3, u:1.09, t:3.27, ng:false },
    { d:"03/13", s:"Aldi", r:"TORTILLA CHIPS", n:"Tortilla Chips", c:"Snacks", q:1, u:1.99, t:1.99, ng:false },
    { d:"03/13", s:"Aldi", r:"CHOC CHIP COOK", n:"Chocolate Chip Cookies", c:"Snacks", q:1, u:2.69, t:2.69, ng:false },
    { d:"03/13", s:"Aldi", r:"LAUNDRY DET", n:"Laundry Detergent", c:"Cleaning", q:1, u:6.29, t:6.29, ng:true },
    // ── Mar 16 — Publix trip ──
    { d:"03/16", s:"Publix", r:"TILAPIA FILLET", n:"Tilapia Fillet 1lb", c:"Proteins", q:1, u:8.49, t:8.49, ng:false },
    { d:"03/16", s:"Publix", r:"SOUR CREAM", n:"Sour Cream 16oz", c:"Dairy", q:1, u:2.99, t:2.99, ng:false },
    { d:"03/16", s:"Publix", r:"SPINACH BAG", n:"Baby Spinach 5oz", c:"Produce", q:2, u:3.19, t:6.38, ng:false },
    { d:"03/16", s:"Publix", r:"TOMATOES ROMA", n:"Roma Tomatoes 1lb", c:"Produce", q:1, u:2.19, t:2.19, ng:false },
    { d:"03/16", s:"Publix", r:"CRCKRS RITZ", n:"Ritz Crackers", c:"Snacks", q:1, u:4.19, t:4.19, ng:false },
    { d:"03/16", s:"Publix", r:"WATER 24PK", n:"Bottled Water 24-Pack", c:"Beverages", q:1, u:4.29, t:4.29, ng:false },
    { d:"03/16", s:"Publix", r:"BAKING SODA", n:"Baking Soda 1lb", c:"Baking", q:1, u:0.99, t:0.99, ng:false },
    { d:"03/16", s:"Publix", r:"NAPKINS 200CT", n:"Paper Napkins 200ct", c:"Household", q:1, u:3.69, t:3.69, ng:true },
    // ── Mar 19 — Trader Joe's trip ──
    { d:"03/19", s:"Trader Joe's", r:"ORG EGGS", n:"Organic Free Range Eggs", c:"Dairy", q:1, u:5.79, t:5.79, ng:false },
    { d:"03/19", s:"Trader Joe's", r:"CAULIFLWR RICE", n:"Cauliflower Rice Frozen", c:"Frozen", q:1, u:3.19, t:3.19, ng:false },
    { d:"03/19", s:"Trader Joe's", r:"MNDARIN ORNGS", n:"Mandarin Oranges Bag", c:"Produce", q:1, u:3.69, t:3.69, ng:false },
    { d:"03/19", s:"Trader Joe's", r:"HUMMUS", n:"Classic Hummus", c:"Condiments", q:1, u:3.19, t:3.19, ng:false },
    { d:"03/19", s:"Trader Joe's", r:"TRKY BURGER", n:"Turkey Burgers Frozen", c:"Proteins", q:1, u:5.29, t:5.29, ng:false },
    { d:"03/19", s:"Trader Joe's", r:"DARK CHOC BAR", n:"Dark Chocolate Bar 72%", c:"Snacks", q:2, u:2.19, t:4.38, ng:false },
    { d:"03/19", s:"Trader Joe's", r:"EVERYTHING BAGEL", n:"Everything Bagels 6-Pack", c:"Grains & Bread", q:1, u:3.69, t:3.69, ng:false },
    { d:"03/19", s:"Trader Joe's", r:"SPARKLING WATER", n:"Sparkling Water 12-Pack", c:"Beverages", q:1, u:4.69, t:4.69, ng:false },
    // ── Mar 22 — Walmart trip ──
    { d:"03/22", s:"Walmart", r:"PORK CHOPS", n:"Pork Chops Bone-In", c:"Proteins", q:1, u:6.27, t:6.27, ng:false },
    { d:"03/22", s:"Walmart", r:"CHEDDR CHEESE", n:"Cheddar Cheese Blk 8oz", c:"Dairy", q:1, u:4.18, t:4.18, ng:false },
    { d:"03/22", s:"Walmart", r:"CARROTS 2LB", n:"Baby Carrots 2lb", c:"Produce", q:1, u:2.67, t:2.67, ng:false },
    { d:"03/22", s:"Walmart", r:"POTATOES 5LB", n:"Russet Potatoes 5lb", c:"Produce", q:1, u:4.17, t:4.17, ng:false },
    { d:"03/22", s:"Walmart", r:"MAC N CHEESE", n:"Kraft Mac & Cheese 3-Pack", c:"Grains & Bread", q:1, u:3.98, t:3.98, ng:false },
    { d:"03/22", s:"Walmart", r:"APPLE JUICE", n:"Apple Juice 64oz", c:"Beverages", q:1, u:3.18, t:3.18, ng:false },
    { d:"03/22", s:"Walmart", r:"FLOUR 5LB", n:"All Purpose Flour 5lb", c:"Baking", q:1, u:2.98, t:2.98, ng:false },
    { d:"03/22", s:"Walmart", r:"SUGAR 4LB", n:"Granulated Sugar 4lb", c:"Baking", q:1, u:3.18, t:3.18, ng:false },
    { d:"03/22", s:"Walmart", r:"BODY WASH", n:"Dove Body Wash", c:"Personal Care", q:1, u:6.27, t:6.27, ng:true },
    { d:"03/22", s:"Walmart", r:"HAND SOAP 3PK", n:"Hand Soap 3-Pack", c:"Cleaning", q:1, u:4.67, t:4.67, ng:true },
    // ── Mar 25 — Publix trip ──
    { d:"03/25", s:"Publix", r:"BNLS CHKN BRST", n:"Boneless Chicken Breast", c:"Proteins", q:2, u:6.49, t:12.98, ng:false },
    { d:"03/25", s:"Publix", r:"SHRIMP 1LB", n:"Jumbo Shrimp 1lb", c:"Proteins", q:1, u:10.49, t:10.49, ng:false },
    { d:"03/25", s:"Publix", r:"CREAM CHEESE", n:"Cream Cheese Block", c:"Dairy", q:1, u:2.69, t:2.69, ng:false },
    { d:"03/25", s:"Publix", r:"MUSHROOMS 8OZ", n:"Baby Bella Mushrooms 8oz", c:"Produce", q:1, u:3.19, t:3.19, ng:false },
    { d:"03/25", s:"Publix", r:"ZUCCHINI LB", n:"Zucchini 1lb", c:"Produce", q:2, u:1.79, t:3.58, ng:false },
    { d:"03/25", s:"Publix", r:"DINNER ROLLS", n:"Hawaiian Dinner Rolls 12ct", c:"Grains & Bread", q:1, u:4.69, t:4.69, ng:false },
    { d:"03/25", s:"Publix", r:"WINE RED", n:"Red Wine Bottle", c:"Beverages", q:1, u:9.49, t:9.49, ng:false },
    { d:"03/25", s:"Publix", r:"CHOC CHIPS 12", n:"Chocolate Chips 12oz", c:"Baking", q:1, u:3.69, t:3.69, ng:false },
    // ── Mar 28 — Aldi trip ──
    { d:"03/28", s:"Aldi", r:"BACON 1LB", n:"Bacon 1lb", c:"Proteins", q:1, u:5.29, t:5.29, ng:false },
    { d:"03/28", s:"Aldi", r:"GARLIC 3PK", n:"Garlic 3-Pack", c:"Produce", q:1, u:1.59, t:1.59, ng:false },
    { d:"03/28", s:"Aldi", r:"CUCUMBER", n:"English Cucumber", c:"Produce", q:2, u:0.99, t:1.98, ng:false },
    { d:"03/28", s:"Aldi", r:"WAFFLES FRZN", n:"Frozen Waffles 10ct", c:"Frozen", q:1, u:2.19, t:2.19, ng:false },
    { d:"03/28", s:"Aldi", r:"PRETZELS", n:"Mini Pretzels Bag", c:"Snacks", q:1, u:1.59, t:1.59, ng:false },
    { d:"03/28", s:"Aldi", r:"DEODORANT", n:"Old Spice Deodorant", c:"Personal Care", q:1, u:4.19, t:4.19, ng:true },
    { d:"03/28", s:"Aldi", r:"DIAPER SZ3 36", n:"Diapers Size 3 36ct", c:"Baby", q:1, u:6.79, t:6.79, ng:true }
  ]
};

// ── Expenses Demo Data: 3 months ──
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
  ],
  "2026_01": [
    // Housing & Utilities
    { id:"d-301", date:"2026-01-01", description:"RENT PAYMENT - JANUARY", merchant:"Apartment Rent", category:"Housing", amount:1850.00, source:"csv", bank:"Chase", _origCategory:"Housing", _manualCategory:false },
    { id:"d-302", date:"2026-01-05", description:"GEORGIA POWER BILL", merchant:"Georgia Power", category:"Utilities", amount:158.40, source:"csv", bank:"Chase", _origCategory:"Utilities", _manualCategory:false },
    { id:"d-303", date:"2026-01-06", description:"SPECTRUM INTERNET JAN", merchant:"Spectrum", category:"Utilities", amount:79.99, source:"csv", bank:"Chase", _origCategory:"Utilities", _manualCategory:false },
    { id:"d-304", date:"2026-01-09", description:"ATLANTA WATERSHED MGMT", merchant:"Atlanta Water", category:"Utilities", amount:66.80, source:"csv", bank:"Chase", _origCategory:"Utilities", _manualCategory:false },
    // Subscriptions
    { id:"d-305", date:"2026-01-01", description:"NETFLIX.COM", merchant:"Netflix", category:"Subscriptions", amount:15.49, source:"csv", bank:"Chase", _origCategory:"Subscriptions", _manualCategory:false },
    { id:"d-306", date:"2026-01-01", description:"SPOTIFY USA", merchant:"Spotify", category:"Subscriptions", amount:10.99, source:"csv", bank:"Chase", _origCategory:"Subscriptions", _manualCategory:false },
    { id:"d-307", date:"2026-01-03", description:"PLANET FITNESS MONTHLY", merchant:"Planet Fitness", category:"Subscriptions", amount:24.99, source:"csv", bank:"Chase", _origCategory:"Subscriptions", _manualCategory:false },
    { id:"d-308", date:"2026-01-05", description:"APPLE.COM/BILL ICLOUD", merchant:"Apple iCloud", category:"Subscriptions", amount:2.99, source:"csv", bank:"Chase", _origCategory:"Subscriptions", _manualCategory:false },
    { id:"d-309", date:"2026-01-10", description:"AMAZON PRIME MEMBER", merchant:"Amazon Prime", category:"Subscriptions", amount:14.99, source:"csv", bank:"Chase", _origCategory:"Subscriptions", _manualCategory:false },
    // Transportation & Gas
    { id:"d-310", date:"2026-01-04", description:"SHELL OIL 57442 ATLANTA GA", merchant:"Shell", category:"Gas & Fuel", amount:44.20, source:"csv", bank:"BoA", _origCategory:"Gas & Fuel", _manualCategory:false },
    { id:"d-311", date:"2026-01-15", description:"QT 5289 DECATUR GA", merchant:"QuikTrip", category:"Gas & Fuel", amount:41.85, source:"csv", bank:"BoA", _origCategory:"Gas & Fuel", _manualCategory:false },
    { id:"d-312", date:"2026-01-26", description:"BP #891024 ATLANTA GA", merchant:"BP", category:"Gas & Fuel", amount:46.30, source:"csv", bank:"BoA", _origCategory:"Gas & Fuel", _manualCategory:false },
    { id:"d-313", date:"2026-01-06", description:"MARTA BREEZE CARD RELOAD", merchant:"MARTA Transit", category:"Transportation", amount:45.00, source:"csv", bank:"Chase", _origCategory:"Transportation", _manualCategory:false },
    // Dining (slightly fewer — post-holiday belt-tightening)
    { id:"d-314", date:"2026-01-02", description:"STARBUCKS #12345 ATLANTA GA", merchant:"Starbucks", category:"Dining", amount:5.85, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-315", date:"2026-01-05", description:"CHICK-FIL-A #2198", merchant:"Chick-fil-A", category:"Dining", amount:10.80, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-316", date:"2026-01-08", description:"WAFFLE HOUSE #1052", merchant:"Waffle House", category:"Dining", amount:16.40, source:"csv", bank:"BoA", _origCategory:"Dining", _manualCategory:false },
    { id:"d-317", date:"2026-01-11", description:"STARBUCKS #12345 ATLANTA GA", merchant:"Starbucks", category:"Dining", amount:6.20, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-318", date:"2026-01-14", description:"CHIPOTLE ONLINE 3847", merchant:"Chipotle", category:"Dining", amount:14.25, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-319", date:"2026-01-18", description:"PANDA EXPRESS 0482", merchant:"Panda Express", category:"Dining", amount:12.40, source:"csv", bank:"BoA", _origCategory:"Dining", _manualCategory:false },
    { id:"d-320", date:"2026-01-22", description:"STARBUCKS #12345 ATLANTA GA", merchant:"Starbucks", category:"Dining", amount:7.10, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-321", date:"2026-01-27", description:"ZAXBYS #10842", merchant:"Zaxby's", category:"Dining", amount:13.90, source:"csv", bank:"BoA", _origCategory:"Dining", _manualCategory:false },
    // Groceries (conservative — post-holiday)
    { id:"d-322", date:"2026-01-03", description:"PUBLIX #1247 ATLANTA GA", merchant:"Publix", category:"Groceries", amount:78.50, source:"csv", bank:"Chase", _origCategory:"Groceries", _manualCategory:false },
    { id:"d-323", date:"2026-01-07", description:"ALDI 35017 DECATUR GA", merchant:"Aldi", category:"Groceries", amount:38.20, source:"csv", bank:"Chase", _origCategory:"Groceries", _manualCategory:false },
    { id:"d-324", date:"2026-01-12", description:"WALMART SUPERCENTER 2841", merchant:"Walmart", category:"Groceries", amount:62.40, source:"csv", bank:"BoA", _origCategory:"Groceries", _manualCategory:false },
    { id:"d-325", date:"2026-01-18", description:"TRADER JOE'S #128", merchant:"Trader Joe's", category:"Groceries", amount:48.90, source:"csv", bank:"Chase", _origCategory:"Groceries", _manualCategory:false },
    { id:"d-326", date:"2026-01-24", description:"PUBLIX #1247 ATLANTA GA", merchant:"Publix", category:"Groceries", amount:85.60, source:"csv", bank:"Chase", _origCategory:"Groceries", _manualCategory:false },
    { id:"d-327", date:"2026-01-29", description:"COSTCO WHSE #1182", merchant:"Costco", category:"Groceries", amount:118.40, source:"csv", bank:"Chase", _origCategory:"Groceries", _manualCategory:false },
    // Shopping (minimal — post-holiday)
    { id:"d-328", date:"2026-01-08", description:"AMAZON.COM*1R4KN7PL3", merchant:"Amazon", category:"Shopping", amount:18.99, source:"csv", bank:"Chase", _origCategory:"Shopping", _manualCategory:false },
    { id:"d-329", date:"2026-01-20", description:"TARGET T-2145 ATLANTA GA", merchant:"Target", category:"Shopping", amount:32.50, source:"csv", bank:"Chase", _origCategory:"Shopping", _manualCategory:false },
    // Entertainment (light month)
    { id:"d-330", date:"2026-01-17", description:"AMC THEATRES #2841", merchant:"AMC Theatres", category:"Entertainment", amount:28.00, source:"csv", bank:"Chase", _origCategory:"Entertainment", _manualCategory:false },
    // Healthcare & Insurance
    { id:"d-331", date:"2026-01-07", description:"CVS/PHARMACY #4182", merchant:"CVS Pharmacy", category:"Healthcare", amount:12.80, source:"csv", bank:"Chase", _origCategory:"Healthcare", _manualCategory:false },
    { id:"d-332", date:"2026-01-15", description:"STATE FARM INSURANCE", merchant:"State Farm", category:"Insurance", amount:156.00, source:"csv", bank:"Chase", _origCategory:"Insurance", _manualCategory:false },
    // Personal Care
    { id:"d-333", date:"2026-01-10", description:"GREAT CLIPS #7291", merchant:"Great Clips", category:"Personal Care", amount:22.00, source:"csv", bank:"Chase", _origCategory:"Personal Care", _manualCategory:false },
    // Misc
    { id:"d-334", date:"2026-01-13", description:"USPS PO 0519281234", merchant:"USPS", category:"Misc", amount:9.80, source:"csv", bank:"Chase", _origCategory:"Misc", _manualCategory:false },
    { id:"d-335", date:"2026-01-21", description:"DRY CLEAN SUPER CENTER", merchant:"Dry Cleaners", category:"Misc", amount:18.00, source:"csv", bank:"BoA", _origCategory:"Misc", _manualCategory:false }
  ],
  "2026_02": [
    // Housing & Utilities
    { id:"d-401", date:"2026-02-01", description:"RENT PAYMENT - FEBRUARY", merchant:"Apartment Rent", category:"Housing", amount:1850.00, source:"csv", bank:"Chase", _origCategory:"Housing", _manualCategory:false },
    { id:"d-402", date:"2026-02-04", description:"GEORGIA POWER BILL", merchant:"Georgia Power", category:"Utilities", amount:148.60, source:"csv", bank:"Chase", _origCategory:"Utilities", _manualCategory:false },
    { id:"d-403", date:"2026-02-05", description:"SPECTRUM INTERNET FEB", merchant:"Spectrum", category:"Utilities", amount:79.99, source:"csv", bank:"Chase", _origCategory:"Utilities", _manualCategory:false },
    { id:"d-404", date:"2026-02-08", description:"ATLANTA WATERSHED MGMT", merchant:"Atlanta Water", category:"Utilities", amount:67.50, source:"csv", bank:"Chase", _origCategory:"Utilities", _manualCategory:false },
    // Subscriptions
    { id:"d-405", date:"2026-02-01", description:"NETFLIX.COM", merchant:"Netflix", category:"Subscriptions", amount:15.49, source:"csv", bank:"Chase", _origCategory:"Subscriptions", _manualCategory:false },
    { id:"d-406", date:"2026-02-01", description:"SPOTIFY USA", merchant:"Spotify", category:"Subscriptions", amount:10.99, source:"csv", bank:"Chase", _origCategory:"Subscriptions", _manualCategory:false },
    { id:"d-407", date:"2026-02-03", description:"PLANET FITNESS MONTHLY", merchant:"Planet Fitness", category:"Subscriptions", amount:24.99, source:"csv", bank:"Chase", _origCategory:"Subscriptions", _manualCategory:false },
    { id:"d-408", date:"2026-02-05", description:"APPLE.COM/BILL ICLOUD", merchant:"Apple iCloud", category:"Subscriptions", amount:2.99, source:"csv", bank:"Chase", _origCategory:"Subscriptions", _manualCategory:false },
    { id:"d-409", date:"2026-02-10", description:"AMAZON PRIME MEMBER", merchant:"Amazon Prime", category:"Subscriptions", amount:14.99, source:"csv", bank:"Chase", _origCategory:"Subscriptions", _manualCategory:false },
    // Transportation & Gas
    { id:"d-410", date:"2026-02-03", description:"SHELL OIL 57442 ATLANTA GA", merchant:"Shell", category:"Gas & Fuel", amount:47.60, source:"csv", bank:"BoA", _origCategory:"Gas & Fuel", _manualCategory:false },
    { id:"d-411", date:"2026-02-13", description:"QT 5289 DECATUR GA", merchant:"QuikTrip", category:"Gas & Fuel", amount:43.25, source:"csv", bank:"BoA", _origCategory:"Gas & Fuel", _manualCategory:false },
    { id:"d-412", date:"2026-02-23", description:"SHELL OIL 57442 ATLANTA GA", merchant:"Shell", category:"Gas & Fuel", amount:49.80, source:"csv", bank:"BoA", _origCategory:"Gas & Fuel", _manualCategory:false },
    { id:"d-413", date:"2026-02-06", description:"MARTA BREEZE CARD RELOAD", merchant:"MARTA Transit", category:"Transportation", amount:45.00, source:"csv", bank:"Chase", _origCategory:"Transportation", _manualCategory:false },
    // Dining
    { id:"d-414", date:"2026-02-01", description:"STARBUCKS #12345 ATLANTA GA", merchant:"Starbucks", category:"Dining", amount:6.45, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-415", date:"2026-02-03", description:"CHICK-FIL-A #2198", merchant:"Chick-fil-A", category:"Dining", amount:11.80, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-416", date:"2026-02-06", description:"CHIPOTLE ONLINE 3847", merchant:"Chipotle", category:"Dining", amount:15.60, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-417", date:"2026-02-08", description:"WAFFLE HOUSE #1052", merchant:"Waffle House", category:"Dining", amount:17.90, source:"csv", bank:"BoA", _origCategory:"Dining", _manualCategory:false },
    { id:"d-418", date:"2026-02-10", description:"STARBUCKS #12345 ATLANTA GA", merchant:"Starbucks", category:"Dining", amount:5.95, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-419", date:"2026-02-13", description:"OLIVE GARDEN #1284", merchant:"Olive Garden", category:"Dining", amount:48.60, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-420", date:"2026-02-14", description:"THE CHEESECAKE FACTORY", merchant:"Cheesecake Factory", category:"Dining", amount:72.80, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-421", date:"2026-02-17", description:"STARBUCKS #12345 ATLANTA GA", merchant:"Starbucks", category:"Dining", amount:7.30, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-422", date:"2026-02-21", description:"PANDA EXPRESS 0482", merchant:"Panda Express", category:"Dining", amount:13.40, source:"csv", bank:"BoA", _origCategory:"Dining", _manualCategory:false },
    { id:"d-423", date:"2026-02-25", description:"IHOP #8291 ATLANTA GA", merchant:"IHOP", category:"Dining", amount:24.50, source:"csv", bank:"BoA", _origCategory:"Dining", _manualCategory:false },
    // Groceries
    { id:"d-424", date:"2026-02-01", description:"PUBLIX #1247 ATLANTA GA", merchant:"Publix", category:"Groceries", amount:84.20, source:"csv", bank:"Chase", _origCategory:"Groceries", _manualCategory:false },
    { id:"d-425", date:"2026-02-05", description:"WALMART SUPERCENTER 2841", merchant:"Walmart", category:"Groceries", amount:68.90, source:"csv", bank:"BoA", _origCategory:"Groceries", _manualCategory:false },
    { id:"d-426", date:"2026-02-09", description:"COSTCO WHSE #1182", merchant:"Costco", category:"Groceries", amount:138.50, source:"csv", bank:"Chase", _origCategory:"Groceries", _manualCategory:false },
    { id:"d-427", date:"2026-02-14", description:"ALDI 35017 DECATUR GA", merchant:"Aldi", category:"Groceries", amount:42.30, source:"csv", bank:"Chase", _origCategory:"Groceries", _manualCategory:false },
    { id:"d-428", date:"2026-02-19", description:"TRADER JOE'S #128", merchant:"Trader Joe's", category:"Groceries", amount:52.60, source:"csv", bank:"Chase", _origCategory:"Groceries", _manualCategory:false },
    { id:"d-429", date:"2026-02-25", description:"PUBLIX #1247 ATLANTA GA", merchant:"Publix", category:"Groceries", amount:91.40, source:"csv", bank:"Chase", _origCategory:"Groceries", _manualCategory:false },
    // Shopping
    { id:"d-430", date:"2026-02-07", description:"AMAZON.COM*3K7NP4ML2", merchant:"Amazon", category:"Shopping", amount:42.99, source:"csv", bank:"Chase", _origCategory:"Shopping", _manualCategory:false },
    { id:"d-431", date:"2026-02-12", description:"TARGET T-2145 ATLANTA GA", merchant:"Target", category:"Shopping", amount:56.80, source:"csv", bank:"Chase", _origCategory:"Shopping", _manualCategory:false },
    { id:"d-432", date:"2026-02-20", description:"AMAZON.COM*8M2KL5QR9", merchant:"Amazon", category:"Shopping", amount:34.50, source:"csv", bank:"Chase", _origCategory:"Shopping", _manualCategory:false },
    // Entertainment
    { id:"d-433", date:"2026-02-07", description:"AMC THEATRES #2841", merchant:"AMC Theatres", category:"Entertainment", amount:30.00, source:"csv", bank:"Chase", _origCategory:"Entertainment", _manualCategory:false },
    { id:"d-434", date:"2026-02-21", description:"DAVE & BUSTERS 1028", merchant:"Dave & Busters", category:"Entertainment", amount:52.00, source:"csv", bank:"BoA", _origCategory:"Entertainment", _manualCategory:false },
    // Healthcare & Insurance
    { id:"d-435", date:"2026-02-04", description:"CVS/PHARMACY #4182", merchant:"CVS Pharmacy", category:"Healthcare", amount:22.40, source:"csv", bank:"Chase", _origCategory:"Healthcare", _manualCategory:false },
    { id:"d-436", date:"2026-02-15", description:"STATE FARM INSURANCE", merchant:"State Farm", category:"Insurance", amount:156.00, source:"csv", bank:"Chase", _origCategory:"Insurance", _manualCategory:false },
    { id:"d-437", date:"2026-02-18", description:"KAISER PERMANENTE COPAY", merchant:"Kaiser Permanente", category:"Healthcare", amount:30.00, source:"csv", bank:"Chase", _origCategory:"Healthcare", _manualCategory:false },
    // Personal Care
    { id:"d-438", date:"2026-02-10", description:"GREAT CLIPS #7291", merchant:"Great Clips", category:"Personal Care", amount:22.00, source:"csv", bank:"Chase", _origCategory:"Personal Care", _manualCategory:false },
    // Misc
    { id:"d-439", date:"2026-02-11", description:"USPS PO 0519281234", merchant:"USPS", category:"Misc", amount:11.40, source:"csv", bank:"Chase", _origCategory:"Misc", _manualCategory:false },
    { id:"d-440", date:"2026-02-22", description:"DRY CLEAN SUPER CENTER", merchant:"Dry Cleaners", category:"Misc", amount:18.00, source:"csv", bank:"BoA", _origCategory:"Misc", _manualCategory:false }
  ],
  "2026_03": [
    // Housing & Utilities
    { id:"d-201", date:"2026-03-01", description:"RENT PAYMENT - MARCH", merchant:"Apartment Rent", category:"Housing", amount:1850.00, source:"csv", bank:"Chase", _origCategory:"Housing", _manualCategory:false },
    { id:"d-202", date:"2026-03-04", description:"GEORGIA POWER BILL", merchant:"Georgia Power", category:"Utilities", amount:135.80, source:"csv", bank:"Chase", _origCategory:"Utilities", _manualCategory:false },
    { id:"d-203", date:"2026-03-05", description:"SPECTRUM INTERNET MAR", merchant:"Spectrum", category:"Utilities", amount:79.99, source:"csv", bank:"Chase", _origCategory:"Utilities", _manualCategory:false },
    { id:"d-204", date:"2026-03-09", description:"ATLANTA WATERSHED MGMT", merchant:"Atlanta Water", category:"Utilities", amount:65.40, source:"csv", bank:"Chase", _origCategory:"Utilities", _manualCategory:false },
    // Subscriptions
    { id:"d-205", date:"2026-03-01", description:"NETFLIX.COM", merchant:"Netflix", category:"Subscriptions", amount:15.49, source:"csv", bank:"Chase", _origCategory:"Subscriptions", _manualCategory:false },
    { id:"d-206", date:"2026-03-01", description:"SPOTIFY USA", merchant:"Spotify", category:"Subscriptions", amount:10.99, source:"csv", bank:"Chase", _origCategory:"Subscriptions", _manualCategory:false },
    { id:"d-207", date:"2026-03-03", description:"PLANET FITNESS MONTHLY", merchant:"Planet Fitness", category:"Subscriptions", amount:24.99, source:"csv", bank:"Chase", _origCategory:"Subscriptions", _manualCategory:false },
    { id:"d-208", date:"2026-03-05", description:"APPLE.COM/BILL ICLOUD", merchant:"Apple iCloud", category:"Subscriptions", amount:2.99, source:"csv", bank:"Chase", _origCategory:"Subscriptions", _manualCategory:false },
    { id:"d-209", date:"2026-03-10", description:"AMAZON PRIME MEMBER", merchant:"Amazon Prime", category:"Subscriptions", amount:14.99, source:"csv", bank:"Chase", _origCategory:"Subscriptions", _manualCategory:false },
    // Transportation & Gas
    { id:"d-210", date:"2026-03-03", description:"SHELL OIL 57442 ATLANTA GA", merchant:"Shell", category:"Gas & Fuel", amount:46.80, source:"csv", bank:"BoA", _origCategory:"Gas & Fuel", _manualCategory:false },
    { id:"d-211", date:"2026-03-12", description:"QT 5289 DECATUR GA", merchant:"QuikTrip", category:"Gas & Fuel", amount:43.50, source:"csv", bank:"BoA", _origCategory:"Gas & Fuel", _manualCategory:false },
    { id:"d-212", date:"2026-03-22", description:"SHELL OIL 57442 ATLANTA GA", merchant:"Shell", category:"Gas & Fuel", amount:48.10, source:"csv", bank:"BoA", _origCategory:"Gas & Fuel", _manualCategory:false },
    { id:"d-213", date:"2026-03-06", description:"MARTA BREEZE CARD RELOAD", merchant:"MARTA Transit", category:"Transportation", amount:45.00, source:"csv", bank:"Chase", _origCategory:"Transportation", _manualCategory:false },
    // Dining
    { id:"d-214", date:"2026-03-02", description:"STARBUCKS #12345 ATLANTA GA", merchant:"Starbucks", category:"Dining", amount:6.85, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-215", date:"2026-03-04", description:"CHICK-FIL-A #2198", merchant:"Chick-fil-A", category:"Dining", amount:12.60, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-216", date:"2026-03-07", description:"CHIPOTLE ONLINE 3847", merchant:"Chipotle", category:"Dining", amount:15.40, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-217", date:"2026-03-09", description:"WAFFLE HOUSE #1052", merchant:"Waffle House", category:"Dining", amount:19.80, source:"csv", bank:"BoA", _origCategory:"Dining", _manualCategory:false },
    { id:"d-218", date:"2026-03-11", description:"STARBUCKS #12345 ATLANTA GA", merchant:"Starbucks", category:"Dining", amount:5.95, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-219", date:"2026-03-14", description:"LONGHORN STEAKHOUSE #489", merchant:"LongHorn Steakhouse", category:"Dining", amount:58.40, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-220", date:"2026-03-17", description:"PANDA EXPRESS 0482", merchant:"Panda Express", category:"Dining", amount:13.60, source:"csv", bank:"BoA", _origCategory:"Dining", _manualCategory:false },
    { id:"d-221", date:"2026-03-20", description:"STARBUCKS #12345 ATLANTA GA", merchant:"Starbucks", category:"Dining", amount:7.45, source:"csv", bank:"Chase", _origCategory:"Dining", _manualCategory:false },
    { id:"d-222", date:"2026-03-24", description:"ZAXBYS #10842", merchant:"Zaxby's", category:"Dining", amount:15.20, source:"csv", bank:"BoA", _origCategory:"Dining", _manualCategory:false },
    { id:"d-223", date:"2026-03-28", description:"IHOP #8291 ATLANTA GA", merchant:"IHOP", category:"Dining", amount:26.50, source:"csv", bank:"BoA", _origCategory:"Dining", _manualCategory:false },
    // Groceries
    { id:"d-224", date:"2026-03-01", description:"PUBLIX #1247 ATLANTA GA", merchant:"Publix", category:"Groceries", amount:82.30, source:"csv", bank:"Chase", _origCategory:"Groceries", _manualCategory:false },
    { id:"d-225", date:"2026-03-04", description:"WALMART SUPERCENTER 2841", merchant:"Walmart", category:"Groceries", amount:71.20, source:"csv", bank:"BoA", _origCategory:"Groceries", _manualCategory:false },
    { id:"d-226", date:"2026-03-07", description:"COSTCO WHSE #1182", merchant:"Costco", category:"Groceries", amount:145.60, source:"csv", bank:"Chase", _origCategory:"Groceries", _manualCategory:false },
    { id:"d-227", date:"2026-03-13", description:"ALDI 35017 DECATUR GA", merchant:"Aldi", category:"Groceries", amount:38.90, source:"csv", bank:"Chase", _origCategory:"Groceries", _manualCategory:false },
    { id:"d-228", date:"2026-03-19", description:"TRADER JOE'S #128", merchant:"Trader Joe's", category:"Groceries", amount:54.80, source:"csv", bank:"Chase", _origCategory:"Groceries", _manualCategory:false },
    { id:"d-229", date:"2026-03-25", description:"PUBLIX #1247 ATLANTA GA", merchant:"Publix", category:"Groceries", amount:95.40, source:"csv", bank:"Chase", _origCategory:"Groceries", _manualCategory:false },
    // Shopping
    { id:"d-230", date:"2026-03-06", description:"AMAZON.COM*5N8KP2MQ4", merchant:"Amazon", category:"Shopping", amount:28.99, source:"csv", bank:"Chase", _origCategory:"Shopping", _manualCategory:false },
    { id:"d-231", date:"2026-03-11", description:"TARGET T-2145 ATLANTA GA", merchant:"Target", category:"Shopping", amount:52.40, source:"csv", bank:"Chase", _origCategory:"Shopping", _manualCategory:false },
    { id:"d-232", date:"2026-03-18", description:"AMAZON.COM*7K3ML9NR2", merchant:"Amazon", category:"Shopping", amount:44.50, source:"csv", bank:"Chase", _origCategory:"Shopping", _manualCategory:false },
    { id:"d-233", date:"2026-03-25", description:"ROSS DRESS FOR LESS #412", merchant:"Ross", category:"Shopping", amount:36.80, source:"csv", bank:"BoA", _origCategory:"Shopping", _manualCategory:false },
    // Entertainment
    { id:"d-234", date:"2026-03-08", description:"AMC THEATRES #2841", merchant:"AMC Theatres", category:"Entertainment", amount:32.00, source:"csv", bank:"Chase", _origCategory:"Entertainment", _manualCategory:false },
    { id:"d-235", date:"2026-03-21", description:"TOPGOLF ATLANTA", merchant:"TopGolf", category:"Entertainment", amount:65.00, source:"csv", bank:"BoA", _origCategory:"Entertainment", _manualCategory:false },
    // Healthcare & Insurance
    { id:"d-236", date:"2026-03-05", description:"CVS/PHARMACY #4182", merchant:"CVS Pharmacy", category:"Healthcare", amount:18.40, source:"csv", bank:"Chase", _origCategory:"Healthcare", _manualCategory:false },
    { id:"d-237", date:"2026-03-15", description:"STATE FARM INSURANCE", merchant:"State Farm", category:"Insurance", amount:156.00, source:"csv", bank:"Chase", _origCategory:"Insurance", _manualCategory:false },
    { id:"d-238", date:"2026-03-20", description:"KAISER PERMANENTE COPAY", merchant:"Kaiser Permanente", category:"Healthcare", amount:30.00, source:"csv", bank:"Chase", _origCategory:"Healthcare", _manualCategory:false },
    // Personal Care
    { id:"d-239", date:"2026-03-10", description:"GREAT CLIPS #7291", merchant:"Great Clips", category:"Personal Care", amount:22.00, source:"csv", bank:"Chase", _origCategory:"Personal Care", _manualCategory:false },
    // Misc
    { id:"d-240", date:"2026-03-12", description:"USPS PO 0519281234", merchant:"USPS", category:"Misc", amount:12.60, source:"csv", bank:"Chase", _origCategory:"Misc", _manualCategory:false },
    { id:"d-241", date:"2026-03-23", description:"DRY CLEAN SUPER CENTER", merchant:"Dry Cleaners", category:"Misc", amount:18.00, source:"csv", bank:"BoA", _origCategory:"Misc", _manualCategory:false }
  ]
};

// ── Budget Demo Data: setup + 3 months ──
const DEMO_BUDGET_DATA = {
  setup: {
    year: 2026, startMonth: 1,
    categories: [
      {group:'Household',name:'Rent',budget:1850},{group:'Household',name:'Internet',budget:80},
      {group:'Household',name:'Utilities',budget:150},{group:'Household',name:'Phone',budget:65},
      {group:'Food',name:'Groceries',budget:500},{group:'Food',name:'Restaurants',budget:200},
      {group:'Food',name:'Coffee Shops',budget:60},
      {group:'Transportation',name:'Public Transportation',budget:50},{group:'Transportation',name:'Taxi Services',budget:40},
      {group:'Health',name:'Massage Therapist',budget:0},{group:'Health',name:'Dentist',budget:50},
      {group:'Personal',name:'Personal Care',budget:60},{group:'Personal',name:'Gifts / Donations',budget:50},
      {group:'Personal',name:'Clothing',budget:100},{group:'Personal',name:'Travel',budget:0},
      {group:'Personal',name:'Subscriptions',budget:75},{group:'Personal',name:'Fitness',budget:50},
      {group:'Personal',name:'Other',budget:100}
    ],
    extras: Array.from({length:25},function(_,i){return {group:'Extra',name:'Extra '+(i+1),budget:0};}),
    income: [
      {name:'Salary',amount:5200},{name:'Side Gig',amount:400},
      {name:'Income Source 2',amount:0},{name:'Income Source 3',amount:0},{name:'Income Source 4',amount:0}
    ],
    savings: [
      {name:'Emergency Fund',amount:200},{name:'Investment Account',amount:500},
      {name:'Debt Payment',amount:300},{name:'Extra Account 1',amount:0},
      {name:'Extra Account 2',amount:0},{name:'Extra Account 3',amount:0},{name:'Extra Account 4',amount:0}
    ],
    bigExpenses: [
      {name:'Annual Insurance',amount:1800},{name:'Vacation Fund',amount:2400},
      {name:'Big Expense #3',amount:0},{name:'Big Expense #4',amount:0},{name:'Big Expense #5',amount:0}
    ]
  },
  transactions: {
    "2026_01": [
      {id:"bt-001",date:"2026-01-01",category:"Rent",description:"Monthly rent payment",paymentMethod:"Transfer",amount:1850},
      {id:"bt-002",date:"2026-01-03",category:"Groceries",description:"Weekly grocery run",paymentMethod:"Debit",amount:87.42},
      {id:"bt-003",date:"2026-01-03",category:"Coffee Shops",description:"Starbucks",paymentMethod:"Credit",amount:5.75},
      {id:"bt-004",date:"2026-01-05",category:"Internet",description:"Spectrum internet",paymentMethod:"Credit",amount:79.99},
      {id:"bt-005",date:"2026-01-05",category:"Subscriptions",description:"Netflix",paymentMethod:"Credit",amount:15.49},
      {id:"bt-006",date:"2026-01-06",category:"Fitness",description:"Planet Fitness",paymentMethod:"Credit",amount:24.99},
      {id:"bt-007",date:"2026-01-07",category:"Utilities",description:"Georgia Power",paymentMethod:"Debit",amount:128.50},
      {id:"bt-008",date:"2026-01-08",category:"Phone",description:"T-Mobile",paymentMethod:"Credit",amount:65.00},
      {id:"bt-009",date:"2026-01-10",category:"Groceries",description:"Publix groceries",paymentMethod:"Debit",amount:112.34},
      {id:"bt-010",date:"2026-01-10",category:"Restaurants",description:"Chipotle dinner",paymentMethod:"Credit",amount:14.85},
      {id:"bt-011",date:"2026-01-12",category:"Taxi Services",description:"Uber ride",paymentMethod:"Credit",amount:18.50},
      {id:"bt-012",date:"2026-01-13",category:"Subscriptions",description:"Spotify",paymentMethod:"Credit",amount:10.99},
      {id:"bt-013",date:"2026-01-14",category:"Coffee Shops",description:"Dunkin Donuts",paymentMethod:"Debit",amount:4.25},
      {id:"bt-014",date:"2026-01-15",category:"Personal Care",description:"Haircut",paymentMethod:"Cash",amount:35.00},
      {id:"bt-015",date:"2026-01-16",category:"Restaurants",description:"Pizza Hut delivery",paymentMethod:"Credit",amount:24.99},
      {id:"bt-016",date:"2026-01-17",category:"Groceries",description:"Walmart groceries",paymentMethod:"Debit",amount:94.67},
      {id:"bt-017",date:"2026-01-18",category:"Other",description:"Amazon order",paymentMethod:"Credit",amount:42.99},
      {id:"bt-018",date:"2026-01-19",category:"Subscriptions",description:"YouTube Premium",paymentMethod:"Credit",amount:13.99},
      {id:"bt-019",date:"2026-01-20",category:"Restaurants",description:"Olive Garden",paymentMethod:"Credit",amount:48.75},
      {id:"bt-020",date:"2026-01-21",category:"Dentist",description:"Dental cleaning",paymentMethod:"Credit",amount:50.00},
      {id:"bt-021",date:"2026-01-22",category:"Utilities",description:"Water bill",paymentMethod:"Debit",amount:35.20},
      {id:"bt-022",date:"2026-01-23",category:"Coffee Shops",description:"Starbucks",paymentMethod:"Credit",amount:6.50},
      {id:"bt-023",date:"2026-01-24",category:"Groceries",description:"Costco run",paymentMethod:"Debit",amount:156.80},
      {id:"bt-024",date:"2026-01-25",category:"Clothing",description:"Old Navy",paymentMethod:"Credit",amount:67.49},
      {id:"bt-025",date:"2026-01-26",category:"Gifts / Donations",description:"Birthday gift",paymentMethod:"Cash",amount:30.00},
      {id:"bt-026",date:"2026-01-28",category:"Public Transportation",description:"MARTA pass",paymentMethod:"Debit",amount:50.00},
      {id:"bt-027",date:"2026-01-29",category:"Restaurants",description:"Chick-fil-A",paymentMethod:"Debit",amount:12.45},
      {id:"bt-028",date:"2026-01-30",category:"Other",description:"Dry cleaning",paymentMethod:"Cash",amount:24.00},
      {id:"bt-029",date:"2026-01-31",category:"Groceries",description:"Aldi groceries",paymentMethod:"Debit",amount:68.25}
    ],
    "2026_02": [
      {id:"bt-101",date:"2026-02-01",category:"Rent",description:"Monthly rent payment",paymentMethod:"Transfer",amount:1850},
      {id:"bt-102",date:"2026-02-02",category:"Groceries",description:"Weekly grocery run",paymentMethod:"Debit",amount:92.18},
      {id:"bt-103",date:"2026-02-03",category:"Coffee Shops",description:"Starbucks",paymentMethod:"Credit",amount:6.25},
      {id:"bt-104",date:"2026-02-04",category:"Internet",description:"Spectrum internet",paymentMethod:"Credit",amount:79.99},
      {id:"bt-105",date:"2026-02-05",category:"Subscriptions",description:"Netflix",paymentMethod:"Credit",amount:15.49},
      {id:"bt-106",date:"2026-02-06",category:"Fitness",description:"Planet Fitness",paymentMethod:"Credit",amount:24.99},
      {id:"bt-107",date:"2026-02-07",category:"Utilities",description:"Georgia Power",paymentMethod:"Debit",amount:142.30},
      {id:"bt-108",date:"2026-02-08",category:"Phone",description:"T-Mobile",paymentMethod:"Credit",amount:65.00},
      {id:"bt-109",date:"2026-02-09",category:"Groceries",description:"Publix groceries",paymentMethod:"Debit",amount:98.45},
      {id:"bt-110",date:"2026-02-10",category:"Restaurants",description:"Doordash dinner",paymentMethod:"Credit",amount:32.50},
      {id:"bt-111",date:"2026-02-12",category:"Taxi Services",description:"Lyft ride",paymentMethod:"Credit",amount:22.75},
      {id:"bt-112",date:"2026-02-13",category:"Subscriptions",description:"Spotify",paymentMethod:"Credit",amount:10.99},
      {id:"bt-113",date:"2026-02-14",category:"Restaurants",description:"Valentine's dinner",paymentMethod:"Credit",amount:125.00},
      {id:"bt-114",date:"2026-02-14",category:"Gifts / Donations",description:"Valentine's gift",paymentMethod:"Credit",amount:85.00},
      {id:"bt-115",date:"2026-02-15",category:"Groceries",description:"Walmart groceries",paymentMethod:"Debit",amount:78.90},
      {id:"bt-116",date:"2026-02-16",category:"Other",description:"Amazon order",paymentMethod:"Credit",amount:56.78},
      {id:"bt-117",date:"2026-02-17",category:"Coffee Shops",description:"Dunkin Donuts",paymentMethod:"Debit",amount:4.75},
      {id:"bt-118",date:"2026-02-18",category:"Subscriptions",description:"YouTube Premium",paymentMethod:"Credit",amount:13.99},
      {id:"bt-119",date:"2026-02-19",category:"Restaurants",description:"Panera Bread",paymentMethod:"Credit",amount:16.25},
      {id:"bt-120",date:"2026-02-20",category:"Personal Care",description:"Haircut + products",paymentMethod:"Cash",amount:45.00},
      {id:"bt-121",date:"2026-02-21",category:"Utilities",description:"Water bill",paymentMethod:"Debit",amount:32.80},
      {id:"bt-122",date:"2026-02-22",category:"Groceries",description:"Costco run",paymentMethod:"Debit",amount:142.55},
      {id:"bt-123",date:"2026-02-23",category:"Clothing",description:"Target clothing",paymentMethod:"Credit",amount:45.99},
      {id:"bt-124",date:"2026-02-24",category:"Public Transportation",description:"MARTA pass",paymentMethod:"Debit",amount:50.00},
      {id:"bt-125",date:"2026-02-25",category:"Coffee Shops",description:"Starbucks",paymentMethod:"Credit",amount:5.50},
      {id:"bt-126",date:"2026-02-26",category:"Restaurants",description:"Wingstop",paymentMethod:"Debit",amount:18.99},
      {id:"bt-127",date:"2026-02-27",category:"Other",description:"Car wash",paymentMethod:"Cash",amount:15.00},
      {id:"bt-128",date:"2026-02-28",category:"Groceries",description:"Aldi groceries",paymentMethod:"Debit",amount:72.40}
    ],
    "2026_03": [
      {id:"bt-201",date:"2026-03-01",category:"Rent",description:"Monthly rent payment",paymentMethod:"Transfer",amount:1850,source:"Chase Checking",sourceType:"manual"},
      {id:"bt-202",date:"2026-03-02",category:"Groceries",description:"Weekly grocery run",paymentMethod:"Debit",amount:82.30,source:"Chase Checking",sourceType:"csv"},
      {id:"bt-203",date:"2026-03-03",category:"Coffee Shops",description:"Starbucks",paymentMethod:"Credit",amount:6.85,source:"Chase Sapphire",sourceType:"csv"},
      {id:"bt-204",date:"2026-03-04",category:"Internet",description:"Spectrum internet",paymentMethod:"Credit",amount:79.99,source:"Chase Sapphire",sourceType:"csv"},
      {id:"bt-205",date:"2026-03-05",category:"Subscriptions",description:"Netflix",paymentMethod:"Credit",amount:15.49,source:"Chase Sapphire",sourceType:"csv"},
      {id:"bt-206",date:"2026-03-06",category:"Fitness",description:"Planet Fitness",paymentMethod:"Credit",amount:24.99,source:"Chase Sapphire",sourceType:"csv"},
      {id:"bt-207",date:"2026-03-07",category:"Utilities",description:"Georgia Power",paymentMethod:"Debit",amount:135.80,source:"Chase Checking",sourceType:"csv"},
      {id:"bt-208",date:"2026-03-08",category:"Phone",description:"T-Mobile",paymentMethod:"Credit",amount:65.00,source:"Capital One",sourceType:"csv"},
      {id:"bt-209",date:"2026-03-09",category:"Groceries",description:"Publix groceries",paymentMethod:"Debit",amount:95.40,source:"Chase Checking",sourceType:"csv"},
      {id:"bt-210",date:"2026-03-10",category:"Restaurants",description:"Chipotle dinner",paymentMethod:"Credit",amount:15.40,source:"Chase Sapphire",sourceType:"csv"},
      {id:"bt-211",date:"2026-03-11",category:"Taxi Services",description:"Uber ride",paymentMethod:"Credit",amount:16.50,source:"Chase Sapphire",sourceType:"csv"},
      {id:"bt-212",date:"2026-03-12",category:"Subscriptions",description:"Spotify",paymentMethod:"Credit",amount:10.99,source:"Capital One",sourceType:"csv"},
      {id:"bt-213",date:"2026-03-13",category:"Coffee Shops",description:"Dunkin Donuts",paymentMethod:"Debit",amount:4.50,source:"Chase Checking",sourceType:"csv"},
      {id:"bt-214",date:"2026-03-14",category:"Restaurants",description:"LongHorn Steakhouse",paymentMethod:"Credit",amount:58.40,source:"Chase Sapphire",sourceType:"csv"},
      {id:"bt-215",date:"2026-03-15",category:"Groceries",description:"Walmart groceries",paymentMethod:"Debit",amount:71.20,source:"Chase Checking",sourceType:"csv"},
      {id:"bt-216",date:"2026-03-16",category:"Personal Care",description:"Haircut",paymentMethod:"Cash",amount:35.00,source:"",sourceType:"manual"},
      {id:"bt-217",date:"2026-03-17",category:"Other",description:"Amazon order",paymentMethod:"Credit",amount:28.99,source:"Chase Sapphire",sourceType:"csv"},
      {id:"bt-218",date:"2026-03-18",category:"Subscriptions",description:"YouTube Premium",paymentMethod:"Credit",amount:13.99,source:"Capital One",sourceType:"csv"},
      {id:"bt-219",date:"2026-03-19",category:"Restaurants",description:"Zaxby's",paymentMethod:"Debit",amount:15.20,source:"Chase Checking",sourceType:"csv"},
      {id:"bt-220",date:"2026-03-20",category:"Dentist",description:"Dental cleaning",paymentMethod:"Credit",amount:50.00,source:"Chase Sapphire",sourceType:"csv"},
      {id:"bt-221",date:"2026-03-21",category:"Utilities",description:"Water bill",paymentMethod:"Debit",amount:33.40,source:"Chase Checking",sourceType:"csv"},
      {id:"bt-222",date:"2026-03-22",category:"Coffee Shops",description:"Starbucks",paymentMethod:"Credit",amount:5.95,source:"Chase Sapphire",sourceType:"csv"},
      {id:"bt-223",date:"2026-03-23",category:"Groceries",description:"Costco run",paymentMethod:"Debit",amount:145.60,source:"Chase Checking",sourceType:"csv"},
      {id:"bt-224",date:"2026-03-24",category:"Clothing",description:"Ross clearance",paymentMethod:"Credit",amount:36.80,source:"Capital One",sourceType:"csv"},
      {id:"bt-225",date:"2026-03-25",category:"Gifts / Donations",description:"Charity donation",paymentMethod:"Credit",amount:25.00,source:"Chase Sapphire",sourceType:"csv"},
      {id:"bt-226",date:"2026-03-26",category:"Public Transportation",description:"MARTA pass",paymentMethod:"Debit",amount:50.00,source:"Chase Checking",sourceType:"csv"},
      {id:"bt-227",date:"2026-03-27",category:"Restaurants",description:"IHOP brunch",paymentMethod:"Debit",amount:26.50,source:"Chase Checking",sourceType:"csv"},
      {id:"bt-228",date:"2026-03-28",category:"Other",description:"Dry cleaning",paymentMethod:"Cash",amount:18.00,source:"",sourceType:"manual"},
      {id:"bt-229",date:"2026-03-29",category:"Groceries",description:"Aldi groceries",paymentMethod:"Debit",amount:38.90,source:"Chase Checking",sourceType:"csv"},
      {id:"bt-230",date:"2026-03-30",category:"Other",description:"Car wash",paymentMethod:"Cash",amount:15.00,source:"",sourceType:"manual"}
    ]
  },
  income: {
    "2026_01": {
      salary:{amount:5200,date:"2026-01-01",description:"Monthly salary"},
      sources:[{name:"Side Gig",amount:400,date:"2026-01-15",description:"Freelance project"},{name:"Income Source 2",amount:0,date:"",description:""},{name:"Income Source 3",amount:0,date:"",description:""},{name:"Income Source 4",amount:0,date:"",description:""}],
      other:[{name:"Other 1",amount:0,date:"",description:""},{name:"Other 2",amount:0,date:"",description:""},{name:"Other 3",amount:0,date:"",description:""},{name:"Other 4",amount:0,date:"",description:""},{name:"Other 5",amount:0,date:"",description:""}]
    },
    "2026_02": {
      salary:{amount:5200,date:"2026-02-01",description:"Monthly salary"},
      sources:[{name:"Side Gig",amount:350,date:"2026-02-15",description:"Freelance project"},{name:"Income Source 2",amount:0,date:"",description:""},{name:"Income Source 3",amount:0,date:"",description:""},{name:"Income Source 4",amount:0,date:"",description:""}],
      other:[{name:"Other 1",amount:0,date:"",description:""},{name:"Other 2",amount:0,date:"",description:""},{name:"Other 3",amount:0,date:"",description:""},{name:"Other 4",amount:0,date:"",description:""},{name:"Other 5",amount:0,date:"",description:""}]
    },
    "2026_03": {
      salary:{amount:5200,date:"2026-03-01",description:"Monthly salary"},
      sources:[{name:"Side Gig",amount:450,date:"2026-03-15",description:"Freelance project"},{name:"Income Source 2",amount:0,date:"",description:""},{name:"Income Source 3",amount:0,date:"",description:""},{name:"Income Source 4",amount:0,date:"",description:""}],
      other:[{name:"Other 1",amount:0,date:"",description:""},{name:"Other 2",amount:0,date:"",description:""},{name:"Other 3",amount:0,date:"",description:""},{name:"Other 4",amount:0,date:"",description:""},{name:"Other 5",amount:0,date:"",description:""}]
    }
  },
  accounts: {
    "2026_01": [
      {id:"da-01",type:"Checking",name:"Chase Checking",amount:4500,interestRate:0,notes:""},
      {id:"da-02",type:"Savings",name:"Chase Savings",amount:12000,interestRate:3.5,notes:"Emergency fund"},
      {id:"da-03",type:"Investing",name:"Fidelity 401k",amount:45000,interestRate:0,notes:"Employer match 4%"},
      {id:"da-04",type:"Credit Card",name:"Chase Sapphire",amount:-2300,interestRate:24.99,notes:""}
    ],
    "2026_02": [
      {id:"da-05",type:"Checking",name:"Chase Checking",amount:4850,interestRate:0,notes:""},
      {id:"da-06",type:"Savings",name:"Chase Savings",amount:12200,interestRate:3.5,notes:"Emergency fund"},
      {id:"da-07",type:"Investing",name:"Fidelity 401k",amount:46200,interestRate:0,notes:"Employer match 4%"},
      {id:"da-08",type:"Credit Card",name:"Chase Sapphire",amount:-1850,interestRate:24.99,notes:""}
    ],
    "2026_03": [
      {id:"da-09",type:"Checking",name:"Chase Checking",amount:5200,interestRate:0,notes:""},
      {id:"da-10",type:"Savings",name:"Chase Savings",amount:12400,interestRate:3.5,notes:"Emergency fund"},
      {id:"da-11",type:"Investing",name:"Fidelity 401k",amount:47500,interestRate:0,notes:"Employer match 4%"},
      {id:"da-12",type:"Credit Card",name:"Chase Sapphire",amount:-1420,interestRate:24.99,notes:""}
    ]
  }
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

  // Budget demo data
  _demoStore['budget_setup'] = JSON.stringify(DEMO_BUDGET_DATA.setup);
  const budgetMonths = Object.keys(DEMO_BUDGET_DATA.transactions).sort();
  _demoStore['budget_months'] = JSON.stringify(budgetMonths);
  _demoStore['budget_activeMonth'] = budgetMonths[budgetMonths.length - 1];
  budgetMonths.forEach(function(mk) {
    _demoStore['budget_data_' + mk] = JSON.stringify(DEMO_BUDGET_DATA.transactions[mk]);
    if (DEMO_BUDGET_DATA.income[mk]) {
      _demoStore['budget_income_' + mk] = JSON.stringify(DEMO_BUDGET_DATA.income[mk]);
    }
    if (DEMO_BUDGET_DATA.accounts[mk]) {
      _demoStore['budget_accounts_' + mk] = JSON.stringify(DEMO_BUDGET_DATA.accounts[mk]);
    }
  });
}

if (DEMO_MODE) {
  seedDemoStore();
}

// ── Shared demo UI functions ──
function injectDemoBanner(color) {
  color = color || 'green';
  var isLight = document.body.classList.contains('light') || (localStorage.getItem('app_theme') || 'light') !== 'dark';
  var colorMap = {
    green:{ c1d:'#1e3a2f',c2d:'#1a2740',c1l:'#e8f5e9',c2l:'#e3f2fd',accent:'rgba(34,197,94,0.3)',accentVar:'#22c55e',rgb:'34,197,94' },
    blue:{ c1d:'#1a2740',c2d:'#1e2a3f',c1l:'#e3f2fd',c2l:'#e8eaf6',accent:'rgba(59,130,246,0.3)',accentVar:'#3b82f6',rgb:'59,130,246' },
    purple:{ c1d:'#2a1f40',c2d:'#1e2a3f',c1l:'#f3e5f5',c2l:'#e8eaf6',accent:'rgba(168,85,247,0.3)',accentVar:'#a855f7',rgb:'168,85,247' }
  };
  var cm = colorMap[color] || colorMap.green;
  var c1 = isLight ? cm.c1l : cm.c1d;
  var c2 = isLight ? cm.c2l : cm.c2d;
  var accent = cm.accent, accentVar = cm.accentVar;
  var textColor = isLight ? '#1a1a2e' : '#e4e4e7';
  var mutedColor = isLight ? '#6b6b80' : '#71717a';
  var banner = document.createElement('div');
  banner.id = 'demo-banner';
  banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:10000;background:linear-gradient(135deg,' + c1 + ',' + c2 + ');border-bottom:1px solid ' + accent + ';padding:8px 12px;display:flex;justify-content:center;align-items:center;gap:8px;font-size:12px;color:' + textColor + ';flex-wrap:wrap;';
  banner.innerHTML = '<span style="font-weight:700;color:' + accentVar + '">DEMO MODE</span>' +
    '<span style="color:' + mutedColor + '">Exploring with sample data</span>' +
    '<button onclick="exitDemoAndSignUp()" style="background:rgba(' + cm.rgb + ',0.15);border:1px solid ' + accent + ';color:' + accentVar + ';border-radius:6px;padding:6px 16px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;">Sign Up to Save Your Data</button>' +
    '<button onclick="exitDemo()" style="background:none;border:none;color:' + mutedColor + ';cursor:pointer;font-size:12px;text-decoration:underline;font-family:inherit;">Exit Demo</button>';
  document.body.prepend(banner);
  // Push down everything below the fixed demo banner - use actual height
  function adjustBannerSpace() {
    var b = document.getElementById('demo-banner');
    if (!b) return;
    var h = b.offsetHeight + 'px';
    document.body.style.paddingTop = h;
    var header = document.querySelector('.header');
    if (header) header.style.marginTop = '0';
    if (header && getComputedStyle(header).position === 'sticky') header.style.top = h;
  }
  adjustBannerSpace();
  window.addEventListener('resize', adjustBannerSpace);
}

function exitDemo() {
  sessionStorage.removeItem('demo_mode');
  var isSubdir = /\/(Groceries|Expenses|Scanner|Budget)\//.test(window.location.pathname);
  window.location.href = isSubdir ? '../' : './';
}

function exitDemoAndSignUp() {
  sessionStorage.removeItem('demo_mode');
  var isSubdir = /\/(Groceries|Expenses|Scanner|Budget)\//.test(window.location.pathname);
  var base = isSubdir ? '../' : './';
  window.location.href = base + '?signup=true';
}

function showDemoUpgradePrompt(message) {
  var isLight = document.body.classList.contains('light') || (localStorage.getItem('app_theme') || 'light') !== 'dark';
  var bg = isLight ? '#ffffff' : '#1a1b23';
  var border = isLight ? '#d4d4d8' : '#2a2b35';
  var muted = isLight ? '#6b6b80' : '#71717a';
  var btnBg = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)';
  var overlayBg = isLight ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)';
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:' + overlayBg + ';z-index:10001;display:flex;justify-content:center;align-items:center;padding:20px;';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
  overlay.innerHTML = '<div style="background:' + bg + ';border:1px solid ' + border + ';border-radius:16px;padding:32px;max-width:400px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,' + (isLight ? '0.15' : '0.5') + ')">' +
    '<div style="font-size:36px;margin-bottom:12px">&#128274;</div>' +
    '<div style="font-size:16px;font-weight:700;color:#22c55e;margin-bottom:8px">Create a Free Account</div>' +
    '<div style="font-size:14px;color:' + muted + ';margin-bottom:20px;line-height:1.6">' + message + '</div>' +
    '<div style="display:flex;gap:10px;justify-content:center">' +
      '<button onclick="var o=this;while(o.parentElement!==document.body)o=o.parentElement;o.remove()" style="padding:10px 20px;border-radius:8px;border:1px solid ' + border + ';background:' + btnBg + ';color:' + muted + ';font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;">Continue Demo</button>' +
      '<button onclick="exitDemoAndSignUp()" style="padding:10px 20px;border-radius:8px;border:1px solid rgba(34,197,94,0.3);background:rgba(34,197,94,0.15);color:#22c55e;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;">Sign Up Free</button>' +
    '</div></div>';
  document.body.appendChild(overlay);
}

// Rewrite cross-dashboard links to preserve demo mode
function demofyLinks() {
  if (!DEMO_MODE) return;
  document.querySelectorAll('a').forEach(function(a) {
    var href = a.getAttribute('href') || '';
    if ((href.includes('Groceries/') || href.includes('Expenses/') || href.includes('Budget/') || href.includes('Scanner/') || href.includes('../Groceries') || href.includes('../Expenses') || href.includes('../Budget') || href.includes('../Scanner')) && !href.includes('demo')) {
      a.setAttribute('href', href + (href.includes('?') ? '&' : '?') + 'demo=true');
    }
  });
}
