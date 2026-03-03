# Logo 上传指南

## Logo 位置

项目中已为企业logo预留了位置，您可以在以下位置看到logo占位符：

### 1. 主页 (app/page.tsx)
- 位置：页面顶部中央
- 尺寸：96x96 像素 (w-24 h-24)
- 样式：黑色圆角方形背景，带阴影效果

### 2. 各页面Header (company/intern/admin)
- 位置：左上角导航栏
- 尺寸：40x40 像素 (w-10 h-10)
- 样式：黑色圆角方形背景

## 如何替换Logo

### 方法一：直接替换占位符（推荐）

1. 准备您的logo图片：
   - 格式：PNG、SVG、JPG
   - 建议尺寸：至少 200x200 像素
   - 背景：透明背景最佳

2. 将logo文件放入 `public` 目录：
   ```
   public/
   └── logo.png  (或 logo.svg)
   ```

3. 更新主页logo (app/page.tsx 第58-62行)：
   ```tsx
   <div className="w-24 h-24 bg-black rounded-2xl flex items-center justify-center shadow-2xl shadow-black/10 hover:shadow-black/20 transition-all duration-500 hover:scale-105">
     <Image
       src="/logo.png"
       alt="Pluslink Logo"
       width={80}
       height={80}
       className="rounded-xl"
     />
   </div>
   ```

4. 更新Header logo (在 company/intern/admin 页面的第54-56行)：
   ```tsx
   <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
     <Image
       src="/logo.png"
       alt="Logo"
       width={32}
       height={32}
       className="rounded"
     />
   </div>
   ```

### 方法二：使用Next.js Image组件

如果您的logo已经上传到云存储（如阿里云OSS、腾讯云COS等）：

```tsx
import Image from 'next/image';

<Image
  src="https://your-cdn.com/logo.png"
  alt="Pluslink Logo"
  width={80}
  height={80}
  className="rounded-xl"
/>
```

## Logo设计建议

### 主页Logo
- **尺寸**：80x80 像素显示区域
- **风格**：简约、现代
- **颜色**：建议白色或浅色（因为背景是黑色）
- **格式**：SVG最佳（可无限缩放）

### Header Logo
- **尺寸**：32x32 像素显示区域
- **风格**：图标化、识别度高
- **颜色**：白色或浅色
- **格式**：SVG或PNG

## 示例代码

### 完整的主页Logo替换示例

```tsx
{/* Logo 区域 */}
<div className="mb-12 flex justify-center">
  <div className="w-24 h-24 bg-black rounded-2xl flex items-center justify-center shadow-2xl shadow-black/10 hover:shadow-black/20 transition-all duration-500 hover:scale-105">
    <Image
      src="/logo.png"
      alt="Pluslink Logo"
      width={80}
      height={80}
      className="rounded-xl object-contain"
      priority
    />
  </div>
</div>
```

### 完整的Header Logo替换示例

```tsx
<Link href="/" className="flex items-center gap-3 group">
  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
    <Image
      src="/logo.png"
      alt="Logo"
      width={32}
      height={32}
      className="rounded object-contain"
    />
  </div>
  <span className="text-2xl font-bold text-black tracking-tight">Pluslink</span>
</Link>
```

## 注意事项

1. **图片优化**：使用Next.js的Image组件可以自动优化图片
2. **响应式**：确保logo在不同屏幕尺寸下都清晰可见
3. **加载性能**：主页logo使用`priority`属性优先加载
4. **备用方案**：如果logo加载失败，黑色背景仍然保持美观

## 需要帮助？

如果您在替换logo时遇到问题，可以：
1. 检查图片路径是否正确
2. 确认图片文件已放入public目录
3. 清除浏览器缓存后重新加载
4. 运行 `npm run build` 重新构建项目
