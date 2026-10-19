# QA Report — Topekox Blog (Phase 3)

Date: 2026-10-19 · Hugo v0.153.1 extended · Browser: Google Chrome (headless, driven through the DevTools protocol from a Node script).

**Verification legend:** **[B]** verified in a real browser (computed styles, layout rects, events, screenshots). **[H]** verified by inspecting generated HTML/XML from `hugo` (build-only). **[U]** not verified.

## 1. Summary
- Final clean build `hugo --cleanDestinationDir --gc --minify`: exit 0, no warnings/errors, 82 pages, 2 paginator pages. [H]
- Browser suite: **85/85 checks pass** after fixes (initial run 78/85; see §4).
- Not verified: Lighthouse, axe, screen readers, browsers other than Chrome, real mobile devices, MathJax offline behavior (see §7).

## 2. Functional tests
| # | Test | Result | How |
|---|---|---|---|
| F1 | `hugo version` | PASS — v0.153.1+extended windows/amd64 | [H] |
| F2 | `hugo --cleanDestinationDir` | PASS, no warnings | [H] |
| F3 | Home shows 10 summaries (13 published posts) | PASS — 10 on p1, 3 on p2 | [H][B] |
| F4 | Pagination with >10 articles | PASS — `rel=next`/`rel=prev`, `aria-current` on current page | [H] |
| F5 | Article page: date, category, read-more | PASS — Indonesian long dates ("18 Oktober 2026"), 10 read-more links on p1, 3 on p2, category links | [H][B] |
| F6 | Draft excluded | PASS — draft slug absent from HTML, `index.json`, sitemap, RSS | [H] |
| F7 | About / Archive / Search / footer / 404 / categories / tags pages | PASS — exactly one `h1`, one `main`, one `aside`, one `footer`, `lang="id"`, description, canonical, ≥5 OG tags, no console/network errors on all 10 URLs | [B] |
| F8 | Navigation | PASS — 4 items work; `aria-current="page"` correct on `/`, `/tentang/`, `/arsip/`, `/cari/` | [B] |
| F9 | Archive | PASS — grouped by year ("2026 (13)"), lists all 13 posts | [B] |
| F10 | Search relevance | PASS — "docker"→Docker post; "HEAP sort" (case-insens., multi-word)→Heap Sort; "yaml"→2 posts; category "pemrograman"→3; `?q=matriks` prefilled | [B] |
| F11 | Search edge cases | PASS — empty/whitespace query: no results and no message; no results: "Tidak ada hasil…"; regex chars `.*([` safe; HTML in query not injected | [B] |
| F12 | RSS | PASS — 13 `<item>` (posts only, no About/Archive/Search) | [H] |
| F13 | Sitemap / robots | PASS — sitemap lists pages, posts, taxonomies; `robots.txt` present | [H] |
| F14 | Canonical URLs | PASS — page 2 → `/page/2/`, taxonomy pages self-referential (fixed, §4) | [H][B] |
| F15 | Metadata | PASS — OG title/description/url/type/locale; JSON-LD `BlogPosting` on posts (added, §4); inline favicon (added) | [H][B] |

## 3. Content rendering tests
| # | Test | Result | How |
|---|---|---|---|
| C1 | Highlighting: Python, JavaScript, Bash, YAML, JSON | PASS — `data-lang` correct, ≥4 distinct token colours each, `white-space: pre` | [B] |
| C2 | Code block vs reference | PASS (see §5) — sampled colours match exactly | [B] |
| C3 | Line numbers on opt-in block (`{linenos=true}`) | PASS | [H][B] |
| C4 | Inline + display LaTeX (fractions, roots, sub/superscripts, Σ, ∫, matrix, Greek) | PASS — 9 MathJax containers (3 display), no raw delimiters left; screenshot confirms correct typesetting | [B] |
| C5 | MathJax only on `math = true` pages | PASS — CDN script absent on home and non-math posts | [H] |
| C6 | Image | PASS — loads, alt text present, also works as card featured image | [B] |
| C7 | Table, blockquote, ordered/unordered/nested lists, TOC | PASS | [B] |
| C8 | Long code line | PASS — scrolls inside the block (`overflow-x:auto`), page does not overflow | [B] |
| C9 | Inline code distinct | PASS — grey background, mono font, accent colour | [B] |

