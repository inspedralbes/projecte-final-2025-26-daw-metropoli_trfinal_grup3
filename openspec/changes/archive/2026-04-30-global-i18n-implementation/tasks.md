## 1. Audit and Preparation

- [x] 1.1 Perform a global search for hardcoded strings in `front/src/pages` and `front/src/components`.
- [x] 1.2 Synchronize `translation.json` files for `es`, `ca`, `en`, and `fr` to ensure they have the same key structure.
- [x] 1.3 Define standard keys for common UI elements (Save, Cancel, Edit).

## 2. Page Implementation

- [x] 2.1 Implement `useTranslation` in `Home.jsx` and its sub-components.
- [x] 2.2 Implement `useTranslation` in Map-related screens and components.
- [x] 2.3 Implement `useTranslation` in Collections/Routes screens.
- [x] 2.4 Implement `useTranslation` in Community/Feed screens.
- [x] 2.5 Implement `useTranslation` in Profile and Edit Profile screens.
- [x] 2.6 Implement `useTranslation` in Settings screen (ensure all headers are translated).
- [x] 2.7 Implement `useTranslation` in Admin dashboard screens.

## 3. Layouts and Navigation

- [x] 3.1 Update `Navbar.jsx` to use translation keys for all navigation links.
- [x] 3.2 Update `Header.jsx` to use dynamic titles based on the current route and language.
- [x] 3.3 Ensure the 'wemap' branding tagline (if static) is internationalized.

## 4. Verification and Polish

- [x] 4.1 Test the language switcher in Settings and verify that all page headers update immediately.
- [x] 4.2 Verify that fallback text is displayed correctly if a key is missing.
- [x] 4.3 Final check to ensure no hardcoded Spanish/Catalan strings remain in the JSX for static elements.
