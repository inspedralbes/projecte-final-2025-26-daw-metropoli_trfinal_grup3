-- MIGRATION TO FIX MISSING TABLES AND COLUMNS
USE metropoli;

-- 1. Add missing columns to 'pois' table if they don't exist
-- We use a procedure to check existence before adding to avoid errors
DELIMITER //
CREATE PROCEDURE AddColumnsToPois()
BEGIN
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'pois' AND COLUMN_NAME = 'id_usuario' AND TABLE_SCHEMA = 'metropoli') THEN
        ALTER TABLE pois ADD COLUMN id_usuario INTEGER NULL;
        ALTER TABLE pois ADD CONSTRAINT fk_pois_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario);
    END IF;

    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'pois' AND COLUMN_NAME = 'visibilidad' AND TABLE_SCHEMA = 'metropoli') THEN
        ALTER TABLE pois ADD COLUMN visibilidad ENUM('public', 'friends', 'private') DEFAULT 'public';
    END IF;

    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'pois' AND COLUMN_NAME = 'es_fijo' AND TABLE_SCHEMA = 'metropoli') THEN
        ALTER TABLE pois ADD COLUMN es_fijo BOOLEAN DEFAULT 0;
    END IF;
END //
DELIMITER ;

CALL AddColumnsToPois();
DROP PROCEDURE AddColumnsToPois;

-- 2. Create 'listas' table if not exists
CREATE TABLE IF NOT EXISTS listas (
    id_lista INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    imagen_url VARCHAR(255),
    visibilidad ENUM('public', 'friends', 'private') DEFAULT 'private',
    likes INTEGER DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- 3. Add missing columns to 'listas' table if they don't exist
DELIMITER //
CREATE PROCEDURE AddColumnsToListas()
BEGIN
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'listas' AND COLUMN_NAME = 'likes' AND TABLE_SCHEMA = 'metropoli') THEN
        ALTER TABLE listas ADD COLUMN likes INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'listas' AND COLUMN_NAME = 'imagen_url' AND TABLE_SCHEMA = 'metropoli') THEN
        ALTER TABLE listas ADD COLUMN imagen_url VARCHAR(255);
    END IF;
END //
DELIMITER ;

CALL AddColumnsToListas();
DROP PROCEDURE AddColumnsToListas;

-- 4. Create 'lista_pois' table if not exists
CREATE TABLE IF NOT EXISTS lista_pois (
    id_lista INT NOT NULL,
    id_poi INT NOT NULL,
    orden INT NOT NULL,
    PRIMARY KEY (id_lista, id_poi),
    FOREIGN KEY (id_lista) REFERENCES listas(id_lista),
    FOREIGN KEY (id_poi) REFERENCES pois(id_poi)
);
