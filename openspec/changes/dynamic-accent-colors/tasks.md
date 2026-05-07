## 1. Global Component Refactoring

- [x] 1.1 Update `Navbar.jsx` to use `text-primary` for active icons and hover states instead of hardcoded `white`.
- [x] 1.2 Audit `Header.jsx` to ensure titles and navigation elements use the `primary` accent where appropriate.
- [x] 1.3 Update `UserAvatar.jsx` default `borderColor` to use a subtler dynamic border or ensure it's easily overridable with `border-primary`.

## 2. Page-Specific Theme Integration

- [x] 2.1 Refactor `Collections.jsx`: Replace `dark:bg-white` in active pills and edit buttons with `bg-primary` and `text-primary-text`.
- [x] 2.2 Refactor `Community.jsx`: Update filter pills and active state indicators to use `bg-primary` and `text-primary-text`.
- [x] 2.3 Refactor `Login.jsx` and `SignUp.jsx`: Update accent borders, focus states, and primary action buttons to use the theme's `primary` color.
- [x] 2.4 Update `Settings.jsx` toggles and active state selections to ensure they are consistent with the rest of the application's theme usage.

## 3. Map Component Theme Integration

- [x] 3.1 Update `Map.jsx` and `CreateList.jsx`: Ensure floating action buttons, active markers, and path polylines use the `primary` accent color dynamically.
- [x] 3.2 Audit `Admin.jsx`: Update drawing mode indicators and network node selections to follow the accent theme.

## 4. Verification and Polish

- [x] 4.1 Verify that choosing Red, Green, Blue, and Pink in Settings correctly updates all identified elements.
- [x] 4.2 Ensure that `primary-text` accessibility is maintained across all themes (e.g., Pink should have white text).
