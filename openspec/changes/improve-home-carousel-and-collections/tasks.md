## 1. Home Carousel Interactivity

- [x] 1.1 Update `Home.jsx` to include `id_lista` in carousel data if not present
- [x] 1.2 Wrap carousel images in a `Link` or add an `onClick` handler to navigate to `/map?route=<id_lista>`
- [x] 1.3 Add hover effects (zoom/opacity) and cursor-pointer to carousel items for visual feedback

## 2. Map Page Integration

- [x] 2.1 Verify `Map.jsx` correctly handles the `route` query parameter to focus the specified route on load
- [x] 2.2 Ensure the details drawer opens automatically when a route ID is passed via URL

## 3. Collections Page Filtering

- [x] 3.1 Modify `Collections.jsx` to remove current category-based filter pills
- [x] 3.2 Implement "Public" and "Private" filter pills with active state styling
- [x] 3.3 Update the filtering logic to use the `visibilidad` property (0 for private, 1 for public)
- [x] 3.4 Ensure the view refreshes instantly when toggling between visibility filters

## 4. Verification

- [x] 4.1 Test carousel navigation to specific map routes
- [x] 4.2 Test public/private filtering in the collections page
- [x] 4.3 Verify responsive behavior of the new filter pills on mobile devices
