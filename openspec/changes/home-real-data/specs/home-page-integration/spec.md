## ADDED Requirements

### Requirement: Dynamic home page categories
The Home page SHALL fetch the list of categories from the backend and display them in the horizontal scroll section.

#### Scenario: Home page loads categories
- **WHEN** the Home page is mounted
- **THEN** it SHALL call `GET /api/categorias` and update the category buttons with the returned data.

### Requirement: Display user collections on home
The Home page SHALL fetch the current user's lists and display them in the "Your routes" section.

#### Scenario: User has personal lists
- **WHEN** the Home page loads for a logged-in user with lists
- **THEN** it SHALL call `GET /api/listas/usuario/:id` and display those lists in the carousel.

### Requirement: Display community/friends collections
The Home page SHALL display a selection of public or friends' lists in the "From your friends" section.

#### Scenario: Home page loads community lists
- **WHEN** the Home page is mounted
- **THEN** it SHALL call `GET /api/listas/publicas` and display a subset of these lists in the friends' collections section.
