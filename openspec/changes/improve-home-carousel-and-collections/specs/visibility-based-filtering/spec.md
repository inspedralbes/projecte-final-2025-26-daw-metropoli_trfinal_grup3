## ADDED Requirements

### Requirement: Visibility filters for collections
The Collections page MUST provide two toggleable "pills" (filters) for "Public" and "Private" routes.

#### Scenario: Filter by private visibility
- **WHEN** the user selects the "Private" pill in the Collections page
- **THEN** the list MUST only display routes where `visibilidad` is 0
- **AND** the "Private" pill MUST show an active state (accent color)

#### Scenario: Filter by public visibility
- **WHEN** the user selects the "Public" pill in the Collections page
- **THEN** the list MUST only display routes where `visibilidad` is 1
- **AND** the "Public" pill MUST show an active state (accent color)
