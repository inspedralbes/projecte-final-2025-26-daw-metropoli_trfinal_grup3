SET NAMES utf8mb4;

-- =============================================
-- SEED DATA - METRÓPOLI APP (F1 Spanish GP 2026)
-- =============================================

-- 1. USUARIOS (Añadimos perfiles variados)
INSERT IGNORE INTO usuario (id_usuario, nombre, email, password_hash, rol, bio) VALUES
(3, 'Carlos Sainz Fan', 'carlos@fans.com', '$2b$10$abcdefghijklmnopqrstuv', 'visitante', '¡Apoyando a Carlos en casa! Vamos 55!'),
(4, 'Marta Racing', 'marta@example.com', '$2b$10$abcdefghijklmnopqrstuv', 'visitante', 'Aficionada a la F1 desde los tiempos de Senna.'),
(5, 'Staff Metropoli', 'staff@metropoli.com', '$2b$10$abcdefghijklmnopqrstuv', 'admin', 'Cuenta oficial de soporte y noticias.'),
(6, 'Pau Garcia', 'pau@metropoli.com', '$2b$10$abcdefghijklmnopqrstuv', 'visitante', 'Mi primer Gran Premio en directo.');

-- 2. CATEGORIAS
INSERT IGNORE INTO categoria (id_categoria, nombre, icono_url, color_hex) VALUES
(1, 'Tribuna', 'https://cdn-icons-png.flaticon.com/512/1039/1039328.png', '#E63946'),
(2, 'Pelousse', 'https://cdn-icons-png.flaticon.com/512/2800/2800458.png', '#2A9D8F'),
(3, 'Fan Zone', 'https://cdn-icons-png.flaticon.com/512/4238/4238124.png', '#F4A261'),
(4, 'Restauración', 'https://cdn-icons-png.flaticon.com/512/1046/1046788.png', '#E9C46A'),
(5, 'Servicios', 'https://cdn-icons-png.flaticon.com/512/411/411712.png', '#457B9D'),
(6, 'Médico', 'https://cdn-icons-png.flaticon.com/512/2966/2966327.png', '#1D3557'),
(7, 'Tienda', 'https://cdn-icons-png.flaticon.com/512/1170/1170678.png', '#8D99AE'),
(8, 'Parking', 'https://cdn-icons-png.flaticon.com/512/2830/2830305.png', '#6D597A');

-- 4. NODOS DE NAVEGACIÓN (Grafo para el circuito)
INSERT IGNORE INTO nodos_navegacion (id_nodo, latitud, longitud, descripcion) VALUES
(1, 41.570000, 2.258000, 'Acceso 1 - Entrada Principal'),
(2, 41.571000, 2.260000, 'Cruce Tribuna Principal'),
(3, 41.572000, 2.262000, 'Centro Fan Zone'),
(4, 41.568000, 2.260000, 'Pasarela Curva 1'),
(5, 41.565000, 2.265000, 'Acceso Tribuna G (Curva 4)'),
(6, 41.567000, 2.268000, 'Zona Servicios Este'),
(7, 41.573000, 2.255000, 'Apeadero Renfe / Parking A'),
(8, 41.575000, 2.258000, 'Acceso 4 - Zona Norte');

-- 5. RUTAS/TRAMOS (Conexiones)
INSERT IGNORE INTO rutas_tramos (id_nodo_origen, id_nodo_destino, distancia_metros, es_accesible, tipo_terreno) VALUES
(1, 2, 120, 1, 'asfalto'),
(2, 3, 250, 1, 'asfalto'),
(2, 4, 300, 1, 'asfalto'),
(4, 5, 600, 0, 'tierra'),
(5, 6, 150, 1, 'asfalto'),
(7, 1, 400, 1, 'asfalto'),
(8, 3, 350, 1, 'asfalto');

