## Why

Currently, the route details drawer in `Map.jsx` (accessed when a user selects a route from the map or home) has inconsistent styling compared to the `CreateList.jsx` drawer. Additionally, on mobile, it overlaps with the bottom navigation bar, leading to poor visibility and a fragmented user experience. Unifying these styles will ensure a cohesive and premium feel across all map-centric views.

## What Changes

- **Styling Unification**: Update the `Map.jsx` bottom drawer to match the `CreateList.jsx` drawer aesthetics (background colors, corner radius, typography).
- **Z-Index Correction**: Increase the z-index of the drawer on mobile to ensure it appears above the bottom navigation bar or adjust positioning to prevent overlap.
- **Content Alignment**: Standardize the header structure, close button, and internal spacing of the route details view to match the "Create List" design system.
- **Animation Sync**: Use the same motion transitions (`framer-motion`) for a consistent interaction feel.

## Capabilities

### New Capabilities
- `unified-map-drawer`: Defines the shared UI and interaction patterns for map-based bottom drawers (details and creation).

### Modified Capabilities
- None

## Impact

- `front/src/pages/map/Map.jsx`: Major styling updates to the bottom drawer and its logic.
- `front/src/pages/map/CreateList.jsx`: Potential extraction of shared drawer components or styles to ensure future consistency.
- `front/src/layouts/Navbar.jsx`: Indirect impact on visibility coordination with the drawer.
