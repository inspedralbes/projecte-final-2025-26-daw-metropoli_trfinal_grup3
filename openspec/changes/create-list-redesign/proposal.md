## Why

The `/create-list` page uses inconsistent styling (pink accents, tiny typography, uppercase/italic text) that clashes with the rest of the WeMap app. The bottom sheet panel is the right height but its internal content is too small to read or interact with comfortably. Static strings are also not wired to the i18n system.

## What Changes

- Restyle `CreateList.jsx` to match the global app design system: dark slate backgrounds, Lexend font via `font-display`, `bg-primary` accent color replacing hardcoded pink, and no italic/uppercase in titles.
- Scale up all bottom sheet internal elements (inputs, labels, buttons, POI list items) for comfortable reading and touch targets.
- Remove hardcoded pink color references and replace with `bg-primary` / `text-primary` CSS variable tokens.
- Wrap all static user-facing strings in `t()` calls and add missing translation keys to all locale files (`es`, `ca`, `en`).
- Ensure visibility selector labels (`public`, `private`, `friends`) display translated text.

## Capabilities

### New Capabilities
- `create-list-ui`: Unified visual design for the create/edit list page matching the WeMap design system.

### Modified Capabilities
*(none — no spec-level behavior changes, only UI and i18n)*

## Impact

- **Files**: `front/src/pages/map/CreateList.jsx`
- **Locales**: `front/src/locales/es.json`, `ca.json`, `en.json`
- **No API changes**, no new dependencies.
