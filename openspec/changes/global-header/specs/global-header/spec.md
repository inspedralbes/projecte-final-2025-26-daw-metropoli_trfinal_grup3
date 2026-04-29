## ADDED Requirements

### Requirement: Global Header Navigation
The system SHALL display a common header across main application screens with a dynamic title and user profile access.

#### Scenario: User visits the Home page
- **WHEN** user navigates to `/home`
- **THEN** the header displays the text "WeMap" on the top left and the user profile icon on the top right

#### Scenario: User visits the Map page
- **WHEN** user navigates to `/`
- **THEN** the header displays the text "WeMap" in black text and the user profile icon

#### Scenario: User visits the Community page
- **WHEN** user navigates to `/community`
- **THEN** the header displays the translated text for "Comunitat" and the user profile icon

#### Scenario: User visits the Collections page
- **WHEN** user navigates to `/colections`
- **THEN** the header displays the translated text for "Rutas" and the user profile icon

### Requirement: User Profile Navigation
The global header SHALL provide a mechanism to navigate directly to the user's profile.

#### Scenario: User clicks the profile avatar
- **WHEN** the user clicks the avatar image in the top right of the header
- **THEN** the system navigates the user to the `/profile` page
