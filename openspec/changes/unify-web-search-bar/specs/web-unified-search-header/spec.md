## ADDED Requirements

### Requirement: Unified Search Bar in Global Header
The system SHALL display a search bar inside the global Header component on the desktop web version, positioned near the title and the profile icon.

#### Scenario: User navigates to a supported view on desktop
- **WHEN** the user is on the `/`, `/community`, or `/collections` routes on a desktop screen
- **THEN** the search bar SHALL be visible in the global Header.

#### Scenario: User navigates to an unsupported view on desktop
- **WHEN** the user is on a route other than `/`, `/community`, or `/collections`
- **THEN** the search bar SHALL NOT be visible in the global Header.

#### Scenario: User views on a mobile device
- **WHEN** the screen size is smaller than desktop
- **THEN** the search bar in the global Header SHALL NOT be visible.

### Requirement: Global Search State Synchronization
The search query inputted in the global Header SHALL sync with the active view's data filtering logic.

#### Scenario: User types in the Header search bar
- **WHEN** the user types "Park" in the Header search bar while on a supported route
- **THEN** the active view (e.g., Collections or Community) SHALL filter its content based on the query "Park".

### Requirement: Page Layout Adjustments
The main content area of the application SHALL maintain proper padding or margin to avoid overlapping with the global Header on desktop views.

#### Scenario: User views the page on desktop
- **WHEN** the user views the application on a desktop screen
- **THEN** the page content SHALL NOT overlap with the global Header, ensuring all content is fully visible below it.
