# UI Color Palette

This document defines the core color tokens, hex values, and usage guidelines for the interface design system.

## Color Tokens

| Role | Color Name | Hex Code | Usage |
| --- | --- | --- | --- |
| Background | Obsidian | `#0A0A0B` | Main background |
| Surface / Card | Carbon Panel | `#141416` | Credential input card, payload logs |
| Borders | Steel Edge | `#27272A` | Hard structural dividers |
| Primary Accent | Industrial Amber | `#FF9900` | CTAs, active agent filling forms, scan status |
| Secondary Accent | Hazard Gold | `#D97706` | Medium severity warnings, crawling indicators |
| Primary Text | Raw Monospace | `#FAFAFA` | URLs, console logs, vulnerability descriptions |
| Alert / Bug | Crimson Payload | `#DC2626` | Critical exploit/bug detected |

## CSS Custom Properties

```css
:root {
  --color-bg-obsidian: #0A0A0B;
  --color-surface-carbon: #141416;
  --color-border-steel: #27272A;
  --color-accent-amber: #FF9900;
  --color-accent-hazard: #D97706;
  --color-text-monospace: #FAFAFA;
  --color-alert-crimson: #DC2626;
}
```

## Tailwind CSS Color Configuration

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        obsidian: '#0A0A0B',
        carbon: '#141416',
        steel: '#27272A',
        amber: {
          industrial: '#FF9900',
        },
        hazard: '#D97706',
        monospace: '#FAFAFA',
        crimson: '#DC2626',
      },
    },
  },
};
```
