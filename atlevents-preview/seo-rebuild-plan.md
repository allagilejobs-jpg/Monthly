# ATL Events SEO Rebuild Plan

## SEO Principles Applied
- Mobile-first page layout and navigation.
- Crawlable static URLs for major search intents.
- Unique page titles and meta descriptions.
- Canonical URL on every page.
- Open Graph image/title/description on every page.
- Local business/service structured data.
- FAQ structured data on the FAQ page.
- XML sitemap and robots file.
- Descriptive internal links between topical pages.
- Real event photography near relevant text.
- Descriptive alt text for every key image.
- No meta keywords because Google does not use them.

## Initial Keyword Cluster
- Atlanta wedding planner
- Wedding planner Atlanta GA
- Multicultural wedding planner Atlanta
- Nigerian wedding planner Atlanta
- Day-of wedding coordinator Atlanta
- Month-of wedding coordination Atlanta
- Wedding planning packages Atlanta
- Corporate event planner Atlanta
- Private event planner Atlanta

## Pages Built
- `/`
- `/about_us`
- `/services`
- `/gallery`
- `/kindwords`
- `/contact`
- `/weddingpackage`
- `/atlanta-wedding-planner`
- `/multicultural-wedding-planner-atlanta`
- `/day-of-wedding-coordinator-atlanta`
- `/corporate-event-planner-atlanta`
- `/faq`

## URL Preservation
- Existing public URLs are preserved: `/about_us`, `/services`, `/gallery`, `/kindwords`, `/contact`, and `/weddingpackage`.
- Apache rewrite rules serve the static rebuild at those same paths.
- No redirect is needed for existing URLs because the old paths remain the public URLs.
- The rewrite rules are internal rewrites, not public 301/302 redirects.
- Old dynamic gallery detail paths like `/gallery/{id}` are preserved with generated portfolio pages for existing client records.
- The XML sitemap now lists the preserved public routes plus the new SEO landing pages.

## Preserved Gallery Detail URLs
- `/gallery/2`
- `/gallery/3`
- `/gallery/7`
- `/gallery/8`
- `/gallery/9`
- `/gallery/11`
- `/gallery/12`
- `/gallery/13`
- `/gallery/14`
- `/gallery/15`
- `/gallery/16`

## Next SEO Work
- Convert every existing gallery/client record into an individual portfolio page.
- Add image width/height values after final image optimization.
- Compress hero/gallery images to WebP and keep original fallbacks.
- Add testimonials/review schema if reviews can be represented accurately.
- Add location/service-area content only where ATL Events genuinely serves.
- Replace static mailto form with a secure backend form and spam protection.
- Set up Search Console and submit sitemap after deployment.
