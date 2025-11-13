import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { cn } from '../utils';

interface SearchBarProps {
  onSearch: (keyword: string, filters: any) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = '搜索影视资源...',
  className 
}) => {
  const [keyword, setKeyword] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category1: '',
    category2: '',
    drive_type: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearch(keyword.trim(), filters);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category1: '',
      category2: '',
      drive_type: ''
    });
  };

  return (
    <div className={cn('w-full', className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={placeholder}
            className={cn(
              "w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "bg-white text-gray-900 placeholder-gray-500"
            )}
          />
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-md transition-colors",
              showFilters ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
            )}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
        
        <button
          type="submit"
          className={cn(
            "absolute right-12 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white rounded-md",
            "text-sm font-medium hover:bg-blue-700 transition-colors"
          )}
        >
          搜索
        </button>
      </form>

      {/* 筛选器面板 */}
      {showFilters && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                资源类型
              </label>
              <select
                value={filters.category1}
                onChange={(e) => handleFilterChange('category1', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">全部类型</option>
                <option value="影视资源">影视资源</option>
                <option value="学习资料">学习资料</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                内容分类
              </label>
              <select
                value={filters.category2}
                onChange={(e) => handleFilterChange('category2', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">全部分类</option>
                <option value="电影">电影</option>
                <option value="电视剧">电视剧</option>
                <option value="动漫">动漫</option>
                <option value="综艺">综艺</option>
                <option value="纪录片">纪录片</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                网盘类型
              </label>
              <select
                value={filters.drive_type}
                onChange={(e) => handleFilterChange('drive_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">全部网盘</option>
                <option value="百度云">百度云</option>
                <option value="阿里云">阿里云</option>
                <option value="腾讯云">腾讯云</option>
                <option value="夸克网盘">夸克网盘</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              清除筛选
            </button>
          </div>
        </div>
      )}
    </div>
  );
};