## Why

Actualmente, la pantalla de Colecciones (`Collections.jsx`) utiliza datos estáticos (Mock Data) para mostrar las rutas de los usuarios. Para que la aplicación sea funcional y personalizada, es necesario que esta pantalla recupere las listas reales creadas por el usuario autenticado desde la base de datos MySQL. Además, se debe gestionar el estado de sesión para asegurar que solo los usuarios identificados puedan acceder a sus colecciones personales.

## What Changes

- Refactorización de `Collections.jsx` para eliminar el uso de `mockRoutes`.
- Implementación de un estado de carga y error en la pantalla de colecciones.
- Integración de la llamada a la API `getUsuarioListas(id_usuario)` para obtener datos reales.
- Añadida lógica de comprobación de sesión: si el usuario no está logueado, se mostrará un mensaje descriptivo invitándole a iniciar sesión en lugar de una lista vacía.
- Mapeo de los datos recibidos de la base de datos (campos como `nombre`, `descripcion`) a los componentes visuales de la interfaz.

## Capabilities

### New Capabilities
- `collections-personalization`: Capacidad de filtrar y mostrar exclusivamente las colecciones que pertenecen al usuario autenticado, gestionando estados de "no logueado" y "sin contenido".

### Modified Capabilities
- Ninguna.

## Impact

- **Frontend**: `Collections.jsx` se vuelve dinámico y dependiente del estado de autenticación.
- **Servicios**: Se valida el uso de `getUsuarioListas` en `communicationManager.js`.
- **Experiencia de Usuario**: Transición de datos estáticos a datos dinámicos persistentes.
