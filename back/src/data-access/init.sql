SET NAMES utf8mb4;
-- =============================================
-- DATOS INICIALES — METRÓPOLI APP
-- =============================================

-- Usuario admin (necesario para FK en otras tablas)
INSERT INTO usuario (nombre, email, password_hash, rol) VALUES
('Admin', 'admin@metropoli.com', 'changeme_hash', 'admin'),
('Test User', 'test@metropoli.com', 'changeme_hash', 'visitante')
ON DUPLICATE KEY UPDATE email=email;

-- =============================================
-- EVENTOS — Spanish GP 2026
-- La cuenta atrás del front usa fecha_inicio del evento
-- con estado 'proximo' para identificarlo como el siguiente evento
-- =============================================
INSERT INTO eventos (nombre, descripcion, foto, fecha_inicio, fecha_fin, estado) VALUES
(
    'Spanish Grand Prix 2026',
    'Formula 1 Gran Premio de España 2026. Circuit de Barcelona-Catalunya, Montmeló.',
    '/images/eventos/spanish-gp-2026.jpg',
    '2026-05-31 15:00:00',  -- Carrera (domingo, hora local CEST)
    '2026-05-31 17:00:00',
    'programado'
),
(
    'Clasificación Spanish GP 2026',
    'Sesión de clasificación del Gran Premio de España 2026.',
    '/images/eventos/spanish-gp-2026.jpg',
    '2026-05-30 15:00:00',  -- Sábado
    '2026-05-30 16:00:00',
    'programado'
),
(
    'Práctica Libre 1 — Spanish GP 2026',
    'Primera sesión de entrenamientos libres.',
    '/images/eventos/spanish-gp-2026.jpg',
    '2026-05-29 12:30:00',  -- Viernes
    '2026-05-29 13:30:00',
    'programado'
),
(
    'Práctica Libre 2 — Spanish GP 2026',
    'Segunda sesión de entrenamientos libres.',
    '/images/eventos/spanish-gp-2026.jpg',
    '2026-05-29 16:00:00',  -- Viernes
    '2026-05-29 17:00:00',
    'programado'
),
(
    'Práctica Libre 3 — Spanish GP 2026',
    'Tercera sesión de entrenamientos libres.',
    '/images/eventos/spanish-gp-2026.jpg',
    '2026-05-30 11:30:00',  -- Sábado
    '2026-05-30 12:30:00',
    'programado'
)
ON DUPLICATE KEY UPDATE nombre=nombre;
