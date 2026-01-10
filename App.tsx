
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BlogPost, View, ManifestoItem, SiteSettings, AuthorProfile } from './types.ts';
import { INITIAL_POSTS } from './constants';
import Navbar from './components/Navbar';
import PostCard from './utils/PostCard';
import AdminDashboard from './views/AdminDashboard';
import PostView from './views/PostView.tsx';
import LandingView from './views/LandingView';
import AuthorView from './components/AuthorView';
import LoginView from './views/LoginView.tsx';
import AmbientSoundscape from './components/AmbientSoundscape';
import DreamJournal from './components/DreamJournal';
import StarBackground from './StarBackground.tsx';
import MidnightLibrary from './services/MidnightLibrary';
import Logo from './components/Logo.tsx';

const CATEGORIES = ['All', 'Reflections', 'Lifestyle', 'Legal', 'Faith', 'Dreams'];
const MOODS = ['All Spirits', 'Quiet', 'Restless', 'Inspired', 'Melancholy'];

const DEFAULT_MANIFESTO: ManifestoItem[] = [
  { id: '1', title: "Deliberate Slowness", description: "In an age of instant gratification, we choose the long-form thought. We believe ideas need room to breathe and age like fine parchment.", icon: "🌤️" },
  { id: '2', title: "Atmospheric Clarity", description: "The environment dictates the output. We celebrate the desk lamp, the rain on the glass, and the profound focus of isolation.", icon: "🕯️" },
  { id: '3', title: "Honest Reflections", description: "No algorithms, no bait. Just whispers from one restless mind to another, shared in the safety of the quiet hours.", icon: "🖋️" }
];

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "readytowritehub",
  tagline: "The Quiet Space",
  accentColor: "#6366f1",
  logoUrl: "https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&q=80&w=200"
};

const DEFAULT_AUTHOR: AuthorProfile = {
  name: "Mosunmola",
  title: "Esq & Writer",
  bio: "An Esq by day, a writer by night, and the brain box behind the hub. I navigate the structured world of law and the fluid world of words to find where silence truly speaks.",
  imageUrl: "https://images.unsplash.com/photo-1544717297-fa95b3397118?auto=format&fit=crop&q=80&w=800",
  rituals: [
    { title: "The Morning Tea", desc: "Earl Grey, steeped exactly for four minutes as the world begins to wake.", icon: "☕" },
    { title: "The Soft Playlist", desc: "Lo-fi beats and field recordings of distant birds from early spring.", icon: "🍃" },
    { title: "The Ink Ritual", desc: "Testing three fountain pens before a single word is committed to screen.", icon: "🖋️" },
    { title: "The Sky Watch", desc: "Observing the morning clouds for ten minutes of meditation.", icon: "☁️" }
  ]
};

