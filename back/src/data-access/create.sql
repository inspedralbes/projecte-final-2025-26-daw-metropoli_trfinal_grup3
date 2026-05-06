SET NAMES utf8mb4;



-- 1. USUARIOS (Independiente)
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INTEGER PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) DEFAULT 'visitante',
     foto_perfil VARCHAR(255) NULL,       -- Ruta de la foto de perfil subida por el usuario
    bio VARCHAR(255) NULL,    
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    email_verificado BOOLEAN DEFAULT FALSE,
    token_verificacion VARCHAR(255) NULL
);

-- 2. CATEGORIAS (Independiente)
CREATE TABLE IF NOT EXISTS categoria (
    id_categoria INTEGER PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    icono_url VARCHAR(255),
    color_hex VARCHAR(7)
);


-- 4. NODOS DE NAVEGACIÓN (¡OJO! Movido ANTES de POIS)
CREATE TABLE IF NOT EXISTS nodos_navegacion (
    id_nodo INTEGER PRIMARY KEY AUTO_INCREMENT,
    latitud DECIMAL(10, 8) NOT NULL,
    longitud DECIMAL(11, 8) NOT NULL
);

-- 5. RUTAS/TRAMOS (Depende de Nodos)
CREATE TABLE IF NOT EXISTS rutas_tramos (
    id_tramo INTEGER PRIMARY KEY AUTO_INCREMENT,
    id_nodo_origen INTEGER NOT NULL,
    id_nodo_destino INTEGER NOT NULL,
    distancia_metros DECIMAL(10, 2),
    es_accesible BOOLEAN DEFAULT 1,
    tipo_terreno VARCHAR(50) DEFAULT 'asfalto',
    FOREIGN KEY (id_nodo_origen) REFERENCES nodos_navegacion(id_nodo) ON DELETE CASCADE,
    FOREIGN KEY (id_nodo_destino) REFERENCES nodos_navegacion(id_nodo) ON DELETE CASCADE
);

-- 6. POIS (Ahora sí, porque Nodos y Categorías ya existen)
CREATE TABLE IF NOT EXISTS pois (
    id_poi INTEGER PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    latitud DECIMAL(10, 8) NOT NULL,
    longitud DECIMAL(11, 8) NOT NULL,
    id_categoria INTEGER NOT NULL,
    es_accesible BOOLEAN DEFAULT 0,
    imagen_url VARCHAR(255),
    id_nodo_acceso INTEGER,
    id_usuario INTEGER NULL,
    FOREIGN KEY (id_nodo_acceso) REFERENCES nodos_navegacion(id_nodo) ON DELETE SET NULL,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);


-- 11. TRADUCCIONES (Independiente lógicamente, referencialmente débil)
CREATE TABLE IF NOT EXISTS traducciones (
    id_traduccion INTEGER PRIMARY KEY AUTO_INCREMENT,
    tabla_origen VARCHAR(50) NOT NULL,
    id_registro_origen INTEGER NOT NULL,
    codigo_idioma VARCHAR(5) NOT NULL,
    campo_traducido VARCHAR(50) NOT NULL,
    texto TEXT NOT NULL,
    UNIQUE(tabla_origen, id_registro_origen, codigo_idioma, campo_traducido)
);

-- 12. COMUNIDAD (Publicaciones)
CREATE TABLE IF NOT EXISTS comunidad (
    id_publicacion INTEGER PRIMARY KEY AUTO_INCREMENT,
    id_usuario INTEGER NOT NULL,
    texto TEXT,
    foto VARCHAR(255),
    fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    likes INTEGER DEFAULT 0,
    tipo_publicacion VARCHAR(20) DEFAULT 'popular', -- Valores: 'oficial', 'fanzone', 'popular'
    ubicacion VARCHAR(255),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- 13. AMIGOS (Relación muchos a muchos entre usuarios)
CREATE TABLE IF NOT EXISTS amigos (
    id_usuario INTEGER NOT NULL,
    id_amigo INTEGER NOT NULL,
    fecha_amistad DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_usuario, id_amigo),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_amigo) REFERENCES usuario(id_usuario)
);

-- 13. CÓDIGOS QR (Depende de Nodos)
CREATE TABLE IF NOT EXISTS qr_codes (
    id_qr INTEGER PRIMARY KEY AUTO_INCREMENT,
    slug VARCHAR(100) NOT NULL,    
    id_nodo_inicio INTEGER NOT NULL,        
    ruta_archivo_qr VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT 1,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_nodo_inicio) REFERENCES nodos_navegacion(id_nodo) ON DELETE CASCADE
);

-- 14. LISTAS DE USUARIOS
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

CREATE TABLE IF NOT EXISTS lista_likes (
    id_lista INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha_like TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_lista, id_usuario),
    FOREIGN KEY (id_lista) REFERENCES listas(id_lista) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lista_pois (
    id_lista INT NOT NULL,
    id_poi INT NOT NULL,
    orden INT NOT NULL,
    PRIMARY KEY (id_lista, id_poi),
    FOREIGN KEY (id_lista) REFERENCES listas(id_lista) ON DELETE CASCADE,
    FOREIGN KEY (id_poi) REFERENCES pois(id_poi) ON DELETE CASCADE
);

-- 15. SEGUIDORES (Sistema follow/unfollow unidireccional)
CREATE TABLE IF NOT EXISTS seguidores (
    id_seguidor INTEGER NOT NULL,
    id_seguido  INTEGER NOT NULL,
    fecha_seguimiento DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_seguidor, id_seguido),
    FOREIGN KEY (id_seguidor) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_seguido)  REFERENCES usuario(id_usuario) ON DELETE CASCADE
);
