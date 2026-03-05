# 🔐 管理后台访问控制说明

## 📋 功能概述

为了保护管理后台的安全，我们实现了基于邀请码的访问控制系统。只有持有有效管理员邀请码的用户才能访问管理后台。

---

## ✨ 实现方案

### 1. 扩展邀请码系统

在原有的 `company` 和 `intern` 邀请码类型基础上，新增 `admin` 类型：

```typescript
export interface InviteCode {
  code: string;
  type: 'company' | 'intern' | 'admin'; // 新增 admin 类型
  used: boolean;
  usedBy?: string;
  usedAt?: string;
  createdAt: string;
}
```

### 2. 登录页面

**路径**: `/admin/login`

- 用户需要输入管理员邀请码才能访问后台
- 验证成功后设置 7 天有效期的 session cookie
- 邀请码验证后会被标记为已使用

### 3. 访问控制

**管理后台页面** (`/admin`) 会在加载时：
1. 检查用户是否已登录（验证 session cookie）
2. 如果未登录，自动跳转到 `/admin/login`
3. 如果已登录，显示管理后台内容

### 4. 退出登录

管理后台右上角提供"退出登录"按钮，点击后：
- 清除 session cookie
- 跳转回登录页面

---

## 🚀 使用指南

### 首次使用

1. **访问登录页面**
   ```
   https://your-domain.com/admin/login
   ```

2. **使用默认邀请码登录**
   ```
   默认管理员邀请码: ADMIN2025
   ```

3. **登录成功后**
   - 自动跳转到管理后台
   - Session 有效期 7 天

### 生成新的管理员邀请码

1. 登录管理后台
2. 点击红色的"生成管理员邀请码"按钮
3. 系统会生成一个 6-12 位的随机邀请码
4. 将邀请码分享给需要访问权限的人

### 管理邀请码

在管理后台可以：
- ✅ 查看所有邀请码（包括管理员邀请码）
- ✅ 查看邀请码状态（可使用/已使用）
- ✅ 查看使用人和使用时间
- ✅ 删除不需要的邀请码

---

## 🔒 安全特性

### 1. Session 管理
- 使用 HTTP-only Cookie 存储 session
- 生产环境启用 Secure 标志
- 7 天自动过期

### 2. 邀请码验证
- 每个管理员邀请码只能使用一次
- 使用后自动标记为已使用
- 记录使用人和使用时间

### 3. 访问控制
- 所有管理后台页面都需要验证
- 未登录自动跳转到登录页
- 支持手动退出登录

### 4. 审计追踪
- 记录每个邀请码的创建时间
- 记录邀请码的使用情况
- 可以追踪谁在使用管理后台

---

## 📝 API 端点

### 1. 登录验证
```
POST /api/admin/auth
Body: { code: "ADMIN2025" }
Response: { valid: true, message: "验证成功" }
```

### 2. 检查登录状态
```
GET /api/admin/auth
Response: { authenticated: true }
```

### 3. 退出登录
```
DELETE /api/admin/auth
Response: { success: true }
```

---

## 🎯 使用场景

### 场景 1: 初始化系统
```
1. 系统部署后，使用默认邀请码 ADMIN2025 登录
2. 登录后立即生成新的管理员邀请码
3. 删除默认邀请码 ADMIN2025（可选）
```

### 场景 2: 添加新管理员
```
1. 在管理后台生成新的管理员邀请码
2. 将邀请码发送给新管理员
3. 新管理员使用邀请码登录
4. 邀请码自动失效
```

### 场景 3: 撤销管理员权限
```
1. 在管理后台找到对应的管理员邀请码
2. 点击"删除"按钮
3. 该管理员的 session 会在 7 天后自动过期
```

---

## ⚙️ 配置选项

### 修改 Session 有效期

编辑 `/app/api/admin/auth/route.ts`:

```typescript
response.cookies.set('admin_session', code, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7 // 修改这里，单位是秒
});
```

### 修改默认邀请码

编辑 `/lib/data.ts`:

```typescript
const defaultCodes: InviteCode[] = [
  { code: 'COMPANY2025', type: 'company', used: false, createdAt: new Date().toISOString() },
  { code: 'INTERN2025', type: 'intern', used: false, createdAt: new Date().toISOString() },
  { code: 'YOUR_CUSTOM_CODE', type: 'admin', used: false, createdAt: new Date().toISOString() },
];
```

---

## 🔄 升级说明

### 从旧版本升级

如果你的系统已经在运行，需要：

1. **更新代码**
   ```bash
   git pull origin main
   npm install
   npm run build
   ```

2. **添加默认管理员邀请码**

   手动编辑 `data/invite-codes.json`，添加：
   ```json
   {
     "code": "ADMIN2025",
     "type": "admin",
     "used": false,
     "createdAt": "2026-03-05T00:00:00.000Z"
   }
   ```

3. **重新部署**
   ```bash
   vercel --prod
   ```

---

## 🐛 常见问题

### Q1: 忘记管理员邀请码怎么办？

**方案 1**: 查看数据文件
```bash
cat data/invite-codes.json | grep admin
```

**方案 2**: 手动添加新的管理员邀请码
编辑 `data/invite-codes.json`，添加一个新的 admin 类型邀请码。

### Q2: Session 过期后怎么办？

重新使用管理员邀请码登录即可。注意：每个邀请码只能使用一次，需要提前生成新的邀请码。

### Q3: 如何查看当前有哪些管理员？

在管理后台的邀请码列表中，筛选类型为"管理员"的邀请码，查看"使用人"列。

### Q4: 可以同时有多个管理员吗？

可以。生成多个管理员邀请码，分发给不同的人即可。

### Q5: 如何临时禁用某个管理员？

删除该管理员使用的邀请码记录。该管理员的 session 会在 7 天后自动过期。

---

## 🎯 最佳实践

### 1. 定期更换邀请码
- 建议每个管理员使用独立的邀请码
- 定期生成新邀请码并删除旧的

### 2. 记录管理员信息
- 在生成邀请码时，记录分发给谁
- 在邀请码列表中可以看到使用情况

### 3. 最小权限原则
- 只给需要的人分发管理员邀请码
- 不需要时及时删除邀请码

### 4. 安全建议
- 不要在公开场合分享邀请码
- 使用安全的通信方式传递邀请码
- 定期检查邀请码使用情况

---

## 📊 功能对比

| 功能 | 旧版本 | 新版本 |
|------|--------|--------|
| 管理后台访问 | 无限制 | 需要邀请码 |
| 管理员管理 | 无 | 有 |
| 访问追踪 | 无 | 有 |
| Session 管理 | 无 | 7天有效期 |
| 退出登录 | 无 | 有 |

---

## ✅ 总结

通过扩展现有的邀请码系统，我们实现了：

- ✅ 管理后台访问控制
- ✅ 基于邀请码的身份验证
- ✅ Session 管理（7天有效期）
- ✅ 管理员邀请码生成和管理
- ✅ 访问审计和追踪
- ✅ 退出登录功能

这个方案：
- 🎯 与现有系统风格一致
- 🔒 安全可靠
- 📝 易于管理
- 🚀 易于扩展

---

**默认管理员邀请码**: `ADMIN2025`

**登录地址**: `https://your-domain.com/admin/login`

**首次登录后，请立即生成新的管理员邀请码！**
