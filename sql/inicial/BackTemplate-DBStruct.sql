CREATE DATABASE  IF NOT EXISTS `invest-project` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `invest-project`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: invest-project
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


--
-- Table structure for table `Derechos`
--

DROP TABLE IF EXISTS `Derechos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Derechos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clave` varchar(40) NOT NULL,
  `nombre` varchar(40) NOT NULL,
  `parentId` int DEFAULT NULL,
  `esTitulo` int DEFAULT '0',
  `orden` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `clave` (`clave`),
  KEY `parentId` (`parentId`),
  CONSTRAINT `derechos_ibfk_1` FOREIGN KEY (`parentId`) REFERENCES `Derechos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `DerechosRoles`
--

DROP TABLE IF EXISTS `DerechosRoles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DerechosRoles` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `DerechoId` int NOT NULL,
  `RolId` int NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `DerechosRoles_Derechos_idx` (`DerechoId`),
  KEY `DerechosRoles_Roles_idx` (`RolId`),
  CONSTRAINT `DerechosRoles_Derechos` FOREIGN KEY (`DerechoId`) REFERENCES `Derechos` (`id`),
  CONSTRAINT `DerechosRoles_Roles` FOREIGN KEY (`RolId`) REFERENCES `Roles` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Emisores`
--

DROP TABLE IF EXISTS `Emisores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Emisores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Instrumentos`
--

DROP TABLE IF EXISTS `Instrumentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Instrumentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipoInstrumentoId` int NOT NULL,
  `emisorId` int NOT NULL,
  `ticker` varchar(10) NOT NULL,
  `notas` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `TickerUnique` (`ticker`),
  KEY `Instrumento_Emisor_idx` (`emisorId`),
  KEY `Instrumento_Tipo_idx` (`tipoInstrumentoId`),
  CONSTRAINT `Instrumento_Emisor` FOREIGN KEY (`emisorId`) REFERENCES `Emisores` (`id`),
  CONSTRAINT `Instrumento_Tipo` FOREIGN KEY (`tipoInstrumentoId`) REFERENCES `TiposInstrumentos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `MigracionesAplicadas`
--

DROP TABLE IF EXISTS `MigracionesAplicadas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MigracionesAplicadas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombreArchivo` varchar(255) NOT NULL,
  `fechaAplicacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `aplicadoPor` varchar(255) DEFAULT NULL,
  `comentario` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombreArchivo` (`nombreArchivo`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `Roles`
--

DROP TABLE IF EXISTS `Roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Roles` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(30) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `RolesUsuarios`
--

DROP TABLE IF EXISTS `RolesUsuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RolesUsuarios` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UsuarioId` int NOT NULL,
  `RolId` int NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `RolesUsuarios_Roles_idx` (`RolId`),
  KEY `RolesUsuarios_Usuarios_idx` (`UsuarioId`),
  CONSTRAINT `RolesUsuarios_Roles` FOREIGN KEY (`RolId`) REFERENCES `Roles` (`Id`),
  CONSTRAINT `RolesUsuarios_Usuarios` FOREIGN KEY (`UsuarioId`) REFERENCES `Usuarios` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TiposInstrumentos`
--

DROP TABLE IF EXISTS `TiposInstrumentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TiposInstrumentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) NOT NULL,
  `clase` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Usuarios`
--

DROP TABLE IF EXISTS `Usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Usuarios` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Mail` varchar(60) NOT NULL,
  `Nombre` varchar(30) NOT NULL,
  `Password` varchar(64) NOT NULL,
  `RefreshToken` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  UNIQUE KEY `mail_Unique` (`Mail`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-04 22:54:34
