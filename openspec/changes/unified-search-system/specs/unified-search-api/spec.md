## ADDED Requirements

### Requirement: Unified Search Endpoint
The backend SHALL provide a single endpoint `GET /api/search` that performs a text-based search across Users, Public Lists, and POIs.

#### Scenario: Basic search request
- **WHEN** a GET request is made to `/api/search?q=barcelona`
- **THEN** the system SHALL return a JSON object with `usuarios`, `listas`, and `pois` arrays containing matching results.

### Requirement: Category Filtering in Search
The search endpoint SHALL support an optional `cat` parameter to filter results by category ID.

#### Scenario: Search with category filter
- **WHEN** a GET request is made to `/api/search?q=pizza&cat=5`
- **THEN** the system SHALL return only results matching "pizza" that belong to category 5 (if applicable for lists and POIs).