-- 6. POIS (Puntos de Interés)
INSERT IGNORE INTO pois (id_poi, nombre, descripcion, latitud, longitud, id_categoria, es_accesible, es_fijo, imagen_url, id_nodo_acceso) VALUES
(1, 'Tribuna Principal', 'Vista de la parrilla de salida y pits.', 41.570500, 2.259500, 1, 1, 1, '/images/pois/tribuna_principal.jpg', 2),
(2, 'Fan Zone Metropoli', 'Simuladores, trofeos y DJ.', 41.572000, 2.262000, 3, 1, 0, '/images/pois/fanzone.jpg', 3),
(3, 'Grill House F1', 'Carnes a la brasa y bocadillos.', 41.571800, 2.262500, 4, 1, 0, '/images/pois/food.jpg', 3),
(4, 'Medical Center 2', 'Primeros auxilios sector sur.', 41.565200, 2.265200, 6, 1, 1, '/images/pois/medical.jpg', 5),
(5, 'Store Official F1', 'Merchandising de todos los equipos.', 41.572200, 2.261800, 7, 1, 0, '/images/pois/shop.jpg', 3),
(6, 'Pelousse Curva 1', 'Lugar mítico para ver adelantamientos.', 41.567800, 2.259800, 2, 0, 1, '/images/pois/pelousse.jpg', 4),
(7, 'Aseos Adaptados Este', 'Baños públicos accesibles.', 41.566800, 2.267800, 5, 1, 1, '/images/pois/wc.jpg', 6);

-- 7. EVENTO_POI_CONFIG (Vincular al evento ID=1 que es el Spanish GP 2026)
INSERT IGNORE INTO evento_poi_config (id_evento, id_poi, estado) VALUES
(1, 1, 'disponible'),
(1, 2, 'disponible'),
(1, 3, 'disponible'),
(1, 4, 'disponible'),
(1, 5, 'disponible'),
(1, 6, 'lleno'),
(1, 7, 'disponible');

-- 8. HORARIOS DETALLADOS (Para el fin de semana del GP)
INSERT IGNORE INTO poi_horarios (id_poi, id_evento, dia_semana, hora_apertura, hora_cierre) VALUES
(2, 1, 'Viernes', '09:00:00', '20:00:00'),
(2, 1, 'Sábado', '08:30:00', '20:00:00'),
(2, 1, 'Domingo', '07:30:00', '19:00:00'),
(3, 1, 'Domingo', '10:00:00', '18:00:00');

-- 10. INCIDENCIAS
INSERT IGNORE INTO incidencias (id_incidencia, id_poi, id_usuario_reporta, tipo, descripcion, estado) VALUES
(1, 7, 3, 'Limpieza', 'Se necesita limpieza urgente en los baños este.', 'activa'),
(2, 3, 4, 'Aglomeración', 'Mucha cola en el Grill House.', 'pendiente');

-- 12. COMUNIDAD (Muro de fans)
INSERT IGNORE INTO comunidad (id_publicacion, id_usuario, texto, likes, tipo_publicacion, ubicacion) VALUES
(1, 3, '¡Qué ganas de ver a Carlos en el podio! El ambiente es brutal.', 150, 'popular', 'Tribuna Principal'),
(2, 5, 'AVISO: Quedan pocas plazas en el Parking A. Recomendamos usar transporte público.', 89, 'oficial', 'Parking A'),
(3, 4, 'Los simuladores de la Fan Zone son increíbles, muy realistas.', 45, 'fanzone', 'Fan Zone Metropoli'),
(4, 6, '¿Alguien sabe si el bus lanzadera ya está funcionando?', 12, 'popular', 'Acceso 1');

-- 13. AMIGOS
INSERT IGNORE INTO amigos (id_usuario, id_amigo) VALUES
(3, 4),
(4, 3),
(3, 6),
(6, 3);

-- 14. CÓDIGOS QR
INSERT IGNORE INTO qr_codes (id_qr, slug, id_nodo_inicio, ruta_archivo_qr) VALUES
(1, 'entrada-principal', 1, '/qrs/entrada_principal.png'),
(2, 'parking-renfe', 7, '/qrs/parking_renfe.png'),
(3, 'fanzone-central', 3, '/qrs/fanzone.png');
