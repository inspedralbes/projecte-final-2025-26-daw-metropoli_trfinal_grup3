## Why

The user wants to introduce a new "Collections" (or "Rutes") screen to list created routes with a specific, aesthetically pleasing design based on a provided reference. This allows users to easily find and browse their collections or routes. We also need to update the main navigation bar to provide direct access to this new screen instead of the profile screen, improving its discoverability.

## What Changes

- Add a new `/colections` screen using a static object for route data initially.
- The new screen will have a functional search bar to filter the routes.
- The routes will be displayed as rectangular cards (wider than tall).
- Each card will have a non-functional edit (pencil) button.
- The top header will display "Rutes" instead of a user greeting, and this will be localized (translations added).
- The main navbar will be updated: the user profile icon button will be replaced with a button linking to `/colections`. The `/profile` view itself will remain accessible via other existing links.
- The new screen must support dark mode and match the overall aesthetics of the app.

## Capabilities

### New Capabilities
- `collections-screen`: A new screen to display and filter a list of routes/collections using a responsive card layout with search functionality.

### Modified Capabilities
- `navigation`: The main navbar behavior is changing to feature the collections screen instead of the user profile.

## Impact

- **Frontend Pages**: A new `Collections.jsx` (or similar) page component will be created.
- **Frontend Components**: The existing `Navbar` component will be updated to change the profile icon to a collections icon and update its routing.
- **Routing**: A new route `/colections` will be added to the frontend router.
- **Translations**: New translation keys for "Rutes" will be added to the i18n localization files.
- **Styling**: New CSS/Tailwind classes will be used to implement the specific card design, ensuring dark mode compatibility.
