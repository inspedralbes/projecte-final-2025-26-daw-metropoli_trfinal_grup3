-- Migración segura: añadir columnas de verificación de email a la tabla usuario
-- Ejecutar una vez sobre una BD ya existente (no destruye datos)

ALTER TABLE usuario
    ADD COLUMN IF NOT EXISTS email_verificado  BOOLEAN      DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS token_verificacion VARCHAR(255) NULL;
