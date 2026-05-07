## Context

The application's design system uses a `primary` color defined as a CSS variable (`--theme-color`). This variable is dynamically updated via the Settings panel. Currently, many components use hardcoded `white` or `slate` classes for active states and highlights, which prevents them from reflecting the user's chosen theme color.

## Goals / Non-Goals

**Goals:**
- Replace static "white" highlights (in dark mode) with the dynamic `primary` color.
- Standardize the use of the `primary` utility class across Navbar, Header, and main pages.
- Ensure transitions between themes remain smooth.

**Non-Goals:**
- Changing the fundamental layout of the components.
- Modifying the light mode behavior unless specifically requested (the user focused on "elementos blancos" which usually refers to the dark mode's high-contrast highlights).

## Decisions

- **Utility Mapping**: Use `text-primary`, `bg-primary`, and `border-primary` instead of `dark:text-white` or `dark:bg-white` for active/accented elements.
- **Navbar Icons**: Active navigation icons will use `text-primary`.
- **Filter Pills**: Active filters will use `bg-primary` and `text-primary-text`.
- **Buttons**: Important action buttons (like the edit button in Collections) will use `bg-primary`.
- **Variable Source**: Continue relying on `Settings.jsx` to push the selected color to the `:root` level as `--theme-color`.

## Risks / Trade-offs

- **Color Contrast**: Some selected colors (like a very light pink or a dark blue) might have poor contrast against certain backgrounds.
  - *Mitigation*: The `primary-text` variable is already designed to adapt. We should ensure it's used correctly.
- **Over-Saturation**: Making too many things the primary color might be overwhelming.
  - *Mitigation*: Only apply to elements that were previously intended to be "accents" or "active highlights".