## 4. Defects found and fixed
| Defect | Fix | Re-test |
|---|---|---|
| Page 2 canonical pointed to the homepage | `canonical` block in `baseof.html`; `index.html` / `list.html` use the paginator URL | F14 PASS |
| No JSON-LD (PRD FR6) | `BlogPosting` JSON-LD in `head.html` | F15 PASS |
| Main column 1098 px instead of reference 1123 px | `--container` 1390 → 1415 px (1391 + padding) | width/gap/main checks PASS |
| First-pass visual values were estimates | Replaced with values sampled from the reference PNGs: bg `#eee`, text `#555`, nav active `#f5f5f5`, teal `#37c6c0`, code `#f0f0f0`/`#f7f7f7`, dots `#fc625d/#fdbc40/#35cd4b`, shadow `0 1px 6px`, body 18px/36px, nav row 38px, brand 112px | all visual checks PASS |
| Code theme differed from the reference | Chroma style `github` → `friendly` (keyword `#007020` bold, comment `#60a0b0` italic, bg `#f0f0f0`; identical to the reference) | PASS |
| `/favicon.ico` 404 console error | Inline SVG favicon in `head.html` | no console errors |
| Scrollable `<pre>` focus ring was the browser default | `pre:focus-visible` shares the site focus outline | focus check PASS |
| Meta separator `|` dangled at line end on mobile | hide separator, stack items under 900 px | screenshot |
| Older/newer links swapped (earlier phase) | `PrevInSection` = older, `NextInSection` = newer | verified |

First browser run: 78/85. The 5 non-defect failures were wrong test expectations: viewport scrollbar offset, display-equation count (3 not 4), nested list item count, shared CSS class used as a label, and a nav hidden when measuring order. They were corrected in the script (not by changing the site).

## 5. Visual comparison with references
Method: reference PNG pixels were decoded and sampled; the site was measured in Chrome at 1903 px. **[B]**

| Aspect | Reference | Site | Match |
|---|---|---|---|
| Sidebar width | 256 px | 256 px | ✔ |
| Gap / main width | 12 / 1123 px | 12 / 1123 px | ✔ |
| Page background | `#eee` | `#eee` | ✔ |
| Brand header | `#222`, 112 px | `#222`, 112 px | ✔ |
| Nav rows | ≈38 px, active `#f5f5f5` | 38.4 px, `#f5f5f5` | ✔ |
| Avatar | ≈128 px | 128 px | ✔ |
| Card gap / inner padding | 12 / 40 px | 12 / 41 px | ✔ |
| Title | centered, `#555` | centered, `#555`, weight 300 | ✔ |
| Body | ≈18 px / 36 px, justified, `#555` | 18/36 px, justified, `#555` | ✔ |
| Meta | 14 px, centered, `#999` | 14 px, centered, `#767676` | ≈ (deliberate) |
| Code body / header | `#f0f0f0` / `#f7f7f7` | same | ✔ |
| Code dots | `#fc625d #fdbc40 #35cd4b` | same | ✔ |
| Keyword / comment colours | `#007020` / `#60a0b0` italic | same | ✔ |
| Read-more button | outlined 2 px | 2 px `#222` | ✔ |
| Panel shadow | soft ≈6 px | `0 1px 6px rgba(0,0,0,.2)` | ✔ |

### Remaining visual differences
1. **Corners:** reference code block is square; ours has an 8 px radius (Phase 2 explicitly asked for rounded corners).
2. **Muted text:** reference `#999` (2.8:1) darkened to `#767676` (4.54:1) for WCAG AA; slightly darker captions/meta.
3. **Icons:** reference uses solid Font-Awesome-style icons; ours are outline inline SVGs (no external font).
4. **Typeface:** reference font unidentified; we use a system stack (Noto Sans → Segoe UI …). Glyph shapes and the weight-300 title can differ by OS.
5. **Nav labels:** "Halaman Depan / Tentang / Arsip / Mencari" capitalised as requested; reference was lowercase.
6. **Profile card:** reference has a CC badge, friend links and visitor/page-view rows; ours intentionally omits them (no real data). Avatar is an initials placeholder.
7. Blockquote bottom spacing is slightly larger than ideal (paragraph margin inside quote).

