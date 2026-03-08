import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("blog.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT,
    category_id INTEGER,
    status TEXT DEFAULT 'draft',
    views INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories (id)
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    tags TEXT,
    link TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed initial data if empty
const categoryCount = db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number };
if (categoryCount.count === 0) {
  const insertCategory = db.prepare("INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)");
  insertCategory.run("技术分享", "tech", "涵盖编程、开发及架构相关的深度技术文章。");
  insertCategory.run("项目经验", "projects", "分享在实际项目开发中的实战经验与心得。");
  insertCategory.run("职业成长", "career", "探讨程序员的职业规划、学习方法与成长路径。");

  const insertArticle = db.prepare("INSERT INTO articles (title, slug, excerpt, content, category_id, status) VALUES (?, ?, ?, ?, ?, ?)");
  insertArticle.run(
    "深入理解 React 并发模式与性能优化实战",
    "react-concurrent-mode",
    "探讨 React 18 新特性在大型项目中的实际应用案例，如何通过 Transition API 和 Suspense 提升用户体验...",
    "# 深入理解 React 并发模式\n\nReact 18 引入了并发模式...",
    1,
    "published"
  );
  insertArticle.run(
    "从零到一：构建百万级 DAU 的架构演进之路",
    "architecture-evolution",
    "本文记录了我们在应对业务爆发式增长时，如何逐步实现微服务拆分、缓存优化以及全球化部署的完整历程...",
    "# 架构演进之路\n\n构建高并发系统需要考虑...",
    2,
    "published"
  );
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/stats", (req, res) => {
    const articleCount = db.prepare("SELECT COUNT(*) as count FROM articles").get() as { count: number };
    const categoryCount = db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number };
    const totalViews = db.prepare("SELECT SUM(views) as total FROM articles").get() as { total: number };
    res.json({
      articles: articleCount.count,
      categories: categoryCount.count,
      views: totalViews.total || 0
    });
  });

  app.get("/api/articles", (req, res) => {
    const articles = db.prepare(`
      SELECT a.*, c.name as category_name 
      FROM articles a 
      LEFT JOIN categories c ON a.category_id = c.id 
      ORDER BY a.created_at DESC
    `).all();
    res.json(articles);
  });

  app.get("/api/articles/:slug", (req, res) => {
    const article = db.prepare(`
      SELECT a.*, c.name as category_name 
      FROM articles a 
      LEFT JOIN categories c ON a.category_id = c.id 
      WHERE a.slug = ?
    `).get(req.params.slug);
    
    if (article) {
      db.prepare("UPDATE articles SET views = views + 1 WHERE slug = ?").run(req.params.slug);
      res.json(article);
    } else {
      res.status(404).json({ error: "Article not found" });
    }
  });

  app.get("/api/categories", (req, res) => {
    const categories = db.prepare("SELECT * FROM categories").all();
    res.json(categories);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
