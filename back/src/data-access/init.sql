SET NAMES utf8mb4;
-- =============================================
-- DATOS INICIALES — METRÓPOLI APP
-- =============================================

-- Usuario admin (necesario para FK en otras tablas)
INSERT INTO usuario (nombre, email, password_hash, rol) VALUES
('Admin', 'admin@metropoli.com', 'changeme_hash', 'admin'),
('Test User', 'test@metropoli.com', 'changeme_hash', 'visitante')
ON DUPLICATE KEY UPDATE email=email;


