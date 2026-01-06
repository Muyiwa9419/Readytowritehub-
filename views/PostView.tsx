
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
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-indigo-600 font-bold text-xl">{post.author[0]}</div>
            <div className="text-left">
              <p className="text-slate-900 font-bold">{post.author}</p>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{post.date}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="prose prose-slate prose-lg max-w-none text-slate-700 serif leading-relaxed space-y-8 text-center sm:text-left">
        {post.content.split('\n').map((para, i) => para ? <p key={i}>{para}</p> : <div key={i} className="h-4" />)}
      </div>
    </article>
  );
};

export default PostView;
