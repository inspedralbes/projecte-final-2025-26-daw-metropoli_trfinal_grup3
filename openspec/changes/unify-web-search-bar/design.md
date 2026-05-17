## Context

Actualmente, las vistas de `Home`, `Community` y `Collections` (rutas) incluyen sus propias barras de búsqueda directamente en su contenido principal. En la vista web de escritorio, esto produce problemas de solapamiento con el título u otros elementos del Header, además de una apariencia inconsistente. El objetivo es colocar el buscador directamente en el `Header` global (donde están el título y el icono de perfil), exclusivamente en la vista web, y que este sea reutilizable.

## Goals / Non-Goals

**Goals:**
- Mover el componente buscador (`WebSearchBar` o equivalente) al `Header` para la vista desktop.
- Mostrar la barra en el `Header` solo cuando la ruta activa sea `/`, `/community` o `/collections`.
- Asegurar que la funcionalidad de búsqueda en cada vista (que filtra cosas distintas) siga operando correctamente.
- Ajustar el padding/margin superior en el contenedor global o en cada vista para evitar el solapamiento con el nuevo `Header`.

**Non-Goals:**
- Modificar el diseño de la barra de búsqueda en la versión móvil (que sigue su propio layout).
- Alterar la lógica interna de búsqueda (backend o filtrado complejo), únicamente se cambia de dónde se lee el valor del input.

## Decisions

1. **Ubicación en el Header:** Se inyectará el componente de búsqueda en `Header.jsx` utilizando clases condicionales (ej. `hidden md:flex`) para que solo se vea en desktop, y se condicionará su renderizado comprobando la ruta actual con `useLocation()` de react-router.
2. **Gestión de Estado de la Búsqueda:** Como el `Header` y las vistas (`Home`, `Community`, `Collections`) ya no están en el mismo árbol de componentes directo (el Header suele ser global y las vistas hijos del router), usaremos un Contexto Global (`SearchContext`) o los Query Params de la URL (`useSearchParams`) para compartir el texto de búsqueda (`searchQuery`). La opción recomendada es usar un `SearchContext` simple para mantener la reactividad sin cambiar las URLs, o bien si la app usa Zustand/Redux, añadirlo al store. Para este cambio, propondremos crear un pequeño `SearchContext`.
3. **Ajuste de Solapamiento:** El `Header` actualmente debe tener posicionamiento fijo/absoluto o requerir que el contenido de las páginas tenga un padding superior (por ejemplo, `pt-20` o `pt-24`) en desktop. Se aplicará de forma global en el contenedor principal o en cada vista.

## Risks / Trade-offs

- **Risk:** Romper la búsqueda en móvil si se elimina el componente de las vistas sin tener en cuenta la respuesta responsiva.
  - *Mitigación:* Se mantendrá la barra de búsqueda dentro del contenido para la vista móvil (`md:hidden`) y solo se ocultará en desktop. El `Header` global hará lo inverso (visible en desktop, oculto en móvil).
- **Risk:** El estado de búsqueda se mantiene al cambiar de vista.
  - *Mitigación:* Limpiar el estado de búsqueda (`setSearchQuery('')`) dentro de un `useEffect` cada vez que cambie la ruta (`location.pathname`).
