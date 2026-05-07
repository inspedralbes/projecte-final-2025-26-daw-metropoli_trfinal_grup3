## ADDED Requirements

### Requirement: New Logo Component
The application SHALL use a new unified logo component consisting of a "location_on" Material Icon and the "wemap" text.

#### Scenario: Logo rendering in Navbar
- **WHEN** the desktop Navbar is rendered
- **THEN** it displays the new icon-based wemap logo instead of the legacy catcircuit PNG.

### Requirement: Brand Consistency
The system SHALL hide or replace all occurrences of the "Metropolis Cat Circuit" branding in the web interface.

#### Scenario: Logo visibility on web
- **WHEN** the user accesses the web version of the application
- **THEN** no "catcircuit" logos are visible in the layout.
