## 1. Database Seeding

- [ ] 1.1 Create `back/db/seed_social.sql` with mock users and friendship records.
- [ ] 1.2 Execute the seeding script to populate the development database.

## 2. Component Extraction

- [ ] 2.1 Create a new shared component `front/src/components/shared/FriendStatusRow.jsx` based on the logic in `Community.jsx`.
- [ ] 2.2 Update `Community.jsx` to use the new `FriendStatusRow` component to ensure consistency and test functionality.

## 3. Home Screen Integration

- [ ] 3.1 Modify `front/src/pages/home/Home.jsx` to remove the horizontal categories scroll section.
- [ ] 3.2 Update `fetchHomeData` in `Home.jsx` to call `getAmigos` and store the result in a new state variable.
- [ ] 3.3 Import and render `FriendStatusRow` in `Home.jsx` below the search bar.
- [ ] 3.4 Adjust styling/spacing to ensure the new row fits perfectly within the premium design language of the home screen.

## 4. Verification

- [ ] 4.1 Verify that the friends row displays the correct mock data seeded in step 1.
- [ ] 4.2 Confirm that clicking an avatar navigates correctly to the friend's profile.
- [ ] 4.3 Verify that the online status indicator (green dot) is visible and reacts to socket events (if applicable).
