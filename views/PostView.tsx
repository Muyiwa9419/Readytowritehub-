
import React, { useState, useEffect, useRef } from 'react';
import { BlogPost, Comment } from '../types';
import { generateAudioReading } from '../services/geminiService.ts';

interface PostViewProps {
  post: BlogPost;
  onBack: () => void;
  onUpdateStats: (updates: Partial<BlogPost>) => void;
  onNewComment?: (text: string) => void;
}

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const PostView: React.FC<PostViewProps> = ({ post, onBack, onUpdateStats, onNewComment }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ author: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const [isReading, setIsReading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const [userRating, setUserRating] = useState<number | null>(() => {
    const saved = localStorage.getItem(`rtwh_user_rating_${post.id}`);
    return saved ? parseInt(saved) : null;
  });
  const [userLiked, setUserLiked] = useState<'like' | 'dislike' | null>(() => {
    return localStorage.getItem(`rtwh_user_vote_${post.id}`) as 'like' | 'dislike' | null;
  });

  const shareUrl = window.location.href;

  useEffect(() => {
    const savedComments = localStorage.getItem(`rtwh_comments_${post.id}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
    return () => stopReading();
  }, [post.id]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const progress = (window.scrollY / scrollHeight) * 100;
        setReadingProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleReading = async () => {
    if (isReading) {
      stopReading();
      return;
    }

    setAudioLoading(true);
    try {
      const audioData = await generateAudioReading(post.content);
      if (audioData) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        
        const decodedBytes = decodeBase64(audioData);
        const audioBuffer = await decodeAudioData(decodedBytes, audioContextRef.current, 24000, 1);
        
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => setIsReading(false);
        
        sourceNodeRef.current = source;
        source.start(0);
        setIsReading(true);
      }
    } catch (e) {
      console.error("Audio generation failed", e);
    } finally {
      setAudioLoading(false);
    }
  };

  const stopReading = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }
    setIsReading(false);
  };

  const handleLike = () => {
    let newLikes = post.likes || 0;
    let newDislikes = post.dislikes || 0;
    if (userLiked === 'like') {
      newLikes = Math.max(0, newLikes - 1);
      setUserLiked(null);
      localStorage.removeItem(`rtwh_user_vote_${post.id}`);
    } else {
      if (userLiked === 'dislike') newDislikes = Math.max(0, newDislikes - 1);
      newLikes += 1;
      setUserLiked('like');
      localStorage.setItem(`rtwh_user_vote_${post.id}`, 'like');
    }
    onUpdateStats({ likes: newLikes, dislikes: newDislikes });
  };

  const handleRate = (rating: number) => {
    if (userRating === rating) return;
    let sum = post.ratingSum || 0;
    let count = post.ratingCount || 0;
    if (userRating !== null) sum = sum - userRating + rating;
    else { sum += rating; count += 1; }
    setUserRating(rating);
    localStorage.setItem(`rtwh_user_rating_${post.id}`, rating.toString());
    onUpdateStats({ ratingSum: sum, ratingCount: count });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.text.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const comment: Comment = {
        id: Date.now().toString(),
        postId: post.id,
        author: newComment.author.trim() || 'Anonymous Dreamer',
        text: newComment.text.trim(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      };
      const updatedComments = [comment, ...comments];
      setComments(updatedComments);
      localStorage.setItem(`rtwh_comments_${post.id}`, JSON.stringify(updatedComments));
      if (onNewComment) onNewComment(`Whisper shared.`);
      setNewComment({ author: '', text: '' });
      setIsSubmitting(false);
    }, 1200);
  };

  const avgRating = post.ratingCount && post.ratingSum ? (post.ratingSum / post.ratingCount).toFixed(1) : "0";

  return (
    <article className="max-w-3xl mx-auto animate-in fade-in duration-700">
      <div className="fixed top-0 left-0 w-full h-1 z-[60] pointer-events-none">
        <div className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-150 ease-out" style={{ width: `${readingProgress}%` }} />
      </div>

      <button onClick={() => { stopReading(); onBack(); }} className="mb-6 md:mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Back to Silence
      </button>

      <div className="rounded-2xl md:rounded-3xl overflow-hidden mb-8 md:mb-12 shadow-2xl shadow-black/50 aspect-video relative group">
        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        
        {/* Audio Narration Trigger */}
        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 flex items-center gap-4">
          <button 
            onClick={toggleReading}
            disabled={audioLoading}
            className={`flex items-center gap-3 px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all ${isReading ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-white/10 backdrop-blur-md text-white border border-white/10 hover:bg-white/20'}`}
          >
            {audioLoading ? (
               <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : isReading ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
            {audioLoading ? 'Summoning...' : isReading ? 'Stop' : 'Listen'}
          </button>
        </div>
      </div>

      <header className="mb-8 md:mb-12">
        <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4 md:mb-6">
          <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest border border-indigo-500/20">{post.category}</span>
          <span className="text-slate-500 text-xs">•</span>
          <span className="text-slate-500 text-[10px] md:text-xs italic">{post.readingTime} read</span>
          <span className="text-slate-500 text-[10px] md:text-xs ml-auto flex items-center gap-1">
            <svg className="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            {avgRating} ({post.ratingCount || 0})
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">{post.title}</h1>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-lg">{post.author[0]}</div>
            <div>
              <p className="text-white font-medium text-sm md:text-base">{post.author}</p>
              <p className="text-slate-500 text-[10px] md:text-xs">{post.date}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
             <button onClick={copyToClipboard} className={`flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 transition-all text-[10px] md:text-xs font-bold group ${copySuccess ? 'text-green-400 border-green-500/30' : 'text-slate-400 hover:text-white'}`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
              {copySuccess ? 'Copied!' : 'Share'}
            </button>
          </div>
        </div>
      </header>

      <div className="prose prose-invert prose-base md:prose-lg max-w-none text-slate-300 serif leading-relaxed space-y-6">
        {post.content.split('\n').map((para, i) => para ? <p key={i}>{para}</p> : <br key={i} />)}
      </div>

      <div className="mt-12 md:mt-20 p-6 md:p-8 glass-card rounded-2xl md:rounded-3xl border border-white/5 space-y-8 animate-in slide-in-from-bottom-4 duration-1000">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <h4 className="text-white font-bold text-base md:text-lg">How did this feel?</h4>
            <div className="flex items-center gap-1 md:gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => handleRate(star)} className={`p-1 transition-all duration-300 transform hover:scale-125 ${userRating !== null && star <= userRating ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'text-slate-600 hover:text-slate-400'}`}>
                  <svg className="w-6 h-6 md:w-8 md:h-8 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={handleLike} className={`flex flex-col items-center gap-2 group transition-all ${userLiked === 'like' ? 'text-indigo-400' : 'text-slate-500'}`}>
              <div className={`p-3 md:p-4 rounded-full border border-white/5 transition-all group-hover:scale-110 ${userLiked === 'like' ? 'bg-indigo-500/10 border-indigo-500/40' : 'hover:bg-white/5'}`}>
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.38c.02-.11.03-.23.03-.35c0-.42-.17-.8-.45-1.07L13.96 2L8.59 7.37C8.23 7.73 8 8.24 8 8.8V18c0 1.1.9 2 2 2h6.91c.73 0 1.38-.4 1.72-1.02l3.2-7.4c.1-.25.17-.52.17-.8l-.17.1z"/></svg>
              </div>
              <span className="text-[10px] md:text-xs font-bold">{post.likes || 0}</span>
            </button>
          </div>
        </div>
      </div>

      <section className="mt-12 space-y-8 md:space-y-12">
        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-indigo-400 text-2xl md:text-3xl">“</span>
            Leave a whisper
          </h2>
          <form onSubmit={handleCommentSubmit} className="space-y-4 glass-card p-6 rounded-2xl md:rounded-3xl border border-white/5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-500">Your Name</label>
                <input type="text" value={newComment.author} onChange={e => setNewComment({ ...newComment, author: e.target.value })} placeholder="Anonymous" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 text-white text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-500">Your Thought</label>
              <textarea value={newComment.text} onChange={e => setNewComment({ ...newComment, text: e.target.value })} placeholder="Spill your soul gently..." rows={4} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 text-white text-sm serif italic" />
            </div>
            <div className="flex justify-end items-center">
              <button type="submit" disabled={isSubmitting || !newComment.text.trim()} className="px-6 py-2 bg-indigo-500 text-white rounded-full text-xs font-bold hover:bg-indigo-600 transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-indigo-500/20">
                {isSubmitting ? 'Relaying...' : 'Whisper Thought'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </article>
  );
};

export default PostView;
