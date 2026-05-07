## ADDED Requirements

### Requirement: Unified Profile Action Bar
The profile page SHALL feature a unified horizontal action bar containing primary user actions.

#### Scenario: User views own profile
- **WHEN** the logged-in user visits their own profile page
- **THEN** they SHALL see an "Edit Profile" pill button and a "Logout" pill button side-by-side in the profile header section

### Requirement: Theme-Responsive Logout Button
The Logout button SHALL use the dynamic primary theme color for its background and appropriate contrast text for visibility.

#### Scenario: Logout button styling
- **WHEN** the user selects a new theme color in Settings
- **THEN** the Logout button on the Profile page SHALL update its background color to match the selected primary theme color
