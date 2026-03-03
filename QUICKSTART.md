# 🎯 快速部署指南

## 立即部署到 Vercel（5分钟）

### 步骤 1: 推送到 GitHub

```bash
# 如果还没有远程仓库，创建一个
# 访问 https://github.com/new 创建新仓库

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/pluslink.git

# 推送代码
git push -u origin main
```

### 步骤 2: 部署到 Vercel

#### 方法 A: 一键部署（最快）

1. 访问 [vercel.com/new](https://vercel.com/new)
2. 点击 "Import Git Repository"
3. 选择你的 `pluslink` 仓库
4. 点击 "Deploy" 按钮
5. 等待 2-3 分钟，完成！

#### 方法 B: 使用 CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

### 步骤 3: 访问你的网站

部署完成后，Vercel 会提供一个 URL：
```
https://pluslink-xxx.vercel.app
```

## 🎨 替换 Logo（可选）

### 快速替换

1. 准备你的 logo 图片（PNG/SVG，建议 200x200px）
2. 重命名为 `logo.png` 或 `logo.svg`
3. 放入 `public/` 目录
4. 更新代码（参考 LOGO_GUIDE.md）
5. 重新部署

### 示例代码

在 `app/page.tsx` 第 58 行附近：

```tsx
// 替换前
<div className="w-24 h-24 bg-black rounded-2xl flex items-center justify-center...">
  <div className="w-16 h-16 border-4 border-white rounded-xl"></div>
</div>

// 替换后
<div className="w-24 h-24 bg-black rounded-2xl flex items-center justify-center...">
  <Image src="/logo.png" alt="Logo" width={80} height={80} />
</div>
```

## 📱 首次使用

### 1. 生成邀请码

访问管理后台：
```
https://your-domain.vercel.app/admin
```

点击按钮生成邀请码：
- 企业端邀请码
- 实习生端邀请码

### 2. 分享邀请码

将生成的邀请码分享给：
- ✉️ 奇绩创坛校友企业
- ✉️ 奇绩创坛离职实习生

### 3. 开始使用

用户访问主页，输入邀请码即可进入对应端口。

## 🔧 配置自定义域名（可选）

### 在 Vercel 配置

1. 进入项目设置
2. 点击 "Domains"
3. 添加你的域名（如 `pluslink.com`）
4. 按照提示配置 DNS

### DNS 配置示例

在你的域名提供商添加记录：

```
类型: CNAME
名称: @
值: cname.vercel-dns.com
```

## 📊 监控和维护

### 查看部署日志

1. 访问 Vercel Dashboard
2. 选择你的项目
3. 点击 "Deployments"
4. 查看每次部署的日志

### 查看使用统计

在管理后台可以看到：
- 邀请码总数
- 可用邀请码数
- 已使用邀请码数

### 数据备份

⚠️ **重要**: 当前使用 JSON 文件存储，数据会在重新部署时重置。

建议：
1. 定期导出数据（手动复制）
2. 或升级到云数据库（Vercel Postgres）

## 🎉 完成！

你的 Pluslink 平台已经上线！

### 访问地址
- 主页: `https://your-domain.vercel.app`
- 企业端: `https://your-domain.vercel.app/company`
- 实习生端: `https://your-domain.vercel.app/intern`
- 管理后台: `https://your-domain.vercel.app/admin`

### 默认邀请码
- 企业端: `COMPANY2025`
- 实习生端: `INTERN2025`

---

**需要帮助？** 查看完整文档：
- 📖 [README.md](./README.md) - 项目说明
- 🎨 [LOGO_GUIDE.md](./LOGO_GUIDE.md) - Logo 替换
- 📋 [DEPLOYMENT.md](./DEPLOYMENT.md) - 部署检查清单
- 📊 [SUMMARY.md](./SUMMARY.md) - 项目总结
