# 影视资源搜索网站

一个基于React + TypeScript + Express + MySQL的影视资源搜索和分享平台，支持关键词搜索、分类筛选、资源详情展示和一键分享功能。

## 🚀 功能特性

- **智能搜索**: 支持关键词搜索和高级筛选
- **热门推荐**: 首页展示热门影视资源
- **资源详情**: 完整的资源信息和分享功能
- **相关推荐**: 基于分类的智能推荐
- **响应式设计**: 完美适配移动端和桌面端
- **SEO优化**: 支持结构化数据和社交媒体分享
- **一键分享**: 便捷的资源分享链接生成

## 🛠️ 技术栈

### 前端
- **React 18** - 现代化UI框架
- **TypeScript** - 类型安全的JavaScript
- **Vite** - 快速的构建工具
- **Tailwind CSS** - 实用优先的CSS框架
- **Zustand** - 轻量级状态管理
- **React Router** - 客户端路由

### 后端
- **Node.js** - JavaScript运行时
- **Express** - Web应用框架
- **TypeScript** - 类型安全的JavaScript
- **MySQL2** - MySQL数据库驱动

### 数据库
- **MySQL 8.0** - 关系型数据库
- 包含 `cloud_resource` 和 `tmdb` 两个核心表

## 📦 快速开始

### 环境要求
- Node.js 18+
- MySQL 8.0+ (可选，支持模拟数据)
- pnpm (推荐) 或 npm

### 安装依赖
```bash
pnpm install
```

### 配置环境变量
复制 `.env.example` 为 `.env` 并配置数据库连接：
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=video_resource_db
```

### 启动开发服务器
```bash
# 同时启动前端和后端
pnpm run dev

# 单独启动前端
pnpm run dev:client

# 单独启动后端
pnpm run dev:server
```

### 访问应用
- 前端: http://localhost:5173
- 后端API: http://localhost:3001
- API文档: http://localhost:3001/health

## 🎯 重要特性

### 🔄 智能数据切换
**项目支持数据库和模拟数据双模式**：
- ✅ 当MySQL数据库可用时，自动使用真实数据
- ✅ 当数据库不可用时，自动回退到内置模拟数据
- ✅ 无需配置即可立即体验完整功能

### 🎨 UI设计
- **TMDB风格**: 深蓝色主题 (#032541)
- **卡片式布局**: 现代化的视觉体验
- **响应式设计**: 完美适配移动端和桌面端
- **流畅动画**: 悬停效果和过渡动画

### 🔍 搜索功能
- **智能关键词搜索**: 支持剧名、别名、TMDB标题
- **高级筛选**: 按类型、分类、网盘类型筛选
- **多条件组合**: 灵活的组合查询
- **智能排序**: 按热度、浏览量、时间排序

## 📱 页面功能

### 首页
- 热门推荐轮播
- 分类导航
- 搜索入口
- 特色功能展示

### 搜索页
- 关键词搜索
- 高级筛选（类型、分类、网盘）
- 搜索结果列表
- 分页功能

### 详情页
- 资源详细信息
- 分享链接生成
- 相关推荐
- 浏览统计

## 🔧 API接口

### 搜索资源
```
GET /api/search?keyword=关键词&category1=类型&page=1&limit=20
```

### 获取热门资源
```
GET /api/hot-resources?limit=10
```

### 获取资源详情
```
GET /api/resource/:id
```

### 获取相关推荐
```
GET /api/related/:id?limit=6
```

## 🎨 UI设计

- 参考TMDB风格设计
- 深蓝色主题 (#032541)
- 卡片式布局
- 响应式设计
- 流畅的动画效果

## 🔒 安全特性

- SQL注入防护
- XSS攻击防护
- API限流
- 输入验证

## 📈 性能优化

- 代码分割和懒加载
- 图片懒加载
- 数据库索引优化
- 前端缓存策略

## 🚀 部署

### 生产环境构建
```bash
pnpm run build
```

### Docker部署
```bash
docker build -t video-resource-search .
docker run -p 3000:3000 video-resource-search
```

## 🎯 立即体验

项目已经配置好完整的开发环境，支持热重载和代理配置，可以直接运行体验：

```bash
pnpm run dev
```

访问 http://localhost:5173 即可开始使用！

## 📊 项目亮点

1. **零配置启动**: 内置模拟数据，无需数据库即可运行
2. **智能切换**: 自动检测数据库连接，智能切换数据源
3. **完整功能**: 搜索、推荐、分享等核心功能一应俱全
4. **现代UI**: 参考TMDB的专业级界面设计
5. **SEO优化**: 支持搜索引擎优化和社交分享
6. **响应式**: 完美适配各种设备和屏幕尺寸

---

⭐ **如果这个项目对你有帮助，请给个Star支持一下！**