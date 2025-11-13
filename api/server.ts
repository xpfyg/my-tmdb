import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ResourceService } from './services/resourceService.js';
import type { SearchParams } from '../shared/types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// 搜索资源
app.get('/api/search', async (req, res) => {
  try {
    const params: SearchParams = {
      keyword: req.query.keyword as string,
      category1: req.query.category1 as string,
      category2: req.query.category2 as string,
      drive_type: req.query.drive_type as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      sort: req.query.sort as 'hot' | 'view_count' | 'create_time' | 'title',
      order: req.query.order as 'ASC' | 'DESC'
    };

    const result = await ResourceService.searchResources(params);

    res.json({
      code: 200,
      message: 'success',
      data: result
    });
  } catch (error) {
    console.error('搜索资源API错误:', error);
    res.status(500).json({
      code: 500,
      message: '搜索失败，请稍后重试',
      data: null
    });
  }
});

// 获取热门资源
app.get('/api/hot-resources', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const resources = await ResourceService.getHotResources(limit);

    res.json({
      code: 200,
      message: 'success',
      data: resources
    });
  } catch (error) {
    console.error('获取热门资源API错误:', error);
    res.status(500).json({
      code: 500,
      message: '获取热门资源失败，请稍后重试',
      data: null
    });
  }
});

// 获取资源详情或相关推荐
app.get('/api/resource/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const related = req.query.related === 'true';

    if (isNaN(id)) {
      return res.status(400).json({
        code: 400,
        message: '无效的资源ID',
        data: null
      });
    }

    // 如果请求相关推荐
    if (related) {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const relatedResources = await ResourceService.getRelatedResources(id, limit);

      return res.json({
        code: 200,
        message: 'success',
        data: relatedResources
      });
    }

    // 否则返回资源详情
    const resource = await ResourceService.getResourceById(id);

    if (!resource) {
      return res.status(404).json({
        code: 404,
        message: '资源不存在或已失效',
        data: null
      });
    }

    res.json({
      code: 200,
      message: 'success',
      data: resource
    });
  } catch (error) {
    console.error('获取资源API错误:', error);
    res.status(500).json({
      code: 500,
      message: '获取资源失败，请稍后重试',
      data: null
    });
  }
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: 'API endpoint not found',
    data: null
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 API base URL: http://localhost:${PORT}/api`);
});
