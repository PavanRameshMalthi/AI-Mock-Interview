# Design System

## Design Principles

- Premium SaaS quality
- Recruiter-ready presentation
- Clear hierarchy over decorative noise
- Responsive by default
- Accessible focus and contrast states
- Light, dark, and system theme support

## Color Tokens

Primary:

- Indigo: `#6366f1`
- Deep Indigo: `#4f46e5`
- Purple accent: `#7c3aed`

Secondary:

- Cyan: `#22d3ee`
- Emerald: `#10b981`

Status:

- Success: `#10b981`
- Warning: `#f59e0b`
- Error: `#f43f5e`
- Info: `#38bdf8`

Neutrals:

- Dark background: `#070912`
- Light background: `#f7f8ff`
- Dark text: `#101827`
- Light text: `#f8fbff`
- Muted text: `#aab8d4` or `#5a6680`

## Typography

- Display heading: landing hero `h1`, `clamp(3.2rem, 8vw, 6.8rem)`
- Page heading: standard page `h1`, `clamp(2rem, 4vw, 3.5rem)`
- Section heading: `h2`, `1.25rem`
- Card title: `h3`, `1rem`
- Body text: `1rem`, line-height around `1.65`
- Small text/eyebrow: uppercase, bold, compact labels

## Components

- Glass panel: translucent background, subtle border, blur, soft shadow
- Primary button: indigo-purple-cyan gradient
- Secondary button: translucent neutral surface with border
- Metric card: compact statistic surface with gradient text
- Feature card: hover lift and border emphasis
- Score ring: conic gradient circular meter treatment
- Certificate preview: print-ready bordered document surface
- Profile hero: avatar block, identity copy, and primary action

## Motion

- Hero floating panels
- Card hover lift
- Button hover lift
- Loading spinner and shimmer utility
- Reduced-motion override for users who disable animations

## Themes

Theme preference is persisted in `localStorage` by the existing app shell. The CSS supports:

- `light`
- `dark`
- `system`

## Implementation Location

The design system lives primarily in:

- `client/src/index.css`
- Shared page structures under `client/src/pages`
- Theme switcher in `client/src/App.jsx`
