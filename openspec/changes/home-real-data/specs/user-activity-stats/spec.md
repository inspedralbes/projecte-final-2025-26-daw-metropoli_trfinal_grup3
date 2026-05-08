## ADDED Requirements

### Requirement: Retrieve user activity statistics
The system SHALL provide an endpoint to retrieve activity statistics for a specific user, including places discovered, completed routes, total kilometers walked, and daily activity for the current week.

#### Scenario: User fetches their own stats
- **WHEN** a GET request is made to `/api/usuarios/:id/stats`
- **THEN** the system SHALL return a JSON object with `discovered`, `completedRoutes`, `kmWalked`, and an array of `weeklyActivity`.

### Requirement: Initialize default stats for new users
The system SHALL ensure that every user has a corresponding entry in the statistics tracking system (or returns defaults of zero) when requested.

#### Scenario: New user fetches stats
- **WHEN** a new user without previous activity fetches their stats
- **THEN** the system SHALL return all statistics with values of 0.
