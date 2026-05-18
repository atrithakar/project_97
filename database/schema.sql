CREATE DATABASE IF NOT EXISTS project97_db;

USE project97_db;

CREATE TABLE IF NOT EXISTS users(
    id CHAR(36) CHARACTER SET ascii PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    username VARCHAR(30) UNIQUE NOT NULL,
    user_password_hash CHAR(60) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    profile_bio VARCHAR(500),
    joined_at DATETIME DEFAULT (UTC_TIMESTAMP())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS photos(
    id CHAR(36) CHARACTER SET ascii PRIMARY KEY,
    owner_id CHAR(36) CHARACTER SET ascii NOT NULL,
    photo_name VARCHAR(100) UNIQUE NOT NULL,
    thumbnail_name varchar(100) UNIQUE NOT NULL,
    title VARCHAR(100) NOT NULL,
    coord_x DECIMAL(10, 5),
    coord_y DECIMAL(10, 5),
    coord_z DECIMAL(10, 5),
    
    game_time DATETIME,
    clicked_at DATETIME NOT NULL,
    uploaded_at DATETIME DEFAULT (UTC_TIMESTAMP()),
    
    radio_station VARCHAR(50) DEFAULT 'Radio Off',
    
    CONSTRAINT fk_owner_id
    FOREIGN KEY (owner_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
    
    INDEX idx_coords (coord_x, coord_y)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;	