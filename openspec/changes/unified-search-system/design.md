## Context

Currently, the Home page has a search input and category chips that are purely visual. The backend has a specific search for users but lacks a unified way to search for other entities like public lists or points of interest (POIs).

## Goals / Non-Goals

**Goals:**
- Provide a unified API endpoint for searching users, lists, and POIs.
- Implement a real-time search results panel on the frontend.
- Integrate existing category filters into the search logic.
- Ensure the search is fast and responsive (debounced).

**Non-Goals:**
- Full-text search engine integration (like Elasticsearch). We will use SQL `LIKE` or `MATCH`.
- Search history persistence.
- Advanced filtering (price range, rating, etc.) - only categories for now.

## Decisions

### 1. Unified Search Endpoint
- **Rationale**: A single request reduces latency and simplifies frontend state management.
- **Implementation**: `GET /api/search?q=query&cat=categoryID`.
- **Alternatives**: Multiple requests to `/api/usuarios/search`, `/api/listas/search`, etc. Rejected because it complicates the loading state and synchronization.

### 2. Service Layer Aggregation
- **Rationale**: Decouple the aggregation logic from the controller.
- **Implementation**: `searchService.searchAll` will use `Promise.all` to run queries for each entity in parallel.

### 3. Frontend Debouncing
- **Rationale**: Prevent unnecessary API calls on every keystroke.
- **Implementation**: Use a 300ms debounce timer on the search input.

### 4. Search Results UI
- **Rationale**: Provide immediate feedback without navigating away from the Home page.
- **Implementation**: An overlay component (`SearchResultsPanel`) that appears below the search bar, grouped by entity type (People, Routes, Places).

## Risks / Trade-offs

- **[Risk] Performance on large datasets** → [Mitigation] Implement strict `LIMIT 5` per category and ensure `nombre` and `email` columns have indexes.
- **[Risk] Search relevance** → [Mitigation] Order results by exact matches first, then partial matches.
- **[Risk] UI Clutter** → [Mitigation] Limit the number of displayed items and add a "View all" link if necessary.
