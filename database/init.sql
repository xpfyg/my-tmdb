# 数据库初始化脚本

## 创建数据库
```sql
CREATE DATABASE IF NOT EXISTS video_resource_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE video_resource_db;
```

## 创建表结构

### cloud_resource 表
```sql
CREATE TABLE IF NOT EXISTS cloud_resource (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    drama_name VARCHAR(255) NOT NULL DEFAULT '' COMMENT '剧名',
    alias VARCHAR(200) NOT NULL DEFAULT '' COMMENT '别名',
    category1 VARCHAR(100) NOT NULL DEFAULT '' COMMENT '分类1,影视资源,学习资料',
    category2 VARCHAR(100) DEFAULT NULL COMMENT '分类2（如电影、电视剧、动漫等）',
    drive_type VARCHAR(50) NOT NULL COMMENT '网盘类型（如百度云、阿里云、腾讯云等）',
    link TEXT DEFAULT NULL COMMENT '网盘分享链接',
    is_expired TINYINT NOT NULL DEFAULT 1 COMMENT '是否失效（0：有效，1：失效）',
    view_count INT NOT NULL DEFAULT 0 COMMENT '浏览次数',
    share_count INT NOT NULL DEFAULT 0 COMMENT '分享次数',
    hot INT NOT NULL DEFAULT 0 COMMENT '热度',
    size VARCHAR(50) DEFAULT NULL COMMENT '文件大小',
    tmdb_id INT DEFAULT NULL COMMENT '影视资源信息ID',
    last_share_time DATETIME DEFAULT NULL COMMENT '上次分享时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录修改时间',
    UNIQUE KEY uk_drama_drive (drama_name, drive_type),
    INDEX idx_category1 (category1),
    INDEX idx_category2 (category2),
    INDEX idx_drive_type (drive_type),
    INDEX idx_hot (hot DESC),
    INDEX idx_view_count (view_count DESC),
    INDEX idx_create_time (create_time DESC),
    INDEX idx_tmdb_id (tmdb_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='网盘资源库表';
```

### tmdb 表
```sql
CREATE TABLE IF NOT EXISTS tmdb (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    tmdb_code VARCHAR(255) NOT NULL COMMENT 'tmdb的剧编号',
    title VARCHAR(255) NOT NULL COMMENT '剧的名称',
    year_released INT DEFAULT NULL COMMENT '上映/发行年份（如2023）',
    category VARCHAR(100) DEFAULT NULL COMMENT '分类（如剧情、喜剧、科幻等）',
    description TEXT DEFAULT NULL COMMENT '剧情描述',
    poster_url VARCHAR(500) DEFAULT NULL COMMENT '海报图片链接',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录更新时间',
    UNIQUE KEY uk_title_year (title, year_released),
    INDEX idx_title (title),
    INDEX idx_year_released (year_released),
    FULLTEXT idx_search (title, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='TMDB剧集信息表（含年份）';
```

## 插入示例数据

### 插入TMDB数据
```sql
INSERT INTO tmdb (tmdb_code, title, year_released, category, description, poster_url) VALUES
('movie-001', '肖申克的救赎', 1994, '剧情', '一个关于希望、自由和救赎的故事。银行家安迪被冤枉杀害妻子和她的情人，被判终身监禁，关押在肖申克监狱。', 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg'),
('movie-002', '阿甘正传', 1994, '剧情/喜剧', '阿甘是一个智商只有75的低能儿，但他善良单纯，通过自己的努力创造了一个又一个奇迹。', 'https://image.tmdb.org/t/p/w500/saHP97rTPS5eLwERh_sVru84Gbp.jpg'),
('movie-003', '泰坦尼克号', 1997, '爱情/剧情', '1912年4月10日，泰坦尼克号开始了它的处女航。富家少女罗丝与画家杰克在船上相遇并坠入爱河。', 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg'),
('tv-001', '权力的游戏', 2011, '奇幻/剧情', '故事发生在一个虚构的世界，七大王国争夺铁王座的统治权。', 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNGrF0gpkpSrfu.jpg'),
('tv-002', '绝命毒师', 2008, '犯罪/剧情', '高中化学老师沃尔特·怀特被诊断出患有肺癌，为了给家人留下财产，他开始制造和销售冰毒。', 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjuxplrQ.jpg');
```

