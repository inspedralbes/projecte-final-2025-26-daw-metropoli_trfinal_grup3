# Estructura del Backend

Este documento describe la estructura de carpetas del backend del proyecto y el propósito de cada una.

## Estructura de Carpetas

```
back/
├── src/
│   ├── config/          # Configuración de conexiones (base de datos, sockets, etc.)
│   ├── controllers/     # Controladores que manejan las peticiones HTTP y respuestas
│   ├── data-access/     # Capa de acceso a datos (consultas a la base de datos)
│   ├── middleware/      # Funciones middleware (autenticación, logging, validación, etc.)
│   ├── models/          # Modelos de datos (definición de esquemas y relaciones)
│   ├── routes/          # Definición de rutas de la API y su mapeo a controladores
│   ├── services/        # Lógica de negocio y servicios reutilizables
│   └── utils/           # Funciones de utilidad y helpers comunes
└── index.js             # Punto de entrada de la aplicación
```

## Detalle de Cada Carpeta

### `src/config/`
Contiene archivos de configuración para conexiones externas como bases de datos (MySQL, MongoDB) y sockets. Cada archivo exporta una conexión o configuración lista para ser utilizada en otras partes de la aplicación.

### `src/controllers/`
Los controladores reciben las peticiones HTTP, procesan los datos (a menudo llamando a servicios), y devuelven las respuestas. Se encargan de la lógica de manejo de rutas específicas.

### `src/data-access/`
Esta capa abstrae el acceso directo a la base de datos. Contiene funciones que realizan operaciones CRUD y consultas complejas, manteniendo la lógica de acceso a datos separada de los controladores y servicios.

### `src/middleware/`
Funciones middleware que se ejecutan en el ciclo de vida de una petición. Se utilizan para tareas como autenticación, autorización, logging, manejo de errores, y parseo de cuerpos de solicitud.

### `src/models/`
Define los modelos de datos usando un ORM/ODM (como Mongoose o Sequelize). Cada modelo representa una entidad de la base de datos con sus atributos, validaciones y relaciones.

### `src/routes/`
Declara las rutas de la API (endpoints) y las asocia a los correspondientes controladores. Organiza las rutas por recurso o funcionalidad.

### `src/services/`
Contiene la lógica de negocio de la aplicación. Los servicios encapsulan operaciones complejas que pueden ser reutilizadas por múltiples controladores, manteniendo los controladores ligeros y enfocados en el manejo de HTTP.

### `src/utils/`
Funciones de utilidad y helpers que se utilizan en varias partes de la aplicación (por ejemplo, formateo de fechas, encriptación, validaciones comunes, etc.).

### `index.js`
Archivo de entrada que inicializa el servidor Express, configura middlewares, conecta a la base de datos, y registra las rutas.