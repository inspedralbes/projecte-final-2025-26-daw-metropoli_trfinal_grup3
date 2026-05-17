## 1. Preparation

- [x] 1.1 Read the `textos_por_traducir.md` file located at the root of the project to understand the scope.
- [x] 1.2 Identify the localization JSON files in the frontend (e.g., `front/src/locales/es.json`, `ca.json`, `en.json`) and prepare to add the missing keys.

## 2. Component Translations (Core App & Chat)

- [x] 2.1 Update `JARVIS/components/ChatWindow.jsx` and `JARVIS/components/Mapis3D.jsx` to use the `useTranslation` hook and add keys for "¡Hola! Soy Mapis", placeholders, and dynamic logs.
- [x] 2.2 Update `components/community/ChatModal.jsx` to translate placeholders ("Escriu un missatge...", "Cerca GIFs...") and the text "Carregant xat...".
- [x] 2.3 Add all new translation keys from this group to the `locales` files.

## 3. Component Translations (Map & Collections)

- [x] 3.1 Update `components/MapLayers.jsx` to translate "Estás aquí".
- [x] 3.2 Update `components/SearchResultsPanel.jsx` to translate states ("Buscant en el mapa...", "No hem trobat res", "Prova amb altres paraules clau", "Explora amb WeMap AI").
- [x] 3.3 Update `components/WeatherCard.jsx` to translate weather descriptions ("Cargando...", "No hay datos disponibles", "WEMAP WEATHER", "AIR", "TRACK", "RAIN", "WIND").
- [x] 3.4 Add all new translation keys from this group to the `locales` files.

## 4. Component Translations (Admin Dashboard)

- [x] 4.1 Update `pages/admin/Admin.jsx` and `components/admin/AdminQRTab.jsx` to use `t()` for all alerts, placeholders ("e.g. Main Grandstand", "e.g. tribuna-sur"), and descriptive text nodes.
- [x] 4.2 Add all new translation keys from this group to the `locales` files.

## 5. View Translations (CircuitScanner, Auth, Collections, Home, Map)

- [x] 5.1 Update `pages/CircuitScanner.jsx` to translate the title and instructions.
- [x] 5.2 Update `pages/auth/Login.jsx` and `pages/auth/SignUp.jsx` (if not fully translated) to fix any missing strings.
- [x] 5.3 Update `pages/collections/Collections.jsx` and `pages/community/Community.jsx` to translate remaining strings, toasts ("Ruta retirada de la Comunitat.", "Error al compartir..."), placeholders ("Nombre de la ruta...", "Añade una descripción..."), and empty states.
- [x] 5.4 Update `pages/home/Home.jsx` to translate placeholders, texts ("Reintentar", "Encara no tens rutes pròpies", "No hi ha rutes públiques recents"), and map states.
- [x] 5.5 Update `pages/map/Map.jsx`, `pages/map/CreateList.jsx`, and `pages/profile/Profile.jsx` to translate toasts ("Només pots compartir les teves pròpies llistes", "La geolocalització no és compatible", "Usuario no encontrado").
- [x] 5.6 Add all new translation keys from this group to the `locales` files.

## 6. Verification

- [x] 6.1 Test the application by toggling the language in the Settings view to verify all translated fields correctly switch languages.
