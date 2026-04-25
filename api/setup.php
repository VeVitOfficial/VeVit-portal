<?php
// Database setup script — run once to create the users table
// DELETE THIS FILE after running it!

require_once __DIR__ . '/config.php';

try {
    $pdo = getDB();

    $sql = "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nickname VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        avatar_url VARCHAR(500),
        tier VARCHAR(20) DEFAULT 'free',
        xp INT DEFAULT 0,
        level INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci";

    $pdo->exec($sql);
    echo json_encode(['success' => true, 'message' => 'Table users created successfully']);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>