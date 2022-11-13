-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+08:00";
 SET GLOBAL event_scheduler = "ON";
--
-- Database: `roundup`
--
CREATE DATABASE IF NOT EXISTS `roundup` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `roundup`;

-- --------------------------------------------------------

--
-- Table structure for table `roundup`
--

DROP TABLE IF EXISTS `roundup`;
CREATE TABLE IF NOT EXISTS `roundup` (
  `roundup_date` varchar(64) NOT NULL,
  `customer_id` varchar(64) NOT NULL,
  `total` float NOT NULL,
  PRIMARY KEY (`customer_id`, `roundup_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `roundup`
--

INSERT INTO `roundup` (`roundup_date`,`customer_id`, `total`) VALUES
("2021-12-12 15:00:00", "ABC123", 0.5);
;

COMMIT;