const App: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('rtwh_posts');
    return saved ? JSON.parse(saved) : (INITIAL_POSTS as BlogPost[]);
  });

  const [manifesto, setManifesto] = useState<ManifestoItem[]>(() => {
    const saved = localStorage.getItem('rtwh_manifesto');
    return saved ? JSON.parse(saved) : DEFAULT_MANIFESTO;
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('rtwh_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [authorProfile, setAuthorProfile] = useState<AuthorProfile>(() => {
    const saved = localStorage.getItem('rtwh_author_profile');
    return saved ? JSON.parse(saved) : DEFAULT_AUTHOR;
  });
  
  const [currentView, setView] = useState<View>('landing');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMood, setSelectedMood] = useState('All Spirits');
  const [activeDreamers, setActiveDreamers] = useState(8);
  const [notifications, setNotifications] = useState<{id: string, text: string}[]>([]);

  const addNotification = useCallback((text: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, text }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  useEffect(() => {
    localStorage.setItem('rtwh_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    const checkScheduled = () => {
      const now = new Date();
      setPosts(prev => {
        let hasChanged = false;
        const next = prev.map(p => {
          if (p.status === 'scheduled' && p.scheduledDate) {
            if (new Date(p.scheduledDate) <= now) {
              hasChanged = true;
              return { ...p, status: 'published' as const };
            }
          }
          return p;
        });
        if (hasChanged) addNotification("A scheduled thought has materialized in the feed.");
        return hasChanged ? next : prev;
      });
    };
    const interval = setInterval(checkScheduled, 60000);
    return () => clearInterval(interval);
  }, [addNotification]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDreamers(prev => Math.max(1, prev + (Math.random() > 0.5 ? 1 : -1)));
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    setView('post');
    window.scrollTo(0, 0);
  };

  const savePost = (post: BlogPost) => {
    setPosts(prev => {
      const index = prev.findIndex(p => p.id === post.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = post;
        return next;
      }
      return [post, ...prev];
    });
    addNotification(`"${post.title}" has been saved.`);
    setView('admin');
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    localStorage.removeItem(`rtwh_comments_${id}`);
    addNotification(`Post and its echoes removed.`);
  };

  const handleUpdatePostStats = (id: string, updates: Partial<BlogPost>) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      if (post.status !== 'published') return false;
      
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesMood = selectedMood === 'All Spirits' || post.mood === selectedMood;
      
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = (
        post.title.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower)
      );

      return matchesCategory && matchesMood && matchesSearch;
    });
  }, [posts, searchQuery, selectedCategory, selectedMood]);

  const featuredPost = useMemo(() => filteredPosts[0] || null, [filteredPosts]);
  const otherPosts = useMemo(() => filteredPosts.slice(1), [filteredPosts]);

  const handleSetView = (view: View) => {
    setView(view);
    window.scrollTo(0, 0);
  };

  return (
    <div className={`min-h-screen sleepy-gradient selection:bg-indigo-600/10 overflow-x-hidden relative text-slate-900`}>
      <StarBackground />
      
      <div className="relative z-10">
        <Navbar currentView={currentView} setView={handleSetView} logoUrl={siteSettings.logoUrl} siteName={siteSettings.siteName} tagline={siteSettings.tagline} />
        
        <AmbientSoundscape />
        <DreamJournal />

        <div className="fixed top-24 right-4 z-[100] space-y-3 pointer-events-none max-w-[calc(100vw-2rem)]">
          {notifications.map(n => (
            <div key={n.id} className="glass-card px-4 py-2 rounded-xl border border-indigo-600/10 text-indigo-600 text-[10px] font-bold animate-in slide-in-from-right-4 shadow-lg backdrop-blur-md">
              {n.text}
            </div>
          ))}
        </div>

        <main className="pt-24 md:pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
          {currentView === 'landing' && (
            <LandingView 
              manifesto={manifesto}
              onEnter={() => handleSetView('home')} 
              recentPosts={posts.filter(p => p.status === 'published')}
              onPostClick={handlePostClick}
              siteName={siteSettings.siteName}
              author={authorProfile}
            />
          )}

          {currentView === 'home' && (
            <div className="space-y-12 md:space-y-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <header className="text-center space-y-6 md:space-y-10 max-w-4xl mx-auto">
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 mb-2 md:mb-4">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                    <span className={`text-[9px] font-bold uppercase tracking-[0.3em] text-indigo-600/70`}>
                      {activeDreamers} Readers currently here
                    </span>
                  </div>
                  <h2 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tight leading-none text-slate-900">
                    The <span className="text-indigo-600">Morning</span> Hub
                  </h2>
                  <p className={`text-slate-500 text-lg md:text-xl serif italic max-w-xl mx-auto px-4`}>
                    A collection of quiet insights for the wandering mind.
                  </p>
                </div>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 pt-4 px-4">
                  <div className="relative w-full max-w-md group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600 text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input 
                      type="text"
                      placeholder="Search for a thought..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full border rounded-full py-3 md:py-4 pl-12 pr-12 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 transition-all glass-card text-slate-900 border-slate-200 shadow-sm`}
                    />
                  </div>

                  <div className="flex items-center gap-2 p-1 bg-white/40 border border-slate-200 rounded-full glass-card overflow-x-auto no-scrollbar max-w-full shadow-sm">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 md:px-6 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-indigo-600'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 pt-4 px-4">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Current Mood:</span>
                  <div className="flex flex-wrap justify-center gap-4">
                    {MOODS.map(mood => (
                      <button 
                        key={mood}
                        onClick={() => setSelectedMood(mood)}
                        className={`text-[9px] font-bold uppercase tracking-[0.1em] transition-all hover:text-indigo-600 relative py-1 ${selectedMood === mood ? 'text-indigo-600' : 'text-slate-400'}`}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>
              </header>

              {featuredPost && !searchQuery && (
                <section className="animate-in fade-in slide-in-from-bottom-8 relative z-10 px-4">
                  <div 
                    onClick={() => handlePostClick(featuredPost)}
                    className="group cursor-pointer glass-card rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-slate-100 relative flex flex-col lg:flex-row min-h-[400px] md:min-h-[500px] hover:border-indigo-600/20 transition-all duration-700 shadow-xl"
                  >
                    <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
                      <span className="bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-[0.3em] px-3 py-1 rounded-full shadow-lg">Featured</span>
                    </div>
                    <div className="w-full lg:w-3/5 overflow-hidden h-[200px] md:h-[350px] lg:h-auto bg-slate-100">
                      <img 
                        src={featuredPost.imageUrl} 
                        alt={featuredPost.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale-[0.2] group-hover:grayscale-0"
                      />
                    </div>
                    <div className="w-full lg:w-2/5 p-6 md:p-10 lg:p-16 flex flex-col justify-center space-y-4 text-center lg:text-left bg-white/80">
                      <div className="flex items-center justify-center lg:justify-start gap-4">
                        <span className="text-indigo-600 text-[10px] font-bold uppercase tracking-widest">{featuredPost.category}</span>
                        <span className="text-slate-300 text-xs">•</span>
                        <span className="text-slate-500 text-[10px] italic">{featuredPost.mood}</span>
                      </div>
                      <h3 className={`text-2xl md:text-4xl lg:text-5xl font-bold leading-tight group-hover:text-indigo-600 transition-colors text-slate-900`}>
                        {featuredPost.title}
                      </h3>
                      <p className={`text-sm md:text-lg serif italic leading-relaxed line-clamp-2 text-slate-600`}>
                        "{featuredPost.excerpt}"
                      </p>
                      <div className="flex items-center justify-center lg:justify-start gap-4 pt-4 border-t border-slate-100">
                        <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold bg-slate-50 border-slate-200 text-indigo-600`}>
                          {featuredPost.author[0]}
                        </div>
                        <div className="text-left">
                          <p className={`text-sm font-medium text-slate-900`}>{featuredPost.author}</p>
                          <p className="text-slate-400 text-[10px] uppercase">{featuredPost.date}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4">
                {otherPosts.map((post, idx) => (
                  <PostCard key={post.id} post={post} onClick={handlePostClick} />
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-slate-400 serif italic">The feed is still. No whispers found.</p>
                </div>
              )}

              <div className="py-6 px-4">
                <MidnightLibrary />
              </div>
            </div>
          )}

          {currentView === 'post' && selectedPost && (
            <PostView 
              post={selectedPost} 
              onBack={() => handleSetView('home')} 
              onUpdateStats={(updates) => handleUpdatePostStats(selectedPost.id, updates)}
            />
          )}

          {currentView === 'author' && <AuthorView author={authorProfile} />}

          {currentView === 'login' && (
            <LoginView 
              onLoginSuccess={() => handleSetView('admin')}
              onCancel={() => handleSetView('home')}
            />
          )}

          {currentView === 'admin' && (
            <AdminDashboard 
              posts={posts} 
              onSave={savePost} 
              onDelete={deletePost}
              manifesto={manifesto}
              onUpdateManifesto={setManifesto}
              siteSettings={siteSettings}
              onUpdateSettings={setSiteSettings}
              authorProfile={authorProfile}
              onUpdateAuthor={setAuthorProfile}
              onEdit={(post) => { setSelectedPost(post); handleSetView('edit'); }}
              onCreate={() => { setSelectedPost(null); handleSetView('edit'); }}
            />
          )}

          {currentView === 'edit' && (
            <AdminDashboard 
              isEditing 
              editingPost={selectedPost} 
              posts={posts} 
              onSave={savePost} 
              onDelete={deletePost}
              onCancel={() => handleSetView('admin')}
              authorProfile={authorProfile}
            />
          )}
        </main>

        <footer className="py-12 px-4 border-t border-slate-200 text-center bg-white/50 relative overflow-hidden">
          <div className="flex flex-col items-center gap-6 max-w-lg mx-auto">
            <div className="flex items-center gap-2 opacity-80">
               <Logo className="h-8 w-8" src={siteSettings.logoUrl} />
               <h4 className={`font-bold text-xs tracking-widest text-slate-900 uppercase`}>{siteSettings.siteName}</h4>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed serif italic px-4">
              "{siteSettings.tagline || 'We are such stuff as dreams are made on...'}"
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              <button onClick={() => handleSetView('landing')} className="hover:text-indigo-600 transition-colors">Origins</button>
              <button onClick={() => handleSetView('home')} className="hover:text-indigo-600 transition-colors">The Feed</button>
              <button onClick={() => handleSetView('author')} className="hover:text-indigo-600 transition-colors">The Scribe</button>
              <button onClick={() => handleSetView('login')} className="hover:text-indigo-600 transition-colors">Admin</button>
            </div>
            <p className="text-slate-400 text-[9px] uppercase tracking-tighter">© 2024 {siteSettings.siteName} — Thoughts penned with care.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
