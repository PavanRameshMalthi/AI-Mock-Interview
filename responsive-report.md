# Responsive Report

Review date: 2026-06-19

## Target Breakpoints

The redesign includes responsive behavior for:

- 320px
- 375px
- 425px
- 768px
- 1024px
- 1440px
- 1920px

## Implemented Responsive Behaviors

- Main app containers use fluid widths with maximum content constraints.
- Landing hero switches from two-column to one-column at tablet/mobile widths.
- Feature grid shifts from four columns to two columns, then one column on small screens.
- Dashboard/action/stat grids collapse to one column on narrow viewports through existing breakpoints.
- History tables remain horizontally scrollable instead of compressing content into unreadable cells.
- Profile hero collapses from avatar/content/action layout into a single-column layout.
- Certificate page switches from preview/sidebar layout to stacked layout below 1024px.
- Theme switcher moves from fixed top-right to static centered placement on very small screens.
- Hero typography uses bounded `clamp()` sizing for mobile and large desktop screens.

## Accessibility And Usability

- Focus indicators are visible across interactive elements.
- Reduced-motion preferences are respected.
- Print styles isolate the certificate preview.
- Buttons and cards keep stable 8px border radius according to the project UI guidance.

## Verification

- Frontend lint passed.
- Frontend tests passed.
- Frontend production build passed.

## Recommended Manual QA

- Open landing, dashboard, history, results, profile, and certificate at 320px, 375px, 425px, 768px, 1024px, 1440px, and 1920px.
- Verify modals on history fit within viewport height.
- Verify certificate print preview on the target browser before final demo.
