import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import {
  Code,
  Search,
  ArrowRight,
  Calendar,
  ChevronRight,
  Mail,
  MessageSquare,
  Github,
  Terminal,
  LayoutDashboard,
  FileText,
  Folder,
  Settings,
  LogOut,
  Bell,
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Share2,
  Bookmark,
  ThumbsUp,
  ExternalLink,
  Database,
  Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabase } from './lib/supabase';

// ---------- 工具函数 ----------

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Supabase JOIN 查询返回 { categories: { name } }，
 * 将其展平为模板已有的 category_name 字段，减少模板改动。
 */
const mapArticle = (a: any) => ({ ...a, category_name: a.categories?.name ?? '' });

// ---------- Navbar ----------

const Navbar = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  if (isAdmin) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
                <Code size={24} />
              </div>
              <h2 className="text-xl font-bold tracking-tight">代码匠心</h2>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className={cn('text-sm font-medium transition-colors hover:text-accent', location.pathname === '/' ? 'text-accent' : 'text-slate-500 dark:text-slate-400')}>首页</Link>
              <Link to="/blog" className={cn('text-sm font-medium transition-colors hover:text-accent', location.pathname === '/blog' ? 'text-accent' : 'text-slate-500 dark:text-slate-400')}>技术文章</Link>
              <Link to="/projects" className={cn('text-sm font-medium transition-colors hover:text-accent', location.pathname === '/projects' ? 'text-accent' : 'text-slate-500 dark:text-slate-400')}>项目案例</Link>
              <Link to="/about" className={cn('text-sm font-medium transition-colors hover:text-accent', location.pathname === '/about' ? 'text-accent' : 'text-slate-500 dark:text-slate-400')}>关于我</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-1.5 border border-transparent focus-within:border-accent/50 transition-all">
              <Search size={18} className="text-slate-400" />
              <input className="bg-transparent border-none focus:ring-0 text-sm w-32 lg:w-48 placeholder:text-slate-500" placeholder="搜索文章..." type="text" />
            </div>
            <Link to="/contact" className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-all">联系我</Link>
            <div className="size-10 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/seed/dev/100/100')" }} />
          </div>
        </div>
      </div>
    </header>
  );
};

// ---------- Footer ----------

const Footer = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-white dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 py-12 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <Code size={16} />
            </div>
            <span className="text-lg font-bold">代码匠心</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <a className="hover:text-primary transition-colors" href="#">GitHub</a>
            <a className="hover:text-primary transition-colors" href="#">掘金</a>
            <a className="hover:text-primary transition-colors" href="#">知乎</a>
            <a className="hover:text-primary transition-colors" href="#">RSS 订阅</a>
          </div>
          <p className="text-sm text-slate-400">© 2024 个人作品集. 基于 Tailwind CSS 4 构建</p>
        </div>
      </div>
    </footer>
  );
};

// ---------- 首页 ----------

