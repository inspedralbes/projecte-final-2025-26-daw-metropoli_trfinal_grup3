## 1. Color & Theme Tokens

- [x] 1.1 Replace all `pink-500`, `pink-600`, `pink-400` color classes in `CreateList.jsx` with `primary` tokens (`bg-primary`, `text-primary`, `border-primary`).
- [x] 1.2 Update the floating action button for "add poi at location" to use `bg-primary` instead of hardcoded pink.
- [x] 1.3 Update the visibility selector active state to use `bg-primary border-primary` instead of `bg-pink-500 border-pink-500`.
- [x] 1.4 Update the `focusedListId` inspect button to use `bg-primary` instead of hardcoded `bg-indigo-500` / `bg-pink-600`.

## 2. Typography & Spacing

- [x] 2.1 Remove `italic` and `uppercase` classes from the bottom sheet header `h3` and section `h4` labels.
- [x] 2.2 Increase input `text-[11px]` to `text-sm` and textarea `text-[10px]` to `text-sm`.
- [x] 2.3 Increase POI list item name span from `text-[10px]` to `text-sm`.
- [x] 2.4 Increase save/edit button text from `text-[9px]` to `text-sm`.
- [x] 2.5 Ensure `font-display` class is present on the bottom sheet wrapper div.

## 3. Internationalization

- [x] 3.1 Add `t()` call for description textarea placeholder (`createList.descPlaceholder`).
- [x] 3.2 Add `t()` call for the "Añadir Portada" cover image label (`createList.addCover`).
- [x] 3.3 Add translated labels for visibility options: replace raw `v` value with `t('createList.visibility.' + v)`.
- [x] 3.4 Add `t()` call for "Puntos" section label (`createList.points`).
- [x] 3.5 Add `t()` calls for "Editar Ruta" and "Usar como plantilla" buttons (`createList.editRoute`, `createList.useAsTemplate`).
- [x] 3.6 Add `t()` call for "Guardar Cambios" button label (`createList.saveChanges`).
- [x] 3.7 Add all new translation keys to `front/src/locales/es.json`, `ca.json`, and `en.json`.
