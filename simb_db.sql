-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Apr 28, 2024 at 02:36 PM
-- Server version: 5.7.39
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `simb_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `motor_type`
--

CREATE TABLE `motor_type` (
  `uuid` varchar(36) NOT NULL,
  `name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `motor_type`
--

INSERT INTO `motor_type` (`uuid`, `name`) VALUES
('0e8f018c-4803-45bd-b890-ef072ca08867', 'Ban'),
('6da37bf9-e5fb-4b6c-b68c-f3af108a78b9', 'Lampu');

-- --------------------------------------------------------

--
-- Table structure for table `restock`
--

CREATE TABLE `restock` (
  `uuid` varchar(36) NOT NULL,
  `uuid_user` varchar(36) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `total_price` decimal(18,2) DEFAULT NULL,
  `is_paid` tinyint(1) DEFAULT NULL,
  `supplier` varchar(50) DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `restock`
--

INSERT INTO `restock` (`uuid`, `uuid_user`, `date`, `total_price`, `is_paid`, `supplier`, `phone_number`, `created_at`, `updated_at`) VALUES
('597f04d0-80f8-4111-bd5a-6a946b68da67', '01ed5bd1-f270-428e-8f81-7026156c9ccb', '2024-04-28', '20000.00', 0, 'Astra', '0', '2024-04-28 02:48:45', '2024-04-28 12:28:40');

-- --------------------------------------------------------

--
-- Table structure for table `restock_detail`
--

CREATE TABLE `restock_detail` (
  `uuid_restock` varchar(36) NOT NULL,
  `uuid_sparepart` varchar(36) NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `buy_price` decimal(18,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `restock_detail`
--

INSERT INTO `restock_detail` (`uuid_restock`, `uuid_sparepart`, `quantity`, `buy_price`) VALUES
('597f04d0-80f8-4111-bd5a-6a946b68da67', '3504abe6-9e57-40ea-a37e-8059357c6287', 1, '10000.00'),
('597f04d0-80f8-4111-bd5a-6a946b68da67', '54969504-9f55-4c34-9998-25fc2401933c', 1, '10000.00');

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `uuid` varchar(36) NOT NULL,
  `date` date DEFAULT NULL,
  `uuid_user` varchar(36) DEFAULT NULL,
  `customer_name` varchar(50) DEFAULT NULL,
  `customer_phone_number` varchar(15) DEFAULT NULL,
  `sales_type` enum('individu','garage_shop','service') DEFAULT NULL,
  `total_price` decimal(18,2) DEFAULT NULL,
  `discount` int(11) DEFAULT NULL,
  `final_price` decimal(18,2) DEFAULT NULL,
  `is_paid` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`uuid`, `date`, `uuid_user`, `customer_name`, `customer_phone_number`, `sales_type`, `total_price`, `discount`, `final_price`, `is_paid`, `created_at`, `updated_at`) VALUES
('67c0719d-4a21-405e-a142-4e8140a11b6e', '2024-04-28', '01ed5bd1-f270-428e-8f81-7026156c9ccb', 'Saya', '0', 'service', '100000.00', 10, '90000.00', 1, '2024-04-28 11:01:27', '2024-04-28 12:32:45');

-- --------------------------------------------------------

--
-- Table structure for table `sales_detail`
--

CREATE TABLE `sales_detail` (
  `uuid_sales` varchar(36) NOT NULL,
  `uuid_sparepart` varchar(36) NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price` decimal(18,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sales_detail`
--

INSERT INTO `sales_detail` (`uuid_sales`, `uuid_sparepart`, `quantity`, `price`) VALUES
('67c0719d-4a21-405e-a142-4e8140a11b6e', '0b749011-70b1-4760-b184-2f8f2d96d5b0', 1, '10000.00');

-- --------------------------------------------------------

--
-- Table structure for table `sparepart`
--

CREATE TABLE `sparepart` (
  `uuid` varchar(36) NOT NULL,
  `partnumber` varchar(50) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `uuid_sparepart_type` varchar(36) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price` decimal(18,2) DEFAULT NULL,
  `garage_price` decimal(18,2) DEFAULT NULL,
  `install_price` decimal(18,2) DEFAULT NULL,
  `shelf_location` varchar(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sparepart`
--

INSERT INTO `sparepart` (`uuid`, `partnumber`, `name`, `uuid_sparepart_type`, `quantity`, `price`, `garage_price`, `install_price`, `shelf_location`, `created_at`, `updated_at`) VALUES
('0b749011-70b1-4760-b184-2f8f2d96d5b0', 'satu', 'dua', NULL, 1, '10000.00', '20000.00', '10000.00', 'tiga', '2024-04-27 12:48:29', '2024-04-27 12:48:29'),
('3504abe6-9e57-40ea-a37e-8059357c6287', 'satu', 'dua', NULL, 1, '10000.00', '20000.00', '10000.00', 'tiga', '2024-04-27 12:49:22', '2024-04-27 12:49:22'),
('54969504-9f55-4c34-9998-25fc2401933c', 'satu', 'dua', NULL, 1, '10000.00', '20000.00', '10000.00', 'tiga', '2024-04-27 12:39:44', '2024-04-27 12:39:44'),
('63a8cfab-3b6b-4a26-aeb7-a1a5dbf8f0b0', 'satu', 'dua', NULL, 1, '10000.00', '20000.00', '10000.00', 'tiga', '2024-04-27 12:45:51', '2024-04-27 12:45:51'),
('891802e7-1e29-4598-aba3-88ae83dfdb2e', 'satu', 'dua', NULL, 1, '10000.00', '20000.00', '10000.00', 'tiga', '2024-04-27 12:47:51', '2024-04-27 12:47:51'),
('8c564e01-3b06-4b9f-8f94-7518bc826aea', 'satu', 'dua', NULL, 1, '10000.00', '20000.00', '10000.00', 'tiga', '2024-04-27 12:49:07', '2024-04-27 12:49:07'),
('8df8a099-5095-48f1-84c5-784d8a813cfe', 'tiga', 'dua', '5498e0ad-bff6-4c2a-910b-f09fcdcab1e6', 1, '10000.00', '10000.00', '10000.00', 'dua', '2024-04-26 13:52:07', '2024-04-26 13:52:07'),
('b366fc08-6e45-4db1-ab3f-647b38ed1a7b', 'tiga', 'tiga', '5498e0ad-bff6-4c2a-910b-f09fcdcab1e6', 1, '10000.00', '10000.00', '10000.00', 'dua', '2024-04-26 13:53:14', '2024-04-26 13:53:14'),
('bf1548f3-7e9e-4dd7-80dd-8378857ea778', 'satu', 'dua', NULL, 1, '10000.00', '20000.00', '10000.00', 'tiga', '2024-04-27 12:48:02', '2024-04-27 12:48:02');

-- --------------------------------------------------------

--
-- Table structure for table `sparepart_detail`
--

CREATE TABLE `sparepart_detail` (
  `uuid_sparepart` varchar(36) NOT NULL,
  `uuid_motor_type` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sparepart_detail`
--

INSERT INTO `sparepart_detail` (`uuid_sparepart`, `uuid_motor_type`) VALUES
('8df8a099-5095-48f1-84c5-784d8a813cfe', '0e8f018c-4803-45bd-b890-ef072ca08867'),
('b366fc08-6e45-4db1-ab3f-647b38ed1a7b', '0e8f018c-4803-45bd-b890-ef072ca08867'),
('8df8a099-5095-48f1-84c5-784d8a813cfe', '6da37bf9-e5fb-4b6c-b68c-f3af108a78b9'),
('b366fc08-6e45-4db1-ab3f-647b38ed1a7b', '6da37bf9-e5fb-4b6c-b68c-f3af108a78b9');

-- --------------------------------------------------------

--
-- Table structure for table `sparepart_motor_type`
--

CREATE TABLE `sparepart_motor_type` (
  `uuid` varchar(36) NOT NULL,
  `name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sparepart_motor_type`
--

INSERT INTO `sparepart_motor_type` (`uuid`, `name`) VALUES
('42abe055-7a31-4504-8265-501e0a5f2f2e', 'Lampu'),
('a88238a7-01ad-4441-a58f-27c5bbd5fd70', 'Lampu');

-- --------------------------------------------------------

--
-- Table structure for table `sparepart_type`
--

CREATE TABLE `sparepart_type` (
  `uuid` varchar(36) NOT NULL,
  `name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sparepart_type`
--

INSERT INTO `sparepart_type` (`uuid`, `name`) VALUES
('5498e0ad-bff6-4c2a-910b-f09fcdcab1e6', 'Ban'),
('682e0cfc-95f7-4532-8d06-95d7f0d16c8e', 'Aki'),
('8b71baa1-1af6-4ff8-aea2-ab68fbc73c87', 'Lampu'),
('cf271dd4-2821-4a84-9003-c5c1146f413d', 'Lampu');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `uuid` varchar(36) NOT NULL,
  `username` varchar(30) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `rolename` enum('admin','superadmin') DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`uuid`, `username`, `password`, `name`, `rolename`, `phone_number`) VALUES
('01ed5bd1-f270-428e-8f81-7026156c9ccb', 'superadmin', '$2b$10$s59ePDHI9yzVdhWiabgLvOhrYdaA91nqYdlN5B8YdwNST45Y8LtmO', 'Superadmin', 'superadmin', '0'),
('2502334a-9d7d-42e8-97da-d524cda76b80', 'admin', '$2b$10$4SfCKwZi87oVdHev1pN3fuvye11sa8NoasXij3ldlVcteLGdsi68q', 'Admin', 'admin', '1');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `motor_type`
--
ALTER TABLE `motor_type`
  ADD PRIMARY KEY (`uuid`);

--
-- Indexes for table `restock`
--
ALTER TABLE `restock`
  ADD PRIMARY KEY (`uuid`),
  ADD KEY `uuid_user` (`uuid_user`);

--
-- Indexes for table `restock_detail`
--
ALTER TABLE `restock_detail`
  ADD PRIMARY KEY (`uuid_restock`,`uuid_sparepart`),
  ADD KEY `uuid_sparepart` (`uuid_sparepart`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`uuid`),
  ADD KEY `uuid_user` (`uuid_user`);

--
-- Indexes for table `sales_detail`
--
ALTER TABLE `sales_detail`
  ADD PRIMARY KEY (`uuid_sales`,`uuid_sparepart`),
  ADD KEY `uuid_sparepart` (`uuid_sparepart`);

--
-- Indexes for table `sparepart`
--
ALTER TABLE `sparepart`
  ADD PRIMARY KEY (`uuid`),
  ADD KEY `uuid_sparepart_type` (`uuid_sparepart_type`);

--
-- Indexes for table `sparepart_detail`
--
ALTER TABLE `sparepart_detail`
  ADD PRIMARY KEY (`uuid_sparepart`,`uuid_motor_type`),
  ADD KEY `uuid_motor_type` (`uuid_motor_type`);

--
-- Indexes for table `sparepart_motor_type`
--
ALTER TABLE `sparepart_motor_type`
  ADD PRIMARY KEY (`uuid`);

--
-- Indexes for table `sparepart_type`
--
ALTER TABLE `sparepart_type`
  ADD PRIMARY KEY (`uuid`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`uuid`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `restock`
--
ALTER TABLE `restock`
  ADD CONSTRAINT `restock_ibfk_1` FOREIGN KEY (`uuid_user`) REFERENCES `user` (`uuid`);

--
-- Constraints for table `restock_detail`
--
ALTER TABLE `restock_detail`
  ADD CONSTRAINT `restock_detail_ibfk_1` FOREIGN KEY (`uuid_restock`) REFERENCES `restock` (`uuid`),
  ADD CONSTRAINT `restock_detail_ibfk_2` FOREIGN KEY (`uuid_sparepart`) REFERENCES `sparepart` (`uuid`);

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`uuid_user`) REFERENCES `user` (`uuid`);

--
-- Constraints for table `sales_detail`
--
ALTER TABLE `sales_detail`
  ADD CONSTRAINT `sales_detail_ibfk_1` FOREIGN KEY (`uuid_sales`) REFERENCES `sales` (`uuid`),
  ADD CONSTRAINT `sales_detail_ibfk_2` FOREIGN KEY (`uuid_sparepart`) REFERENCES `sparepart` (`uuid`);

--
-- Constraints for table `sparepart`
--
ALTER TABLE `sparepart`
  ADD CONSTRAINT `sparepart_ibfk_1` FOREIGN KEY (`uuid_sparepart_type`) REFERENCES `sparepart_type` (`uuid`);

--
-- Constraints for table `sparepart_detail`
--
ALTER TABLE `sparepart_detail`
  ADD CONSTRAINT `sparepart_detail_ibfk_1` FOREIGN KEY (`uuid_sparepart`) REFERENCES `sparepart` (`uuid`),
  ADD CONSTRAINT `sparepart_detail_ibfk_2` FOREIGN KEY (`uuid_motor_type`) REFERENCES `motor_type` (`uuid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
