## ADDED Requirements

### Requirement: Desktop Grid Layout
The system SHALL transition from a single-column layout to a multi-column grid layout ONLY on screens wider than 768px (md breakpoint). The mobile layout SHALL remain a single-column stack.

#### Scenario: Home page on desktop
- **WHEN** the browser width is 1024px
- **THEN** the Home page displays a grid layout with featured content and status rows.

#### Scenario: Home page on mobile
- **WHEN** the browser width is 375px
- **THEN** the Home page maintains its existing vertical stack layout.

### Requirement: Max Width Container
The application SHALL wrap main content in a container with a maximum width of 1280px (xl breakpoint) on desktop screens. This container SHALL NOT restrict width on mobile devices.

#### Scenario: Content centering on large screens
- **WHEN** the browser width exceeds 1280px
- **THEN** the main content remains centered with horizontal margins.

### Requirement: Desktop Map Side Panel
The Map view SHALL replace the mobile bottom sheet with a collapsible side panel ONLY when the screen width is 768px or greater.

#### Scenario: Navigating on mobile
- **WHEN** the user is on a mobile device
- **THEN** the map continues to use the existing Bottom Sheet for route details.
