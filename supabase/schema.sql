-- =============================================
-- 个人博客 Supabase 数据库初始化脚本
-- 请在 Supabase 控制台 SQL Editor 中执行此脚本
-- =============================================

-- 1. 创建分类表
CREATE TABLE IF NOT EXISTS categories (
  id        BIGSERIAL PRIMARY KEY,
  name      TEXT NOT NULL,
  slug      TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 创建文章表
CREATE TABLE IF NOT EXISTS articles (
  id          BIGSERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  excerpt     TEXT,
  content     TEXT,
  category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  status      TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  views       INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 创建联系消息表
CREATE TABLE IF NOT EXISTS contacts (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT,
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 创建博客设置表
CREATE TABLE IF NOT EXISTS settings (
  key        TEXT PRIMARY KEY,
  value      TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- RLS（行级安全策略）配置
-- 当前为个人博客 MVP，允许匿名 key 全量操作
-- 后续接入 Supabase Auth 后可收紧为分角色策略
-- =============================================
ALTER TABLE articles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_articles"   ON articles   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_contacts"   ON contacts   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_settings"   ON settings   FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- 初始化种子数据
-- =============================================
INSERT INTO categories (name, slug, description) VALUES
  ('技术分享', 'tech',     '涵盖编程、开发及架构相关的深度技术文章。'),
  ('项目经验', 'projects', '分享在实际项目开发中的实战经验与心得。'),
  ('职业成长', 'career',   '探讨程序员的职业规划、学习方法与成长路径。')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO articles (title, slug, excerpt, content, category_id, status) VALUES
(
  '深入理解 React 并发模式与性能优化实战',
  'react-concurrent-mode',
  '探讨 React 18 新特性在大型项目中的实际应用案例，如何通过 Transition API 和 Suspense 提升用户体验...',
  E'# 深入理解 React 并发模式\n\nReact 18 引入了并发模式，这是 React 架构的一次重大升级。\n\n## 核心概念\n\n并发模式允许 React 同时准备多个版本的 UI，这意味着 React 可以在等待数据或处理大量渲染时保持界面响应。\n\n## Transition API\n\n`useTransition` hook 允许你将某些状态更新标记为非紧急的：\n\n```javascript\nconst [isPending, startTransition] = useTransition();\n\nstartTransition(() => {\n  setState(newValue);\n});\n```\n\n## Suspense 数据获取\n\nSuspense 不再仅用于代码分割，它现在可以与数据获取库配合使用：\n\n```jsx\n<Suspense fallback={<Loading />}>\n  <ArticleList />\n</Suspense>\n```\n\n## 总结\n\n并发模式是 React 性能优化的重要工具，合理使用可以显著提升大型应用的用户体验。',
  1,
  'published'
),
(
  '从零到一：构建百万级 DAU 的架构演进之路',
  'architecture-evolution',
  '本文记录了我们在应对业务爆发式增长时，如何逐步实现微服务拆分、缓存优化以及全球化部署的完整历程...',
  E'# 架构演进之路\n\n构建高并发系统是每个工程师都会面临的挑战。\n\n## 单体架构阶段\n\n项目初期，我们使用传统的单体架构，这让我们能够快速迭代，将所有功能集中在一个代码库中。\n\n## 微服务拆分\n\n随着用户量增长，我们开始按业务域拆分服务：\n\n- **用户服务**：负责注册、登录、Profile 管理\n- **订单服务**：处理下单、支付回调、状态流转\n- **通知服务**：邮件、短信、Push 的统一发送网关\n\n## 缓存策略\n\nRedis 集群的引入将数据库压力降低了 80%：\n\n```\n本地缓存 (LRU) → Redis 集群 → 主从数据库\n```\n\n## 总结\n\n架构演进是一个持续的过程，需要在业务复杂度和系统复杂度之间寻求平衡。没有银弹，只有最适合当前阶段的方案。',
  2,
  'published'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO settings (key, value) VALUES
  ('blog_name',    '代码匠心'),
  ('subtitle',     '资深全栈工程师作品集'),
  ('description',  '一个集成了个人作品展示、技术博客、项目案例及后台管理系统的全栈工程师作品集应用。'),
  ('github',       ''),
  ('wechat',       '')
ON CONFLICT (key) DO NOTHING;

