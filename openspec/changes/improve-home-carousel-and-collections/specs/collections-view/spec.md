## MODIFIED Requirements

### Requirement: Simplified collections filtering
The collections view SHALL deprecate category-based filtering in favor of visibility-based filtering to streamline route management.

#### Scenario: Switching from public to private
- **WHEN** the user is viewing public routes and clicks "Private"
- **THEN** the view MUST refresh immediately to show only the user's private routes
- **AND** the category filters MUST be hidden or removed
