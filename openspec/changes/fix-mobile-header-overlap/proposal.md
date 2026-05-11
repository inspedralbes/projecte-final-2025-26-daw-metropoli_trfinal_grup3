## Why

Mobile views currently suffer from header overlap where the logo, page title, and user avatar (rendered via the `Header` component) cover the top part of the main content. This occurs because the `Header` is absolute-positioned and the content containers do not account for its height on mobile devices, leading to a poor user experience and hidden information.

## What Changes

- **Responsive Header Layout**: Modify the `Header` component to either use `relative` positioning on mobile or ensure a consistent height that can be accounted for.
- **Content Padding Refinement**: Update the global `safe-container` or individual page wrappers to include appropriate top padding (`pt-20` or similar) only on mobile screens to prevent overlap.
- **Consistency Check**: Verify and fix overlap issues across primary views: Home, Community, Collections, Profile, and Settings.

## Capabilities

### New Capabilities
- `mobile-header-spacing`: Ensures that all main views on mobile devices provide enough vertical space for the header without overlapping content.

### Modified Capabilities
<!-- No requirement changes to existing specs as none are defined. -->

## Impact

- `front/src/layouts/Header.jsx`: Change positioning logic for mobile.
- `front/src/index.css`: Potential update to `.safe-container` or new utility classes for mobile header spacing.
- `front/src/pages/`: Updates to page wrappers in `Home.jsx`, `Community.jsx`, `Collections.jsx`, etc.
