-- 1. USUARIOS (Independiente)
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) DEFAULT 'visitante',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. CATEGORIAS (Independiente)
CREATE TABLE IF NOT EXISTS categoria (
    id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(50) NOT NULL,
    icono_url VARCHAR(255),
    color_hex VARCHAR(7)
);

-- 3. EVENTOS (Independiente)
CREATE TABLE IF NOT EXISTS eventos (
    id_evento INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    foto VARCHAR(255),
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    estado VARCHAR(20) DEFAULT 'programado'
);

-- 4. NODOS DE NAVEGACIÓN (¡OJO! Movido ANTES de POIS)
CREATE TABLE IF NOT EXISTS nodos_navegacion (
    id_nodo INTEGER PRIMARY KEY AUTOINCREMENT,
    latitud DECIMAL(10, 8) NOT NULL,
    longitud DECIMAL(11, 8) NOT NULL,
    descripcion VARCHAR(100)
);

-- 5. RUTAS/TRAMOS (Depende de Nodos)
CREATE TABLE IF NOT EXISTS rutas_tramos (
    id_tramo INTEGER PRIMARY KEY AUTOINCREMENT,
    id_nodo_origen INTEGER NOT NULL,
    id_nodo_destino INTEGER NOT NULL,
    distancia_metros DECIMAL(10, 2),
    es_accesible BOOLEAN DEFAULT 1,
    tipo_terreno VARCHAR(50) DEFAULT 'asfalto',
    es_bidireccional BOOLEAN DEFAULT 1, -- Coma añadida
    FOREIGN KEY (id_nodo_origen) REFERENCES nodos_navegacion(id_nodo),
    FOREIGN KEY (id_nodo_destino) REFERENCES nodos_navegacion(id_nodo)
);

-- 6. POIS (Ahora sí, porque Nodos y Categorías ya existen)
CREATE TABLE IF NOT EXISTS pois (
    id_poi INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    latitud DECIMAL(10, 8) NOT NULL,
    longitud DECIMAL(11, 8) NOT NULL,
    id_categoria INTEGER NOT NULL,
    es_accesible BOOLEAN DEFAULT 0,
    es_fijo BOOLEAN DEFAULT 1,
    imagen_url VARCHAR(255),
    id_nodo_acceso INTEGER, -- Coma añadida
    FOREIGN KEY (id_nodo_acceso) REFERENCES nodos_navegacion(id_nodo), -- Coma añadida
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);

-- 7. EVENTO_POI_CONFIG (Depende de Eventos y Pois)
CREATE TABLE IF NOT EXISTS evento_poi_config (
    id_evento INTEGER,
    id_poi INTEGER,
    estado VARCHAR(20) DEFAULT 'disponible',
    PRIMARY KEY (id_evento, id_poi),
    FOREIGN KEY (id_evento) REFERENCES eventos(id_evento),
    FOREIGN KEY (id_poi) REFERENCES pois(id_poi)
);

-- 8. HORARIOS DETALLADOS (Depende de Pois y Eventos)
CREATE TABLE IF NOT EXISTS poi_horarios (
    id_horario INTEGER PRIMARY KEY AUTOINCREMENT,
    id_poi INTEGER NOT NULL,
    id_evento INTEGER NOT NULL,
    dia_semana VARCHAR(10) NOT NULL,
    hora_apertura TIME NOT NULL,
    hora_cierre TIME NOT NULL,
    FOREIGN KEY (id_poi) REFERENCES pois(id_poi),
    FOREIGN KEY (id_evento) REFERENCES eventos(id_evento)
);

-- 9. MULTIMEDIA (Depende de Pois)
CREATE TABLE IF NOT EXISTS poi_multimedia (
    id_media INTEGER PRIMARY KEY AUTOINCREMENT,
    id_poi INTEGER NOT NULL,
    url_archivo VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) DEFAULT 'imagen',
    titulo VARCHAR(100),
    orden INTEGER DEFAULT 0,
    FOREIGN KEY (id_poi) REFERENCES pois(id_poi)
);

-- 10. INCIDENCIAS (Depende de Pois y Usuarios)
CREATE TABLE IF NOT EXISTS incidencias (
    id_incidencia INTEGER PRIMARY KEY AUTOINCREMENT,
    id_poi INTEGER NOT NULL,
    id_usuario_reporta INTEGER,
    tipo VARCHAR(50) NOT NULL,
    descripcion TEXT,
    fecha_reporte DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'activa',
    FOREIGN KEY (id_poi) REFERENCES pois(id_poi),
    FOREIGN KEY (id_usuario_reporta) REFERENCES usuario(id_usuario)
);

-- 11. TRADUCCIONES (Independiente lógicamente, referencialmente débil)
CREATE TABLE IF NOT EXISTS traducciones (
    id_traduccion INTEGER PRIMARY KEY AUTOINCREMENT,
    tabla_origen VARCHAR(50) NOT NULL,
    id_registro_origen INTEGER NOT NULL,
    codigo_idioma VARCHAR(5) NOT NULL,
    campo_traducido VARCHAR(50) NOT NULL,
    texto TEXT NOT NULL,
    UNIQUE(tabla_origen, id_registro_origen, codigo_idioma, campo_traducido)
);

-- 12. COMUNIDAD (Publicaciones)
CREATE TABLE IF NOT EXISTS comunidad (
    id_publicacion INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    texto TEXT,
    foto VARCHAR(255),
    fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    likes INTEGER DEFAULT 0,
    tipo_publicacion VARCHAR(20) DEFAULT 'popular', -- Valores: 'oficial', 'fanzone', 'popular'
    ubicacion VARCHAR(255),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);
