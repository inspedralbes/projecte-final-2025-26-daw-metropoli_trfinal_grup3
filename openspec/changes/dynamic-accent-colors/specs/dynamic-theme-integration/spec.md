## ADDED Requirements

### Requirement: Global Theme Integration
The system SHALL use CSS variables (`--theme-color`) to drive the color of all accented UI elements, ensuring that user-selected themes in Settings are reflected across the entire application.

#### Scenario: Active Navigation Item Color
- **WHEN** the user selects a specific accent color in Settings (e.g., Pink)
- **THEN** the active navigation icon in the Navbar MUST change its color to the selected accent color.

#### Scenario: Filter Pill Highlight Color
- **WHEN** a filter pill is active (e.g., in Community or Collections)
- **THEN** the background of the active pill MUST use the dynamic `primary` color.

#### Scenario: Action Button Accent
- **WHEN** an action button (e.g., "Edit" or "Save") is rendered
- **THEN** it MUST use the dynamic `primary` color for its background or borders as defined by the design system.

#### Scenario: User Avatar Border
- **WHEN** a UserAvatar is rendered with the `borderColor="border-primary"` prop
- **THEN** the border MUST react to the selected accent color.
