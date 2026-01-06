
import React, { useState, useEffect } from 'react';
import { BlogPost, ManifestoItem, AuthorProfile } from '../types.ts';
import PostCard from '../utils/PostCard.tsx';
import { generateWritingPrompt } from './services/geminiService.ts';

interface LandingViewProps {
  onEnter: () => void;
  recentPosts: BlogPost[];
  onPostClick: (post: BlogPost) => void;
  manifesto: ManifestoItem[];
  siteName: string;
  author: AuthorProfile;
}

const LandingView: React.FC<LandingViewProps> = ({ onEnter, recentPosts, onPostClick, manifesto, siteName, author }) => {
  const [musePrompt, setMusePrompt] = useState<string>('');
  const [loadingMuse, setLoadingMuse] = useState(false);

  const fetchPrompt = async () => {
    setLoadingMuse(true);
    try {
      const prompt = await generateWritingPrompt();
      setMusePrompt(prompt);
    } catch (e) {
      setMusePrompt("The sky is clear and silent today.");
    } finally {
      setLoadingMuse(false);
    }
  };

  useEffect(() => {
    fetchPrompt();
  }, []);

  return (
    <div className="space-y-24 md:space-y-48 pb-20">
      {/* Hero Section */}
      <section className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-10 animate-in fade-in zoom-in duration-1000 relative px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] md:w-[600px] h-[280px] md:h-[600px] bg-indigo-600/5 blur-[100px] rounded-full -z-10" />
        
        <div className="space-y-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-indigo-600/60 animate-pulse">
            A New Horizon of Thought
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-9xl font-bold text-slate-900 tracking-tighter leading-[0.9]">
            Pen. <br />
            Pause. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400 bg-[length:200%_auto] animate-gradient">Breathe.</span>
          </h2>
        </div>

        <p className="max-w-2xl text-slate-500 text-base md:text-2xl serif italic leading-relaxed">
          Welcome to <span className="uppercase font-bold tracking-widest text-indigo-600">{siteName}</span>. A minimalist sanctuary for slow thoughts and long mornings.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 w-full sm:w-auto">
          <button 
            onClick={onEnter}
            className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-4 group"
          >
            Explore Feed
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

        {/* Morning Muse Widget */}
        <div className="pt-10 animate-in fade-in duration-1000 delay-500 w-full max-w-sm">
           <div className="glass-card px-6 py-5 rounded-[2rem] border border-slate-100 relative group bg-white/60 shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                Morning Muse
              </div>
              <p className="text-slate-700 text-sm italic serif leading-relaxed text-center">
                {loadingMuse ? "Summoning inspiration..." : `"${musePrompt}"`}
              </p>
           </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section id="manifesto" className="max-w-6xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-4">
          <h3 className="text-3xl md:text-6xl font-bold text-slate-900 tracking-tight">The Quiet Manifesto</h3>
          <p className="text-slate-500 serif italic text-lg">Slow down. Think. Then write.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {manifesto.map((item, i) => (
            <div key={item.id} className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-slate-100 text-center animate-in fade-in slide-in-from-bottom-4 bg-white/90 shadow-lg" style={{ animationDelay: `${i * 150}ms` }}>
              <span className="text-4xl md:text-5xl mb-6 block">{item.icon}</span>
              <h4 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h4>
              <p className="text-slate-600 text-sm leading-relaxed serif italic">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center px-6">
        <div className="relative group order-2 md:order-1 flex justify-center">
          <div className="aspect-[4/5] w-full max-w-[320px] md:max-w-none rounded-[2.5rem] overflow-hidden glass-card border border-slate-200 shadow-xl bg-white p-2">
            <img 
              src={author.imageUrl} 
              alt={author.name} 
              className="w-full h-full object-cover rounded-[2.2rem] grayscale-[0.3] hover:grayscale-0 transition-all duration-1000"
            />
          </div>
        </div>
        <div className="space-y-8 text-center md:text-left order-1 md:order-2">
          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-indigo-600">The Lead Scribe</span>
            <h3 className="text-4xl md:text-7xl font-bold text-slate-900 tracking-tighter">{author.name}.</h3>
          </div>
          <div className="space-y-6 text-slate-600 serif text-lg md:text-2xl leading-relaxed italic">
            <p>
              I bridge the gap between structured Law and the untamed nature of human emotion.
            </p>
          </div>
          <div className="flex justify-center md:justify-start gap-12 pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-900">Law</p>
              <p className="text-[10px] uppercase font-bold text-slate-400">Professional</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-900">Ink</p>
              <p className="text-[10px] uppercase font-bold text-slate-400">Creative</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingView;
