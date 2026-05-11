## Why

Currently, the home carousel images are static and don't provide a direct path to the routes they showcase, leading to a disconnected discovery experience. Additionally, the collections page uses static category filters that don't allow users to quickly distinguish between their own private routes and publicly available ones.

## What Changes

- **Home Carousel Interactivity**: Each image in the home carousel will be linked to its corresponding route. Clicking an image will redirect the user to the Map page with that specific route focused and opened in the drawer.
- **Dynamic Collection Filters**: Replace the current static category filters in the Collections page with two dynamic "pills" (filters): "Public" and "Private". 
- **Route Visibility Filtering**: The Collections page will filter routes based on their visibility status (public vs. private) instead of just categories.

## Capabilities

### New Capabilities
- `carousel-route-linking`: Logic to associate carousel items with route IDs and navigate to the map with that route active.
- `visibility-based-filtering`: Implementation of public/private toggle filters in the collections view.

### Modified Capabilities
- `home-discovery`: Update the carousel component to support click actions.
- `collections-view`: Change the filtering logic from categories to visibility status.

## Impact

- `front/src/pages/home/Home.jsx`: Update carousel logic and item rendering.
- `front/src/pages/collections/Collections.jsx`: Replace category filters with visibility pills and update filtering logic.
- `front/src/services/communicationManager.js`: Ensure route data includes visibility flags if not already present.
