## 1. Shared Components & Branding

- [x] 1.1 Create `front/src/components/shared/Logo.jsx` using `material-symbols-outlined` ("location_on") and "wemap" text.
- [x] 1.2 Update `front/src/layouts/Navbar.jsx` to replace the static `logo.png` with `<Logo />` ONLY in the desktop sidebar (`md:flex` section).
- [x] 1.3 Ensure mobile headers remain unchanged unless specifically using "wemap" text as per current implementation.

## 2. Global Responsivity Setup (Desktop Only)

- [x] 2.1 Add a global `.safe-container` utility in `front/src/index.css` that applies `max-w-7xl mx-auto` starting from the `md` breakpoint.
- [x] 2.2 Update `front/src/App.jsx` page wrappers to use `.safe-container` ensuring no layout changes occur on mobile (`< md`).

## 3. Home Page Redesign (Desktop Only)

- [x] 3.1 Modify `front/src/pages/home/Home.jsx` to use `md:grid-cols-2` for the "Les teves rutes" section, keeping it `grid-cols-1` for mobile.
- [x] 3.2 Apply `md:aspect-[16/9]` to the featured card, preserving the `aspect-[4/5]` for mobile screens.
- [x] 3.3 Reorganize "Impacte" and "Dels teus amics" using `md:grid` to display them side-by-side only on desktop.

## 4. Map Page Desktop Optimization

- [x] 4.1 Use conditional rendering or Tailwind `hidden md:block` / `block md:hidden` to toggle between the Bottom Sheet (mobile) and Sidebar (desktop).
- [x] 4.2 Implement the Sidebar layout specifically for desktop view without modifying Bottom Sheet styles.
- [x] 4.3 Move Map UI controls (zoom, locate) to the top/corners using `md:` specific positioning.

## 5. Collections Page & Modals (Desktop Only)

- [x] 5.1 Update `front/src/pages/collections/Collections.jsx` to use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`.
- [x] 5.2 Optimize the "Edit Modal" with a `md:max-w-lg` constraint to prevent it from stretching to full-width on web browsers.
