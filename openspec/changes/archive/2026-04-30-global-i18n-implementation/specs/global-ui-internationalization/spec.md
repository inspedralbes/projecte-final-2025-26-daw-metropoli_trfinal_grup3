## ADDED Requirements

### Requirement: Static Text Translation
The system SHALL use the `useTranslation` hook from `react-i18next` to translate all static UI elements, including page titles, section headers, button labels, and navigation items.

#### Scenario: Translating the Settings Page Header
- **WHEN** the user is on the Settings page and the current language is set to Spanish
- **THEN** the header SHALL display "Ajustes"
- **WHEN** the user changes the language to English
- **THEN** the header SHALL display "Settings"

### Requirement: Real-time Language Switching
The system SHALL re-render all UI components immediately upon a change in the `i18n.language` property via `i18n.changeLanguage()`, ensuring the UI reflects the new language without requiring a full page refresh.

#### Scenario: Language change in Settings panel
- **WHEN** the user clicks a language button in the LanguageSwitcher component
- **THEN** the `i18n.changeLanguage` method is called with the selected language code
- **AND** all visible static text elements on the screen update to the new language immediately

### Requirement: Coverage of All Core Screens
The system SHALL ensure that all primary screens (`Home`, `Map`, `Collections`, `Community`, `Profile`, and `Settings`) are audited and updated so that all static text is retrieved via translation keys.

#### Scenario: Home Screen Title Internationalization
- **WHEN** the Home screen is rendered
- **THEN** the title and section headers SHALL be fetched using the `t()` function
- **AND** no hardcoded strings SHALL exist for these elements in the JSX code
