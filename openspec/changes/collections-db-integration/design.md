## Context

La pantalla de Colecciones (`Collections.jsx`) es el espacio donde los usuarios visualizan sus itinerarios guardados. Actualmente, esta pantalla muestra una lista estática de rutas de ejemplo (`mockRoutes`), lo que impide que el usuario vea sus propios datos reales. El backend ya dispone de los modelos y controladores necesarios para servir estas listas, por lo que el cambio se centra en la integración frontend.

## Goals / Non-Goals

**Goals:**
- Sustituir los datos estáticos por datos reales provenientes de la base de datos MySQL.
- Implementar la detección del usuario logueado mediante `localStorage`.
- Gestionar el estado de "Cerrado de sesión" mostrando una interfaz que invite al login.
- Asegurar que la interfaz responda correctamente a la falta de contenido (usuario logueado sin listas).

**Non-Goals:**
- No se implementará la creación de listas desde esta pantalla (ya existe en `/create-list`).
- No se modificará el esquema de la base de datos.
- No se implementará la edición funcional de las rutas en este paso (solo visualización).

## Decisions

1. **Gestión de Sesión Local**: Se utilizará `localStorage.getItem("usuario")` para obtener el objeto del usuario actual. Es el método consistente con `Login.jsx`.
2. **Hook de Carga**: Se usará `useEffect` para disparar la carga de datos al montar el componente, condicionado a la existencia del usuario en el sistema.
3. **Manejo de Estados UI**: 
   - **Cargando**: Spinner o esqueleto de carga.
   - **Sin Sesión**: Vista con un icono descriptivo y botón de redirección a `/login`.
   - **Sin Listas**: Mensaje de "Aún no tienes listas" con botón para crear una.
4. **Mapeo de Atributos**: Los campos de la base de datos (`nombre`, `descripcion`) se mapearán a los campos visuales (`title`, `location`/`subtitle`) de la tarjeta actual.

## Risks / Trade-offs

- **[Riesgo] Sesión Caducada** → **[Mitigación]** Si la API devuelve un error de autorización (401), se limpiará el localStorage y se forzará la vista de "Sin Sesión".
- **[Riesgo] Rendimiento** → **[Mitigación]** Las listas suelen ser ligeras, pero se implementará un estado de `loading` para evitar parpadeos visuales.
- **[Riesgo] Datos Inconsistentes** → **[Mitigación]** Se validará que el objeto `usuario` en localStorage tenga un `id_usuario` válido antes de realizar la petición.
