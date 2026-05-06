## ADDED Requirements

### Requirement: Real-time Search Panel
The Home page SHALL display a floating results panel immediately below the search bar as the user types.

#### Scenario: User starts typing
- **WHEN** the user enters 3 or more characters in the search bar
- **THEN** the system SHALL display a panel with categorized results (People, Routes, Places) after a short debounce.

### Requirement: Interactive Result Selection
Each item in the search results panel SHALL be clickable and navigate the user to the corresponding detail page (Profile, List detail, or Map location).

#### Scenario: User clicks a result
- **WHEN** the user clicks on a search result item
- **THEN** the system SHALL navigate to the appropriate route and close the search results panel.
