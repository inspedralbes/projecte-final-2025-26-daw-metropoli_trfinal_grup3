## Why

The current application is designed with a mobile-first approach but lacks a proper responsive layout for desktop/web browsers, resulting in a "descolocado" (misplaced) appearance on large screens (e.g., extremely tall cards, stretched layouts, and awkward spacing). Additionally, the branding needs to be unified under the "wemap" identity, replacing old "catcircuit" logos with a new icon-based design that aligns with the app's mission.

## What Changes

- **Responsive Home View**: Transition from a single-column tall layout to a grid-based layout on desktop.
- **Responsive Map View**: Convert the mobile bottom sheet into a collapsible sidebar or side panel for desktop.
- **Responsive Collections**: Implement a grid layout for collection cards and optimize modal behavior.
- **Branding Update**: Replace the "catcircuit" PNG logo in the Navbar with a new "wemap" logo component featuring a location icon.
- **Logo Cleanup**: Ensure the old logo is hidden or replaced correctly in all web-mode views.
- **Global Layout Container**: Introduce a max-width container for desktop to prevent content from stretching too wide.

## Capabilities

### New Capabilities
- `responsive-ui-system`: A global system for managing responsive grids and containers across the application.
- `wemap-branding-core`: Core branding assets and components, including the new icon-based logo.

### Modified Capabilities
- (None - No existing specs found)

## Impact

- **Frontend Layouts**: `Navbar.jsx`, `Header.jsx`, and global CSS files.
- **Main Pages**: `Home.jsx`, `Map.jsx`, `Collections.jsx`.
- **Navigation**: Desktop sidebar will be updated to host the new logo and branding.
