## 1. State Management Setup

- [x] 1.1 Create `SearchContext.jsx` in `front/src/context/` (or update an existing context) to provide `searchQuery` and `setSearchQuery` state globally.
- [x] 1.2 Wrap the application tree (e.g., in `App.jsx` or `main.jsx`) with `SearchProvider` so that both Header and pages can access the state.

## 2. Global Header Search Bar Implementation

- [x] 2.1 Update `front/src/layouts/Header.jsx` to consume `searchQuery` and `setSearchQuery` from `SearchContext`.
- [x] 2.2 Add `useLocation` hook in `Header.jsx` to detect if the current path is `/`, `/community`, or `/collections`.
- [x] 2.3 Render a search input field in `Header.jsx` (between title and profile) that is only visible on desktop (`hidden md:flex` or similar) and only on the supported routes.
- [x] 2.4 Add an effect in `Header.jsx` to clear `searchQuery` (`setSearchQuery('')`) when the route changes.

## 3. View Refactoring & Desktop Search Removal

- [x] 3.1 Refactor `front/src/pages/home/Home.jsx` to use `searchQuery` from `SearchContext` instead of local state. Ocultar su barra de búsqueda local en desktop (`md:hidden`).
- [x] 3.2 Refactor `front/src/pages/community/Community.jsx` to use `searchQuery` from `SearchContext` instead of local state. Ocultar su barra de búsqueda local en desktop (`md:hidden`).
- [x] 3.3 Refactor `front/src/pages/collections/Collections.jsx` to use `searchQuery` from `SearchContext` instead of local state. Ocultar su barra de búsqueda local en desktop (`md:hidden`).

## 4. Layout Adjustments

- [x] 4.1 Adjust padding or margin in the main layout container (e.g., in `App.jsx` or within the pages) to ensure that the content does not overlap with the new `Header` on desktop screens.
