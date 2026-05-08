## Context

The Home page currently relies on mock data arrays defined within `Home.jsx`. This makes the application non-functional for real-world use cases where users expect to see their personalized collections and the categories available in the database.

## Goals / Non-Goals

**Goals:**
- Fetch categories dynamically from the `/api/categorias` endpoint.
- Fetch user-specific lists (routes) from `/api/listas/usuario/:id`.
- Fetch public/friend lists for the "From your friends" section.
- Ensure the database has at least some initial data for these sections to avoid a "blank" experience on first run.

**Non-Goals:**
- Real-time updates via WebSockets for the Home page (keep it request-based for now).
- Advanced recommendation algorithms for "From your friends" (just fetch public/friend lists).

## Decisions

- **Seeding Implementation**: Instead of just relying on `init.sql`, we will create a dedicated `testRoutes.js` (or similar) endpoint or script that can be called to ensure basic data exists.
- **Frontend Data Management**: Use `useEffect` and `useState` for data fetching. Introduce a `loading` state to handle the transition.
- **Data Transformation**: The backend data might have different field names than the frontend mocks. We will map the backend data to the frontend structure within the components or a dedicated service.

## Risks / Trade-offs

- **[Risk] Empty Database** → [Mitigation] Implement a "Welcome" or "Seed Data" prompt/button, or auto-seed during development.
- **[Risk] Latency** → [Mitigation] Use optimistic UI or skeletons if necessary, although simple loading spinners should suffice for now.
