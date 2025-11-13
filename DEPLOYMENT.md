# 部署指南

## 🚀 部署选项

### 1. 本地开发部署
```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev
```
访问：http://localhost:5173

### 2. 生产环境构建
```bash
# 构建项目
pnpm run build

# 预览构建结果
pnpm run preview
```

### 3. Docker部署
```bash
# 构建Docker镜像
docker build -t video-resource-search .

# 运行容器
docker run -p 3000:3000 video-resource-search
```

### 4. Docker Compose部署
```bash
# 启动完整服务（包含MySQL）
docker-compose up -d
```

### 5. Vercel部署
1. 访问 [Vercel官网](https://vercel.com)
2. 导入GitHub仓库
3. 配置环境变量
4. 自动部署

### 6. 其他平台部署
- **Netlify**: 支持静态站点部署
- **Railway**: 支持全栈应用部署
- **Heroku**: 支持Node.js应用部署

## 📋 环境变量配置

### 基础配置
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=video_resource_db

# 服务器配置
PORT=3001
NODE_ENV=production

# 前端配置
VITE_API_URL=http://localhost:3001/api
```

### 数据库初始化
```bash
# 创建数据库
mysql -u root -p < database/init.sql
```

## 🔧 构建配置

### Vite配置
项目使用Vite作为构建工具，配置在 `vite.config.ts` 中：
- 支持TypeScript
- 自动路径别名
- 代理配置
- 代码分割优化

### TypeScript配置
- 严格的类型检查
- 路径映射支持
- 现代JavaScript特性

## 📊 性能优化

### 构建优化
- 代码分割和懒加载
- 图片压缩和优化
- 依赖预构建
- 缓存策略

### 运行时优化
- 响应式图片加载
- 虚拟滚动（大数据量时）
- 防抖和节流
- 内存泄漏防护

## 🛡️ 安全配置

### 生产环境安全
- HTTPS强制使用
- 安全响应头
- 输入验证和清理
- SQL注入防护
- XSS攻击防护

### 环境安全
- 敏感信息加密
- 环境变量管理
- 访问控制
- 日志审计

## 📈 监控和日志

### 应用监控
- 错误监控
- 性能监控
- 用户行为分析
- 服务器状态监控

### 日志配置
```bash
# 查看应用日志
docker logs video-resource-app

# 查看数据库日志
docker logs video-resource-mysql
```

## 🔄 持续集成/部署

### GitHub Actions工作流
```yaml
name: Deploy to Production
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: pnpm install
      - name: Build
        run: pnpm run build
      - name: Deploy
        run: # 你的部署命令
```

## 📞 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查MySQL服务状态
   - 验证连接参数
   - 查看网络连通性

2. **构建失败**
   - 检查Node.js版本
   - 清理node_modules
   - 重新安装依赖

3. **端口冲突**
   - 修改环境变量中的端口
   - 检查端口占用情况

4. **权限问题**
   - 检查文件权限
   - 验证用户权限
   - 查看日志详情

### 支持联系方式
- GitHub Issues: [提交问题](https://github.com/your-username/video-resource-search/issues)
- 邮箱: your-email@example.com

---

**🎉 部署完成！您的影视资源搜索网站已经准备就绪！**