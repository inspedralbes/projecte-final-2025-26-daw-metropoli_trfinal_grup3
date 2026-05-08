## Context

La aplicación ya cuenta con una infraestructura básica para listar rutas (`Collections.jsx`) y un servicio de comunicación (`communicationManager.js`) que incluye funciones para actualizar listas. Sin embargo, no existe una interfaz de usuario para invocar estas actualizaciones de forma granular.

## Goals / Non-Goals

**Goals:**
- Implementar un modal reactivo que permita editar los detalles de una ruta seleccionada.
- Permitir la edición del nombre, descripción y visibilidad de la ruta.
- Ofrecer una lista visual de los POIs actuales con la capacidad de eliminar puntos específicos.
- Garantizar una sincronización fluida entre la UI y la base de datos MySQL.

**Non-Goals:**
- Reordenar los puntos de la ruta mediante drag-and-drop (fuera de alcance inicial).
- Añadir nuevos puntos a una ruta ya creada (se mantendrá en la pantalla de creación por ahora).
- Cambiar la lógica de generación de rutas en el mapa.

## Decisions

- **Gestión de Estado del Modal**: Se utilizará un estado local `isEditModalOpen` y `selectedRoute` en el componente principal `Collections.jsx`. Al pulsar el lápiz, se cargará la información completa de la ruta (incluyendo sus POIs) mediante una llamada adicional si es necesario, o usando los datos ya cargados.
- **Componente de Modal Estilizado**: Se seguirá el sistema de diseño actual (vibrant dark mode / glassmorphism) utilizando Tailwind CSS para asegurar la coherencia estética con el resto de la aplicación.
- **Optimistic UI vs Sincronización**: Se optará por esperar la respuesta del servidor antes de actualizar la lista principal en el frontend para evitar discrepancias en caso de error de red.
- **Comunicación con el Backend**: Se utilizará el endpoint `PUT /api/listas/:id` que ya procesa el objeto lista completo (nombre, descripción, visibilidad y array de IDs de POIs).
- **Mapeo y Normalización de Datos**: Para evitar errores de "data not matching", se implementará una capa de mapeo que asegure que las propiedades de la base de datos (snake_case como `id_lista`) se traten correctamente en el estado de React, verificando siempre la estructura del objeto devuelto por `getUsuarioListas` antes de cargarlo en el modal.

## Risks / Trade-offs

- **[Riesgo] Complejidad en la sincronización de POIs** → [Mitigación] El backend ya maneja el reemplazo total de la relación `lista_pois`, lo que simplifica la lógica del frontend: simplemente enviamos el array filtrado tras las eliminaciones.
- **[Riesgo] Carga de datos pesada en el modal** → [Mitigación] Las listas suelen tener pocos puntos (menos de 20), por lo que el impacto en rendimiento es mínimo.
