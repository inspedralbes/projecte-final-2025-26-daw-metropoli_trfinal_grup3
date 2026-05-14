## Why

The current profile page layout separates the "Edit Profile" and "Logout" actions, creating a fragmented user experience. Additionally, users have reported that the "Recent Activity" section occasionally displays posts from other users instead of being strictly filtered to the profile owner's activity.

## What Changes

- **Logout Button Relocation**: Move the "Logout" button from the bottom of the profile card/sidebar to the top, placed as a pill-style button alongside the "Edit Profile" button.
- **Theme Integration**: The new Logout pill button will use the dynamic theme accent color selected in settings, ensuring a cohesive look.
- **Activity Filtering**: Update the "Recent Activity" logic to strictly filter posts by the `id_usuario` of the profile being viewed, preventing cross-user data leakage in the activity feed.

## Capabilities

### New Capabilities
- `profile-action-layout`: A refined, cohesive layout for primary profile actions (Edit, Logout) using consistent pill-style components.
- `personalized-activity-feed`: A strictly filtered activity feed that ensures data privacy and relevance to the profile being viewed.

### Modified Capabilities
<!-- No existing global specs to modify -->

## Impact

- **Frontend**: `Profile.jsx` layout and state management logic.
- **UX**: Improved accessibility of the logout function and better data isolation in the activity feed.
