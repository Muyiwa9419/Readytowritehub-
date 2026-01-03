
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

  const stats = [
    { name: 'Jan', posts: 2 },
    { name: 'Feb', posts: 4 },
    { name: 'Mar', posts: 1 },
    { name: 'Apr', posts: posts.length },
  ];

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

  const getCountdown = (scheduledDate: string) => {
    const target = new Date(scheduledDate);
    const diff = target.getTime() - currentTime.getTime();
    if (diff <= 0) return "Materializing...";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}h ${mins}m ${secs}s`;
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
    const isFuture = formData.scheduledDate ? new Date(formData.scheduledDate) > new Date() : false;
    return (
      <div className="animate-in fade-in zoom-in-95 duration-500">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">{editingPost ? 'Refine the Whisper' : 'Capture a New Thought'}</h2>
            <p className="text-slate-500 italic">Let the words flow softly into the void.</p>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors">Cancel</button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6 bg-white/5 p-8 rounded-3xl border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white" placeholder="The Midnight Garden..." />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white"><option>Reflections</option><option>Lifestyle</option><option>Legal</option><option>Craft</option><option>Dreams</option></select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Spirit Mood</label>
                <select value={formData.mood} onChange={e => setFormData({...formData, mood: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white"><option>Quiet</option><option>Restless</option><option>Inspired</option><option>Melancholy</option></select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Arrival Time</label>
                <input type="datetime-local" value={formData.scheduledDate} onChange={e => setFormData({...formData, scheduledDate: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white scheme-dark" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Banner Image</label>
                <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white" placeholder="Unsplash URL..." />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Excerpt</label>
              <textarea value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white h-20" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Content</label>
                <button type="button" onClick={handleExpandContent} disabled={aiLoading} className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 disabled:opacity-50">{aiLoading ? 'Dreaming...' : '✨ Expand with AI'}</button>
              </div>
              <textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white h-96 serif" />
            </div>
            <div className="flex items-center gap-6 pt-6 border-t border-white/5">
              <button type="submit" className="ml-auto bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95">Save Thought</button>
            </div>
          </form>
          <aside className="space-y-8">
            <div className="glass-card p-6 rounded-3xl border border-white/10"><h3 className="text-lg font-bold mb-4 flex items-center gap-2"><span className="text-indigo-400">✨</span> Writing Assistant</h3><div className="space-y-4"><div className="relative"><input type="text" placeholder="Topic..." value={topic} onChange={e => setTopic(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl pl-4 pr-12 py-3 focus:outline-none text-sm" /><button type="button" onClick={handleAiSuggest} className="absolute right-2 top-2 p-1 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors">Go</button></div><div className="space-y-3 max-h-60 overflow-y-auto pr-2">{suggestedIdeas.map((idea, i) => (<div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-indigo-500/30 cursor-pointer transition-all group" onClick={() => setFormData({ ...formData, title: idea.title, excerpt: idea.excerpt })}><p className="text-xs font-bold text-indigo-300 group-hover:text-indigo-200">{idea.title}</p><p className="text-[10px] text-slate-500 italic mt-1">{idea.excerpt}</p></div>))}</div></div></div>
          </aside>
        </div>
      </div>
    );
  }

  const scheduledPosts = posts.filter(p => p.status === 'scheduled');
  const publishedPosts = posts.filter(p => p.status === 'published' || p.status === 'draft');

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold text-white mb-2">Workspace</h2>
          <div className="flex gap-4 mt-4">
            <button onClick={() => setActiveTab('posts')} className={`text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'posts' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Feed</button>
            <button onClick={() => setActiveTab('scheduled')} className={`text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-all flex items-center gap-2 ${activeTab === 'scheduled' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Scheduled</button>
            <button onClick={() => setActiveTab('comments')} className={`text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'comments' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Comments</button>
            <button onClick={() => setActiveTab('manifesto')} className={`text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'manifesto' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Manifesto</button>
          </div>
        </div>
        {(activeTab === 'posts' || activeTab === 'scheduled') && (
          <button onClick={onCreate} className="bg-white text-slate-950 px-6 py-3 rounded-full font-bold hover:bg-indigo-400 hover:text-white transition-all active:scale-95 flex items-center gap-2 shadow-xl"><span>+</span> Capture Thought</button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-4">
          {activeTab === 'posts' && (
            <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                  <tr><th className="px-6 py-4">Title</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {publishedPosts.map(post => (
                    <tr key={post.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4"><p className="text-white font-medium group-hover:text-indigo-300 transition-colors">{post.title}</p><p className="text-[10px] text-slate-500">{post.date}</p></td>
                      <td className="px-6 py-4"><span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${post.status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>{post.status}</span></td>
                      <td className="px-6 py-4 text-right"><div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => onEdit?.(post)} className="text-indigo-400 hover:text-white text-sm font-bold underline">Edit</button><button onClick={() => onDelete(post.id)} className="text-red-400 hover:text-white text-sm font-bold underline">Trash</button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'manifesto' && (
            <div className="space-y-6">
              <div className="bg-indigo-500/5 p-8 rounded-[3rem] border border-white/5 mb-8">
                 <h3 className="text-white font-bold text-xl mb-2">The Midnight Manifesto</h3>
                 <p className="text-slate-500 text-sm">Define the soul of the hub. These values are displayed on the landing origins.</p>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {manifesto.map((item, index) => (
                  <div key={item.id} className="glass-card p-8 rounded-3xl border border-white/10 space-y-4">
                    <div className="flex items-center gap-4">
                       <input 
                        type="text" 
                        value={item.icon}
                        onChange={(e) => {
                          const newM = [...manifesto];
                          newM[index].icon = e.target.value;
                          onUpdateManifesto?.(newM);
                        }}
                        className="w-14 h-14 bg-slate-900 border border-white/10 rounded-2xl text-center text-2xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                       />
                       <input 
                        type="text" 
                        value={item.title}
                        onChange={(e) => {
                          const newM = [...manifesto];
                          newM[index].title = e.target.value;
                          onUpdateManifesto?.(newM);
                        }}
                        className="flex-1 bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                       />
                    </div>
                    <textarea 
                      value={item.description}
                      onChange={(e) => {
                        const newM = [...manifesto];
                        newM[index].description = e.target.value;
                        onUpdateManifesto?.(newM);
                      }}
                      className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-slate-400 text-sm serif italic focus:outline-none focus:ring-1 focus:ring-indigo-500 h-24"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                  <tr><th className="px-6 py-4">Comment</th><th className="px-6 py-4">Author</th><th className="px-6 py-4 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {allComments.map(comment => (
                    <tr key={comment.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4 max-w-xs"><p className="text-white text-xs serif italic">"{comment.text}"</p></td>
                      <td className="px-6 py-4 text-indigo-300 text-xs font-bold">{comment.author}</td>
                      <td className="px-6 py-4 text-right"><button onClick={() => {}} className="text-red-400 hover:text-red-300 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="glass-card p-6 rounded-3xl border border-white/5 bg-indigo-500/5">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-4 flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse" />Hub Overview</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs"><span className="text-slate-500">Live Time:</span><span className="text-white font-mono">{currentTime.toLocaleTimeString()}</span></div>
              <div className="flex justify-between items-center text-xs"><span className="text-slate-500">Total Thoughts:</span><span className="text-indigo-300 font-bold">{posts.length}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
