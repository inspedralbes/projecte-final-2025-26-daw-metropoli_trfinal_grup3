## Why

The application currently has partial support for multiple languages, but many static titles, headers, and labels across various screens remain hardcoded or do not react correctly to language changes. This creates an inconsistent user experience for non-Spanish/Catalan speakers. This change ensures that the entire UI brand and navigation elements are fully internationalized.

## What Changes

- **Global Text Audit**: Identification of all hardcoded strings in the UI that should be translated.
- **Translation Keys Standardization**: Creation of a consistent naming convention for translation keys across the app.
- **Dynamic Language Switching**: Ensuring that all components use the `useTranslation` hook and correctly re-render when the language is changed in the Settings panel.
- **Static Content Internationalization**: Specifically focusing on page titles, section headers, button labels, and navigation items.
- **Database Data Exclusion**: Real data from the database (POI names, user bios, etc.) will remain in their original language as per user requirements.

## Capabilities

### New Capabilities
- `global-ui-internationalization`: Comprehensive implementation of i18next across all frontend screens and components to support real-time language switching for all static UI elements.

### Modified Capabilities
<!-- No existing capabilities to modify -->

## Impact

- **Frontend Pages**: All `.jsx` files in `front/src/pages/` and `front/src/components/`.
- **Translation Files**: Updates to `front/src/locales/{en,es,ca,fr}/translation.json`.
- **Layouts**: `Navbar.jsx`, `Header.jsx`, and other layout components.
