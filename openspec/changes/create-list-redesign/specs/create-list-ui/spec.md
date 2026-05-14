## ADDED Requirements

### Requirement: Create list page uses unified design system
The create/edit list page SHALL use the same visual design tokens as the rest of WeMap: `font-display` (Lexend), `bg-primary`/`text-primary` accent colors, and dark slate backgrounds.

#### Scenario: Accent color is reflected in the bottom sheet
- **WHEN** the user has selected a custom accent color in settings
- **THEN** the bottom sheet's active states, buttons, and highlights use that accent color

#### Scenario: Typography is legible on mobile
- **WHEN** the bottom sheet is open on a 375px wide viewport
- **THEN** all text in inputs, labels and buttons is at least 12px and readable without zooming

### Requirement: Bottom sheet titles have no italic or uppercase styling
The bottom sheet panel header and section labels SHALL use standard casing (sentence case) and no italic styling.

#### Scenario: Header text displays correctly
- **WHEN** the bottom sheet is open in "New list" mode
- **THEN** the header reads "Nueva lista" without italic or uppercase formatting

### Requirement: All static strings use i18n translations
Every user-facing static string in `CreateList.jsx` SHALL be wrapped in a `t()` call using the `createList` translation namespace.

#### Scenario: Visibility buttons show translated labels
- **WHEN** the user views the visibility selector
- **THEN** options show translated text ("Público", "Privado", "Amigos") not raw values ("public", "private", "friends")

#### Scenario: Description textarea has translated placeholder
- **WHEN** the user focuses the description textarea
- **THEN** the placeholder text appears in the active app language
