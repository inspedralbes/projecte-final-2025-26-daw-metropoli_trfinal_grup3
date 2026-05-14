## Context

The branding header (`Header.jsx`) is currently implemented with `absolute top-0`. While this works on desktop (where a sidebar pushes the content) or on the Map view (where it floats over the map), it creates overlaps on mobile "content" pages like Home, Community, and Collections. These pages often start their content at the very top of the viewport.

## Goals / Non-Goals

**Goals:**
- Fix the header overlap on mobile devices for all content-heavy views.
- Maintain the "floating" aesthetic on the Map view and Desktop view.
- Provide a consistent top-spacing system for mobile views.

**Non-Goals:**
- Redesigning the Header or Navbar components.
- Changing desktop navigation behavior.

## Decisions

### 1. Make Header `sticky` or `relative` on Mobile (Conditional)
- **Decision**: In `Header.jsx`, we will change the positioning from `absolute` to `relative` (or `sticky`) when NOT on the Map route (`/` or `/map`) on mobile devices.
- **Rationale**: This allows the header to occupy space in the document flow, naturally pushing content down without needing hardcoded padding on every single page.
- **Alternative**: Adding `pt-24` to all mobile content wrappers. This was rejected because it's less flexible and harder to sync with header height changes.

### 2. Standardize `safe-container` Spacing
- **Decision**: Update `.safe-container` in `index.css` to handle mobile padding more explicitly if needed, or rely on the Header's flow.
- **Rationale**: Ensures that even if the header is removed or changed, the content has a base padding.

### 3. Route-based Positioning in Header
- **Decision**: The `Header` component will detect if it's on the Map view. If so, it remains `absolute` to float over the map. Otherwise, it uses `relative` on mobile.

## Risks / Trade-offs

- **[Risk] Visual inconsistency across pages** → **Mitigation**: Test the change on Home, Community, and Collections to ensure they all respond identically.
- **[Risk] Breaking Map overlay** → **Mitigation**: Use a conditional check `pathname === '/' || pathname === '/map'` to keep the absolute positioning for the map.
