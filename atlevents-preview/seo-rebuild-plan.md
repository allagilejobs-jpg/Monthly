# ATL Events SEO Rebuild Plan

## SEO Principles Applied
- Mobile-first page layout and navigation.
- Crawlable static URLs for major search intents.
- Unique page titles and meta descriptions.
- Canonical URL on every page.
- Open Graph image/title/description on every page.
- Open Graph URL, site name, Twitter card title/description/image, and favicon metadata.
- Local business, service, contact page, FAQ, and breadcrumb structured data.
- Visible breadcrumbs on preserved internal pages and gallery detail pages.
- Page-specific FAQ blocks across services, packages, about, contact, gallery, testimonials, and topical landing pages.
- XML sitemap and robots file.
- Descriptive internal links between topical pages.
- Root-relative internal links so nested preserved URLs do not create accidental broken paths.
- Real event photography near relevant text.
- Descriptive alt text for every key image.
- Image loading/decoding hints for better performance behavior.
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
- Finish image review for gallery 16 once real non-PHP/non-empty source files are found.
- Consider a second pass to create WebP or AVIF alternates for the expanded galleries after production hosting is chosen.
- Add testimonials/review schema only if reviews can be represented accurately and consistently with visible testimonials.
- Add location/service-area content only where ATL Events genuinely serves.
- Replace static mailto form with a secure backend form and spam protection.
- Set up Search Console and submit sitemap after deployment.
- Test structured data in Google's Rich Results Test before production launch.
