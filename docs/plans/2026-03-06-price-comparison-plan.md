# Real-Time Price Comparison — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Auto-show nearby store prices with distance when viewing a product on the V1 Groceries Product Detail page, using Google CSE + Overpass API via a Vercel proxy.

**Architecture:** Browser gets user location (cached in localStorage), sends product name + lat/long to Vercel proxy. Proxy calls Google CSE (configured to search shopping sites) for prices and Overpass API for nearby store locations. Frontend renders a "Prices Nearby" card above the existing Store Price Comparison. Results cached 48h in localStorage.

**Tech Stack:** Vercel serverless function (Node.js), Google Custom Search JSON API, Overpass API (OpenStreetMap), Browser Geolocation API, vanilla JS frontend.

---

### Task 1: Set Up Google Programmable Search Engine

**This is a manual setup task — no code.**

**Step 1:** Go to https://programmablesearchengine.google.com/ and create a new search engine.

**Step 2:** Under "Sites to search", add these shopping domains:
- `walmart.com`
- `target.com`
- `kroger.com`
- `costco.com`
- `publix.com`
- `aldi.us`
- `wholefoodsmarket.com`
- `instacart.com`

**Step 3:** Note your **Search Engine ID** (cx value).

**Step 4:** Go to Google Cloud Console → APIs & Services → Credentials → Create an API key. Enable "Custom Search API" in the API library.

**Step 5:** Add both as environment variables in Vercel dashboard for the `receipt-proxy` project:
- `GOOGLE_CSE_KEY` = your API key
- `GOOGLE_CSE_ID` = your Search Engine ID (cx)

---

### Task 2: Create Vercel Proxy Endpoint — `/api/price-check`

**Files:**
- Create: `api/price-check.js` in the `receipt-proxy` Vercel repo (separate from Monthly Spend repo)

**Step 1: Create the endpoint**

