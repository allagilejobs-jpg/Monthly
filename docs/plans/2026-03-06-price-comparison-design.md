# Real-Time Price Comparison with Geolocation — Design

> Date: 2026-03-06
> Scope: V1 Groceries Product Detail + new Vercel proxy endpoint
> Cost: $0 (free tiers only)

## Architecture

```
User opens Product Detail
        ↓
Check localStorage cache (48h TTL)
        ↓ (cache miss)
Browser Geolocation API → get lat/long (stored after first prompt)
        ↓
Vercel proxy: /api/price-check
  → Google Custom Search API (shopping mode) with product name
  → Overpass/OpenStreetMap API with lat/long for nearby store locations
        ↓
Returns: [{store, price, distance_mi, url}]
        ↓
Frontend renders "Prices Nearby" card on Product Detail
Cache result in localStorage for 48 hours
```

## Components

### 1. Vercel Proxy — `/api/price-check`

New endpoint in the existing `receipt-proxy` Vercel repo alongside `/api/scan`.

**Request:**
```json
{ "product": "Great Value 2% Milk", "lat": 28.5383, "lng": -81.3792 }
```

**Response:**
```json
{
  "results": [
    { "store": "Walmart", "price": 3.49, "distance_mi": 2.3, "url": "https://..." },
    { "store": "Target", "price": 3.19, "distance_mi": 4.1, "url": "https://..." }
  ]
}
```

**Security:** CORS locked to GitHub Pages origin, rate limited (20 req/hour/IP), `GOOGLE_CSE_KEY` and `GOOGLE_CSE_ID` env vars in Vercel dashboard.

### 2. Frontend — "Prices Nearby" Card

- **Placement:** Above the existing "Store Price Comparison" card on Product Detail
- **Trigger:** Auto-fetch when Product Detail opens (cache-first)
- **Display:** Store name, distance badge, listed price, link to product page
- **Loading:** Spinner while fetching
- **Disclaimer:** "Prices are online/listed and may differ in-store"

### 3. Geolocation

- Browser prompts once → save lat/long + zip to `localStorage` key `user_location`
- If denied: skip distance column, still show prices
- "Update location" link for re-prompting

### 4. Caching

- Key: `priceCheck_<productName>_<zip>`
- TTL: 48 hours
- Stored in localStorage: `{ results: [...], timestamp: Date.now() }`
- Cache hit: render immediately, no API call

## Cost

| Service | Free Tier | Expected Usage | Cost |
|---------|-----------|----------------|------|
| Google Custom Search API | 100 queries/day | ~10-30/day (48h cache) | $0 |
| Overpass/OpenStreetMap | Unlimited | Same | $0 |
| Vercel Functions | 100K/month | Minimal | $0 |
| Browser Geolocation | Free | 1 prompt/user | $0 |

## Error Handling

- Location denied → show prices without distance
- Google quota exceeded → "Price check unavailable today, try tomorrow"
- No results → "No online prices found for this product"
- Network error → "Couldn't check prices — check your connection"
- Demo mode → mock price data (2-3 fake stores)

## Limitations

Disclaimer: "Prices shown are online/listed prices and may differ from in-store pricing."

Google Shopping returns online retailer prices, not actual shelf prices. Distance is calculated from user location to known store locations via OpenStreetMap, giving a useful "which store is closest" signal even though prices are web-listed.
