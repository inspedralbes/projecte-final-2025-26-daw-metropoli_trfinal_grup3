## Context

`CreateList.jsx` is the page for creating and editing user route lists. It currently uses hardcoded pink colors, tiny text sizes (8-10px), uppercase/italic labels, and many static strings not wired to i18n. The rest of the app uses Lexend (`font-display`), `bg-primary` CSS variable tokens, and a clean dark slate theme.

## Goals / Non-Goals

**Goals:**
- Align `CreateList.jsx` visually with the global WeMap design system.
- Scale up bottom sheet content (inputs, buttons, list items) to comfortable sizes.
- Replace all hardcoded `pink-*` color classes with `bg-primary` / `text-primary` tokens.
- Remove italic and uppercase from titles and labels.
- Wire all static strings through `useTranslation()` and add missing keys to locale files.

**Non-Goals:**
- Changing any API calls or backend logic.
- Redesigning the map layer or floating action buttons style beyond color tokens.
- Adding new features to the list creation flow.

## Decisions

**1. Token-based colors over hardcoded pink**
Use `bg-primary`, `text-primary`, `border-primary` everywhere pink was used. This ensures the page automatically reacts to the accent color setting in `/settings`, consistent with the rest of the app.

**2. Scale typography from 8-10px to 12-14px minimum**
Current text sizes are unreadable on mobile. Inputs will use `text-sm`, labels `text-xs`, and buttons `text-sm font-bold`.

**3. Titles without italic or uppercase**
All `h3`, `h4` headings will drop `italic` and `uppercase` Tailwind classes, keeping only `font-bold` and `font-display`.

**4. i18n via existing `createList` namespace**
Existing keys (`createList.namePlaceholder`, `createList.save`, etc.) already exist. Missing keys will be added to all three locale files (`es`, `ca`, `en`) for: description placeholder, visibility options, add cover, edit route, use as template, points label, and error messages.

## Risks / Trade-offs

- [Risk] Changing text sizes may slightly shift layout of the bottom sheet → Mitigation: test on mobile viewport (375px width).
- [Risk] `bg-primary` token only works when CSS variable is set → Mitigation: already guaranteed by `App.jsx` initialization on mount.