const Home = () => {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from('articles')
      .select('*, categories(name)')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => {
        if (data) setArticles(data.map(mapArticle));
      });
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              开放远程机会
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              资深 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">全栈开发工程师</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              专注于构建高性能、可扩展的现代化 Web 应用。深耕 TypeScript, React, Node.js 以及云原生架构十余载，致力于通过技术解决商业难题。
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/projects" className="bg-primary text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:translate-y-[-2px] transition-all">
                查看作品集 <ArrowRight size={20} />
              </Link>
              <Link to="/blog" className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-8 py-3 rounded-lg font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                阅读博客
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 to-emerald-500/20 rounded-3xl blur-2xl"></div>
            <div className="relative aspect-square rounded-3xl overflow-hidden border-8 border-white dark:border-slate-800 shadow-2xl">
              <img alt="Professional portrait" className="w-full h-full object-cover" src="https://picsum.photos/seed/alex/800/800" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 hidden sm:block">
              <div className="flex flex-col">
                <span className="text-3xl font-black text-primary dark:text-white">10+</span>
                <span className="text-sm text-slate-500">行业经验 (年)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 精选文章 */}
      <section className="py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">精选文章</h2>
            <p className="text-slate-600 dark:text-slate-400">分享技术心得、项目实战经验与职业成长感悟</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium">全部</button>
            <button className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700">技术分享</button>
            <button className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700">项目经验</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article key={article.id} className="flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-shadow group">
              <div className="aspect-video relative overflow-hidden">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={`https://picsum.photos/seed/${article.slug}/600/400`} referrerPolicy="no-referrer" />
                <div className="absolute top-4 left-4 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">{article.category_name}</div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="text-slate-500 text-xs font-medium mb-3 flex items-center gap-2">
                  <Calendar size={14} /> {format(new Date(article.created_at), 'yyyy-MM-dd')}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">
                  <Link to={`/blog/${article.slug}`}>{article.title}</Link>
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-1">{article.excerpt}</p>
                <Link to={`/blog/${article.slug}`} className="text-primary dark:text-slate-200 font-bold text-sm inline-flex items-center gap-1 group/link">
                  阅读全文 <ChevronRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <div className="bg-primary rounded-[2rem] p-8 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-6">
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">寻找可靠的技术伙伴？</h2>
            <p className="text-slate-300 text-lg">无论你是想要交流技术，还是有极具挑战性的项目需要合作，我都非常期待与你沟通。</p>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <Link to="/contact" className="bg-white text-primary px-10 py-4 rounded-xl font-black hover:bg-slate-100 transition-all flex items-center gap-2">
                <Mail size={20} /> 发送邮件
              </Link>
              <button className="bg-slate-700 text-white px-10 py-4 rounded-xl font-black border border-slate-600 hover:bg-slate-600 transition-all flex items-center gap-2">
                <MessageSquare size={20} /> 微信联系
              </button>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

// ---------- 文章列表 ----------

const BlogList = () => {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from('articles')
      .select('*, categories(name)')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setArticles(data.map(mapArticle));
      });
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black mb-4">技术分享</h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">在这里我分享关于前端开发、人工智能、后端架构以及 DevOps 的深度见解和实践经验。</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <article key={article.id} className="flex flex-col group cursor-pointer">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 bg-slate-200 dark:bg-primary/30">
              <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={`https://picsum.photos/seed/${article.slug}/600/400`} referrerPolicy="no-referrer" />
              <div className="absolute top-3 left-3 px-2 py-1 bg-primary/80 backdrop-blur-md text-white text-[10px] font-bold rounded uppercase tracking-wider">{article.category_name}</div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                <Link to={`/blog/${article.slug}`}>{article.title}</Link>
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{article.excerpt}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1"><Calendar size={12} /> {format(new Date(article.created_at), 'yyyy-MM-dd')}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> 15 min read</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </motion.div>
  );
};

