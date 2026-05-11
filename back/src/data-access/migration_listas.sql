SET NAMES utf8mb4;
USE metropoli;

-- 1. Actualizar tabla POIS (añadir id_usuario y visibilidad)
ALTER TABLE pois 
ADD COLUMN id_usuario INTEGER NULL,
ADD COLUMN visibilidad ENUM('public', 'friends', 'private') DEFAULT 'public',
ADD FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE;

-- 2. Crear tabla LISTAS
CREATE TABLE IF NOT EXISTS listas (
    id_lista INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    imagen_url VARCHAR(255),
    visibilidad ENUM('public', 'friends', 'private') DEFAULT 'private',
    likes INTEGER DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- 3. Crear tabla LISTA_POIS
CREATE TABLE IF NOT EXISTS lista_pois (
    id_lista INT NOT NULL,
    id_poi INT NOT NULL,
    orden INT NOT NULL,
    PRIMARY KEY (id_lista, id_poi),
    FOREIGN KEY (id_lista) REFERENCES listas(id_lista) ON DELETE CASCADE,
    FOREIGN KEY (id_poi) REFERENCES pois(id_poi) ON DELETE CASCADE
);