## 6. Accessibility and reliability
| Check | Result | How |
|---|---|---|
| Landmarks / single `h1` | PASS on all tested pages | [B] |
| Skip link: first Tab stop, becomes visible | PASS | [B] |
| Tab order: skip → brand → nav (in order) → content | PASS | [B] |
| Visible focus on every focused element (3 px outline, incl. scrollable code) | PASS | [B] |
| Mobile menu: toggle ≥44 px, `aria-expanded`, Escape closes and returns focus | PASS | [B] |
| Mobile order brand → nav → content → profile → info → footer | PASS | [B] |
| Images have `alt` | PASS (all pages) | [B] |
| Contrast (body 7.46, meta/captions 4.54) | PASS ≥4.5 | [B] computed |
| No horizontal page overflow at 320, 360, 390, 768, 899, 901, 1024, 1440, 1903 px on 6 page types | PASS | [B] |
| Back-to-top + progress bar | PASS | [B] |
| No console/network errors | PASS (after favicon fix) | [B] |

## 7. Known limitations / unverified
- **Not run:** Lighthouse, axe, WAVE, screen readers (NVDA/VoiceOver), Firefox/Safari, physical phones. Mobile = Chrome device-metrics emulation only. [U]
- **MathJax** loads from jsDelivr (3.2.2, no SRI); math needs network access. Offline/blocked-CDN behavior untested; raw delimiters would show. [U]
- **Performance budgets** (PRD A7, A13) not measured; built CSS ≈ 13 KB, JS ≈ 3 KB uncompressed. [H]
- `baseURL` is still `https://example.org/`, so absolute URLs (canonical, OG, sitemap, RSS) use it.
- Profile bio, avatar and social links are unset (by design); only the display name is configured.
- Site-info panel shows only newest and last-updated dates; no visitor/page-view/word/age figures.
- Sitemap includes `/cari/`; no `noindex` set.
- Taxonomy pages use `/categories/` and `/tags/`; taxonomy titles are English ("Categories") because Hugo's default list title is used.
- `404.html` title is Hugo's default English "404 Page not found".
- `content/posts/uji-render-markdown/` is a QA fixture and sample content; remove or keep as desired.
- Reference screenshots show no dark mode, hover states or mobile layout; those are our design.
- Test scripts live in the session scratchpad, not in the repo (no automated regression suite).

## 8. Outstanding tasks
1. Set real `baseURL`, profile bio/avatar/social links.
2. Translate taxonomy and 404 titles (add `i18n/id.toml` or set titles in `content/categories/_index.md`, `content/tags/_index.md`).
3. Run Lighthouse and axe in a CI step; consider a Playwright suite from the QA script.
4. Decide on MathJax self-hosting/SRI.
5. Replace sample articles with real content.
6. Optional: solid icon set, square code corners, blockquote spacing.

---

# Phase 4 — Randomized fade-in animations

Verification legend as above. Browser = Chrome headless via DevTools protocol, with a recorder injected before page scripts (per-frame opacity, overflow, sidebar width, layout-shift sum, animation parameters). Script lives in the session scratchpad, not in the repo.