// ---------- 文章详情 ----------

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from('articles')
      .select('*, categories(name)')
      .eq('slug', slug)
      .single()
      .then(({ data }) => {
        if (data) {
          setArticle(mapArticle(data));
          // 文章浏览量 +1（非阻塞）
          supabase.from('articles').update({ views: (data.views ?? 0) + 1 }).eq('id', data.id);
        }
      });
  }, [slug]);

  if (!article) return <div className="p-20 text-center">加载中...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-6 md:px-20 py-12 flex flex-col lg:flex-row gap-12">
      <article className="flex-1 max-w-4xl">
        <nav className="flex items-center gap-2 text-slate-500 text-sm mb-8">
          <Link to="/" className="hover:text-accent transition-colors">首页</Link>
          <ChevronRight size={14} />
          <Link to="/blog" className="hover:text-accent transition-colors">技术分享</Link>
          <ChevronRight size={14} />
          <span className="text-slate-300">文章详情</span>
        </nav>
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-100 leading-tight mb-6">{article.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-slate-400 text-sm">
            <div className="flex items-center gap-2">
              <img className="w-6 h-6 rounded-full" src="https://picsum.photos/seed/alex/50/50" referrerPolicy="no-referrer" />
              <span className="text-slate-200">张先生</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={16} />
              <span>{format(new Date(article.created_at), 'yyyy年MM月dd日')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Folder size={16} />
              <span className="text-accent/80 font-medium">{article.category_name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={16} />
              <span>15 分钟阅读</span>
            </div>
          </div>
        </header>
        <div className="markdown-body">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>
        <div className="mt-12 flex gap-2">
          <span className="bg-primary/50 text-slate-400 px-3 py-1 rounded-full text-xs hover:text-white cursor-pointer"># React</span>
          <span className="bg-primary/50 text-slate-400 px-3 py-1 rounded-full text-xs hover:text-white cursor-pointer"># 性能优化</span>
        </div>
      </article>
      <aside className="hidden lg:block w-72">
        <div className="sticky top-28 space-y-8">
          <div>
            <h3 className="text-slate-100 font-bold mb-4 flex items-center gap-2">
              <Terminal size={18} className="text-accent" /> 目录
            </h3>
            <ul className="space-y-4 border-l border-primary/30 ml-2">
              <li><a className="block pl-4 py-1 text-slate-400 hover:text-accent border-l-2 border-transparent hover:border-accent -ml-[1px] transition-all text-sm" href="#">核心概念</a></li>
              <li><a className="block pl-4 py-1 text-slate-400 hover:text-accent border-l-2 border-transparent hover:border-accent -ml-[1px] transition-all text-sm" href="#">性能优化</a></li>
            </ul>
          </div>
          <div className="bg-primary/20 p-6 rounded-2xl border border-primary/30">
            <h4 className="text-white font-bold mb-2">订阅博主</h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">获取最新的技术动态与深度好文，每周准时推送。</p>
            <div className="flex flex-col gap-2">
              <input className="bg-background-dark border-primary/50 rounded-lg px-3 py-2 text-sm focus:ring-accent focus:border-accent text-white" placeholder="你的邮箱" type="email" />
              <button className="bg-accent text-white text-sm font-bold py-2 rounded-lg hover:bg-blue-600 transition-colors">订阅</button>
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 text-slate-500">
            <button className="hover:text-white transition-colors"><Share2 size={20} /></button>
            <button className="hover:text-white transition-colors"><Bookmark size={20} /></button>
            <button className="hover:text-white transition-colors"><ThumbsUp size={20} /></button>
          </div>
        </div>
      </aside>
    </motion.div>
  );
};

// ---------- 关于我 ----------

