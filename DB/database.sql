CREATE DATABASE IF NOT EXISTS click_fit;
USE click_fit;


DROP TABLE IF EXISTS users;

CREATE TABLE users (
  userId    INT AUTO_INCREMENT PRIMARY KEY,
  email     VARCHAR(255) NOT NULL UNIQUE,
  password  VARCHAR(255) NOT NULL,  
  type      VARCHAR(50)  NOT NULL DEFAULT 'member',   
  active    TINYINT(1)   NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP PROCEDURE IF EXISTS addUser;

DELIMITER $$

CREATE PROCEDURE addUser (
  IN p_email    VARCHAR(255),
  IN p_password VARCHAR(255),
  IN p_type     VARCHAR(50),
  IN p_active   TINYINT(1)
)
BEGIN
  INSERT INTO users (email, password, type, active)
  VALUES (p_email, p_password, p_type, p_active);

  SELECT LAST_INSERT_ID() AS userId;
END $$

DELIMITER ;


CALL addUser('bernard.mensah@example.com', '$2b$10$examplehashvalueonly', 'member', 1);

SELECT * FROM users;