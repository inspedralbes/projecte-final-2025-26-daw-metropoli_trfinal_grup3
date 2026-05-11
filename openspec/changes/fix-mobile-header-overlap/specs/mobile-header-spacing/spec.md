## ADDED Requirements

### Requirement: Mobile Content Header Spacing
The system SHALL ensure that on mobile devices (screens < 768px), the `Header` component does not overlap with the primary content of the page. This means the content following the header must start below the header's bottom edge.

#### Scenario: Home Page on Mobile
- **WHEN** a user visits the `/home` page on a mobile device
- **THEN** the header (logo and user avatar) SHALL be rendered at the top, and the search bar SHALL appear below it without being covered.

#### Scenario: Community Page on Mobile
- **WHEN** a user visits the `/community` page on a mobile device
- **THEN** the page title and user avatar SHALL be rendered at the top, and the community feed SHALL start below the header area.

### Requirement: Route-Specific Header Positioning
The system SHALL maintain `absolute` positioning for the header on the Map view (`/` or `/map`) on all devices to allow it to float over the interactive map. On all other routes, it SHALL use `relative` positioning (or an equivalent spacing mechanism) on mobile devices to prevent overlap.

#### Scenario: Map View on Mobile
- **WHEN** a user visits the `/` or `/map` page on a mobile device
- **THEN** the header SHALL remain absolute-positioned, floating over the map interface.
