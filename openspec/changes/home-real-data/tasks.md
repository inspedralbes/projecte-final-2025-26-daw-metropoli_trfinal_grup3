## 1. Backend: Data Seeding and Stats API

- [x] 1.1 Ensure `categoria` table has initial entries (Bares, Cafès, etc.) in `init.sql` or via a new script.
- [x] 1.2 Implement `GET /api/usuarios/:id/stats` endpoint in `usuarioController.js`.
- [x] 1.3 Add basic seeding for public lists in `listas` table so the home page isn't empty.

## 2. Frontend: Home Page Integration

- [x] 2.1 Update `Home.jsx` to import and use `communicationManager` or `fetch` for API calls.
- [x] 2.2 Replace hardcoded `categories` with dynamic data from `/api/categorias`.
- [x] 2.3 Implement fetching of user lists for the \"Les teves rutes\" section.
- [x] 2.4 Implement fetching of public lists for the \"Dels teus amics\" section.
- [x] 2.5 Connect `userStats` and `weeklyActivity` to the new stats endpoint.
- [x] 2.6 Add loading states and error handling for all data fetching on Home.
