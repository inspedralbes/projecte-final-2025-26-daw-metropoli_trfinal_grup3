## Why

The application recently introduced a dynamic accent color feature in the Settings panel, allowing users to choose colors like Red, Green, Blue, or Pink. However, many UI elements (especially in dark mode) are currently hardcoded to use white as their primary highlight color. To provide a fully immersive and customizable experience, these elements should react to the user-selected accent color.

## What Changes

- Refactor global components (Navbar, Header) to use the `primary` color variable instead of hardcoded white for active states and highlights.
- Update page-specific components (Community, Collections, Map) to replace static white accents with dynamic `primary` color utilities.
- Ensure that elements like active navigation icons, filter pills, and action buttons follow the selected theme.
- Maintain accessibility by ensuring `primary-text` (which adapts to the background) is used where appropriate.

## Capabilities

### New Capabilities
- `dynamic-theme-integration`: System-wide integration of the CSS-variable-based theme into all interactive and highlight components.

### Modified Capabilities
- `settings-accent-colors`: Expanding the scope of the existing accent color selection to affect more UI areas.

## Impact

- **CSS**: `index.css` theme variables will be the source of truth.
- **Components**: Multiple React components will switch from static Tailwind classes (e.g., `dark:text-white`) to dynamic ones (e.g., `text-primary`).
- **Aesthetics**: The app will feel much more polished and responsive to user preferences.
