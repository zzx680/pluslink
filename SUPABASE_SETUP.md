# Supabase 集成指南

本指南将帮助你将 Pluslink 从 JSON 文件存储迁移到 Supabase 云数据库。

## 为什么使用 Supabase？

- **数据持久化**: Vercel 部署后数据不会丢失
- **实时同步**: 多用户访问时数据实时同步
- **可扩展性**: 轻松应对数据量增长
- **安全性**: 提供 Row Level Security (RLS)
- **免费额度**: Supabase 提供慷慨的免费额度

## 步骤 1: 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com)
2. 注册/登录账号
3. 点击 "New Project" 创建新项目
4. 填写项目信息：
   - Organization: 选择你的组织
   - Project name: `pluslink` (或你喜欢的名字)
   - Database Password: 设置一个强密码（保存好！）
   - Region: 选择离你最近的区域（如 Singapore）
5. 点击 "Create new project"，等待项目创建完成（约 2 分钟）

## 步骤 2: 获取 API 密钥

1. 在 Supabase 项目控制台，点击左侧 **Settings** (齿轮图标)
2. 点击 **API**
3. 找到以下信息：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: 以 `eyJ` 开头的长字符串
   - **service_role key**: 以 `eyJ` 开头的长字符串（点击 "Reveal" 显示）

## 步骤 3: 创建数据库表

1. 在 Supabase 项目控制台，点击左侧 **SQL Editor**
2. 点击 "New Query"
3. 复制 `supabase/schema.sql` 的全部内容
4. 粘贴到 SQL Editor
5. 点击 **Run** 执行

执行成功后，你会看到创建了 4 个表：
- `interns` - 实习生数据
- `jobs` - 职位数据
- `invite_codes` - 邀请码
- `profile_views` - 简历查看记录

## 步骤 4: 配置环境变量

### 本地开发

1. 复制环境变量模板：
```bash
cp .env.example .env.local
```

2. 编辑 `.env.local`，填入你的 Supabase 凭据：
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Vercel 部署

1. 进入你的 Vercel 项目
2. 点击 **Settings** > **Environment Variables**
3. 添加以下变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. 重新部署项目

## 步骤 5: 迁移现有数据（可选）

如果你有现有的 JSON 数据需要迁移：

1. 确保已配置 `.env.local`
2. 安装 tsx（如果尚未安装）：
```bash
npm install -D tsx
```

3. 运行迁移脚本：
```bash
npx tsx scripts/migrate-to-supabase.ts
```

脚本会将 `data/` 目录下的所有数据导入 Supabase。

## 步骤 6: 切换到 Supabase 数据层

修改 `lib/data.ts`，将其内容替换为：

```typescript
// 使用 Supabase 数据层
export * from './supabase-data';
```

或者直接在 API 路由中导入 Supabase 函数：

```typescript
import { getInterns, addIntern } from '@/lib/supabase-data';
```

## 步骤 7: 验证

1. 启动开发服务器：
```bash
npm run dev
```

2. 测试功能：
   - 访问主页，使用邀请码登录
   - 企业端：查看实习生、发布职位
   - 实习生端：查看职位、提交名片
   - 管理后台：生成邀请码、查看统计

3. 在 Supabase 控制台验证数据：
   - 点击左侧 **Table Editor**
   - 查看各个表的数据

## 常见问题

### Q: 如何获取 service_role key？

A: Settings > API > service_role key（点击 "Reveal" 显示）

注意：service_role key 具有完全权限，**只能在服务端使用**，不要暴露到客户端！

### Q: 数据迁移失败怎么办？

A: 检查以下事项：
1. Supabase URL 和 key 是否正确
2. SQL schema 是否已执行
3. RLS 策略是否正确配置

### Q: 如何备份数据？

A: Supabase 提供自动备份（付费功能）。免费用户可以：
1. 使用 SQL Editor 导出数据
2. 使用 `pg_dump` 命令行工具

### Q: 如何重置数据库？

A: 在 SQL Editor 中执行：
```sql
DROP TABLE IF EXISTS profile_views CASCADE;
DROP TABLE IF EXISTS invite_codes CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS interns CASCADE;
```

然后重新执行 `schema.sql`。

## 安全建议

1. **生产环境**：修改 RLS 策略，限制匿名访问
2. **API 路由**：添加身份验证
3. **敏感数据**：考虑加密存储
4. **定期备份**：设置自动备份计划

## 下一步

- 添加用户认证（Supabase Auth）
- 启用实时订阅（Realtime）
- 配置邮件通知（Supabase 提供邮件服务）
- 设置存储桶（Storage）用于简历上传

---

需要帮助？查看 [Supabase 文档](https://supabase.com/docs)