## P4.1 Implementation
| Part | Detail |
|---|---|
| Eligible containers | `data-anim` attribute on: brand header, nav, profile, site-info, every article card, single-article card, post-nav, list/archive/search/taxonomy/404 cards, pagination, footer. Added in the existing partials/layouts, so nothing is duplicated and nothing is added to article files. Home = 16 containers; article = 7; about/archive/search = 6. Nested elements (titles, code blocks, math) are **not** animated individually. |
| Variants | `fade-in`, `fade-in-up`, `fade-in-down`, `fade-in-left`, `fade-in-right`, `fade-in-zoom` (keyframes in `assets/css/main.css`; transform + opacity only). |
| Randomization (`assets/js/anim.js`, 1.2 KB minified, loaded once from `partials/scripts.html`) | variant chosen uniformly per element on every load; duration 350–650 ms; distance 8–16 px (via `--anim-dist`); zoom 0.97→1; stagger = 60 ms × position among elements visible on load (capped at 5 steps) + 0–50 ms jitter → max delay 350 ms; elements below the fold get only 0–50 ms. Worst-case total ≈ 1.0 s. |
| Arming | existing inline `<head>` script adds `anim` to `<html>` unless `prefers-reduced-motion: reduce`. Only `html.anim [data-anim]` is hidden (opacity 0) before animating, so there is no flash of visible content. |
| Failsafe (no JS dependency) | the hidden state carries a CSS animation `anim-failsafe` that sets opacity 1 after 2 s. If `anim.js` never runs, the page reveals itself. No `anim` class (JS off) → nothing is ever hidden. |
| Cleanup | on `animationend` (plus a timer fallback) the variant class and CSS vars are removed and `anim-done` is set (opacity 1, no animation, transform none), so no persistent compositing/transform remains. |
| Reduced motion | not armed; no variants; `@media (prefers-reduced-motion: reduce)` additionally forces `opacity:1; transform:none; animation:none`. (Decision: no animation at all rather than a fade-only variant.) |
| Overflow safety | `.layout { overflow-x: clip }` (keeps sticky sidebar working); sidebar clipped while animating (see P4.3 defects). |
| Untouched | layout, colors, nav labels, content, syntax highlighting, MathJax, search. |

## P4.2 Test results (44 animation checks + 85 regression checks, all pass after fixes)
| Test | Result |
|---|---|
| `hugo --cleanDestinationDir` / `--minify` | PASS, no warnings, 82 pages [H] |
| Multi-card page (home): 16 containers each get a valid variant; all finish (`anim-done`, opacity 1, `transform: none`, `animation: none`, no leftover vars) | PASS [B] |
| Parameter bounds (16 elements): duration 415–624 ms, distance 9–16 px, delay 0–323 ms, 16 distinct delays | PASS [B] |
| No flash of content: first recorded frame (t≈38 ms) has every container at opacity 0; fully visible within ≈0.92 s | PASS [B] |
| Smooth (intermediate opacities observed) | PASS [B] |
| Randomization over 10 reloads × 16 elements: all 6 variants occur (40/23/25/30/18/24), each 6–30 %; elements in one load use 4–6 distinct variants; the same element varies across reloads (brand 5, first card 6, footer 4 distinct variants in 10 loads); durations vary | PASS [B] |
| Page types: home p2, article, article+math, article+code, archive, about, search, tag list, 404 | PASS — animated, finished, no overflow, no errors, no layout shift [B] |
| MathJax inside animated card | PASS — 9 containers (3 display), no raw delimiters [B] |
| Syntax highlighting + three-dot header intact | PASS [B] |
| Search after animation | PASS [B] |
| Horizontal overflow checked **every frame** at 320 / 390 / 768 / 1903 px on home, long article, archive, search | PASS [B] |
| Layout shift: layout-shift sum 0.0000 on all pages; every `[data-anim]` box (offset geometry) identical at first frame and when settled; 30-load stress run on a short page: 0/30 moved, sidebar always 256 px | PASS [B] |
| JavaScript disabled | PASS — nothing armed, all 16 containers at opacity 1 immediately [B] |
| `anim.js` blocked (armed but script fails) | PASS — hidden at 0.9 s, everything visible by 2.8 s via CSS failsafe; sidebar scrolling restored by CSS timer [B] |
| Reduced motion (`prefers-reduced-motion: reduce`) | PASS — not armed, no variants, `animation-name: none`, opacity 1 from the first frame; also on an article page [B] |
| Single inclusion | PASS — one `anim.min.*.js` tag, no inline animation JS in the page [B] |
| Console / network errors on all pages | none [B] |
| Regression: previous 85-check suite (layout metrics vs reference, highlight, math, search, keyboard, mobile menu, overflow, a11y) | 85/85 PASS [B] |
| Visual check: screenshot ≈330 ms into a load shows staggered partial fades with the final layout/colors | reviewed [B] |

