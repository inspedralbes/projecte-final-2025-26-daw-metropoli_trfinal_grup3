## ADDED Requirements

### Requirement: Strict User Activity Filtering
The "Recent Activity" section on the Profile page SHALL strictly filter and display only the posts authored by the user whose profile is currently being viewed.

#### Scenario: Viewing own activity
- **WHEN** the logged-in user visits their own profile
- **THEN** the "Recent Activity" section SHALL display only posts where `id_usuario` matches the logged-in user's ID

#### Scenario: Viewing another user's activity
- **WHEN** a user visits another person's profile
- **THEN** the "Recent Activity" section SHALL display only posts where `id_usuario` matches that person's ID, and SHALL NOT include posts from the logged-in user or other third parties
