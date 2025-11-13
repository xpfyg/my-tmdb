import React from 'react';
import { Star, Share2, ExternalLink } from 'lucide-react';
import { ResourceWithDetails } from '../../../shared/types';
import { formatFileSize, truncateText, generateShareUrl, copyToClipboard, cn } from '../utils';

interface ResourceCardProps {
  resource: ResourceWithDetails;
  onShare?: (resource: ResourceWithDetails) => void;
  className?: string;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ 
  resource, 
  onShare, 
  className 
}) => {
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = generateShareUrl(resource.id);
    
    try {
      await copyToClipboard(shareUrl);
      if (onShare) {
        onShare(resource);
      }
      // 这里可以添加toast提示
      console.log('分享链接已复制到剪贴板');
    } catch (error) {
      console.error('复制分享链接失败:', error);
    }
  };

  const handleResourceClick = () => {
    window.location.href = `/detail/${resource.id}`;
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (resource.link && !resource.is_expired) {
      window.open(resource.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      className={cn(
        "bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer",
        "transform hover:-translate-y-1",
        className
      )}
      onClick={handleResourceClick}
    >
      {/* 海报图片 */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
        <img
          src={resource.poster_url || `https://via.placeholder.com/300x450?text=${encodeURIComponent(resource.drama_name)}`}
          alt={resource.drama_name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        
        {/* 热度标签 */}
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          热 {resource.hot}
        </div>

        {/* 评分标签 */}
        {resource.year_released && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            {resource.year_released}
          </div>
        )}

        {/* 过期状态 */}
        {resource.is_expired && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-sm bg-red-600 px-3 py-1 rounded-full">
              链接失效
            </span>
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div className="p-4">
        {/* 标题 */}
        <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
          {resource.drama_name}
        </h3>

        {/* 副标题 */}
        {resource.alias && (
          <p className="text-gray-600 text-xs mb-2 line-clamp-1">
            {resource.alias}
          </p>
        )}

        {/* 分类信息 */}
        <div className="flex flex-wrap gap-1 mb-3">
          {resource.category1 && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {resource.category1}
            </span>
          )}
          {resource.category2 && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              {resource.category2}
            </span>
          )}
        </div>

        {/* 统计信息 */}
        <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
          <span>浏览 {resource.view_count}</span>
          <span>分享 {resource.share_count}</span>
          {resource.size && <span>{formatFileSize(resource.size)}</span>}
        </div>

        {/* 描述 */}
        {resource.description && (
          <p className="text-gray-700 text-xs mb-3 line-clamp-2 min-h-[2.5rem]">
            {truncateText(resource.description, 80)}
          </p>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className={cn(
              "flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium rounded-md transition-colors",
              "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            <Share2 className="w-3 h-3" />
            分享
          </button>
          
          {!resource.is_expired && resource.link && (
            <button
              onClick={handleLinkClick}
              className={cn(
                "flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium rounded-md transition-colors",
                "bg-blue-600 text-white hover:bg-blue-700"
              )}
            >
              <ExternalLink className="w-3 h-3" />
              访问
            </button>
          )}
        </div>
      </div>
    </div>
  );
};