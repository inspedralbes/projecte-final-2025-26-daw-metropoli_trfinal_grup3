## Context

The WeMap home screen currently prioritizes content categories (bars, culture, etc.) via a horizontal scroll bar. However, user feedback suggests a preference for social features. The Community screen already has a working "Friends Online" mechanism. This design focuses on porting that social row to the Home screen and ensuring the backend has enough data to make the feature meaningful.

## Goals / Non-Goals

**Goals:**
- Replace the categories scroll with a "Friends Online" row on the Home screen.
- Ensure the Home screen friends list matches the aesthetic and functionality of the Community screen.
- Provide a robust set of seed data for testing social interactions.

**Non-Goals:**
- Modifying the search logic (only its visual environment).
- Implementing new real-time status tracking beyond what is already available in the Community screen.
- Changing the underlying database schema.

## Decisions

- **Shared Component Extraction**: Instead of duplicating code from `Community.jsx`, we will create a reusable `FriendStatusRow.jsx` component in `src/components/shared/`. This ensures visual consistency and easier maintenance.
- **Data Fetching**: The `Home.jsx` already has a `useEffect` for data. We will add a call to `getAmigos(user.id_usuario)` to populate this new row.
- **Backend Seeding**: We will create a new SQL seeding script `back/db/seed_social.sql` to populate the `usuarios` and `amigos` tables. This script will include a variety of mock users with avatars and established friendship links.
- **UI Layout**: The search bar will remain the top priority, followed immediately by the new Friends row. The "Nearby Destinations" section will follow below.

## Risks / Trade-offs

- **[Risk] Screen Clutter** → **[Mitigation]** Use the same compact avatar-plus-name styling as the community screen to keep the vertical footprint small.
- **[Trade-off] Loading State** → We will show a skeleton or a subtle "Loading friends..." message to prevent layout shifts.
