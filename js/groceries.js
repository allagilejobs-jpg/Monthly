// ─────────── MONTH CONSTANTS ───────────
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTH_ABBR = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ─────────── SEED DATA (January 2026) ───────────
const SEED_DATA = [
  {d:"01/01",s:"Instacart (Sprouts)",r:"BOULDER AVO CHIPS",n:"Boulder Canyon Avocado Oil Chips",c:"Snacks & Chips",q:1,u:2.92,t:2.92,ng:false},
  {d:"01/03",s:"Publix",r:"BRIOCHE SLICED LF",n:"Brioche Sliced Loaf",c:"Bakery & Bread",q:2,u:7.19,t:14.38,ng:false},
  {d:"01/03",s:"Publix",r:"RING POPS ASSORTED",n:"Ring Pops Assorted Candy",c:"Candy & Sweets",q:2,u:1.00,t:2.00,ng:false},
  {d:"01/03",s:"Publix",r:"DRUMSTICK SIMPLY",n:"Nestle Drumstick Simply Dipped",c:"Frozen Desserts",q:1,u:6.99,t:6.99,ng:false},
  {d:"01/03",s:"Publix",r:"PRING SR/CRM/ONION",n:"Pringles Sour Cream & Onion",c:"Snacks & Chips",q:1,u:2.50,t:2.50,ng:false},
  {d:"01/03",s:"Publix",r:"JENI'S ICE CREAM",n:"Jeni's Splendid Ice Cream",c:"Frozen Desserts",q:1,u:7.99,t:7.99,ng:false},
  {d:"01/03",s:"Publix",r:"OV GRASSMILK HG",n:"Organic Valley Grassmilk Half Gallon",c:"Dairy & Eggs",q:1,u:7.19,t:7.19,ng:false},
  {d:"01/03",s:"Publix",r:"PEZ CANDY SET",n:"PEZ Candy Dispenser Set",c:"Candy & Sweets",q:1,u:1.00,t:1.00,ng:false},
  {d:"01/03",s:"Target",r:"FD CANDY",n:"Favorite Day Candy",c:"Candy & Sweets",q:1,u:1.39,t:1.39,ng:false},
  {d:"01/03",s:"Target",r:"KINDER",n:"Kinder Chocolate",c:"Candy & Sweets",q:1,u:2.39,t:2.39,ng:false},
  {d:"01/03",s:"Target",r:"KIT KAT SNGL",n:"Kit Kat Single Bar",c:"Candy & Sweets",q:1,u:1.99,t:1.99,ng:false},
  {d:"01/03",s:"Target",r:"TAKIS",n:"Takis Rolled Tortilla Chips",c:"Snacks & Chips",q:1,u:2.24,t:2.24,ng:false},
  {d:"01/03",s:"Target",r:"1.3ZIBDUOSTW",n:"Candy/Snack Item",c:"Candy & Sweets",q:1,u:3.79,t:3.79,ng:false},
  {d:"01/03",s:"Target",r:"SKITTLES",n:"Skittles Candy",c:"Candy & Sweets",q:1,u:5.59,t:5.59,ng:false},
  {d:"01/03",s:"Target",r:"EOS",n:"eos Lip Balm/Body Care",c:"Health & Beauty",q:2,u:7.24,t:14.48,ng:true},
  {d:"01/03",s:"Target",r:"MY MINI",n:"My Mini Toy",c:"Toys",q:1,u:9.99,t:9.99,ng:true},
  {d:"01/05",s:"Publix",r:"MOOALA UNSW ALMDMK",n:"Mooala Unsweetened Almond Milk",c:"Dairy & Eggs",q:2,u:4.99,t:9.98,ng:false},
  {d:"01/06",s:"Walmart",r:"GV CUT OKRA",n:"Great Value Cut Okra (Frozen)",c:"Frozen Foods",q:6,u:1.54,t:9.24,ng:false},
  {d:"01/06",s:"Walmart",r:"RED BELL",n:"Red Bell Peppers",c:"Produce",q:2,u:1.48,t:2.96,ng:false},
  {d:"01/06",s:"Walmart",r:"PEPPER/ONIO",n:"Pepper & Onion Seasoning Mix",c:"Baking & Pantry",q:1,u:2.84,t:2.84,ng:false},
  {d:"01/07",s:"Costco",r:"KS CASHEWS",n:"Kirkland Signature Cashews",c:"Snacks & Chips",q:1,u:9.99,t:9.99,ng:false},
  {d:"01/07",s:"Costco",r:"OTTAVIO EVOO",n:"Ottavio Extra Virgin Olive Oil",c:"Cooking Oils & Condiments",q:1,u:21.58,t:21.58,ng:false},
  {d:"01/08",s:"Publix",r:"OV GRASSMILK HG",n:"Organic Valley Grassmilk Half Gallon",c:"Dairy & Eggs",q:2,u:7.19,t:14.38,ng:false},
  {d:"01/08",s:"Publix",r:"CRETORS POP CARMEL",n:"Cretors Caramel Popcorn",c:"Snacks & Chips",q:2,u:3.99,t:7.98,ng:false},
  {d:"01/08",s:"Publix",r:"CHIFLE SWEET MAD",n:"Chifles Sweet Maduro Plantain Chips",c:"Snacks & Chips",q:2,u:5.99,t:11.98,ng:false},
  {d:"01/08",s:"Publix",r:"MINI MARSHMALLOWS",n:"Mini Marshmallows",c:"Baking & Pantry",q:1,u:2.19,t:2.19,ng:false},
  {d:"01/08",s:"Publix",r:"AM LENTILS OG RE",n:"Amy's Organic Lentil Soup",c:"Canned & Packaged Foods",q:1,u:7.19,t:7.19,ng:false},
  {d:"01/08",s:"Publix",r:"CILANTRO",n:"Cilantro",c:"Produce",q:1,u:1.49,t:1.49,ng:false},
  {d:"01/08",s:"Publix",r:"APPLES GRANNY SMIT",n:"Granny Smith Apples",c:"Produce",q:1,u:2.64,t:2.64,ng:false},
  {d:"01/08",s:"Publix",r:"CUCUMBER HOT HOUSE",n:"Hot House Cucumber",c:"Produce",q:1,u:2.50,t:2.50,ng:false},
  {d:"01/10",s:"Publix",r:"NUMBER 4 SILVER B",n:"Number 4 Silver B (Hair Care)",c:"Health & Beauty",q:1,u:12.99,t:12.99,ng:true},
  {d:"01/10",s:"Publix",r:"ORGANIC STRWBRRIES",n:"Organic Strawberries",c:"Produce",q:1,u:6.99,t:6.99,ng:false},
  {d:"01/10",s:"Publix",r:"ORGANIC BANANAS",n:"Organic Bananas",c:"Produce",q:1,u:1.47,t:1.47,ng:false},
  {d:"01/10",s:"Publix",r:"ORG BLACKBERRIES",n:"Organic Blackberries",c:"Produce",q:1,u:6.99,t:6.99,ng:false},
  {d:"01/10",s:"Publix",r:"SWEETHEARTS BAG",n:"Sweethearts Valentine Candy",c:"Candy & Sweets",q:1,u:4.19,t:4.19,ng:false},
  {d:"01/10",s:"Publix",r:"GLAZED DONUT",n:"Glazed Donut",c:"Bakery & Bread",q:1,u:1.19,t:1.19,ng:false},
  {d:"01/10",s:"Publix",r:"CPCKE 6CT CELEBRTN",n:"Celebration Cupcakes 6-Count",c:"Bakery & Bread",q:1,u:5.99,t:5.99,ng:false},
  {d:"01/14",s:"Publix",r:"OV GRASSMILK HG",n:"Organic Valley Grassmilk Half Gallon",c:"Dairy & Eggs",q:1,u:7.19,t:7.19,ng:false},
  {d:"01/14",s:"Publix",r:"MOOALA UNSW ALMDMK",n:"Mooala Unsweetened Almond Milk",c:"Dairy & Eggs",q:1,u:4.99,t:4.99,ng:false},
  {d:"01/14",s:"Publix",r:"GOLD POTATO",n:"Gold/Yukon Potatoes",c:"Produce",q:1,u:6.99,t:6.99,ng:false},
  {d:"01/14",s:"Publix",r:"ORG APPLES GALA",n:"Organic Gala Apples",c:"Produce",q:1,u:5.99,t:5.99,ng:false},
  {d:"01/14",s:"Costco",r:"IRISH SPREAD",n:"Kerrygold Irish Butter",c:"Dairy & Eggs",q:1,u:12.59,t:12.59,ng:false},
  {d:"01/14",s:"Costco",r:"KS BABY WIPE",n:"Kirkland Signature Baby Wipes",c:"Baby Care",q:1,u:19.99,t:19.99,ng:true},
  {d:"01/14",s:"Costco",r:"KSOXIPOWDER",n:"Kirkland Oxi Laundry Powder",c:"Household & Cleaning",q:1,u:11.49,t:11.49,ng:true},
  {d:"01/14",s:"Costco",r:"DM KRNL CORN",n:"Del Monte Kernel Corn (Canned)",c:"Canned & Packaged Foods",q:1,u:11.67,t:11.67,ng:false},
  {d:"01/14",s:"Costco",r:"DURACELL AA",n:"Duracell AA Batteries",c:"Electronics & Batteries",q:1,u:19.99,t:19.99,ng:true},
  {d:"01/14",s:"Costco",r:"PASTURE EGGS",n:"Pasture-Raised Eggs",c:"Dairy & Eggs",q:1,u:15.98,t:15.98,ng:false},
  {d:"01/14",s:"Costco",r:"ORG PRESS",n:"Pulp & Press Organic Cold Pressed Juice",c:"Beverages",q:1,u:59.97,t:59.97,ng:false},
  {d:"01/14",s:"Costco",r:"AVO OIL CHIP",n:"Avocado Oil Chips",c:"Snacks & Chips",q:1,u:6.49,t:6.49,ng:false},
  {d:"01/14",s:"Costco",r:"TIDE OXIPODS",n:"Tide Oxi Pods Laundry Detergent",c:"Household & Cleaning",q:1,u:26.99,t:26.99,ng:true},
  {d:"01/14",s:"Costco",r:"POTATOCHIPS",n:"Potato Chips",c:"Snacks & Chips",q:1,u:3.99,t:3.99,ng:false},
  {d:"01/14",s:"Costco",r:"DAWN PLATINM",n:"Dawn Platinum Dish Soap",c:"Household & Cleaning",q:1,u:9.49,t:9.49,ng:true},
  {d:"01/14",s:"Costco",r:"KS PURE SALT",n:"Kirkland Signature Sea Salt",c:"Baking & Pantry",q:1,u:3.29,t:3.29,ng:false},
  {d:"01/14",s:"Costco",r:"ZIPLC SLIDER",n:"Ziploc Slider Bags",c:"Household & Cleaning",q:1,u:9.99,t:9.99,ng:true},
  {d:"01/14",s:"Costco",r:"***KSWTR40PK",n:"Kirkland Signature Water 40-Pack",c:"Beverages",q:1,u:11.97,t:11.97,ng:false},
  {d:"01/15",s:"Instacart (Ingles)",r:"WEETABIX",n:"Weetabix Whole Grain Cereal",c:"Breakfast & Cereal",q:1,u:14.70,t:14.70,ng:false},
  {d:"01/16",s:"Publix",r:"TWIX COOKIE BAR",n:"Twix Cookie Bar",c:"Candy & Sweets",q:1,u:3.09,t:3.09,ng:false},
  {d:"01/16",s:"Publix",r:"CELERY",n:"Celery",c:"Produce",q:1,u:2.49,t:2.49,ng:false},
  {d:"01/16",s:"Publix",r:"PEARS BARTLETT",n:"Bartlett Pears",c:"Produce",q:1,u:4.99,t:4.99,ng:false},
  {d:"01/16",s:"Publix",r:"STARBURST SOURS",n:"Starburst Sours Candy",c:"Candy & Sweets",q:1,u:3.67,t:3.67,ng:false},
  {d:"01/16",s:"Publix",r:"BOOM POP KETTLE",n:"Boom Chicka Pop Kettle Corn",c:"Snacks & Chips",q:1,u:4.49,t:4.49,ng:false},
  {d:"01/16",s:"Walmart",r:"TOMATO PAST",n:"Tomato Paste",c:"Canned & Packaged Foods",q:1,u:2.68,t:2.68,ng:false},
  {d:"01/16",s:"Walmart",r:"GOLD KIWI",n:"Gold Kiwi Fruit",c:"Produce",q:1,u:4.97,t:4.97,ng:false},
  {d:"01/16",s:"Walmart",r:"ORG BANANAS",n:"Organic Bananas",c:"Produce",q:1,u:1.29,t:1.29,ng:false},
  {d:"01/16",s:"Walmart",r:"TOMATO",n:"Tomato",c:"Produce",q:1,u:1.01,t:1.01,ng:false},
  {d:"01/16",s:"Walmart",r:"ORG SALAD",n:"Organic Salad Mix",c:"Produce",q:1,u:2.98,t:2.98,ng:false},
  {d:"01/16",s:"Walmart",r:"RED BELL",n:"Red Bell Peppers",c:"Produce",q:4,u:1.48,t:5.92,ng:false},
  {d:"01/16",s:"Walmart",r:"PIA",n:"Pita Bread",c:"Bakery & Bread",q:1,u:2.18,t:2.18,ng:false},
  {d:"01/17",s:"Walmart",r:"OV GMILK",n:"Organic Valley Grassmilk Half Gallon",c:"Dairy & Eggs",q:2,u:6.67,t:13.34,ng:false},
  {d:"01/17",s:"Costco",r:"ORG PRESS",n:"Pulp & Press Organic Cold Pressed Juice",c:"Beverages",q:1,u:59.97,t:59.97,ng:false},
  {d:"01/17",s:"Instacart (Costco)",r:"ORG IMMUNITY BLNDS",n:"Organic Immunity Blends Juice",c:"Beverages",q:1,u:67.92,t:67.92,ng:false},
  {d:"01/18",s:"Publix",r:"ORG BLACKBERRIES",n:"Organic Blackberries",c:"Produce",q:1,u:6.99,t:6.99,ng:false},
  {d:"01/18",s:"Publix",r:"ORGANIC STRWBRRIES",n:"Organic Strawberries",c:"Produce",q:1,u:7.99,t:7.99,ng:false},
  {d:"01/18",s:"Walmart",r:"JENGIBRE",n:"Ginger Root",c:"Produce",q:1,u:7.08,t:7.08,ng:false},
  {d:"01/18",s:"Walmart",r:"DV MC TRFL",n:"Dove Men+Care Body Wash",c:"Health & Beauty",q:1,u:13.47,t:13.47,ng:true},
  {d:"01/18",s:"Walmart",r:"3 MED LOAF",n:"Medium Bread Loaf",c:"Bakery & Bread",q:1,u:1.48,t:1.48,ng:false},
  {d:"01/18",s:"Walmart",r:"MENS SOCKS",n:"Men's Socks",c:"Clothing & Apparel",q:2,u:11.73,t:23.46,ng:true},
  {d:"01/19",s:"Publix",r:"JONNY POPS STAR SP",n:"JonnyPops Star-Shaped Popsicles",c:"Frozen Desserts",q:1,u:6.59,t:6.59,ng:false},
  {d:"01/19",s:"Publix",r:"DRUMSTICK SIMPLY",n:"Nestle Drumstick Simply Dipped",c:"Frozen Desserts",q:1,u:6.99,t:6.99,ng:false},
  {d:"01/19",s:"Publix",r:"BRIOCHE SLICED LF",n:"Brioche Sliced Loaf",c:"Bakery & Bread",q:1,u:7.19,t:7.19,ng:false},
  {d:"01/19",s:"Publix",r:"PBX CHKN DMSTKS",n:"Publix Chicken Drumsticks",c:"Meat & Protein",q:1,u:10.21,t:10.21,ng:false},
  {d:"01/19",s:"Publix",r:"MOOALA UNSW ALMDMK",n:"Mooala Unsweetened Almond Milk",c:"Dairy & Eggs",q:1,u:4.99,t:4.99,ng:false},
  {d:"01/19",s:"Walmart",r:"EOS MNT/VNL",n:"eos Mint/Vanilla Lip Balm",c:"Health & Beauty",q:2,u:4.97,t:9.94,ng:true},
  {d:"01/19",s:"Walmart",r:"PIA",n:"Pita Bread",c:"Bakery & Bread",q:2,u:2.18,t:4.36,ng:false},
  {d:"01/19",s:"Target",r:"GG YOGURT",n:"GoGo squeeZ YogurtZ",c:"Dairy & Eggs",q:1,u:3.69,t:3.69,ng:false},
  {d:"01/19",s:"Target",r:"ONCEUPONAFARM",n:"Once Upon a Farm Baby Food",c:"Baby Care",q:3,u:3.89,t:11.67,ng:false},
  {d:"01/19",s:"Target",r:"VITAL FARMS",n:"Vital Farms Pasture-Raised Eggs",c:"Dairy & Eggs",q:1,u:9.99,t:9.99,ng:false},
  {d:"01/19",s:"Target",r:"FD CHOCOLATE",n:"Favorite Day Chocolate",c:"Candy & Sweets",q:1,u:6.49,t:6.49,ng:false},
  {d:"01/19",s:"Target",r:"GRAPES",n:"Grapes",c:"Produce",q:1,u:4.59,t:4.59,ng:false},
  {d:"01/19",s:"Target",r:"ZAK DESIGNS",n:"Zak Designs Cup/Bottle",c:"Housewares",q:1,u:10.99,t:10.99,ng:true},
  {d:"01/19",s:"Costco (Online)",r:"KS BATH TISSUE",n:"KS Bath Tissue 30 Rolls",c:"Paper Products",q:1,u:22.00,t:22.00,ng:true},
  {d:"01/19",s:"Costco (Online)",r:"KS PAPER TOWELS",n:"KS Paper Towels 12 Rolls",c:"Paper Products",q:1,u:20.00,t:20.00,ng:true},
  {d:"01/19",s:"Costco (Online)",r:"HONEST KIDS JUICE",n:"Honest Kids Organic Juice 40-ct",c:"Beverages",q:1,u:25.00,t:25.00,ng:false},
  {d:"01/19",s:"Costco (Online)",r:"KS FLUSHABLE WIPES",n:"KS Flushable Wipes 640-ct",c:"Household & Cleaning",q:1,u:18.61,t:18.61,ng:true},
  {d:"01/19",s:"Costco (Online)",r:"KS TRASH BAGS",n:"KS Kitchen Trash Bags 200-ct",c:"Household & Cleaning",q:1,u:25.00,t:25.00,ng:true},
  {d:"01/21",s:"Walmart",r:"GINGER",n:"Ginger Root",c:"Produce",q:1,u:2.36,t:2.36,ng:false},
  {d:"01/21",s:"Walmart",r:"GV ITEM",n:"Great Value Seasoning/Spice",c:"Baking & Pantry",q:1,u:1.32,t:1.32,ng:false},
  {d:"01/21",s:"Walmart",r:"YLW ONION 3",n:"Yellow Onion 3 lb Bag",c:"Produce",q:1,u:2.84,t:2.84,ng:false},
  {d:"01/21",s:"Walmart",r:"TOMATO",n:"Tomato",c:"Produce",q:1,u:0.61,t:0.61,ng:false},
  {d:"01/21",s:"Austell Farmers Market",r:"PLANTAIN YELLOW",n:"Yellow Plantains",c:"Produce",q:1,u:6.32,t:6.32,ng:false},
  {d:"01/21",s:"Austell Farmers Market",r:"RED BELL PEPPER LB",n:"Red Bell Peppers",c:"Produce",q:1,u:5.56,t:5.56,ng:false},
  {d:"01/21",s:"Austell Farmers Market",r:"BEST OLOYIN HONEY",n:"Best Oloyin Honey Beans",c:"Canned & Packaged Foods",q:1,u:10.99,t:10.99,ng:false},
  {d:"01/22",s:"Publix",r:"ORGANIC BANANAS",n:"Organic Bananas",c:"Produce",q:1,u:1.71,t:1.71,ng:false},
  {d:"01/22",s:"Publix",r:"BRIOCHE SLICED LF",n:"Brioche Sliced Loaf",c:"Bakery & Bread",q:1,u:7.19,t:7.19,ng:false},
  {d:"01/22",s:"Publix",r:"GNWSE PASTURE EGGS",n:"Greenwise Pasture-Raised Eggs",c:"Dairy & Eggs",q:1,u:7.29,t:7.29,ng:false},
  {d:"01/23",s:"Publix",r:"BOOM POP KETTLE",n:"Boom Chicka Pop Kettle Corn",c:"Snacks & Chips",q:1,u:4.49,t:4.49,ng:false},
  {d:"01/23",s:"Publix",r:"CHIFLE SWEET MAD",n:"Chifles Sweet Maduro Plantain Chips",c:"Snacks & Chips",q:2,u:5.99,t:11.98,ng:false},
  {d:"01/23",s:"Publix",r:"MAV ORG GROUND BF",n:"Maverick Organic Ground Beef",c:"Meat & Protein",q:1,u:11.49,t:11.49,ng:false},
  {d:"01/23",s:"Publix",r:"KA UNBLEACHED FLOU",n:"King Arthur Unbleached Flour",c:"Baking & Pantry",q:1,u:2.85,t:2.85,ng:false},
  {d:"01/23",s:"Publix",r:"SMPL ML CHOC CHIP",n:"Simple Mills Chocolate Chip Cookies",c:"Snacks & Chips",q:1,u:4.99,t:4.99,ng:false},
  {d:"01/23",s:"Publix",r:"CORN BI COLOR",n:"Bi-Color Sweet Corn",c:"Produce",q:1,u:4.49,t:4.49,ng:false},
  {d:"01/23",s:"Walmart",r:"SWEET SALTY",n:"Sweet & Salty Granola Bars",c:"Snacks & Chips",q:2,u:3.54,t:7.08,ng:false},
  {d:"01/23",s:"Walmart",r:"SEAGRAMS",n:"Seagram's Ginger Ale",c:"Beverages",q:1,u:6.94,t:6.94,ng:false},
  {d:"01/23",s:"Walmart",r:"RED BELL",n:"Red Bell Peppers",c:"Produce",q:3,u:1.48,t:4.44,ng:false},
  {d:"01/23",s:"Walmart",r:"GV 40PK",n:"Great Value Water 40-Pack",c:"Beverages",q:2,u:4.92,t:9.84,ng:false},
  {d:"01/25",s:"Publix",r:"TOPPS PUSH POP",n:"Topps Push Pop Candy",c:"Candy & Sweets",q:1,u:2.34,t:2.34,ng:false},
  {d:"01/25",s:"Publix",r:"MOOALA UNSW ALMDMK",n:"Mooala Unsweetened Almond Milk",c:"Dairy & Eggs",q:1,u:4.99,t:4.99,ng:false},
  {d:"01/25",s:"Publix",r:"PUB PREM FUSILLI",n:"Publix Premium Fusilli Pasta",c:"Canned & Packaged Foods",q:1,u:2.99,t:2.99,ng:false},
  {d:"01/25",s:"Publix",r:"HEINZ BAKED BEANS",n:"Heinz Baked Beans",c:"Canned & Packaged Foods",q:1,u:2.49,t:2.49,ng:false},
  {d:"01/25",s:"Publix",r:"LINDT MILK CHOC",n:"Lindt Milk Chocolate Bar",c:"Candy & Sweets",q:1,u:5.50,t:5.50,ng:false},
  {d:"01/25",s:"Publix",r:"ORG CUCUMBER WRAP",n:"Organic Cucumber",c:"Produce",q:2,u:2.99,t:5.98,ng:false},
  {d:"01/25",s:"Publix",r:"CILANTRO",n:"Cilantro",c:"Produce",q:1,u:1.49,t:1.49,ng:false},
  {d:"01/25",s:"Publix",r:"ORG APPLES GR SM",n:"Organic Granny Smith Apples",c:"Produce",q:1,u:5.99,t:5.99,ng:false},
  {d:"01/25",s:"Publix",r:"ORG DANDELION GRNS",n:"Organic Dandelion Greens",c:"Produce",q:1,u:2.99,t:2.99,ng:false},
  {d:"01/25",s:"Publix",r:"PRODUCE",n:"Produce Item",c:"Produce",q:1,u:3.99,t:3.99,ng:false},
  {d:"01/25",s:"Publix",r:"GREEN LEAF LETTUCE",n:"Green Leaf Lettuce",c:"Produce",q:1,u:2.49,t:2.49,ng:false},
  {d:"01/25",s:"Publix",r:"DONUT",n:"Donut (Bakery)",c:"Bakery & Bread",q:1,u:3.57,t:3.57,ng:false},
  {d:"01/25",s:"Publix",r:"ITEM YELL",n:"Yellow Squash/Produce",c:"Produce",q:1,u:4.99,t:4.99,ng:false},
  {d:"01/26",s:"Walmart",r:"TOMATO PAST",n:"Tomato Paste",c:"Canned & Packaged Foods",q:2,u:3.43,t:6.86,ng:false},
  {d:"01/26",s:"Walmart",r:"RED BELL",n:"Red Bell Peppers",c:"Produce",q:4,u:1.48,t:5.92,ng:false},
  {d:"01/26",s:"Austell Farmers Market",r:"TURKEY CUT WINGS",n:"Turkey Cut Wings",c:"Meat & Protein",q:2,u:8.13,t:16.25,ng:false},
  {d:"01/26",s:"Austell Farmers Market",r:"PLANTAIN GREEN",n:"Green Plantains",c:"Produce",q:1,u:6.90,t:6.90,ng:false},
  {d:"01/26",s:"Austell Farmers Market",r:"INDOMIE 40PK",n:"Indomie Instant Noodles 40-Pack",c:"Canned & Packaged Foods",q:1,u:19.99,t:19.99,ng:false},
  {d:"01/26",s:"Austell Farmers Market",r:"BADIA BAY LEAVES",n:"Badia Bay Leaves",c:"Baking & Pantry",q:1,u:6.49,t:6.49,ng:false},
  {d:"01/26",s:"Austell Farmers Market",r:"HABANERO RED",n:"Habanero Red Peppers",c:"Produce",q:1,u:4.15,t:4.15,ng:false},
  {d:"01/26",s:"Austell Farmers Market",r:"GOAT STEW MEAT",n:"Goat Stew Meat (Bone-In)",c:"Meat & Protein",q:3,u:21.76,t:65.28,ng:false},
  {d:"01/27",s:"Walmart",r:"OV GMILK",n:"Organic Valley Grassmilk Half Gallon",c:"Dairy & Eggs",q:2,u:6.67,t:13.34,ng:false},
  {d:"01/27",s:"Walmart",r:"PRG ORG",n:"Prego Organic Pasta Sauce",c:"Canned & Packaged Foods",q:1,u:2.27,t:2.27,ng:false},
  {d:"01/31",s:"Publix",r:"PUBLIX HVY WHP CRM",n:"Publix Heavy Whipping Cream",c:"Dairy & Eggs",q:1,u:3.50,t:3.50,ng:false},
  {d:"01/31",s:"Publix",r:"GHIR DRK CARAMEL",n:"Ghirardelli Dark Choc Caramel",c:"Candy & Sweets",q:1,u:5.50,t:5.50,ng:false},
  {d:"01/31",s:"Publix",r:"LINDT MILK CHOC",n:"Lindt Milk Chocolate Bar",c:"Candy & Sweets",q:1,u:5.50,t:5.50,ng:false},
  {d:"01/31",s:"Publix",r:"ORGANIC BLUEBERRIE",n:"Organic Blueberries",c:"Produce",q:1,u:5.00,t:5.00,ng:false},
  {d:"01/31",s:"Publix",r:"BONE BRO",n:"Bone Broth",c:"Canned & Packaged Foods",q:1,u:3.99,t:3.99,ng:false},
  {d:"01/31",s:"Walmart",r:"EOS VAN 160",n:"eos Vanilla Body Lotion",c:"Health & Beauty",q:1,u:9.97,t:9.97,ng:true},
  {d:"01/31",s:"Walmart",r:"SWEET SALTY",n:"Sweet & Salty Granola Bars",c:"Snacks & Chips",q:2,u:3.54,t:7.08,ng:false},
  {d:"01/31",s:"Walmart",r:"GV JCE",n:"Great Value Juice",c:"Beverages",q:2,u:3.24,t:6.48,ng:false},
];

