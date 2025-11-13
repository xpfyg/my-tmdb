import { supabase } from '../config/supabase.js';
import type { ResourceWithDetails, SearchParams, SearchResult } from '../../../shared/types';

// 模拟数据，当数据库不可定时使用
const mockResources: ResourceWithDetails[] = [
  {
    id: 1,
    drama_name: "肖申克的救赎",
    alias: "The Shawshank Redemption",
    category1: "影视资源",
    category2: "电影",
    drive_type: "百度云",
    link: "https://pan.baidu.com/s/1234567890",
    is_expired: 0,
    view_count: 1523,
    share_count: 234,
    hot: 95,
    size: "2.5GB",
    tmdb_id: 1,
    tmdb_code: "movie-001",
    title: "肖申克的救赎",
    year_released: 1994,
    category: "剧情",
    description: "一个关于希望、自由和救赎的故事。银行家安迪被冤枉杀害妻子和她的情人，被判终身监禁，关押在肖申克监狱。",
    poster_url: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    last_share_time: null,
    create_time: new Date("2024-01-15 10:30:00"),
    update_time: new Date("2024-01-15 10:30:00")
  },
  {
    id: 2,
    drama_name: "阿甘正传",
    alias: "Forrest Gump",
    category1: "影视资源",
    category2: "电影",
    drive_type: "阿里云",
    link: "https://www.aliyundrive.com/s/abcdef1234",
    is_expired: 0,
    view_count: 2341,
    share_count: 456,
    hot: 88,
    size: "3.2GB",
    tmdb_id: 2,
    tmdb_code: "movie-002",
    title: "阿甘正传",
    year_released: 1994,
    category: "剧情/喜剧",
    description: "阿甘是一个智商只有75的低能儿，但他善良单纯，通过自己的努力创造了一个又一个奇迹。",
    poster_url: "https://image.tmdb.org/t/p/w500/saHP97rTPS5eLwERh_sVru84Gbp.jpg",
    last_share_time: null,
    create_time: new Date("2024-01-16 14:20:00"),
    update_time: new Date("2024-01-16 14:20:00")
  },
  {
    id: 3,
    drama_name: "泰坦尼克号",
    alias: "Titanic",
    category1: "影视资源",
    category2: "电影",
    drive_type: "腾讯云",
    link: "https://cloud.tencent.com/developer/article/12345",
    is_expired: 0,
    view_count: 3421,
    share_count: 678,
    hot: 92,
    size: "4.1GB",
    tmdb_id: 3,
    tmdb_code: "movie-003",
    title: "泰坦尼克号",
    year_released: 1997,
    category: "爱情/剧情",
    description: "1912年4月10日，泰坦尼克号开始了它的处女航。富家少女罗丝与画家杰克在船上相遇并坠入爱河。",
    poster_url: "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    last_share_time: null,
    create_time: new Date("2024-01-17 09:15:00"),
    update_time: new Date("2024-01-17 09:15:00")
  },
  {
    id: 4,
    drama_name: "权力的游戏 第一季",
    alias: "Game of Thrones Season 1",
    category1: "影视资源",
    category2: "电视剧",
    drive_type: "百度云",
    link: "https://pan.baidu.com/s/9876543210",
    is_expired: 0,
    view_count: 4532,
    share_count: 890,
    hot: 97,
    size: "15.6GB",
    tmdb_id: 4,
    tmdb_code: "tv-001",
    title: "权力的游戏",
    year_released: 2011,
    category: "奇幻/剧情",
    description: "故事发生在一个虚构的世界，七大王国争夺铁王座的统治权。",
    poster_url: "https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNGrF0gpkpSrfu.jpg",
    last_share_time: null,
    create_time: new Date("2024-01-18 16:45:00"),
    update_time: new Date("2024-01-18 16:45:00")
  },
  {
    id: 5,
    drama_name: "绝命毒师 第一季",
    alias: "Breaking Bad Season 1",
    category1: "影视资源",
    category2: "电视剧",
    drive_type: "阿里云",
    link: "https://www.aliyundrive.com/s/fedcba0987",
    is_expired: 0,
    view_count: 3214,
    share_count: 567,
    hot: 89,
    size: "12.3GB",
    tmdb_id: 5,
    tmdb_code: "tv-002",
    title: "绝命毒师",
    year_released: 2008,
    category: "犯罪/剧情",
    description: "高中化学老师沃尔特·怀特被诊断出患有肺癌，为了给家人留下财产，他开始制造和销售冰毒。",
    poster_url: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjuxplrQ.jpg",
    last_share_time: null,
    create_time: new Date("2024-01-19 11:20:00"),
    update_time: new Date("2024-01-19 11:20:00")
  }
];

