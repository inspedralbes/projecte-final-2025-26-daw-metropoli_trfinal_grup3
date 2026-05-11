## ADDED Requirements

### Requirement: Carousel items SHALL link to specific routes
The system MUST allow each item in the home carousel to be associated with a unique route ID. When an item is clicked, the application MUST navigate the user to the Map page.

#### Scenario: Navigate to route from carousel
- **WHEN** the user clicks on a featured route image in the home carousel
- **THEN** the browser navigates to `/map?route=<id_lista>`
- **AND** the Map page loads with the specified route focused and open in the details drawer
