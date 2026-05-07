-- Seed additional social data for WeMap
-- This script adds more users and establishes friendships to test the Home screen friends row

-- Create more users
INSERT IGNORE INTO usuario (nombre, email, password_hash, rol, bio) VALUES
('Paula Vera', 'paula@wemap.cat', '$2a$10$7/O9/O9/O9/O9/O9/O9/O9.7O9/O9/O9/O9/O9/O9/O9/O9/O', 'user', 'Amant de les rutes i la tecnologia.'),
('Marc Soler', 'marc@wemap.cat', '$2a$10$7/O9/O9/O9/O9/O9/O9/O9.7O9/O9/O9/O9/O9/O9/O9/O9/O', 'user', 'Explorant cada racó de la metròpoli.'),
('Elena Font', 'elena@wemap.cat', '$2a$10$7/O9/O9/O9/O9/O9/O9/O9.7O9/O9/O9/O9/O9/O9/O9/O9/O', 'user', 'Buscant el millor cafè de la ciutat.'),
('Joan Puig', 'joan@wemap.cat', '$2a$10$7/O9/O9/O9/O9/O9/O9/O9.7O9/O9/O9/O9/O9/O9/O9/O9/O', 'user', 'Història i urbanisme són la meva passió.'),
('Anna Roca', 'anna@wemap.cat', '$2a$10$7/O9/O9/O9/O9/O9/O9/O9.7O9/O9/O9/O9/O9/O9/O9/O9/O', 'user', 'Sempre en moviment, sempre descobrint.');

-- Establish friendships
-- Assuming the last 5 IDs are the ones we just inserted
-- We'll use a more robust way to link them if we knew the IDs, but for seeding we can just do:
INSERT IGNORE INTO amigos (id_usuario, id_amigo)
SELECT u1.id_usuario, u2.id_usuario
FROM usuario u1, usuario u2
WHERE u1.email IN ('paula@wemap.cat', 'marc@wemap.cat', 'elena@wemap.cat', 'joan@wemap.cat', 'anna@wemap.cat')
  AND u2.email IN ('paula@wemap.cat', 'marc@wemap.cat', 'elena@wemap.cat', 'joan@wemap.cat', 'anna@wemap.cat')
  AND u1.id_usuario <> u2.id_usuario;
