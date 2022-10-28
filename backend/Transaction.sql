-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+08:00";

--
-- Database: `transaction`
--
CREATE DATABASE IF NOT EXISTS `transaction` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `transaction`;

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;
CREATE TABLE IF NOT EXISTS `transaction` (
  `transaction_id` int NOT NULL,
  `transaction_date` datetime NOT NULL,
  `customer_id` integer NOT NULL,
  `value_before` float NOT NULL,
  `value_after` float NOT NULL,
  `value_roundup` float NOT NULL,
  PRIMARY KEY (`transaction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `transaction`
--

INSERT INTO `transaction` (`transaction_id`,`transaction_date`, `customer_id`, `value_before`, `value_after`, `value_roundup`) VALUES
(100, "2021-12-12 15:00:00", 0, 2.50, 3.00, 0.5),
(101, "2021-12-24 15:00:00", 0, 20.10, 21.00, 0.9);
;
COMMIT;