## P4.3 Defects found while testing (all fixed and re-tested)
1. **Layout shift from lazy card images (pre-existing):** a card with a featured image had no `width`/`height`; the image arriving grew the card by 181 px and pushed pagination/footer. Fix: `article-card.html` emits intrinsic size for raster resources, or optional `imageWidth`/`imageHeight` front matter (Hugo exposes no size for SVG); new `_markup/render-image.html` does the same for Markdown images that are page resources or in `assets/`.
2. **Sidebar horizontal scrollbar flash:** `overflow-y:auto` on the sidebar computes `overflow-x:auto`, so a panel sliding in sideways briefly added a ≈10 px horizontal scrollbar (sidebar 788 px vs 778 px tall; footer moved). Fix: `overflow-x: hidden`.
3. **Sidebar vertical scrollbar flash:** panels translating up/down overflowed the sidebar's scroll box and briefly showed a vertical scrollbar, narrowing it 256 → 246 px (text reflow, 1 in ~12 loads). Fix: clip the sidebar only while animations run (`html.anim:not(.anim-finished) .sidebar{overflow:hidden}`); `anim-finished` is set when the last animation ends, and a CSS keyframe restores scrolling after 2.2 s even if the script fails.

## P4.4 Checks not performed / limitations
- **Not run:** Firefox, Safari, real devices, a real OS-level reduced-motion toggle (emulated through DevTools `prefers-reduced-motion`), Lighthouse/axe, screen readers. [U]
- Animation smoothness was judged from per-frame opacity data and one mid-animation screenshot; no frame-rate/jank profiling or video review. [U]
- Animation always runs on load, including for elements below the fold (they finish unseen); there is no scroll-triggered reveal by design (spec: "when a page loads").
- Failure mode: if `anim.js` fails, content appears abruptly after the 2 s failsafe (not instantly), and a short-viewport sidebar cannot scroll for those first 2.2 s.
- Markdown images that are **SVG** have no intrinsic size in Hugo, so they can still cause a small layout shift when they load; use raster images or set `imageWidth`/`imageHeight` for card images.
- Pre-existing, not changed: the sidebar's `overflow` clips the panel box-shadows on the left/right edges (the reference shows a soft shadow on all sides).
- Sample post `uji-render-markdown` now also carries `imageWidth/imageHeight` for the SVG test image.

---

# Phase 5 — Social icons in the profile card

Legend as above ([B] real browser, [H] build output, [U] not verified). Browser = Chrome headless via DevTools protocol.

