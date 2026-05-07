## Context

The current map drawer in `Map.jsx` is a basic `div` with a `max-h-0` to `max-h-[800px]` transition triggered by clicking. The buttons for centering the map and creating routes are standalone floating icons. The user wants a more integrated and fluid "Apple Maps" style drawer with draggable interaction and unified card aesthetics.

## Goals / Non-Goals

**Goals:**
- Implement a draggable bottom sheet using `framer-motion`.
- Unify card styles with "mini" versions of existing collection/community cards.
- Redesign floating actions into a centered "pill" group.
- Enforce Lexend typography and consistent spacing.

**Non-Goals:**
- Modifying the map rendering engine (Leaflet).
- Changing backend API endpoints for lists or routes.

## Decisions

- **Draggable Drawer**: Use `framer-motion`'s `drag="y"` and `dragConstraints` to create a pullable sheet. We will define three states: `closed` (peek), `half`, and `full`.
- **Floating Pill Group**: 
  - Create a flex container with `justify-center` and `gap-2`.
  - Buttons will have `px-4 py-2` padding, `rounded-full` corners, and use the `bg-white dark:bg-black` theme with `shadow-xl`.
  - Positioned `absolute` above the drawer's top edge.
- **Card Reuse**:
  - Instead of importing large components, we will implement local "Mini" versions in `Map.jsx` (or a sub-folder) that replicate the styles from `Home.jsx` and `Collections.jsx` but with reduced dimensions and simplified content.
- **Section Headers**: Apply `font-black italic uppercase text-[11px] tracking-widest` to headers with increased `mb-6` and `mt-8`.

## Risks / Trade-offs

- [Risk] → Drag gestures might conflict with Leaflet map panning.
  - [Mitigation] → Ensure the drag handle and drawer content have clear `z-index` and that the map container handles events only when the drawer is not being dragged.
- [Risk] → Complex animations might affect performance on mobile.
  - [Mitigation] → Use `framer-motion`'s `layout` prop sparingly and optimize image loading for mini-cards.