const About = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
    <div className="flex flex-col gap-12">
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <div className="w-48 h-48 rounded-3xl overflow-hidden shrink-0 border-4 border-white dark:border-slate-800 shadow-xl">
          <img src="https://picsum.photos/seed/alex/400/400" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-black">关于我</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">你好，我是 Alex。一名拥有 10 年经验的全栈工程师，目前专注于 AI 应用开发与高性能架构。</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2"><Terminal size={24} className="text-accent" /> 技术栈</h2>
          <div className="flex flex-wrap gap-3">
            {['TypeScript', 'React', 'Node.js', 'Python', 'Docker', 'Kubernetes', 'AWS', 'PostgreSQL', 'Redis', 'GraphQL'].map(skill => (
              <span key={skill} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-bold border border-slate-200 dark:border-slate-700">{skill}</span>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2"><Database size={24} className="text-accent" /> 职业经历</h2>
          <div className="space-y-6 border-l-2 border-slate-200 dark:border-slate-800 ml-3 pl-6">
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 size-4 rounded-full bg-accent border-4 border-white dark:border-slate-900"></div>
              <h4 className="font-bold">资深全栈工程师 @ 某知名独角兽</h4>
              <p className="text-sm text-slate-500">2020 - 至今</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">负责核心交易系统的重构与性能优化，支撑了双十一期间百万级并发。</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 size-4 rounded-full bg-slate-300 dark:bg-slate-700 border-4 border-white dark:border-slate-900"></div>
              <h4 className="font-bold">高级前端开发 @ 互联网大厂</h4>
              <p className="text-sm text-slate-500">2016 - 2020</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">主导了公司级组件库的开发，服务于内部 50+ 个业务线。</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-primary/5 dark:bg-slate-800/50 p-8 rounded-3xl border border-primary/10">
        <h2 className="text-2xl font-bold mb-6">我的理念</h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic text-lg">
          "技术不应该是冰冷的工具，而应该是解决问题的艺术。我追求代码的简洁与优雅，更看重技术为用户带来的真实价值。在不断变化的技术浪潮中，保持好奇心与持续学习是我前进的动力。"
        </p>
      </div>
    </div>
  </motion.div>
);

// ---------- 联系我 ----------

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('contacts').insert(form);
    setLoading(false);
    if (!error) {
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-black mb-4">联系我</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">如果你有任何问题、合作意向，或者只是想打个招呼，欢迎随时联系我。</p>
          </div>
          <div className="space-y-6">
            {[
              { icon: Mail, color: 'blue', label: '邮箱', value: 'hello@alexcode.com' },
              { icon: MessageSquare, color: 'emerald', label: '微信', value: 'Alex_Dev_2024' },
              { icon: Github, color: 'slate', label: 'GitHub', value: 'github.com/alex-fullstack' },
            ].map(({ icon: Icon, color, label, value }) => (
              <div key={label} className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className={`size-12 rounded-xl bg-${color}-500/10 text-${color}-500 flex items-center justify-center`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{label}</p>
                  <p className="font-bold">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="size-20 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-6">
                  <ThumbsUp size={40} />
                </div>
                <h3 className="text-2xl font-bold mb-2">发送成功！</h3>
                <p className="text-slate-500">感谢你的留言，我会尽快回复你。</p>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">姓名</label>
                    <input required className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent/20 outline-none transition-all" placeholder="你的名字" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">邮箱</label>
                    <input required type="email" className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent/20 outline-none transition-all" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">主题</label>
                  <input required className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent/20 outline-none transition-all" placeholder="你想聊聊什么？" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">留言内容</label>
                  <textarea required rows={5} className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none" placeholder="在这里写下你的留言..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-primary text-white font-black py-4 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? '发送中...' : <><span>发送消息</span> <ArrowRight size={20} /></>}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// ---------- 项目案例 ----------

const Projects = () => {
  const projects = [
    { id: 1, title: '智能投顾 AI 助手', description: '基于 LLM 的金融问答系统，支持实时行情分析与个性化资产配置建议。', tags: ['AI', 'Python', 'React'], image: 'https://picsum.photos/seed/ai/600/400' },
    { id: 2, title: '分布式电商秒杀系统', description: '应对高并发场景的电商解决方案，采用 Redis 队列与数据库读写分离架构。', tags: ['Web', 'Node.js', 'Redis'], image: 'https://picsum.photos/seed/web/600/400' },
    { id: 3, title: '跨平台健康管理 App', description: '使用 React Native 开发的健康追踪应用，集成硬件传感器数据实时同步。', tags: ['App', 'React Native', 'IoT'], image: 'https://picsum.photos/seed/app/600/400' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black mb-4">项目案例</h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">精选我在过去几年中主导或核心参与的代表性项目。</p>
      </div>
      <div className="flex gap-4 mb-12 overflow-x-auto pb-2">
        {['全部', 'AI 算法', 'Web 开发', '移动端', '架构设计'].map((filter, i) => (
          <button key={i} className={cn('px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all', i === 0 ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700')}>
            {filter}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div key={project.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm group">
            <div className="aspect-video relative overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={project.image} referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <button className="bg-white text-primary px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">查看详情 <ExternalLink size={16} /></button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex gap-2 mb-3">
                {project.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 uppercase tracking-wider">{tag}</span>
                ))}
              </div>
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{project.description}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ---------- Admin 布局 ----------

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: '仪表盘' },
    { to: '/admin/articles', icon: FileText, label: '文章管理' },
    { to: '/admin/categories', icon: Folder, label: '分类管理' },
    { to: '/admin/settings', icon: Settings, label: '设置' },
  ];

  const getTitle = () => {
    const item = navItems.find(item => item.to === location.pathname);
    return item ? item.label : '控制台';
  };

  return (
    <div className="flex min-h-screen bg-background-dark text-slate-100">
      <aside className="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 rounded-lg bg-blue-500 flex items-center justify-center text-white">
            <Terminal size={24} />
          </div>
          <div>
            <h1 className="text-white text-lg font-bold leading-tight">博客管理系统</h1>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Super Admin</p>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to} className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group', isActive ? 'bg-blue-600/10 text-blue-400 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white')}>
                <Icon size={20} className={isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-4 mt-4 border-t border-slate-800">
            <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors group">
              <ExternalLink size={20} />
              <span className="text-sm">返回网站首页</span>
            </Link>
          </div>
        </nav>
        <div className="p-4 mt-auto">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="size-10 rounded-full bg-slate-700 overflow-hidden">
              <img className="w-full h-full object-cover" src="https://picsum.photos/seed/alex/50/50" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">陈大文</p>
              <p className="text-xs text-slate-500 truncate">admin@blog.com</p>
            </div>
            <LogOut size={18} className="text-slate-500 cursor-pointer hover:text-white" />
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-slate-800 bg-background-dark/50 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
          <h2 className="text-lg font-bold text-white">{getTitle()}</h2>
          <div className="flex items-center gap-4">
            <div className="relative group hidden md:block">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="pl-10 pr-4 py-1.5 rounded-lg bg-slate-900 border-none text-sm w-64 focus:ring-2 focus:ring-blue-500/20 text-slate-200" placeholder="搜索文章..." type="text" />
            </div>
            <button className="relative p-2 text-slate-500 hover:bg-slate-800 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-background-dark"></span>
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-800 rounded-lg transition-colors">
              <HelpCircle size={20} />
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">{children}</div>
      </main>
    </div>
  );
};

// ---------- 仪表盘 ----------

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<{ articles: number; categories: number; views: number } | null>(null);
  const [recentArticles, setRecentArticles] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      // 并行请求统计数据
      const [artRes, catRes, viewsRes] = await Promise.all([
        supabase.from('articles').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('articles').select('views'),
      ]);
      setStats({
        articles: artRes.count ?? 0,
        categories: catRes.count ?? 0,
        views: (viewsRes.data ?? []).reduce((sum: number, a: any) => sum + (a.views ?? 0), 0),
      });

      // 近期文章
      const { data } = await supabase.from('articles').select('*, categories(name)').order('created_at', { ascending: false }).limit(5);
      if (data) setRecentArticles(data.map(mapArticle));
    };
    init();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-white">欢迎回来，管理员</h3>
        <p className="text-slate-400 mt-1">这是您博客的实时数据统计和最新动态。</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: FileText, color: 'blue', label: '文章总数', value: stats?.articles ?? 0, badge: '+12.5%', badgeColor: 'emerald' },
          { icon: Folder, color: 'purple', label: '分类总数', value: stats?.categories ?? 0, badge: '持平', badgeColor: 'slate' },
          { icon: Eye, color: 'amber', label: '总浏览量', value: stats?.views ?? 0, badge: '+5.4%', badgeColor: 'emerald' },
        ].map(({ icon: Icon, color, label, value, badge, badgeColor }) => (
          <div key={label} className="p-6 rounded-xl bg-[#111827] border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 bg-${color}-500/10 text-${color}-500 rounded-lg`}><Icon size={24} /></div>
              <span className={`text-${badgeColor}-500 text-xs font-bold bg-${badgeColor}-500/10 px-2 py-1 rounded-full`}>{badge}</span>
            </div>
            <p className="text-slate-400 text-sm font-medium">{label}</p>
            <h4 className="text-2xl font-bold text-white mt-1">{value}</h4>
          </div>
        ))}
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">近期文章</h3>
          <Link to="/admin/articles" className="text-blue-500 text-sm font-semibold hover:underline">查看全部</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">标题</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">分类</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">浏览量</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {recentArticles.map(article => (
                <tr key={article.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex-shrink-0 overflow-hidden">
                        <img className="w-full h-full object-cover" src={`https://picsum.photos/seed/${article.slug}/50/50`} referrerPolicy="no-referrer" />
                      </div>
                      <p className="text-sm font-semibold text-white line-clamp-1">{article.title}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="text-xs font-medium px-2 py-1 rounded bg-slate-800 text-slate-400">{article.category_name}</span></td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
                      <span className="size-1.5 rounded-full bg-emerald-500"></span> {article.status === 'published' ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">{article.views}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => navigate(`/admin/editor/${article.id}`)} className="p-1 hover:text-blue-500 transition-colors"><Edit size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ---------- 文章管理 ----------

const AdminArticles = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<any[]>([]);

  const fetchArticles = async () => {
    const { data } = await supabase.from('articles').select('*, categories(name)').order('created_at', { ascending: false });
    if (data) setArticles(data.map(mapArticle));
  };

  useEffect(() => { fetchArticles(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这篇文章吗？')) return;
    await supabase.from('articles').delete().eq('id', id);
    fetchArticles();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">文章管理</h3>
        <Link to="/admin/editor" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <Plus size={18} /> 新建文章
        </Link>
      </div>
      <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">标题</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">分类</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">发布日期</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {articles.map(article => (
                <tr key={article.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4"><p className="text-sm font-semibold text-white line-clamp-1">{article.title}</p></td>
                  <td className="px-6 py-4"><span className="text-xs font-medium px-2 py-1 rounded bg-slate-800 text-slate-400">{article.category_name}</span></td>
                  <td className="px-6 py-4">
                    <span className={cn('inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium', article.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-400')}>
                      <span className={cn('size-1.5 rounded-full', article.status === 'published' ? 'bg-emerald-500' : 'bg-amber-400')}></span>
                      {article.status === 'published' ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">{format(new Date(article.created_at), 'yyyy-MM-dd')}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => navigate(`/admin/editor/${article.id}`)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(article.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ---------- 文章编辑器 ----------

const AdminEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('# 请输入内容...');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // 加载分类列表
    supabase.from('categories').select('*').order('name').then(({ data }) => {
      if (data) setCategories(data);
    });
    // 编辑模式：加载文章数据
    if (id) {
      supabase.from('articles').select('*').eq('id', id).single().then(({ data }) => {
        if (data) {
          setTitle(data.title);
          setSlug(data.slug);
          setExcerpt(data.excerpt ?? '');
          setContent(data.content ?? '');
          setCategoryId(data.category_id ? String(data.category_id) : '');
        }
      });
    }
  }, [id]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // 仅当 slug 未被手动编辑过时才自动生成
    if (!slug || slug === title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')) {
      setSlug(newTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''));
    }
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!title.trim() || !slug.trim()) return;
    setSaving(true);
    const payload = {
      title,
      slug,
      excerpt,
      content,
      category_id: categoryId ? parseInt(categoryId) : null,
      status,
      updated_at: new Date().toISOString(),
    };
    if (id) {
      await supabase.from('articles').update(payload).eq('id', id);
    } else {
      await supabase.from('articles').insert(payload);
    }
    setSaving(false);
    navigate('/admin/articles');
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">{id ? '编辑文章' : '撰写新文章'}</h3>
        <div className="flex gap-3">
          <button onClick={() => handleSave('draft')} disabled={saving} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-sm font-bold hover:bg-slate-700 transition-colors disabled:opacity-50">
            保存草稿
          </button>
          <button onClick={() => handleSave('published')} disabled={saving} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">
            {saving ? '保存中...' : '发布文章'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <div className="flex flex-col gap-4">
          <input
            className="bg-slate-900 border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/20 text-lg font-bold outline-none"
            placeholder="文章标题"
            value={title}
            onChange={handleTitleChange}
          />
          <div className="flex gap-4">
            <select
              className="flex-1 bg-slate-900 border-slate-800 rounded-xl px-4 py-2 text-slate-400 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
            >
              <option value="">选择分类</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
            <input
              className="flex-1 bg-slate-900 border-slate-800 rounded-xl px-4 py-2 text-slate-400 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="文章别名 (Slug)"
              value={slug}
              onChange={e => setSlug(e.target.value)}
            />
          </div>
          <input
            className="bg-slate-900 border-slate-800 rounded-xl px-4 py-2 text-slate-400 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="文章摘要（可选）"
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
          />
          <textarea
            className="flex-1 bg-slate-900 border-slate-800 rounded-xl p-4 text-slate-300 font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500/20 outline-none"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-800 overflow-y-auto p-8 markdown-body">
          <h1 className="!mt-0">{title || '文章标题预览'}</h1>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

// ---------- 分类管理 ----------

const AdminCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '' });

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
    if (data) setCategories(data);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleOpenAdd = () => {
    setForm({ name: '', slug: '', description: '' });
    setEditId(null);
    setShowForm(true);
  };

  const handleOpenEdit = (cat: any) => {
    setForm({ name: cat.name, slug: cat.slug, description: cat.description ?? '' });
    setEditId(cat.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) return;
    if (editId) {
      await supabase.from('categories').update(form).eq('id', editId);
    } else {
      await supabase.from('categories').insert(form);
    }
    setShowForm(false);
    setEditId(null);
    setForm({ name: '', slug: '', description: '' });
    fetchCategories();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除此分类吗？（该分类下的文章将变为无分类）')) return;
    await supabase.from('categories').delete().eq('id', id);
    fetchCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">分类管理</h3>
        <button onClick={handleOpenAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <Plus size={18} /> 新增分类
        </button>
      </div>

      {/* 新增/编辑表单 */}
      {showForm && (
        <div className="p-6 bg-[#111827] border border-blue-500/30 rounded-xl space-y-4">
          <h4 className="text-white font-bold">{editId ? '编辑分类' : '新增分类'}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-bold">名称</label>
              <input className="w-full bg-slate-900 border-slate-800 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="分类名称" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-bold">别名 (Slug)</label>
              <input className="w-full bg-slate-900 border-slate-800 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="category-slug" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-bold">描述</label>
            <input className="w-full bg-slate-900 border-slate-800 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="分类描述（可选）" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => { setShowForm(false); setEditId(null); }} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-sm font-bold hover:bg-slate-700">取消</button>
            <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700">保存</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <div key={category.id} className="p-6 rounded-xl bg-[#111827] border border-slate-800 shadow-sm group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Folder size={24} /></div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenEdit(category)} className="p-1 text-slate-400 hover:text-blue-500"><Edit size={16} /></button>
                <button onClick={() => handleDelete(category.id)} className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
              </div>
            </div>
            <h4 className="text-lg font-bold text-white">{category.name}</h4>
            <p className="text-sm text-slate-500 mt-2 line-clamp-2">{category.description}</p>
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>别名: {category.slug}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------- 系统设置 ----------

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    blog_name: '代码匠心',
    subtitle: '资深全栈工程师作品集',
    description: '一个集成了个人作品展示、技术博客、项目案例及后台管理系统的全栈工程师作品集应用。',
    github: '',
    wechat: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from('settings').select('*').then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((s: any) => { map[s.key] = s.value ?? ''; });
        setSettings(prev => ({ ...prev, ...map }));
      }
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const rows = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString(),
    }));
    await supabase.from('settings').upsert(rows, { onConflict: 'key' });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-white">系统设置</h3>
        <p className="text-slate-400 mt-1">管理你的博客基本信息与偏好设置。</p>
      </div>
      <div className="space-y-6">
        <div className="p-8 rounded-2xl bg-[#111827] border border-slate-800 space-y-6">
          <h4 className="text-lg font-bold text-white flex items-center gap-2"><Settings size={20} className="text-blue-500" /> 基本信息</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400">博客名称</label>
              <input className="w-full bg-slate-900 border-slate-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/20 outline-none" value={settings.blog_name} onChange={e => setSettings({ ...settings, blog_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400">副标题</label>
              <input className="w-full bg-slate-900 border-slate-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/20 outline-none" value={settings.subtitle} onChange={e => setSettings({ ...settings, subtitle: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400">博客描述</label>
            <textarea rows={3} className="w-full bg-slate-900 border-slate-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/20 outline-none resize-none" value={settings.description} onChange={e => setSettings({ ...settings, description: e.target.value })} />
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-[#111827] border border-slate-800 space-y-6">
          <h4 className="text-lg font-bold text-white flex items-center gap-2"><Share2 size={20} className="text-emerald-500" /> 社交媒体</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400">GitHub</label>
              <input className="w-full bg-slate-900 border-slate-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/20 outline-none" placeholder="https://github.com/..." value={settings.github} onChange={e => setSettings({ ...settings, github: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400">微信</label>
              <input className="w-full bg-slate-900 border-slate-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/20 outline-none" placeholder="微信号" value={settings.wechat} onChange={e => setSettings({ ...settings, wechat: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 items-center">
          {saved && <span className="text-emerald-400 text-sm font-medium">✓ 保存成功</span>}
          <button onClick={() => window.location.reload()} className="px-6 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-all">重置</button>
          <button onClick={handleSave} disabled={saving} className="px-8 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all disabled:opacity-50">
            {saving ? '保存中...' : '保存更改'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------- 应用根组件 ----------

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<ArticleDetail />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
            <Route path="/admin/articles" element={<AdminLayout><AdminArticles /></AdminLayout>} />
            <Route path="/admin/editor" element={<AdminLayout><AdminEditor /></AdminLayout>} />
            <Route path="/admin/editor/:id" element={<AdminLayout><AdminEditor /></AdminLayout>} />
            <Route path="/admin/categories" element={<AdminLayout><AdminCategories /></AdminLayout>} />
            <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
