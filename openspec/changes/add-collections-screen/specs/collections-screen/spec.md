## ADDED Requirements

### Requirement: Display Collections Screen
The system SHALL provide a `/colections` screen that displays a list of static route cards.

#### Scenario: User visits the collections screen
- **WHEN** user navigates to `/colections`
- **THEN** system displays the "Rutes" localized header and a list of static route cards

### Requirement: Search Routes
The system SHALL allow users to filter the static route cards by name using a search bar.

#### Scenario: User searches for a route
- **WHEN** user enters text into the search bar
- **THEN** the system filters the displayed cards to only those matching the search query