### 插入cloud_resource数据
```sql
INSERT INTO cloud_resource (drama_name, alias, category1, category2, drive_type, link, is_expired, view_count, share_count, hot, size, tmdb_id) VALUES
('肖申克的救赎', 'The Shawshank Redemption', '影视资源', '电影', '百度云', 'https://pan.baidu.com/s/1234567890', 0, 1523, 234, 95, '2.5GB', 1),
('阿甘正传', 'Forrest Gump', '影视资源', '电影', '阿里云', 'https://www.aliyundrive.com/s/abcdef1234', 0, 2341, 456, 88, '3.2GB', 2),
('泰坦尼克号', 'Titanic', '影视资源', '电影', '腾讯云', 'https://cloud.tencent.com/developer/article/12345', 0, 3421, 678, 92, '4.1GB', 3),
('权力的游戏 第一季', 'Game of Thrones Season 1', '影视资源', '电视剧', '百度云', 'https://pan.baidu.com/s/9876543210', 0, 4532, 890, 97, '15.6GB', 4),
('绝命毒师 第一季', 'Breaking Bad Season 1', '影视资源', '电视剧', '阿里云', 'https://www.aliyundrive.com/s/fedcba0987', 0, 3214, 567, 89, '12.3GB', 5),
('肖申克的救赎 4K版', 'The Shawshank Redemption 4K', '影视资源', '电影', '夸克网盘', 'https://pan.quark.cn/s/1122334455', 0, 876, 123, 85, '8.7GB', 1),
('阿甘正传 导演剪辑版', 'Forrest Gump Directors Cut', '影视资源', '电影', '百度云', 'https://pan.baidu.com/s/5566778899', 1, 432, 65, 45, '4.8GB', 2),
('泰坦尼克号 3D版', 'Titanic 3D', '影视资源', '电影', '阿里云', 'https://www.aliyundrive.com/s/9988776655', 0, 654, 87, 78, '6.2GB', 3),
('权力的游戏 全集', 'Game of Thrones Complete', '影视资源', '电视剧', '百度云', 'https://pan.baidu.com/s/3344556677', 0, 5432, 987, 99, '89.4GB', 4),
('绝命毒师 全集', 'Breaking Bad Complete', '影视资源', '电视剧', '腾讯云', 'https://cloud.tencent.com/developer/article/556677', 0, 4321, 765, 91, '67.8GB', 5);
```

## 数据库优化建议

### 索引优化
```sql
-- 为搜索查询添加复合索引
ALTER TABLE cloud_resource ADD INDEX idx_search_composite (category1, category2, drive_type, is_expired);

-- 为排序添加索引
ALTER TABLE cloud_resource ADD INDEX idx_sort_hot (hot DESC, view_count DESC);
ALTER TABLE cloud_resource ADD INDEX idx_sort_view (view_count DESC, hot DESC);
ALTER TABLE cloud_resource ADD INDEX idx_sort_time (create_time DESC, hot DESC);
```

### 性能监控
```sql
-- 查看表大小
SELECT 
    table_name AS `Table`,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS `Size (MB)`
FROM information_schema.TABLES
WHERE table_schema = 'video_resource_db'
ORDER BY (data_length + index_length) DESC;

-- 查看索引使用情况
SHOW INDEX FROM cloud_resource;
SHOW INDEX FROM tmdb;
```

## 备份和恢复

### 备份数据库
```bash
mysqldump -u root -p video_resource_db > video_resource_backup.sql
```

### 恢复数据库
```bash
mysql -u root -p video_resource_db < video_resource_backup.sql
```