export class ResourceService {
  private static useMockData = false;

  /**
   * 检查数据库连接状态
   */
  private static async checkDatabaseConnection(): Promise<boolean> {
    try {
      const { error } = await supabase.from('cloud_resource').select('id').limit(1);
      if (error) throw error;
      return true;
    } catch (error) {
      console.warn('数据库连接失败，使用模拟数据:', error);
      this.useMockData = true;
      return false;
    }
  }

  /**
   * 搜索资源
   */
  static async searchResources(params: SearchParams): Promise<SearchResult<ResourceWithDetails>> {
    const isDbConnected = await this.checkDatabaseConnection();
    
    if (this.useMockData || !isDbConnected) {
      return this.searchMockResources(params);
    }

    return this.searchDatabaseResources(params);
  }

  /**
   * 搜索模拟资源数据
   */
  private static searchMockResources(params: SearchParams): SearchResult<ResourceWithDetails> {
    const { keyword, category1, category2, drive_type, page = 1, limit = 20 } = params;
    
    let results = [...mockResources];
    
    if (keyword) {
      const keywordLower = keyword.toLowerCase();
      results = results.filter(r => 
        r.drama_name.toLowerCase().includes(keywordLower) ||
        r.alias.toLowerCase().includes(keywordLower) ||
        r.title!.toLowerCase().includes(keywordLower)
      );
    }
    
    if (category1) {
      results = results.filter(r => r.category1 === category1);
    }
    
    if (category2) {
      results = results.filter(r => r.category2 === category2);
    }
    
    if (drive_type) {
      results = results.filter(r => r.drive_type === drive_type);
    }
    
    // 排序
    results.sort((a, b) => b.hot - a.hot);
    
    const total = results.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      items: results.slice(start, end),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * 搜索数据库资源
   */
  private static async searchDatabaseResources(params: SearchParams): Promise<SearchResult<ResourceWithDetails>> {
    const { keyword, category1, category2, drive_type, page = 1, limit = 20, sort = 'hot', order = 'DESC' } = params;

    // 验证参数
    const validOrder = order === 'ASC' || order === 'DESC' ? order : 'DESC';
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100); // 限制每页最多100条

    try {
      // 构建查询 - 使用 LEFT JOIN 与 tmdb 表
      let query = supabase
        .from('cloud_resource')
        .select(`
          *,
          tmdb:tmdb_id (
            tmdb_code,
            title,
            year_released,
            category,
            description,
            poster_url
          )
        `, { count: 'exact' })
        .eq('is_expired', 0);

      // 添加关键词搜索
      if (keyword) {
        // Supabase 使用 ilike 进行不区分大小写的模糊搜索
        // 使用 or 来组合多个搜索条件
        query = query.or(`drama_name.ilike.%${keyword}%,alias.ilike.%${keyword}%`);
      }

      // 添加分类过滤
      if (category1) {
        query = query.eq('category1', category1);
      }

      if (category2) {
        query = query.eq('category2', category2);
      }

      if (drive_type) {
        query = query.eq('drive_type', drive_type);
      }

      // 排序
      const validSortFields = ['hot', 'view_count', 'create_time', 'drama_name'];
      const sortField = validSortFields.includes(sort) ? sort : 'hot';
      query = query.order(sortField, { ascending: validOrder === 'ASC' });

      // 分页
      const from = (validPage - 1) * validLimit;
      const to = from + validLimit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      // 转换数据格式，将嵌套的 tmdb 对象展平
      const items: ResourceWithDetails[] = (data || []).map(item => ({
        ...item,
        tmdb_code: item.tmdb?.tmdb_code,
        title: item.tmdb?.title,
        year_released: item.tmdb?.year_released,
        category: item.tmdb?.category,
        description: item.tmdb?.description,
        poster_url: item.tmdb?.poster_url,
        tmdb: undefined // 移除嵌套对象
      }));

      const total = count || 0;

      return {
        items,
        total,
        page: validPage,
        limit: validLimit,
        totalPages: Math.ceil(total / validLimit)
      };
    } catch (error) {
      console.error('搜索资源失败:', error);
      // 如果数据库查询失败，回退到模拟数据
      return this.searchMockResources(params);
    }
  }

