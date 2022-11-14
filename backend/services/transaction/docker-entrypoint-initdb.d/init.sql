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
  `transaction_id` int AUTO_INCREMENT NOT NULL,
  `transaction_date` datetime NOT NULL,
  `customer_id` varchar(64) NOT NULL,
  `value_before` float NOT NULL,
  `value_after` float NOT NULL,
  `value_roundup` float NOT NULL,
  PRIMARY KEY (`transaction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `transaction`
--
COMMIT;