// ─────────── CLASSIFICATION ───────────
const TOILETRY_CATS = ["Health & Beauty", "Household & Cleaning", "Paper Products"];

function itemType(item) {
  if (TOILETRY_CATS.includes(item.c)) return "toiletry";
  if (!item.ng) return "grocery";
  return "other";
}

// ─────────── UTILITIES ───────────
const fmt = v => "$" + v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const pct = (v, total) => total > 0 ? (v / total * 100).toFixed(1) + "%" : "0%";
const sum = arr => arr.reduce((s, i) => s + i.t, 0);
const formatBytes = b => b < 1024 ? b + " B" : (b / 1024).toFixed(1) + " KB";

const STORE_COLORS_BASE = {
  "Publix": "#4ade80",
  "Costco": "#f87171",
  "Costco (Online)": "#fb923c",
  "Target": "#f43f5e",
  "Walmart": "#60a5fa",
  "Instacart (Sprouts)": "#34d399",
  "Instacart (Ingles)": "#fb923c",
  "Instacart (Costco)": "#f97316",
  "Austell Farmers Market": "#fbbf24",
};
const STORE_COLORS_DYNAMIC = {};
const STORE_COLOR_POOL = ["#06b6d4","#ec4899","#8b5cf6","#10b981","#eab308","#0ea5e9","#d946ef","#84cc16","#e11d48","#0891b2"];
let storeColorIdx = 0;
const STORE_COLORS = new Proxy({}, {
  get(_, name) {
    if (STORE_COLORS_BASE[name]) return STORE_COLORS_BASE[name];
    if (!STORE_COLORS_DYNAMIC[name]) {
      STORE_COLORS_DYNAMIC[name] = STORE_COLOR_POOL[storeColorIdx % STORE_COLOR_POOL.length];
      storeColorIdx++;
    }
    return STORE_COLORS_DYNAMIC[name];
  }
});

const PALETTE = [
  "#22c55e","#3b82f6","#f59e0b","#ef4444","#a855f7",
  "#06b6d4","#ec4899","#14b8a6","#f97316","#8b5cf6",
  "#10b981","#6366f1","#eab308","#e11d48","#0ea5e9",
  "#84cc16","#d946ef","#f43f5e","#0891b2","#a3e635",
];

const COMPARE_COLORS = ["#22c55e","#3b82f6","#f59e0b","#ef4444","#a855f7","#06b6d4","#ec4899","#14b8a6"];

// ─────────── MONTH CONTEXT & STORAGE ───────────
let ctx = null;
let activeData = [];
let groceries = [], toiletries = [], others = [];
let grandTotal = 0, groceryTotal = 0, toiletryTotal = 0, otherTotal = 0;
let allTrips = [];
let ALL_CATEGORIES = [];
let filtersInitialized = false;

function buildMonthContext(monthKey) {
  const [yearStr, monthStr] = monthKey.split("_");
  const year = parseInt(yearStr);
  const month = parseInt(monthStr);
  const daysInMonth = new Date(year, month, 0).getDate();
  const weeks = [];
  for (let start = 1; start <= daysInMonth; start += 7) {
    const end = Math.min(start + 6, daysInMonth);
    weeks.push({
      name: "Week " + (weeks.length + 1) + " (" + start + "-" + end + ")",
      label: "Week " + (weeks.length + 1) + " \u2014 " + MONTH_ABBR[month - 1] + " " + start + "\u2013" + end,
      min: start, max: end
    });
  }
  return { month, year, monthName: MONTH_NAMES[month - 1], monthAbbr: MONTH_ABBR[month - 1], daysInMonth, weeks, editsKey: "edits_" + monthKey, storageKey: "data_" + monthKey, monthKey };
}

function getLoadedMonths() {
  if (typeof DEMO_MODE !== 'undefined' && DEMO_MODE) return JSON.parse(demoGet("grocery_months") || '[]').sort();
  return JSON.parse(localStorage.getItem("grocery_months") || '[]').sort();
}

function loadMonthData(monthKey) {
  const stored = (typeof DEMO_MODE !== 'undefined' && DEMO_MODE)
    ? demoGet("data_" + monthKey)
    : localStorage.getItem("data_" + monthKey);
  if (stored) return JSON.parse(stored);
  return null;
}

function initMonthData(data) {
  data.forEach((item, idx) => { item._idx = idx; item._origName = item.n; item._origCat = item.c; item._origNg = item.ng; });
  const editsStr = (typeof DEMO_MODE !== 'undefined' && DEMO_MODE)
    ? (demoGet(ctx.editsKey) || "{}")
    : (localStorage.getItem(ctx.editsKey) || "{}");
  const savedEdits = JSON.parse(editsStr);
  Object.entries(savedEdits).forEach(([idx, edits]) => {
    const i = parseInt(idx);
    if (data[i]) {
      if (edits.n !== undefined) data[i].n = edits.n;
      if (edits.c !== undefined) data[i].c = edits.c;
      if (edits.ng !== undefined) data[i].ng = edits.ng;
    }
  });
}

function recomputeAll() {
  groceries = activeData.filter(i => itemType(i) === "grocery");
  toiletries = activeData.filter(i => itemType(i) === "toiletry");
  others = activeData.filter(i => itemType(i) === "other");
  grandTotal = sum(activeData);
  groceryTotal = sum(groceries);
  toiletryTotal = sum(toiletries);
  otherTotal = sum(others);
  allTrips = buildTrips();
  ALL_CATEGORIES = [...new Set(activeData.map(i => i._origCat))].sort();
}

function destroyAllCharts() {
  Object.values(charts).forEach(c => { if (c && c.destroy) c.destroy(); });
  charts = {};
}

function updateHeader() {
  document.title = "Monthly Grocery & Household Spend Dashboard";
  document.getElementById("dashboard-title").textContent = "Monthly Grocery & Household Spend Dashboard";
  const stores = [...new Set(activeData.map(i => i.s))];
  const trips = [...new Set(activeData.map(i => i.d + "|" + i.s))].length;
  document.getElementById("dashboard-subtitle").innerHTML = "Family spend analysis across " + stores.length + " stores &bull; " + trips + " shopping trips &bull; " + activeData.length + " items purchased";
  document.getElementById("cumulative-title").textContent = "Cumulative Spend Over " + ctx.monthName;
}

function buildMonthSelector() {
  const months = getLoadedMonths();
  const select = document.getElementById("month-select");
  select.innerHTML = months.map(key => {
    const [y, m] = key.split("_");
    const name = MONTH_NAMES[parseInt(m) - 1] + " " + y;
    return '<option value="' + key + '"' + (key === ctx.monthKey ? ' selected' : '') + '>' + name + '</option>';
  }).join("");
  select.onchange = function() { switchMonth(this.value); };
}

function switchMonth(monthKey) {
  const data = loadMonthData(monthKey);
  if (!data) { showToast("No data found for this month.", "warning"); return; }
  if (typeof DEMO_MODE !== 'undefined' && DEMO_MODE) demoSet("grocery_activeMonth", monthKey);
  else localStorage.setItem("grocery_activeMonth", monthKey);
  ctx = buildMonthContext(monthKey);
  activeData = data;
  initMonthData(activeData);
  invalidateProductNamesCache();
  invalidateDupeCache();
  recomputeAll();
  destroyAllCharts();
  updateHeader();
  buildMonthSelector();
  filtersInitialized = false;
  renderAll();
  showView("overview");
}

function renderAll() {
  try { renderOverview(); } catch(e) { console.error('renderOverview error:', e); }
  try { renderGroceries(); } catch(e) { console.error('renderGroceries error:', e); }
  try { renderToiletries(); } catch(e) { console.error('renderToiletries error:', e); }
  try { renderStores(); } catch(e) { console.error('renderStores error:', e); }
  try { renderTrends(); } catch(e) { console.error('renderTrends error:', e); }
  try { renderTrips(); } catch(e) { console.error('renderTrips error:', e); }
  try { renderAllItems(); } catch(e) { console.error('renderAllItems error:', e); }
  try { renderCompare(); } catch(e) { console.error('renderCompare error:', e); }
}

// Migrate old edit key on first load
(function migrateEdits() {
  const old = localStorage.getItem("dashboardEdits");
  if (old) {
    localStorage.setItem("edits_2026_01", old);
    localStorage.removeItem("dashboardEdits");
  }
})();

function groupBy(arr, key) {
  const m = {};
  arr.forEach(i => {
    const k = typeof key === "function" ? key(i) : i[key];
    if (!m[k]) m[k] = { items: [], total: 0, qty: 0 };
    m[k].items.push(i);
    m[k].total += i.t;
    m[k].qty += i.q;
  });
  return Object.entries(m).map(([name, v]) => ({ name, ...v })).sort((a, b) => b.total - a.total);
}

function groupProducts(arr) {
  const m = {};
  arr.forEach(i => {
    if (!m[i.n]) m[i.n] = { name: i.n, cat: i.c, total: 0, qty: 0, count: 0 };
    m[i.n].total += i.t;
    m[i.n].qty += i.q;
    m[i.n].count++;
  });
  return Object.values(m).sort((a, b) => b.total - a.total);
}

// ─────────── CHART.JS DEFAULTS ───────────
Chart.defaults.color = "#71717a";
Chart.defaults.borderColor = "rgba(255,255,255,0.06)";
Chart.defaults.font.family = "'Segoe UI', system-ui, sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.pointStyle = "circle";
Chart.defaults.plugins.legend.labels.padding = 16;

const isMobile = window.innerWidth <= 900;
const legendPos = isMobile ? "bottom" : "right";

// ─────────── TAB SWITCHING ───────────
let charts = {};
function showView(id, filterType, filterOpts) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('view-' + id).classList.add('active');
  fadeInView('view-' + id);
  // Highlight the matching tab (trip-detail highlights "Trips" tab, category-detail highlights nothing)
  const tabId = id === 'trip-detail' ? 'trips' : (id === 'category-detail' || id === 'product-detail') ? '' : id;
  document.querySelectorAll('.tab').forEach(t => {
    if (t.getAttribute('data-view') === tabId) t.classList.add('active');
  });
  // Apply filters when navigating to items view
  if (id === 'items') {
    // Reset filters first
    document.getElementById('filter-date').value = "All";
    document.getElementById('filter-store').value = "All";
    document.getElementById('filter-cat').value = "All";
    document.getElementById('filter-type').value = "All";
    document.getElementById('filter-search').value = "";
    if (filterType) document.getElementById('filter-type').value = filterType;
    if (filterOpts) {
      if (filterOpts.date) document.getElementById('filter-date').value = filterOpts.date;
      if (filterOpts.store) document.getElementById('filter-store').value = filterOpts.store;
      if (filterOpts.cat) document.getElementById('filter-cat').value = filterOpts.cat;
    }
    renderTable();
  }
  // Resize charts after view switch
  setTimeout(() => { Object.values(charts).forEach(c => c.resize && c.resize()); }, 50);
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Helper to make a chart clickable - navigates to items filtered by the clicked segment
function makeChartClickable(chart, canvas, labels, filterKey) {
  canvas.style.cursor = "pointer";
  canvas.addEventListener("click", (evt) => {
    const points = chart.getElementsAtEventForMode(evt, "nearest", { intersect: true }, true);
    if (points.length > 0) {
      const idx = points[0].index;
      const label = labels[idx];
      const opts = {};
      opts[filterKey] = label;
      showView("items", null, opts);
    }
  });
}

// ─────────── RENDER ON LOAD ───────────
window.addEventListener("DOMContentLoaded", () => {
  const months = getLoadedMonths();
  const activeMonthKey = (typeof DEMO_MODE !== 'undefined' && DEMO_MODE)
    ? (demoGet("grocery_activeMonth") || (months.length ? months[months.length - 1] : null))
    : (localStorage.getItem("grocery_activeMonth") || (months.length ? months[0] : null));
  if (activeMonthKey) {
    ctx = buildMonthContext(activeMonthKey);
    activeData = loadMonthData(activeMonthKey) || [];
    initMonthData(activeData);
    recomputeAll();
    updateHeader();
    buildMonthSelector();
    renderAll();
  } else {
    // No data — show empty welcome state
    ctx = buildMonthContext(new Date().getFullYear() + "_" + String(new Date().getMonth() + 1).padStart(2, "0"));
    activeData = [];
    updateHeader();
    buildMonthSelector();
    const main = document.getElementById("main-content") || document.querySelector(".tabs")?.parentElement;
    if (main) {
      main.innerHTML = '<div style="text-align:center;padding:80px 20px"><div style="font-size:48px;margin-bottom:16px">&#128722;</div><div style="font-size:20px;font-weight:700;margin-bottom:8px">No Grocery Data Yet</div><div style="color:var(--text-muted);font-size:14px;margin-bottom:24px">Upload an Excel file or import from the Receipt Scanner to get started.</div><button onclick="openUploadModal()" class="month-nav-btn" style="background:rgba(34,197,94,0.15);color:var(--green);border:1px solid rgba(34,197,94,0.3);padding:10px 24px;font-size:14px">+ Upload Month</button></div>';
    }
  }
  // Demo mode: inject banner and update links
  if (typeof DEMO_MODE !== 'undefined' && DEMO_MODE) {
    injectDemoBanner('green');
    demofyLinks();
  }

  // One-time seed for founding user — loads original January 2026 data
  if (typeof fb_auth !== 'undefined' && !(typeof DEMO_MODE !== 'undefined' && DEMO_MODE)) {
    const _seedCheck = setInterval(() => {
      if (fb_auth.currentUser) {
        clearInterval(_seedCheck);
        if (fb_auth.currentUser.email === 'allagilejobs@gmail.com' && getLoadedMonths().length === 0) {
          localStorage.setItem('data_2026_01', JSON.stringify(SEED_DATA));
          localStorage.setItem('grocery_months', JSON.stringify(['2026_01']));
          localStorage.setItem('grocery_activeMonth', '2026_01');
          if (typeof syncToCloud === 'function') syncToCloud();
          location.reload();
        }
      }
    }, 500);
    setTimeout(() => clearInterval(_seedCheck), 10000);
  }
});

