## Why

The current Home page uses hardcoded mock data for categories, user routes, and friend collections. This makes the application feel static and prevents users from seeing their own content or their friends' activity. Connecting the Home page to the database will make the experience dynamic and personalized.

## What Changes

- **Backend**:
  - Implement a seeding mechanism or ensure `init.sql` contains sufficient data for Home display.
  - (Optional) Create a `user_stats` table if not exists to track discovered places, completed routes, and activity.
- **Frontend**:
  - Replace hardcoded `categories` in `Home.jsx` with data from `/api/categorias`.
  - Replace `nearbyPlaces` (Your routes) in `Home.jsx` with data from `/api/listas/usuario/:id_usuario`.
  - Replace `friendCollections` in `Home.jsx` with data from `/api/listas/publicas` (filtered by friends if possible).
  - Implement data fetching with loading states and error handling.
  - Ensure a "fallback" or "empty state" if the database has no data, or auto-create initial data for the user.

## Capabilities

### New Capabilities
- `user-activity-stats`: Tracking and retrieving user stats (places discovered, km walked, weekly activity).

### Modified Capabilities
- `home-page-integration`: Updating the home page to fetch and display real database data instead of mocks.

## Impact

- **Database**: New tables or initial data in `usuario`, `categoria`, `pois`, and `listas`.
- **API**: Frontend will make multiple new requests on Home load.
- **Performance**: Home page initial load will depend on API responsiveness.
