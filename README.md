# Topekox Blog

Hugo Extended site (Indonesian). Custom layouts live in `layouts/`, styles/scripts in `assets/`; no theme, no npm.

```
hugo server -D          # local preview, includes drafts
hugo --gc --minify      # production build into public/
hugo new posts/judul.md # new article from archetypes/posts.md
```

## Configuration (`hugo.toml`)
- `params.tagline`, `params.description`, `params.profile` (`name`, `bio`, `avatar`), `[[params.social]]`, `[[params.siteInfo]]` — all optional; empty values are not rendered.
- `[[menus.main]]` — navigation (order by `weight`, icon via `params.icon`).
- `[pagination] pagerSize = 10`.
- Sidebar statistics are computed from content only (articles, categories, tags, newest/last-updated date). There are no visitor or page-view counters.

## Social icons
Icon-only links under the profile name come from `[[params.social]]` in `hugo.toml` (`name` = accessible label, `url`, `icon` = instagram, github, telegram, mail, rss or link). They open in a new tab with `rel="noopener noreferrer"`. Add a new icon shape in `layouts/partials/icon.html`.

## Article front matter
`title`, `date`, `description` (card excerpt; falls back to the auto summary), `categories`, `tags`, `math`, `toc`, `image` (+ `imageAlt`), `draft`.
Optional card code preview: a `[codePreview]` table with `lang` and `code`.

## Math (MathJax 3, loaded only when `math = true`)
Delimiters (configured in `hugo.toml` passthrough and `layouts/partials/scripts.html`, keep them in sync):

| Kind | Syntax |
|---|---|
| Inline | `\( ... \)` |
| Display | `$$ ... $$` or `\[ ... \]` |

A single `$` is deliberately not a delimiter. MathJax is fetched from jsDelivr (pinned `3.2.2`, no SRI hash yet).

## Code blocks
Fenced blocks are highlighted at build time by Chroma (`github` style, `assets/css/chroma.css`) and wrapped by `layouts/_default/_markup/render-codeblock.html`. Line numbers: ```` ```go {linenos=true} ````.

## Entrance animations
Containers marked `data-anim` (brand, nav, profile, site info, cards, pagination, footer) fade in with a random variant, duration (350–650 ms), distance (8–16 px) and a bounded stagger on every page load. CSS keyframes are in `assets/css/main.css`; `assets/js/anim.js` only picks the random values. Nothing is hidden without JS, a CSS failsafe reveals content after 2 s if the script fails, and `prefers-reduced-motion: reduce` disables the effect entirely. Add `data-anim` to a template element to include it.

## Search
`/index.json` is generated from posts and queried in the browser by `assets/js/search.js`.
