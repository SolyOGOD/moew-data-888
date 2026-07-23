CREATE DATABASE IF NOT EXISTS `dog_db`;
USE `dog_db`;

-- Drop tables if they exist
DROP TABLE IF EXISTS `dogs`;
DROP TABLE IF EXISTS `profiles`;
DROP TABLE IF EXISTS `users`;

-- Create users table
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `refresh_token` VARCHAR(255) DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create profiles table
CREATE TABLE `profiles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `display_name` VARCHAR(100) NOT NULL,
  `avatar_url` VARCHAR(255) DEFAULT NULL,
  `bio` TEXT DEFAULT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create dogs table
CREATE TABLE `dogs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `gender` ENUM('Male', 'Female') NOT NULL,
  `color` VARCHAR(50),
  `age` INT, -- in months
  `breed` VARCHAR(100),
  `address` TEXT,
  `status` ENUM('Active', 'Adopted', 'Missing') DEFAULT 'Active',
  `image_url` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert a test user: admin / admin1234
INSERT INTO `users` (`username`, `password_hash`, `email`, `is_active`) VALUES
('admin', '$2b$10$eFytJDGtjbFk4lYmKlmMfeXfO9.n87/9k3P.tWlW17vP7P/0X89n.', 'admin@example.com', 1);

INSERT INTO `profiles` (`user_id`, `display_name`) VALUES
(1, 'Admin');

-- Insert seed data for dogs
INSERT INTO `dogs` (`name`, `gender`, `color`, `age`, `breed`, `address`, `status`, `image_url`) VALUES
('Golden', 'Male', 'Golden', 12, 'Golden Retriever', 'Bangkok, Thailand', 'Active', 'https://images.unsplash.com/photo-1552053831-71594a27632d'),
('Shiro', 'Female', 'White', 6, 'Pomeranian', 'Chiang Mai, Thailand', 'Active', 'https://images.unsplash.com/photo-1587300003388-59208cc962cb'),
('Milo', 'Male', 'Brown', 24, 'Beagle', 'Phuket, Thailand', 'Adopted', 'https://images.unsplash.com/photo-1505628346881-b72b27e84530');