// ─────────── GLOBAL SEARCH ───────────
let searchTimeout = null;
function onGlobalSearch(query) {
  clearTimeout(searchTimeout);
  const resultsEl = document.getElementById("global-search-results");
  if (!query || query.length < 2) { resultsEl.style.display = "none"; return; }
  searchTimeout = setTimeout(() => {
    const q = query.toLowerCase();
    const results = { products: [], stores: [], categories: [] };

    // Search products
    const products = groupProducts(activeData);
    products.forEach(p => {
      if (p.name.toLowerCase().includes(q)) {
        results.products.push(p);
      }
    });

    // Search stores
    const storeGroups = groupBy(activeData, "s");
    storeGroups.forEach(s => {
      if (s.name.toLowerCase().includes(q)) {
        results.stores.push(s);
      }
    });

    // Search categories
    const catGroups = groupBy(activeData, "c");
    catGroups.forEach(c => {
      if (c.name.toLowerCase().includes(q)) {
        results.categories.push(c);
      }
    });

    const total = results.products.length + results.stores.length + results.categories.length;
    if (total === 0) {
      resultsEl.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text-muted);font-size:13px">No results found</div>';
      resultsEl.style.display = "block";
      return;
    }

    let html = '';
    const highlight = (text) => text.replace(new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>');

    if (results.products.length) {
      html += '<div class="search-group-header">Products (' + results.products.length + ')</div>';
      results.products.slice(0, 8).forEach(p => {
        const escaped = p.name.replace(/'/g, "\\'");
        html += '<div class="search-result" onclick="closeSearch();showProductDetail(\'' + escaped + '\',\'overview\')">';
        html += '<div><div class="search-result-name">' + highlight(p.name) + '</div>';
        html += '<div class="search-result-meta">' + p.cat + ' &bull; qty ' + p.qty + ' &bull; bought ' + p.count + 'x</div></div>';
        html += '<div class="search-result-amount">' + fmt(p.total) + '</div></div>';
      });
    }

    if (results.stores.length) {
      html += '<div class="search-group-header">Stores (' + results.stores.length + ')</div>';
      results.stores.forEach(s => {
        const escaped = s.name.replace(/'/g, "\\'");
        html += '<div class="search-result" onclick="closeSearch();showView(\'items\',null,{store:\'' + escaped + '\'})">';
        html += '<div><div class="search-result-name">' + highlight(s.name) + '</div>';
        html += '<div class="search-result-meta">' + s.items.length + ' items &bull; ' + s.qty + ' units</div></div>';
        html += '<div class="search-result-amount">' + fmt(s.total) + '</div></div>';
      });
    }

    if (results.categories.length) {
      html += '<div class="search-group-header">Categories (' + results.categories.length + ')</div>';
      results.categories.forEach(c => {
        const escaped = c.name.replace(/'/g, "\\'");
        html += '<div class="search-result" onclick="closeSearch();showView(\'items\',null,{cat:\'' + escaped + '\'})">';
        html += '<div><div class="search-result-name">' + highlight(c.name) + '</div>';
        html += '<div class="search-result-meta">' + c.items.length + ' items &bull; ' + pct(c.total, grandTotal) + ' of total</div></div>';
        html += '<div class="search-result-amount">' + fmt(c.total) + '</div></div>';
      });
    }

    resultsEl.innerHTML = html;
    resultsEl.style.display = "block";
  }, 150);
}

function closeSearch() {
  document.getElementById("global-search").value = '';
  document.getElementById("global-search-results").style.display = "none";
}

// Close search on click outside
document.addEventListener("click", (e) => {
  const wrap = document.getElementById("global-search-wrap");
  if (wrap && !wrap.contains(e.target)) {
    document.getElementById("global-search-results").style.display = "none";
  }
});

let detectedAnomalies = [];

// ─────────── CATEGORY DETAIL VIEW ───────────
let categoryDetailSource = 'overview';
function showCategoryDetail(categoryName, source) {
  categoryDetailSource = source || 'overview';
  const container = document.getElementById('category-detail-content');
  const backBtn = document.getElementById('category-detail-back');

  const backMap = { overview: ['overview','Overview'], groceries: ['groceries','Groceries'], toiletries: ['toiletries','Toiletries'], items: ['items','All Items'] };
  const [backTab, backLabel] = backMap[categoryDetailSource] || backMap.overview;
  backBtn.onclick = () => showView(backTab);
  backBtn.textContent = '\u2190 Back to ' + backLabel;

  const items = activeData.filter(i => i.c === categoryName).sort((a, b) => a.d.localeCompare(b.d));
  if (items.length === 0) { container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted)">No items found in this category</div>'; showView('category-detail'); return; }

  const total = items.reduce((s, i) => s + i.t, 0);
  const totalQty = items.reduce((s, i) => s + i.q, 0);
  const catPctOfAll = ((total / grandTotal) * 100).toFixed(1);
  const isGrocery = items.some(i => itemType(i) === 'grocery');
  const isToi = items.some(i => itemType(i) === 'toiletry');
  const typeLabel = isGrocery ? 'Grocery' : isToi ? 'Toiletry' : 'Other';

  // Group by product
  const products = {};
  items.forEach(i => {
    if (!products[i.n]) products[i.n] = { name: i.n, total: 0, qty: 0, count: 0, stores: new Set(), dates: new Set() };
    products[i.n].total += i.t;
    products[i.n].qty += i.q;
    products[i.n].count++;
    products[i.n].stores.add(i.s);
    products[i.n].dates.add(i.d);
  });
  const prodList = Object.values(products).sort((a, b) => b.total - a.total);

  // Group by store
  const stores = {};
  items.forEach(i => {
    if (!stores[i.s]) stores[i.s] = { name: i.s, total: 0, count: 0 };
    stores[i.s].total += i.t;
    stores[i.s].count++;
  });
  const storeList = Object.values(stores).sort((a, b) => b.total - a.total);

  const catIdx = ALL_CATEGORIES.indexOf(categoryName);
  const catColor = PALETTE[(catIdx >= 0 ? catIdx : 0) % PALETTE.length];
  const dates = [...new Set(items.map(i => i.d))].sort();
  const dateRange = dates.length > 1 ? (ctx.monthAbbr + ' ' + parseInt(dates[0].split('/')[1]) + ' \u2014 ' + ctx.monthAbbr + ' ' + parseInt(dates[dates.length - 1].split('/')[1])) : ctx.monthAbbr + ' ' + parseInt(dates[0].split('/')[1]);

  let html = '';

  // Header card
  html += '<div class="card" style="border-left:4px solid ' + catColor + '">';
  html += '<div style="font-size:22px;font-weight:700;margin-bottom:4px;color:' + catColor + '">' + categoryName + '</div>';
  html += '<div style="font-size:13px;color:var(--text-muted)">' + typeLabel + ' \u2022 ' + prodList.length + ' products \u2022 ' + storeList.length + ' store' + (storeList.length !== 1 ? 's' : '') + ' \u2022 ' + dateRange + '</div>';
  html += '</div>';

  // KPIs
  html += '<div class="kpi-grid">';
  html += '<div class="kpi-card" style="cursor:default"><div class="kpi-label">Total Spent</div><div class="kpi-value amt">' + fmt(total) + '</div><div class="kpi-sub">' + catPctOfAll + '% of all spending</div></div>';
  html += '<div class="kpi-card" style="cursor:default"><div class="kpi-label">Items Purchased</div><div class="kpi-value" style="color:var(--cyan)">' + totalQty + '</div><div class="kpi-sub">' + items.length + ' line items, avg ' + fmt(total / totalQty) + '/unit</div></div>';
  html += '<div class="kpi-card" style="cursor:default"><div class="kpi-label">Top Product</div><div class="kpi-value" style="font-size:18px;color:var(--green)">' + prodList[0].name + '</div><div class="kpi-sub">' + fmt(prodList[0].total) + ' (' + prodList[0].qty + ' units)</div></div>';
  html += '<div class="kpi-card" style="cursor:default"><div class="kpi-label">Best Store</div><div class="kpi-value" style="font-size:18px;color:var(--amber)">' + storeList[0].name + '</div><div class="kpi-sub">' + fmt(storeList[0].total) + ' (' + storeList[0].count + ' items)</div></div>';
  html += '</div>';

  // Products table
  html += '<div class="card"><div class="card-title">Products in ' + categoryName + '</div>';
  html += '<table><thead><tr><th>Product</th><th>Store(s)</th><th class="text-center">Qty</th><th class="text-right">Total</th><th class="text-right">Avg/Unit</th><th class="text-right">Share</th></tr></thead><tbody>';
  prodList.forEach(p => {
    const pPct = ((p.total / total) * 100).toFixed(1);
    const escaped = p.name.replace(/'/g, "\\'");
    html += '<tr style="cursor:pointer" onclick="showProductDetail(\'' + escaped + '\',\'category-detail\')">';
    html += '<td style="font-weight:600">' + p.name + ' <span style="float:right;color:var(--text-muted);font-size:11px">\u2192</span></td>';
    html += '<td style="font-size:12px;color:var(--text-muted)">' + [...p.stores].join(', ') + '</td>';
    html += '<td class="text-center">' + p.qty + '</td>';
    html += '<td class="text-right amt">' + fmt(p.total) + '</td>';
    html += '<td class="text-right mono">' + fmt(p.total / p.qty) + '</td>';
    html += '<td class="text-right">' + pPct + '%</td></tr>';
  });
  html += '</tbody></table></div>';

  // Store breakdown for this category
  if (storeList.length > 1) {
    html += '<div class="card"><div class="card-title">By Store</div>';
    html += '<table><thead><tr><th>Store</th><th class="text-right">Total</th><th class="text-right">Items</th><th class="text-right">Share</th></tr></thead><tbody>';
    storeList.forEach(s => {
      const sPct = ((s.total / total) * 100).toFixed(1);
      html += '<tr style="cursor:pointer" onclick="showView(\'items\',null,{store:\'' + s.name.replace(/'/g, "\\'") + '\',cat:\'' + categoryName.replace(/'/g, "\\'") + '\'})">';
      html += '<td style="font-weight:600">' + s.name + '</td>';
      html += '<td class="text-right amt">' + fmt(s.total) + '</td>';
      html += '<td class="text-right">' + s.count + '</td>';
      html += '<td class="text-right">' + sPct + '%</td></tr>';
    });
    html += '</tbody></table></div>';
  }

  // Daily spending chart
  if (ctx.daysInMonth) {
    html += '<div class="card"><div class="card-title">Daily Spending in ' + categoryName + '</div><div class="chart-wrap"><canvas id="chart-cat-detail-daily"></canvas></div></div>';
  }

  // All items list
  html += '<div class="card"><div class="card-title">All Items (' + items.length + ')</div>';
  html += '<table><thead><tr><th>Date</th><th>Store</th><th>Product</th><th class="text-center">Qty</th><th class="text-right">Unit $</th><th class="text-right">Total</th></tr></thead><tbody>';
  items.forEach(i => {
    const escaped = i.n.replace(/'/g, "\\'");
    const dayNum = parseInt(i.d.split('/')[1]);
    const dateLabel = ctx.monthName ? ctx.monthName + ' ' + dayNum + ', ' + ctx.year : i.d;
    html += '<tr style="cursor:pointer" onclick="showProductDetail(\'' + escaped + '\',\'category-detail\')">';
    html += '<td class="mono">' + dateLabel + '</td>';
    html += '<td>' + i.s + '</td>';
    html += '<td class="bold">' + i.n + '</td>';
    html += '<td class="text-center">' + i.q + '</td>';
    html += '<td class="text-right mono">' + fmt(i.u) + '</td>';
    html += '<td class="text-right mono amt">' + fmt(i.t) + '</td></tr>';
  });
  html += '</tbody></table></div>';

  container.innerHTML = html;

  // Render daily chart
  if (ctx.daysInMonth) {
    const dailyData = new Array(ctx.daysInMonth).fill(0);
    items.forEach(i => { const day = parseInt(i.d.split('/')[1]); if (day >= 1 && day <= ctx.daysInMonth) dailyData[day - 1] += i.t; });
    const labels = Array.from({ length: ctx.daysInMonth }, (_, idx) => ctx.monthAbbr + ' ' + (idx + 1));
    if (charts.catDetailDaily) charts.catDetailDaily.destroy();
    charts.catDetailDaily = new Chart(document.getElementById('chart-cat-detail-daily'), {
      type: 'bar',
      data: { labels, datasets: [{ data: dailyData, backgroundColor: catColor + '80', borderRadius: 3 }] },
      options: withChartAnimation({ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
        scales: { x: { grid: { display: false }, ticks: { color: '#71717a', font: { size: 10 }, maxRotation: 45 } },
                 y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#71717a', callback: v => '$' + v } } } })
    });
  }

  showView('category-detail');
}

// ─────────── ANOMALY DETECTION ───────────
function detectAnomalies() {
  if (activeData.length < 5) return [];
  const anomalies = [];

  // Per-product anomalies: unit prices notably above average for that product
  const products = groupProducts(activeData);
  products.forEach(p => {
    if (p.count < 2) return;
    const items = activeData.filter(i => i.n === p.name);
    const avgUnit = items.reduce((s, i) => s + i.u, 0) / items.length;
    // For 2-item products, use simple ratio check instead of z-score
    if (items.length === 2) {
      const hi = items[0].u >= items[1].u ? items[0] : items[1];
      if (hi.u > avgUnit * 1.3 && (hi.u - avgUnit) > 0.50) {
        anomalies.push({
          type: 'price',
          item: hi,
          product: hi.n,
          amount: hi.u,
          avg: avgUnit,
          ratio: (hi.u / avgUnit).toFixed(1),
          message: hi.n + ' at ' + fmt(hi.u) + '/unit is ' + (hi.u / avgUnit).toFixed(1) + 'x your usual (' + fmt(avgUnit) + ' avg) \u2014 ' + hi.s + ' on ' + hi.d
        });
      }
      return;
    }
    const stdDev = Math.sqrt(items.reduce((s, i) => s + Math.pow(i.u - avgUnit, 2), 0) / items.length);
    if (stdDev === 0) return;
    items.forEach(i => {
      const zScore = (i.u - avgUnit) / stdDev;
      if (zScore >= 1.2 && i.u > avgUnit * 1.3) {
        anomalies.push({
          type: 'price',
          item: i,
          product: i.n,
          amount: i.u,
          avg: avgUnit,
          ratio: (i.u / avgUnit).toFixed(1),
          message: i.n + ' at ' + fmt(i.u) + '/unit is ' + (i.u / avgUnit).toFixed(1) + 'x your usual (' + fmt(avgUnit) + ' avg) \u2014 ' + i.s + ' on ' + i.d
        });
      }
    });
  });

  // Per-category anomalies: single item total that dominates the category
  const catGroups = groupBy(activeData, 'c');
  catGroups.forEach(cg => {
    if (cg.items.length < 3) return;
    const avg = cg.total / cg.items.length;
    cg.items.forEach(i => {
      const pctOfCat = i.t / cg.total;
      if (pctOfCat > 0.25 && i.t > avg * 1.8) {
        const exists = anomalies.find(a => a.item && a.item._idx === i._idx);
        if (!exists) {
          anomalies.push({
            type: 'category',
            item: i,
            product: i.n,
            amount: i.t,
            avg: avg,
            ratio: (i.t / avg).toFixed(1),
            message: i.n + ' at ' + fmt(i.t) + ' is ' + ((pctOfCat * 100).toFixed(0)) + '% of all ' + cg.name + ' spending'
          });
        }
      }
    });
  });

  // Top expensive items that stand out from the overall average
  if (anomalies.length === 0) {
    const overallAvg = grandTotal / activeData.length;
    const expensive = activeData.filter(i => i.t > overallAvg * 3).sort((a, b) => b.t - a.t).slice(0, 3);
    expensive.forEach(i => {
      anomalies.push({
        type: 'expensive',
        item: i,
        product: i.n,
        amount: i.t,
        avg: overallAvg,
        ratio: (i.t / overallAvg).toFixed(1),
        message: i.n + ' at ' + fmt(i.t) + ' is ' + (i.t / overallAvg).toFixed(1) + 'x the average item cost (' + fmt(overallAvg) + ') \u2014 ' + i.s + ' on ' + i.d
      });
    });
  }

  return anomalies.sort((a, b) => parseFloat(b.ratio) - parseFloat(a.ratio)).slice(0, 5);
}

// ─────────── REGULAR PURCHASE DETECTION ───────────
function detectPriceChanges() {
  var months = getLoadedMonths().sort();
  if (months.length < 2) return [];
  var currentMk = ctx.monthKey;
  // Build product→price map for all previous months
  var prevPrices = {};
  months.forEach(function(mk) {
    if (mk === currentMk) return;
    var data = loadMonthData(mk);
    if (!data) return;
    data.forEach(function(item) {
      if (!prevPrices[item.n]) prevPrices[item.n] = [];
      prevPrices[item.n].push({ month: mk, unitPrice: item.u, store: item.s });
    });
  });
  // Compare current month prices to historical average
  var changes = [];
  var seen = {};
  activeData.forEach(function(item) {
    if (seen[item.n]) return;
    seen[item.n] = true;
    var prev = prevPrices[item.n];
    if (!prev || prev.length === 0) return;
    var avgPrev = prev.reduce(function(s, p) { return s + p.unitPrice; }, 0) / prev.length;
    if (avgPrev === 0) return;
    var pctChange = ((item.u - avgPrev) / avgPrev) * 100;
    if (Math.abs(pctChange) >= 10) {
      changes.push({ name: item.n, currentPrice: item.u, prevAvg: avgPrev, pctChange: pctChange, category: item.c, store: item.s });
    }
  });
  return changes.sort(function(a, b) { return Math.abs(b.pctChange) - Math.abs(a.pctChange); });
}

function detectRegularPurchases() {
  const results = [];
  const seen = new Set();
  const months = getLoadedMonths();

  // Cross-month detection (high confidence): items appearing in 2+ months
  if (months.length >= 2) {
    const allMonthProducts = {};
    months.forEach(mk => {
      const data = loadMonthData(mk);
      if (!data) return;
      allMonthProducts[mk] = {};
      data.forEach(i => {
        if (!allMonthProducts[mk][i.n]) allMonthProducts[mk][i.n] = { prices: [], qty: 0, cat: i.c, stores: new Set() };
        allMonthProducts[mk][i.n].prices.push(i.u);
        allMonthProducts[mk][i.n].qty += i.q;
        allMonthProducts[mk][i.n].stores.add(i.s);
      });
    });

    const allNames = new Set();
    months.forEach(mk => { if (allMonthProducts[mk]) Object.keys(allMonthProducts[mk]).forEach(n => allNames.add(n)); });

    allNames.forEach(name => {
      const monthsPresent = months.filter(mk => allMonthProducts[mk] && allMonthProducts[mk][name]);
      if (monthsPresent.length < 2) return;

      const allPrices = monthsPresent.flatMap(mk => allMonthProducts[mk][name].prices);
      const avg = allPrices.reduce((s, p) => s + p, 0) / allPrices.length;
      const stores = new Set();
      let cat = '';
      monthsPresent.forEach(mk => { allMonthProducts[mk][name].stores.forEach(s => stores.add(s)); cat = allMonthProducts[mk][name].cat; });

      results.push({
        name,
        avgPrice: avg,
        frequency: monthsPresent.length + '/' + months.length + ' months',
        confidence: 'high',
        category: cat,
        stores: [...stores].join(', ')
      });
      seen.add(name);
    });
  }

  // Single-month detection: items bought on multiple separate days
  const products = groupProducts(activeData);
  products.forEach(p => {
    if (seen.has(p.name)) return;
    // Get unique purchase dates
    const dates = [...new Set(activeData.filter(i => i.n === p.name).map(i => i.d))];
    if (dates.length < 2) return;

    const prices = activeData.filter(i => i.n === p.name).map(i => i.u);
    const avg = prices.reduce((s, v) => s + v, 0) / prices.length;
    const maxDev = Math.max(...prices.map(v => Math.abs(v - avg)));
    const isStable = avg > 0 && (maxDev / avg) <= 0.15;
    const storeSet = new Set(activeData.filter(i => i.n === p.name).map(i => i.s));
    const cat = activeData.find(i => i.n === p.name).c;

    if (isStable || dates.length >= 3) {
      results.push({
        name: p.name,
        avgPrice: avg,
        frequency: dates.length + 'x this month',
        confidence: isStable && dates.length >= 3 ? 'high' : 'medium',
        category: cat,
        stores: [...storeSet].join(', ')
      });
    }
  });

  return results.sort((a, b) => b.avgPrice - a.avgPrice);
}

// ─────────── THEME TOGGLE ───────────
function toggleTheme() {
  const isLight = document.body.classList.toggle("light");
  if (typeof DEMO_MODE !== 'undefined' && DEMO_MODE) sessionStorage.setItem("demo_grocery_theme", isLight ? "light" : "dark");
  else localStorage.setItem("grocery_theme", isLight ? "light" : "dark");
  document.getElementById("theme-toggle").innerHTML = isLight ? "&#9788;" : "&#9790;";
}
// Apply saved theme on load
(function() {
  const saved = (typeof DEMO_MODE !== 'undefined' && DEMO_MODE)
    ? sessionStorage.getItem("demo_grocery_theme")
    : localStorage.getItem("grocery_theme");
  if (saved === "light") {
    document.body.classList.add("light");
    document.getElementById("theme-toggle").innerHTML = "&#9788;";
  }
})();

// ─────────── OVERVIEW ───────────
function renderOverview() {
  const stores = [...new Set(activeData.map(i => i.s))];
  const trips = [...new Set(activeData.map(i => i.d + "|" + i.s))].length;

  document.getElementById("kpi-overview").innerHTML = [
    { label: "Total Spend", value: fmt(grandTotal), color: "var(--green)", sub: `${activeData.length} line items`, nav: "items", navLabel: "View all items" },
    { label: "Groceries", value: fmt(groceryTotal), color: "var(--green)", sub: pct(groceryTotal, grandTotal) + " of total", nav: "groceries", navLabel: "View groceries" },
    { label: "Toiletries", value: fmt(toiletryTotal), color: "var(--purple)", sub: pct(toiletryTotal, grandTotal) + " of total", nav: "toiletries", navLabel: "View toiletries" },
    { label: "Other Non-Grocery", value: fmt(otherTotal), color: "var(--rose)", sub: pct(otherTotal, grandTotal) + " of total", nav: "items", filter: "Other", navLabel: "View other items" },
    { label: "Shopping Trips", value: trips, color: "var(--cyan)", sub: `Avg ${fmt(grandTotal / trips)}/trip`, nav: "trends", navLabel: "View trends" },
    { label: "Stores Visited", value: stores.length, color: "var(--amber)", sub: "Publix most frequent", nav: "stores", navLabel: "View stores" },
  ].map(k => `
    <div class="kpi-card" onclick="showView('${k.nav}'${k.filter ? ",'" + k.filter + "'" : ''})" title="${k.navLabel}">
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-value" style="color:${k.color}">${k.value}</div>
      <div class="kpi-sub">${k.sub}</div>
    </div>`).join("");
  animateKPICards('#kpi-overview');

  // Category pie
  const catGroups = groupBy(activeData, "c");
  charts.catPie = new Chart(document.getElementById("chart-cat-pie"), {
    type: "doughnut",
    data: {
      labels: catGroups.map(g => g.name),
      datasets: [{ data: catGroups.map(g => +g.total.toFixed(2)), backgroundColor: catGroups.map((_, i) => PALETTE[i % PALETTE.length]), borderWidth: 0 }]
    },
    options: withChartAnimation({
      responsive: true, maintainAspectRatio: false,
      cutout: "55%",
      plugins: {
        legend: { position: legendPos, labels: { font: { size: 11 }, padding: 8 } },
        tooltip: { callbacks: { label: ctx => `${ctx.label}: ${fmt(ctx.raw)} (${pct(ctx.raw, grandTotal)})` } }
      }
    })
  });

  makeChartClickable(charts.catPie, document.getElementById("chart-cat-pie"), catGroups.map(g => g.name), "cat");

  // Store pie
  const storeGroups = groupBy(activeData, "s");
  charts.storePie = new Chart(document.getElementById("chart-store-pie"), {
    type: "doughnut",
    data: {
      labels: storeGroups.map(g => g.name),
      datasets: [{ data: storeGroups.map(g => +g.total.toFixed(2)), backgroundColor: storeGroups.map(g => STORE_COLORS[g.name] || "#888"), borderWidth: 0 }]
    },
    options: withChartAnimation({
      responsive: true, maintainAspectRatio: false,
      cutout: "55%",
      plugins: {
        legend: { position: legendPos, labels: { font: { size: 11 }, padding: 8 } },
        tooltip: { callbacks: { label: ctx => `${ctx.label}: ${fmt(ctx.raw)} (${pct(ctx.raw, grandTotal)})` } }
      }
    })
  });

  makeChartClickable(charts.storePie, document.getElementById("chart-store-pie"), storeGroups.map(g => g.name), "store");

  // Weekly bar
  const weeks = ctx.weeks;
  const weeklyData = weeks.map(w => {
    const items = activeData.filter(i => { const day = parseInt(i.d.split("/")[1]); return day >= w.min && day <= w.max; });
    const g = items.filter(i => itemType(i) === "grocery");
    const t = items.filter(i => itemType(i) === "toiletry");
    return { name: w.name, grocery: +sum(g).toFixed(2), toiletry: +sum(t).toFixed(2) };
  });
  charts.weekly = new Chart(document.getElementById("chart-weekly"), {
    type: "bar",
    data: {
      labels: weeklyData.map(w => w.name),
      datasets: [
        { label: "Groceries", data: weeklyData.map(w => w.grocery), backgroundColor: "#22c55e", borderRadius: 6 },
        { label: "Toiletries", data: weeklyData.map(w => w.toiletry), backgroundColor: "#a855f7", borderRadius: 6 },
      ]
    },
    options: withChartAnimation({
      responsive: true, maintainAspectRatio: false,
      scales: { x: { stacked: true }, y: { stacked: true, ticks: { callback: v => "$" + v } } },
      plugins: { tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${fmt(ctx.raw)}` } } }
    })
  });

  // Grocery/Toiletry/Other split
  charts.split = new Chart(document.getElementById("chart-split"), {
    type: "doughnut",
    data: {
      labels: ["Groceries", "Toiletries", "Other Non-Grocery"],
      datasets: [{
        data: [+groceryTotal.toFixed(2), +toiletryTotal.toFixed(2), +otherTotal.toFixed(2)],
        backgroundColor: ["#22c55e", "#a855f7", "#f43f5e"],
        borderWidth: 0
      }]
    },
    options: withChartAnimation({
      responsive: true, maintainAspectRatio: false,
      cutout: "60%",
      plugins: {
        tooltip: { callbacks: { label: ctx => `${ctx.label}: ${fmt(ctx.raw)} (${pct(ctx.raw, grandTotal)})` } }
      }
    })
  });

  // Make split chart clickable - Groceries/Toiletries/Other navigate to respective tabs
  const splitCanvas = document.getElementById("chart-split");
  splitCanvas.style.cursor = "pointer";
  splitCanvas.addEventListener("click", (evt) => {
    const points = charts.split.getElementsAtEventForMode(evt, "nearest", { intersect: true }, true);
    if (points.length > 0) {
      const idx = points[0].index;
      if (idx === 0) showView("groceries");
      else if (idx === 1) showView("toiletries");
      else showView("items", "Other");
    }
  });

  // Smart Insights
  const topCat = catGroups[0];
  const topStore = storeGroups[0];
  const products = groupProducts(activeData);
  const topProduct = products[0];
  const freqProducts = products.filter(p => p.count >= 2);
  const tripKeys = [...new Set(activeData.map(i => i.d + "|" + i.s))];
  const avgTrip = grandTotal / tripKeys.length;
  const dayGroups = groupBy(activeData, "d").sort((a,b) => b.total - a.total);
  const biggestDay = dayGroups[0];
  const cheapestDay = dayGroups[dayGroups.length - 1];

  // Spending concentration: what % of spend comes from top 3 categories
  const top3CatTotal = catGroups.slice(0, 3).reduce((s, c) => s + c.total, 0);
  const top3CatPct = pct(top3CatTotal, grandTotal);
  const top3CatNames = catGroups.slice(0, 3).map(c => c.name).join(", ");

  // Store loyalty: what % at top store
  const topStorePct = pct(topStore.total, grandTotal);

  // Most expensive single item purchase
  const priciest = [...activeData].sort((a, b) => b.u - a.u)[0];

  // Busiest day of week
  const dowCounts = [0,0,0,0,0,0,0];
  const dowSpend = [0,0,0,0,0,0,0];
  const dowNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  activeData.forEach(i => {
    const day = parseInt(i.d.split("/")[1]);
    const d = new Date(ctx.year, ctx.month - 1, day);
    if (!isNaN(d)) { dowCounts[d.getDay()]++; dowSpend[d.getDay()] += i.t; }
  });
  const busiestDow = dowCounts.indexOf(Math.max(...dowCounts));
  const biggestSpendDow = dowSpend.indexOf(Math.max(...dowSpend));

  // Average items per trip
  const avgItemsPerTrip = (activeData.length / tripKeys.length).toFixed(1);

  // Spending streaks — separate card above Key Insights
  const streaksEl = document.getElementById("overview-streaks");
  if (ctx.daysInMonth) {
    const streakDays = new Set();
    activeData.forEach(i => { const day = parseInt(i.d.split("/")[1]); if (day >= 1 && day <= ctx.daysInMonth) streakDays.add(day); });
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
    let sHtml = '<div class="card" style="cursor:pointer" onclick="showView(\'trends\')"><div class="card-title">Spending Streaks</div>';
    sHtml += '<div class="grid-3" style="margin-top:8px">';
    sHtml += `<div class="insight" style="cursor:pointer"><div class="insight-title">Longest Shopping Streak</div><div class="insight-text"><span class="insight-val">${mxS} day${mxS !== 1 ? 's' : ''}</span> in a row${mxS > 0 ? ' (' + ctx.monthAbbr + ' ' + bestSStart + '\u2013' + (bestSStart + mxS - 1) + ')' : ''}</div></div>`;
    sHtml += `<div class="insight" style="cursor:pointer"><div class="insight-title">Longest No-Spend Streak</div><div class="insight-text"><span class="insight-val">${mxN} day${mxN !== 1 ? 's' : ''}</span> without spending${mxN > 0 ? ' (' + ctx.monthAbbr + ' ' + bestNStart + '\u2013' + (bestNStart + mxN - 1) + ')' : ''}</div></div>`;
    sHtml += `<div class="insight" style="cursor:pointer"><div class="insight-title">Active Shopping Days</div><div class="insight-text"><span class="insight-val">${streakDays.size}/${ctx.daysInMonth}</span> days with purchases (${((streakDays.size / ctx.daysInMonth) * 100).toFixed(0)}% of the month)</div></div>`;
    sHtml += '</div></div>';
    streaksEl.innerHTML = sHtml;
  } else {
    streaksEl.innerHTML = '';
  }

  // Build insights array
  const insights = [];
  insights.push(
    { title: "Spending Concentration", text: `Your top 3 categories (<span class="insight-val">${top3CatNames}</span>) account for <span class="insight-val">${top3CatPct}</span> of all spending`, action: `showCategoryDetail('${topCat.name.replace(/'/g, "\\'")}','overview')` },
    { title: "Store Loyalty", text: `<span class="insight-val">${topStorePct}</span> of your budget goes to <span class="insight-val">${topStore.name}</span> (${fmt(topStore.total)} across ${topStore.items.length} items)`, action: `showView('items',null,{store:'${topStore.name}'})` },
    { title: "Costliest Single Product", text: `<span class="insight-val">${topProduct.name}</span> &mdash; ${fmt(topProduct.total)} total (qty ${topProduct.qty})`, action: `showProductDetail('${topProduct.name.replace(/'/g, "\\'")}','overview')` },
    { title: "Biggest Shopping Day", text: `<span class="insight-val">${ctx.monthAbbr} ${parseInt(biggestDay.name.split("/")[1])}</span> &mdash; ${fmt(biggestDay.total)} across ${biggestDay.items.length} items (${pct(biggestDay.total, grandTotal)} of monthly total)`, action: `showView('items',null,{date:'${biggestDay.name}'})` },
    { title: "Most Expensive Unit Price", text: `<span class="insight-val">${priciest.n}</span> at <span class="insight-val">${fmt(priciest.u)}/unit</span> from ${priciest.s}`, action: `showProductDetail('${priciest.n.replace(/'/g, "\\'")}','overview')` },
    { title: "Shopping Pattern", text: `You shop most on <span class="insight-val">${dowNames[busiestDow]}s</span> (${dowCounts[busiestDow]} items) and spend most on <span class="insight-val">${dowNames[biggestSpendDow]}s</span> (${fmt(dowSpend[biggestSpendDow])})`, action: `showView('trends')` },
    { title: "Trip Efficiency", text: `<span class="insight-val">${avgItemsPerTrip} items/trip</span> average across ${tripKeys.length} trips at <span class="insight-val">${fmt(avgTrip)}/trip</span>`, action: `showView('trips')` },
    { title: "Repeat Purchases", text: `<span class="insight-val">${freqProducts.length} products</span> bought 2+ times, totaling ${fmt(freqProducts.reduce((s,p) => s + p.total, 0))} (${pct(freqProducts.reduce((s,p) => s + p.total, 0), grandTotal)} of spend)`, action: `showView('groceries')` },
    { title: "Toiletries vs Groceries", text: `For every <span class="insight-val">$1</span> on toiletries, you spend <span class="insight-val">${fmt(toiletryTotal > 0 ? groceryTotal / toiletryTotal : 0).replace('$','')}</span> on groceries`, action: `showView('toiletries')` },
  );

  document.getElementById("insights").innerHTML = insights.map(ins =>
    `<div class="insight" onclick="${ins.action}" style="cursor:pointer"><div class="insight-title">${ins.title}</div><div class="insight-text">${ins.text}</div></div>`
  ).join("");

  // Price Inflation Tracking
  var priceChanges = detectPriceChanges();
  var priceEl = document.getElementById("price-changes-card");
  if (priceEl) {
    if (priceChanges.length > 0) {
      var pcHtml = '<div class="card" style="border-color:rgba(249,115,22,0.2)"><div class="card-title" style="color:var(--amber)">Price Changes vs Previous Months</div>';
      priceChanges.slice(0, 8).forEach(function(pc) {
        var isUp = pc.pctChange > 0;
        var arrow = isUp ? '<span style="color:var(--rose)">&#9650;</span>' : '<span style="color:var(--green)">&#9660;</span>';
        var pctColor = isUp ? 'var(--rose)' : 'var(--green)';
        var escaped = pc.name.replace(/'/g, "\\'");
        pcHtml += '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);cursor:pointer;gap:10px" onclick="showProductDetail(\'' + escaped + '\',\'overview\')">';
        pcHtml += '<div style="flex:1;min-width:0"><div style="font-weight:600;font-size:13px">' + pc.name + '</div>';
        pcHtml += '<div style="font-size:11px;color:var(--text-muted)">' + pc.category + ' &bull; ' + pc.store + '</div></div>';
        pcHtml += '<div style="text-align:right;white-space:nowrap">';
        pcHtml += '<div style="font-size:13px">' + fmt(pc.prevAvg) + ' &rarr; ' + fmt(pc.currentPrice) + '</div>';
        pcHtml += '<div style="font-size:12px;font-weight:700;color:' + pctColor + '">' + arrow + ' ' + (isUp ? '+' : '') + pc.pctChange.toFixed(1) + '%</div>';
        pcHtml += '</div></div>';
      });
      if (priceChanges.length > 8) {
        pcHtml += '<div style="text-align:center;padding:8px;font-size:11px;color:var(--text-muted)">and ' + (priceChanges.length - 8) + ' more items with price changes</div>';
      }
      pcHtml += '</div>';
      priceEl.innerHTML = pcHtml;
    } else {
      priceEl.innerHTML = '';
    }
  }

  // Recurring / Regular Purchases
  const recurring = detectRegularPurchases();
  const recurringEl = document.getElementById("recurring-card");
  if (recurring.length > 0) {
    let rHtml = '<div class="card"><div class="card-title">Regular Purchases</div>';
    recurring.forEach(r => {
      const confColor = r.confidence === 'high' ? 'var(--green)' : r.confidence === 'medium' ? 'var(--amber)' : 'var(--text-muted)';
      const confBg = r.confidence === 'high' ? 'rgba(34,197,94,0.12)' : r.confidence === 'medium' ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.05)';
      const catIdx = ALL_CATEGORIES.indexOf(r.category);
      const catClr = PALETTE[(catIdx >= 0 ? catIdx : 0) % PALETTE.length];
      const escaped = r.name.replace(/'/g, "\\'");
      rHtml += `<div class="clickable-row" style="display:flex;justify-content:space-between;align-items:center;padding:12px 8px;border-bottom:1px solid rgba(255,255,255,0.04);cursor:pointer;gap:10px" onclick="showProductDetail('${escaped}','overview')">`;
      rHtml += `<div style="flex:1;min-width:0">`;
      rHtml += `<div style="font-weight:600;font-size:14px;margin-bottom:3px">${r.name}</div>`;
      rHtml += `<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center">`;
      rHtml += `<span class="tag" style="background:${catClr}22;color:${catClr}">${r.category}</span>`;
      rHtml += `<span style="font-size:11px;color:var(--text-muted)">${r.stores}</span>`;
      rHtml += `<span style="font-size:11px;color:var(--text-muted)">\u2022 ${r.frequency}</span>`;
      rHtml += `<span class="tag" style="background:${confBg};color:${confColor}">${r.confidence}</span>`;
      rHtml += `</div></div>`;
      rHtml += `<div style="font-size:16px;font-weight:700;color:var(--amber);white-space:nowrap">${fmt(r.avgPrice)}</div>`;
      rHtml += `</div>`;
    });
    rHtml += '</div>';
    recurringEl.innerHTML = rHtml;
  } else {
    recurringEl.innerHTML = '';
  }

  // Unusual Purchases (Anomaly Detection)
  try {
  const anomalies = detectAnomalies();
  detectedAnomalies = anomalies;
  const anomalyEl = document.getElementById("anomaly-card");
  if (anomalies.length > 0) {
    let aHtml = '<div class="card"><div class="card-title" style="color:var(--rose)">Unusual Purchases</div>';
    aHtml += '<div style="font-size:12px;color:var(--text-muted);margin:-8px 0 14px">Items with prices or amounts significantly above their average</div>';
    anomalies.forEach(a => {
      const escaped = a.product.replace(/'/g, "\\'");
      let description = '';
      let suggestions = '';
      const suggStart = '<div style="margin-top:10px;padding:10px 14px;background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.15);border-radius:8px"><div style="font-size:11px;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Suggestions</div><div style="font-size:12px;color:var(--text-muted);line-height:1.7">';
      const suggEnd = '</div></div>';
      if (a.type === 'price') {
        const overpay = a.amount - a.avg;
        const otherStores = activeData.filter(i => i.n === a.product && i.s !== a.item.s);
        const cheaperStore = otherStores.length > 0 ? otherStores.sort((x, y) => x.u - y.u)[0] : null;
        description = 'This item was purchased at <span style="color:var(--amber);font-weight:600">' + fmt(a.amount) + '/unit</span> on ' + a.item.d + ' at ' + a.item.s + ', which is <span style="color:var(--rose);font-weight:600">' + fmt(overpay) + ' more</span> per unit than your average price of ' + fmt(a.avg) + '. This could indicate a price increase, a different size/variant, or a one-time markup.';
        suggestions = suggStart;
        if (cheaperStore) suggestions += '\u2022 You paid less at <span style="color:var(--green);font-weight:600">' + cheaperStore.s + '</span> (' + fmt(cheaperStore.u) + '/unit) \u2014 consider buying there next time<br>';
        suggestions += '\u2022 Check if a different size or brand was accidentally purchased<br>';
        suggestions += '\u2022 Compare unit prices on your next trip to verify if the store raised prices<br>';
        suggestions += '\u2022 Click to view full price history for this product';
        suggestions += suggEnd;
      } else if (a.type === 'category') {
        const catMatch = groupBy(activeData, 'c').find(c => c.name === a.item.c);
        const pctOfCat = catMatch ? ((a.item.t / catMatch.total) * 100).toFixed(0) : '?';
        description = 'This single purchase of <span style="color:var(--amber);font-weight:600">' + a.product + '</span> at <span style="color:var(--amber);font-weight:600">' + fmt(a.amount) + '</span> accounts for <span style="color:var(--rose);font-weight:600">' + pctOfCat + '%</span> of all ' + a.item.c + ' spending, which is ' + a.ratio + 'x the category average of ' + fmt(a.avg) + '. A single item dominating a category may skew your budget analysis.';
        suggestions = suggStart;
        suggestions += '\u2022 Consider whether this was a bulk or one-time purchase vs. a regular expense<br>';
        suggestions += '\u2022 If bought in bulk, spreading the cost mentally over weeks may give a clearer budget picture<br>';
        suggestions += '\u2022 Review if this item could be found cheaper at another store<br>';
        suggestions += '\u2022 Click to view full purchase history and price trends';
        suggestions += suggEnd;
      } else {
        description = '<span style="color:var(--amber);font-weight:600">' + a.product + '</span> at <span style="color:var(--amber);font-weight:600">' + fmt(a.amount) + '</span> is one of your most expensive single purchases this month \u2014 <span style="color:var(--rose);font-weight:600">' + a.ratio + 'x</span> the average item cost of ' + fmt(a.avg) + '. Purchased at ' + a.item.s + ' on ' + a.item.d + '.';
        suggestions = suggStart;
        suggestions += '\u2022 Check if a generic or store-brand alternative is available at a lower price<br>';
        suggestions += '\u2022 Compare this price across other stores you visit<br>';
        suggestions += '\u2022 Consider if buying in a different quantity or size offers better value<br>';
        suggestions += '\u2022 Click to view full details and price history';
        suggestions += suggEnd;
      }
      const store = a.item ? a.item.s : '';
      aHtml += '<div class="insight" style="cursor:pointer;border-color:rgba(244,63,94,0.2);background:rgba(244,63,94,0.04)" onclick="showProductDetail(\'' + escaped + '\',\'overview\')">';
      aHtml += '<div class="insight-title" style="color:var(--rose)">' + a.product + (store ? ' \u2014 ' + store : '') + '</div>';
      aHtml += '<div style="font-size:11px;color:var(--text-muted);margin-bottom:6px">' + a.ratio + 'x above average \u2022 ' + fmt(a.amount) + '</div>';
      aHtml += '<div class="insight-text" style="margin-bottom:6px">' + description + '</div>';
      aHtml += suggestions;
      aHtml += '</div>';
    });
    aHtml += '</div>';
    anomalyEl.innerHTML = aHtml;
  } else {
    anomalyEl.innerHTML = '';
  }
  } catch(e) { console.error('Anomaly detection error:', e); }
}

// ─────────── GROCERIES TAB ───────────
function renderGroceries() {
  const cats = groupBy(groceries, "c");
  const products = groupProducts(groceries);
  const trips = [...new Set(groceries.map(i => i.d + "|" + i.s))].length;

  document.getElementById("kpi-grocery").innerHTML = [
    { label: "Total Grocery Spend", value: fmt(groceryTotal), color: "var(--green)", sub: `${pct(groceryTotal, grandTotal)} of all spend`, nav: "items", filter: "Grocery" },
    { label: "Grocery Items", value: groceries.reduce((s,i)=>s+i.q,0), color: "var(--cyan)", sub: `${groceries.length} line items`, nav: "items", filter: "Grocery" },
    { label: "Categories", value: cats.length, color: "var(--amber)", sub: `Top: ${cats[0].name}`, nav: "overview" },
    { label: "Avg Per Grocery Trip", value: fmt(groceryTotal / trips), color: "var(--teal)", sub: `${trips} trips with groceries`, nav: "trends" },
  ].map(k => `<div class="kpi-card" onclick="showView('${k.nav}'${k.filter ? ",'" + k.filter + "'" : ''})"><div class="kpi-label">${k.label}</div><div class="kpi-value" style="color:${k.color}">${k.value}</div><div class="kpi-sub">${k.sub}</div></div>`).join("");
  animateKPICards('#kpi-grocery');

  // Grocery category bar
  charts.groceryCat = new Chart(document.getElementById("chart-grocery-cat"), {
    type: "doughnut",
    data: {
      labels: cats.map(c => c.name),
      datasets: [{ data: cats.map(c => +c.total.toFixed(2)), backgroundColor: cats.map((_, i) => PALETTE[i % PALETTE.length]), borderWidth: 0 }]
    },
    options: withChartAnimation({
      responsive: true, maintainAspectRatio: false, cutout: "50%",
      plugins: {
        legend: { position: legendPos, labels: { font: { size: 11 }, padding: 8 } },
        tooltip: { callbacks: { label: ctx => `${ctx.label}: ${fmt(ctx.raw)} (${pct(ctx.raw, groceryTotal)})` } }
      }
    })
  });

  makeChartClickable(charts.groceryCat, document.getElementById("chart-grocery-cat"), cats.map(c => c.name), "cat");

  // Top 15 grocery items
  const top15 = products.slice(0, 15);
  const groceryTopCanvas = document.getElementById("chart-grocery-top");
  charts.groceryTop = new Chart(groceryTopCanvas, {
    type: "bar",
    data: {
      labels: top15.map(p => p.name.length > 30 ? p.name.slice(0,28) + "..." : p.name),
      datasets: [{ data: top15.map(p => +p.total.toFixed(2)), backgroundColor: "#22c55e", borderRadius: 4 }]
    },
    options: withChartAnimation({
      indexAxis: "y", responsive: true, maintainAspectRatio: false,
      scales: { x: { ticks: { callback: v => "$" + v } } },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => `${fmt(ctx.raw)} (qty: ${top15[ctx.dataIndex].qty})` } }
      }
    })
  });
  groceryTopCanvas.style.cursor = 'pointer';
  groceryTopCanvas.onclick = e => {
    const pts = charts.groceryTop.getElementsAtEventForMode(e, 'nearest', { intersect: true }, false);
    if (pts.length) showProductDetail(top15[pts[0].index].name, 'groceries');
  };

  // Frequently purchased table
  const freq = products.filter(p => p.count >= 2);
  let html = `<thead><tr><th>Product</th><th>Category</th><th class="text-center">Qty Bought</th><th class="text-right">Total Spent</th><th class="text-right">Avg/Unit</th></tr></thead><tbody>`;
  freq.forEach(p => {
    const escaped = p.name.replace(/'/g, "\\'").replace(/"/g, "&quot;");
    html += `<tr style="cursor:pointer" onclick="showProductDetail('${escaped}','groceries')"><td class="bold">${p.name}<span style="float:right;color:var(--text-muted);font-size:11px">&rarr;</span></td><td style="color:var(--text-muted)">${p.cat}</td><td class="text-center">${p.qty}</td><td class="text-right mono amt">${fmt(p.total)}</td><td class="text-right mono">${fmt(p.total / p.qty)}</td></tr>`;
  });
  html += `</tbody>`;
  document.getElementById("table-grocery-freq").innerHTML = html;
}

// ─────────── TOILETRIES TAB ───────────
function renderToiletries() {
  const cats = groupBy(toiletries, "c");
  const stores = groupBy(toiletries, "s");
  const products = groupProducts(toiletries);

  document.getElementById("kpi-toiletry").innerHTML = [
    { label: "Total Toiletries Spend", value: fmt(toiletryTotal), color: "var(--purple)", sub: `${pct(toiletryTotal, grandTotal)} of all spend`, nav: "items", filter: "Toiletry" },
    { label: "Items Purchased", value: toiletries.reduce((s,i)=>s+i.q,0), color: "var(--cyan)", sub: `${toiletries.length} line items`, nav: "items", filter: "Toiletry" },
    { label: "Categories", value: cats.length, color: "var(--amber)", sub: cats.map(c => c.name).join(", "), nav: "overview" },
    { label: "Avg Item Cost", value: fmt(toiletryTotal / toiletries.reduce((s,i)=>s+i.q,0)), color: "var(--teal)", sub: "per unit", nav: "stores" },
  ].map(k => `<div class="kpi-card" onclick="showView('${k.nav}'${k.filter ? ",'" + k.filter + "'" : ''})"><div class="kpi-label">${k.label}</div><div class="kpi-value" style="color:${k.color}">${k.value}</div><div class="kpi-sub">${k.sub}</div></div>`).join("");
  animateKPICards('#kpi-toiletry');

  // Toiletry by category
  const toilCatColors = ["#a855f7", "#d946ef", "#ec4899"];
  charts.toilCat = new Chart(document.getElementById("chart-toiletry-cat"), {
    type: "doughnut",
    data: {
      labels: cats.map(c => c.name),
      datasets: [{ data: cats.map(c => +c.total.toFixed(2)), backgroundColor: toilCatColors, borderWidth: 0 }]
    },
    options: withChartAnimation({
      responsive: true, maintainAspectRatio: false, cutout: "55%",
      plugins: {
        tooltip: { callbacks: { label: ctx => `${ctx.label}: ${fmt(ctx.raw)} (${pct(ctx.raw, toiletryTotal)})` } }
      }
    })
  });

  makeChartClickable(charts.toilCat, document.getElementById("chart-toiletry-cat"), cats.map(c => c.name), "cat");

  // Toiletry by store
  charts.toilStore = new Chart(document.getElementById("chart-toiletry-store"), {
    type: "bar",
    data: {
      labels: stores.map(s => s.name),
      datasets: [{ data: stores.map(s => +s.total.toFixed(2)), backgroundColor: stores.map(s => STORE_COLORS[s.name] || "#888"), borderRadius: 6 }]
    },
    options: withChartAnimation({
      responsive: true, maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => "$" + v } } },
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => fmt(ctx.raw) } } }
    })
  });

  makeChartClickable(charts.toilStore, document.getElementById("chart-toiletry-store"), stores.map(s => s.name), "store");

  // All toiletry items table
  let html = `<thead><tr><th>Date</th><th>Store</th><th>Product</th><th>Category</th><th class="text-center">Qty</th><th class="text-right">Unit $</th><th class="text-right">Total</th></tr></thead><tbody>`;
  toiletries.sort((a,b) => b.t - a.t).forEach(i => {
    const escaped = i.n.replace(/'/g, "\\'").replace(/"/g, "&quot;");
    html += `<tr style="cursor:pointer" onclick="showProductDetail('${escaped}','toiletries')">
      <td class="mono">${i.d}</td>
      <td>${i.s}</td>
      <td class="bold">${i.n}<span style="float:right;color:var(--text-muted);font-size:11px">&rarr;</span></td>
      <td style="color:var(--text-muted)">${i.c}</td>
      <td class="text-center">${i.q}</td>
      <td class="text-right mono">${fmt(i.u)}</td>
      <td class="text-right mono amt">${fmt(i.t)}</td>
    </tr>`;
  });
  html += `</tbody>`;
  document.getElementById("table-toiletry-all").innerHTML = html;
}

// ─────────── STORES TAB ───────────
function renderStores() {
  const storeGroups = groupBy(activeData, "s");

  charts.storeBar = new Chart(document.getElementById("chart-store-bar"), {
    type: "bar",
    data: {
      labels: storeGroups.map(s => s.name),
      datasets: [
        {
          label: "Groceries",
          data: storeGroups.map(s => +sum(s.items.filter(i => itemType(i) === "grocery")).toFixed(2)),
          backgroundColor: "#22c55e", borderRadius: 4
        },
        {
          label: "Toiletries",
          data: storeGroups.map(s => +sum(s.items.filter(i => itemType(i) === "toiletry")).toFixed(2)),
          backgroundColor: "#a855f7", borderRadius: 4
        },
        {
          label: "Other",
          data: storeGroups.map(s => +sum(s.items.filter(i => itemType(i) === "other")).toFixed(2)),
          backgroundColor: "#f43f5e", borderRadius: 4
        },
      ]
    },
    options: withChartAnimation({
      responsive: true, maintainAspectRatio: false,
      scales: { x: { stacked: true }, y: { stacked: true, ticks: { callback: v => "$" + v } } },
      plugins: { tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${fmt(ctx.raw)}` } } }
    })
  });

  makeChartClickable(charts.storeBar, document.getElementById("chart-store-bar"), storeGroups.map(s => s.name), "store");

  // Store breakdown
  const trips = {};
  activeData.forEach(i => { const key = i.d + "|" + i.s; trips[key] = (trips[key] || { store: i.s, date: i.d }); });
  const tripsByStore = {};
  Object.values(trips).forEach(t => { tripsByStore[t.store] = (tripsByStore[t.store] || 0) + 1; });

  document.getElementById("store-breakdown").innerHTML = storeGroups.map(s => {
    const pctVal = (s.total / grandTotal * 100).toFixed(1);
    const storeTrips = tripsByStore[s.name] || 0;
    const color = STORE_COLORS[s.name] || "#888";
    return `
      <div class="store-row" onclick="showView('items',null,{store:'${s.name}'})" style="cursor:pointer">
        <div class="store-info">
          <div class="store-name"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${color};margin-right:8px;vertical-align:middle"></span>${s.name}</div>
          <div class="store-meta">${storeTrips} trip${storeTrips>1?"s":""} &bull; ${s.qty} items</div>
          <div class="progress-bar"><div class="progress-fill" style="width:${pctVal}%;background:${color}"></div></div>
        </div>
        <div class="store-pct">${pctVal}%</div>
        <div class="store-amount">${fmt(s.total)}</div>
      </div>`;
  }).join("");
}

// ─────────── TRENDS TAB ───────────
function renderTrends() {
  // Daily spending
  const dailyMap = {};
  activeData.forEach(i => { dailyMap[i.d] = (dailyMap[i.d] || 0) + i.t; });
  const days = Object.entries(dailyMap).sort((a,b) => a[0].localeCompare(b[0]));

  charts.daily = new Chart(document.getElementById("chart-daily"), {
    type: "line",
    data: {
      labels: days.map(d => ctx.monthAbbr + " " + parseInt(d[0].split("/")[1])),
      datasets: [{
        label: "Daily Spend",
        data: days.map(d => +d[1].toFixed(2)),
        borderColor: "#22c55e", backgroundColor: "rgba(34,197,94,0.1)",
        fill: true, tension: 0.3, pointRadius: 5, pointBackgroundColor: "#22c55e"
      }]
    },
    options: withChartAnimation({
      responsive: true, maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => "$" + v } } },
      plugins: { tooltip: { callbacks: { label: ctx => fmt(ctx.raw) } } }
    })
  });

  // Cumulative spend
  let cum = 0;
  const cumData = days.map(d => { cum += d[1]; return { date: ctx.monthAbbr + " " + parseInt(d[0].split("/")[1]), total: +cum.toFixed(2) }; });
  charts.cumulative = new Chart(document.getElementById("chart-cumulative"), {
    type: "line",
    data: {
      labels: cumData.map(d => d.date),
      datasets: [{
        label: "Cumulative Spend",
        data: cumData.map(d => d.total),
        borderColor: "#06b6d4", backgroundColor: "rgba(6,182,212,0.08)",
        fill: true, tension: 0.3, pointRadius: 4, pointBackgroundColor: "#06b6d4"
      }]
    },
    options: withChartAnimation({
      responsive: true, maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => "$" + v } } },
      plugins: { tooltip: { callbacks: { label: ctx => fmt(ctx.raw) } } }
    })
  });

  // Trips per week
  const weekNames = ctx.weeks.map(w => w.name);
  const weekTrips = ctx.weeks.map(w => {
    const tripSet = new Set();
    activeData.forEach(i => {
      const day = parseInt(i.d.split("/")[1]);
      if (day >= w.min && day <= w.max) tripSet.add(i.d + "|" + i.s);
    });
    return tripSet.size;
  });
  charts.tripsWeek = new Chart(document.getElementById("chart-trips-week"), {
    type: "bar",
    data: {
      labels: weekNames,
      datasets: [{ label: "Trips", data: weekTrips, backgroundColor: "#3b82f6", borderRadius: 6 }]
    },
    options: withChartAnimation({
      responsive: true, maintainAspectRatio: false,
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
      plugins: { legend: { display: false } }
    })
  });

  // Avg spend per trip by store
  const tripCounts = {};
  const storeSpend = {};
  activeData.forEach(i => {
    const key = i.d + "|" + i.s;
    if (!tripCounts[i.s]) { tripCounts[i.s] = new Set(); storeSpend[i.s] = 0; }
    tripCounts[i.s].add(key);
    storeSpend[i.s] += i.t;
  });
  const avgTripData = Object.keys(storeSpend).map(s => ({
    name: s, avg: +(storeSpend[s] / tripCounts[s].size).toFixed(2)
  })).sort((a,b) => b.avg - a.avg);

  charts.avgTrip = new Chart(document.getElementById("chart-avg-trip"), {
    type: "bar",
    data: {
      labels: avgTripData.map(d => d.name),
      datasets: [{ label: "Avg/Trip", data: avgTripData.map(d => d.avg), backgroundColor: avgTripData.map(d => STORE_COLORS[d.name] || "#888"), borderRadius: 6 }]
    },
    options: withChartAnimation({
      responsive: true, maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => "$" + v } } },
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => fmt(ctx.raw) + " avg per trip" } } }
    })
  });

  // Spending streaks
  const shoppingDays = new Set();
  activeData.forEach(i => { const d = parseInt(i.d.split("/")[1]); shoppingDays.add(d); });

  // Longest spending streak (consecutive days with purchases)
  let maxSpend = 0, curSpend = 0, spendStart = 0, bestSpendStart = 0;
  // Longest no-spend streak
  let maxNoSpend = 0, curNoSpend = 0, noSpendStart = 0, bestNoSpendStart = 0;

  for (let d = 1; d <= ctx.daysInMonth; d++) {
    if (shoppingDays.has(d)) {
      curSpend++;
      if (curSpend === 1) spendStart = d;
      if (curSpend > maxSpend) { maxSpend = curSpend; bestSpendStart = spendStart; }
      if (curNoSpend > maxNoSpend) { maxNoSpend = curNoSpend; bestNoSpendStart = noSpendStart; }
      curNoSpend = 0;
    } else {
      curNoSpend++;
      if (curNoSpend === 1) noSpendStart = d;
      if (curNoSpend > maxNoSpend) { maxNoSpend = curNoSpend; bestNoSpendStart = noSpendStart; }
      if (curSpend > maxSpend) { maxSpend = curSpend; bestSpendStart = spendStart; }
      curSpend = 0;
    }
  }

  let streakHtml = `<div class="card-title">Spending Streaks</div>`;
  streakHtml += `<div class="grid-2" style="margin-bottom:16px">`;
  streakHtml += `<div class="insight" style="cursor:default"><div class="insight-title">Longest Spending Streak</div><div class="insight-text"><span class="insight-val">${maxSpend} day${maxSpend !== 1 ? 's' : ''}</span> in a row (${ctx.monthAbbr} ${bestSpendStart}&ndash;${bestSpendStart + maxSpend - 1})</div></div>`;
  streakHtml += `<div class="insight" style="cursor:default"><div class="insight-title">Longest No-Spend Streak</div><div class="insight-text"><span class="insight-val">${maxNoSpend} day${maxNoSpend !== 1 ? 's' : ''}</span> without shopping${maxNoSpend > 0 ? ' (' + ctx.monthAbbr + ' ' + bestNoSpendStart + '\u2013' + (bestNoSpendStart + maxNoSpend - 1) + ')' : ''}</div></div>`;
  streakHtml += `</div>`;

  // Calendar heatmap
  streakHtml += `<div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Daily Spending Calendar</div>`;
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  streakHtml += `<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;max-width:500px">`;
  dayNames.forEach(d => { streakHtml += `<div style="text-align:center;font-size:10px;color:var(--text-muted);padding:4px">${d}</div>`; });
  // Pad first week
  const firstDow = new Date(ctx.year, ctx.month - 1, 1).getDay();
  for (let p = 0; p < firstDow; p++) streakHtml += `<div></div>`;
  // Daily cells
  const maxDaySpend = Math.max(...Array.from({ length: ctx.daysInMonth }, (_, i) => {
    let t = 0; activeData.forEach(item => { if (parseInt(item.d.split("/")[1]) === i + 1) t += item.t; }); return t;
  }));
  for (let d = 1; d <= ctx.daysInMonth; d++) {
    let dayTotal = 0;
    activeData.forEach(i => { if (parseInt(i.d.split("/")[1]) === d) dayTotal += i.t; });
    const intensity = maxDaySpend > 0 ? dayTotal / maxDaySpend : 0;
    const bg = dayTotal === 0 ? 'rgba(255,255,255,0.03)' : `rgba(34,197,94,${0.15 + intensity * 0.6})`;
    const textColor = dayTotal === 0 ? 'var(--text-muted)' : intensity > 0.5 ? '#fff' : 'var(--text)';
    const dateKey = String(ctx.month).padStart(2,'0') + '/' + String(d).padStart(2,'0');
    const clickStyle = dayTotal > 0 ? 'cursor:pointer' : '';
    const clickAction = dayTotal > 0 ? `onclick="showView('items',null,{date:'${dateKey}'})"` : '';
    streakHtml += `<div style="aspect-ratio:1;border-radius:6px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:${bg};font-size:11px;${clickStyle};transition:transform 0.15s" ${clickAction} onmouseover="${dayTotal > 0 ? "this.style.transform='scale(1.1)'" : ''}" onmouseout="this.style.transform='scale(1)'" title="${ctx.monthAbbr} ${d}: ${dayTotal > 0 ? fmt(dayTotal) : 'No spending'}">`;
    streakHtml += `<span style="font-weight:700;color:${textColor}">${d}</span>`;
    if (dayTotal > 0) streakHtml += `<span style="font-size:8px;color:${textColor};opacity:0.8">${fmt(dayTotal)}</span>`;
    streakHtml += `</div>`;
  }
  streakHtml += `</div>`;

  document.getElementById("spending-streaks").innerHTML = streakHtml;
}

// ─────────── TRIPS TAB ───────────
function buildTrips() {
  const tripMap = {};
  activeData.forEach(i => {
    const key = i.d + "|" + i.s;
    if (!tripMap[key]) tripMap[key] = { date: i.d, store: i.s, items: [], total: 0, qty: 0 };
    tripMap[key].items.push(i);
    tripMap[key].total += i.t;
    tripMap[key].qty += i.q;
  });
  return Object.values(tripMap).sort((a, b) => a.date.localeCompare(b.date) || a.store.localeCompare(b.store));
}

function renderTrips() {
  const totalTrips = allTrips.length;
  const avgPerTrip = grandTotal / totalTrips;
  const bigTrip = allTrips.reduce((max, t) => t.total > max.total ? t : max, allTrips[0]);
  const smallTrip = allTrips.reduce((min, t) => t.total < min.total ? t : min, allTrips[0]);

  document.getElementById("kpi-trips").innerHTML = [
    { label: "Total Trips", value: totalTrips, color: "var(--cyan)", sub: "across " + [...new Set(activeData.map(i=>i.s))].length + " stores" },
    { label: "Avg Per Trip", value: fmt(avgPerTrip), color: "var(--green)", sub: `${fmt(grandTotal)} total` },
    { label: "Biggest Trip", value: fmt(bigTrip.total), color: "var(--amber)", sub: `${bigTrip.store} on ${ctx.monthAbbr} ${parseInt(bigTrip.date.split("/")[1])}` },
    { label: "Smallest Trip", value: fmt(smallTrip.total), color: "var(--teal)", sub: `${smallTrip.store} on ${ctx.monthAbbr} ${parseInt(smallTrip.date.split("/")[1])}` },
  ].map(k => `<div class="kpi-card" style="cursor:default"><div class="kpi-label">${k.label}</div><div class="kpi-value" style="color:${k.color}">${k.value}</div><div class="kpi-sub">${k.sub}</div></div>`).join("");

  let html = "";
  let currentWeek = "";
  allTrips.forEach((trip, idx) => {
    const day = parseInt(trip.date.split("/")[1]);
    let week = ctx.weeks[ctx.weeks.length - 1].label;
    for (const w of ctx.weeks) { if (day >= w.min && day <= w.max) { week = w.label; break; } }

    if (week !== currentWeek) {
      const matchedWeek = ctx.weeks.find(w => w.label === week) || ctx.weeks[0];
      const weekItems = allTrips.filter(t => {
        const d = parseInt(t.date.split("/")[1]);
        return d >= matchedWeek.min && d <= matchedWeek.max;
      });
      const weekTotal = weekItems.reduce((s, t) => s + t.total, 0);
      currentWeek = week;
      html += `<div style="display:flex;justify-content:space-between;align-items:baseline;margin:${idx > 0 ? '28px' : '8px'} 0 12px;padding-bottom:8px;border-bottom:1px solid var(--card-border)">
        <div style="font-size:14px;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:1px">${week}</div>
        <div style="font-size:13px;color:var(--text-muted)">${weekItems.length} trips &bull; ${fmt(weekTotal)}</div>
      </div>`;
    }

    const dayNum = parseInt(trip.date.split("/")[1]);
    const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const dateObj = new Date(ctx.year, ctx.month - 1, dayNum);
    const dayName = dayNames[dateObj.getDay()];
    const color = STORE_COLORS[trip.store] || "#888";
    const preview = trip.items.slice(0, 4).map(i => `<span class="trip-item-chip">${i.n}</span>`).join("");
    const more = trip.items.length > 4 ? `<span class="trip-item-chip" style="color:var(--green)">+${trip.items.length - 4} more</span>` : "";

    html += `
      <div class="trip-card" onclick="showTripDetail(${idx})">
        <div class="trip-left">
          <div class="trip-date">${ctx.monthAbbr} ${dayNum} <span style="font-size:12px;font-weight:500;color:var(--text-muted);margin-left:4px">${dayName}</span></div>
          <div class="trip-store"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${color};margin-right:8px;vertical-align:middle"></span>${trip.store}</div>
          <div class="trip-meta">${trip.items.length} item${trip.items.length > 1 ? 's' : ''} &bull; ${trip.qty} unit${trip.qty > 1 ? 's' : ''}</div>
          <div class="trip-items-preview">${preview}${more}</div>
        </div>
        <div class="trip-right">
          <div class="trip-total">${fmt(trip.total)}</div>
          <div class="trip-arrow">→</div>
        </div>
      </div>`;
  });

  document.getElementById("trips-list").innerHTML = html;
}

let productDetailSource = 'groceries';
function showProductDetail(productName, source) {
  productDetailSource = source || 'groceries';
  const items = activeData.filter(i => i.n === productName).sort((a, b) => a.d.localeCompare(b.d));
  if (!items.length) return;
  const total = items.reduce((s, i) => s + i.t, 0);
  const totalQty = items.reduce((s, i) => s + i.q, 0);
  const cat = items[0].c;
  const stores = [...new Set(items.map(i => i.s))];
  const dates = [...new Set(items.map(i => i.d))];
  const prices = items.map(i => i.u);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const backMap = { groceries: ['groceries','Groceries'], toiletries: ['toiletries','Toiletries'], overview: ['overview','Overview'], items: ['items','All Items'], 'category-detail': ['overview','Overview'], trips: ['trips','Trips'] };
  const [backTab, backLabel] = backMap[productDetailSource] || backMap.items;
  document.getElementById("product-detail-back").onclick = () => showView(backTab);
  document.getElementById("product-detail-back").textContent = "\u2190 Back to " + backLabel;

  const editBtnHtml = `<span class="product-edit-btn" onclick="event.stopPropagation();openEditModal(${items[0]._idx},true)" title="Edit product name">&#9998;</span>`;
  let html = `<div class="trip-detail-header">
    <div>
      <div class="trip-detail-title">${productName} ${editBtnHtml}</div>
      <div class="trip-detail-store">${cat} \u2022 ${stores.join(", ")}</div>
    </div>
    <div style="text-align:right">
      <div class="trip-detail-total">${fmt(total)}</div>
      <div class="trip-detail-count">${totalQty} units across ${dates.length} shopping date${dates.length !== 1 ? 's' : ''}</div>
    </div>
  </div>`;

  // Anomaly context (if navigated from anomaly card)
  const matchedAnomaly = detectedAnomalies.find(a => a.product === productName);
  if (matchedAnomaly) {
    const a = matchedAnomaly;
    const suggStart = '<div style="margin-top:10px;padding:10px 14px;background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.15);border-radius:8px"><div style="font-size:11px;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Suggestions</div><div style="font-size:12px;color:var(--text-muted);line-height:1.7">';
    const suggEnd = '</div></div>';
    let aDesc = '';
    let aSugg = '';
    if (a.type === 'price') {
      const overpay = a.amount - a.avg;
      const otherStores = activeData.filter(i => i.n === a.product && i.s !== a.item.s);
      const cheaperStore = otherStores.length > 0 ? otherStores.sort((x, y) => x.u - y.u)[0] : null;
      aDesc = 'This item was purchased at <span style="color:var(--amber);font-weight:600">' + fmt(a.amount) + '/unit</span> on ' + a.item.d + ' at ' + a.item.s + ', which is <span style="color:var(--rose);font-weight:600">' + fmt(overpay) + ' more</span> per unit than your average price of ' + fmt(a.avg) + '. This could indicate a price increase, a different size/variant, or a one-time markup.';
      aSugg = suggStart;
      if (cheaperStore) aSugg += '\u2022 You paid less at <span style="color:var(--green);font-weight:600">' + cheaperStore.s + '</span> (' + fmt(cheaperStore.u) + '/unit) \u2014 consider buying there next time<br>';
      aSugg += '\u2022 Check if a different size or brand was accidentally purchased<br>';
      aSugg += '\u2022 Compare unit prices on your next trip to verify if the store raised prices';
      aSugg += suggEnd;
    } else if (a.type === 'category') {
      const catMatch = groupBy(activeData, 'c').find(c => c.name === a.item.c);
      const pctOfCat = catMatch ? ((a.item.t / catMatch.total) * 100).toFixed(0) : '?';
      aDesc = 'This single purchase at <span style="color:var(--amber);font-weight:600">' + fmt(a.amount) + '</span> accounts for <span style="color:var(--rose);font-weight:600">' + pctOfCat + '%</span> of all ' + a.item.c + ' spending, which is ' + a.ratio + 'x the category average of ' + fmt(a.avg) + '. A single item dominating a category may skew your budget analysis.';
      aSugg = suggStart;
      aSugg += '\u2022 Consider whether this was a bulk or one-time purchase vs. a regular expense<br>';
      aSugg += '\u2022 If bought in bulk, spreading the cost mentally over weeks may give a clearer budget picture<br>';
      aSugg += '\u2022 Review if this item could be found cheaper at another store';
      aSugg += suggEnd;
    } else {
      aDesc = 'At <span style="color:var(--amber);font-weight:600">' + fmt(a.amount) + '</span>, this is one of your most expensive single purchases this month \u2014 <span style="color:var(--rose);font-weight:600">' + a.ratio + 'x</span> the average item cost of ' + fmt(a.avg) + '.';
      aSugg = suggStart;
      aSugg += '\u2022 Check if a generic or store-brand alternative is available at a lower price<br>';
      aSugg += '\u2022 Compare this price across other stores you visit<br>';
      aSugg += '\u2022 Consider if buying in a different quantity or size offers better value';
      aSugg += suggEnd;
    }
    html += '<div class="card" style="border-color:rgba(244,63,94,0.3);background:rgba(244,63,94,0.04)">';
    html += '<div class="card-title" style="color:var(--rose)">Flagged as Unusual \u2014 ' + a.ratio + 'x Above Average</div>';
    html += '<div style="font-size:13px;color:var(--text-muted);line-height:1.6">' + aDesc + '</div>';
    html += aSugg;
    html += '</div>';
  }

  // Summary stats
  html += `<div class="kpi-grid" style="margin-bottom:20px">`;
  html += `<div class="kpi-card" style="cursor:default"><div class="kpi-label">Times Purchased</div><div class="kpi-value" style="color:var(--green)">${dates.length}</div><div class="kpi-sub">${dates.length === 1 ? '1 date' : dates.length + ' different dates'}</div></div>`;
  html += `<div class="kpi-card" style="cursor:default"><div class="kpi-label">Total Quantity</div><div class="kpi-value" style="color:var(--cyan)">${totalQty}</div><div class="kpi-sub">units bought</div></div>`;
  html += `<div class="kpi-card" style="cursor:default"><div class="kpi-label">Avg Unit Price</div><div class="kpi-value" style="color:var(--amber)">${fmt(total / totalQty)}</div><div class="kpi-sub">per unit</div></div>`;
  // Price range KPI
  if (minPrice !== maxPrice) {
    html += `<div class="kpi-card" style="cursor:default"><div class="kpi-label">Price Range</div><div class="kpi-value" style="font-size:18px;color:var(--teal)">${fmt(minPrice)} &mdash; ${fmt(maxPrice)}</div><div class="kpi-sub">${fmt(maxPrice - minPrice)} spread</div></div>`;
  } else {
    html += `<div class="kpi-card" style="cursor:default"><div class="kpi-label">Consistent Price</div><div class="kpi-value" style="color:var(--teal)">${fmt(minPrice)}</div><div class="kpi-sub">same price every time</div></div>`;
  }
  html += `</div>`;

  // Price tracker (only if bought more than once)
  if (items.length > 1) {
    html += `<div class="card"><div class="card-title"><span style="color:var(--cyan)">Price Tracker</span></div>`;
    html += `<div style="overflow-x:auto"><table><thead><tr><th>Date</th><th>Store</th><th class="text-right">Unit Price</th><th class="text-right">Change</th></tr></thead><tbody>`;
    items.forEach((item, idx) => {
      const dayNum = parseInt(item.d.split("/")[1]);
      const dateLabel = ctx.monthName ? ctx.monthName + " " + dayNum + ", " + ctx.year : item.d;
      const tripKey = item.d + "|" + item.s;
      let changeHtml = '';
      if (idx > 0) {
        const diff = item.u - items[idx - 1].u;
        if (diff > 0.001) changeHtml = `<span style="color:var(--rose);font-weight:700">&uarr; +${fmt(diff)}</span>`;
        else if (diff < -0.001) changeHtml = `<span style="color:var(--green);font-weight:700">&darr; ${fmt(diff)}</span>`;
        else changeHtml = `<span style="color:var(--text-muted)">&mdash; same</span>`;
      } else {
        changeHtml = `<span style="color:var(--text-muted)">&mdash;</span>`;
      }
      html += `<tr style="cursor:pointer" onclick="goToTripFromProduct('${tripKey}')"><td class="mono" style="color:var(--green)">${dateLabel}</td><td>${item.s}</td><td class="text-right mono amt">${fmt(item.u)}</td><td class="text-right">${changeHtml}</td></tr>`;
    });
    html += `</tbody></table></div></div>`;
  }

  // Cross-month price history
  var allMonths = getLoadedMonths().sort();
  if (allMonths.length >= 2) {
    var monthPriceData = [];
    allMonths.forEach(function(mk) {
      var mData = loadMonthData(mk);
      if (!mData) return;
      var matching = mData.filter(function(i) { return i.n === productName; });
      if (matching.length === 0) return;
      var avgP = matching.reduce(function(s, i) { return s + i.u; }, 0) / matching.length;
      var mkParts = mk.split('_');
      var mLabel = MONTH_ABBR[parseInt(mkParts[1]) - 1] + ' ' + mkParts[0];
      monthPriceData.push({ mk: mk, label: mLabel, avgPrice: avgP, count: matching.length, isCurrent: mk === ctx.monthKey });
    });
    if (monthPriceData.length >= 2) {
      var allHistPrices = monthPriceData.map(function(d) { return d.avgPrice; });
      var overallAvg = allHistPrices.reduce(function(s, v) { return s + v; }, 0) / allHistPrices.length;
      var latestPrice = monthPriceData[monthPriceData.length - 1].avgPrice;
      var firstPrice = monthPriceData[0].avgPrice;
      var trendPct = firstPrice > 0 ? ((latestPrice - firstPrice) / firstPrice * 100) : 0;
      var trendDir = trendPct > 0 ? '&#9650;' : trendPct < 0 ? '&#9660;' : '&#9679;';
      var trendColor = trendPct > 5 ? 'var(--rose)' : trendPct < -5 ? 'var(--green)' : 'var(--text-muted)';

      html += '<div class="card"><div class="card-title">Price History Across Months</div>';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">';
      html += '<span style="font-size:13px;color:var(--text-muted)">Average unit price per month</span>';
      html += '<span style="font-size:13px;font-weight:700;color:' + trendColor + '">' + trendDir + ' ' + (trendPct > 0 ? '+' : '') + trendPct.toFixed(1) + '% overall</span>';
      html += '</div>';

      // Bar chart visualization
      var maxP = Math.max.apply(null, allHistPrices);
      monthPriceData.forEach(function(d) {
        var pct = maxP > 0 ? (d.avgPrice / maxP * 100) : 0;
        var barColor = d.isCurrent ? 'var(--blue)' : 'rgba(59,130,246,0.3)';
        html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">';
        html += '<span style="font-size:11px;width:60px;text-align:right;color:var(--text-muted);flex-shrink:0">' + d.label + '</span>';
        html += '<div style="flex:1;height:20px;background:rgba(255,255,255,0.04);border-radius:4px;overflow:hidden">';
        html += '<div style="width:' + pct.toFixed(1) + '%;height:100%;background:' + barColor + ';border-radius:4px;transition:width 0.5s"></div></div>';
        html += '<span style="font-size:12px;font-weight:600;width:55px;text-align:right;flex-shrink:0">' + fmt(d.avgPrice) + '</span>';
        html += '</div>';
      });
      html += '</div>';
    }
  }

  // Store comparison (only if bought at multiple stores)
  if (stores.length > 1) {
    html += `<div class="card"><div class="card-title"><span style="color:var(--blue)">Store Price Comparison</span></div>`;
    const storeStats = {};
    items.forEach(i => {
      if (!storeStats[i.s]) storeStats[i.s] = { prices: [], qty: 0, total: 0 };
      storeStats[i.s].prices.push(i.u);
      storeStats[i.s].qty += i.q;
      storeStats[i.s].total += i.t;
    });
    const storeArr = Object.entries(storeStats).map(([name, s]) => ({
      name, avgPrice: s.total / s.qty, minPrice: Math.min(...s.prices),
      maxPrice: Math.max(...s.prices), qty: s.qty, total: s.total
    })).sort((a, b) => a.avgPrice - b.avgPrice);
    const cheapest = storeArr[0];
    const savings = storeArr.length > 1 ? storeArr[storeArr.length - 1].avgPrice - cheapest.avgPrice : 0;

    if (savings > 0.001) {
      html += `<div class="insight" style="cursor:default;margin-bottom:14px"><div class="insight-title">Best Price</div><div class="insight-text"><span class="insight-val">${cheapest.name}</span> is cheapest at <span class="insight-val">${fmt(cheapest.avgPrice)}/unit</span> avg &mdash; you save <span class="insight-val">${fmt(savings)}/unit</span> vs the most expensive store</div></div>`;
    }
    html += `<div style="overflow-x:auto"><table><thead><tr><th>Store</th><th class="text-right">Avg Price</th><th class="text-right">Min</th><th class="text-right">Max</th><th class="text-center">Qty</th><th class="text-right">Total</th></tr></thead><tbody>`;
    storeArr.forEach((s, idx) => {
      const isCheapest = idx === 0 && storeArr.length > 1;
      html += `<tr><td style="font-weight:600;${isCheapest ? 'color:var(--green)' : ''}">${s.name}${isCheapest ? ' <span style="font-size:10px;background:rgba(34,197,94,0.12);color:var(--green);padding:2px 6px;border-radius:4px;margin-left:4px">BEST</span>' : ''}</td>`;
      html += `<td class="text-right mono amt">${fmt(s.avgPrice)}</td>`;
      html += `<td class="text-right mono">${fmt(s.minPrice)}</td>`;
      html += `<td class="text-right mono">${fmt(s.maxPrice)}</td>`;
      html += `<td class="text-center">${s.qty}</td>`;
      html += `<td class="text-right mono amt">${fmt(s.total)}</td></tr>`;
    });
    html += `</tbody></table></div></div>`;
  }

  // Purchase history table
  html += `<div class="card"><div class="card-title"><span style="color:var(--amber)">Purchase History</span></div>`;
  html += `<div style="overflow-x:auto"><table>`;
  html += `<thead><tr><th>Date</th><th>Store</th><th class="text-center">Qty</th><th class="text-right">Unit Price</th><th class="text-right">Total</th></tr></thead><tbody>`;
  items.forEach(i => {
    const dayNum = parseInt(i.d.split("/")[1]);
    const dateLabel = ctx.monthName ? ctx.monthName + " " + dayNum + ", " + ctx.year : i.d;
    const tripKey = i.d + "|" + i.s;
    html += `<tr style="cursor:pointer" onclick="goToTripFromProduct('${tripKey}')">
      <td class="mono" style="color:var(--green)">${dateLabel}</td>
      <td>${i.s}</td>
      <td class="text-center">${i.q}</td>
      <td class="text-right mono">${fmt(i.u)}</td>
      <td class="text-right mono amt">${fmt(i.t)}</td>
    </tr>`;
  });
  html += `</tbody></table></div></div>`;

  document.getElementById("product-detail-content").innerHTML = html;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-product-detail').classList.add('active');
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
}

function goToTripFromProduct(tripKey) {
  var idx = allTrips.findIndex(function(t) { return t.date + "|" + t.store === tripKey; });
  if (idx >= 0) {
    showTripDetail(idx);
  } else {
    showToast("Trip not found.", "warning");
  }
}

function showTripDetail(tripIdx) {
  const trip = allTrips[tripIdx];
  const dayNum = parseInt(trip.date.split("/")[1]);
  const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const dateObj = new Date(ctx.year, ctx.month - 1, dayNum);
  const dayName = dayNames[dateObj.getDay()];
  const color = STORE_COLORS[trip.store] || "#888";

  const groceryItems = trip.items.filter(i => itemType(i) === "grocery");
  const toiletryItems = trip.items.filter(i => itemType(i) === "toiletry");
  const otherItems = trip.items.filter(i => itemType(i) === "other");

  // Navigation to prev/next trip
  const prevBtn = tripIdx > 0
    ? `<button onclick="showTripDetail(${tripIdx - 1})" style="background:rgba(255,255,255,0.04);border:1px solid var(--card-border);border-radius:8px;padding:8px 14px;color:var(--text-muted);cursor:pointer;font-family:inherit;font-size:12px">← Prev Trip</button>`
    : `<span></span>`;
  const nextBtn = tripIdx < allTrips.length - 1
    ? `<button onclick="showTripDetail(${tripIdx + 1})" style="background:rgba(255,255,255,0.04);border:1px solid var(--card-border);border-radius:8px;padding:8px 14px;color:var(--text-muted);cursor:pointer;font-family:inherit;font-size:12px">Next Trip →</button>`
    : `<span></span>`;

  let html = `
    <div class="trip-detail-header">
      <div>
        <div class="trip-detail-title">${dayName}, ${ctx.monthName} ${dayNum}, ${ctx.year}</div>
        <div class="trip-detail-store"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${color};margin-right:8px;vertical-align:middle"></span>${trip.store}</div>
      </div>
      <div style="text-align:right">
        <div class="trip-detail-total">${fmt(trip.total)}</div>
        <div class="trip-detail-count">${trip.items.length} item${trip.items.length > 1 ? 's' : ''} &bull; ${trip.qty} unit${trip.qty > 1 ? 's' : ''}</div>
      </div>
    </div>`;

  // Build item groups
  var groupColors = { 'tag-grocery': 'var(--amber)', 'tag-toiletry': 'var(--purple)', 'tag-nongrocery': 'var(--rose)' };
  function renderGroup(label, items, tagClass, tagLabel) {
    if (items.length === 0) return "";
    const groupTotal = items.reduce((s, i) => s + i.t, 0);
    const titleColor = groupColors[tagClass] || 'var(--text)';
    let g = `<div class="card">
      <div class="card-title"><span style="color:${titleColor}">${label}</span> <span style="float:right;color:var(--amber)">${fmt(groupTotal)}</span></div>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead><tr>
          <th style="text-align:left;padding:8px 12px;font-size:11px;font-weight:700;color:var(--green);border-bottom:1px solid var(--card-border);letter-spacing:1px;text-transform:uppercase">Product</th>
          <th style="text-align:center;padding:8px 12px;font-size:11px;font-weight:700;color:var(--green);border-bottom:1px solid var(--card-border);letter-spacing:1px;text-transform:uppercase">Qty</th>
          <th style="text-align:right;padding:8px 12px;font-size:11px;font-weight:700;color:var(--green);border-bottom:1px solid var(--card-border);letter-spacing:1px;text-transform:uppercase">Unit $</th>
          <th style="text-align:right;padding:8px 12px;font-size:11px;font-weight:700;color:var(--green);border-bottom:1px solid var(--card-border);letter-spacing:1px;text-transform:uppercase">Total</th>
        </tr></thead><tbody>`;
    items.sort((a, b) => b.t - a.t).forEach(i => {
      var nameEsc = i.n.replace(/'/g, "\\'").replace(/"/g, '&quot;');
      g += `<tr style="border-bottom:1px solid rgba(255,255,255,0.03);cursor:pointer" onclick="showProductDetail('${nameEsc}','trips')">
        <td style="padding:10px 12px;font-weight:500;color:var(--green)">${i.n} <span style="font-size:10px;color:var(--text-muted);margin-left:4px">${i.c}</span></td>
        <td style="padding:10px 12px;text-align:center">${i.q}</td>
        <td style="padding:10px 12px;text-align:right;font-family:'Cascadia Code','Fira Code',monospace;font-size:12px">${fmt(i.u)}</td>
        <td style="padding:10px 12px;text-align:right;font-family:'Cascadia Code','Fira Code',monospace;font-size:12px;font-weight:700;color:var(--amber)">${fmt(i.t)}</td>
      </tr>`;
    });
    g += `</tbody></table></div>`;
    return g;
  }

  html += renderGroup("Grocery Items", groceryItems, "tag-grocery", "GROCERY");
  html += renderGroup("Toiletries & Household", toiletryItems, "tag-toiletry", "TOILETRY");
  html += renderGroup("Other Items", otherItems, "tag-nongrocery", "OTHER");

  // Receipt total summary
  html += `<div class="card" style="background:rgba(34,197,94,0.06);border-color:rgba(34,197,94,0.2)">
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div>
        <div style="font-size:13px;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:1px">Trip Total</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:2px">${trip.items.length} item${trip.items.length > 1 ? 's' : ''} purchased at ${trip.store}</div>
      </div>
      <div style="font-size:28px;font-weight:700;color:var(--amber)">${fmt(trip.total)}</div>
    </div>
  </div>`;

  // Prev/Next nav
  html += `<div style="display:flex;justify-content:space-between;margin-top:8px">${prevBtn}${nextBtn}</div>`;

  document.getElementById("trip-detail-content").innerHTML = html;
  showView("trip-detail");
}

// ─────────── ALL ITEMS TAB ───────────
let currentSort = { col: "d", dir: "asc" };
let itemsPerPage = 100;
let itemsCurrentPage = 1;

function renderAllItems() {
  // Populate filter dropdowns (clear first for month switches)
  const dateSelect = document.getElementById("filter-date");
  const storeSelect = document.getElementById("filter-store");
  const catSelect = document.getElementById("filter-cat");
  dateSelect.innerHTML = '<option value="All">All Dates</option>';
  storeSelect.innerHTML = '<option value="All">All Stores</option>';
  catSelect.innerHTML = '<option value="All">All Categories</option>';
  [...new Set(activeData.map(i => i.d))].sort().forEach(d => {
    const day = parseInt(d.split("/")[1]);
    const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const dateObj = new Date(ctx.year, ctx.month - 1, day);
    const dayName = dayNames[dateObj.getDay()];
    dateSelect.innerHTML += `<option value="${d}">${ctx.monthAbbr} ${day} (${dayName})</option>`;
  });
  [...new Set(activeData.map(i => i.s))].sort().forEach(s => {
    storeSelect.innerHTML += `<option value="${s}">${s}</option>`;
  });
  [...new Set(activeData.map(i => i.c))].sort().forEach(c => {
    catSelect.innerHTML += `<option value="${c}">${c}</option>`;
  });

  // Attach event listeners only once
  if (!filtersInitialized) {
    ["filter-date","filter-store","filter-cat","filter-type","filter-search"].forEach(id => {
      document.getElementById(id).addEventListener(id === "filter-search" ? "input" : "change", function() { itemsCurrentPage = 1; renderTable(); });
    });
    filtersInitialized = true;
  }

  renderTable();
}

function clearFilters() {
  document.getElementById("filter-date").value = "All";
  document.getElementById("filter-store").value = "All";
  document.getElementById("filter-cat").value = "All";
  document.getElementById("filter-type").value = "All";
  document.getElementById("filter-search").value = "";
  itemsCurrentPage = 1;
  renderTable();
}

function renderTable() {
  const date = document.getElementById("filter-date").value;
  const store = document.getElementById("filter-store").value;
  const cat = document.getElementById("filter-cat").value;
  const type = document.getElementById("filter-type").value;
  const search = document.getElementById("filter-search").value.toLowerCase();

  let data = activeData.filter(i => {
    if (date !== "All" && i.d !== date) return false;
    if (store !== "All" && i.s !== store) return false;
    if (cat !== "All" && i.c !== cat) return false;
    if (type === "Grocery" && itemType(i) !== "grocery") return false;
    if (type === "Toiletry" && itemType(i) !== "toiletry") return false;
    if (type === "Other" && itemType(i) === "grocery") return false;
    if (search && !i.n.toLowerCase().includes(search) && !i.r.toLowerCase().includes(search)) return false;
    return true;
  });

  // Sort
  data.sort((a, b) => {
    let va = a[currentSort.col], vb = b[currentSort.col];
    if (typeof va === "string") { va = va.toLowerCase(); vb = vb.toLowerCase(); }
    if (currentSort.dir === "asc") return va > vb ? 1 : va < vb ? -1 : 0;
    return va < vb ? 1 : va > vb ? -1 : 0;
  });

  const total = sum(data);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
  if (itemsCurrentPage > totalPages) itemsCurrentPage = totalPages;
  const startIdx = (itemsCurrentPage - 1) * itemsPerPage;
  const pageData = data.slice(startIdx, startIdx + itemsPerPage);

  document.getElementById("filter-count").textContent = `${data.length} items | ${fmt(total)}`;

  const cols = [
    { key: "d", label: "Date" },
    { key: "s", label: "Store" },
    { key: "n", label: "Product" },
    { key: "c", label: "Category" },
    { key: "q", label: "Qty" },
    { key: "u", label: "Unit $" },
    { key: "t", label: "Total" },
  ];

  let html = `<thead><tr>`;
  html += `<th class="tx-check-col"><input type="checkbox" class="tx-check" onchange="toggleAllGrocItems(this.checked)"></th>`;
  cols.forEach(col => {
    const sortClass = currentSort.col === col.key ? (currentSort.dir === "asc" ? " sort-asc" : " sort-desc") : "";
    html += `<th class="sortable${sortClass}" onclick="sortTable('${col.key}')">${col.label}</th>`;
  });
  html += `<th style="width:50px"></th></tr></thead><tbody>`;

  const dupeMap = getDuplicateMap();
  pageData.forEach(i => {
    const typ = itemType(i);
    const tagClass = typ === "grocery" ? "tag-grocery" : typ === "toiletry" ? "tag-toiletry" : "tag-nongrocery";
    const tagLabel = typ === "grocery" ? "GROCERY" : typ === "toiletry" ? "TOILETRY" : "OTHER";
    const isEdited = i.n !== i._origName || i.c !== i._origCat || i.ng !== i._origNg;
    const editDot = isEdited ? '<span class="edit-dot" title="Edited"></span>' : '';
    const dupeInfo = dupeMap[i.n];
    const dupeFlag = dupeInfo ? '<span class="dupe-flag" onclick="event.stopPropagation();showDupePopover(this,' + i._idx + ')" title="Possible duplicate of: ' + dupeInfo.match.replace(/"/g, '&quot;') + '">&#9873;</span>' : '';
    const escaped = i.n.replace(/'/g, "\\'").replace(/"/g, "&quot;");
    html += `<tr onclick="showProductDetail('${escaped}','items')" style="cursor:pointer" title="View purchase history">
      <td class="tx-check-col"><input type="checkbox" class="tx-check" data-idx="${i._idx}" onclick="event.stopPropagation()" onchange="updateGrocBulkBar()"></td>
      <td class="mono">${i.d}</td>
      <td>${i.s}</td>
      <td class="bold">${i.n}${editDot}${dupeFlag} <span class="tag ${tagClass}">${tagLabel}</span></td>
      <td style="color:var(--text-muted)">${i.c}</td>
      <td class="text-center">${i.q}</td>
      <td class="text-right mono">${fmt(i.u)}</td>
      <td class="text-right mono amt">${fmt(i.t)}</td>
      <td class="text-center"><span onclick="event.stopPropagation();openEditModal(${i._idx})" title="Edit item" style="cursor:pointer;font-size:14px;color:var(--text-muted);padding:4px 8px;border-radius:6px;transition:all 0.2s" onmouseover="this.style.color='var(--green)';this.style.background='rgba(34,197,94,0.1)'" onmouseout="this.style.color='var(--text-muted)';this.style.background='none'">&#9998;</span></td>
    </tr>`;
  });
  html += `</tbody>`;
  document.getElementById("table-all").innerHTML = html;

  // Pagination controls
  let pgEl = document.getElementById("items-pagination");
  if (!pgEl) {
    pgEl = document.createElement("div");
    pgEl.id = "items-pagination";
    pgEl.className = "pagination-bar";
    document.getElementById("table-all").parentNode.after(pgEl);
  }
  if (data.length <= 20) { pgEl.innerHTML = ''; return; }
  let pgHtml = '<div class="page-size-wrap"><label>Show</label><select class="page-size-select" onchange="itemsPerPage=+this.value;itemsCurrentPage=1;renderTable()">';
  [20,50,100].forEach(n => { pgHtml += '<option value="'+n+'"'+(itemsPerPage===n?' selected':'')+'>'+n+'</option>'; });
  pgHtml += '</select><label>per page</label></div>';
  pgHtml += '<div class="page-info">Showing '+(startIdx+1)+'\u2013'+Math.min(startIdx+itemsPerPage,data.length)+' of '+data.length+'</div>';
  pgHtml += '<div class="page-btns">';
  pgHtml += '<button class="page-btn" onclick="itemsCurrentPage=1;renderTable()"'+(itemsCurrentPage<=1?' disabled':'')+'>&#171;</button>';
  pgHtml += '<button class="page-btn" onclick="itemsCurrentPage--;renderTable()"'+(itemsCurrentPage<=1?' disabled':'')+'>&#8249;</button>';
  for (let p = 1; p <= totalPages; p++) {
    if (totalPages <= 7 || Math.abs(p - itemsCurrentPage) <= 2 || p === 1 || p === totalPages) {
      pgHtml += '<button class="page-btn'+(p===itemsCurrentPage?' active':'')+'" onclick="itemsCurrentPage='+p+';renderTable()">'+p+'</button>';
    } else if (p === 2 && itemsCurrentPage > 4) { pgHtml += '<span style="padding:0 4px;color:var(--text-muted)">\u2026</span>'; }
    else if (p === totalPages - 1 && itemsCurrentPage < totalPages - 3) { pgHtml += '<span style="padding:0 4px;color:var(--text-muted)">\u2026</span>'; }
  }
  pgHtml += '<button class="page-btn" onclick="itemsCurrentPage++;renderTable()"'+(itemsCurrentPage>=totalPages?' disabled':'')+'>&#8250;</button>';
  pgHtml += '<button class="page-btn" onclick="itemsCurrentPage='+totalPages+';renderTable()"'+(itemsCurrentPage>=totalPages?' disabled':'')+'>&#187;</button>';
  pgHtml += '</div>';
  pgEl.innerHTML = pgHtml;
}

function sortTable(col) {
  if (currentSort.col === col) {
    currentSort.dir = currentSort.dir === "asc" ? "desc" : "asc";
  } else {
    currentSort.col = col;
    currentSort.dir = "desc";
  }
  itemsCurrentPage = 1;
  renderTable();
}

// ─────────── EDIT MODAL ───────────
let editIdx = null;
let editFromProductDetail = false;
let _productNamesCache = null;
let _productNamesCacheMonth = null;
let _acSuggIdx = -1;

function getAllProductNames() {
  if (_productNamesCache && _productNamesCacheMonth === ctx.monthKey) return _productNamesCache;
  const names = new Set();
  activeData.forEach(function(i) { names.add(i.n); });
  getLoadedMonths().forEach(function(mk) {
    if (mk === ctx.monthKey) return;
    var data = loadMonthData(mk);
    if (data) data.forEach(function(i) { names.add(i.n); });
  });
  _productNamesCache = Array.from(names).sort(function(a, b) { return a.toLowerCase().localeCompare(b.toLowerCase()); });
  _productNamesCacheMonth = ctx.monthKey;
  return _productNamesCache;
}

function invalidateProductNamesCache() { _productNamesCache = null; _productNamesCacheMonth = null; }

// ─────────── DUPLICATE DETECTION ───────────
var _dupeMapCache = null;
var _dupeMapCacheMonth = null;

function _bigrams(s) {
  s = s.toUpperCase();
  var b = [];
  for (var i = 0; i < s.length - 1; i++) b.push(s.slice(i, i + 2));
  return b;
}
function _diceCoeff(a, b) {
  var ba = _bigrams(a), bb = _bigrams(b);
  if (!ba.length && !bb.length) return 1;
  if (!ba.length || !bb.length) return 0;
  var setB = {};
  bb.forEach(function(bg) { setB[bg] = true; });
  var matches = 0;
  ba.forEach(function(bg) { if (setB[bg]) matches++; });
  return (2 * matches) / (ba.length + bb.length);
}

function _makePairKey(a, b) {
  return a < b ? a + "|||" + b : b + "|||" + a;
}

function loadDupeDismissals() {
  var _isDemo = typeof DEMO_MODE !== 'undefined' && DEMO_MODE;
  var raw = _isDemo ? demoGet("dupeDismissed_" + ctx.monthKey) : localStorage.getItem("dupeDismissed_" + ctx.monthKey);
  return raw ? JSON.parse(raw) : [];
}

function saveDupeDismissals(arr) {
  var _isDemo = typeof DEMO_MODE !== 'undefined' && DEMO_MODE;
  var key = "dupeDismissed_" + ctx.monthKey;
  if (_isDemo) demoSet(key, JSON.stringify(arr));
  else localStorage.setItem(key, JSON.stringify(arr));
}

function getDuplicateMap() {
  if (_dupeMapCache && _dupeMapCacheMonth === ctx.monthKey) return _dupeMapCache;
  var dismissed = new Set(loadDupeDismissals());
  var currentNames = [];
  var seen = {};
  activeData.forEach(function(i) {
    if (!seen[i.n]) { seen[i.n] = true; currentNames.push(i.n); }
  });
  var allNames = getAllProductNames();
  var pool = [];
  var poolSet = {};
  allNames.forEach(function(name) { if (!poolSet[name]) { poolSet[name] = true; pool.push(name); } });
  currentNames.forEach(function(name) { if (!poolSet[name]) { poolSet[name] = true; pool.push(name); } });

  var dupeMap = {};
  currentNames.forEach(function(name) {
    var bestMatch = null, bestScore = 0;
    pool.forEach(function(other) {
      if (other === name) return;
      var pairKey = _makePairKey(name, other);
      if (dismissed.has(pairKey)) return;
      var score = _diceCoeff(name, other);
      // Also check substring containment for longer names
      var shorter = name.length <= other.length ? name : other;
      var longer = name.length > other.length ? name : other;
      if (shorter.length >= 8 && longer.toLowerCase().indexOf(shorter.toLowerCase()) >= 0) {
        score = Math.max(score, 0.80);
      }
      if (score >= 0.72 && score > bestScore) {
        bestScore = score;
        bestMatch = other;
      }
    });
    if (bestMatch) {
      dupeMap[name] = { match: bestMatch, score: bestScore };
    }
  });
  _dupeMapCache = dupeMap;
  _dupeMapCacheMonth = ctx.monthKey;
  return _dupeMapCache;
}

function invalidateDupeCache() { _dupeMapCache = null; _dupeMapCacheMonth = null; }

function showDupePopover(flagEl, idx) {
  var item = activeData[idx];
  if (!item) return;
  var dupeMap = getDuplicateMap();
  var info = dupeMap[item.n];
  if (!info) return;

  var popover = document.getElementById("dupe-popover");
  if (!popover) {
    popover = document.createElement("div");
    popover.id = "dupe-popover";
    popover.className = "dupe-popover";
    document.body.appendChild(popover);
  }

  var matchEsc = info.match.replace(/'/g, "\\'").replace(/"/g, "&quot;");
  popover.innerHTML =
    '<div class="dupe-popover-label">Similar to:</div>' +
    '<div class="dupe-popover-match">"' + info.match + '"</div>' +
    '<div class="dupe-popover-actions">' +
      '<button class="dupe-popover-btn rename" onclick="renameToDupeMatch(' + idx + ',\'' + matchEsc + '\')">Rename to Match</button>' +
      '<button class="dupe-popover-btn dismiss" onclick="dismissDupe(\'' + item.n.replace(/'/g, "\\'") + '\')">Not a Duplicate</button>' +
    '</div>';

  // Position near the flag
  var rect = flagEl.getBoundingClientRect();
  var isMobile = window.innerWidth <= 480;
  if (isMobile) {
    popover.style.left = "8px";
    popover.style.right = "8px";
    popover.style.bottom = "12px";
    popover.style.top = "auto";
    popover.style.maxWidth = "none";
  } else {
    var top = rect.bottom + 6;
    var left = rect.left;
    if (left + 320 > window.innerWidth) left = window.innerWidth - 330;
    if (left < 10) left = 10;
    if (top + 120 > window.innerHeight) top = rect.top - 120;
    popover.style.top = top + "px";
    popover.style.left = left + "px";
    popover.style.bottom = "auto";
    popover.style.right = "auto";
    popover.style.maxWidth = "320px";
  }

  popover.classList.add("open");

  // Close on outside click
  setTimeout(function() {
    document.addEventListener("click", _closeDupePopoverOutside);
    document.addEventListener("keydown", _closeDupePopoverEsc);
  }, 10);
}

function _closeDupePopoverOutside(e) {
  var popover = document.getElementById("dupe-popover");
  if (popover && !popover.contains(e.target) && !e.target.classList.contains("dupe-flag")) {
    hideDupePopover();
  }
}
function _closeDupePopoverEsc(e) {
  if (e.key === "Escape") hideDupePopover();
}

function hideDupePopover() {
  var popover = document.getElementById("dupe-popover");
  if (popover) popover.classList.remove("open");
  document.removeEventListener("click", _closeDupePopoverOutside);
  document.removeEventListener("keydown", _closeDupePopoverEsc);
}

function dismissDupe(itemName) {
  var dupeMap = getDuplicateMap();
  var info = dupeMap[itemName];
  if (!info) { hideDupePopover(); return; }
  var pairKey = _makePairKey(itemName, info.match);
  var dismissed = loadDupeDismissals();
  if (dismissed.indexOf(pairKey) === -1) dismissed.push(pairKey);
  saveDupeDismissals(dismissed);
  invalidateDupeCache();
  hideDupePopover();
  renderTable();
}

function renameToDupeMatch(idx, matchName) {
  hideDupePopover();
  openEditModal(idx);
  // Pre-fill the name input with the matched name
  var nameInput = document.getElementById("edit-name");
  if (nameInput) nameInput.value = matchName;
}

function showAutocompleteSuggestions(query, currentName) {
  var box = document.getElementById("edit-name-suggestions");
  if (!box) return;
  _acSuggIdx = -1;
  if (!query || query.length < 2) { box.classList.remove("open"); box.innerHTML = ""; return; }
  var all = getAllProductNames();
  var q = query.toLowerCase();
  var prefix = [], contains = [];
  all.forEach(function(name) {
    if (name === currentName) return;
    var low = name.toLowerCase();
    if (low === q) return;
    if (low.indexOf(q) === 0) prefix.push(name);
    else if (low.indexOf(q) > 0) contains.push(name);
  });
  var matches = prefix.concat(contains).slice(0, 8);
  if (!matches.length) { box.classList.remove("open"); box.innerHTML = ""; return; }
  box.innerHTML = matches.map(function(name, idx) {
    var low = name.toLowerCase();
    var qIdx = low.indexOf(q);
    var highlighted = name.substring(0, qIdx) + "<mark>" + name.substring(qIdx, qIdx + query.length) + "</mark>" + name.substring(qIdx + query.length);
    return '<div class="edit-suggestion" data-idx="' + idx + '" data-name="' + name.replace(/"/g, '&quot;') + '">' + highlighted + '</div>';
  }).join("");
  box.classList.add("open");
}

function selectSuggestion(name) {
  var input = document.getElementById("edit-name");
  if (input) input.value = name;
  var box = document.getElementById("edit-name-suggestions");
  if (box) { box.classList.remove("open"); box.innerHTML = ""; }
  _acSuggIdx = -1;
}

function setupAutocomplete() {
  var input = document.getElementById("edit-name");
  var box = document.getElementById("edit-name-suggestions");
  if (!input || !box) return;
  var currentItemName = editIdx !== null ? activeData[editIdx].n : "";

  input.addEventListener("input", function() {
    showAutocompleteSuggestions(this.value.trim(), currentItemName);
  });

  input.addEventListener("keydown", function(e) {
    var items = box.querySelectorAll(".edit-suggestion");
    if (!items.length || !box.classList.contains("open")) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      _acSuggIdx = Math.min(_acSuggIdx + 1, items.length - 1);
      items.forEach(function(el, i) { el.classList.toggle("active", i === _acSuggIdx); });
      if (items[_acSuggIdx]) items[_acSuggIdx].scrollIntoView({ block: "nearest" });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      _acSuggIdx = Math.max(_acSuggIdx - 1, 0);
      items.forEach(function(el, i) { el.classList.toggle("active", i === _acSuggIdx); });
      if (items[_acSuggIdx]) items[_acSuggIdx].scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter" && _acSuggIdx >= 0 && items[_acSuggIdx]) {
      e.preventDefault();
      selectSuggestion(items[_acSuggIdx].getAttribute("data-name"));
    } else if (e.key === "Escape") {
      box.classList.remove("open"); box.innerHTML = ""; _acSuggIdx = -1;
    }
  });

  box.addEventListener("mousedown", function(e) {
    var target = e.target.closest(".edit-suggestion");
    if (target) {
      e.preventDefault();
      selectSuggestion(target.getAttribute("data-name"));
    }
  });

  input.addEventListener("blur", function() {
    setTimeout(function() { box.classList.remove("open"); box.innerHTML = ""; _acSuggIdx = -1; }, 150);
  });
}

function openEditModal(idx, fromProductDetail) {
  editIdx = idx;
  editFromProductDetail = !!fromProductDetail;
  const item = activeData[idx];
  document.getElementById("edit-modal-title").textContent = `Edit: ${item.r}`;
  document.getElementById("edit-name").value = item.n;

  // Populate category dropdown
  const catSelect = document.getElementById("edit-category");
  catSelect.innerHTML = ALL_CATEGORIES.map(c => `<option value="${c}"${c === item.c ? " selected" : ""}>${c}</option>`).join("");

  document.getElementById("edit-type").value = String(item.ng);

  // Show original values
  const hasNameEdit = item.n !== item._origName;
  const hasCatEdit = item.c !== item._origCat;
  document.getElementById("edit-original-name").textContent = hasNameEdit ? `Original: ${item._origName}` : "";
  document.getElementById("edit-original-cat").textContent = hasCatEdit ? `Original: ${item._origCat}` : "";

  // Show/hide reset button
  const hasAnyEdit = hasNameEdit || hasCatEdit || item.ng !== item._origNg;
  document.getElementById("edit-reset-btn").style.display = hasAnyEdit ? "" : "none";

  // Clear old autocomplete state and re-attach
  var box = document.getElementById("edit-name-suggestions");
  if (box) { box.classList.remove("open"); box.innerHTML = ""; }
  _acSuggIdx = -1;
  var nameInput = document.getElementById("edit-name");
  var fresh = nameInput.cloneNode(true);
  nameInput.parentNode.replaceChild(fresh, nameInput);

  document.getElementById("edit-modal").classList.add("open");
  document.getElementById("edit-name").focus();
  setupAutocomplete();
}

function closeEditModal() {
  document.getElementById("edit-modal").classList.remove("open");
  var box = document.getElementById("edit-name-suggestions");
  if (box) { box.classList.remove("open"); box.innerHTML = ""; }
  editIdx = null;
  editFromProductDetail = false;
  _acSuggIdx = -1;
}

function saveEdit() {
  if (editIdx === null) return;
  const item = activeData[editIdx];
  const newName = document.getElementById("edit-name").value.trim();
  const newCat = document.getElementById("edit-category").value;
  const newNg = document.getElementById("edit-type").value === "true";

  if (!newName) return;

  item.n = newName;
  item.c = newCat;
  item.ng = newNg;

  // Save edits
  const _isDemo = typeof DEMO_MODE !== 'undefined' && DEMO_MODE;
  const edits = JSON.parse((_isDemo ? demoGet(ctx.editsKey) : localStorage.getItem(ctx.editsKey)) || "{}");
  const hasChanges = newName !== item._origName || newCat !== item._origCat || newNg !== item._origNg;
  if (hasChanges) {
    edits[editIdx] = { n: newName, c: newCat, ng: newNg };
  } else {
    delete edits[editIdx];
  }
  if (_isDemo) demoSet(ctx.editsKey, JSON.stringify(edits));
  else localStorage.setItem(ctx.editsKey, JSON.stringify(edits));

  // Invalidate caches since names changed
  invalidateProductNamesCache();
  invalidateDupeCache();

  const wasFromProductDetail = editFromProductDetail;
  const savedSource = productDetailSource;
  closeEditModal();
  renderTable();
  if (wasFromProductDetail) showProductDetail(newName, savedSource);
  if (!_isDemo && typeof syncToCloud === 'function') syncToCloud();
}

function resetEdit() {
  if (editIdx === null) return;
  const item = activeData[editIdx];
  item.n = item._origName;
  item.c = item._origCat;
  item.ng = item._origNg;

  const _isDemo = typeof DEMO_MODE !== 'undefined' && DEMO_MODE;
  const edits = JSON.parse((_isDemo ? demoGet(ctx.editsKey) : localStorage.getItem(ctx.editsKey)) || "{}");
  delete edits[editIdx];
  if (_isDemo) demoSet(ctx.editsKey, JSON.stringify(edits));
  else localStorage.setItem(ctx.editsKey, JSON.stringify(edits));

  invalidateProductNamesCache();
  invalidateDupeCache();

  const wasFromProductDetail = editFromProductDetail;
  const savedSource = productDetailSource;
  closeEditModal();
  renderTable();
  if (wasFromProductDetail) showProductDetail(item._origName, savedSource);
  if (!_isDemo && typeof syncToCloud === 'function') syncToCloud();
}

// ─────────── BULK ACTIONS (SELECT MODE) ───────────
var _grocSelectMode = false;
function toggleGrocSelectMode() {
  _grocSelectMode = !_grocSelectMode;
  var table = document.getElementById('table-all');
  var btn = document.getElementById('btn-select-mode');
  if (_grocSelectMode) {
    if (table) table.classList.add('select-mode');
    if (btn) { btn.classList.add('active'); btn.textContent = 'Cancel'; }
  } else {
    if (table) table.classList.remove('select-mode');
    if (btn) { btn.classList.remove('active'); btn.textContent = 'Select'; }
    clearGrocBulkSelection();
  }
}
function getGrocCheckedIdxs() {
  var checks = document.querySelectorAll('#table-all .tx-check:checked');
  var idxs = [];
  checks.forEach(function(cb) { if (cb.dataset.idx !== undefined) idxs.push(+cb.dataset.idx); });
  return idxs;
}
function updateGrocBulkBar() {
  var idxs = getGrocCheckedIdxs();
  var bar = document.getElementById('bulk-bar');
  var countEl = document.getElementById('bulk-count');
  if (!bar) return;
  if (idxs.length > 0) {
    bar.classList.add('active');
    if (countEl) countEl.textContent = idxs.length + ' selected';
  } else {
    bar.classList.remove('active');
  }
  // Sync header checkbox
  var headerCb = document.querySelector('#table-all thead .tx-check');
  var allCbs = document.querySelectorAll('#table-all tbody .tx-check');
  if (headerCb && allCbs.length > 0) headerCb.checked = idxs.length === allCbs.length;
}
function toggleAllGrocItems(checked) {
  document.querySelectorAll('#table-all tbody .tx-check').forEach(function(cb) { cb.checked = checked; });
  updateGrocBulkBar();
}
function clearGrocBulkSelection() {
  toggleAllGrocItems(false);
  var h = document.querySelector('#table-all thead .tx-check');
  if (h) h.checked = false;
  updateGrocBulkBar();
  _grocSelectMode = false;
  var table = document.getElementById('table-all');
  var btn = document.getElementById('btn-select-mode');
  if (table) table.classList.remove('select-mode');
  if (btn) { btn.classList.remove('active'); btn.textContent = 'Select'; }
}
function bulkGrocDelete() {
  var idxs = getGrocCheckedIdxs();
  if (idxs.length === 0) return;
  if (!confirm('Delete ' + idxs.length + ' item' + (idxs.length > 1 ? 's' : '') + '? This cannot be undone.')) return;
  var _isDemo = typeof DEMO_MODE !== 'undefined' && DEMO_MODE;
  var edits = JSON.parse((_isDemo ? demoGet(ctx.editsKey) : localStorage.getItem(ctx.editsKey)) || "{}");
  // Sort descending so splicing doesn't shift later indices
  idxs.sort(function(a, b) { return b - a; });
  idxs.forEach(function(idx) {
    activeData.splice(idx, 1);
    delete edits[idx];
  });
  // Re-index edits (indices shifted after splice)
  var newEdits = {};
  Object.keys(edits).forEach(function(k) {
    var oldIdx = +k;
    var shift = idxs.filter(function(d) { return d < oldIdx; }).length;
    newEdits[oldIdx - shift] = edits[k];
  });
  if (_isDemo) { demoSet(ctx.editsKey, JSON.stringify(newEdits)); demoSet(ctx.storageKey, JSON.stringify(activeData)); }
  else { localStorage.setItem(ctx.editsKey, JSON.stringify(newEdits)); localStorage.setItem(ctx.storageKey, JSON.stringify(activeData)); }
  // Re-stamp _idx
  activeData.forEach(function(item, i) { item._idx = i; });
  invalidateProductNamesCache();
  invalidateDupeCache();
  clearGrocBulkSelection();
  renderAll();
}
function bulkGrocRecat() {
  var idxs = getGrocCheckedIdxs();
  if (idxs.length === 0) return;
  var overlay = document.createElement('div');
  overlay.id = 'bulk-recat-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:100001;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(4px)';
  var catHtml = '<div style="background:var(--card,#1a1b2e);border:1px solid var(--card-border,#2a2b35);border-radius:16px;padding:24px;max-width:360px;width:100%;max-height:80vh;overflow-y:auto">';
  catHtml += '<div style="font-size:16px;font-weight:700;margin-bottom:16px;text-align:center">Change Category (' + idxs.length + ' item' + (idxs.length > 1 ? 's' : '') + ')</div>';
  ALL_CATEGORIES.forEach(function(cat) {
    catHtml += '<button onclick="applyGrocBulkCategory(\'' + cat.replace(/'/g, "\\'") + '\')" style="display:block;width:100%;padding:12px 14px;margin-bottom:6px;border-radius:8px;border:1px solid var(--card-border);background:rgba(255,255,255,0.04);color:var(--text);font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;text-align:left">' + cat + '</button>';
  });
  catHtml += '<button onclick="closeGrocBulkRecat()" style="display:block;width:100%;padding:12px;margin-top:8px;border:none;background:none;color:var(--text-muted);font-size:13px;cursor:pointer;font-family:inherit">Cancel</button>';
  catHtml += '</div>';
  overlay.innerHTML = catHtml;
  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeGrocBulkRecat(); });
  document.body.appendChild(overlay);
}
function closeGrocBulkRecat() {
  var overlay = document.getElementById('bulk-recat-overlay');
  if (overlay) overlay.parentNode.removeChild(overlay);
}
function applyGrocBulkCategory(newCat) {
  var idxs = getGrocCheckedIdxs();
  if (idxs.length === 0) return;
  var _isDemo = typeof DEMO_MODE !== 'undefined' && DEMO_MODE;
  var edits = JSON.parse((_isDemo ? demoGet(ctx.editsKey) : localStorage.getItem(ctx.editsKey)) || "{}");
  idxs.forEach(function(idx) {
    var item = activeData[idx];
    if (!item) return;
    item.c = newCat;
    var hasChanges = item.n !== item._origName || item.c !== item._origCat || item.ng !== item._origNg;
    if (hasChanges) {
      edits[idx] = { n: item.n, c: item.c, ng: item.ng };
    } else {
      delete edits[idx];
    }
  });
  if (_isDemo) demoSet(ctx.editsKey, JSON.stringify(edits));
  else localStorage.setItem(ctx.editsKey, JSON.stringify(edits));
  closeGrocBulkRecat();
  clearGrocBulkSelection();
  renderAll();
}

// ─────────── HELP MODAL ───────────
function openHelpModal() { document.getElementById("help-modal").classList.add("open"); }
function closeHelpModal() { document.getElementById("help-modal").classList.remove("open"); }

// Close modal on Escape
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { closeEditModal(); closeUploadModal(); closeDataManager(); closeHelpModal(); }
});

// ─────────── UPLOAD MODAL ───────────
let pendingUploadData = null;
let pendingUploadKey = null;

function openUploadModal() {
  if (typeof DEMO_MODE !== 'undefined' && DEMO_MODE) { showDemoUpgradePrompt("Upload your own grocery data by creating a free account."); return; }
  document.getElementById("upload-preview").style.display = "none";
  document.getElementById("upload-actions").style.display = "none";
  document.getElementById("drop-zone").style.display = "";
  pendingUploadData = null;
  pendingUploadKey = null;
  document.getElementById("upload-modal").classList.add("open");
}

function closeUploadModal() {
  document.getElementById("upload-modal").classList.remove("open");
  document.getElementById("file-input").value = "";
}

// Wire up drop zone
(function initDropZone() {
  const dz = document.getElementById("drop-zone");
  const fi = document.getElementById("file-input");
  dz.addEventListener("click", () => fi.click());
  dz.addEventListener("dragover", e => { e.preventDefault(); dz.classList.add("drag-over"); });
  dz.addEventListener("dragleave", () => dz.classList.remove("drag-over"));
  dz.addEventListener("drop", e => { e.preventDefault(); dz.classList.remove("drag-over"); if (e.dataTransfer.files.length) parseExcelFile(e.dataTransfer.files[0]); });
  fi.addEventListener("change", () => { if (fi.files.length) parseExcelFile(fi.files[0]); });
})();

function normalizeDate(val) {
  if (val instanceof Date) {
    return String(val.getMonth() + 1).padStart(2, "0") + "/" + String(val.getDate()).padStart(2, "0");
  }
  if (typeof val === "number") {
    const d = new Date((val - 25569) * 86400000);
    return String(d.getMonth() + 1).padStart(2, "0") + "/" + String(d.getDate()).padStart(2, "0");
  }
  const str = String(val).trim();
  const parts = str.split(/[\/\-]/);
  if (parts.length >= 2) return parts[0].padStart(2, "0") + "/" + parts[1].padStart(2, "0");
  return str;
}

function extractYear(val) {
  if (val instanceof Date) return val.getFullYear();
  if (typeof val === "number") return new Date((val - 25569) * 86400000).getFullYear();
  const parts = String(val).trim().split(/[\/\-]/);
  if (parts.length === 3 && parts[2].length === 4) return parseInt(parts[2]);
  if (parts.length === 3 && parts[0].length === 4) return parseInt(parts[0]);
  return new Date().getFullYear();
}

function parseBool(val) {
  if (typeof val === "boolean") return val;
  const s = String(val).trim().toLowerCase();
  return s === "true" || s === "yes" || s === "1" || s === "y" || s === "x";
}

function autoDetectColumns(headers) {
  const find = patterns => headers.find(h => patterns.some(p => h.toLowerCase().includes(p))) || null;
  return {
    date: find(["date"]) || headers[0],
    store: find(["store"]) || headers[1],
    receipt: find(["receipt", "desc"]) || headers[2],
    name: find(["product", "full product", "item", "name"]) || headers[3],
    category: find(["category", "cat"]) || headers[4],
    qty: find(["qty", "quantity"]) || headers[5],
    unitPrice: find(["unit price", "unit"]) || headers[6],
    total: find(["line total", "total", "ext", "amount"]) || headers[7],
    nonGrocery: find(["non-grocery", "nongrocery", "non grocery"]) || headers[8],
  };
}

function parseExcelFile(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const workbook = XLSX.read(e.target.result, { type: "array", cellDates: true });
      let sheetName = workbook.SheetNames.find(n =>
        n.toLowerCase().includes("all transaction") || n.toLowerCase().includes("transactions")
      ) || workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      if (rows.length === 0) { showToast("No data found in sheet: " + sheetName, "error"); return; }

      const headers = Object.keys(rows[0]);
      const mapping = autoDetectColumns(headers);

      let detectedYear = null;
      const parsed = rows.map(row => {
        const dateVal = row[mapping.date];
        if (!detectedYear) detectedYear = extractYear(dateVal);
        const d = normalizeDate(dateVal);
        return {
          d: d,
          s: String(row[mapping.store] || "").trim(),
          r: String(row[mapping.receipt] || "").trim(),
          n: String(row[mapping.name] || "").trim(),
          c: String(row[mapping.category] || "").trim(),
          q: Number(row[mapping.qty]) || 1,
          u: parseFloat(row[mapping.unitPrice]) || 0,
          t: parseFloat(row[mapping.total]) || 0,
          ng: parseBool(row[mapping.nonGrocery]),
        };
      }).filter(item => item.d && item.n && item.t > 0);

      if (parsed.length === 0) { showToast("No valid items found. Check column headers.", "error"); return; }

      const monthNum = parseInt(parsed[0].d.split("/")[0]);
      const year = detectedYear || new Date().getFullYear();
      pendingUploadKey = year + "_" + String(monthNum).padStart(2, "0");
      pendingUploadData = parsed;

      showUploadPreview(parsed, pendingUploadKey, sheetName);
    } catch(err) {
      showToast("Error parsing file: " + err.message, "error");
    }
  };
  reader.readAsArrayBuffer(file);
}

function showUploadPreview(data, monthKey, sheetName) {
  const [y, m] = monthKey.split("_");
  const label = MONTH_NAMES[parseInt(m) - 1] + " " + y;
  const total = data.reduce((s, i) => s + i.t, 0);
  const stores = [...new Set(data.map(i => i.s))].length;
  const trips = [...new Set(data.map(i => i.d + "|" + i.s))].length;
  const existing = getLoadedMonths().includes(monthKey);

  document.getElementById("upload-month-label").textContent = label + (existing ? " (will replace existing data)" : "");
  document.getElementById("upload-stats").innerHTML = `Sheet: ${sheetName} | ${data.length} items | ${stores} stores | ${trips} trips | ${fmt(total)} total`;

  // Validation warnings
  var warnings = [];
  var noCat = data.filter(i => !i.c || i.c === 'Uncategorized').length;
  var zeroTotal = data.filter(i => !i.t || i.t === 0).length;
  var noStore = data.filter(i => !i.s || i.s === 'Unknown').length;
  var highPrice = data.filter(i => i.u > 100).length;
  if (noCat) warnings.push('<span style="color:#f59e0b">&#9888; ' + noCat + ' item' + (noCat>1?'s':'') + ' missing category</span>');
  if (zeroTotal) warnings.push('<span style="color:#f59e0b">&#9888; ' + zeroTotal + ' item' + (zeroTotal>1?'s':'') + ' with $0 total</span>');
  if (noStore) warnings.push('<span style="color:#f59e0b">&#9888; ' + noStore + ' item' + (noStore>1?'s':'') + ' missing store</span>');
  if (highPrice) warnings.push('<span style="color:#f97316">&#9888; ' + highPrice + ' item' + (highPrice>1?'s':'') + ' with unit price > $100</span>');

  var warningHtml = '';
  if (warnings.length) {
    warningHtml = '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">' + warnings.map(function(w){ return '<span style="font-size:11px;padding:4px 10px;border-radius:6px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.2)">' + w + '</span>'; }).join('') + '</div>';
  }

  let sampleHtml = warningHtml + '<table style="width:100%;font-size:11px"><thead><tr><th>Date</th><th>Store</th><th>Product</th><th>Category</th><th>Qty</th><th>Total</th></tr></thead><tbody>';
  data.slice(0, 5).forEach(i => {
    sampleHtml += `<tr><td>${i.d}</td><td>${i.s}</td><td>${i.n}</td><td>${i.c}</td><td>${i.q}</td><td>${fmt(i.t)}</td></tr>`;
  });
  if (data.length > 5) {
    sampleHtml += `<tr><td colspan="6" style="text-align:center;color:var(--text-muted)">... and ${data.length - 5} more items</td></tr>`;
    sampleHtml += '</tbody></table>';
    sampleHtml += '<div style="margin-top:10px;text-align:center"><button onclick="toggleFullPreview()" id="preview-toggle-btn" style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.25);color:var(--blue,#3b82f6);border-radius:8px;padding:8px 16px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit">View all ' + data.length + ' items</button></div>';
    sampleHtml += '<div id="full-preview-table" style="display:none;max-height:300px;overflow-y:auto;margin-top:10px"><table style="width:100%;font-size:11px"><thead><tr><th>Date</th><th>Store</th><th>Product</th><th>Category</th><th>Qty</th><th>Total</th></tr></thead><tbody>';
    data.forEach(function(i) {
      var rowStyle = (!i.c || i.c === 'Uncategorized' || !i.t || i.t === 0) ? ' style="background:rgba(245,158,11,0.06)"' : '';
      sampleHtml += '<tr' + rowStyle + '><td>' + i.d + '</td><td>' + i.s + '</td><td>' + i.n + '</td><td>' + i.c + '</td><td>' + i.q + '</td><td>' + fmt(i.t) + '</td></tr>';
    });
    sampleHtml += '</tbody></table></div>';
  } else {
    sampleHtml += '</tbody></table>';
  }
  document.getElementById("upload-sample").innerHTML = sampleHtml;

  document.getElementById("drop-zone").style.display = "none";
  document.getElementById("upload-preview").style.display = "";
  document.getElementById("upload-actions").style.display = "";
}

function toggleFullPreview() {
  var el = document.getElementById('full-preview-table');
  var btn = document.getElementById('preview-toggle-btn');
  if (!el) return;
  if (el.style.display === 'none') {
    el.style.display = '';
    if (btn) btn.textContent = 'Hide full list';
  } else {
    el.style.display = 'none';
    if (btn) btn.textContent = 'View all items';
  }
}

function confirmUpload() {
  if (!pendingUploadData || !pendingUploadKey) return;
  const existing = getLoadedMonths().includes(pendingUploadKey);
  if (existing && !confirm("Data for this month already exists. Replace it?")) return;

  localStorage.setItem("data_" + pendingUploadKey, JSON.stringify(pendingUploadData));
  const months = getLoadedMonths();
  if (!months.includes(pendingUploadKey)) {
    months.push(pendingUploadKey);
    months.sort();
    localStorage.setItem("grocery_months", JSON.stringify(months));
  }
  closeUploadModal();
  switchMonth(pendingUploadKey);
  if (typeof syncToCloud === 'function') syncToCloud();
}

// ─────────── DATA MANAGER ───────────
function openDataManager() {
  if (typeof DEMO_MODE !== 'undefined' && DEMO_MODE) { showDemoUpgradePrompt("Create an account to manage your own data."); return; }
  const months = getLoadedMonths();
  let totalBytes = 0;
  let html = "";
  months.forEach(key => {
    const [y, m] = key.split("_");
    const label = MONTH_NAMES[parseInt(m) - 1] + " " + y;
    const dataStr = localStorage.getItem("data_" + key);
    const bytes = dataStr ? new Blob([dataStr]).size : 0;
    totalBytes += bytes;
    const isActive = key === ctx.monthKey;
    html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px;border-bottom:1px solid var(--card-border)">';
    html += '<div><div style="font-weight:600">' + label;
    if (isActive) html += ' <span style="font-size:10px;color:var(--green)">(ACTIVE)</span>';
    html += '</div><div style="font-size:11px;color:var(--text-muted)">' + formatBytes(bytes) + '</div></div>';
    html += '<button onclick="deleteMonth(\'' + key + '\')" style="background:rgba(244,63,94,0.12);border:1px solid rgba(244,63,94,0.25);color:var(--rose);border-radius:6px;padding:6px 12px;font-size:11px;cursor:pointer;font-family:inherit">Delete</button>';
    html += '</div>';
  });
  document.getElementById("manager-list").innerHTML = html;
  document.getElementById("manager-usage").textContent = "Total storage: " + formatBytes(totalBytes) + " of ~5 MB available";
  document.getElementById("manager-modal").classList.add("open");
}

function closeDataManager() {
  document.getElementById("manager-modal").classList.remove("open");
}

function deleteMonth(key) {
  if (typeof DEMO_MODE !== 'undefined' && DEMO_MODE) { showDemoUpgradePrompt("Create an account to manage your own data."); return; }
  // Snapshot data before deleting
  var dataSnap = localStorage.getItem("data_" + key);
  var editsSnap = localStorage.getItem("edits_" + key);
  var monthsSnap = localStorage.getItem("grocery_months");
  var mk = key;
  var label = key.replace('_', ' ');

  localStorage.removeItem("data_" + key);
  localStorage.removeItem("edits_" + key);
  let months = getLoadedMonths().filter(m => m !== key);
  localStorage.setItem("grocery_months", JSON.stringify(months));
  if (months.length === 0) { location.reload(); return; }
  if (key === ctx.monthKey) switchMonth(months[0]);
  buildMonthSelector();
  openDataManager();
  if (typeof syncToCloud === 'function') syncToCloud();

  pushUndo(label + ' deleted', function() {
    if (dataSnap) localStorage.setItem("data_" + mk, dataSnap);
    if (editsSnap) localStorage.setItem("edits_" + mk, editsSnap);
    if (monthsSnap) localStorage.setItem("grocery_months", monthsSnap);
    switchMonth(mk);
    buildMonthSelector();
    if (typeof syncToCloud === 'function') syncToCloud();
  });
}

// ─────────── DOWNLOAD / LOAD DATA ───────────
function downloadAllData() {
  if (typeof DEMO_MODE !== 'undefined' && DEMO_MODE) { showDemoUpgradePrompt("Sign up to download your grocery data."); return; }
  const keys = {};
  const months = localStorage.getItem("grocery_months");
  if (months) keys["grocery_months"] = months;
  const active = localStorage.getItem("grocery_activeMonth");
  if (active) keys["grocery_activeMonth"] = active;
  const allMonths = JSON.parse(months || '[]');
  allMonths.forEach(mk => {
    const d = localStorage.getItem("data_" + mk);
    if (d) keys["data_" + mk] = d;
    const e = localStorage.getItem("edits_" + mk);
    if (e) keys["edits_" + mk] = e;
    const dd = localStorage.getItem("dupeDismissed_" + mk);
    if (dd) keys["dupeDismissed_" + mk] = dd;
  });
  const blob = new Blob([JSON.stringify({ version: 1, type: "grocery", exported: new Date().toISOString(), keys }, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "grocery_backup_" + new Date().toISOString().slice(0, 10) + ".json";
  a.click();
  URL.revokeObjectURL(a.href);
}

function loadDataFile(event) {
  if (typeof DEMO_MODE !== 'undefined' && DEMO_MODE) { showDemoUpgradePrompt("Sign up to load your own data."); return; }
  const file = event.target.files[0];
  if (!file) return;
  event.target.value = "";
  const reader = new FileReader();
  reader.onload = function() {
    try {
      const data = JSON.parse(reader.result);
      if (!data.keys || data.type !== "grocery") { showToast("Invalid grocery backup file.", "error"); return; }
      const hasExisting = getLoadedMonths().some(mk => localStorage.getItem("data_" + mk));
      if (hasExisting) {
        if (!confirm("This will overwrite your existing grocery data on this device. Continue?")) return;
      }
      Object.entries(data.keys).forEach(([k, v]) => localStorage.setItem(k, v));
      showToast("Data loaded successfully! Reloading...", "success"); setTimeout(function(){ location.reload(); }, 1500);
    } catch(e) {
      showToast("Error reading file: " + e.message, "error");
    }
  };
  reader.readAsText(file);
}

// ─────────── COMPARE TAB ───────────
function renderCompare() {
  const months = getLoadedMonths();
  const container = document.getElementById("compare-content");

  if (months.length < 2) {
    container.innerHTML = '<div class="card" style="text-align:center;padding:60px 20px">' +
      '<div style="font-size:16px;font-weight:700;color:var(--text-muted);margin-bottom:8px">No Comparison Data Yet</div>' +
      '<div style="font-size:13px;color:var(--text-muted)">Upload a second month\'s data to see month-over-month comparisons.</div>' +
      '<button onclick="openUploadModal()" class="month-nav-btn" style="margin-top:16px;background:rgba(34,197,94,0.15);color:var(--green);border:1px solid rgba(34,197,94,0.3)">+ Upload Month</button></div>';
    return;
  }

  // Load all months' summary
  const allMonthData = months.map((key, idx) => {
    const data = loadMonthData(key);
    if (!data) return null;
    const [y, m] = key.split("_");
    const g = data.filter(i => itemType(i) === "grocery");
    const t = data.filter(i => itemType(i) === "toiletry");
    return {
      key, label: MONTH_ABBR[parseInt(m) - 1] + " " + y,
      fullLabel: MONTH_NAMES[parseInt(m) - 1] + " " + y,
      color: COMPARE_COLORS[idx % COMPARE_COLORS.length],
      total: data.reduce((s, i) => s + i.t, 0),
      groceryTotal: sum(g), toiletryTotal: sum(t),
      items: data.length,
      trips: [...new Set(data.map(i => i.d + "|" + i.s))].length,
      stores: [...new Set(data.map(i => i.s))].length,
      categories: groupBy(data, "c"),
      storeGroups: groupBy(data, "s"),
    };
  }).filter(Boolean);

  if (allMonthData.length < 2) {
    container.innerHTML = '<div class="card" style="text-align:center;padding:40px"><div style="color:var(--text-muted)">Not enough valid month data to compare.</div></div>';
    return;
  }

  // Delta cards (compare last 2 months)
  const curr = allMonthData[allMonthData.length - 1];
  const prev = allMonthData[allMonthData.length - 2];
  function deltaHtml(label, currVal, prevVal, isMoney) {
    const diff = currVal - prevVal;
    const pctChange = prevVal > 0 ? ((diff / prevVal) * 100).toFixed(1) : "0";
    const cls = diff > 0 ? "delta-up" : diff < 0 ? "delta-down" : "delta-same";
    const sign = diff > 0 ? "+" : "";
    const valStr = isMoney ? fmt(currVal) : currVal;
    const diffStr = isMoney ? sign + fmt(Math.abs(diff)) : sign + diff;
    return '<div class="delta-card"><div class="kpi-label">' + label + '</div>' +
      '<div class="delta-value" style="color:var(--text)">' + valStr + '</div>' +
      '<div class="delta-change ' + cls + '">' + diffStr + ' (' + (diff > 0 ? "+" : "") + pctChange + '%) vs ' + prev.label + '</div></div>';
  }

  let html = '<div class="delta-grid">';
  html += deltaHtml("Total Spend", curr.total, prev.total, true);
  html += deltaHtml("Grocery Spend", curr.groceryTotal, prev.groceryTotal, true);
  html += deltaHtml("Toiletry Spend", curr.toiletryTotal, prev.toiletryTotal, true);
  html += deltaHtml("Shopping Trips", curr.trips, prev.trips, false);
  html += deltaHtml("Items Purchased", curr.items, prev.items, false);
  html += deltaHtml("Avg Per Trip", curr.total / curr.trips, prev.total / prev.trips, true);
  html += '</div>';

  // Spend trend chart
  html += '<div class="card"><div class="card-title">Monthly Spend Trend</div><div class="chart-wrap"><canvas id="chart-compare-trend"></canvas></div></div>';

  // Category comparison
  html += '<div class="card"><div class="card-title">Category Comparison</div><div class="chart-wrap-tall"><canvas id="chart-compare-cats"></canvas></div></div>';

  // Store comparison
  html += '<div class="card"><div class="card-title">Store Comparison</div><div class="chart-wrap-tall"><canvas id="chart-compare-stores"></canvas></div></div>';

  container.innerHTML = html;

  // Render trend chart
  charts.compareTrend = new Chart(document.getElementById("chart-compare-trend"), {
    type: "line",
    data: {
      labels: allMonthData.map(m => m.label),
      datasets: [
        { label: "Total", data: allMonthData.map(m => +m.total.toFixed(2)), borderColor: "#22c55e", backgroundColor: "rgba(34,197,94,0.1)", fill: true, tension: 0.3, pointRadius: 6, pointBackgroundColor: "#22c55e" },
        { label: "Groceries", data: allMonthData.map(m => +m.groceryTotal.toFixed(2)), borderColor: "#3b82f6", tension: 0.3, pointRadius: 5, pointBackgroundColor: "#3b82f6" },
        { label: "Toiletries", data: allMonthData.map(m => +m.toiletryTotal.toFixed(2)), borderColor: "#a855f7", tension: 0.3, pointRadius: 5, pointBackgroundColor: "#a855f7" },
      ]
    },
    options: withChartAnimation({ responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => "$" + v } } }, plugins: { tooltip: { callbacks: { label: c => c.dataset.label + ": " + fmt(c.raw) } } } })
  });

  // Category comparison grouped bar
  const allCats = [...new Set(allMonthData.flatMap(m => m.categories.map(c => c.name)))].sort();
  charts.compareCats = new Chart(document.getElementById("chart-compare-cats"), {
    type: "bar",
    data: {
      labels: allCats,
      datasets: allMonthData.map((m, i) => ({
        label: m.label,
        data: allCats.map(cat => { const found = m.categories.find(c => c.name === cat); return found ? +found.total.toFixed(2) : 0; }),
        backgroundColor: m.color,
        borderRadius: 4,
      }))
    },
    options: withChartAnimation({ responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => "$" + v } } }, plugins: { tooltip: { callbacks: { label: c => c.dataset.label + ": " + fmt(c.raw) } } } })
  });

  // Store comparison grouped bar
  const allStores = [...new Set(allMonthData.flatMap(m => m.storeGroups.map(s => s.name)))].sort();
  charts.compareStores = new Chart(document.getElementById("chart-compare-stores"), {
    type: "bar",
    data: {
      labels: allStores,
      datasets: allMonthData.map((m, i) => ({
        label: m.label,
        data: allStores.map(store => { const found = m.storeGroups.find(s => s.name === store); return found ? +found.total.toFixed(2) : 0; }),
        backgroundColor: m.color,
        borderRadius: 4,
      }))
    },
    options: withChartAnimation({ responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => "$" + v } } }, plugins: { tooltip: { callbacks: { label: c => c.dataset.label + ": " + fmt(c.raw) } } } })
  });
}