## P5.1 Implementation
| Part | Detail |
|---|---|
| Config | `hugo.toml` `[[params.social]]`: Instagram `https://www.instagram.com/ucuptopekox/` (icon `instagram`), GitHub `https://github.com/topekox` (icon `github`). `name` is the accessible label only. Any entry can be added/removed without touching templates. |
| Markup | the existing `partials/profile.html` social list was reused (no duplicate markup) and **moved directly under the profile name**, before the bio and the stats. Each link: `target="_blank" rel="noopener noreferrer" aria-label="…"` and a decorative `aria-hidden` SVG; no visible text. (Previously `rel="me noopener"` and below the stats.) |
| Icons | `partials/icon.html` gained an inline `instagram` SVG (rounded square, lens, dot); the existing `github` SVG (octocat outline) is used. Both are lightweight 24×24 stroke icons (Feather-style shapes), no icon library or new dependency. |
| Styling (`assets/css/main.css`) | centered flex row, 44×44 px links (touch target), 22 px icons, 4 px gap; default colour `--muted` (#767676, 4.54:1). Hover/focus colour: Instagram `#c13584` (5.11:1), GitHub `#24292f` (14.65:1). `transition: transform 200ms, color 200ms`; hover = `translateY(-2px) scale(1.12)`. |
| Touch | hover transform is wrapped in `@media (hover: hover)` (no sticky hover after a tap); `:active` gives the same press feedback; 44 px targets. |
| Keyboard | `:focus-visible` = 3 px `#222` outline, 1 px offset, plus the brand colour. |
| Reduced motion | transition limited to colour; hover and `:active` do not move or scale. |
| Untouched | sidebar widths, brand, nav labels, cards, colours, fade-in animation code. |

## P5.2 Test results (33 new browser checks, all pass; previous 85 + 44 suites re-run: 85/85 and 44/44)
| Test | Result |
|---|---|
| `hugo --cleanDestinationDir --gc --minify` | PASS, no warnings, 82 pages [H] |
| All 50 generated HTML pages that contain a profile card carry both links with the exact URLs; no other social hosts appear anywhere | PASS [H] |
| 10 page types (home, page 2, article, math article, archive, about, search, tag, categories, 404): 2 links, exact `href`s, `aria-label` Instagram / GitHub, `target=_blank`, `rel="noopener noreferrer"`, exactly one SVG each with `aria-hidden`, **no visible text**, no console/network errors | PASS [B] |
| Placement: below the name (name bottom 512 px ≤ icons 520–564 ≤ stats 576), same row, centered in the card (row centre 145.0 = card centre 145.0), equal sizes (44×44 links, 22×22 icons), 4 px gap | PASS [B] |
| Default state subtle: no transform, `#767676`, contrast 4.54:1 | PASS [B] |
| Hover: computed transform `matrix(1.12, 0, 0, 1.12, 0, -2)` for both; colours `rgb(193,53,132)` and `rgb(36,41,47)`; transition 0.2 s on transform and colour; mid-transition sample (~90 ms) = scale 1.096, y −1.6 px (smooth); pointer leave restores `none` and original colour | PASS [B] |
| Keyboard: Tab order … Mencari → Instagram → GitHub → first card; 3 px dark outline (contrast 17:1 vs white), `:focus-visible` matches, brand colour applied | PASS [B] |
| Press feedback via mouse `:active` (desktop) | PASS [B] |
| Mobile 390 px (touch emulation): both icons present, ≥44 px, same row, no horizontal overflow; `(hover: hover)` is false and hovering applies no transform (no sticky hover) | PASS [B] |
| Reduced motion (emulated): colour-only transition; hover and press change colour but `transform: none` | PASS [B] |
| Regression: sidebar 256 px, main 1123 px, brand 112 px, nav height unchanged; profile child order avatar > name > social > stats; all 16 fade-in containers still finish; layout and animation suites unchanged | PASS [B] |

## P5.3 Defects found during testing
None in the site. Three test-script issues were corrected (colour sampled mid-transition; touch target scrolled out of view because the page uses smooth scrolling; touch check replaced, see below).

## P5.4 Not verified / limitations
- **Real touch press feedback [U]:** in headless Chrome, simulated touch events do not set `:active` (a mouse press does), so the touch-press state could only be verified with a mouse `:active`, not with a real finger. Behavior on iOS Safari/Android Chrome is untested; the icons are visible and tappable regardless, since the effect is decorative.
- Not run: Firefox, Safari, real devices, a real OS reduced-motion setting (emulated), screen readers (the accessible names come from `aria-label`; announcements were not heard). [U]
- **Brand fidelity:** the icons are Feather-style outline renditions (camera and octocat silhouettes), not the official filled logos; recognizable, but not pixel-identical to the brand marks.
- The links open external sites; clicking through (new tab, `noopener`) was verified by attributes only, not by navigating. [U]
- Pre-existing, unchanged: the global focus ring (`#37c6c0`, 3 px) on white is about 1.9:1, below the 3:1 recommended for non-text contrast; the new social links use a darker ring, other links still use the teal one.
- The profile panel grew from 281 px to 333 px (+52 px) because of the new icon row, so the siteinfo panel and the bottom of the sidebar sit 52 px lower. The reference places its icon row *below* the stats; here it is under the name, as requested.
