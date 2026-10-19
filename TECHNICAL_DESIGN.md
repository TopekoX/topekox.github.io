# Technical Design — Topekox Blog

Companion to PRD.md and PROJECT_AUDIT.md. Hugo Extended v0.153.1; no npm, no CSS framework.

## 1. Theme structure
A small local theme `themes/topekox/` (site `layouts/` stays available for overrides), enabled with `theme = 'topekox'`.

```
themes/topekox/
  layouts/
    baseof.html              # <html lang>, head, skip link, progress bar, .layout, footer scripts
    home.html                # paginated card list
    list.html                # section/taxonomy lists (cards)
    taxonomy.html terms.html
    single.html              # article
    page.html                # about
    archive.html             # layout: archive  (content/arsip.md)
    search.html              # layout: search   (content/cari.md)
    404.html
    home.json                # JSON output format for search index (index.json)
    _markup/render-codeblock.html   # macOS-dots wrapper
    _markup/render-image.html
    _partials/
      head/{meta,seo,css,jsonld}.html
      sidebar/{sidebar,brand,nav,profile,stats,siteinfo}.html
      card.html              # article card (summary mode | full mode)
      meta.html              # date + category line
      pagination.html
      icons.html             # inline SVG sprite lookups
      math.html              # KaTeX, conditional
  assets/css/{tokens,base,layout,sidebar,card,code,pagination,search}.css
  assets/js/{menu,progress,search}.js
  assets/css/chroma.css      # from `hugo gen chromastyles --style=<light>`
```
(Hugo ≥ 0.146 layout structure: `layouts/_partials`, `layouts/_markup`.) CSS is concatenated, minified and fingerprinted with `resources.Concat | minify | fingerprint`; JS via `js.Build` is **not** needed — plain files through `resources.Minify`.

## 2. Configuration (`hugo.toml`, edited in place)
```toml
baseURL = 'https://example.org/'      # TBD by owner
languageCode = 'id'
defaultContentLanguage = 'id'
title = 'Topekox Blog'
theme = 'topekox'
enableRobotsTXT = true
[params] description = 'Random Notes'
[params.profile]   # all optional; absent → not rendered
[pagination] pagerSize = 10
[taxonomies] category='categories'  tag='tags'
[permalinks.page] posts = '/:year/:slug/'   # TBD
[markup.highlight] noClasses=false  lineNos=false  guessSyntax=false
[markup.goldmark.extensions.passthrough] enable=true
  [..delimiters] block=[['$$','$$']] inline=[['$','$']]
[outputs] home=['html','rss','json']
[sitemap] changefreq='weekly'
```
Profile data lives in `data/profile.toml` (name, bio, avatar, social list, friend links, license). Nothing is hard-coded in templates.

## 3. Sidebar architecture
`baseof.html` calls `{{ partial "sidebar/sidebar.html" . }}` **once**; every page type inherits it, so no template duplicates it. `sidebar.html` composes brand → nav → profile → siteinfo; each is its own partial and returns nothing when its data is empty.

- **Nav** is data-driven from `[menus.main]` (weight-ordered): halaman depan `/`, tentang `/tentang/`, arsip `/arsip/`, mencari `/cari/`; the `params.icon` of each entry selects an SVG; active state via `.IsMenuCurrent`/`.HasMenuCurrent` → `aria-current`.
- **Stats** partial uses `partialCached "sidebar/stats.html" .Site` (values are site-wide, so cache per build):
  - posts = `len (where .RegularPages "Section" "posts")`; categories/tags = `len .Taxonomies.<x>`
  - site age = `now.Sub (index (sort … "Date") 0).Date` formatted in days/years (Indonesian words via i18n)
  - words = sum `.WordCount`; reading = sum `.ReadingTime`; last updated = max `.Lastmod`
  - Visitors/page-views: **not implemented**.
- Sidebar position: CSS `position: sticky` on the column wrapper with `align-self:start`, scrolls as a unit if taller than viewport.

