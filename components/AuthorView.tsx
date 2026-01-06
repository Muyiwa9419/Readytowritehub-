
import React, { useState } from 'react';
import { AuthorProfile } from '../types.ts';

interface AuthorViewProps {
  author: AuthorProfile;
}

const AuthorView: React.FC<AuthorViewProps> = ({ author }) => {
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
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-20 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20 px-4">
      {/* Hero */}
      <section className="flex flex-col lg:flex-row gap-12 items-center text-center lg:text-left">
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="aspect-[3/4] w-full max-w-[320px] rounded-[3rem] overflow-hidden border border-slate-200 bg-white p-2 shadow-2xl relative">
            <img 
              src={author.imageUrl} 
              alt={author.name} 
              className="w-full h-full object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-1000 rounded-[2.8rem]"
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2 space-y-6">
          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-indigo-600">The Scribe</span>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">I am <span className="text-indigo-600">{author.name}.</span></h2>
          </div>
          <p className="text-slate-600 text-lg md:text-xl serif italic leading-relaxed">
            "{author.bio}"
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{author.title}</p>
        </div>
      </section>

      {/* Rituals */}
      <section className="glass-card p-8 md:p-16 rounded-[3rem] border border-slate-100 bg-white/90 shadow-xl">
        <h3 className="text-2xl font-bold text-slate-900 mb-12 text-center md:text-left border-b border-slate-50 pb-6 uppercase tracking-widest text-sm">Rituals</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {author.rituals.map((r, i) => (
            <div key={i} className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left group">
              <span className="text-4xl">{r.icon}</span>
              <div className="space-y-2">
                <h4 className="text-slate-900 font-bold text-sm tracking-wide">{r.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed italic">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-2xl mx-auto space-y-12 text-center">
        <div className="space-y-4">
          <h3 className="text-3xl font-bold text-slate-900">Send a Whisper</h3>
          <p className="text-slate-500 serif italic">Need to talk in the quiet?</p>
          <p className="text-indigo-600 font-bold text-sm">info@readytowritehub.com</p>
        </div>

        {sent ? (
          <div className="p-12 glass-card rounded-[2.5rem] border border-indigo-100 bg-white shadow-xl">
            <h4 className="text-slate-900 font-bold text-xl mb-4">Whisper Received</h4>
            <p className="text-slate-500 text-sm mb-6">I'll reply as soon as the thoughts settle.</p>
            <button onClick={() => setSent(false)} className="text-[10px] font-bold text-indigo-600 uppercase underline">Send another</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 glass-card p-8 md:p-12 rounded-[2.5rem] border border-slate-100 bg-white/80 shadow-2xl">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Wanderer..." className="w-full p-4 rounded-2xl" />
            </div>
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Message</label>
              <textarea required rows={4} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Spill gently..." className="w-full p-4 rounded-2xl serif italic" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white p-5 rounded-full font-bold shadow-xl hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs">
              {loading ? 'Routing...' : 'Release Whisper'}
            </button>
          </form>
        )}
      </section>
    </div>
  );
};

export default AuthorView;
