-- ============================================
-- 星海阅读 Supabase 完整建表脚本
-- 请在 Supabase SQL Editor 中运行此文件
-- ============================================

-- 1. Profiles (用户资料，关联 auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  nickname TEXT DEFAULT '',
  avatar TEXT DEFAULT '',
  gender INTEGER DEFAULT 0,
  intro TEXT DEFAULT '',
  status INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 自动创建 profile：注册时触发
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, nickname)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', NEW.email), COALESCE(NEW.raw_user_meta_data->>'username', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 2. Categories
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  sort INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Novels
CREATE TABLE IF NOT EXISTS novels (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover TEXT DEFAULT '',
  intro TEXT DEFAULT '',
  word_count INTEGER DEFAULT 0,
  status TEXT DEFAULT '连载中',
  click_count INTEGER DEFAULT 0,
  collect_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Novel-Category 关联
CREATE TABLE IF NOT EXISTS novel_categories (
  id BIGSERIAL PRIMARY KEY,
  novel_id BIGINT REFERENCES novels(id) ON DELETE CASCADE,
  category_id BIGINT REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE(novel_id, category_id)
);

-- 5. Chapters
CREATE TABLE IF NOT EXISTS chapters (
  id BIGSERIAL PRIMARY KEY,
  novel_id BIGINT REFERENCES novels(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  word_count INTEGER DEFAULT 0,
  chapter_no INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Bookshelf
CREATE TABLE IF NOT EXISTS bookshelf (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  novel_id BIGINT REFERENCES novels(id) ON DELETE CASCADE,
  category TEXT DEFAULT 'READING' CHECK (category IN ('READING', 'WANT_READ', 'READ')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, novel_id)
);

-- 7. Reading Progress
CREATE TABLE IF NOT EXISTS reading_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  novel_id BIGINT REFERENCES novels(id) ON DELETE CASCADE,
  chapter_id BIGINT REFERENCES chapters(id) ON DELETE CASCADE,
  chapter_no INTEGER DEFAULT 0,
  page_offset INTEGER DEFAULT 0,
  is_current BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, novel_id)
);

-- 8. Reading History
CREATE TABLE IF NOT EXISTS reading_history (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  novel_id BIGINT REFERENCES novels(id) ON DELETE CASCADE,
  chapter_id BIGINT REFERENCES chapters(id) ON DELETE CASCADE,
  chapter_no INTEGER DEFAULT 0,
  is_current BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Bookmarks
CREATE TABLE IF NOT EXISTS bookmarks (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  novel_id BIGINT REFERENCES novels(id) ON DELETE CASCADE,
  chapter_id BIGINT REFERENCES chapters(id) ON DELETE CASCADE,
  chapter_no INTEGER DEFAULT 0,
  page_offset INTEGER DEFAULT 0,
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Comments
CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  novel_id BIGINT REFERENCES novels(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  like_count INTEGER DEFAULT 0,
  parent_id BIGINT REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Comment Likes
CREATE TABLE IF NOT EXISTS comment_likes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  comment_id BIGINT REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, comment_id)
);

-- ============================================
-- Stored Procedures (RPC)
-- ============================================

-- 增加点击量
CREATE OR REPLACE FUNCTION increment_click_count(novel_id BIGINT)
RETURNS VOID AS $$
BEGIN
  UPDATE novels SET click_count = click_count + 1 WHERE id = novel_id;
END;
$$ LANGUAGE plpgsql;

-- 评论点赞
CREATE OR REPLACE FUNCTION increment_comment_like(comment_id BIGINT)
RETURNS VOID AS $$
BEGIN
  UPDATE comments SET like_count = like_count + 1 WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql;

-- 取消评论点赞
CREATE OR REPLACE FUNCTION decrement_comment_like(comment_id BIGINT)
RETURNS VOID AS $$
BEGIN
  UPDATE comments SET like_count = GREATEST(like_count - 1, 0) WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- RLS (Row Level Security) 策略
-- ============================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);

ALTER TABLE novels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read novels" ON novels FOR SELECT USING (true);

ALTER TABLE novel_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read novel_categories" ON novel_categories FOR SELECT USING (true);

ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read chapters" ON chapters FOR SELECT USING (true);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read comments" ON comments FOR SELECT USING (true);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE bookshelf ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own bookshelf" ON bookshelf FOR ALL USING (auth.uid() = user_id);

ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own progress" ON reading_progress FOR ALL USING (auth.uid() = user_id);

ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own history" ON reading_history FOR ALL USING (auth.uid() = user_id);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own bookmarks" ON bookmarks FOR ALL USING (auth.uid() = user_id);

ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own likes" ON comment_likes FOR ALL USING (auth.uid() = user_id);

-- Allow authenticated users to insert comments
CREATE POLICY "Auth users insert comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
