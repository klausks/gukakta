---
name: Web Designer 
description: Designer of the wiki's web interface
---

## Project Overview

This is a **Hugo static site** — a dark-fantasy campaign wiki for a Curse of Strahd D&D campaign. The site uses a custom theme called `ravenloft`, located entirely under `themes/ravenloft/`. All visual design, layouts, and styles live there.

The site is built and previewed with:
```
hugo server      # local dev
hugo --minify    # production build → public/
```

---

## Directory Structure

```
themes/ravenloft/
├── assets/css/
│   └── main.scss          # Single SCSS file — all styles live here
├── layouts/
│   ├── _default/
│   │   ├── baseof.html    # Base HTML shell (html, head, body)
│   │   ├── single.html    # Individual wiki article pages
│   │   ├── list.html      # Section index pages (e.g. /npcs/, /locations/)
│   │   ├── search.html    # Search results page
│   │   ├── taxonomy.html  # Tag cloud / taxonomy list
│   │   └── terms.html     # Single tag page
│   ├── partials/
│   │   ├── head.html      # <head> meta, fonts, CSS link
│   │   ├── header.html    # Sticky top nav + search bar
│   │   ├── sidebar.html   # Left sidebar (section nav + ToC)
│   │   └── footer.html    # Footer quote + credit line
│   ├── shortcodes/
│   │   ├── callout.html   # Aside boxes (info / warning / danger / lore)
│   │   ├── quote.html     # Styled blockquote with attribution
│   │   ├── spoiler.html   # Collapsible spoiler/reveal block
│   │   └── stat-block.html # D&D-style info box
│   ├── index.html         # Homepage layout
│   ├── index.json         # JSON search index output
│   └── 404.html           # 404 page
└── static/js/
    └── search.js          # Client-side search logic
```

Config and content live outside the theme:
```
hugo.toml                  # Site config, menus, params, output formats
content/
├── _index.md              # Homepage body copy
├── locations/             # Location articles
├── npcs/                  # NPC articles
├── monsters/              # Monster articles
├── lore/                  # Lore articles
├── sessions/              # Session summaries
└── players/               # Player character articles
```

---

## Page Anatomy

Every page is assembled from `baseof.html`:

```
<html>
  head.html           ← fonts, CSS, meta
  <body>
    header.html       ← sticky nav bar + search
    <div.site-wrapper>
      <aside.sidebar>
        sidebar.html  ← section list + in-page ToC
      </aside>
      <main.main-content>
        [block "main"] ← single.html / list.html / index.html fills this
      </main>
    </div>
    footer.html
    <div.mist-overlay> ← atmospheric CSS gradient layer, aria-hidden
  </body>
</html>
```

---

## Design System (main.scss)

All styles live in a single `main.scss` file (~1071 lines), organized into numbered sections:

### Color Tokens
| Variable | Value | Usage |
|---|---|---|
| `$c-bg` | `#080507` | Page background |
| `$c-bg-surface` | `#0f080a` | Header/sidebar background |
| `$c-bg-raised` | `#190c0f` | Blockquotes, code blocks |
| `$c-bg-card` | `#200e12` | Entry cards |
| `$c-border` | `#3d1a1d` | Standard borders |
| `$c-border-glow` | `#8b0000` | Highlight / hover borders |
| `$c-text` | `#e8ddd5` | Body text |
| `$c-text-muted` | `#9a7572` | Secondary text, nav links |
| `$c-text-dim` | `#5c3235` | Timestamps, sidebar counts |
| `$c-accent` | `#9b1b1b` | Blood red — primary accent |
| `$c-accent-light` | `#c0392b` | Links, tags, highlights |
| `$c-gold` | `#b8956a` | Headings (default) |
| `$c-gold-light` | `#d4b07a` | Headings hover, site title |
| `$c-blood` | `#6b0f0f` | Darkest decorative red |
| `$c-blood-light` | `#a01515` | `h2` bullet glyph, crest |

### Typography
| Variable | Value |
|---|---|
| `$font-display` | `'Cinzel Decorative', 'Cinzel', serif` |
| `$font-heading` | `'Cinzel', serif` |
| `$font-body` | `'IM Fell English', 'Georgia', serif` |
| `$font-mono` | `'Fira Code', 'Consolas', monospace` |

- Headings use `$font-heading` (Cinzel) and are colored `$c-gold-light`
- `h2` elements get a `▸` glyph prefix via CSS `::before`
- `hr` renders a `⚜` ornamental divider
- Base font size: `17px`

