## Why

The current search bar and category filters on the Home page are static and provide no real utility to the user. To improve discovery and user engagement, we need a unified search system that allows users to find people, routes, and interesting places from a single entry point.

## What Changes

- **Unified Search API**: A new backend endpoint to perform searches across `usuario`, `listas`, and `pois` tables.
- **Dynamic Search UI**: Implementation of a real-time search results panel on the Home page.
- **Filter Integration**: Connect the existing category chips to the search system to refine results.
- **Search Logic**: Implementation of fuzzy search or partial matching for better results.

## Capabilities

### New Capabilities
- `unified-search-api`: New endpoint `GET /api/search` that aggregates results from multiple entities.
- `search-results-panel`: A premium UI component to display mixed results (users, lists, places) with instant feedback.

### Modified Capabilities
- `home-page-integration`: The Home page will now trigger real-time search requests and handle the display of the results panel.

## Impact

- **Backend**: New controller and service methods for multi-table search.
- **Frontend**: `Home.jsx` refactoring, new `SearchResults` component, and updates to `communicationManager.js`.
- **Database**: Ensuring indexes exist for efficient text searching in MySQL.
