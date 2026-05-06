## 1. UI Layout Adjustments

- [x] 1.1 Create a flex container for profile action buttons in `Profile.jsx`.
- [x] 1.2 Move Logout button logic from the sidebar/bottom section to the new header container.
- [x] 1.3 Apply pill styling to the Logout button using `bg-primary` and `text-primary-text`.
- [x] 1.4 Standardize the "Edit Profile" button size and padding to align with the new Logout pill.

## 2. Activity Filtering Logic

- [x] 2.1 Audit the `userPosts` filtering logic in `Profile.jsx`.
- [x] 2.2 Ensure `id_usuario` comparison handles type differences safely (e.g., using `Number()`).
- [x] 2.3 Verify that visiting other users' profiles correctly displays their activity and not the logged-in user's.

## 3. Verification & Cleanup

- [x] 3.1 Test Logout functionality from the new button position.
- [x] 3.2 Verify theme color responsiveness of the new Logout button.
- [x] 3.3 Remove old Logout button code from the bottom section of `Profile.jsx`.
