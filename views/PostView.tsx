
import React, { useState, useEffect, useRef } from 'react';
import { BlogPost, Comment } from '../types.ts';
import { generateAudioReading } from './services/geminiService.ts';

interface PostViewProps {
  post: BlogPost;
  onBack: () => void;
  onUpdateStats: (updates: Partial<BlogPost>) => void;
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

const PostView: React.FC<PostViewProps> = ({ post, onBack, onUpdateStats }) => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const progress = (window.scrollY / scrollHeight) * 100;
        setReadingProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      stopReading();
    };
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
      console.error("Audio failed", e);
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Whisper from ReadyToWriteHub: ${post.title}`);
    const body = encodeURIComponent(`I thought you might enjoy this reflection from ReadyToWriteHub:\n\n"${post.title}"\n\n${window.location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleLike = () => {
    onUpdateStats({ likes: (post.likes || 0) + 1 });
  };

  const handleDislike = () => {
    onUpdateStats({ dislikes: (post.dislikes || 0) + 1 });
  };

  return (
    <article className="max-w-3xl mx-auto animate-in fade-in duration-700 px-4 pb-20">
      <div className="fixed top-0 left-0 w-full h-1 z-[60] pointer-events-none">
        <div className="h-full bg-indigo-600 transition-all duration-150 ease-out" style={{ width: `${readingProgress}%` }} />
      </div>

      <button onClick={onBack} className="mb-8 flex items-center justify-center sm:justify-start gap-2 text-slate-400 hover:text-indigo-600 transition-colors text-sm font-bold uppercase tracking-widest w-full sm:w-auto">
        <span>←</span>
        Back to Feed
      </button>

      <div className="rounded-[2rem] overflow-hidden mb-10 shadow-2xl shadow-indigo-100 aspect-video relative group border border-slate-100">
        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 sm:left-10 sm:translate-x-0 w-full sm:w-auto px-6 sm:px-0">
          <button 
            onClick={toggleReading}
            disabled={audioLoading}
            className={`w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${isReading ? 'bg-indigo-600 text-white shadow-xl' : 'bg-white text-slate-900 shadow-xl border border-slate-100'}`}
          >
            {audioLoading ? 'Summoning...' : isReading ? 'Stop Listening' : 'Listen to Thought'}
          </button>
        </div>
      </div>

      <header className="mb-10 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mb-6">
          <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{post.category}</span>
          <span className="text-slate-400 text-[10px] font-bold uppercase">{post.readingTime} read</span>
        </div>
        <h1 className="text-3xl md:text-6xl font-bold text-slate-900 mb-8 leading-tight">{post.title}</h1>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100">
          <div className="flex flex-col items-center sm:items-start gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-indigo-600 font-bold text-xl">{post.author[0]}</div>
              <div className="text-left">
                <p className="text-slate-900 font-bold">{post.author}</p>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{post.date}</p>
              </div>
            </div>
            
            {/* Reactions Row */}
            <div className="flex items-center gap-6 mt-1">
              <button 
                onClick={handleLike}
                className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors group"
                title="Like this thought"
              >
                <svg className="w-5 h-5 group-active:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.757c1.277 0 2.234 1.135 1.957 2.385l-1.4 6.342c-.225 1.023-1.14 1.773-2.191 1.773H7.83c-1.09 0-2.028-.731-2.28-1.78l-1.63-6.801C3.648 10.743 4.542 10 5.564 10H8m6-4V4a2 2 0 114 0v2m-6 4h6" />
                </svg>
                <span className="text-xs font-bold">{post.likes || 0}</span>
              </button>
              
              <button 
                onClick={handleDislike}
                className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors group"
                title="Disagree with this thought"
              >
                <svg className="w-5 h-5 group-active:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.243c-1.277 0-2.234-1.135-1.957-2.385l1.4-6.342c.225-1.023 1.14-1.773 2.191-1.773h8.286c1.09 0 2.028.731 2.28 1.78l1.63 6.801c.272 1.135-.622 1.878-1.644 1.878H16m-6 4v2a2 2 0 11-4 0v-2m6-4H6" />
                </svg>
                <span className="text-xs font-bold">{post.dislikes || 0}</span>
              </button>
            </div>
          </div>
          
          <div className="flex flex-col items-center sm:items-end gap-3">
            <div className="flex gap-4">
              <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors" title="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </button>
              <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors" title="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-8.778h-2.955v-3.429h2.955v-2.53c0-2.927 1.787-4.52 4.398-4.52 1.251 0 2.327.093 2.64.135v3.061h-1.812c-1.42 0-1.695.675-1.695 1.666v2.188h3.39l-.441 3.429h-2.949v8.778h6.128c.732 0 1.325-.593 1.325-1.324v-21.351c0-.732-.593-1.325-1.325-1.325z"/></svg>
              </button>
              <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors" title="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/></svg>
              </button>
            </div>
            <button 
              onClick={() => setIsShareModalOpen(true)}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 hover:underline px-4 py-2 bg-indigo-50 rounded-full transition-all"
            >
              Spread the whisper
            </button>
          </div>
        </div>
      </header>

      <div className="prose prose-slate prose-lg max-w-none text-slate-700 serif leading-relaxed space-y-8 text-center sm:text-left">
        {post.content.split('\n').map((para, i) => para ? <p key={i}>{para}</p> : <div key={i} className="h-4" />)}
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 animate-in fade-in zoom-in duration-300 backdrop-blur-md bg-white/40">
          <div className="glass-card w-full max-w-md rounded-[2.5rem] border border-slate-200 p-8 md:p-10 relative overflow-hidden bg-white shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-600 to-transparent" />
            
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900">Share Thought</h3>
              <button onClick={() => setIsShareModalOpen(false)} className="text-slate-300 hover:text-slate-900 p-1 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Copy Link</label>
                <div className="flex items-center gap-2">
                  <input 
                    readOnly 
                    type="text" 
                    value={window.location.href} 
                    className="flex-1 p-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] text-slate-500 font-mono outline-none"
                  />
                  <button 
                    onClick={copyToClipboard}
                    className={`px-4 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${copied ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Email Share</label>
                <button 
                  onClick={shareViaEmail}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Whisper via Email
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-slate-400 text-[9px] serif italic">
              "Words find their way into the right hearts."
            </p>
          </div>
        </div>
      )}
    </article>
  );
};

export default PostView;
