import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ResourceService } from './services/resourceService.js';
import type { SearchParams } from '../shared/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 只允许 GET 请求
  if (req.method !== 'GET') {
    return res.status(405).json({
      code: 405,
      message: 'Method Not Allowed',
      data: null
    });
  }

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

    return res.status(200).json({
      code: 200,
      message: 'success',
      data: result
    });
  } catch (error) {
    console.error('搜索资源API错误:', error);
    return res.status(500).json({
      code: 500,
      message: '搜索失败，请稍后重试',
      data: null
    });
  }
}
