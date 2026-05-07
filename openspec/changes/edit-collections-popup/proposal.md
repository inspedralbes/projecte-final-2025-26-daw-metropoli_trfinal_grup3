## Why

Actualmente, la pantalla de Colecciones permite listar las rutas guardadas, pero no ofrece ninguna forma de editarlas una vez creadas. Los usuarios necesitan poder ajustar el nombre, la visibilidad o eliminar puntos específicos de sus itinerarios para mantener sus colecciones actualizadas y personalizadas.

## What Changes

- **Popup de Edición**: Implementación de un modal detallado que se activa al pulsar el botón de edición (lápiz) de cada tarjeta.
- **Gestión de Puntos**: Visualización de la lista de puntos (POIs) que componen la ruta con opción de eliminar puntos individuales.
- **Edición de Metadatos**: Campos para modificar el nombre de la colección y su descripción.
- **Control de Visibilidad**: Selector para cambiar el estado de la ruta entre Pública y Privada.
- **Validación de Contrato de Datos**: Revisión exhaustiva del mapeo de campos (ej: `id_lista`, `nombre`, `descripcion`, `pois`) entre la respuesta de la API y el estado de React para evitar errores de tipo "data not matching".
- **Actualización en Base de Datos**: Integración con el endpoint de backend para persistir los cambios realizados.

## Capabilities

### New Capabilities
- `collection-management-popup`: Nueva interfaz de gestión detallada dentro de la pantalla de colecciones que permite la edición integral de los datos de la ruta y sus puntos asociados.

### Modified Capabilities
- `collections-db-integration`: Ampliación de los requisitos para incluir la capacidad de edición además de la simple visualización de datos.

## Impact

- **Frontend**: Modificaciones en `Collections.jsx` para gestionar el estado del modal y la lógica de edición.
- **Traducciones**: Nuevas claves para los textos del modal de edición (nombres de campos, botones de guardar/cancelar, etc.).
- **Servicios**: Uso de las funciones de `communicationManager.js` para enviar las actualizaciones al servidor.
