# Project Audit — Topekox Blog

Date: 2026-10-19. Scope: read-only inspection; only the three planning documents were added.

## 1. Reference images

| Brief says | Actually found | Status |
|---|---|---|
| `reference/blog-layout.png` | `references/blog-layout.png` (1903×~842, home/top of article list) | Read |
| `reference/article-layout.png` | `references/artikel-layout.png` (1731×~959, scrolled list with code block + info panel) | Read |

Folder name is plural and the second file is `artikel-…`. Plan: keep files where they are and treat these paths as canonical (no rename without approval).

Both are screenshots of an existing third-party Hexo-style blog ("Blog Ehlxr"). **Only layout/structure/styling are reference. Its name, avatar/logo, tagline, bio, links, article text and numbers must not be copied.**

### 1.1 Extracted specification
Measurements are read from screenshots (pixel estimates, ±4 px, at roughly 1× scale); confirm with the owner/devtools if exact values matter.

**Page frame**
- Page background light grey (~`#f0f0f0`), thin dark line (~2 px) along the very top edge.
- Centered container ≈ 1390 px wide: left sidebar **≈ 256 px fixed**, gap ≈ 12 px, main column **≈ 1123 px** (both screenshots agree). Outer margins ≈ 255 px at 1903 px viewport.
- Sidebar is sticky: in the scrolled screenshot it stays at the top while posts scroll, and its first panel (brand + nav) has scrolled out, showing profile and info panels (sidebar scrolls as a whole; brand/nav are not pinned).

**Sidebar panels (top to bottom)**
1. **Brand header** — near-black (~`#222`), ≈ 112 px tall, centered white site title (~24 px) and tagline in quotes (~13 px). → "Topekox Blog" / "Random Notes".
2. **Navigation panel** — white, soft shadow, rows ≈ 38 px, 14 px text, left-aligned icon + label. Active row has light grey background. Order and icons: *home* (house) "halaman depan", *user* "tentang", *archive box* "Arsip", *search* "mencari". The reference mixes lower/upper case ("Arsip"); we will use consistent casing (decision D6).
3. **Profile card** — white, shadow. Round avatar ≈ 128 px with thin ring; name line; 3-line centered grey bio (~13 px, line-height ~26 px); **stats block**: two columns/three figures — count of notes ("catatan"), count of classifications ("Klasifikasi" = categories), count of labels ("Label" = tags); thin vertical divider; numbers bold ~16–18 px, caption grey ~13 px. Then icon row (GitHub, Telegram), a CC BY-NC-SA badge, a "Tautan Ramah" (friend links) heading with globe icon, and underlined inline links.
4. **"Informasi Situs Web" panel** (visible in article screenshot) — heading with chart icon, then icon + label + value rows: site age, total visitors, page views, total word count, estimated total reading time, last updated.

**Main column**
- Each article is a **white card**: no visible border radius (≈ square), 1 px-ish soft shadow, ≈ 12 px gap between cards, inner padding ≈ 40 px horizontally.
- **Title**: centered, ~28–30 px, light weight, mid-grey (`~#555`), wraps centered over two lines.
- **Meta line** directly under it, centered, ~14 px grey: calendar icon + "Diterbitkan di: <date>" (date has dashed underline) `|` folder icon + "Kategori: <category link>" (solid underline, darker).
- **Body**: ~18 px, line-height ≈ 2 (≈ 36 px), **justified**, grey-dark text; generous paragraph spacing.
- **Code block**: light grey (`~#efefef`) panel, no radius, large soft shadow, **macOS-style header bar** with red/yellow/green dots (≈ 12 px), monospace ~16 px with generous line-height, light syntax theme (green bold keywords, blue italic comments), no line numbers, no language label visible.
- **Excerpt button** on list cards: centered, outlined (2 px dark border, white fill, ~14 px text) "Baca artikel selengkapnya »".
- First screenshot shows a **full article page** (image + paragraph + start of code block); second shows a **list page** with summaries cut by the button.
- Top-of-page **reading progress bar** (teal, ~3 px) visible on the article-list screenshot; **back-to-top** button at the right edge (dark square).

**Responsive** — not shown in either image. To be adapted (see TECHNICAL_DESIGN §9).

### 1.2 Interpretation notes
- "Klasifikasi" and "Label" are Hexo terms for categories and tags; we map them to Hugo taxonomies `categories` and `tags` (Indonesian UI: *Kategori*, *Label*).
- The reference figure "dua puluh satu" is a localisation artefact (number spelled out beside digits); we render all numbers as digits.
- Reference shows visitor count and page views — see D2 (not reproducible honestly).

## 2. Repository state
- `D:\ucup\Workspace\blog\topekox-blog`, branch `main`, **zero commits**. Untracked: `archetypes/`, `hugo.toml`, `references/`.
- Empty dirs: `assets/ content/ data/ i18n/ layouts/ static/ themes/`. No `.gitignore`, README, CI, `package.json`, `go.mod`.
- `hugo.toml` is the stock scaffold (`baseURL = 'https://example.org/'`, `languageCode = 'en-us'`, `title = 'My New Hugo Site'`).
- `archetypes/default.md` is stock TOML front matter (`date`, `draft = true`, title).
- No content, templates, or assets exist → nothing to preserve other than these two files; we will edit `hugo.toml` in place (keeping its three keys, updating values) and leave `archetypes/default.md` untouched (add `posts.md`).

## 3. Toolchain
Hugo v0.153.1 extended (windows/amd64) ✔ · Git 2.47.1 · Node v24.11.1 (not needed; no npm). Commands: `hugo server -D`, `hugo --gc --minify`.

## 4. Risks and gaps
1. No profile data (name, bio, avatar, social links, friend links) → must come from the owner; absent fields are not rendered.
2. `baseURL` / hosting unknown (sibling dirs `kejaripalu.github.io`, `TimposuLabs.github.io` suggest GitHub Pages — unconfirmed).
3. Avatar/logo asset needed; the reference logo must not be reused.
4. No content to exercise pagination/stats; sample Indonesian posts needed.
5. Fonts in the reference can't be identified from the screenshots; system font stack assumed.
6. Repo lacks `.gitignore` (`public/`, `resources/_gen/`, `.hugo_build.lock`).
7. Mobile and dark-mode appearance are unspecified.
