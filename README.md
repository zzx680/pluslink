# Pluslink - 奇绩创坛校友招聘平台

奇绩创坛离职实习生与校友企业之间的内部招聘对接平台。

## 功能特性

- **邀请码系统**: 6位邀请码控制访问权限，确保平台仅限内部使用
- **企业端**: 浏览实习生名片卡、发布招聘职位
- **实习生端**: 浏览招聘职位、提交个人名片卡
- **管理后台**: 生成和管理邀请码
- **简约设计**: 黑白配色，极简UI

## 数据结构

### 实习生名片卡
- 姓名
- 学历
- 实习岗位
- 实习时间
- 联系方式

### 招聘职位
- 公司名称
- 职位名称
- 职位描述
- 任职要求
- 联系方式

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **数据存储**: JSON 文件（内测版本）
- **部署**: Vercel

## 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
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

## 部署到 Vercel

1. 推送代码到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. Vercel 会自动检测 Next.js 并部署

### 重要提示

⚠️ **Vercel 的文件系统是只读的**

当前版本使用本地 JSON 文件存储数据。部署到 Vercel 后需要注意：

- 数据会在每次部署后重置
- 建议后续升级到 Vercel Postgres 或其他云数据库
- 内测阶段可以接受此限制

## 项目结构

```
pluslink/
├── app/
│   ├── page.tsx              # 主页（邀请码验证）
│   ├── company/              # 企业端页面
│   ├── intern/               # 实习生端页面
│   ├── admin/                # 管理后台
│   └── api/                  # API 路由
│       ├── invite/validate/  # 验证邀请码
│       ├── admin/invite-codes/  # 管理邀请码
│       ├── interns/          # 实习生数据
│       └── jobs/             # 职位数据
├── lib/
│   ├── types.ts              # 数据类型定义
│   └── data.ts               # 数据存储逻辑
└── data/                     # 本地数据存储（gitignored）
```

## 开发计划

- [ ] 升级到云数据库（Vercel Postgres）
- [ ] 添加用户认证系统
- [ ] 实时聊天功能
- [ ] 简历上传与解析
- [ ] 数据统计分析

## License

MIT
