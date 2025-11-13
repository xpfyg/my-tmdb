import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { ResourceCard } from '../components/ResourceCard';
import { useResourceStore } from '../store/resourceStore';
import { cn } from '../utils';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchResults, searchResources, isLoading, error } = useResourceStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    category1: searchParams.get('category1') || '',
    category2: searchParams.get('category2') || '',
    drive_type: searchParams.get('drive_type') || ''
  });

  const keyword = searchParams.get('q') || '';

  useEffect(() => {
    if (keyword) {
      searchResources(keyword, filters);
    }
  }, [keyword, filters, searchResources]);

  const handleSearch = (newKeyword: string, newFilters: any) => {
    setFilters(newFilters);
    setSearchParams({
      q: newKeyword,
      ...newFilters
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setSearchParams({
      q: keyword,
      ...newFilters
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">搜索失败</h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => searchResources(keyword, filters)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            重新搜索
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部区域 */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="搜索影视资源..."
              className="mb-4"
            />
            
            {/* 筛选器 */}
            <div className="flex flex-wrap gap-4 mb-4">
              <select
                value={filters.category1}
                onChange={(e) => handleFilterChange('category1', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">全部类型</option>
                <option value="影视资源">影视资源</option>
                <option value="学习资料">学习资料</option>
              </select>

              <select
                value={filters.category2}
                onChange={(e) => handleFilterChange('category2', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">全部分类</option>
                <option value="电影">电影</option>
                <option value="电视剧">电视剧</option>
                <option value="动漫">动漫</option>
                <option value="综艺">综艺</option>
                <option value="纪录片">纪录片</option>
              </select>

              <select
                value={filters.drive_type}
                onChange={(e) => handleFilterChange('drive_type', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">全部网盘</option>
                <option value="百度云">百度云</option>
                <option value="阿里云">阿里云</option>
                <option value="腾讯云">腾讯云</option>
                <option value="夸克网盘">夸克网盘</option>
              </select>
            </div>

            {/* 搜索结果统计 */}
            <div className="text-sm text-gray-600">
              {keyword && (
                <span>
                  搜索 "<strong className="text-gray-900">{keyword}</strong>" 
                  {searchResults.length > 0 && (
                    <span>，找到 {searchResults.length} 个结果</span>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">搜索中...</span>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {keyword ? '未找到相关结果' : '请输入搜索关键词'}
            </h3>
            <p className="text-gray-600">
              {keyword 
                ? '试试其他关键词或调整筛选条件' 
                : '在上方搜索框中输入您想找的影视资源'
              }
            </p>
          </div>
        ) : (
          <>
            {/* 结果列表 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((resource) => (
                <ResourceCard 
                  key={resource.id}
                  resource={resource}
                  className="animate-fadeIn"
                />
              ))}
            </div>

            {/* 分页 */}
            {searchResults.length >= 20 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={cn(
                      "px-4 py-2 rounded-md border",
                      currentPage === 1 
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                    )}
                  >
                    上一页
                  </button>
                  
                  <span className="px-4 py-2 text-gray-600">
                    第 {currentPage} 页
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="px-4 py-2 rounded-md border bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                  >
                    下一页
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};