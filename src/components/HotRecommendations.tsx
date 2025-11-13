import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ResourceWithDetails } from '../../../shared/types';
import { ResourceCard } from './ResourceCard';

interface HotRecommendationsProps {
  resources: ResourceWithDetails[];
  title?: string;
  className?: string;
}

export const HotRecommendations: React.FC<HotRecommendationsProps> = ({ 
  resources, 
  title = '热门推荐',
  className 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const itemsPerPage = {
    desktop: 4,
    tablet: 3,
    mobile: 2
  };

  const getItemsPerPage = () => {
    if (window.innerWidth < 640) return itemsPerPage.mobile;
    if (window.innerWidth < 1024) return itemsPerPage.tablet;
    return itemsPerPage.desktop;
  };

  const [itemsPerPageState, setItemsPerPageState] = useState(getItemsPerPage());

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPageState(getItemsPerPage());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, resources.length - itemsPerPageState);

  useEffect(() => {
    if (!isAutoPlaying || resources.length <= itemsPerPageState) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, resources.length, itemsPerPageState, maxIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    setIsAutoPlaying(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    setIsAutoPlaying(false);
  };

  const handleIndicatorClick = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  if (resources.length === 0) {
    return (
      <div className={`py-8 ${className}`}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        <div className="text-center py-12 text-gray-500">
          暂无推荐内容
        </div>
      </div>
    );
  }

  return (
    <div className={`py-8 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        
        {/* 指示器 */}
        {resources.length > itemsPerPageState && (
          <div className="hidden sm:flex items-center gap-2">
            {Array.from({ length: maxIndex + 1 }, (_, i) => (
              <button
                key={i}
                onClick={() => handleIndicatorClick(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        {/* 轮播内容 */}
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPageState)}%)` }}
          >
            {resources.map((resource) => (
              <div 
                key={resource.id}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 px-2"
              >
                <ResourceCard 
                  resource={resource}
                  className="h-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 导航按钮 */}
        {resources.length > itemsPerPageState && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors z-10"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors z-10"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </>
        )}
      </div>

      {/* 移动端指示器 */}
      {resources.length > itemsPerPageState && (
        <div className="sm:hidden flex justify-center mt-4 gap-2">
          {Array.from({ length: maxIndex + 1 }, (_, i) => (
            <button
              key={i}
              onClick={() => handleIndicatorClick(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};