import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, ExternalLink, Calendar, Clock, User, Film, ArrowLeft } from 'lucide-react';
import { useResourceStore } from '../store/resourceStore';
import { formatFileSize, formatDate, generateShareUrl, copyToClipboard, cn } from '../utils';

export const ResourceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    currentResource, 
    relatedResources, 
    fetchResourceDetail, 
    fetchRelatedResources, 
    isLoading, 
    error 
  } = useResourceStore();

  useEffect(() => {
    if (id) {
      fetchResourceDetail(parseInt(id));
      fetchRelatedResources(parseInt(id));
    }
  }, [id, fetchResourceDetail, fetchRelatedResources]);

  const handleShare = async () => {
    if (!currentResource) return;
    
    const shareUrl = generateShareUrl(currentResource.id);
    try {
      await copyToClipboard(shareUrl);
      // 这里可以添加toast提示
      console.log('分享链接已复制到剪贴板');
    } catch (error) {
      console.error('复制分享链接失败:', error);
    }
  };

  const handleLinkClick = (link: string) => {
    if (link && !currentResource?.is_expired) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">加载失败</h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => id && fetchResourceDetail(parseInt(id))}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  if (!currentResource) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">资源不存在</h1>
          <p className="text-gray-600">该资源可能已被删除或失效</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            返回
          </button>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：海报和基本信息 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={currentResource.poster_url || `https://via.placeholder.com/400x600?text=${encodeURIComponent(currentResource.drama_name)}`}
                alt={currentResource.drama_name}
                className="w-full h-auto"
              />
              
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentResource.drama_name}
                </h1>
                
                {currentResource.alias && (
                  <p className="text-gray-600 mb-4">{currentResource.alias}</p>
                )}

                <div className="space-y-3">
                  {currentResource.year_released && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>年份: {currentResource.year_released}</span>
                    </div>
                  )}

                  {currentResource.category && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Film className="w-4 h-4" />
                      <span>类型: {currentResource.category}</span>
                    </div>
                  )}

                  {currentResource.size && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>大小: {formatFileSize(currentResource.size)}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>浏览: {currentResource.view_count} 次</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Share2 className="w-4 h-4" />
                    <span>分享: {currentResource.share_count} 次</span>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    分享资源
                  </button>

                  {!currentResource.is_expired && currentResource.link && (
                    <button
                      onClick={() => handleLinkClick(currentResource.link)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      访问资源
                    </button>
                  )}

                  {currentResource.is_expired && (
                    <div className="w-full px-4 py-3 bg-red-100 text-red-800 rounded-md text-center">
                      该资源链接已失效
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：详细信息 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">资源详情</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">基本信息</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">资源名称:</span>
                      <span className="text-gray-900">{currentResource.drama_name}</span>
                    </div>
                    {currentResource.category1 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">资源类型:</span>
                        <span className="text-gray-900">{currentResource.category1}</span>
                      </div>
                    )}
                    {currentResource.category2 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">内容分类:</span>
                        <span className="text-gray-900">{currentResource.category2}</span>
                      </div>
                    )}
                    {currentResource.drive_type && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">网盘类型:</span>
                        <span className="text-gray-900">{currentResource.drive_type}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">统计信息</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">热度:</span>
                      <span className="text-gray-900">{currentResource.hot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">浏览次数:</span>
                      <span className="text-gray-900">{currentResource.view_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">分享次数:</span>
                      <span className="text-gray-900">{currentResource.share_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">创建时间:</span>
                      <span className="text-gray-900">{formatDate(currentResource.create_time)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 描述 */}
              {currentResource.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">简介</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {currentResource.description}
                  </p>
                </div>
              )}

              {/* 分享链接 */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">分享链接</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={generateShareUrl(currentResource.id)}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                  />
                  <button
                    onClick={handleShare}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    复制
                  </button>
                </div>
              </div>
            </div>

            {/* 相关推荐 */}
            {relatedResources.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">相关推荐</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedResources.map((resource) => (
                    <div
                      key={resource.id}
                      onClick={() => navigate(`/detail/${resource.id}`)}
                      className="cursor-pointer hover:shadow-md transition-shadow duration-200"
                    >
                      <img
                        src={resource.poster_url || `https://via.placeholder.com/200x300?text=${encodeURIComponent(resource.drama_name)}`}
                        alt={resource.drama_name}
                        className="w-full h-48 object-cover rounded-md mb-2"
                      />
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                        {resource.drama_name}
                      </h3>
                      {resource.year_released && (
                        <p className="text-gray-600 text-xs mt-1">
                          {resource.year_released}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};