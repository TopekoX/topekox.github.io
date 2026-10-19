# PRD — Topekox Blog

- **Name:** Topekox Blog · **Tagline:** Random Notes (shown in the brand header; sample content in Indonesian)
- **Generator:** Hugo Extended ≥ 0.153.1 · **Language:** Indonesian (`id`)
- **Visual source of truth:** `references/blog-layout.png`, `references/artikel-layout.png`; extracted values in `PROJECT_AUDIT.md` §1.1.

## 1. Goals
A personal notes blog reproducing the reference's fixed-sidebar, white-card layout. Static, fast, framework-free (vanilla CSS/JS), readable code and math. Not a generic Medium-style layout. Reference branding/content is not copied.

## 2. Layout and components

```
┌────────────┬─────────────────────────────────┐
│ Sidebar    │ Main column                     │
│ ≈256px     │ ≈1123px (gap ≈12px)             │
│ ┌ Brand ┐  │ ┌ Article card ───────────────┐ │
│ ├ Nav   ┤  │ │ centered title              │ │
│ ├Profile┤  │ │ meta: date | category       │ │
│ ├ Info  ┤  │ │ summary / content           │ │
│ └───────┘  │ │ [Baca artikel selengkapnya »]│ │
│            │ └─────────────────────────────┘ │
└────────────┴─────────────────────────────────┘
```
Hierarchy: `body > .reading-progress + .layout > aside.sidebar (brand, nav, profile, site-info) + main.content` + back-to-top button.

| Component | Spec (from references) |
|---|---|
| Brand header | dark ~`#222`, ≈112 px, white title + quoted tagline, centered; links to `/` |
| Nav | order: **halaman depan, tentang, arsip, mencari**; icons home/user/archive/search (inline SVG); active = light grey bg + `aria-current="page"` |
| Profile card | avatar (round ≈128 px), display name, bio (centered grey), stats (notes / categories / tags), social icons, license badge, friend links — **each rendered only if provided** |
| Site-info panel | see §5 |
| Article card | white, ≈square corners, soft shadow, ≈40 px side padding, 12 px between cards |
| Title / meta | centered; meta = calendar icon "Diterbitkan di: {date}" · folder icon "Kategori: {link}" |
| Body | ≈18 px, line-height ≈2, justified |
| Code block | light-grey panel, shadow, macOS dots header, light Chroma theme, monospace, no line numbers by default |
| Excerpt button | outlined 2 px dark, "Baca artikel selengkapnya »" |
| Reading progress | ~3 px teal bar at top on article pages |
| Back to top | small dark square, bottom-right, appears after scroll |

Final colors/sizes: tokens in TECHNICAL_DESIGN §6, to be eyedropped from the PNGs at implementation.

## 3. Pages
1. **Home `/`** — paginated article cards: title, meta, summary (front-matter `description`, else `.Summary`), "Baca artikel selengkapnya »". Pager at bottom: previous/next + numbered pages. Page size default 10 (confirm).
2. **Article** — full card: title, meta, optional TOC, content, tags, prev/next.
3. **About `/tentang/`** — Markdown page, same card.
4. **Archive `/arsip/`** — posts grouped by year → month with date + title links.
5. **Search `/cari/`** — client-side over generated `/index.json` (title, description, tags, categories, date, URL, content excerpt); vanilla JS.
6. **Taxonomy pages** (`/kategori/…`, `/label/…`) with term listing; **404**.

## 4. Content model
`content/posts/<slug>/index.md` page bundles. Front matter:
```yaml
title: "Judul artikel"
date: 2026-10-19T09:00:00+07:00
lastmod:            # optional
draft: false
description: "Ringkasan 1–2 kalimat"
categories: ["Algoritma"]   # shown as Kategori
tags: ["hugo", "catatan"]   # shown as Label
math: false                 # true → load KaTeX
toc: false
image:                      # optional, Open Graph
```
Archetype `archetypes/posts.md` added; `default.md` untouched. Taxonomy URLs: categories→`kategori`, tags→`label`.