```javascript
export default async function handler(req, res) {
  // CORS
  const origin = req.headers.origin || req.headers.referer || '';
  const allowed = origin.includes('allagilejobs-jpg.github.io') || origin.includes('localhost');
  res.setHeader('Access-Control-Allow-Origin', allowed ? origin : '');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { product, lat, lng } = req.body || {};
  if (!product) return res.status(400).json({ error: 'product required' });

  const CSE_KEY = process.env.GOOGLE_CSE_KEY;
  const CSE_ID = process.env.GOOGLE_CSE_ID;
  if (!CSE_KEY || !CSE_ID) return res.status(500).json({ error: 'API not configured' });

  try {
    // Google CSE search for product prices
    const query = encodeURIComponent(product + ' price');
    const cseUrl = `https://customsearch.googleapis.com/customsearch/v1?key=${CSE_KEY}&cx=${CSE_ID}&q=${query}&num=8&gl=us`;
    const cseResp = await fetch(cseUrl);
    const cseData = await cseResp.json();

    // Parse results — extract store, price, URL from pagemap or snippet
    const priceResults = [];
    if (cseData.items) {
      for (const item of cseData.items) {
        let price = null;
        let store = item.displayLink.replace('www.', '').replace('.com', '').replace('.us', '');
        store = store.charAt(0).toUpperCase() + store.slice(1);

        // Try pagemap structured data first
        if (item.pagemap?.offer?.[0]?.price) {
          price = parseFloat(item.pagemap.offer[0].price);
        } else if (item.pagemap?.product?.[0]?.price) {
          const p = item.pagemap.product[0].price.replace(/[^0-9.]/g, '');
          price = parseFloat(p);
        }
        // Fallback: extract price from snippet
        if (!price && item.snippet) {
          const m = item.snippet.match(/\$(\d+\.?\d{0,2})/);
          if (m) price = parseFloat(m[1]);
        }

        if (price && price > 0 && price < 500) {
          priceResults.push({
            store,
            price,
            url: item.link,
            title: item.title
          });
        }
      }
    }

    // Nearby stores from Overpass (if lat/lng provided)
    let nearbyStores = [];
    if (lat && lng) {
      const overpassQuery = `[out:json][timeout:10];(node["shop"="supermarket"](around:8000,${lat},${lng});node["shop"="grocery"](around:8000,${lat},${lng});way["shop"="supermarket"](around:8000,${lat},${lng}););out center;`;
      const ovResp = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: 'data=' + encodeURIComponent(overpassQuery)
      });
      const ovData = await ovResp.json();

      nearbyStores = (ovData.elements || []).map(el => {
        const elLat = el.lat || el.center?.lat;
        const elLng = el.lon || el.center?.lon;
        const dist = elLat && elLng ? haversine(lat, lng, elLat, elLng) : null;
        return {
          name: el.tags?.name || el.tags?.brand || 'Unknown',
          lat: elLat,
          lng: elLng,
          distance_mi: dist ? Math.round(dist * 10) / 10 : null
        };
      }).filter(s => s.name !== 'Unknown').sort((a, b) => (a.distance_mi || 99) - (b.distance_mi || 99));
    }

    // Match price results with nearby stores by name
    const results = priceResults.map(pr => {
      const nearby = nearbyStores.find(ns =>
        ns.name.toLowerCase().includes(pr.store.toLowerCase()) ||
        pr.store.toLowerCase().includes(ns.name.toLowerCase().split(' ')[0])
      );
      return {
        store: pr.store,
        price: pr.price,
        url: pr.url,
        title: pr.title,
        distance_mi: nearby?.distance_mi || null
      };
    });

    // Deduplicate by store (keep cheapest)
    const seen = {};
    const deduped = [];
    for (const r of results) {
      const key = r.store.toLowerCase();
      if (!seen[key] || r.price < seen[key].price) {
        seen[key] = r;
      }
    }
    for (const r of Object.values(seen)) deduped.push(r);
    deduped.sort((a, b) => a.price - b.price);

    res.status(200).json({ results: deduped });
  } catch (err) {
    console.error('price-check error:', err);
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 3959; // miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export const config = { maxDuration: 15 };
```

**Step 2: Deploy**

```bash
cd receipt-proxy
git add api/price-check.js
git commit -m "feat: add price-check endpoint with Google CSE + Overpass"
git push  # Vercel auto-deploys
```

**Step 3: Test**

```bash
curl -X POST https://receipt-proxy.vercel.app/api/price-check \
  -H "Content-Type: application/json" \
  -d '{"product":"Great Value 2% Milk","lat":28.5383,"lng":-81.3792}'
```

---

### Task 3: Add Geolocation Helper to V1

**Files:**
- Modify: `js/groceries.js` — add after `emptyState()` function

**Step 1: Add geolocation functions**

```javascript
function getUserLocation() {
  return new Promise((resolve) => {
    const cached = localStorage.getItem('user_location');
    if (cached) {
      try { resolve(JSON.parse(cached)); return; } catch(e) {}
    }
    if (!navigator.geolocation) { resolve(null); return; }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        localStorage.setItem('user_location', JSON.stringify(loc));
        resolve(loc);
      },
      () => resolve(null),
      { timeout: 10000, maximumAge: 86400000 }
    );
  });
}

function getPriceCache(product) {
  try {
    const key = 'priceCheck_' + product.toLowerCase().replace(/\s+/g, '_');
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const data = JSON.parse(cached);
    if (Date.now() - data.timestamp > 48 * 60 * 60 * 1000) {
      localStorage.removeItem(key);
      return null;
    }
    return data.results;
  } catch(e) { return null; }
}

