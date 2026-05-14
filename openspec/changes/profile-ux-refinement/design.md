## Context

The profile page (`Profile.jsx`) currently features an "Edit Profile" button within the profile card and a "Log Out" button at the bottom of the sidebar/column. The user wants to unify these actions into a single visual block (pills) and ensure the logout button uses the theme's primary color. Additionally, there is a requirement to strictly filter the "Recent Activity" section to show only the posts of the logged-in user (likely when viewing their own profile, or as a general rule for the activity section if it's behaving like a global feed incorrectly).

## Goals / Non-Goals

**Goals:**
- Move Logout button next to Edit Profile button.
- Style both as "pill" buttons.
- Use dynamic theme color (`bg-primary`, `text-primary-text`) for the Logout button.
- Ensure "Recent Activity" is strictly filtered by the current user's ID.

**Non-Goals:**
- Changing the backend API for posts.
- Modifying other tabs (friends, routes) unless necessary for layout consistency.

## Decisions

- **Layout**: Wrap "Edit Profile" and "Logout" in a flex container with `gap-2`.
- **Styling**: 
  - Edit Profile: Keep existing outline style but adjust padding to match the Logout pill.
  - Logout: Change from a full-width text button to a pill button using `bg-primary` and `text-primary-text` to make it prominent and theme-responsive.
- **Filtering Logic**: 
  - Ensure the filter uses `currentUser.id_usuario` explicitly when the intention is to show "my activity".
  - Double-check type matching (string vs int) in the `.filter()` call by using `Number()` or `String()` casting for safety.

## Risks / Trade-offs

- [Risk] → If the user is visiting *another* user's profile, should they see *their own* posts or the *profile owner's* posts?
  - [Mitigation] → Based on the request "solo se muestren los post del ususario que ha iniciado sesion", I will implement a check: if `isOwnProfile` is false, the activity section might need to be hidden or specifically show the *logged-in* user's activity if that's what was intended. However, standard social logic implies seeing the owner's posts. I will assume the user wants to fix a bug where they see "everyone's" posts on their own profile.
