-- Supabase (PostgreSQL) 数据库初始化脚本
-- 将 MySQL 表结构转换为 PostgreSQL

-- ========================================
-- 创建 tmdb 表（TMDB 元数据表）
-- ========================================
CREATE TABLE IF NOT EXISTS tmdb (
    id SERIAL PRIMARY KEY,
    tmdb_code VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    year_released INTEGER DEFAULT NULL,
    category VARCHAR(100) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    poster_url VARCHAR(500) DEFAULT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- tmdb 表索引
CREATE INDEX IF NOT EXISTS idx_tmdb_title ON tmdb(title);
CREATE INDEX IF NOT EXISTS idx_tmdb_year_released ON tmdb(year_released);
CREATE UNIQUE INDEX IF NOT EXISTS uk_tmdb_title_year ON tmdb(title, year_released);

-- 全文搜索索引 (使用 PostgreSQL 的 GIN 索引)
CREATE INDEX IF NOT EXISTS idx_tmdb_search ON tmdb USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- 添加更新时间自动更新的触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.update_time = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tmdb_update_time BEFORE UPDATE ON tmdb
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 创建 cloud_resource 表（云资源表）
-- ========================================
CREATE TABLE IF NOT EXISTS cloud_resource (
    id SERIAL PRIMARY KEY,
    drama_name VARCHAR(255) NOT NULL DEFAULT '',
    alias VARCHAR(200) NOT NULL DEFAULT '',
    category1 VARCHAR(100) NOT NULL DEFAULT '',
    category2 VARCHAR(100) DEFAULT NULL,
    drive_type VARCHAR(50) NOT NULL,
    link TEXT DEFAULT NULL,
    is_expired SMALLINT NOT NULL DEFAULT 1,  -- 0: 有效, 1: 失效
    view_count INTEGER NOT NULL DEFAULT 0,
    share_count INTEGER NOT NULL DEFAULT 0,
    hot INTEGER NOT NULL DEFAULT 0,
    size VARCHAR(50) DEFAULT NULL,
    tmdb_id INTEGER DEFAULT NULL REFERENCES tmdb(id),
    last_share_time TIMESTAMP DEFAULT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- cloud_resource 表索引
CREATE UNIQUE INDEX IF NOT EXISTS uk_cloud_resource_drama_drive ON cloud_resource(drama_name, drive_type);
CREATE INDEX IF NOT EXISTS idx_cloud_resource_category1 ON cloud_resource(category1);
CREATE INDEX IF NOT EXISTS idx_cloud_resource_category2 ON cloud_resource(category2);
CREATE INDEX IF NOT EXISTS idx_cloud_resource_drive_type ON cloud_resource(drive_type);
CREATE INDEX IF NOT EXISTS idx_cloud_resource_hot ON cloud_resource(hot DESC);
CREATE INDEX IF NOT EXISTS idx_cloud_resource_view_count ON cloud_resource(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_cloud_resource_create_time ON cloud_resource(create_time DESC);
CREATE INDEX IF NOT EXISTS idx_cloud_resource_tmdb_id ON cloud_resource(tmdb_id);

-- 复合索引优化
CREATE INDEX IF NOT EXISTS idx_cloud_resource_search_composite ON cloud_resource(category1, category2, drive_type, is_expired);
CREATE INDEX IF NOT EXISTS idx_cloud_resource_sort_hot ON cloud_resource(hot DESC, view_count DESC);
CREATE INDEX IF NOT EXISTS idx_cloud_resource_sort_view ON cloud_resource(view_count DESC, hot DESC);
CREATE INDEX IF NOT EXISTS idx_cloud_resource_sort_time ON cloud_resource(create_time DESC, hot DESC);

-- 添加更新时间自动更新的触发器
CREATE TRIGGER update_cloud_resource_update_time BEFORE UPDATE ON cloud_resource
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 插入示例数据
-- ========================================

-- 插入 TMDB 数据
INSERT INTO tmdb (tmdb_code, title, year_released, category, description, poster_url) VALUES
('movie-001', '肖申克的救赎', 1994, '剧情', '一个关于希望、自由和救赎的故事。银行家安迪被冤枉杀害妻子和她的情人，被判终身监禁，关押在肖申克监狱。', 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg'),
('movie-002', '阿甘正传', 1994, '剧情/喜剧', '阿甘是一个智商只有75的低能儿，但他善良单纯，通过自己的努力创造了一个又一个奇迹。', 'https://image.tmdb.org/t/p/w500/saHP97rTPS5eLwERh_sVru84Gbp.jpg'),
('movie-003', '泰坦尼克号', 1997, '爱情/剧情', '1912年4月10日，泰坦尼克号开始了它的处女航。富家少女罗丝与画家杰克在船上相遇并坠入爱河。', 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg'),
('tv-001', '权力的游戏', 2011, '奇幻/剧情', '故事发生在一个虚构的世界，七大王国争夺铁王座的统治权。', 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNGrF0gpkpSrfu.jpg'),
('tv-002', '绝命毒师', 2008, '犯罪/剧情', '高中化学老师沃尔特·怀特被诊断出患有肺癌，为了给家人留下财产，他开始制造和销售冰毒。', 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjuxplrQ.jpg')
ON CONFLICT (tmdb_code) DO NOTHING;

-- 插入 cloud_resource 数据
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
('绝命毒师 全集', 'Breaking Bad Complete', '影视资源', '电视剧', '腾讯云', 'https://cloud.tencent.com/developer/article/556677', 0, 4321, 765, 91, '67.8GB', 5)
ON CONFLICT (drama_name, drive_type) DO NOTHING;

-- ========================================
-- 启用 Row Level Security (RLS) - 可选
-- ========================================
-- 如果需要公开访问，可以添加以下策略
-- ALTER TABLE tmdb ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE cloud_resource ENABLE ROW LEVEL SECURITY;

-- 允许匿名读取（根据需求调整）
-- CREATE POLICY "Enable read access for all users" ON tmdb FOR SELECT USING (true);
-- CREATE POLICY "Enable read access for all users" ON cloud_resource FOR SELECT USING (true);
