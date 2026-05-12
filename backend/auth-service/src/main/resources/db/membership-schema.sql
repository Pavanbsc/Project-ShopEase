CREATE TABLE IF NOT EXISTS user_memberships (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    plan VARCHAR(20) NOT NULL,
    billing_cycle VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    auto_renew BOOLEAN NOT NULL DEFAULT TRUE,
    starts_at DATETIME NOT NULL,
    ends_at DATETIME NOT NULL,
    features_json TEXT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX idx_user_memberships_user_id (user_id),
    INDEX idx_user_memberships_status (status)
);
