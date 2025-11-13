import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import resourceRoutes from './routes/resources.js';
import { createPool } from './config/database.js';

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url);

// 根据环境加载不同的配置文件
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: path.resolve(path.dirname(__filename), '..', envFile) });

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 生产环境静态文件服务
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  
  // 处理前端路由
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

// 数据库连接初始化（可选）
if (process.env.DB_HOST && process.env.DB_USER) {
  createPool().catch(error => {
    console.warn('数据库连接失败，使用模拟数据:', error.message);
  });
} else {
  console.log('未配置数据库，使用模拟数据运行');
}

// API路由
app.use('/api', resourceRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 错误处理中间件
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    code: 500,
    message: '服务器内部错误',
    data: null
  });
});

// 404处理
app.use('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({
      code: 404,
      message: '接口不存在',
      data: null
    });
  } else if (process.env.NODE_ENV === 'production') {
    res.status(404).sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'));
  } else {
    res.status(404).json({
      code: 404,
      message: '页面不存在',
      data: null
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  console.log(`📊 API文档: http://localhost:${PORT}/health`);
  console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 数据模式: ${process.env.DB_HOST ? '数据库' : '模拟数据'}`);
});

export default app;