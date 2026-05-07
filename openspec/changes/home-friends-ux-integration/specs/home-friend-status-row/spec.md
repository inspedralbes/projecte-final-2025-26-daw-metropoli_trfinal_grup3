## ADDED Requirements

### Requirement: Home Screen Friend List Integration
The system SHALL display a horizontal, scrollable list of the current user's friends on the Home screen, positioned between the search bar and the main content sections.

#### Scenario: Display friends row
- **WHEN** the authenticated user navigates to the Home screen
- **THEN** the system SHALL fetch the user's friends and display their avatars and names in a horizontal list

### Requirement: Real-time Online Status on Home
The friends row on the Home screen SHALL indicate the real-time online status of each friend using a visual indicator (e.g., a green dot).

#### Scenario: Online status indicator
- **WHEN** a friend is online
- **THEN** their avatar in the Home screen friends row SHALL display a green status dot

### Requirement: Quick Profile Access
The Home screen friends row SHALL allow the user to navigate directly to a friend's profile by clicking on their avatar or name.

#### Scenario: Navigation to friend profile
- **WHEN** the user clicks on a friend's avatar or name in the Home screen row
- **THEN** the system SHALL navigate to the `/profile/:id` page for that friend
