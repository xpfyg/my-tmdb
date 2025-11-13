import React from 'react';
import { SEOHelmet } from '../components/SEOHelmet';
import { HotRecommendations } from '../components/HotRecommendations';
import { SearchBar } from '../components/SearchBar';
import { useResourceStore } from '../store/resourceStore';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const { hotResources, fetchHotResources, isLoading, error } = useResourceStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchHotResources(12);
  }, [fetchHotResources]);

  const handleSearch = (keyword: string, filters: any) => {
    const queryParams = new URLSearchParams({
      q: keyword,
      ...filters
    });
    navigate(`/search?${queryParams}`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <SEOHelmet 
          title="影视资源搜索 - 发现优质影视资源"
          description="专业的影视资源搜索平台，提供电影、电视剧、动漫、综艺等资源的搜索和分享服务。"
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">加载失败</h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => fetchHotResources(12)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHelmet 
        title="影视资源搜索 - 发现优质影视资源"
        description="专业的影视资源搜索平台，提供电影、电视剧、动漫、综艺等资源的搜索和分享服务。"
        type="website"
      />

      {/* 头部区域 */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              影视资源搜索
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              发现优质影视资源，一键分享精彩内容
            </p>
            
            {/* 搜索栏 */}
            <div className="max-w-2xl mx-auto">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="搜索电影、电视剧、动漫..."
                className="bg-white rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-8">
        {/* 热门推荐 */}
        <section>
          <HotRecommendations 
            resources={hotResources}
            title="🔥 热门推荐"
            className="mb-12"
          />
        </section>

        {/* 分类导航 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📂 分类浏览</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: '电影', icon: '🎬', path: '/search?category2=电影' },
              { name: '电视剧', icon: '📺', path: '/search?category2=电视剧' },
              { name: '动漫', icon: '🎭', path: '/search?category2=动漫' },
              { name: '综艺', icon: '🎪', path: '/search?category2=综艺' },
              { name: '纪录片', icon: '🌍', path: '/search?category2=纪录片' },
              { name: '全部', icon: '📚', path: '/search' }
            ].map((category) => (
              <div
                key={category.name}
                onClick={() => navigate(category.path)}
                className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* 特色功能 */}
        <section className="bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            ✨ 为什么选择我们
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">快速搜索</h3>
              <p className="text-gray-600">智能搜索引擎，快速找到您想要的影视资源</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">一键分享</h3>
              <p className="text-gray-600">便捷的资源分享功能，与朋友分享精彩内容</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">响应式设计</h3>
              <p className="text-gray-600">完美适配各种设备，随时随地浏览资源</p>
            </div>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 影视资源搜索. 仅供学习交流使用.
          </p>
        </div>
      </footer>
    </div>
  );
};