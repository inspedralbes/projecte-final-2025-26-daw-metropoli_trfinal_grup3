## Why

The current map drawer interface is inconsistent with the application's overall premium aesthetic and lacks the fluid interaction patterns found in other modern mobile-first web apps. By unifying the design language with the Home and Routes pages and implementing a draggable interaction model, we improve both usability and visual appeal.

## What Changes

- **Typography**: Enforce the Lexend font across all map drawer elements.
- **Draggable Interaction**: Replace the click-to-toggle mechanism with a smooth, draggable (drag-to-open/close) bottom sheet.
- **Card Components**:
  - **My Lists**: Implement a "mini" version of the Routes card, featuring a navigation arrow instead of an edit button.
  - **Discover Lists**: Implement a "mini" version of the Home community cards, simplified for the map view.
- **Content Structure**:
  - Increased margins and padding for section titles.
  - Removal of the "Users to discover" section to reduce clutter.
- **Floating UI**: Redesign the floating actions into two pill-shaped buttons ("Centrar" and "+") centered horizontally above the drawer handle.

## Capabilities

### New Capabilities
- `draggable-map-drawer`: A gesture-driven bottom sheet component for map interactions.
- `mini-list-cards`: Reusable small-scale versions of collection and community cards.
- `pill-action-buttons`: A unified floating action system using pill-shaped buttons.

### Modified Capabilities
<!-- No existing global specs to modify -->

## Impact

- **Frontend**: Significant refactoring of `Map.jsx` layout and state management.
- **Styling**: New utility classes in `index.css` for pill buttons and Lexend typography.
- **UX**: Improved transition between map viewing and route discovery.
