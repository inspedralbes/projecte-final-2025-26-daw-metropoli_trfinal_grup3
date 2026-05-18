## ADDED Requirements

### Requirement: Translate Static Strings in UI Components
The system SHALL ensure that all identified static strings (text nodes, placeholders, alerts, toasts) listed in `textos_por_traducir.md` are wrapped with the `t()` function from `react-i18next`. The corresponding keys MUST be added to the localization JSON files.

#### Scenario: User changes language in application settings
- **WHEN** the user switches the active language (e.g., from Catalan to Spanish)
- **THEN** all UI text, including placeholders and dynamic toasts/alerts previously hardcoded, immediately update to reflect the newly selected language without requiring a page reload.

#### Scenario: New string keys are added to locale files
- **WHEN** the translation function `t('some.key')` is invoked in a component
- **THEN** it successfully resolves to the translated text present in the active language's JSON locale file, instead of rendering the raw key.
