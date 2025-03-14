-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 07, 2025 at 08:18 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hatechno`
--

-- --------------------------------------------------------

--
-- Table structure for table `apartments`
--

CREATE TABLE `apartments` (
  `apartment_id` int(11) NOT NULL,
  `apartment_number` varchar(255) NOT NULL,
  `floor` int(11) NOT NULL,
  `area` float NOT NULL,
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `apartments`
--

INSERT INTO `apartments` (`apartment_id`, `apartment_number`, `floor`, `area`, `status`) VALUES
(1, 'A101', 1, 75.5, 'Đã có chủ'),
(2, 'A102', 1, 80, 'Trống'),
(3, 'B201', 2, 65, 'Cho thuê'),
(4, 'B202', 2, 70, 'Đã có chủ'),
(5, 'C301', 3, 90.5, 'Trống'),
(6, 'A103', 1, 85, 'Trống'),
(8, 'A111', 2, 922.5, 'Đã có chủ');

-- --------------------------------------------------------

--
-- Table structure for table `complaints`
--

CREATE TABLE `complaints` (
  `id` bigint(20) NOT NULL,
  `content` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `description` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contracts`
--

CREATE TABLE `contracts` (
  `contract_id` int(11) NOT NULL,
  `resident_id` int(11) DEFAULT NULL,
  `apartment_id` int(11) DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `contract_type` enum('Mua','Thuê') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contracts`
--

INSERT INTO `contracts` (`contract_id`, `resident_id`, `apartment_id`, `start_date`, `end_date`, `contract_type`) VALUES
(1, 1, 1, '2023-01-01', NULL, 'Mua'),
(2, 2, 2, '2023-02-15', '2025-02-15', 'Thuê'),
(3, 3, 3, '2023-03-10', '2026-03-10', 'Thuê'),
(4, 4, 4, '2023-04-20', NULL, 'Mua'),
(5, 5, 5, '2023-05-05', '2024-05-05', 'Thuê');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `employee_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `role` enum('Admin','Nhân viên','Bảo vệ') NOT NULL,
  `shift_time` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `facilities`
--

CREATE TABLE `facilities` (
  `facility_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `available` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `facilitybookings`
--

CREATE TABLE `facilitybookings` (
  `booking_id` int(11) NOT NULL,
  `resident_id` int(11) DEFAULT NULL,
  `facility_id` int(11) DEFAULT NULL,
  `booking_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `invoice_id` bigint(20) NOT NULL,
  `amount` double DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `status` enum('CHUA_THANH_TOAN','DA_THANH_TOAN','QUA_HAN') DEFAULT NULL,
  `resident_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`invoice_id`, `amount`, `due_date`, `status`, `resident_id`) VALUES
(2, 600000, '2024-03-05', 'DA_THANH_TOAN', 2),
(3, 450000, '2024-03-10', 'QUA_HAN', 3),
(4, 700000, '2024-03-15', 'CHUA_THANH_TOAN', 4),
(5, 550000, '2024-03-20', 'DA_THANH_TOAN', 5),
(6, 2000000, '2025-03-15', 'CHUA_THANH_TOAN', 1);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `message` text NOT NULL,
  `title` varchar(255) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `created_at`, `message`, `title`, `user_id`) VALUES
(1, '2025-02-28 15:24:05.000000', 'Hệ thống sẽ bảo trì vào lúc 22h tối nay.', 'Thông báo bảo trì', 1);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` bigint(20) NOT NULL,
  `amount` double DEFAULT NULL,
  `method` enum('CHUYEN_KHOAN','MOMO','VNPAY','ZALOPAY') DEFAULT NULL,
  `payment_date` date DEFAULT NULL,
  `invoice_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`payment_id`, `amount`, `method`, `payment_date`, `invoice_id`) VALUES
(4, 1500000, 'MOMO', '2025-02-25', 2);

-- --------------------------------------------------------

--
-- Table structure for table `residents`
--

CREATE TABLE `residents` (
  `resident_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `apartment_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `residents`
--

INSERT INTO `residents` (`resident_id`, `full_name`, `phone`, `email`, `apartment_id`) VALUES
(1, 'Nguyen Van B', '022313222', 'nguyenvanb@example.com', 2),
(2, 'Tran Thi B', '0978123456', 'b@example.com', 2),
(3, 'Le Van C', '0967543210', 'c@example.com', 3),
(4, 'Pham Thi D', '0956432109', 'd@example.com', 4),
(5, 'Hoang Van E', '0945321098', 'e@example.com', 5),
(6, 'Le Tuan Tinh', '0912345678', 'nguyenvana@example.com', 1),
(9, 'Nguyen Van Ass', '0987654321', 'nguyenvana@gmail.com', 1);

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `service_id` bigint(20) NOT NULL,
  `service_name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `price` decimal(38,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`service_id`, `service_name`, `description`, `price`) VALUES
(1, 'Internet', 'Dịch vụ mạng tốc độ cao', 300000.00);

-- --------------------------------------------------------

--
-- Table structure for table `service_fees`
--

CREATE TABLE `service_fees` (
  `service_fee_id` bigint(20) NOT NULL,
  `amount` double DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `apartment_id` int(11) NOT NULL,
  `service_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service_fees`
--

INSERT INTO `service_fees` (`service_fee_id`, `amount`, `end_date`, `start_date`, `apartment_id`, `service_id`) VALUES
(2, 500000, '2025-03-31', '2025-03-01', 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `full_name`, `password`, `role`, `username`) VALUES
(1, 'testuser@example.com', 'Test User', '$2a$10$FLuTolZVVxs7RpMQXONNSeCuHVLcwkZy0XUGN2Pie.xfLc4ij6oeW', 'USER', 'testuser'),
(2, 'asd@example.com', 'Test umee', '$2a$10$hAg25kJENLRLacOkAMIwcuXkvTZEwEYFhwAOToz.1y5YWKUltYdWC', 'ADMIN', 'tinh2004');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `apartments`
--
ALTER TABLE `apartments`
  ADD PRIMARY KEY (`apartment_id`),
  ADD UNIQUE KEY `apartment_number` (`apartment_number`);

--
-- Indexes for table `complaints`
--
ALTER TABLE `complaints`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK83j5gqkd7ku4vc908g4rtmglr` (`user_id`);

--
-- Indexes for table `contracts`
--
ALTER TABLE `contracts`
  ADD PRIMARY KEY (`contract_id`),
  ADD KEY `resident_id` (`resident_id`),
  ADD KEY `apartment_id` (`apartment_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`employee_id`);

--
-- Indexes for table `facilities`
--
ALTER TABLE `facilities`
  ADD PRIMARY KEY (`facility_id`);

--
-- Indexes for table `facilitybookings`
--
ALTER TABLE `facilitybookings`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `resident_id` (`resident_id`),
  ADD KEY `facility_id` (`facility_id`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`invoice_id`),
  ADD KEY `FKl97x2bloi4vesrw985f7t0xmp` (`resident_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK9y21adhxn0ayjhfocscqox7bh` (`user_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `FKrbqec6be74wab8iifh8g3i50i` (`invoice_id`);

--
-- Indexes for table `residents`
--
ALTER TABLE `residents`
  ADD PRIMARY KEY (`resident_id`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `apartment_id` (`apartment_id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`service_id`);

--
-- Indexes for table `service_fees`
--
ALTER TABLE `service_fees`
  ADD PRIMARY KEY (`service_fee_id`),
  ADD KEY `FKgfjinut1gmi5nqmk7eymxci4p` (`apartment_id`),
  ADD KEY `FKoc0audhop0nc3r68hts0aahpu` (`service_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  ADD UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `apartments`
--
ALTER TABLE `apartments`
  MODIFY `apartment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `complaints`
--
ALTER TABLE `complaints`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contracts`
--
ALTER TABLE `contracts`
  MODIFY `contract_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `employee_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `facilities`
--
ALTER TABLE `facilities`
  MODIFY `facility_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `facilitybookings`
--
ALTER TABLE `facilitybookings`
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `invoice_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `residents`
--
ALTER TABLE `residents`
  MODIFY `resident_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `service_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `service_fees`
--
ALTER TABLE `service_fees`
  MODIFY `service_fee_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `complaints`
--
ALTER TABLE `complaints`
  ADD CONSTRAINT `FK83j5gqkd7ku4vc908g4rtmglr` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `contracts`
--
ALTER TABLE `contracts`
  ADD CONSTRAINT `contracts_ibfk_1` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`resident_id`),
  ADD CONSTRAINT `contracts_ibfk_2` FOREIGN KEY (`apartment_id`) REFERENCES `apartments` (`apartment_id`);

--
-- Constraints for table `facilitybookings`
--
ALTER TABLE `facilitybookings`
  ADD CONSTRAINT `facilitybookings_ibfk_1` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`resident_id`),
  ADD CONSTRAINT `facilitybookings_ibfk_2` FOREIGN KEY (`facility_id`) REFERENCES `facilities` (`facility_id`);

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `FKl97x2bloi4vesrw985f7t0xmp` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`resident_id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `FK9y21adhxn0ayjhfocscqox7bh` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `FKrbqec6be74wab8iifh8g3i50i` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`invoice_id`);

--
-- Constraints for table `residents`
--
ALTER TABLE `residents`
  ADD CONSTRAINT `residents_ibfk_1` FOREIGN KEY (`apartment_id`) REFERENCES `apartments` (`apartment_id`);

--
-- Constraints for table `service_fees`
--
ALTER TABLE `service_fees`
  ADD CONSTRAINT `FKgfjinut1gmi5nqmk7eymxci4p` FOREIGN KEY (`apartment_id`) REFERENCES `apartments` (`apartment_id`),
  ADD CONSTRAINT `FKoc0audhop0nc3r68hts0aahpu` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
