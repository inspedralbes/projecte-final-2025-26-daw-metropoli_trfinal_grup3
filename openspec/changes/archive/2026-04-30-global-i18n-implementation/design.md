## Context

The application already has `react-i18next` configured and several translation files in `front/src/locales/`. However, many components still contain hardcoded strings or do not use the `useTranslation` hook correctly. The `LanguageSwitcher` component in the `Settings` page successfully updates the `i18n` instance, but components that don't hook into this instance fail to re-render.

## Goals / Non-Goals

**Goals:**
- Replace all hardcoded static strings in the frontend with `t()` function calls.
- Ensure all pages re-render automatically when the language is changed.
- Standardize the key structure in `translation.json` files.

**Non-Goals:**
- Translating dynamic content from the database (POIs, User names, Bios, etc.).
- Adding new languages beyond the existing ones (EN, ES, CA, FR).
- Changing the existing i18n configuration or library.

## Decisions

### 1. Use of `useTranslation` Hook
Every component with static text will implement the `useTranslation` hook. This ensures that the component is subscribed to language changes and re-renders when `i18n.changeLanguage()` is called.

### 2. Standardized Key Hierarchy
We will organize `translation.json` using a component-based hierarchy:
- `common`: Generic terms (Save, Cancel, Close).
- `nav`: Sidebar and top bar links.
- `[pageName]`: Page-specific titles and labels (e.g., `profile.editProfile`, `settings.darkMode`).

### 3. Fallback Mechanism
All `t()` calls will include a default value as the second argument (e.g., `t('key', 'Default Text')`) to prevent blank spaces or raw keys from appearing in the UI during development or if a key is missing in a specific locale.

## Risks / Trade-offs

- **[Risk] Missing keys in some locales** → **Mitigation**: Use the fallback parameter in the `t()` function and ensure the English locale is always up to date as the base reference.
- **[Trade-off] Increased code verbosity** → **Mitigation**: The improved maintainability and user experience outweigh the slight increase in JSX complexity.