### Breakpoints
| Variable | Value |
|---|---|
| `$bp-md` | `768px` |
| `$bp-lg` | `1100px` |

Below `$bp-md`: sidebar hides, nav collapses into a hamburger toggle.

### Layout
- `.site-wrapper`: CSS grid — `260px sidebar | 1fr main`, max-width `1400px`
- `.main-content`: padded content area, passes through to article/section template
- `.mist-overlay`: fixed, full-viewport, pointer-events none — two radial red gradients for atmosphere

### SCSS File Sections
1. Design Tokens
2. Reset & Base
3. Typography
4. Layout
5. Header
6. Sidebar
7. Article / Single Page
8. List / Section Page
9. Home Page
10. Shortcodes (callout, quote, spoiler, search)
11. Tags / Taxonomy
12. Search
13. Footer
14. Utilities
15. Responsive / Mobile

---

## Front Matter Parameters

### All content types
| Key | Type | Description |
|---|---|---|
| `title` | string | Page title (required) |
| `date` | date | Last updated date |
| `draft` | bool | Hides from production if `true` |
| `tags` | list | Taxonomy — renders as tag pills |
| `summary_box` | multiline string | Renders as a `.stat-block` "At a Glance" box on single pages |
| `image` | string | Path to hero image |
| `subtitle` | string | Italic subtitle under the title |
| `related` | list | Links to related pages (shown at bottom of article) |
| `hide_date` | bool | Suppress the "Last updated" timestamp |

### Sessions only
| Key | Type | Description |
|---|---|---|
| `session_number` | int | Used for ordering/display |
| `in_game_date` | string | In-world date of the session |
| `players_present` | list | Player names for the session |

---

## Shortcodes

All shortcodes live in `themes/ravenloft/layouts/shortcodes/`.

### `callout`
```
{{< callout type="warning" title="Optional Title" >}}
Content here.
{{< /callout >}}
```
Types: `info` (default), `warning`, `danger`, `lore`

### `quote`
```
{{< quote attribution="Strahd von Zarovich" >}}
I am the Ancient. I am the Land.
{{< /quote >}}
```

### `spoiler`
```
{{< spoiler label="Reveal spoiler" >}}
Hidden content here.
{{< /spoiler >}}
```

### `stat-block`
```
{{< stat-block title="At a Glance" >}}
**Race:** Human  
**Alignment:** Neutral Evil
{{< /stat-block >}}
```
Note: `summary_box` in front matter also renders a stat block automatically — use the shortcode only for additional inline stat boxes in the body.

---

## Guidelines

### Making style changes
- **Only edit `themes/ravenloft/assets/css/main.scss`** — this is the single source of truth for all styles.
- Always use the existing SCSS variables (`$c-*`, `$font-*`, `$bp-*`, `$shadow-*`) rather than hardcoding values.
- Keep the numbered section structure when adding new style blocks — insert new sections at the appropriate position and update the section header comment.
- After any SCSS change, run `hugo --minify` to regenerate the CSS fingerprint in `resources/_gen/assets/`.

### Making layout changes
- Edit partials and layout files inside `themes/ravenloft/layouts/`.
- `baseof.html` defines the global shell — changes here affect every page. Edit with care.
- Section-specific layouts should go in a subdirectory named after the section, e.g. `layouts/npcs/single.html`, which will override `_default/single.html` for that section only.
- Hugo's template lookup order: section-specific → `_default` → theme fallbacks.

### Adding new shortcodes
- Create a new `.html` file in `themes/ravenloft/layouts/shortcodes/`.
- Include a usage comment at the top of the file.
- Add the corresponding CSS in `main.scss` under a relevant section.

### Design principles
- **Dark, atmospheric, gothic.** The palette is near-black with blood-red accents and tarnished gold. Avoid introducing bright or pastel colors.
- **Readable text.** Despite the dark theme, body text (`$c-text: #e8ddd5`) must remain legible. Never reduce contrast below 4.5:1 for body copy.
- **Decorative restraint.** Glyphs (`⚜`, `▸`) and glow effects are used sparingly to reinforce atmosphere without becoming noisy.
- **Responsive.** Every layout change must be tested at both `> $bp-md` (desktop with sidebar) and `< $bp-md` (mobile, sidebar hidden, nav collapsed).
- **Performance.** Images use `loading="lazy"`. CSS is minified and fingerprinted. Do not add external JS dependencies without strong justification.

