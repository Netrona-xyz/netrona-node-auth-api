-- Agrega campos de tracking a Instrumentos y foreign keys hacia Usuarios

ALTER TABLE `Instrumentos`
  ADD COLUMN `createUserId` INT NULL COMMENT 'ID del usuario que creó el registro',
  ADD COLUMN `lastUpdateUserId` INT NULL COMMENT 'ID del usuario que actualizó por última vez',
  ADD COLUMN `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
  ADD COLUMN `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última modificación',
  ADD CONSTRAINT `fk_instrumentos_createUser` FOREIGN KEY (`createUserId`) REFERENCES `Usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_instrumentos_updateUser` FOREIGN KEY (`lastUpdateUserId`) REFERENCES `Usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