  /**
   * 获取热门资源
   */
  static async getHotResources(limit: number = 10): Promise<ResourceWithDetails[]> {
    const isDbConnected = await this.checkDatabaseConnection();

    if (this.useMockData || !isDbConnected) {
      return mockResources.slice(0, limit);
    }

    try {
      const { data, error } = await supabase
        .from('cloud_resource')
        .select(`
          *,
          tmdb:tmdb_id (
            tmdb_code,
            title,
            year_released,
            category,
            description,
            poster_url
          )
        `)
        .eq('is_expired', 0)
        .order('hot', { ascending: false })
        .order('view_count', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // 转换数据格式
      const results: ResourceWithDetails[] = (data || []).map(item => ({
        ...item,
        tmdb_code: item.tmdb?.tmdb_code,
        title: item.tmdb?.title,
        year_released: item.tmdb?.year_released,
        category: item.tmdb?.category,
        description: item.tmdb?.description,
        poster_url: item.tmdb?.poster_url,
        tmdb: undefined
      }));

      return results;
    } catch (error) {
      console.error('获取热门资源失败:', error);
      return mockResources.slice(0, limit);
    }
  }

  /**
   * 获取资源详情
   */
  static async getResourceById(id: number): Promise<ResourceWithDetails | null> {
    const isDbConnected = await this.checkDatabaseConnection();

    if (this.useMockData || !isDbConnected) {
      return mockResources.find(r => r.id === id) || null;
    }

    try {
      const { data, error } = await supabase
        .from('cloud_resource')
        .select(`
          *,
          tmdb:tmdb_id (
            tmdb_code,
            title,
            year_released,
            category,
            description,
            poster_url
          )
        `)
        .eq('id', id)
        .eq('is_expired', 0)
        .single();

      if (error) throw error;

      if (data) {
        // 更新浏览次数
        await this.incrementViewCount(id);

        // 转换数据格式
        const result: ResourceWithDetails = {
          ...data,
          tmdb_code: data.tmdb?.tmdb_code,
          title: data.tmdb?.title,
          year_released: data.tmdb?.year_released,
          category: data.tmdb?.category,
          description: data.tmdb?.description,
          poster_url: data.tmdb?.poster_url,
          tmdb: undefined
        };

        return result;
      }

      return null;
    } catch (error) {
      console.error('获取资源详情失败:', error);
      return mockResources.find(r => r.id === id) || null;
    }
  }

  /**
   * 获取相关推荐
   */
  static async getRelatedResources(resourceId: number, limit: number = 6): Promise<ResourceWithDetails[]> {
    const isDbConnected = await this.checkDatabaseConnection();

    if (this.useMockData || !isDbConnected) {
      return this.getMockRelatedResources(resourceId, limit);
    }

    // 首先获取当前资源的分类信息
    const currentResource = await this.getResourceById(resourceId);
    if (!currentResource) {
      return [];
    }

    try {
      let query = supabase
        .from('cloud_resource')
        .select(`
          *,
          tmdb:tmdb_id (
            tmdb_code,
            title,
            year_released,
            category,
            description,
            poster_url
          )
        `)
        .neq('id', resourceId)
        .eq('is_expired', 0);

      // 构建 OR 条件进行相关推荐
      const orConditions: string[] = [];

      if (currentResource.category1) {
        orConditions.push(`category1.eq.${currentResource.category1}`);
      }

      if (currentResource.category2) {
        orConditions.push(`category2.eq.${currentResource.category2}`);
      }

      if (orConditions.length > 0) {
        query = query.or(orConditions.join(','));
      }

      query = query
        .order('hot', { ascending: false })
        .order('view_count', { ascending: false })
        .limit(limit);

      const { data, error } = await query;

      if (error) throw error;

      // 转换数据格式
      const results: ResourceWithDetails[] = (data || []).map(item => ({
        ...item,
        tmdb_code: item.tmdb?.tmdb_code,
        title: item.tmdb?.title,
        year_released: item.tmdb?.year_released,
        category: item.tmdb?.category,
        description: item.tmdb?.description,
        poster_url: item.tmdb?.poster_url,
        tmdb: undefined
      }));

      return results;
    } catch (error) {
      console.error('获取相关推荐失败:', error);
      return this.getMockRelatedResources(resourceId, limit);
    }
  }

  /**
   * 获取模拟相关推荐
   */
  private static getMockRelatedResources(resourceId: number, limit: number): ResourceWithDetails[] {
    const currentResource = mockResources.find(r => r.id === resourceId);
    if (!currentResource) {
      return [];
    }

    const related = mockResources.filter(r => {
      if (r.id === resourceId) return false;
      return r.category1 === currentResource.category1 || r.category2 === currentResource.category2;
    });

    return related.slice(0, limit);
  }

  /**
   * 增加浏览次数
   */
  private static async incrementViewCount(id: number): Promise<void> {
    const isDbConnected = await this.checkDatabaseConnection();

    if (this.useMockData || !isDbConnected) {
      // 模拟数据中增加浏览次数
      const resource = mockResources.find(r => r.id === id);
      if (resource) {
        resource.view_count += 1;
      }
      return;
    }

    try {
      // 使用 RPC 或直接更新（Supabase 支持增量更新）
      const { error } = await supabase.rpc('increment_view_count', { resource_id: id });

      // 如果 RPC 函数不存在，使用手动更新方式
      if (error && error.message.includes('function')) {
        // 先查询当前值
        const { data: current } = await supabase
          .from('cloud_resource')
          .select('view_count')
          .eq('id', id)
          .single();

        if (current) {
          await supabase
            .from('cloud_resource')
            .update({ view_count: current.view_count + 1 })
            .eq('id', id);
        }
      } else if (error) {
        throw error;
      }
    } catch (error) {
      console.error('更新浏览次数失败:', error);
    }
  }

  /**
   * 获取分类统计
   */
  static async getCategoryStats(): Promise<{ category1: string; count: number }[]> {
    const isDbConnected = await this.checkDatabaseConnection();

    if (this.useMockData || !isDbConnected) {
      const stats: { [key: string]: number } = {};
      mockResources.forEach(resource => {
        stats[resource.category1] = (stats[resource.category1] || 0) + 1;
      });

      return Object.entries(stats).map(([category1, count]) => ({
        category1,
        count
      }));
    }

    try {
      const { data, error } = await supabase
        .from('cloud_resource')
        .select('category1')
        .eq('is_expired', 0);

      if (error) throw error;

      // 统计每个分类的数量
      const stats: { [key: string]: number } = {};
      (data || []).forEach(item => {
        stats[item.category1] = (stats[item.category1] || 0) + 1;
      });

      // 转换为数组并排序
      const results = Object.entries(stats)
        .map(([category1, count]) => ({
          category1,
          count
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return results;
    } catch (error) {
      console.error('获取分类统计失败:', error);
      const stats: { [key: string]: number } = {};
      mockResources.forEach(resource => {
        stats[resource.category1] = (stats[resource.category1] || 0) + 1;
      });

      return Object.entries(stats).map(([category1, count]) => ({
        category1,
        count
      }));
    }
  }
}