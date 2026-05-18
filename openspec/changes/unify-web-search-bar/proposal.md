## Why

En la vista web de la aplicación (por ejemplo en `/community`), la barra buscadora actualmente se superpone con el título de la vista. Además, las barras de búsqueda de las vistas principales (`Home`, `Community`, `Collections`) no comparten la misma disposición en la cabecera, provocando una experiencia de usuario inconsistente. Es necesario unificar la ubicación del buscador en la versión de escritorio para que siempre aparezca en el mismo lugar de la cabecera.

## What Changes

- Integrar un componente reutilizable de búsqueda (ej. `WebSearchBar`) dentro del componente del `Header` de la aplicación (junto al título de la página y el icono de perfil), exclusivamente para la vista web (desktop).
- Mostrar esta nueva barra de búsqueda unificada en el `Header` solo cuando el usuario se encuentre en las vistas de `Home`, `Community` o `Collections`.
- Eliminar las barras de búsqueda individuales (y específicas de web) que actualmente se renderizan en el contenido de cada una de estas páginas.
- Ajustar el espaciado (padding o margin top) del contenedor principal del contenido web para compensar la nueva estructura del `Header` superior y evitar que el contenido suba y se solape con él.

## Capabilities

### New Capabilities
- `web-unified-search-header`: Capacidad para inyectar una barra de búsqueda global y contextual (dependiendo de la vista) en el Header principal para la versión web de escritorio.

### Modified Capabilities
- Ninguna

## Impact

- `front/src/layouts/Header.jsx`
- Vistas afectadas: `Home.jsx`, `Community.jsx`, `Collections.jsx`
- Componentes de búsqueda web: `WebSearchBar.jsx` (o equivalentes existentes)
- Contenedores de layout global (ajuste de padding/margin para evitar solapamiento).
