-- H2 兼容建表脚本（自动执行）
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    avatar VARCHAR(500),
    nickname VARCHAR(50),
    gender INT DEFAULT 0,
    intro VARCHAR(500),
    status INT DEFAULT 1,
    deleted INT DEFAULT 0,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    sort INT DEFAULT 0,
    deleted INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS novels (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100) NOT NULL,
    cover VARCHAR(500),
    intro TEXT,
    word_count BIGINT DEFAULT 0,
    status VARCHAR(20) DEFAULT '连载中',
    click_count BIGINT DEFAULT 0,
    collect_count BIGINT DEFAULT 0,
    deleted INT DEFAULT 0,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS novel_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    novel_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    deleted INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS chapters (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    novel_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    word_count INT DEFAULT 0,
    chapter_no INT NOT NULL,
    deleted INT DEFAULT 0,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_novel_chapter ON chapters(novel_id, chapter_no);

CREATE TABLE IF NOT EXISTS bookshelf (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    novel_id BIGINT NOT NULL,
    category VARCHAR(20) DEFAULT 'READING',
    deleted INT DEFAULT 0,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_user_novel ON bookshelf(user_id, novel_id);

CREATE TABLE IF NOT EXISTS reading_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    novel_id BIGINT NOT NULL,
    chapter_id BIGINT,
    chapter_no INT,
    is_current INT DEFAULT 1,
    deleted INT DEFAULT 0,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reading_progress (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    novel_id BIGINT NOT NULL,
    chapter_id BIGINT,
    chapter_no INT,
    page_offset INT DEFAULT 0,
    is_current INT DEFAULT 1,
    deleted INT DEFAULT 0,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_rp_user_novel ON reading_progress(user_id, novel_id);

CREATE TABLE IF NOT EXISTS bookmarks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    novel_id BIGINT NOT NULL,
    chapter_id BIGINT,
    chapter_no INT,
    page_offset INT DEFAULT 0,
    note VARCHAR(200),
    deleted INT DEFAULT 0,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    novel_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    like_count BIGINT DEFAULT 0,
    parent_id BIGINT,
    deleted INT DEFAULT 0,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comment_likes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    comment_id BIGINT NOT NULL,
    deleted INT DEFAULT 0,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_user_comment ON comment_likes(user_id, comment_id);
