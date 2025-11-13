import express from 'express';
import { ResourceService } from '../services/resourceService.js';
import type { SearchParams } from '../../../shared/types';

const router = express.Router();

/**
 * 搜索资源
 * GET /api/search
 */
router.get('/search', async (req, res) => {
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

/**
 * 获取热门资源
 * GET /api/hot-resources
 */
router.get('/hot-resources', async (req, res) => {
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

/**
 * 获取资源详情
 * GET /api/resource/:id
 */
router.get('/resource/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        code: 400,
        message: '无效的资源ID',
        data: null
      });
    }

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
    console.error('获取资源详情API错误:', error);
    res.status(500).json({
      code: 500,
      message: '获取资源详情失败，请稍后重试',
      data: null
    });
  }
});

/**
 * 获取相关推荐
 * GET /api/related/:id
 */
router.get('/related/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
    
    if (isNaN(id)) {
      return res.status(400).json({
        code: 400,
        message: '无效的资源ID',
        data: null
      });
    }

    const relatedResources = await ResourceService.getRelatedResources(id, limit);
    
    res.json({
      code: 200,
      message: 'success',
      data: relatedResources
    });
  } catch (error) {
    console.error('获取相关推荐API错误:', error);
    res.status(500).json({
      code: 500,
      message: '获取相关推荐失败，请稍后重试',
      data: null
    });
  }
});

/**
 * 获取分类统计
 * GET /api/category-stats
 */
router.get('/category-stats', async (req, res) => {
  try {
    const stats = await ResourceService.getCategoryStats();
    
    res.json({
      code: 200,
      message: 'success',
      data: stats
    });
  } catch (error) {
    console.error('获取分类统计API错误:', error);
    res.status(500).json({
      code: 500,
      message: '获取分类统计失败，请稍后重试',
      data: null
    });
  }
});

export default router;