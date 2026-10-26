# Create a Token-Efficient CLAUDE.md for Topekox Blog

Act as a senior Hugo developer. Create a concise, token-efficient `CLAUDE.md` at the project root.

## First: inspect only what is necessary
- Existing `CLAUDE.md`, if present
- `hugo.toml`
- Relevant layouts, partials, CSS, JavaScript, and content structure
- Existing build commands and taxonomy configuration

Do not perform a full repository audit. Preserve and update an existing `CLAUDE.md` rather than replacing useful project-specific instructions.

## Project context
- Site name: Topekox Blog
- Description: Random Notes
- Generator: Hugo Extended
- Language: Indonesian by default
- Design: White editorial content panels, light gray page background, left sidebar, subtle borders and shadows, readable typography similar to Medium
- Sidebar navigation: Halaman Depan, Tentang, Arsip, Mencari
- Profile: Configurable through Hugo parameters
- Social icons: Instagram, GitHub, LinkedIn; icons only, with hover animations
- Page-load animations: Randomized fade-in variants, respecting reduced-motion preferences
- Homepage: 10 published article summaries per page
- Taxonomies: Categories and tags must link to working Hugo-generated pages
- Content: Markdown, Chroma syntax highlighting, MathJax LaTeX
- Other features: Responsive layouts, search, archives, RSS, sitemap, and SEO metadata where implemented

## Required CLAUDE.md rules

Keep the document concise and avoid repeating information already maintained in project documentation.

Include these sections:

### 1. Project identity
Record the generator, brand, language, and design principles.

### 2. Essential commands
Document the verified commands for:
- Local development: `hugo server`
- Production build: `hugo --cleanDestinationDir`

Mention Hugo Extended. Do not invent package scripts or commands that do not exist.

### 3. Architecture
Describe the actual locations of configuration, layouts, partials, CSS, JavaScript, and Markdown content. Verify paths before documenting them.

### 4. Design invariants
Preserve the sidebar layout, navigation, article panels, typography, social icon row, hover effects, and randomized fade-in animations. Do not redesign unrelated components when implementing a small feature.

### 5. Hugo content and taxonomies
Use native Hugo features where practical. Generate category and tag links through Hugo taxonomy functions rather than hardcoding URLs. Diagnose taxonomy configuration, article front matter, and generated output when a taxonomy URL returns 404.

### 6. Code and mathematics
Preserve Chroma highlighting and MathJax support. Test only the affected rendering behavior when changing these features.

### 7. Token-efficient workflow
- Read `CLAUDE.md` first and inspect only files relevant to the task.
- Make the smallest correct change.
- Reuse existing partials, styles, and helpers.
- Avoid full repository scans, repeated explanations, unnecessary dependencies, and unrelated refactoring.
- Do not regenerate documentation unless requested or necessary.
- Run one appropriate build after a small change.
- Run broader tests only when the scope or risk warrants them.
- Fix errors caused by the change and report unresolved issues honestly.
- Do not claim browser testing unless it was actually performed.

### 8. Safety
Never delete unrelated content, overwrite user work unnecessarily, commit, push, or deploy without explicit authorization.

## Output constraints
- Keep `CLAUDE.md` concise, preferably under 120 lines.
- Use direct, actionable instructions.
- Do not duplicate the entire PRD or technical design.
- Do not modify application code while creating this document.
- Do not install dependencies.
- If existing project behavior differs from the context above, document the verified implementation rather than assuming a feature exists.

## Final response
Report whether `CLAUDE.md` was created or updated, its location, and a short summary of the rules included. Do not perform unrelated work.