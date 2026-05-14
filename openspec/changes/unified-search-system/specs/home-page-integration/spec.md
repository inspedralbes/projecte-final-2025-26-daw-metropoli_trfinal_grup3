## MODIFIED Requirements

### Requirement: Dynamic home page categories
The Home page SHALL fetch the list of categories from the backend and display them in the horizontal scroll section. Clicking a category SHALL filter the active search results or global lists.

#### Scenario: Home page loads categories
- **WHEN** the Home page is mounted
- **THEN** it SHALL call `GET /api/categorias` and update the category buttons with the returned data.

#### Scenario: User clicks a category
- **WHEN** a user clicks a category button
- **THEN** the system SHALL update the `activeCategory` state and trigger a new search if a query is present.

## ADDED Requirements

### Requirement: Search bar integration
The Home page search bar SHALL capture user input and trigger the unified search system.

#### Scenario: User types in search bar
- **WHEN** the search bar value changes
- **THEN** the Home page SHALL debounced-call the unified search API and display the results in the floating panel.
