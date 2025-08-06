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
-- Dumping data for table `Derechos`
--

LOCK TABLES `Derechos` WRITE;
/*!40000 ALTER TABLE `Derechos` DISABLE KEYS */;
INSERT INTO `Derechos` VALUES (1,'usuarios','Usuarios',NULL,1,1),(2,'usuarios.basico','Basico',1,1,1),(3,'usuarios.basico.ver','Ver usuarios',2,0,1),(4,'usuarios.basico.crear','Crear usuarios',2,0,2),(5,'usuarios.avanzado','Avanzado',1,1,2),(6,'usuarios.avanzado.edit','Modificar usuarios',5,0,1),(7,'usuarios.avanzado.elim','Eliminar usuarios',5,0,2),(8,'instrumentos.crear','Crear instrumentos',11,0,1),(9,'instrumentos.modificar','Modificar instrumentos',11,0,2),(10,'instrumentos.borrar','Borrar instrumentos',11,0,3),(11,'instrumentos','Instrumentos',NULL,1,2);
/*!40000 ALTER TABLE `Derechos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `DerechosRoles`
--

LOCK TABLES `DerechosRoles` WRITE;
/*!40000 ALTER TABLE `DerechosRoles` DISABLE KEYS */;
INSERT INTO `DerechosRoles` VALUES (1,1,1),(2,2,1),(3,3,1),(4,4,1),(5,5,1),(6,3,2),(7,4,2),(8,8,1),(9,9,1),(10,11,1);
/*!40000 ALTER TABLE `DerechosRoles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Emisores`
--

LOCK TABLES `Emisores` WRITE;
/*!40000 ALTER TABLE `Emisores` DISABLE KEYS */;
INSERT INTO `Emisores` VALUES (1,'Argentina'),(2,'YPF'),(3,'Apple');
/*!40000 ALTER TABLE `Emisores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Instrumentos`
--

LOCK TABLES `Instrumentos` WRITE;
/*!40000 ALTER TABLE `Instrumentos` DISABLE KEYS */;
INSERT INTO `Instrumentos` VALUES (1,3,2,'MXI33','Nueva nota 2'),(3,1,2,'YMCIO','Contrato xxxx'),(4,1,2,'YMCXO','Contrato yyyy'),(6,1,2,'SS390','');
/*!40000 ALTER TABLE `Instrumentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `MigracionesAplicadas`
--

LOCK TABLES `MigracionesAplicadas` WRITE;
/*!40000 ALTER TABLE `MigracionesAplicadas` DISABLE KEYS */;
/*!40000 ALTER TABLE `MigracionesAplicadas` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Dumping data for table `Roles`
--

LOCK TABLES `Roles` WRITE;
/*!40000 ALTER TABLE `Roles` DISABLE KEYS */;
INSERT INTO `Roles` VALUES (1,'Admin'),(2,'Tecnico'),(3,'Contable');
/*!40000 ALTER TABLE `Roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `RolesUsuarios`
--

LOCK TABLES `RolesUsuarios` WRITE;
/*!40000 ALTER TABLE `RolesUsuarios` DISABLE KEYS */;
INSERT INTO `RolesUsuarios` VALUES (1,1000,1),(2,1001,2),(3,1001,3);
/*!40000 ALTER TABLE `RolesUsuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `TiposInstrumentos`
--

LOCK TABLES `TiposInstrumentos` WRITE;
/*!40000 ALTER TABLE `TiposInstrumentos` DISABLE KEYS */;
INSERT INTO `TiposInstrumentos` VALUES (1,'ON','a1'),(2,'Acciones Argentinas','b1'),(3,'Acciones Extrangeras','b1'),(4,'Bonos Arg U$S','c1');
/*!40000 ALTER TABLE `TiposInstrumentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Usuarios`
--

LOCK TABLES `Usuarios` WRITE;
/*!40000 ALTER TABLE `Usuarios` DISABLE KEYS */;
INSERT INTO `Usuarios` VALUES (1000,'test@fake.com','Mr Fake Test','$2b$08$acec14fHaCXFeG.muIn65.zxU.99VANjCe64EM8W3hCUnFG.vW196',NULL),(1001,'jftd@gmail.com','Juan Fernandez Test Delete','$2b$08$lSniSIyifAYjsNVT/PwxoOEg0/K.8eo9IkTQccmGN8k3y4zX6t16.',NULL);
/*!40000 ALTER TABLE `Usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-04 22:55:26
