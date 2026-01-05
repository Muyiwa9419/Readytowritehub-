import React, { useState, useEffect } from "react";
import { BlogPost, ManifestoItem } from "../types";
import PostCard from "../components/PostCard";
import { generateWritingPrompt } from "../services/geminiService";
import authorImage from "../assets/author1.JPG";

interface LandingViewProps {
  onEnter: () => void;
  recentPosts: BlogPost[];
  onPostClick: (post: BlogPost) => void;
  manifesto: ManifestoItem[];
  siteName: string;
}

const LandingView: React.FC<LandingViewProps> = ({
  onEnter,
  recentPosts,
  onPostClick,
  manifesto,
  siteName,
}) => {
  const [musePrompt, setMusePrompt] = useState("");
  const [loadingMuse, setLoadingMuse] = useState(false);

  const author = {
    name: "Barr. Mosunmola",
    title: "Advocate & Writer",
    bio: "I have spent my career balancing the rigid demands of law with the infinite freedom of storytelling",
    image: authorImage,
  };

  const fetchPrompt = async () => {
    setLoadingMuse(true);
    try {
      const prompt = await generateWritingPrompt();
      setMusePrompt(prompt);
    } catch {
      setMusePrompt("The stars are silent today.");
    } finally {
      setLoadingMuse(false);
    }
  };

  useEffect(() => {
    fetchPrompt();
  }, []);

  return (
    <div className="space-y-24 md:space-y-40 pb-20">
      {/* Hero Section */}
      <section className="min-h-[70vh] md:min-h-[85vh] flex flex-col items-center justify-center text-center space-y-8 md:space-y-10 animate-in fade-in zoom-in duration-1000 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-600/10 blur-[80px] md:blur-[120px] rounded-full -z-10" />

        <div className="space-y-4">
          <span className="block text-[10px] font-bold uppercase tracking-[0.5em] text-indigo-400/80 animate-pulse">
            Readytowritehub
          </span>

          <h2 className="text-5xl sm:text-7xl md:text-9xl font-bold text-white tracking-tighter leading-[0.9]">
            Ink. <br />
            Silence. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300 bg-[length:200%_auto] animate-gradient">
              Dreams.
            </span>
          </h2>
        </div>

        <p className="max-w-2xl text-slate-400 text-base md:text-xl serif italic leading-relaxed px-4">
          A slow-paced sanctuary where thoughts are penned in the hush of midnight
          and shared with the rising sun.{" "}
          <span className="uppercase font-bold tracking-widest text-indigo-300/80">
            {siteName}
          </span>{" "}
          is your digital pillow for the mind.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 pt-4 px-6">
          <button
            onClick={onEnter}
            className="px-8 md:px-12 py-4 md:py-5 bg-white text-slate-950 rounded-full font-bold text-base md:text-lg hover:bg-indigo-400 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-indigo-500/30 flex items-center gap-3"
          >
            Enter the Silence
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>

          <a
            href="#manifesto"
            className="text-slate-500 hover:text-indigo-300 transition-colors text-[10px] md:text-sm font-bold uppercase tracking-widest border-b border-white/5 pb-1"
          >
            The Manifesto
          </a>
        </div>

        {/* Midnight Muse */}
        <div className="pt-12 px-6 w-full max-w-sm">
          <div className="glass-card px-6 py-4 rounded-3xl border border-white/5 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-500 text-[8px] font-bold uppercase tracking-widest rounded-full">
              Midnight Muse
            </div>
            <p className="text-indigo-300/80 text-xs italic serif">
              {loadingMuse ? "Summoning inspiration..." : `"${musePrompt}"`}
            </p>
            <button
              onClick={fetchPrompt}
              className="mt-2 text-[9px] font-bold uppercase tracking-widest text-slate-600 hover:text-indigo-400"
            >
              Refresh Insight
            </button>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section id="manifesto" className="max-w-6xl mx-auto px-6 space-y-20">
        <div className="text-center space-y-4">
          <h3 className="text-3xl md:text-5xl font-bold text-white">
            The Midnight Manifesto
          </h3>
          <p className="text-slate-500 serif italic">
            Why we write when the world sleeps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {manifesto.map((item, i) => (
            <div
              key={item.id}
              style={{ animationDelay: `${i * 150}ms` }}
              className="glass-card p-10 rounded-[2.5rem] border border-white/5 animate-in fade-in slide-in-from-bottom-4"
            >
              <span className="text-4xl block mb-6">{item.icon}</span>
              <h4 className="text-xl font-bold text-white mb-4">{item.title}</h4>
              <p className="text-slate-400 text-sm serif">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Posts */}
      <section className="bg-white/[0.02] py-32 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                Preview
              </span>
              <h3 className="text-4xl font-bold text-white">Curated Whispers</h3>
            </div>
            <button
              onClick={onEnter}
              className="border border-white/10 px-8 py-3 rounded-full text-sm font-bold hover:bg-white hover:text-slate-950"
            >
              View Full Feed
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {recentPosts.slice(0, 3).map((post) => (
              <PostCard key={post.id} post={post} onClick={onPostClick} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center px-6"
      >
        {/* Image */}
        <div className="relative group order-2 md:order-1">
          <div className="absolute -inset-4 bg-indigo-500/20 rounded-[2rem] md:rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="aspect-[4/5] rounded-[2rem] md:rounded-[3rem] overflow-hidden glass-card relative border border-white/10">
            <img
              src="assets/author2.png"
              alt="author"
              className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
            />
          </div>

          <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 glass-card p-4 md:p-6 rounded-2xl border border-white/10 animate-float">
            <p className="text-white font-bold text-xs md:text-sm">
              "Words are the advocate's truest evidence."
            </p>
            <p className="text-[9px] md:text-[10px] text-indigo-400 mt-1 uppercase tracking-widest">
              — {author.name}
            </p>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-6 md:space-y-8 order-1 md:order-2 text-center md:text-left">
          <div className="space-y-3 md:space-y-4">
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-400">
              The Brain Box
            </span>

            <h3 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              {author.name}{" "}
              {/* {author.title?.split("&")?.[0]?.trim() || "Professional"}. */}
            </h3>
          </div>

          <div className="space-y-4 md:space-y-6 text-slate-400 serif text-base md:text-lg leading-relaxed">
            <p>
              {author.bio?.split(".")?.[0]}. 
            </p>

            <p>
              {siteName} is the convergence of those two worlds. It’s where I shed the
              legal robes to speak plainly and thoughtfully about the things that keep
              us awake, inspired, and human.
            </p>
          </div>

          <div className="flex justify-center md:justify-start gap-8 md:gap-10 pt-4 md:pt-6">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-white">Professional</p>
              <p className="text-[9px] uppercase tracking-widest text-slate-500">
                {author.title?.split("&")?.[0]?.trim() || "Expert"}
              </p>
            </div>

            <div>
              <p className="text-2xl md:text-3xl font-bold text-white">Creative</p>
              <p className="text-[9px] uppercase tracking-widest text-slate-500">
                {author.title?.split("&")?.[1]?.trim() || "Visionary"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="max-w-4xl mx-auto px-6">
        <div className="glass-card p-8 md:p-20 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/10 relative overflow-hidden text-center space-y-6 md:space-y-8">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

          <div className="space-y-3 md:space-y-4">
            <h3 className="text-3xl md:text-4xl font-bold text-white">
              Join the Midnight Mailing
            </h3>
            <p className="text-slate-400 text-sm md:text-base serif italic max-w-md mx-auto">
              Receive a single, thoughtful letter every Sunday evening, just as the
              sun begins its descent.
            </p>
          </div>

          <form
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Your email address..."
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white text-sm"
            />
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 md:py-4 rounded-full font-bold transition-all whitespace-nowrap shadow-xl shadow-indigo-500/20 text-sm">
              Subscribe
            </button>
          </form>

          <p className="text-[9px] text-slate-600 uppercase tracking-widest">
            No noise. No clutter. Just words.
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingView;
