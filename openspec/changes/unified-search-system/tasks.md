## 1. Backend Implementation

- [x] 1.1 Create `searchModel.js` with queries for `usuario`, `listas`, and `pois`.
- [x] 1.2 Implement `searchService.js` to aggregate results from the model.
- [x] 1.3 Create `searchController.js` to handle search requests and category filtering.
- [x] 1.4 Register the `/api/search` route in `routes/index.js`.

## 2. Frontend Infrastructure

- [x] 2.1 Add `unifiedSearch` function to `communicationManager.js`.
- [x] 2.2 Create `SearchResultsPanel.jsx` component with Lexend font and premium dark/light styles.

## 3. UI Integration

- [x] 3.1 Update `Home.jsx` to manage search state (query, results, loading).
- [x] 3.2 Implement debounced search logic in `Home.jsx`.
- [x] 3.3 Connect category chips to the search state.
- [x] 3.4 Integrate `SearchResultsPanel` as an overlay below the search bar.

## 4. Testing & Polishing

- [ ] 4.1 Verify search results for each entity type (User, List, POI).
- [ ] 4.2 Verify category filtering behavior.
- [ ] 4.3 Ensure responsive design and smooth transitions for the results panel.
