## Context

The React frontend currently utilizes `react-i18next` for internationalization. While many parts of the application properly consume the `t()` function to render translated strings, a recent audit generated `textos_por_traducir.md`, which revealed ~88 instances of hardcoded Spanish/Catalan text in the application UI (e.g., placeholders, alerts, toasts, and raw text nodes). These strings remain static when the user toggles the application's language setting.

## Goals / Non-Goals

**Goals:**
- Replace all identified hardcoded strings with the `t()` translation function.
- Add corresponding string keys and translations (in Spanish, Catalan, and English if applicable) to the respective locale JSON files.
- Ensure dynamic reactivity to language changes without requiring page reloads.

**Non-Goals:**
- We will NOT redesign the UI components where the strings reside.
- We will NOT refactor existing translated strings unless they are broken.
- We will NOT add internationalization to backend logs or API error responses at this stage; this scope is limited to frontend UI elements.

## Decisions

- **Translation Keys Naming Strategy**: We will organize the new keys logically based on the component or page they belong to (e.g., `admin.alerts.selectNode` instead of flat global keys).
- **Importing `useTranslation`**: We will use the `useTranslation()` hook in functional components. If strings exist outside of a component context (e.g., utility functions), we will pass the `t` function as an argument or import the `i18next` instance directly.
- **Handling Variables**: For strings with dynamic content (e.g., `"¡Hola! Soy Mapis"`), we will use standard i18next interpolation if needed, or simply translate the static part.

## Risks / Trade-offs

- **Risk**: A missing key could render raw keys instead of readable text in the UI.
- **Mitigation**: We will verify each modified screen/component in the browser after updating the locale files and will ensure fallback behavior is configured.
- **Risk**: Some strings might be dynamically concatenated (e.g., `setToast({ message: "Error " + errorMsg })`).
- **Mitigation**: We will refactor those into parameterized translation strings like `t("common.error_with_msg", { msg: errorMsg })`.
