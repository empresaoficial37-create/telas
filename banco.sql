-- -------------------------------------------------------------
-- BANCO DE DADOS: sorteio_semparar
-- IMPORTANTE: Importe este arquivo no seu phpMyAdmin na Hostinger
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `participants` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `nome` VARCHAR(255) NOT NULL,
  `cpf` VARCHAR(14) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL,
  `telefone` VARCHAR(20) NOT NULL,
  `plano` VARCHAR(50) NOT NULL DEFAULT 'Flex',
  `ganhador` TINYINT(1) NOT NULL DEFAULT 0,
  `data_cadastro` DATETIME NOT NULL,
  `ip` VARCHAR(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `visitors_stats` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ip` VARCHAR(45) NOT NULL,
  `timestamp` DATETIME NOT NULL,
  `user_agent` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `settings` (
  `key_name` VARCHAR(100) NOT NULL PRIMARY KEY,
  `val` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir configurações iniciais padrão
INSERT INTO `settings` (`key_name`, `val`) VALUES
('admin', '{\"usuario\":\"admin\",\"senha_hash\":\"$2y$10$4VUGOoqPOjyc0eZZ5FYDfuKFN.e473OlcMVI2jEeKwR8NZTJ3yrmG\"}'),
('sorteio', '{\"whatsapp\":\"5511999999999\",\"pdf_flex\":\"\",\"pdf_pratico\":\"\",\"pdf_ideal\":\"\",\"ativo\":true}'),
('app_download', '{\"tipo\":\"link\",\"google_play_url\":\"\",\"app_store_url\":\"\",\"apk_url\":\"\",\"link_customizado\":\"\",\"texto_botao\":\"Baixar Aplicativo\"}')
ON DUPLICATE KEY UPDATE `key_name`=`key_name`;
