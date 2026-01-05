
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BlogPost, View, ManifestoItem, SiteSettings } from './types.ts';
import { INITIAL_POSTS } from './constants.ts';
import Navbar from './components/Navbar.tsx';
import PostCard from './components/PostCard.tsx';
import AdminDashboard from './views/AdminDashboard.tsx';
import PostView from './views/PostView.tsx';
import LandingView from './views/LandingView.tsx';
import AuthorView from './views/AuthorView.tsx';
import LoginView from './views/LoginView.tsx';
import AmbientSoundscape from './components/AmbientSoundscape.tsx';
import DreamJournal from './components/DreamJournal.tsx';
import StarBackground from './components/StarBackground.tsx';
import MidnightLibrary from './components/MidnightLibrary.tsx';
// Fix: Import Logo component which was missing and causing a reference error
import Logo from './components/Logo.tsx';

const CATEGORIES = ['All', 'Reflections', 'Lifestyle', 'Legal', 'Faith', 'Dreams'];
const MOODS = ['All Spirits', 'Quiet', 'Restless', 'Inspired', 'Melancholy'];

const DEFAULT_MANIFESTO: ManifestoItem[] = [
  { id: '1', title: "Deliberate Slowness", description: "In an age of instant gratification, we choose the long-form thought. We believe ideas need room to breathe and age like fine parchment.", icon: "🌙" },
  { id: '2', title: "Atmospheric Clarity", description: "The environment dictates the output. We celebrate the desk lamp, the rain on the glass, and the profound focus of isolation.", icon: "🕯️" },
  { id: '3', title: "Honest Reflections", description: "No algorithms, no bait. Just whispers from one restless mind to another, shared in the safety of the quiet hours.", icon: "🖋️" }
];

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "readytowritehub",
  tagline: "The Quiet Space",
  accentColor: "#818cf8",
  logoUrl: "https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&q=80&w=200"
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
  
  const [currentView, setView] = useState<View>('landing');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMood, setSelectedMood] = useState('All Spirits');
  const [activeDreamers, setActiveDreamers] = useState(12);
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
    localStorage.setItem('rtwh_manifesto', JSON.stringify(manifesto));
  }, [manifesto]);

  useEffect(() => {
    localStorage.setItem('rtwh_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    const checkScheduledPosts = () => {
      setPosts(prevPosts => {
        const now = new Date();
        let changed = false;
        const nextPosts = prevPosts.map(post => {
          if (post.status === 'scheduled' && post.scheduledDate) {
            const scheduledTime = new Date(post.scheduledDate);
            if (scheduledTime <= now) {
              changed = true;
              return { ...post, status: 'published' as const };
            }
          }
          return post;
        });

        if (changed) {
          addNotification("A scheduled thought has successfully materialized in the hub.");
          return nextPosts;
        }
        return prevPosts;
      });
    };

    const interval = setInterval(checkScheduledPosts, 10000);
    checkScheduledPosts(); 
    return () => clearInterval(interval);
  }, [addNotification]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDreamers(prev => Math.max(1, prev + (Math.random() > 0.5 ? 1 : -1)));
    }, 10000);
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
      let nextPosts;
      if (index >= 0) {
        nextPosts = [...prev];
        nextPosts[index] = post;
      } else {
        nextPosts = [post, ...prev];
      }
      return nextPosts;
    });
    
    const actionText = post.status === 'scheduled' 
      ? `scheduled for future arrival` 
      : 'whispered into existence';
    addNotification(`"${post.title}" has been ${actionText}.`);
    setView('admin');
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    addNotification(`A thought was released back to the void.`);
  };

  const handleUpdatePostStats = (id: string, updates: Partial<BlogPost>) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    if (selectedPost && selectedPost.id === id) {
      setSelectedPost(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const isPublished = post.status === 'published';
      if (!isPublished) return false;
      
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesMood = selectedMood === 'All Spirits' || post.mood === selectedMood;
      
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = (
        post.title.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.category.toLowerCase().includes(searchLower)
      );

      return matchesCategory && matchesMood && matchesSearch;
    });
  }, [posts, searchQuery, selectedCategory, selectedMood]);

  const featuredPost = useMemo(() => {
    return filteredPosts.length > 0 ? filteredPosts[0] : null;
  }, [filteredPosts]);

  const otherPosts = useMemo(() => {
    return filteredPosts.slice(1);
  }, [filteredPosts]);

  const handleSetView = (view: View) => {
    setView(view);
    window.scrollTo(0, 0);
  };

  return (
    <div className={`min-h-screen sleepy-gradient selection:bg-indigo-500/30 overflow-x-hidden relative text-slate-200`}>
      <StarBackground />
      
      <div className="relative z-10">
        <Navbar currentView={currentView} setView={handleSetView} logoUrl={siteSettings.logoUrl} siteName={siteSettings.siteName} tagline={siteSettings.tagline} />
        
        <AmbientSoundscape />
        <DreamJournal />

        <div className="fixed top-24 right-4 md:right-6 z-[100] space-y-3 pointer-events-none max-w-[calc(100vw-2rem)]">
          {notifications.map(n => (
            <div key={n.id} className="glass-card px-4 md:px-6 py-3 rounded-2xl border border-indigo-500/30 text-indigo-400 text-[10px] md:text-xs font-bold animate-in slide-in-from-right-4 shadow-2xl backdrop-blur-md">
              <span className="mr-2">✨</span> {n.text}
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
            />
          )}

          {currentView === 'home' && (
            <div className="space-y-12 md:space-y-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <header className="text-center space-y-6 md:space-y-10 max-w-4xl mx-auto">
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 mb-2 md:mb-4">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-indigo-400`}>
                      {activeDreamers} Dreamers currently online
                    </span>
                  </div>
                  <h2 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tight leading-none">
                    The <span className="text-indigo-500">Midnight</span> Journal
                  </h2>
                  <p className={`text-slate-400 text-lg md:text-xl serif italic max-w-xl mx-auto`}>
                    A collection of quiet insights for the restless mind.
                  </p>
                </div>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 pt-4">
                  <div className="relative w-full max-w-md group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-400 text-slate-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input 
                      type="text"
                      placeholder="Search for a whisper..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full border rounded-full py-3 md:py-4 pl-12 pr-12 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all glass-card text-white border-white/10`}
                    />
                  </div>

                  <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-full glass-card overflow-x-auto no-scrollbar max-w-full">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 md:px-6 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-indigo-400'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 md:gap-8 pt-4">
                  <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 hidden sm:inline">Spirit Mood:</span>
                  <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                    {MOODS.map(mood => (
                      <button 
                        key={mood}
                        onClick={() => setSelectedMood(mood)}
                        className={`text-[9px] md:text-[10px] font-bold uppercase tracking-[0.1em] transition-all hover:text-indigo-400 relative py-1 ${selectedMood === mood ? 'text-indigo-500' : 'text-slate-500'}`}
                      >
                        {mood}
                        {selectedMood === mood && (
                          <div className="absolute -bottom-1 left-0 right-0 h-px bg-indigo-500/40 animate-in fade-in duration-300" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </header>

              {featuredPost && !searchQuery && selectedCategory === 'All' && (
                <section className="animate-in fade-in slide-in-from-bottom-8 relative z-10">
                  <div 
                    onClick={() => handlePostClick(featuredPost)}
                    className="group cursor-pointer glass-card rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/5 relative flex flex-col lg:flex-row min-h-[400px] md:min-h-[500px] hover:border-indigo-500/30 transition-all duration-700"
                  >
                    <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
                      <span className="bg-indigo-500 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] px-3 md:px-4 py-1 md:py-2 rounded-full shadow-2xl">Featured Story</span>
                    </div>
                    <div className="w-full lg:w-3/5 overflow-hidden h-[250px] md:h-[350px] lg:h-auto">
                      <img 
                        src={featuredPost.imageUrl} 
                        alt={featuredPost.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-70 group-hover:opacity-100"
                      />
                    </div>
                    <div className="w-full lg:w-2/5 p-6 md:p-10 lg:p-16 flex flex-col justify-center space-y-4 md:space-y-6">
                      <div className="flex items-center gap-4">
                        <span className="text-indigo-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">{featuredPost.category}</span>
                        <span className="text-slate-400 text-xs">•</span>
                        <span className="text-indigo-400/60 text-[10px] md:text-xs italic">{featuredPost.mood}</span>
                      </div>
                      <h3 className={`text-2xl md:text-4xl lg:text-5xl font-bold leading-tight group-hover:text-indigo-500 transition-colors text-white`}>
                        {featuredPost.title}
                      </h3>
                      <p className={`text-sm md:text-lg serif italic leading-relaxed line-clamp-3 text-slate-400`}>
                        "{featuredPost.excerpt}"
                      </p>
                      <div className="flex items-center gap-4 pt-4 md:pt-6 border-t border-white/5">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center font-bold bg-slate-800 border-white/10 text-indigo-300`}>
                          {featuredPost.author[0]}
                        </div>
                        <div>
                          <p className={`text-sm md:text-base font-medium text-white`}>{featuredPost.author}</p>
                          <p className="text-slate-500 text-[10px] uppercase tracking-tighter">{featuredPost.date}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 relative z-10">
                {(featuredPost && !searchQuery && selectedCategory === 'All' ? otherPosts : filteredPosts).map((post, idx) => (
                  <div key={post.id} className="animate-in fade-in slide-in-from-bottom-8" style={{ animationDelay: `${idx * 100}ms` }}>
                    <PostCard post={post} onClick={handlePostClick} />
                  </div>
                ))}
              </div>

              {selectedCategory === 'All' && !searchQuery && (
                <div className="py-6 md:py-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                  <MidnightLibrary />
                </div>
              )}
              
              {filteredPosts.length === 0 && (
                <div className="text-center py-20 md:py-40 animate-in fade-in duration-700">
                  <span className="text-3xl md:text-4xl block mb-4 md:mb-6 opacity-30">🌫️</span>
                  <h4 className={`text-lg md:text-xl font-bold text-white`}>The mist has swallowed everything.</h4>
                  <p className="text-slate-500 text-sm md:text-base italic serif mt-2">Try searching for a different spirit or category.</p>
                  <button 
                    onClick={() => { setSelectedMood('All Spirits'); setSelectedCategory('All'); setSearchQuery(''); }}
                    className="mt-6 md:mt-8 text-indigo-500 text-[10px] md:text-xs font-bold uppercase tracking-widest border-b border-indigo-500/20 pb-1"
                  >
                    Reset The Hub
                  </button>
                </div>
              )}
            </div>
          )}

          {currentView === 'post' && selectedPost && (
            <PostView 
              post={selectedPost} 
              onBack={() => handleSetView('home')} 
              onUpdateStats={(updates) => handleUpdatePostStats(selectedPost.id, updates)}
              onNewComment={(text) => addNotification(`Someone shared a new whisper.`)}
            />
          )}

          {currentView === 'author' && <AuthorView />}

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
              onUpdateManifesto={(m) => {
                setManifesto(m);
                addNotification("The Midnight Manifesto has been updated.");
              }}
              siteSettings={siteSettings}
              onUpdateSettings={(s) => {
                setSiteSettings(s);
                addNotification("Branding updated.");
              }}
              onEdit={(post) => {
                setSelectedPost(post);
                handleSetView('edit');
              }}
              onCreate={() => {
                setSelectedPost(null);
                handleSetView('edit');
              }}
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
            />
          )}
        </main>

        <footer className={`py-12 md:py-20 px-4 md:px-6 border-t border-white/5 text-center mt-12 md:mt-20 relative overflow-hidden`}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent" />
          <div className="flex flex-col items-center gap-6 md:gap-8 max-w-lg mx-auto">
            <div className="flex items-center gap-2 grayscale opacity-40">
            <Logo className="h-15 w-20 group-hover:rotate-12 transition-transform duration-500" />
               <h4 className={`font-bold text-xs md:text-sm tracking-widest text-white uppercase`}>{siteSettings.siteName}</h4>
            </div>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed serif italic">
              "{siteSettings.tagline || 'We are such stuff as dreams are made on...'}"
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-slate-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
              <button onClick={() => handleSetView('landing')} className="hover:text-indigo-500 transition-colors">Origins</button>
              <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); handleSetView('home'); }} className="hover:text-indigo-500 transition-colors">The Hub</button>
              <button onClick={() => handleSetView('author')} className="hover:text-indigo-500 transition-colors">The Scribe</button>
              <button 
                onClick={() => handleSetView('login')}
                className="hover:text-indigo-500 transition-colors flex items-center gap-2"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                Scribe Portal
              </button>
            </div>
            <div className="pt-4">
              <p className="text-slate-400 text-[8px] md:text-[9px] uppercase tracking-tighter">© 2026 {siteSettings.siteName} — all rights reserved in the silence.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
