# Pluslink - 奇绩创坛校友招聘平台

奇绩创坛离职实习生与校友企业之间的内部招聘对接平台。

## ✨ 功能特性

- **邀请码系统**: 6位随机邀请码控制访问权限，确保平台仅限内部使用
- **企业端**: 浏览实习生名片卡、发布招聘职位
- **实习生端**: 浏览招聘职位、提交个人名片卡
- **管理后台**: 生成和管理邀请码，实时统计数据
- **高级UI设计**: 黑白配色、流畅动画、响应式布局

## 🎨 设计特点

- **简约高级**: 黑白配色方案，极简主义设计
- **动态交互**: 按钮悬停效果、平滑过渡动画、微交互反馈
- **视觉层次**: 渐变背景、精致阴影、清晰的信息架构
- **响应式**: 完美适配桌面端和移动端
- **Logo预留**: 已为企业logo预留位置（参见 LOGO_GUIDE.md）

## 📊 数据结构

### 实习生名片卡
- 姓名
- 学历
- 奇绩实习岗位
- 实习时间
- 可入职时间 ⭐ 新增
- Base地点 ⭐ 新增
- 工作方式（线上/线下/混合办公）⭐ 新增
- 期望职位类型（实习/全职）⭐ 新增
- 联系方式

**浏览体验**: 列表页仅显示姓名和岗位，点击查看完整名片信息

### 招聘职位
- 公司名称
- 职位名称
- 职位描述
- 任职要求
- Base地点 ⭐ 新增
- 工作方式（线上/线下/混合办公）⭐ 新增
- 职位类型（实习/全职）⭐ 新增
- 联系方式

## 🛠 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS 4
- **动画**: 自定义CSS动画 + Tailwind动画
- **数据存储**: JSON 文件（内测版本）
- **部署**: Vercel

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

访问 [http://localhost:3000](http://localhost:3000)

### 首次使用

1. 访问管理后台: [http://localhost:3000/admin](http://localhost:3000/admin)
2. 生成企业端和实习生端邀请码
3. 分享邀请码给对应用户

### 默认邀请码

系统初始化时会自动创建以下邀请码：

- 企业端: `COMPANY2025`
- 实习生端: `INTERN2025`

## 📱 页面导航

- **主页** (`/`) - 邀请码验证入口
- **企业端** (`/company`) - 查看实习生、发布职位
- **实习生端** (`/intern`) - 查看职位、提交名片卡
- **管理后台** (`/admin`) - 邀请码管理

## 🎯 部署到 Vercel

### 方法一：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录并部署
vercel login
vercel

# 生产环境部署
vercel --prod
```

### 方法二：通过 GitHub

1. 推送代码到 GitHub：
```bash
git remote add origin https://github.com/<your-username>/pluslink.git
git push -u origin main
```

2. 访问 [vercel.com/new](https://vercel.com/new)
3. 导入 GitHub 仓库
4. 点击 Deploy

### 部署后配置

部署成功后，您可以：
- 配置自定义域名
- 设置环境变量
- 查看部署日志
- 监控性能指标

## ⚠️ 重要提示

### 数据持久化

当前版本使用 JSON 文件存储数据。部署到 Vercel 后：

- ✅ **优点**: 简单、快速、无需配置数据库
- ⚠️ **限制**: 每次重新部署数据会重置
- 💡 **建议**: 内测阶段可接受，正式版建议升级到云数据库

### 升级到云数据库

推荐方案：
1. **Vercel Postgres** - 与Vercel深度集成
2. **Supabase** - 开源、功能丰富
3. **PlanetScale** - MySQL兼容、自动扩展

## 📂 项目结构

```
pluslink/
├── app/
│   ├── page.tsx              # 主页（邀请码验证）
│   ├── layout.tsx            # 根布局
│   ├── globals.css           # 全局样式
│   ├── company/              # 企业端
│   │   └── page.tsx
│   ├── intern/               # 实习生端
│   │   └── page.tsx
│   ├── admin/                # 管理后台
│   │   └── page.tsx
│   └── api/                  # API 路由
│       ├── invite/validate/  # 验证邀请码
│       ├── admin/invite-codes/  # 管理邀请码
│       ├── interns/          # 实习生数据
│       └── jobs/             # 职位数据
├── lib/
│   ├── types.ts              # 数据类型定义
│   └── data.ts               # 数据存储逻辑
├── public/
│   └── logo-placeholder.svg  # Logo占位符
├── data/                     # 本地数据存储（gitignored）
├── LOGO_GUIDE.md            # Logo上传指南
└── README.md
```

## 🎨 自定义Logo

项目已为企业logo预留位置。详细的logo替换指南请参考：

👉 [LOGO_GUIDE.md](./LOGO_GUIDE.md)

## 🔧 开发计划

### 短期（内测阶段）
- [x] 基础功能实现
- [x] 邀请码系统
- [x] UI设计升级
- [x] Logo位置预留
- [ ] 移动端优化
- [ ] 性能优化

### 中期（正式版）
- [ ] 升级到云数据库
- [ ] 用户认证系统
- [ ] 邮件通知功能
- [ ] 数据导出功能
- [ ] 搜索和筛选

### 长期（扩展功能）
- [ ] 实时聊天
- [ ] 简历上传与解析
- [ ] AI推荐匹配
- [ ] 数据统计分析
- [ ] 移动端App

## 🐛 问题反馈

如遇到问题，请检查：
1. Node.js 版本 >= 18
2. 依赖是否正确安装
3. 端口3000是否被占用
4. 浏览器缓存是否清除

## 📄 License

MIT

---

**内测版本** · 仅限奇绩创坛离职实习生及校友企业使用

Made with ❤️ by Pluslink Team
