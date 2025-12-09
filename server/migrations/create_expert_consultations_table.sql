-- Create expert_consultations table
CREATE TABLE IF NOT EXISTS `expert_consultations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `about_yourself` enum('homeowner', 'designer') NOT NULL,
  `status` enum('pending', 'contacted', 'in_progress', 'completed', 'closed') DEFAULT 'pending',
  `admin_notes` text DEFAULT NULL,
  `contacted_by` int(11) DEFAULT NULL,
  `contacted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `contacted_by` (`contacted_by`),
  KEY `status` (`status`),
  KEY `created_at` (`created_at`),
  CONSTRAINT `expert_consultations_ibfk_1` FOREIGN KEY (`contacted_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

