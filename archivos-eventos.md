# Archivos relacionados con la pantalla de Eventos

## Backend - Archivos completos a eliminar

### Controladores
- `back/src/controllers/eventoController.js` - Controlador principal de eventos (CRUD)
- `back/src/controllers/eventoController.js` - File to delete

### Servicios
- `back/src/services/eventoService.js` - Lógica de negocio para eventos
- `back/src/services/eventoService.js` - File to delete

### Modelos
- `back/src/models/eventoModel.js` - Modelo de datos de eventos
- `back/src/models/eventoModel.js` - File to delete

### Rutas
- `back/src/routes/eventoRoutes.js` - Definición de rutas API para eventos
- `back/src/routes/eventoRoutes.js` - File to delete
- `back/src/routes/index.js` - IMPORT to remove: `import eventoRoutes` and `router.use("/eventos", eventoRoutes)`

---

## Frontend - Archivos a modificar

### Páginas a modificar
- `front/src/pages/events/Events.jsx` - File to delete (entire screen)
- `front/src/pages/admin/Admin.jsx` - Remove:
  - Import `getEventos, createEvento, updateEvento`
  - State: `eventNombre, eventDescripcion, eventFoto, eventFotoFile, eventFechaInicio, eventFechaFin, eventEstado, savedEvents, editingEventId`
  - Functions: `fetchEvents, handleEditEvent, handleDeleteEvent, handleSaveEvent, resetEventForm`
  - UI sections: Event creation form, Event list

- `front/src/pages/home/Home.jsx` - Remove:
  - Import `getNextEvento` (line 6)
  - State: `raceDate, eventName, eventFoto` (lines 38-40)
  - useEffect calling `getNextEvento` (lines 72-85)
  - Countdown timer logic related to raceDate
  - Hero Card showing event info (lines 199-258) - shows next event countdown
  - "View Schedule" button linking to `/events` (lines 250-256)
  - Quick Links sidebar with `/events` link (lines 543-546)

### Servicios a modificar
- `front/src/services/communicationManager.js` - Remove functions:
  - `getEventos()` (line 188)
  - `getNextEvento()` (line 199)
  - `createEvento()` (line 210)
  - `updateEvento()` (line 225)

### Traducciones a modificar
- `front/src/locales/es/translation.json` - Remove `events` key and related translations
- `front/src/locales/ca/translation.json` - Remove `events` key and related translations
- `front/src/locales/en/translation.json` - Remove `events` key and related translations
- `front/src/locales/fr/translation.json` - Remove `events` key and related translations

---

## Base de datos - SQL a modificar

### create.sql - Tablas a eliminar
- `eventos` table (lines 28-36)
- `evento_poi_config` table (lines 75-82)
- `poi_horarios` table (lines 85-94) - depends on both events and pois

### init.sql - Datos iniciales a eliminar
- Event data inserts (lines 13-58)

---

## Rutas API a eliminar
- `/api/eventos` - registered in `back/src/routes/index.js`
- `/api/eventos/proximo` - next event endpoint
