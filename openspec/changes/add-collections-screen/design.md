## Context

The user wants a new "Collections" (or "Rutes") screen to show a static list of created routes as cards with a specific design matching a given reference image. The reference design features a search bar, a localized header ("Rutes"), and rectangular cards with a non-functional edit (pencil) button. The main navigation bar must also be updated to link to this new screen instead of the user profile, while keeping the user profile accessible via other means.

## Goals / Non-Goals

**Goals:**
- Implement a new responsive `/colections` screen in the React frontend.
- Implement a functional local search filter over static data.
- Ensure styling matches the reference image closely (wider rectangular cards, dark mode support).
- Update the main navigation bar to point to the new screen instead of `/profile`.
- Localize the "Rutes" header using the app's existing i18n system.

**Non-Goals:**
- Connecting to a backend API for collections (static data only for now).
- Making the pencil edit button functional.
- Deleting the `/profile` screen.

## Decisions

- **Static Data Location:** We will define a constant array of objects within the `Collections` component (or a dedicated mock data file) to hold the static route data.
- **Styling Strategy:** Use Tailwind CSS (or the project's existing CSS framework) to build the custom card layouts, ensuring they are wider than they are tall and support dark mode toggling.
- **Navigation Update:** Modify the main `Navbar` (or equivalent layout component) to replace the profile icon button with a collections button that routes to `/colections`.
- **Search Implementation:** Use React state (`useState`) to store the search query and filter the static array before rendering the list of route cards.

## Risks / Trade-offs

- **Risk: Design Mismatch**
  - The provided image might have specific subtleties not easily captured by standard classes.
  - *Mitigation*: We will use custom CSS classes if necessary to ensure the cards and overall layout meet the premium aesthetic expected by the user.
