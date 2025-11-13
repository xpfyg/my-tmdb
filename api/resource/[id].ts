import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ResourceService } from '../services/resourceService.js';

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
    const { id, related } = req.query;
    const resourceId = parseInt(id as string);

    if (isNaN(resourceId)) {
      return res.status(400).json({
        code: 400,
        message: '无效的资源ID',
        data: null
      });
    }

    // 如果请求相关推荐
    if (related === 'true') {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const relatedResources = await ResourceService.getRelatedResources(resourceId, limit);

      return res.status(200).json({
        code: 200,
        message: 'success',
        data: relatedResources
      });
    }

    // 否则返回资源详情
    const resource = await ResourceService.getResourceById(resourceId);

    if (!resource) {
      return res.status(404).json({
        code: 404,
        message: '资源不存在或已失效',
        data: null
      });
    }

    return res.status(200).json({
      code: 200,
      message: 'success',
      data: resource
    });
  } catch (error) {
    console.error('获取资源API错误:', error);
    return res.status(500).json({
      code: 500,
      message: '获取资源失败，请稍后重试',
      data: null
    });
  }
}
