-- Contact Form Database Table Schema
-- This table stores contact form submissions from the portfolio website

CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    consent BOOLEAN NOT NULL DEFAULT FALSE,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    status ENUM('new', 'read', 'responded', 'archived') DEFAULT 'new',
    notes TEXT,
    INDEX idx_email (email),
    INDEX idx_submission_date (submission_date),
    INDEX idx_status (status)
);

-- Optional: Create a table for tracking email responses
CREATE TABLE IF NOT EXISTS contact_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contact_id INT NOT NULL,
    response_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    response_text TEXT NOT NULL,
    responded_by VARCHAR(100),
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);
