## Context

The current application is built with a mobile-first philosophy using Tailwind CSS. We need to add a desktop/web layer that optimizes the layout for large screens without regressing or altering the existing mobile application experience.

## Goals / Non-Goals

**Goals:**
- Optimize Home, Map, and Collections for desktop browsers (`md` breakpoint and up).
- Replace the legacy "Cat Circuit" logo in the desktop Navbar with a unified "wemap" logo.
- Ensure the mobile app layout remains 100% identical to its current state.

**Non-Goals:**
- Any visual changes to the mobile view (screens < 768px).
- Altering existing functional logic or backend APIs.

## Decisions

### 1. Progressive Enhancement via Breakpoints
All responsive changes MUST use Tailwind CSS responsive prefixes (`md:`, `lg:`, `xl:`). 
- **Rationale**: This ensures that the base styles (which target mobile) remain unchanged and only get overridden when the viewport meets the desktop criteria.

### 2. Desktop-Specific Sidebar for Map
Instead of modifying the `BottomSheet` component, we will implement a separate `MapSidebar` component that only renders on `md` screens.
- **Rationale**: Prevents accidental breakage of the complex touch-interaction logic of the mobile bottom sheet.

### 3. Maximum Width Constraints
We will implement a "Safe Zone" container on desktop to prevent the UI from becoming unreadable on wide monitors, while mobile remains "edge-to-edge".

## Risks / Trade-offs

- **[Risk] Accidental Mobile Regression** → Modifying shared layouts might affect mobile.
  - **Mitigation** → Strict use of responsive prefixes and side-by-side testing of both mobile and desktop resolutions during development.
