-- Datos de prueba para algoritmo Dijkstra

-- 1. Insertar Nodos de Navegación
-- Un grafo simple: A, B, C, D, E, F
-- A (1,1) -> Nodo 1 (Entrada Principal)
-- B (2,2) -> Nodo 2
-- C (2,0) -> Nodo 3
-- D (3,1) -> Nodo 4 (Plaza Central)
-- E (4,2) -> Nodo 5
-- F (4,0) -> Nodo 6 (Zona Expo)

INSERT INTO nodos_navegacion (id_nodo, latitud, longitud, descripcion) VALUES
(1, 41.3851, 2.1734, 'Nodo A - Entrada'),
(2, 41.3861, 2.1744, 'Nodo B'),
(3, 41.3841, 2.1724, 'Nodo C'),
(4, 41.3871, 2.1754, 'Nodo D - Plaza'),
(5, 41.3881, 2.1764, 'Nodo E'),
(6, 41.3891, 2.1774, 'Nodo F - Expo');

-- 2. Insertar Tramos (Aristas)
INSERT INTO rutas_tramos (id_nodo_origen, id_nodo_destino, distancia_metros, es_accesible, tipo_terreno, es_bidireccional) VALUES
(1, 2, 100.00, 1, 'asfalto', 1),
(1, 3, 150.00, 1, 'asfalto', 1),
(2, 4, 200.00, 1, 'tierra', 1),
(3, 4, 100.00, 1, 'asfalto', 1),
(2, 5, 120.00, 1, 'pavimento', 1),
(4, 5, 80.00, 1, 'asfalto', 1),
(4, 6, 300.00, 1, 'tierra', 1),
(5, 6, 100.00, 1, 'asfalto', 1);

-- 3. Insertar Categorias (Requisito para POIs)
INSERT INTO categoria (id_categoria, nombre, icono_url, color_hex) VALUES
(1, 'Restauración', 'icon_food.png', '#FF5733'),
(2, 'Servicios', 'icon_wc.png', '#33FF57'),
(3, 'Exposiciones', 'icon_art.png', '#3357FF');

-- 4. Insertar POIs (Puntos de Interés)
-- Vinculados a nodos de acceso
INSERT INTO pois (id_poi, nombre, descripcion, latitud, longitud, id_categoria, es_accesible, es_fijo, id_nodo_acceso) VALUES
(1, 'Cafetería Central', 'Café y snacks', 41.3872, 2.1755, 1, 1, 1, 4), -- En Nodo D
(2, 'Baños Entrada', 'Baños públicos', 41.3852, 2.1735, 2, 1, 1, 1), -- En Nodo A
(3, 'Stand Tecnológico', 'Exposición de robots', 41.3892, 2.1775, 3, 0, 0, 6); -- En Nodo F
