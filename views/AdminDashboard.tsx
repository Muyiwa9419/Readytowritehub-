
import React, { useState, useRef, useEffect } from 'react';
import { BlogPost, Comment, ManifestoItem } from '../types';
import { generateBlogIdea, expandContentStream } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AdminDashboardProps {
  posts: BlogPost[];
  onSave: (post: BlogPost) => void;
  onDelete: (id: string) => void;
  onEdit?: (post: BlogPost) => void;
  onCreate?: () => void;
  isEditing?: boolean;
  editingPost?: BlogPost | null;
  onCancel?: () => void;
  manifesto?: ManifestoItem[];
  onUpdateManifesto?: (manifesto: ManifestoItem[]) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  posts, onSave, onDelete, onEdit, onCreate, isEditing, editingPost, onCancel, manifesto = [], onUpdateManifesto 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'comments' | 'scheduled' | 'manifesto'>('posts');
  const [allComments, setAllComments] = useState<(Comment & { postTitle: string })[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [formData, setFormData] = useState<Partial<BlogPost>>(
    editingPost || {
      title: '',
      excerpt: '',
      content: '',
      author: 'Mosunmola, Esq',
      category: 'Reflections',
      mood: 'Quiet',
      status: 'draft',
      imageUrl: `https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800`,
      scheduledDate: new Date(Date.now() + 3600000).toISOString().slice(0, 16)
    }
  );

  const [aiLoading, setAiLoading] = useState(false);
  const [suggestedIdeas, setSuggestedIdeas] = useState<{title: string, excerpt: string}[]>([]);
  const [topic, setTopic] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (activeTab === 'comments') {
      loadAllComments();
    }
  }, [activeTab, posts]);

  const loadAllComments = () => {
    const comments: (Comment & { postTitle: string })[] = [];
    posts.forEach(post => {
      const saved = localStorage.getItem(`rtwh_comments_${post.id}`);
      if (saved) {
        const postComments: Comment[] = JSON.parse(saved);
        postComments.forEach(c => {
          comments.push({ ...c, postTitle: post.title });
        });
      }
    });
    setAllComments(comments.sort((a, b) => parseInt(b.id) - parseInt(a.id)));
  };

  const handleAiSuggest = async () => {
    if (!topic) return;
    setAiLoading(true);
    try {
      const ideas = await generateBlogIdea(topic);
      setSuggestedIdeas(ideas);
    } catch (e) { console.error(e); }
    finally { setAiLoading(false); }
  };

  const handleExpandContent = async () => {
    if (!formData.title || !formData.excerpt) return;
    setAiLoading(true);
    try {
      await expandContentStream(formData.title, formData.excerpt, (text) => {
        setFormData(prev => ({ ...prev, content: text }));
      });
    } catch (e) { console.error(e); }
    finally { setAiLoading(false); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const scheduledDateTime = formData.scheduledDate ? new Date(formData.scheduledDate) : now;
    const isFuture = scheduledDateTime > now;
    let finalStatus: 'published' | 'draft' | 'scheduled' = formData.status || 'draft';
    if (finalStatus === 'published' && isFuture) finalStatus = 'scheduled';
    const datePart = scheduledDateTime.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const timePart = scheduledDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const fullTimestamp = `${datePart} • ${timePart}`;
    const newPost: BlogPost = {
      id: formData.id || Date.now().toString(),
      title: formData.title || 'Untitled',
      excerpt: formData.excerpt || '',
      content: formData.content || '',
      author: formData.author || 'Mosunmola, Esq',
      date: fullTimestamp,
      readingTime: `${Math.max(1, Math.ceil((formData.content?.length || 0) / 1000))} min`,
      category: formData.category || 'Reflections',
      mood: formData.mood || 'Quiet',
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800',
      status: finalStatus,
      scheduledDate: formData.scheduledDate,
      likes: formData.likes || 0,
      dislikes: formData.dislikes || 0,
      ratingCount: formData.ratingCount || 0,
      ratingSum: formData.ratingSum || 0,
    };
    onSave(newPost);
  };

  if (isEditing) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{editingPost ? 'Refine the Whisper' : 'Capture a New Thought'}</h2>
            <p className="text-slate-500 text-sm md:text-base italic">Let the words flow softly into the void.</p>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors text-sm">Cancel</button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6 bg-white/5 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white text-sm" placeholder="The Midnight Garden..." />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white text-sm"><option>Reflections</option><option>Lifestyle</option><option>Legal</option><option>Craft</option><option>Dreams</option></select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Spirit Mood</label>
                <select value={formData.mood} onChange={e => setFormData({...formData, mood: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white text-sm"><option>Quiet</option><option>Restless</option><option>Inspired</option><option>Melancholy</option></select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Arrival Time</label>
                <input type="datetime-local" value={formData.scheduledDate} onChange={e => setFormData({...formData, scheduledDate: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white text-sm scheme-dark" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Banner Image</label>
                <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white text-sm" placeholder="Unsplash URL..." />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Excerpt</label>
              <textarea value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white h-20 text-sm" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Content</label>
                <button type="button" onClick={handleExpandContent} disabled={aiLoading} className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 disabled:opacity-50">{aiLoading ? 'Dreaming...' : '✨ Expand with AI'}</button>
              </div>
              <textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white h-60 md:h-96 serif text-base" />
            </div>
            <div className="flex items-center gap-6 pt-6 border-t border-white/5">
              <button type="submit" className="w-full md:w-auto ml-auto bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95 text-sm">Save Thought</button>
            </div>
          </form>
          <aside className="space-y-8">
            <div className="glass-card p-6 rounded-2xl md:rounded-3xl border border-white/10">
              <h3 className="text-base md:text-lg font-bold mb-4 flex items-center gap-2"><span className="text-indigo-400">✨</span> Assistant</h3>
              <div className="space-y-4">
                <div className="relative">
                  <input type="text" placeholder="Topic..." value={topic} onChange={e => setTopic(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl pl-4 pr-12 py-3 focus:outline-none text-sm" />
                  <button type="button" onClick={handleAiSuggest} className="absolute right-2 top-2 p-1 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors">Go</button>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 no-scrollbar">
                  {suggestedIdeas.map((idea, i) => (
                    <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-indigo-500/30 cursor-pointer transition-all group" onClick={() => setFormData({ ...formData, title: idea.title, excerpt: idea.excerpt })}>
                      <p className="text-[11px] font-bold text-indigo-300 group-hover:text-indigo-200">{idea.title}</p>
                      <p className="text-[10px] text-slate-500 italic mt-1 line-clamp-2">{idea.excerpt}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  const publishedPosts = posts.filter(p => p.status === 'published' || p.status === 'draft' || p.status === 'scheduled');

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Workspace</h2>
          <div className="flex gap-4 md:gap-6 mt-4 overflow-x-auto no-scrollbar pb-2">
            <button onClick={() => setActiveTab('posts')} className={`text-[10px] md:text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-all whitespace-nowrap ${activeTab === 'posts' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Feed</button>
            <button onClick={() => setActiveTab('scheduled')} className={`text-[10px] md:text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-all whitespace-nowrap ${activeTab === 'scheduled' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Future</button>
            <button onClick={() => setActiveTab('comments')} className={`text-[10px] md:text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-all whitespace-nowrap ${activeTab === 'comments' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Comments</button>
            <button onClick={() => setActiveTab('manifesto')} className={`text-[10px] md:text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-all whitespace-nowrap ${activeTab === 'manifesto' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Manifesto</button>
          </div>
        </div>
        <button onClick={onCreate} className="w-full md:w-auto bg-white text-slate-950 px-6 py-3 rounded-full font-bold hover:bg-indigo-400 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl text-sm"><span>+</span> Capture Thought</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-4">
          {(activeTab === 'posts' || activeTab === 'scheduled') && (
            <div className="glass-card rounded-2xl md:rounded-3xl overflow-hidden border border-white/5">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[500px]">
                  <thead className="bg-white/5 text-[9px] md:text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    <tr><th className="px-6 py-4">Title</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {publishedPosts.filter(p => activeTab === 'posts' ? (p.status !== 'scheduled') : (p.status === 'scheduled')).map(post => (
                      <tr key={post.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="text-white text-sm font-medium group-hover:text-indigo-300 transition-colors line-clamp-1">{post.title}</p>
                          <p className="text-[9px] md:text-[10px] text-slate-500">{post.date}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${post.status === 'published' ? 'bg-green-500/10 text-green-400' : post.status === 'scheduled' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {post.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-3 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => onEdit?.(post)} className="text-indigo-400 hover:text-white text-xs font-bold underline">Edit</button>
                            <button onClick={() => onDelete(post.id)} className="text-red-400 hover:text-white text-xs font-bold underline">Trash</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'manifesto' && (
            <div className="space-y-6">
              <div className="bg-indigo-500/5 p-6 md:p-8 rounded-[1.5rem] md:rounded-[3rem] border border-white/5 mb-4">
                 <h3 className="text-white font-bold text-lg md:text-xl mb-1 md:mb-2">The Midnight Manifesto</h3>
                 <p className="text-slate-500 text-[10px] md:text-sm">Define the soul of the hub. These values are displayed on the landing origins.</p>
              </div>
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                {manifesto.map((item, index) => (
                  <div key={item.id} className="glass-card p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/10 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                       <input 
                        type="text" 
                        value={item.icon}
                        onChange={(e) => {
                          const newM = [...manifesto];
                          newM[index].icon = e.target.value;
                          onUpdateManifesto?.(newM);
                        }}
                        className="w-12 h-12 md:w-14 md:h-14 bg-slate-900 border border-white/10 rounded-2xl text-center text-xl md:text-2xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                       />
                       <input 
                        type="text" 
                        value={item.title}
                        onChange={(e) => {
                          const newM = [...manifesto];
                          newM[index].title = e.target.value;
                          onUpdateManifesto?.(newM);
                        }}
                        className="w-full flex-1 bg-slate-900 border border-white/10 rounded-2xl px-4 md:px-6 py-3 md:py-4 text-white text-sm md:text-base font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                       />
                    </div>
                    <textarea 
                      value={item.description}
                      onChange={(e) => {
                        const newM = [...manifesto];
                        newM[index].description = e.target.value;
                        onUpdateManifesto?.(newM);
                      }}
                      className="w-full bg-slate-900 border border-white/10 rounded-2xl px-4 md:px-6 py-3 md:py-4 text-slate-400 text-xs md:text-sm serif italic focus:outline-none focus:ring-1 focus:ring-indigo-500 h-24"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="glass-card rounded-2xl md:rounded-3xl overflow-hidden border border-white/5">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[500px]">
                  <thead className="bg-white/5 text-[9px] md:text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    <tr><th className="px-6 py-4">Comment</th><th className="px-6 py-4">Author</th><th className="px-6 py-4 text-right">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {allComments.map(comment => (
                      <tr key={comment.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4 max-w-xs"><p className="text-white text-[11px] md:text-xs serif italic line-clamp-2">"{comment.text}"</p></td>
                        <td className="px-6 py-4 text-indigo-300 text-[10px] md:text-xs font-bold">{comment.author}</td>
                        <td className="px-6 py-4 text-right"><button onClick={() => {}} className="text-red-400 hover:text-red-300 text-xs font-bold md:opacity-0 group-hover:opacity-100 transition-opacity underline">Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6 md:space-y-8">
          <div className="glass-card p-6 rounded-2xl md:rounded-3xl border border-white/5 bg-indigo-500/5">
            <h4 className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-4 flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse" />Overview</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[11px]"><span className="text-slate-500">Live Time:</span><span className="text-white font-mono">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
              <div className="flex justify-between items-center text-[11px]"><span className="text-slate-500">Thought Log:</span><span className="text-indigo-300 font-bold">{posts.length}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
