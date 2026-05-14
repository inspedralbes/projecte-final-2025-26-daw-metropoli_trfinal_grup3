## 1. Interfaz del Modal de Edición

- [x] 1.1 Definir el estado `isEditModalOpen` y `selectedRoute` en `Collections.jsx`.
- [x] 1.2 Crear el esqueleto del modal con el sistema de diseño actual (vibrant dark mode).
- [x] 1.3 Vincular el botón del lápiz de las tarjetas para que abra el modal con los datos de la ruta seleccionada.

## 2. Formulario y Gestión de Puntos

- [x] 2.1 Implementar campos controlados para el nombre y la descripción de la ruta.
- [x] 2.2 Añadir un selector (Toggle o Radio) para la visibilidad (Pública/Privada).
- [x] 2.3 Renderizar la lista de POIs con un botón de eliminar para cada uno, manejando el borrado en el estado local del modal.

## 3. Lógica de Guardado y Comunicación

- [x] 3.1 Implementar la función `handleUpdateRoute` que use `updateLista` de `communicationManager.js`.
- [x] 3.2 Realizar una auditoría del objeto de datos: verificar que los nombres de los campos enviados (`id_lista`, `nombre`, `pois`, etc.) coinciden exactamente con lo que el backend espera recibir.
- [x] 3.3 Gestionar el estado de `saving` y mostrar feedback visual (spinner/toast) al usuario.
- [x] 3.4 Actualizar la lista global de colecciones tras un éxito para reflejar los cambios inmediatamente.

## 4. Traducciones y Validación Final

- [x] 4.1 Incorporar nuevas claves de i18n para el modal (título, etiquetas de campos, botones) en castellano y catalán.
- [x] 4.2 Validar que el nombre de la ruta no sea enviado vacío.
- [x] 4.3 Probar el flujo completo: abrir, modificar metadatos, eliminar un punto, guardar y verificar cambios.
