## 1. UI Refactoring in Map.jsx

- [x] 1.1 Locate the "Bottom Sheet" div in `front/src/pages/map/Map.jsx` (around line 754).
- [x] 1.2 Update the container z-index to `z-[10001]` and change the transition/animation classes to match `CreateList.jsx`.
- [x] 1.3 Apply the updated styling: `bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-lg border-t border-white/10 rounded-t-[2rem] shadow-[0_-20px_60px_rgba(0,0,0,0.3)]`.
- [x] 1.4 Increase `max-h` from `35vh` to `50vh` for the inner content container.

## 2. Header and Interaction Standardization

- [x] 2.1 Standardize the drag handle and close button styling in the `Map.jsx` drawer to match the "Create List" header.
- [x] 2.2 Ensure the title typography uses `font-display` (Lexend) and follows the project's capitalization rules.
- [x] 2.3 Verify that the close button correctly triggers `setFocusedListId(null)` and `setUserToPoiRoute(null)`.

## 3. Validation

- [x] 3.1 Verify on mobile (simulated) that the drawer appears above the navbar.
- [x] 3.2 Verify that dark mode styles are applied correctly with proper contrast.
- [x] 3.3 Ensure desktop view remains unaffected and functional.
