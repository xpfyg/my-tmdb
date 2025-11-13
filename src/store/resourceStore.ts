import { create } from 'zustand';
import { ResourceWithDetails } from '../../shared/types';

interface ResourceStore {
  hotResources: ResourceWithDetails[];
  searchResults: ResourceWithDetails[];
  currentResource: ResourceWithDetails | null;
  relatedResources: ResourceWithDetails[];
  categoryStats: { category1: string; count: number }[];
  isLoading: boolean;
  error: string | null;
  
  // 动作
  setHotResources: (resources: ResourceWithDetails[]) => void;
  setSearchResults: (results: ResourceWithDetails[]) => void;
  setCurrentResource: (resource: ResourceWithDetails | null) => void;
  setRelatedResources: (resources: ResourceWithDetails[]) => void;
  setCategoryStats: (stats: { category1: string; count: number }[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // API调用
  fetchHotResources: (limit?: number) => Promise<void>;
  searchResources: (keyword: string, filters?: any) => Promise<void>;
  fetchResourceDetail: (id: number) => Promise<void>;
  fetchRelatedResources: (id: number) => Promise<void>;
  fetchCategoryStats: () => Promise<void>;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const useResourceStore = create<ResourceStore>((set, get) => ({
  hotResources: [],
  searchResults: [],
  currentResource: null,
  relatedResources: [],
  categoryStats: [],
  isLoading: false,
  error: null,

  setHotResources: (resources) => set({ hotResources: resources }),
  setSearchResults: (results) => set({ searchResults: results }),
  setCurrentResource: (resource) => set({ currentResource: resource }),
  setRelatedResources: (resources) => set({ relatedResources: resources }),
  setCategoryStats: (stats) => set({ categoryStats: stats }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  fetchHotResources: async (limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/hot-resources?limit=${limit}`);
      const data = await response.json();
      
      if (data.code === 200) {
        set({ hotResources: data.data, isLoading: false });
      } else {
        throw new Error(data.message || '获取热门资源失败');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '获取热门资源失败',
        isLoading: false 
      });
    }
  },

  searchResources: async (keyword, filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const queryParams = new URLSearchParams({
        keyword,
        ...filters,
        page: '1',
        limit: '20'
      });
      
      const response = await fetch(`${API_BASE_URL}/search?${queryParams}`);
      const data = await response.json();
      
      if (data.code === 200) {
        set({ searchResults: data.data.items, isLoading: false });
      } else {
        throw new Error(data.message || '搜索失败');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '搜索失败',
        isLoading: false 
      });
    }
  },

  fetchResourceDetail: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/resource/${id}`);
      const data = await response.json();
      
      if (data.code === 200) {
        set({ currentResource: data.data, isLoading: false });
      } else if (data.code === 404) {
        throw new Error('资源不存在或已失效');
      } else {
        throw new Error(data.message || '获取资源详情失败');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '获取资源详情失败',
        isLoading: false 
      });
    }
  },

  fetchRelatedResources: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/resource/${id}?related=true&limit=6`);
      const data = await response.json();
      
      if (data.code === 200) {
        set({ relatedResources: data.data, isLoading: false });
      } else {
        throw new Error(data.message || '获取相关推荐失败');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '获取相关推荐失败',
        isLoading: false 
      });
    }
  },

  fetchCategoryStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/category-stats`);
      const data = await response.json();
      
      if (data.code === 200) {
        set({ categoryStats: data.data, isLoading: false });
      } else {
        throw new Error(data.message || '获取分类统计失败');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '获取分类统计失败',
        isLoading: false 
      });
    }
  }
}));