## 4. Templates behavior
- **Home**: `{{ $p := .Paginate (where .Site.RegularPages "Section" "posts") }}` → `range $p.Pages` → `card.html` (mode=summary: `.Params.description | default .Summary | plainify`, then button). Pagination partial renders prev / numbered window / next with `aria-label="Navigasi halaman"`, `aria-current`.
- **Single**: card.html mode=full; optional TOC when `toc: true`; tags; prev/next (`.PrevInSection`/`.NextInSection`).
- **Archive**: `range (where .Site.RegularPages "Section" "posts").GroupByDate "2006"` then `"January 2006"`; month names via i18n. Page content = `content/arsip.md` with `layout: archive`.
- **Search**: `index.json` output (title, description, tags, categories, date, permalink, `.Plain | truncate 600`) → `search.js` fetches once, lowercases, diacritic-folds, scores title>tags>description>body, renders result list into `aria-live="polite"` region; `<noscript>` message.
- **i18n**: `i18n/id.toml` for all UI strings (Diterbitkan di, Kategori, Label, Baca artikel selengkapnya, …). Date format `2 January 2006` with Indonesian month names through an i18n lookup (Hugo's `time.Format` does not localise months unless `lang` locale supports it; verify during build, fallback to i18n map).

## 5. Code and math
- Chroma, class-based; light style chosen to match green keywords/blue comments (e.g. `friendly`/`github`; final pick by comparing to the reference). `render-codeblock.html` wraps `highlight` output in `<figure class="code"><div class="code__bar" aria-hidden="true"></div>…</figure>`; dots are CSS pseudo-elements. Wide lines scroll (`overflow-x:auto`).
- Math: `partials/math.html` loads KaTeX CSS+JS (+auto-render) only if `.Params.math`. Preference: vendor KaTeX into `static/vendor/katex/` (self-hosted, pinned) rather than CDN — requires downloading a package, so **needs approval at implementation time**; alternative: CDN with SRI.

## 6. Design tokens (initial, to be verified against PNGs)
```
--bg:#f0f0f0  --card:#fff  --brand:#222  --nav-active:#f2f2f2
--text:#555 (→ may darken to ≥4.5:1, e.g. #4a4a4a)  --muted:#777
--accent-progress:#1fb5ac (teal, sampled visually)
--sidebar-w:256px  --gap:12px  --main-w:1123px  --container:1390px
--shadow-card:0 1px 3px rgba(0,0,0,.12)  --shadow-code:0 8px 24px rgba(0,0,0,.18)
--fs-body:18px  --lh-body:2  --fs-title:28px  --fs-meta:14px
font: system stack ("Segoe UI", Roboto, "Noto Sans", sans-serif); mono: "Cascadia Mono", Consolas, monospace
```

## 7. SEO / RSS / sitemap / a11y
- `head/seo.html`: `<title>` ("{page} | Topekox Blog"), description (front matter → summary → site), canonical, `og:*`, `twitter:card`, JSON-LD `BlogPosting` on posts and `WebSite` on home, `rel=prev/next` on paginated lists.
- RSS: Hugo default `index.xml`, customised to include description/summary (decision pending); sitemap default; `robots.txt` via `enableRobotsTXT`.
- A11y: skip link to `#main`; landmarks `header/nav/main/aside/footer` (brand in `<header>` inside aside → use `role` carefully, nav labelled "Navigasi utama"); `:focus-visible` outline; buttons ≥ 44 px touch target on mobile; icons `aria-hidden`; progress bar `aria-hidden`; back-to-top is a real `<button>`; `prefers-reduced-motion` disables smooth scroll/animations.

## 8. Performance
Zero webfonts, inline critical CSS not needed (single ≈ 20 KB CSS), JS deferred and ≤ 10 KB gz total, images via `render-image` with `loading=lazy`, width/height attributes, Hugo image processing to WebP for bundle images.

## 9. Responsive
| Viewport | Behavior |
|---|---|
| ≥ 1200 px | two columns exactly as reference (container centered, 256 + 12 + remainder) |
| 900–1199 | container fluid, sidebar 256 fixed, main flexes, side margins shrink |
| < 900 | single column. Brand header becomes a top bar with a menu toggle (`<button aria-expanded>`) revealing the nav panel; profile + info panels follow below the main content (CSS `order`); cards full-bleed with 16 px gutter, padding 20 px; title 22 px; body 16 px/1.8, justified → left-aligned (avoids rivers); code blocks scroll horizontally; pagination wraps |
| 320 px | no horizontal page scroll (acceptance A9) |
The reference defines none of this; mobile design is our adaptation and needs sign-off.

## 10. Implementation sequence
1. Housekeeping: `.gitignore`, edit `hugo.toml`, `archetypes/posts.md`, `data/profile.toml` (owner values), `i18n/id.toml`.
2. Theme skeleton + `baseof`, tokens/base CSS, head partials.
3. Sidebar partials (brand, nav, profile, siteinfo) with sample data.
4. Sample Indonesian posts (5–12, with categories, tags, one code, one math).
5. Card, meta, home list, pagination.
6. Single article, code block render hook + Chroma CSS, reading progress, back-to-top.
7. Archive, About, taxonomy, 404.
8. Search (`index.json` + JS).
9. Math/KaTeX (after approval on vendoring).
10. Responsive pass (mobile menu).
11. SEO, RSS, sitemap, robots, JSON-LD.
12. QA: pixel comparison vs references, Lighthouse, axe, acceptance A1–A13, test cases T1–T14.
Each step ends with a clean `hugo --gc --minify` and a browser check.

## 11. Decisions and uncertainties
| ID | Decision / uncertainty |
|---|---|
| D1 | Local custom theme, vanilla CSS/JS, no npm |
| D2 | Visitor count and page views **omitted**: no data source; replaced by content-derived rows only |
| D3 | Reference brand, avatar, bio, links, article text not reused |
| D4 | Reference paths differ from the brief (`references/`, `artikel-layout.png`); used as found |
| D5 | Categories/tags map to Klasifikasi/Label |
| D6 | Nav labels consistent lowercase (reference mixed) — confirm |
| D7 | Text color may be darkened for AA contrast |
| U1 | Exact fonts, hex colors, and shadows are estimates from screenshots |
| U2 | Mobile and dark appearance unspecified |
| U3 | KaTeX vendoring vs CDN; Chroma style choice |
| U4 | Whether Indonesian month names format correctly in Hugo 0.153 — verify in step 5 |
