package com.shopease.authservice.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AuthSchemaInitializer implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    public AuthSchemaInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS admins (
                  id BIGINT NOT NULL AUTO_INCREMENT,
                  username VARCHAR(255) NOT NULL,
                  email VARCHAR(255) NOT NULL,
                  password_hash VARCHAR(255) NOT NULL,
                  created_at DATETIME NOT NULL,
                  PRIMARY KEY (id),
                  UNIQUE KEY uk_admins_username (username),
                  UNIQUE KEY uk_admins_email (email)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                """);

        jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS users (
                  id BIGINT NOT NULL AUTO_INCREMENT,
                  name VARCHAR(255) NOT NULL,
                  email VARCHAR(255) NOT NULL,
                  password_hash VARCHAR(255) NOT NULL,
                  role VARCHAR(20) NOT NULL,
                  phone VARCHAR(20) NULL,
                  date_of_birth DATE NULL,
                  gender VARCHAR(30) NULL,
                  address VARCHAR(1000) NULL,
                  addresses_json TEXT NULL,
                  created_at DATETIME NOT NULL,
                  updated_at DATETIME NOT NULL,
                  PRIMARY KEY (id),
                  UNIQUE KEY uk_users_email (email)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                """);

        jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS user_memberships (
                  id BIGINT NOT NULL AUTO_INCREMENT,
                  user_id BIGINT NOT NULL,
                  plan VARCHAR(20) NOT NULL,
                  billing_cycle VARCHAR(20) NOT NULL,
                  status VARCHAR(20) NOT NULL,
                  auto_renew BOOLEAN NOT NULL DEFAULT TRUE,
                  starts_at DATETIME NOT NULL,
                  ends_at DATETIME NOT NULL,
                  features_json TEXT NULL,
                  created_at DATETIME NOT NULL,
                  updated_at DATETIME NOT NULL,
                  PRIMARY KEY (id),
                  KEY idx_user_memberships_user_id (user_id),
                  KEY idx_user_memberships_status (status)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                """);
    }
}
