-- 添加 users 表
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('intern', 'company', 'admin')),
  invite_code TEXT NOT NULL,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 为 interns 表添加 user_id 字段
ALTER TABLE interns ADD COLUMN IF NOT EXISTS user_id TEXT REFERENCES users(id) ON DELETE CASCADE;

-- 为 jobs 表添加 user_id 字段
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS user_id TEXT REFERENCES users(id) ON DELETE CASCADE;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_interns_user_id ON interns(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);

-- 启用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 开放访问权限
CREATE POLICY "Allow all on users" ON users FOR ALL USING (true) WITH CHECK (true);
