## ADDED Requirements

### Requirement: Carga de Colecciones de Usuario
El sistema DEBE recuperar automáticamente las listas de rutas pertenecientes al usuario autenticado al acceder a la pantalla de Colecciones.

#### Scenario: Usuario logueado con listas
- **WHEN** El usuario accede a `/collections` y existe un `id_usuario` en localStorage.
- **THEN** El sistema llama a `getUsuarioListas(id_usuario)` y muestra las tarjetas correspondientes con los datos reales de la base de datos.

#### Scenario: Usuario logueado sin listas
- **WHEN** El usuario accede a `/collections`, está logueado, pero la API devuelve un array vacío.
- **THEN** El sistema muestra un mensaje indicando que no hay colecciones aún y ofrece un botón para crear la primera.

### Requirement: Control de Acceso y Estado de Sesión
El sistema DEBE validar si hay una sesión activa antes de intentar cargar los datos personales.

#### Scenario: Usuario no logueado
- **WHEN** El usuario accede a `/collections` y no hay datos de usuario en localStorage.
- **THEN** El sistema muestra un mensaje informativo invitando al usuario a iniciar sesión con un botón de acceso directo a `/login`.

### Requirement: Mapeo de Atributos de Base de Datos
El sistema DEBE mapear correctamente los campos de la base de datos a los componentes visuales de la tarjeta de colección.

#### Scenario: Visualización correcta de datos
- **WHEN** Se recibe una lista de la base de datos.
- **THEN** El campo `nombre` se muestra como título principal y `descripcion` se utiliza para el detalle o subtítulo de la tarjeta.
