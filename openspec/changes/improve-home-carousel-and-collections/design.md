## Context

The current home carousel in `Home.jsx` displays high-quality images of featured routes but lacks interactivity. The `Collections.jsx` page currently filters by categories (e.g., "Culture", "Nature"), which is less useful for users who want to quickly manage their own private routes versus seeing community ones.

## Goals / Non-Goals

**Goals:**
- Make home carousel items clickable, navigating to the map with the specific route active.
- Replace category filters in Collections with Public/Private visibility pills.
- Ensure consistent styling using existing UI components (Lexend font, premium pills).

**Non-Goals:**
- Modifying the backend database schema (using existing visibility fields).
- Changing the layout of the route cards themselves.

## Decisions

### 1. Carousel Navigation via Query Parameters
**Decision:** Pass the `routeId` as a query parameter (`?route=<id>`) to the Map page.
**Rationale:** The Map page already has logic to handle specific route focuses. This decouples the carousel from the map's internal state management and allows for direct link sharing.
**Alternatives:** 
- Global state (Redux/Context): Overkill for simple navigation and breaks direct URL access.

### 2. Visibility Filter Implementation in Collections
**Decision:** Implement a toggle state for "Public" and "Private" filters.
**Rationale:** This matches user mental models for managing collections better than arbitrary categories. We will filter the `userLists` array based on the `visibilidad` property (0 for private, 1 for public).
**Alternatives:**
- Keeping categories and adding visibility: Too much clutter on mobile.

## Risks / Trade-offs

- **Risk**: Carousel data may not always have a valid `id_lista`.
- **Mitigation**: Add a check to only make items clickable if an ID is present, or default to general map view.
- **Risk**: Filter overlap on small screens.
- **Mitigation**: Use the existing pill component which supports horizontal scrolling if necessary.
