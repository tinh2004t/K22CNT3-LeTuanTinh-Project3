-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 22, 2025 at 09:52 AM
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
(1, 'A101', 0, 88, 'Cho thuê'),
(2, 'A102', 1, 80, 'Trống'),
(3, 'B201', 2, 65, 'Cho thuê'),
(4, 'B202', 2, 70, 'Đã có chủ'),
(5, 'C301', 0, 61.51, 'Trống'),
(6, 'A103', 1, 85, 'Trống'),
(8, 'A111', 0, 92.5, 'Đã có chủ'),
(10, 'T101', 0, 89, 'Trống'),
(13, 'D222', 0, 255, 'Không khả dụng');

-- --------------------------------------------------------

--
-- Table structure for table `complaints`
--

CREATE TABLE `complaints` (
  `id` bigint(20) NOT NULL,
  `status` varchar(255) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `description` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `complaints`
--

INSERT INTO `complaints` (`id`, `status`, `user_id`, `created_at`, `description`, `title`) VALUES
(1, 'RESOLVED', 1, '2025-03-22 10:00:00.000000', 'Khu B bị mất nước từ sáng', 'Mất nước'),
(2, 'in_progress', 2, '2025-03-21 15:30:00.000000', 'Thang máy số 3 không hoạt động', 'Thang máy hỏng'),
(3, 'resolved', 3, '2025-03-20 08:45:00.000000', 'Không còn chỗ gửi xe máy vào buổi tối', 'Bãi xe đầy'),
(4, 'pending', 4, '2025-03-19 20:15:00.000000', 'Đèn hành lang tầng 5 lúc sáng lúc tắt', 'Sự cố điện'),
(5, 'in_progress', 5, '2025-03-18 12:00:00.000000', 'Khu A chưa được thu gom rác hai ngày nay', 'Vệ sinh môi trường'),
(6, 'Pending', 1, '2025-03-22 15:42:30.000000', 'qưqwe', '122121');

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
(14, 12212, '2025-03-21', 'DA_THANH_TOAN', 2),
(15, 123123, '2025-03-21', 'DA_THANH_TOAN', 2),
(16, 123123, '2025-03-21', 'DA_THANH_TOAN', 2),
(17, 123333, '2025-03-21', 'CHUA_THANH_TOAN', 2),
(18, 3500000, '2025-03-27', 'CHUA_THANH_TOAN', 6),
(19, 640000, '2025-04-22', 'CHUA_THANH_TOAN', 12),
(20, 1200000, '2025-03-25', 'DA_THANH_TOAN', 12);

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
(1, '2025-02-28 15:24:05.000000', 'Hệ thống sẽ bảo trì vào lúc 22h tối nay.', 'Thông báo bảo trì', 1),
(7, '2025-03-19 13:59:18.000000', 'Dịch vụ vệ sinh định kỳ sẽ được thực hiện vào ngày mai.', 'Dịch vụ vệ sinh', 3),
(8, '2025-03-04 13:59:24.000000', 'Hệ thống nước sẽ bị gián đoạn từ 14h đến 16h.', 'Thông báo gián đoạn nước', 1),
(9, '2025-03-06 13:59:28.000000', 'Cư dân vui lòng kiểm tra và thanh toán phí dịch vụ trước ngày 05/03.', 'Nhắc nhở thanh toán', 4),
(10, '2025-03-15 13:59:42.000000', 'Sự kiện Trung thu sẽ được tổ chức vào ngày 10/03 tại sảnh chính.', 'Sự kiện Trung thu', 5);

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
(4, 1500000, 'MOMO', '2025-02-25', 2),
(6, 500, 'MOMO', '2025-03-21', 2),
(7, 123, 'MOMO', '2025-03-21', 4),
(8, 122, 'MOMO', '2025-03-21', 3),
(9, 22222, 'MOMO', '2025-03-21', 3),
(10, 123123, 'MOMO', '2025-03-21', 16),
(11, 12212, 'MOMO', '2025-03-21', 14),
(12, 123123, 'MOMO', '2025-03-21', 16),
(13, 123123, 'MOMO', '2025-03-21', 16),
(14, 123123, 'MOMO', '2025-03-21', 16),
(15, 123123, 'MOMO', '2025-03-21', 16),
(16, 123123, 'MOMO', '2025-03-21', 16),
(17, 123123, 'MOMO', '2025-03-21', 16),
(18, 123123, 'MOMO', '2025-03-21', 16),
(19, 123123, 'MOMO', '2025-03-21', 16),
(20, 123123, 'MOMO', '2025-03-21', 16),
(21, 12212, 'MOMO', '2025-03-21', 14),
(22, 123123, 'CHUYEN_KHOAN', '2025-03-21', 15),
(23, 1200000, 'MOMO', '2025-03-21', 20);

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
(1, 'Nguyen Van Binh', '0000009999', 'nguyenvanb@example.com', 2),
(2, 'Tran Thi B', '0978123456', 'b@example.com', 2),
(3, 'Le Van C', '0967543210', 'c@example.com', 3),
(4, 'Pham Thi D', '0956432109', 'd@example.com', 4),
(5, 'Hoang Van E', '0945321098', 'e@example.com', 5),
(6, 'Le Tuan Tinh', '0912345678', 'nguyenvana@example.com', 1),
(12, 'Phan Thị Yến', '0912286302', 'tinh2426@gmail.com', 2);

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
(1, 'Internet', 'Dịch vụ mạng tốc độ o 6Gg', 300000.00),
(2, 'Dịch vụ vệ sinh', 'Dịch vụ vệ sinh chung cư', 150000.00),
(3, 'Máy lạnh', 'Máy lạnh 2 chiều', 500000.00),
(4, 'Camera ', 'Camera an ninh 24/7', 20000.00),
(5, 'Bảo vệ', 'Bảo vệ tòa nhà', 100000.00);

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
(2, 600, '2025-12-31', '2025-01-01', 2, 1),
(6, 340000, '2025-04-11', '2025-03-26', 3, 4),
(12, 500, '2025-12-31', '2025-01-01', 2, 1),
(13, 750000, '2025-03-24', '2025-03-20', 6, 2),
(16, 9300000, '2025-04-30', '2025-03-31', 10, 1),
(18, 3500000, '2025-03-27', '2025-03-21', 3, 3),
(19, 640000, '2025-04-22', '2025-03-22', 10, 4),
(20, 640000, '2025-04-22', '2025-03-22', 3, 4),
(21, 1200000, '2025-03-25', '2025-03-22', 1, 1),
(22, 640000, '2025-04-22', '2025-03-22', 13, 4);

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
(2, 'asd@example.com', 'Test umee', '$2a$10$hAg25kJENLRLacOkAMIwcuXkvTZEwEYFhwAOToz.1y5YWKUltYdWC', 'ADMIN', 'tinh2004'),
(3, 'rtrt@ff.cc', 'Osd', '$2a$10$ym.zIOLOkj/dWxjZjl.WouvGs9QMcuEyyzDQrioPUI4xpY5cSmEbW', 'USER', 'tuaantiinhh'),
(4, 'khumco@ddd.ca', 'tinhdayne', '$2a$10$AKcaL3TRBv5a8KmMs83zQOYSvre2weSzL2ZYO4AkxuCqldJo/jxoy', 'USER', 'hembic'),
(5, 'dum@dum.com', 'Dum nè', '$2a$10$op1eY/zfW0wta50V6I/X5uQhIIqn/Tweh7AjJDxOLltYMnwHFbL9q', 'USER', 'dumdum'),
(7, 'admin@example.com', 'Admin User', '$2a$10$irY88EaYZz9lHS86ZypiYOW4NSgG4DUuJQ4NtmkQfCqEjTFnLHa5W', 'ADMIN', 'admin');

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
  MODIFY `apartment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `complaints`
--
ALTER TABLE `complaints`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `contracts`
--
ALTER TABLE `contracts`
  MODIFY `contract_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `invoice_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `residents`
--
ALTER TABLE `residents`
  MODIFY `resident_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `service_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `service_fees`
--
ALTER TABLE `service_fees`
  MODIFY `service_fee_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
