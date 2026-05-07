## Why

The current home screen features category filters that are less used compared to direct social interaction. By replacing these filters with a friends' activity/status row (similar to the one in the Community screen), we prioritize social connectivity and allow users to quickly see which friends are online and jump to their profiles or chat.

## What Changes

- **UI Refinement (Home)**: Remove the horizontal scrollable category filters located below the search bar.
- **New Feature (Home)**: Integrate a horizontal "Friends Online" list above the main content, showing friend avatars with online status indicators and links to their profiles.
- **Data Seeding**: Populate the database with a set of dummy users and established friend relationships to ensure the new UI is populated and functional upon implementation.

## Capabilities

### New Capabilities
- `home-friend-status-row`: Integration of the friend list mechanism into the home page, including online status tracking via sockets or polling.

### Modified Capabilities
- `database-seeding`: Update seeding scripts or provide SQL/Mongo commands to populate the environment with social data.

## Impact

- **Frontend**: `Home.jsx` will be modified to remove categories and add the friends row. `UserAvatar` and existing `getAmigos` service will be reused.
- **Backend**: No major API changes expected, but the environment needs more seed data.
- **Design**: The home screen layout will be cleaner and more social-focused.
