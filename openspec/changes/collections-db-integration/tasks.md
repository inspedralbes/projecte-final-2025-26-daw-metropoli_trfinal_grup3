## 1. Preparación y Gestión de Estado

- [x] 1.1 Importar `useEffect`, `useState` y los servicios necesarios (`getUsuarioListas`) en `Collections.jsx`.
- [x] 1.2 Definir los estados locales para `listas`, `loading`, `error` y `isLoggedIn`.
- [x] 1.3 Implementar la lógica para recuperar el usuario de `localStorage` al cargar el componente.

## 2. Integración de API y Lógica de Negocio

- [x] 2.1 Crear la función asíncrona `fetchUserLists` que llame a `getUsuarioListas(id_usuario)`.
- [x] 2.2 Manejar las respuestas de la API, actualizando el estado de `listas` y gestionando posibles errores (401, 404, etc.).
- [x] 2.3 Eliminar la dependencia de `mockRoutes` en el filtrado de búsqueda.

## 3. Refactorización de la Interfaz (UI)

- [x] 3.1 Implementar la vista condicional para "Usuario no logueado" con mensaje y botón de Login.
- [x] 3.2 Implementar el estado de carga (Spinner o esqueleto) mientras se recuperan los datos.
- [x] 3.3 Implementar la vista para "Sin listas" (Empty state) cuando el array de la API esté vacío.
- [x] 3.4 Actualizar el renderizado de las tarjetas de ruta para usar los campos reales (`nombre`, `descripcion`) y una imagen por defecto si no existe.

## 4. Validación y Pulido

- [x] 4.1 Probar el flujo completo con un usuario que tenga listas creadas.
- [x] 4.2 Probar el flujo con un usuario nuevo sin listas.
- [x] 4.3 Verificar que el mensaje de "Iniciar sesión" aparece correctamente al borrar el localStorage.
