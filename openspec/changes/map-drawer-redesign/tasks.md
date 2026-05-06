## 1. Draggable Drawer Foundation

- [x] 1.1 Verify `framer-motion` availability and import it into `Map.jsx`.
- [x] 1.2 Refactor the drawer container in `Map.jsx` to use `motion.div` with vertical drag properties. (Reverted to click-toggle per user preference).
- [x] 1.3 Define snap points (peek, half-open, fully expanded) for the draggable drawer. (Reverted to click-toggle per user preference).
- [x] 1.4 Implement a dedicated drag handle at the top of the drawer component.

## 2. Card Components & Typography

- [x] 2.1 Apply Lexend typography and unified header styling (black italic uppercase) to all drawer sections. (Updated to non-italic, non-uppercase per user preference).
- [x] 2.2 Create a `MiniRouteCard` component within `Map.jsx` based on the Routes page aesthetic, replacing the edit button with a navigation arrow.
- [x] 2.3 Create a `MiniDiscoverCard` component based on Home's community cards, simplified and resized for the drawer.
- [x] 2.4 Remove the "Users to discover" section and adjust margins for remaining sections.

## 3. Floating Pill Actions

- [x] 3.1 Create a flex container for floating actions centered horizontally above the drawer.
- [x] 3.2 Implement the "Centrar" pill button with location icon and text.
- [x] 3.3 Implement the "+" pill button as a compact pill with a plus icon.
- [x] 3.4 Position the pill group to float dynamically relative to the drawer's top boundary.

## 4. Integration & Logic

- [x] 4.1 Update card click handlers to trigger map navigation and focus on selected routes.
- [x] 4.2 Ensure proper event propagation handling to prevent drag gestures from interfering with map panning.
- [x] 4.3 Finalize styling to ensure full compatibility with light/dark theme modes.
