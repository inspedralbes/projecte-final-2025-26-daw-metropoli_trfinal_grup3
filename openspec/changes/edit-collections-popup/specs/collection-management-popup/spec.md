## ADDED Requirements

### Requirement: Edición de metadatos de colección
El sistema DEBE permitir al usuario modificar el nombre, la descripción y la visibilidad de una colección existente desde un modal de edición.

#### Scenario: Edición exitosa de nombre y visibilidad
- **WHEN** El usuario modifica el título y cambia la visibilidad a "Público" y pulsa "Guardar".
- **THEN** El sistema envía la petición `PUT` al backend y, tras recibir éxito, cierra el modal y actualiza la UI.

### Requirement: Gestión de puntos en la colección
El sistema DEBE listar todos los POIs que pertenecen a la ruta y permitir la eliminación de cualquiera de ellos de forma individual.

#### Scenario: Eliminación de un punto de la ruta
- **WHEN** El usuario pulsa el botón de eliminar en un punto específico de la lista dentro del modal.
- **THEN** El punto se elimina del estado local de la edición y la lista visual se actualiza inmediatamente.

### Requirement: Persistencia de cambios en puntos
El sistema DEBE enviar el nuevo conjunto de puntos al servidor para que la ruta se actualice en la base de datos.

#### Scenario: Guardado tras eliminar puntos
- **WHEN** El usuario elimina varios puntos y pulsa "Guardar".
- **THEN** El sistema envía la lista actualizada de IDs de POIs al servidor mediante la función `updateLista`.
