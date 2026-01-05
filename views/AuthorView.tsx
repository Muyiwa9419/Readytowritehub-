
import React, { useState } from 'react';
import authorImg from "../assets/author1.jpg";

const AuthorView: React.FC = () => {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setFormData({ name: '', message: '' });
    }, 1800);
  };

  const rituals = [
    { title: "The Midnight Tea", desc: "Earl Grey, steeped exactly for four minutes as the clock strikes twelve.", icon: "☕" },
    { title: "The Rain Playlist", desc: "Lo-fi beats and field recordings of thunderstorms from 1994.", icon: "🌧️" },
    { title: "The Ink Ritual", desc: "Testing three fountain pens before a single word is committed to screen.", icon: "🖋️" },
    { title: "The Window Watch", desc: "Observing the streetlights flicker for ten minutes of meditation.", icon: "🏙️" }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-20 md:space-y-32 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row gap-12 md:gap-16 items-center">
        <div className="w-full lg:w-1/2 relative group">
          <div className="absolute -inset-4 bg-indigo-500/10 rounded-[2rem] md:rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="aspect-[3/4] rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/10 glass-card relative z-10">
            <img 
              src={authorImg} 
              alt="Mosunmola" 
              className="w-full h-full object-cover grayscale opacity-40 hover:opacity-60 hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-4 -left-4 glass-card p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/10 z-20 animate-float">
            <p className="text-[9px] md:text-xs font-bold text-indigo-400 uppercase tracking-widest text-center">Barr. Mosunmola</p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 space-y-6 md:space-y-8 text-center lg:text-left">
          <div className="space-y-3 md:space-y-4">
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] md:tracking-[0.5em] text-indigo-500/80">The Scribe & Advocate</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">I am <span className="text-indigo-400">Barr. Mosunmola.</span></h2>
          </div>

          <p className="text-slate-400 text-base md:text-lg serif italic leading-relaxed">
            "An Esq by day, a writer by night, and the brain box behind 
            <span className="text-indigo-300"> Evolving Mosun</span>. 
            We navigate the structured world of law and the fluid world of words 
            to find where silence truly speaks."
          </p>

          <div className="pt-2 flex justify-center lg:justify-start gap-4">
             <div className="h-px w-8 md:w-12 bg-indigo-500/30 self-center" />
             <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Writer • Esq • Speaker</p>
          </div>
        </div>
      </section>

      {/* The Journey */}
      <section className="space-y-8 md:space-y-12">
        <div className="max-w-2xl mx-auto text-center space-y-3 md:space-y-4">
          <h3 className="text-2xl md:text-3xl font-bold text-white">The Advocate's Alibi</h3>
          <p className="text-slate-500 serif text-[10px] md:text-sm">Where legal precision meets poetic soul.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 text-slate-400 serif leading-relaxed text-sm md:text-base italic text-center md:text-left">
          <p>
            Law teaches you that every word matters. Writing teaches you that some words are felt rather than defined. Through <span className="text-white">Spokenwith Mosunmola</span>, I explored the power of the voice. Here, at ReadyToWriteHub, I explore the weight of the written word.
          </p>
          <p>
            This hub is my sanctuary—a place for those who seek depth over noise. As the brain box behind these platforms, I curate stillness for the restless, crafting narratives that bridge the gap between our daily duties and our midnight dreams.
          </p>
        </div>
      </section>

      {/* Rituals */}
      <section className="glass-card p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-indigo-500/5 blur-[80px] md:blur-[100px] -z-10" />
        <h3 className="text-xl md:text-2xl font-bold text-white mb-8 md:mb-12 text-center lg:text-left flex items-center gap-4">
          Rituals
          <div className="h-px flex-1 bg-white/5" />
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
          {rituals.map((r, i) => (
            <div key={i} className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center sm:items-start text-center sm:text-left group">
              <span className="text-3xl md:text-4xl grayscale group-hover:grayscale-0 transition-all duration-500">{r.icon}</span>
              <div className="space-y-1 md:space-y-2">
                <h4 className="text-white font-bold text-xs md:text-sm tracking-wide">{r.title}</h4>
                <p className="text-slate-500 text-[10px] md:text-xs leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="max-w-2xl mx-auto space-y-10 md:space-y-12 text-center px-4">
        <div className="space-y-3 md:space-y-4">
          <h3 className="text-2xl md:text-3xl font-bold text-white">Send a Whisper</h3>
          <p className="text-slate-500 text-sm md:text-base serif italic">Need to talk in the quiet?</p>
          <span className="text-indigo-400 font-bold border-b border-indigo-500/20 text-xs md:text-base break-all">info@readytowritehub.com</span>
        </div>

        {sent ? (
          <div className="p-8 md:p-12 glass-card rounded-3xl border border-indigo-500/20 animate-in zoom-in-95 duration-500">
            <p className="text-indigo-400 text-2xl md:text-3xl mb-4">✨</p>
            <h4 className="text-white font-bold text-lg md:text-xl mb-2">Message Dispatched</h4>
            <p className="text-slate-500 text-xs md:text-sm mb-6">I'll reply when the moon is in the right phase.</p>
            <button onClick={() => setSent(false)} className="text-[10px] font-bold text-slate-400 hover:text-white underline underline-offset-8 decoration-indigo-500/20">Send another</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-left glass-card p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 relative">
            <div className="space-y-2">
              <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-2">Your Name</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="A fellow wanderer..."
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-white text-sm placeholder-slate-700 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-2">Your Whisper</label>
              <textarea 
                required
                rows={4}
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                placeholder="What's on your mind?"
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-white text-sm placeholder-slate-700 transition-all serif"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 md:py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 text-sm"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Routing...
                </>
              ) : 'Release into the Light'}
            </button>
          </form>
        )}
      </section>
    </div>
  );
};

export default AuthorView;
