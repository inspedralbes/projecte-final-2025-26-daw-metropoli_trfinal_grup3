## Context

The application currently has multiple main screens (Home, Map, Community, Collections), and each one defines its own header with varying logic and layouts. The user wants to unify this by creating a global header component. This component needs to dynamically render titles based on the active route and provide consistent access to the user profile. 

## Goals / Non-Goals

**Goals:**
- Implement a reusable `Header` component in `front/src/layouts/Header.jsx`.
- The header must use `font-display` and have minimal margin.
- Display "WeMap", "Comunitat", or "Rutas" based on the current `pathname`.
- Display "WeMap" in black specifically on the Map (`/`) route.
- Show the user's avatar linking to `/profile` on the top right.
- Clean up existing pages by removing their inline headers and integrating the new global header.

**Non-Goals:**
- Implementing the multi-color styling for "WeMap" immediately (this is deferred for later, as requested).
- Making the header global at the `App.jsx` level if it breaks layout structure; it can be included inside each page component to maintain control over spacing and absolute positioning constraints.

## Decisions

- **Component Location:** Create `Header.jsx` inside `front/src/layouts` since it acts as a layout element similar to `Navbar`.
- **Dynamic Routing:** Use `useLocation` from `react-router-dom` to determine the current `pathname` and conditionally render the appropriate title.
- **Title Rendering Logic:** 
  - `pathname === "/home"` -> "WeMap"
  - `pathname === "/"` -> "WeMap" (add a text-black class specifically here or rely on the container).
  - `pathname.startsWith("/community")` -> use `t('nav.community')` or `t('community.communityFeed')`.
  - `pathname.startsWith("/colections")` -> use `t('collections.title')`.
- **Avatar Logic:** Reuse the `localStorage.getItem("usuario")` and `getAvatarUrl` functions existing in `Home.jsx` to fetch and display the user avatar.

## Risks / Trade-offs

- **Risk: Layout Shifts**
  - Replacing existing absolute/fixed headers with a generic one might cause unintended padding or margin issues in some screens.
  - *Mitigation*: Ensure the new `Header` uses similar absolute/fixed positioning or relative flow with consistent padding (`pt-safe`, `px-4`, etc.) and adapt the wrapper `div` of each page accordingly.
