-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: charityevents_db
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Fun Run','Charity running events'),(2,'Gala Dinner','Elegant fundraising dinners'),(3,'Silent Auction','Silent auction events'),(4,'Concert','Charity music concerts'),(5,'Workshop','Educational workshops');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_registrations`
--

DROP TABLE IF EXISTS `event_registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_registrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `ticket_quantity` int NOT NULL,
  `registration_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_event` (`user_email`,`event_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `event_registrations_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  CONSTRAINT `event_registrations_chk_1` CHECK ((`ticket_quantity` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_registrations`
--

LOCK TABLES `event_registrations` WRITE;
/*!40000 ALTER TABLE `event_registrations` DISABLE KEYS */;
INSERT INTO `event_registrations` VALUES (1,1,'Alice Smith','alice@example.com','0412345678',2,'2025-10-17 08:18:04'),(2,1,'Bob Johnson','bob@example.com','0423456789',1,'2025-10-17 08:18:04'),(3,2,'Charlie Brown','charlie@example.com','0434567890',2,'2025-10-17 08:18:04'),(4,3,'Diana Prince','diana@example.com','0445678901',1,'2025-10-17 08:18:04'),(5,4,'Ethan Hunt','ethan@example.com','0456789012',3,'2025-10-17 08:18:04'),(6,5,'Fiona Gallagher','fiona@example.com','0467890123',1,'2025-10-17 08:18:04'),(7,6,'George Clooney','george@example.com','0478901234',2,'2025-10-17 08:18:04'),(8,7,'Hannah Montana','hannah@example.com','0489012345',1,'2025-10-17 08:18:04'),(9,8,'Ian Somerhalder','ian@example.com','0490123456',2,'2025-10-17 08:18:04'),(10,2,'Julia Roberts','julia@example.com','0401234567',3,'2025-10-17 08:18:04');
/*!40000 ALTER TABLE `event_registrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `full_description` text,
  `event_date` datetime NOT NULL,
  `location` varchar(255) NOT NULL,
  `category_id` int DEFAULT NULL,
  `ticket_price` decimal(10,2) DEFAULT NULL,
  `goal_amount` decimal(10,2) DEFAULT NULL,
  `current_amount` decimal(10,2) DEFAULT '0.00',
  `image_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `latitude` decimal(10,6) DEFAULT NULL,
  `longitude` decimal(10,6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'City Charity Run 2025','5km running event','Join our 5km run...','2025-10-15 08:00:00','Central Park',1,25.00,50000.00,32500.00,'/images/run.jpg',1,'2025-10-17 08:18:04',-33.868800,151.209300),(2,'Night of Hope Gala Dinner','Elegant dinner','Dress up for...','2025-11-20 19:00:00','Royal Hotel Ballroom',2,150.00,100000.00,75000.00,'/images/gala.jpg',1,'2025-10-17 08:18:04',-33.873100,151.207000),(3,'Art Silent Auction','Auction for youth','Browse art...','2025-09-30 18:00:00','City Art Center',3,0.00,20000.00,12500.00,'/images/auction.jpg',1,'2025-10-17 08:18:04',-33.880600,151.210000),(4,'Love Concert','Music for animals','Enjoy bands...','2025-10-05 19:30:00','Riverside Concert Hall',4,30.00,30000.00,18000.00,'/images/concert.jpg',1,'2025-10-17 08:18:04',-33.875600,151.205000),(5,'Coding Workshop','Free coding class','Learn coding...','2025-09-25 10:00:00','Technology Park',5,0.00,15000.00,8500.00,'/images/workshop.jpg',1,'2025-10-17 08:18:04',-33.890000,151.220000),(6,'Beach Cleanup Day','Clean marine','Help clean...','2025-10-12 09:00:00','Sunshine Beach',5,0.00,5000.00,3200.00,'/images/beach.jpg',1,'2025-10-17 08:18:04',-33.870000,151.280000),(7,'Winter Warmth Donation','Clothes for homeless','Collect clothes...','2025-11-05 10:00:00','Community Center',5,0.00,8000.00,4500.00,'/images/winter.jpg',1,'2025-10-17 08:18:04',-33.865000,151.215000),(8,'Christmas Charity Market','Festive market','Buy gifts...','2025-12-14 11:00:00','City Square',3,0.00,25000.00,12000.00,'/images/market.jpg',1,'2025-10-17 08:18:04',-33.871000,151.206000);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-17 16:23:06
