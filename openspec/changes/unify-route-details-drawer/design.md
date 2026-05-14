## Context

The application has two distinct map-based views that use bottom drawers: `Map.jsx` (for viewing existing routes/details) and `CreateList.jsx` (for creating or editing routes). The `CreateList.jsx` drawer has a more modern, refined style with better contrast and spacing, while the `Map.jsx` drawer is using older styling (darker slate background) and suffers from a z-index conflict with the global mobile navbar.

## Goals / Non-Goals

**Goals:**
- Synchronize the visual style of `Map.jsx` route details with the `CreateList.jsx` bottom sheet.
- Fix the overlap with the bottom navigation bar on mobile.
- Use a consistent `framer-motion` animation for showing/hiding the drawer.

**Non-Goals:**
- Creating a shared React component for both drawers (out of scope for this quick visual fix, though recommended for future refactoring).
- Modifying the desktop sidebar layout.

## Decisions

- **Tailwind Refactoring**: The classes from `CreateList.jsx` (lines 542-549) will be ported to the corresponding section in `Map.jsx` (lines 754-756).
- **Z-Index**: A value of `10001` will be assigned to the drawer container to ensure it sits above the `9999` navbar.
- **Max Height**: Standardize `max-h-[50vh]` (matching `CreateList.jsx`) to allow for better content scrolling within the drawer.
- **Theme Support**: Use `bg-white/95 dark:bg-[#0a0a0a]/95` to support both light and dark modes with high contrast.

## Risks / Trade-offs

- **Redundancy**: Copying styles instead of extracting a component increases code duplication, but minimizes breaking changes in the short term.
- **Visual Crowding**: A `50vh` drawer might cover more of the map than the current `35vh` one, but improves readability for route details.
