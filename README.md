# Curse of Strahd — Campaign Wiki

A living wiki for the Curse of Strahd D&D campaign, built with [Hugo](https://gohugo.io/) and the custom **Ravenloft** dark fantasy theme.

## Prerequisites

- [Hugo Extended](https://gohugo.io/installation/) v0.110+

## Development

```powershell
# Serve locally with live reload (includes draft pages)
hugo server --buildDrafts

# Build for production
hugo
```

The site is served at `http://localhost:1313` by default.

## Adding Content

Use `hugo new content` to create pages from the correct archetype for each section.
The archetype pre-fills all relevant front matter fields.

```powershell
hugo new content locations/my-location.md
hugo new content npcs/my-npc.md
hugo new content monsters/my-monster.md
hugo new content lore/my-lore-entry.md
hugo new content sessions/session-01.md
hugo new content players/my-character.md
```

Remove `draft: true` from the front matter (or pass `--buildDrafts`) when a page is ready to publish.

## Wiki Sections

| Section | Path | Purpose |
|---------|------|---------|
| Locations | `content/locations/` | Places, landmarks, regions |
| NPCs | `content/npcs/` | Non-player characters |
| Monsters | `content/monsters/` | Creatures & encounters |
| Lore | `content/lore/` | History, factions, religion |
| Sessions | `content/sessions/` | Session recaps |
| Players | `content/players/` | Player characters |

## Shortcodes

Reusable components available in any content file:

```markdown
{{< callout type="danger" title="DM Only" >}}
Strahd is watching this session.
{{< /callout >}}

{{< stat-block title="At a Glance" >}}
**CR:** 15  
**HP:** 144
{{< /stat-block >}}

{{< spoiler label="Reveal the secret" >}}
The innkeeper is a wereraven.
{{< /spoiler >}}

{{< quote attribution="Strahd von Zarovich" >}}
I am the Ancient. I am the Land.
{{< /quote >}}
```

`callout` types: `info` (default), `warning`, `danger`, `lore`.

## Front Matter Reference

Key optional fields available on any page:

| Field | Purpose |
|-------|---------|
| `subtitle` | Italic subheading below the title |
| `image` | Hero image path (relative to `static/`) |
| `summary_box` | Markdown rendered in the styled stat block |
| `tags` | Applied to the tag taxonomy |
| `hide_date` | Set `true` to suppress the date |
| `related` | List of page paths to show in the Related section |
