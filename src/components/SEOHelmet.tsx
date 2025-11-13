import { Helmet } from 'react-helmet-async';
import { ResourceWithDetails } from '../../shared/types';

interface SEOHelmetProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'video';
  resource?: ResourceWithDetails;
}

export const SEOHelmet: React.FC<SEOHelmetProps> = ({
  title,
  description,
  image,
  url,
  type = 'website',
  resource
}) => {
  const siteUrl = url || window.location.origin;
  const siteImage = image || `${window.location.origin}/og-image.jpg`;
  
  const structuredData = resource ? {
    "@context": "https://schema.org",
    "@type": type === 'video' ? 'Movie' : 'CreativeWork',
    "name": resource.drama_name,
    "alternateName": resource.alias,
    "description": resource.description || description,
    "image": resource.poster_url || siteImage,
    "dateCreated": resource.create_time,
    "dateModified": resource.update_time,
    "genre": [resource.category1, resource.category2].filter(Boolean),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "8.0",
      "reviewCount": resource.view_count
    }
  } : null;

  return (
    <Helmet>
      {/* 基础SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="影视资源,网盘资源,电影,电视剧,动漫,综艺,纪录片" />
      <meta name="author" content="影视资源搜索" />
      <link rel="canonical" href={siteUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={siteImage} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="影视资源搜索" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={siteImage} />

      {/* 移动端优化 */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />

      {/* 结构化数据 */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* 性能优化 */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
    </Helmet>
  );
};