## Why

Currently, there are approximately 80-90 hardcoded strings across various React components (Admin, Chat, Authentication, Map, Home, Community, etc.) that do not use the `i18next` translation function (`t()`). This prevents the application from fully localizing when a user changes the language in the Settings view. By refactoring these strings to use the `useTranslation` hook, we ensure a consistent, multi-language user experience.

## What Changes

- Refactor hardcoded strings in JSX text nodes (`>text<`), attributes like `placeholder`, and function calls like `alert()` or `setToast()` across the frontend codebase.
- Wrap these strings using the `t()` function from `react-i18next`.
- Add the corresponding key-value pairs to the language JSON files (e.g., `ca.json`, `es.json`, `en.json`) if they don't already exist.

## Capabilities

### New Capabilities
- `i18n-static-strings`: Comprehensive translation of static frontend strings, alerts, and placeholders.

### Modified Capabilities
- `<existing-name>`: N/A

## Impact

- **Affected Code**: Multiple `.jsx` components inside `front/src/pages/` and `front/src/components/`.
- **Localization Files**: `front/src/locales/*/translation.json` (or similar depending on the exact i18n setup).
- **Functionality**: No behavioral changes; purely presentational (internationalization).
