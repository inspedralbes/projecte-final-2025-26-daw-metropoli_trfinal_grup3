## ADDED Requirements

### Requirement: Shared Bottom Drawer Styling
The bottom drawer in `Map.jsx` MUST use the same visual design tokens as the one in `CreateList.jsx`. This includes:
- Background: `bg-white/95 dark:bg-[#0a0a0a]/95` with `backdrop-blur-lg`.
- Border: `border-t border-white/10`.
- Corners: `rounded-t-[2rem]`.
- Shadows: `shadow-[0_-20px_60px_rgba(0,0,0,0.3)]`.

#### Scenario: Visual inspection of the drawer
- **WHEN** the user selects a route to view its details on mobile
- **THEN** the drawer appears with a white/dark glassmorphism effect and rounded top corners consistent with the creation view

### Requirement: Correct Z-Index for Navigation Visibility
The bottom drawer MUST have a higher z-index than the bottom navigation bar (`9999`) to ensure it is fully visible and not partially obscured.

#### Scenario: Drawer interaction on mobile
- **WHEN** the bottom drawer is expanded
- **THEN** it sits on top of the bottom navigation bar, making all drawer actions (Close, Start Route) accessible

### Requirement: Consistent Header and Actions
The drawer header MUST include a drag handle (visual indicator), a title, and a standardized close button consistent with `CreateList.jsx`.

#### Scenario: Closing the drawer
- **WHEN** the user clicks the standardized close button in the top right of the drawer
- **THEN** the drawer closes with a slide-down animation
