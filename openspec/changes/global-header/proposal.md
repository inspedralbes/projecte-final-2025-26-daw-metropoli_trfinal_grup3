## Why

The application currently has inconsistent headers across different screens. The user wants to introduce a global header component that can be used universally across all main screens. This header will provide a consistent brand feel with a dynamic title that changes based on the active screen and a unified top-right user profile icon for easy navigation to the profile page.

## What Changes

- Create a new global `Header` component.
- The header will have a top-left title (using the `font-display` font with minimal margins) and a top-right user profile icon linking to `/profile`.
- The title text will change dynamically based on the current route:
  - `/home`: "WeMap" (where "We" can later be styled differently).
  - `/` (Map): "WeMap" (but forced to black text for better contrast against the map background).
  - `/community`: "Comunitat" (using the i18n translation system).
  - `/colections`: "Rutas" (using the i18n translation system).
- Integrate this new header into the existing screens (`Home`, `Map`, `Community`, `Collections`), removing their redundant, individual local headers.

## Capabilities

### New Capabilities
- `global-header`: A universal header component that dynamically displays title text based on the route and provides access to the user profile.

### Modified Capabilities
- 

## Impact

- **Frontend Layout**: A new component `Header.jsx` in the `layouts` folder.
- **Frontend Pages**: `Home.jsx`, `Map.jsx`, `Community.jsx`, and `Collections.jsx` will be modified to use this global header and remove their existing custom top-header markup.
