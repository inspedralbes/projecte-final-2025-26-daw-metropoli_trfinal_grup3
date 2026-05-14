## 1. Header Component Refinement

- [x] 1.1 Modify `Header.jsx` to dynamically switch between `absolute` and `relative`/`sticky` positioning based on the route and screen size.
- [x] 1.2 Implement a condition in `Header.jsx` to keep `absolute` positioning on `/` and `/map` routes for all screen sizes.
- [x] 1.3 Ensure `Header.jsx` uses `relative` positioning on mobile for all other routes (Home, Community, etc.).

## 2. Page Spacing & Cleanup

- [x] 2.1 Remove manual spacers (like `<div className="pt-5"></div>`) from pages like `Community.jsx` that were used to prevent overlap.
- [x] 2.2 Standardize the top padding of the main content area in `Home.jsx`, `Community.jsx`, and `Collections.jsx` to ensure consistent alignment across views.

## 3. Validation

- [x] 3.1 Verify that the Map view still has the header floating over it on mobile.
- [x] 3.2 Verify that Home, Community, and Collections views no longer have their top content covered by the header on mobile.
- [x] 3.3 Ensure desktop layout remains unaffected by these changes.