## 5. Statistics — real values only
Computed at build time from content:
| Reference row | Our value | Source |
|---|---|---|
| catatan | number of posts | `where .Site.RegularPages "Section" "posts"` |
| Klasifikasi | number of categories | `.Site.Taxonomies.categories` |
| Label | number of tags | `.Site.Taxonomies.tags` |
| Sudah berjalan | time since the oldest post date | earliest `.Date` |
| Jumlah kata total | sum of `.WordCount` | content |
| Jadwal membaca | sum of `.ReadingTime` | content |
| Terakhir diperbarui | newest `.Lastmod` | content |
| ~~Jumlah total pengunjung~~, ~~Tampilan halaman~~ | **omitted** — no analytics source exists; never invented | — |

Rows with no derivable value are hidden. Zero posts → panel shows nothing but empty state.

## 6. Functional requirements
- FR1 Sidebar is one partial rendered by `baseof.html`; no template duplicates it.
- FR2 Pagination with correct canonical/`rel=prev/next`.
- FR3 Syntax highlighting: Hugo Chroma, build-time, class-based CSS; code header dots via CSS/render hook (no JS).
- FR4 LaTeX: KaTeX, loaded only when `math: true`; `$…$`, `$$…$$` via Goldmark passthrough.
- FR5 RSS `/index.xml`, sitemap `/sitemap.xml`, `robots.txt`.
- FR6 SEO: title, description, canonical, Open Graph, Twitter, JSON-LD `BlogPosting`, `<html lang="id">`.
- FR7 Accessibility: WCAG 2.2 AA, skip link, landmarks, focus styles, `aria-current`, keyboard menu, reduced motion. Reference grey-on-white text must be darkened where contrast < 4.5:1 (deliberate deviation).
- FR8 Responsive (see TECHNICAL_DESIGN §9).
- FR9 Light theme only (dark mode out of scope unless approved).

## 7. Non-goals
Comments, analytics/visitor counter, newsletter, CMS, npm/Tailwind, multilingual, copying reference brand/content.

## 8. Acceptance criteria
| # | Criterion | Check |
|---|---|---|
| A1 | `hugo --gc --minify` exits 0, no warnings | CLI |
| A2 | Sidebar defined in exactly one partial, included once in `baseof` | grep |
| A3 | At 1440/1903 px: sidebar width 256 ±2 px, gap 12 ±2, nav order/labels/icons as §2 | screenshot overlay vs references |
| A4 | N posts → ⌈N/size⌉ pages; ≤ size cards per page | build |
| A5 | Every sidebar number equals an independent recomputation from `content/` | script |
| A6 | No "pengunjung"/"tampilan halaman" figure anywhere | grep |
| A7 | Lighthouse mobile ≥ 95 in all four categories | Lighthouse |
| A8 | axe: 0 serious/critical on home, article, archive, search, about | axe |
| A9 | No horizontal scroll at 320 px (code blocks scroll internally) | browser |
| A10 | KaTeX/JS assets requested only on `math: true` pages; no runtime highlighter | network |
| A11 | Search returns expected posts for title, tag, body queries | browser |
| A12 | RSS/sitemap/robots valid; `lang="id"` | validators |
| A13 | First-party JS ≤ 10 KB gz, CSS ≤ 25 KB gz, no webfonts | build output |

## 9. Test cases
T1 clean build · T2 drafts excluded · T3 post count = size and size+1 · T4 missing `description` → summary fallback · T5 `math` on/off · T6 code fence with/without language · T7 empty profile/social fields not rendered · T8 zero posts · T9 search no-result / special chars / Indonesian text · T10 keyboard-only nav + mobile menu · T11 long title / long code line · T12 404 · T13 single-post site (prev/next absent) · T14 post with no category.

## 10. Open questions
1. Profile name, bio, avatar/logo, GitHub/Telegram (or other) links, friend links, license badge — real values?
2. `baseURL` and host (GitHub Pages?).
3. Keep the reference's progress bar, back-to-top and traffic-light dots? (planned yes)
4. Nav capitalization (reference inconsistent) — plan: all lowercase "halaman depan, tentang, arsip, mencari".
5. Page size; RSS full vs summary; reuse sibling-repo content?
6. Should the site-info panel appear on every page (as in the article screenshot) or only the home page?
