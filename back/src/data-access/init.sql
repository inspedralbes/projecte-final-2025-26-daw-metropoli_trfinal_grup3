SET NAMES utf8mb4;
-- =============================================
-- DATOS INICIALES — METRÓPOLI APP
-- =============================================

-- Usuario admin (necesario para FK en otras tablas)
INSERT INTO usuario (nombre, email, password_hash, rol) VALUES
('Admin', 'admin@metropoli.com', 'changeme_hash', 'admin'),
('Test User', 'test@metropoli.com', 'changeme_hash', 'visitante')
ON DUPLICATE KEY UPDATE email=email;

-- Categorías iniciales
INSERT INTO categoria (nombre, icono_url, color_hex) VALUES
('Bares', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=100&q=80', '#FF5733'),
('Segona mà', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=100&q=80', '#33FF57'),
('Cafès', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&q=80', '#3357FF'),
('Cultura', 'https://images.unsplash.com/photo-1491153059943-412f4b00ca1a?w=100&q=80', '#F333FF')
ON DUPLICATE KEY UPDATE nombre=nombre;

-- Listas públicas iniciales
INSERT INTO listas (id_usuario, nombre, descripcion, visibilidad, imagen_url) VALUES
(1, 'Tapes per Gràcia', 'Una ruta pels millors bars de tapes', 'public', 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=400&q=80'),
(2, 'Cafès secrets', 'Llocs tranquils per llegir i prendre cafè', 'public', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80')
ON DUPLICATE KEY UPDATE nombre=nombre;

-- Actividad inicial para usuario 4 (o el que se use para pruebas)
-- Asumiendo que el usuario actual es el 1 o el 4 en las pruebas del usuario
INSERT INTO usuario_actividad (id_usuario, tipo, valor, id_referencia, fecha) VALUES
(4, 'poi_visitado', 0, 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(4, 'poi_visitado', 0, 2, DATE_SUB(NOW(), INTERVAL 4 DAY)),
(4, 'ruta_completada', 1.5, NULL, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(4, 'ruta_completada', 2.8, NULL, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(4, 'ruta_completada', 0.9, NULL, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(4, 'ruta_completada', 3.2, NULL, NOW())
ON DUPLICATE KEY UPDATE id_usuario=id_usuario;
