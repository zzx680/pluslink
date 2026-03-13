-- Pluslink 数据库 Schema
-- 在 Supabase SQL Editor 中执行此脚本

-- 实习生表
CREATE TABLE IF NOT EXISTS interns (
  id TEXT PRIMARY KEY,
  invite_code TEXT NOT NULL UNIQUE,
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

-- 职位表
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
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

-- 邀请码表
CREATE TABLE IF NOT EXISTS invite_codes (
  code TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('company', 'intern', 'admin')),
  used BOOLEAN NOT NULL DEFAULT FALSE,
  used_by TEXT,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 简历查看记录表
CREATE TABLE IF NOT EXISTS profile_views (
  id TEXT PRIMARY KEY,
  intern_id TEXT NOT NULL REFERENCES interns(id) ON DELETE CASCADE,
  viewer_name TEXT NOT NULL,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_interns_invite_code ON interns(invite_code);
CREATE INDEX IF NOT EXISTS idx_profile_views_intern_id ON profile_views(intern_id);
CREATE INDEX IF NOT EXISTS idx_invite_codes_type ON invite_codes(type);

-- 启用 Row Level Security (RLS)
ALTER TABLE interns ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;

-- 创建允许所有操作的策略（开发环境使用）
-- 生产环境应该根据实际需求限制访问
CREATE POLICY "Allow all operations on interns" ON interns
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on jobs" ON jobs
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on invite_codes" ON invite_codes
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on profile_views" ON profile_views
  FOR ALL USING (true) WITH CHECK (true);

-- 插入默认邀请码（如果不存在）
INSERT INTO invite_codes (code, type, used, created_at)
VALUES
  ('COMP25', 'company', false, NOW()),
  ('INT25A', 'intern', false, NOW()),
  ('ADM25A', 'admin', false, NOW())
ON CONFLICT (code) DO NOTHING;