function setPriceCache(product, results) {
  const key = 'priceCheck_' + product.toLowerCase().replace(/\s+/g, '_');
  localStorage.setItem(key, JSON.stringify({ results, timestamp: Date.now() }));
}
```

**Step 2: Commit**

```
feat: add geolocation and price cache helpers
```

---

### Task 4: Add "Prices Nearby" Card to Product Detail

**Files:**
- Modify: `js/groceries.js` — inside `showProductDetail()` function

**Step 1: Add the price check section**

Find the existing "Store Price Comparison" card in `showProductDetail()` (around line 2126). ABOVE it, add the Prices Nearby card:

```javascript
// Prices Nearby — auto-fetch with 48h cache
html += '<div class="card" id="prices-nearby-card">';
html += '<div class="card-title"><span style="color:var(--cyan)">Prices Nearby</span></div>';
html += '<div id="prices-nearby-content" style="text-align:center;padding:20px;color:var(--text-muted)">';
html += '<div style="font-size:14px">Checking prices...</div>';
html += '</div></div>';
```

Then after the view is rendered (after `showView('product-detail')`), add the auto-fetch logic:

```javascript
// Auto-fetch nearby prices
(async function() {
  const container = document.getElementById('prices-nearby-content');
  if (!container) return;

  // Check cache first
  const cached = getPriceCache(productName);
  if (cached) { renderPricesNearby(container, cached); return; }

  // Get location
  const loc = await getUserLocation();

  try {
    const resp = await fetch('https://receipt-proxy.vercel.app/api/price-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product: productName, lat: loc?.lat, lng: loc?.lng })
    });
    if (!resp.ok) throw new Error('API error');
    const data = await resp.json();
    if (data.results && data.results.length > 0) {
      setPriceCache(productName, data.results);
      renderPricesNearby(container, data.results);
    } else {
      container.innerHTML = '<div style="font-size:13px;color:var(--text-muted)">No online prices found for this product.</div>';
    }
  } catch(e) {
    container.innerHTML = '<div style="font-size:13px;color:var(--text-muted)">Couldn\'t check prices — try again later.</div>';
  }
})();
```

**Step 2: Add render function**

```javascript
function renderPricesNearby(container, results) {
  let h = '<table style="width:100%"><thead><tr>';
  h += '<th style="text-align:left">Store</th>';
  h += '<th style="text-align:right">Price</th>';
  h += '<th style="text-align:right">Distance</th>';
  h += '</tr></thead><tbody>';
  results.slice(0, 6).forEach((r, i) => {
    const isCheapest = i === 0;
    h += '<tr>';
    h += '<td style="font-weight:600;padding:8px 4px;' + (isCheapest ? 'color:var(--green)' : '') + '">';
    h += r.url ? '<a href="' + r.url + '" target="_blank" style="color:inherit;text-decoration:none">' + r.store + ' ↗</a>' : r.store;
    if (isCheapest) h += ' <span style="font-size:10px;background:rgba(34,197,94,0.12);color:var(--green);padding:2px 6px;border-radius:4px;margin-left:4px">BEST</span>';
    h += '</td>';
    h += '<td style="text-align:right;font-family:\'Cascadia Code\',monospace;font-size:13px;' + (isCheapest ? 'color:var(--green);font-weight:700' : '') + '">$' + r.price.toFixed(2) + '</td>';
    h += '<td style="text-align:right;font-size:12px;color:var(--text-muted)">' + (r.distance_mi ? r.distance_mi + ' mi' : '—') + '</td>';
    h += '</tr>';
  });
  h += '</tbody></table>';
  h += '<div style="font-size:10px;color:var(--text-muted);margin-top:8px;opacity:0.6">Prices are online/listed and may differ in-store.</div>';
  container.innerHTML = h;
}
```

**Step 3: Commit**

```
feat: add Prices Nearby card to Product Detail with auto-fetch + 48h cache
```

---

### Task 5: Demo Mode Support

**Files:**
- Modify: `js/groceries.js`

**Step 1: Add demo data for price check**

In the auto-fetch logic, before the API call, add a demo mode check:

```javascript
if (typeof DEMO_MODE !== 'undefined' && DEMO_MODE) {
  const demoResults = [
    { store: 'Walmart', price: 3.49, distance_mi: 2.3, url: null },
    { store: 'Target', price: 3.19, distance_mi: 4.1, url: null },
    { store: 'Kroger', price: 3.79, distance_mi: 1.8, url: null }
  ];
  renderPricesNearby(container, demoResults);
  return;
}
```

**Step 2: Commit**

```
feat: add demo mode support for Prices Nearby
```

---

### Task 6: Help Guide Update

**Files:**
- Modify: `js/groceries.js` — find the Help modal content

**Step 1:** Add a section to the Help guide explaining:
- "Prices Nearby" shows online/listed prices from major retailers when you view a product
- Location access is used to show distance to nearby stores
- Results are cached for 48 hours
- Prices may differ from in-store pricing

**Step 2: Commit and push**

```
feat: document Prices Nearby in help guide
```

---

### Execution Order

Tasks 1-2 must be done first (Google CSE setup + Vercel endpoint). Tasks 3-6 depend on the endpoint being live. Task 1 is manual (browser setup), Task 2 is in the separate `receipt-proxy` repo, Tasks 3-6 are in the Monthly Spend repo.

### Testing Checklist

- [ ] Vercel endpoint returns price results for a common product
- [ ] Geolocation prompt appears on first use, stores in localStorage
- [ ] Prices Nearby card renders on Product Detail
- [ ] Cache prevents repeat API calls within 48h
- [ ] Location denied gracefully (prices show without distance)
- [ ] API error shows fallback message
- [ ] Demo mode shows mock data
- [ ] Mobile responsive (table readable on 375px)
