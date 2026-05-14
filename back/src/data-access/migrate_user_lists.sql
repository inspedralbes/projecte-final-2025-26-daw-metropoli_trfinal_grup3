-- Tablas para listas de usuarios
CREATE TABLE IF NOT EXISTS listas (
    id_lista INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    visibilidad ENUM('public', 'friends', 'private') DEFAULT 'private',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE IF NOT EXISTS lista_pois (
    id_lista INT NOT NULL,
    id_poi INT NOT NULL,
    orden INT NOT NULL,
    PRIMARY KEY (id_lista, id_poi),
    FOREIGN KEY (id_lista) REFERENCES listas(id_lista),
    FOREIGN KEY (id_poi) REFERENCES pois(id_poi)
);

-- Modificar tabla pois para añadir creador y visibilidad
-- Nota: Usamos IF NOT EXISTS o verificamos manualmente si ya existen para evitar errores si se ejecuta varias veces
ALTER TABLE pois ADD COLUMN IF NOT EXISTS id_usuario INT;
ALTER TABLE pois ADD COLUMN IF NOT EXISTS visibilidad ENUM('public', 'friends', 'private') DEFAULT 'public';
ALTER TABLE pois ADD COLUMN IF NOT EXISTS es_fijo BOOLEAN DEFAULT 0;

-- Añadir clave foránea para id_usuario en pois si no existe
-- (En MySQL 8.0.19+ se puede usar CONSTRAINT IF NOT EXISTS, o simplemente manejar el error)
ALTER TABLE pois ADD CONSTRAINT fk_pois_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario);
