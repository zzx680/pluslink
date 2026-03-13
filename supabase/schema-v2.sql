-- Pluslink 数据库 Schema V2 - 支持账号密码登录
-- 在 Supabase SQL Editor 中执行此脚本

-- 用户表（用于登录）
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('intern', 'company', 'admin')),
  invite_code TEXT NOT NULL,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 实习生表（修改版）
DROP TABLE IF EXISTS interns CASCADE;
CREATE TABLE IF NOT EXISTS interns (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invite_code TEXT NOT NULL,
  name TEXT NOT NULL,
  education TEXT NOT NULL,
  position TEXT NOT NULL,
  internship_period TEXT NOT NULL,
  contact TEXT NOT NULL,
  start_date TEXT NOT NULL,
  base_location TEXT NOT NULL,
  work_type TEXT NOT NULL CHECK (work_type IN ('online', 'offline', 'hybrid')),
  employment_type TEXT NOT NULL CHECK (employment_type IN ('intern', 'full-time', 'both')),
  resume_url TEXT,
  recommendation TEXT,
  recommended_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 职位表（修改版)
DROP TABLE IF EXISTS jobs CASCADE;
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  username TEXT,              -- 可为公司登录账号
  password TEXT,              -- 可为公司登录密码
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  cohort TEXT,
  website TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  contact TEXT NOT NULL,
  base_location TEXT NOT NULL,
  work_type TEXT NOT NULL CHECK (work_type IN ('online', 'offline', 'hybrid')),
  employment_type TEXT NOT NULL CHECK (employment_type IN ('intern', 'full-time', 'both')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 邀请码表（保持不变）
CREATE TABLE IF NOT EXISTS invite_codes (
  code TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('company', 'intern', 'admin')),
  used BOOLEAN NOT NULL DEFAULT FALSE,
  used_by TEXT,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 简历查看记录表（保持不变）
CREATE TABLE IF NOT EXISTS profile_views (
  id TEXT PRIMARY KEY,
  intern_id TEXT NOT NULL REFERENCES interns(id) ON DELETE CASCADE,
  viewer_name TEXT NOT NULL,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_invite_code ON users(invite_code);
CREATE INDEX IF NOT EXISTS idx_interns_user_id ON interns(user_id);
CREATE INDEX IF NOT EXISTS idx_interns_invite_code ON interns(invite_code);
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);

-- 启用 Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE interns ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;

-- 开放所有表的访问权限（开发环境）
CREATE POLICY "Allow all on users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on interns" ON interns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on jobs" ON jobs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on invite_codes" ON invite_codes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on profile_views" ON profile_views FOR ALL USING (true) WITH CHECK (true);

-- 迁移现有数据
-- 将现有 interns 数据迁移到新表（需要先创建对应的 users 记录）
-- 这里需要手动处理，因为需要创建 users 记录
