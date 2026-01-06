
import React, { useState, useEffect } from 'react';
import { BlogPost, Comment, SiteSettings, AuthorProfile, ManifestoItem } from '../types.ts';

interface AdminDashboardProps {
  posts: BlogPost[];
  onSave: (post: BlogPost) => void;
  onDelete: (id: string) => void;
  onEdit?: (post: BlogPost) => void;
  onCreate?: () => void;
  isEditing?: boolean;
  editingPost?: BlogPost | null;
  onCancel?: () => void;
  siteSettings?: SiteSettings;
  onUpdateSettings?: (settings: SiteSettings) => void;
  authorProfile?: AuthorProfile;
  onUpdateAuthor?: (profile: AuthorProfile) => void;
  manifesto?: ManifestoItem[];
  onUpdateManifesto?: (manifesto: ManifestoItem[]) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  posts, onSave, onDelete, onEdit, onCreate, isEditing, editingPost, onCancel, siteSettings, onUpdateSettings, authorProfile, onUpdateAuthor, manifesto, onUpdateManifesto 
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'reflections' | 'branding' | 'profile' | 'security' | 'manifesto'>('posts');
  const [allComments, setAllComments] = useState<(Comment & { postTitle: string })[]>([]);
  
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [securityMessage, setSecurityMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState<Partial<BlogPost>>(
    editingPost || {
      title: '',
      excerpt: '',
      content: '',
      category: 'Reflections',
      mood: 'Quiet',
      status: 'published',
      imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'
    }
  );

  const loadComments = () => {
    const collected: (Comment & { postTitle: string })[] = [];
    posts.forEach(post => {
      const saved = localStorage.getItem(`rtwh_comments_${post.id}`);
      if (saved) {
        const comments: Comment[] = JSON.parse(saved);
        comments.forEach(c => collected.push({ ...c, postTitle: post.title }));
      }
    });
    setAllComments(collected.sort((a, b) => b.id.localeCompare(a.id)));
  };

  useEffect(() => {
    if (activeTab === 'reflections') loadComments();
  }, [activeTab, posts]);

  const deleteComment = (postId: string, commentId: string) => {
    const saved = localStorage.getItem(`rtwh_comments_${postId}`);
    if (saved) {
      const comments: Comment[] = JSON.parse(saved);
      const filtered = comments.filter(c => c.id !== commentId);
      localStorage.setItem(`rtwh_comments_${postId}`, JSON.stringify(filtered));
      loadComments();
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = localStorage.getItem('rtwh_admin_password') || 'Godpassage';
    
    if (passwords.current !== stored) {
      setSecurityMessage({ text: "Current access key is incorrect.", type: 'error' });
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setSecurityMessage({ text: "New keys do not match.", type: 'error' });
      return;
    }
    if (passwords.next.length < 4) {
      setSecurityMessage({ text: "New key is too short.", type: 'error' });
      return;
    }

    localStorage.setItem('rtwh_admin_password', passwords.next);
    setSecurityMessage({ text: "Access key updated successfully.", type: 'success' });
    setPasswords({ current: '', next: '', confirm: '' });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: BlogPost = {
      id: formData.id || Date.now().toString(),
      title: formData.title || 'Untitled',
      excerpt: formData.excerpt || '',
      content: formData.content || '',
      author: authorProfile?.name || 'Mosunmola',
      date: formData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      readingTime: `${Math.ceil((formData.content?.split(' ').length || 0) / 200)} min`,
      category: formData.category || 'Reflections',
      mood: formData.mood || 'Quiet',
      imageUrl: formData.imageUrl || '',
      status: formData.status as any || 'published',
      scheduledDate: formData.status === 'scheduled' ? formData.scheduledDate : undefined
    };
    onSave(newPost);
  };

  if (isEditing) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-500 max-w-4xl mx-auto px-4 pb-20">
        <div className="flex justify-between items-center mb-10 text-center sm:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Refine thought</h2>
          <button onClick={onCancel} className="text-slate-400 font-bold uppercase text-[10px] hover:text-indigo-600 transition-colors">Cancel</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 glass-card p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 bg-white shadow-xl">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-4 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-600/10 outline-none" placeholder="The Quiet Scribe..." />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Post Banner</label>
            <div className="flex flex-col gap-4">
              {formData.imageUrl && (
                <div className="w-full h-32 md:h-40 rounded-xl md:rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
                  <img src={formData.imageUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-100 border-dashed rounded-xl md:rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-2 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    <p className="mb-1 text-[10px] text-slate-500 font-bold uppercase tracking-widest">Click to upload banner</p>
                    <p className="text-[8px] text-slate-400 uppercase">SVG, PNG, JPG or GIF</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
              <input 
                type="text" 
                value={formData.imageUrl} 
                onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
                placeholder="Or paste image URL here..." 
                className="w-full p-3 rounded-xl bg-slate-50 text-[10px] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-4 rounded-xl md:rounded-2xl outline-none">
                <option>Reflections</option>
                <option>Lifestyle</option>
                <option>Faith</option>
                <option>Legal</option>
                <option>Dreams</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full p-4 rounded-xl md:rounded-2xl outline-none">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </div>

          {formData.status === 'scheduled' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <label className="text-[10px] font-bold uppercase text-indigo-600 ml-2">Schedule Time</label>
              <input 
                type="datetime-local" 
                value={formData.scheduledDate || ''} 
                onChange={e => setFormData({...formData, scheduledDate: e.target.value})} 
                className="w-full p-4 rounded-xl md:rounded-2xl border-indigo-100 border outline-none" 
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Excerpt</label>
            <textarea value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="w-full p-4 rounded-xl md:rounded-2xl h-24 outline-none" placeholder="A brief whisper..." />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Content</label>
            <textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full p-4 rounded-xl md:rounded-2xl h-64 serif italic outline-none" placeholder="Spill your soul..." />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white p-5 rounded-full font-bold shadow-xl hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs">
            Save Insight
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in slide-in-from-right-4 duration-700 px-4 pb-20 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Portal</h2>
        <button onClick={onCreate} className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-full font-bold shadow-xl text-sm uppercase tracking-widest hover:scale-105 transition-transform active:scale-95">
          + New Whisper
        </button>
      </div>

      <div className="flex gap-4 md:gap-8 border-b border-slate-100 overflow-x-auto no-scrollbar justify-start">
        {[
          { id: 'posts', label: 'Whispers' },
          { id: 'reflections', label: 'Reflections' },
          { id: 'branding', label: 'Branding' },
          { id: 'manifesto', label: 'Manifesto' },
          { id: 'profile', label: 'Scribe' },
          { id: 'security', label: 'Security' }
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)} 
            className={`pb-3 text-[10px] font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
          </button>
        ))}
      </div>

      {activeTab === 'posts' && (
        <div className="glass-card rounded-2xl md:rounded-[2rem] overflow-hidden border border-slate-100 bg-white shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <tr>
                  <th className="px-6 py-4">Thought</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {posts.map(post => (
                  <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 text-sm">{post.title}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-tighter">{post.category} • {post.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[9px] font-bold uppercase px-3 py-1 rounded-full ${
                        post.status === 'published' ? 'bg-green-50 text-green-600' : 
                        post.status === 'scheduled' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {post.status}
                      </span>
                      {post.status === 'scheduled' && post.scheduledDate && (
                        <p className="text-[8px] text-indigo-400 mt-1">{new Date(post.scheduledDate).toLocaleString()}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => onEdit?.(post)} className="text-indigo-600 font-bold mr-4 text-[10px] uppercase hover:underline">Edit</button>
                      <button onClick={() => onDelete(post.id)} className="text-red-400 font-bold text-[10px] uppercase hover:underline">Trash</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'reflections' && (
        <div className="space-y-4">
          {allComments.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl md:rounded-[2rem] border border-slate-100">
               <p className="text-slate-400 serif italic">No reflections have been shared yet.</p>
            </div>
          ) : (
            allComments.map(comment => (
              <div key={comment.id} className="glass-card p-6 rounded-2xl md:rounded-[2rem] bg-white border border-slate-100 flex flex-col sm:flex-row justify-between gap-4 items-center">
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Re: {comment.postTitle}</span>
                    <span className="hidden sm:inline text-slate-300 text-[10px]">•</span>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">{comment.date}</span>
                  </div>
                  <p className="text-slate-900 font-bold text-sm mb-1">{comment.author}</p>
                  <p className="text-slate-600 serif italic text-sm md:text-base leading-relaxed">"{comment.text}"</p>
                </div>
                <button 
                  onClick={() => deleteComment(comment.postId, comment.id)}
                  className="text-red-400 text-[10px] font-bold uppercase hover:bg-red-50 px-4 py-2 rounded-full transition-colors whitespace-nowrap"
                >
                  Set Free
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'branding' && siteSettings && onUpdateSettings && (
        <div className="max-w-xl mx-auto space-y-6 w-full">
          <div className="glass-card p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-100 bg-white shadow-xl space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Hub Name</label>
              <input type="text" value={siteSettings.siteName} onChange={e => onUpdateSettings({...siteSettings, siteName: e.target.value})} className="w-full p-4 rounded-xl md:rounded-2xl bg-slate-50 outline-none" />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Tagline</label>
              <input type="text" value={siteSettings.tagline} onChange={e => onUpdateSettings({...siteSettings, tagline: e.target.value})} className="w-full p-4 rounded-xl md:rounded-2xl bg-slate-50 outline-none" />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'manifesto' && manifesto && onUpdateManifesto && (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in w-full">
          <div className="space-y-6">
            {manifesto.map((item, index) => (
              <div key={item.id} className="glass-card p-6 rounded-2xl md:rounded-[2rem] bg-white border border-slate-100 shadow-lg space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Icon</label>
                    <input type="text" value={item.icon} onChange={e => {
                      const next = [...manifesto];
                      next[index] = { ...item, icon: e.target.value };
                      onUpdateManifesto(next);
                    }} className="w-full p-3 rounded-xl bg-slate-50 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Title</label>
                    <input type="text" value={item.title} onChange={e => {
                      const next = [...manifesto];
                      next[index] = { ...item, title: e.target.value };
                      onUpdateManifesto(next);
                    }} className="w-full p-3 rounded-xl bg-slate-50 outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Description</label>
                  <textarea value={item.description} onChange={e => {
                    const next = [...manifesto];
                    next[index] = { ...item, description: e.target.value };
                    onUpdateManifesto(next);
                  }} className="w-full p-3 rounded-xl bg-slate-50 h-24 outline-none text-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'profile' && authorProfile && onUpdateAuthor && (
        <div className="max-w-xl mx-auto space-y-6 w-full">
           <div className="glass-card p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-100 bg-white shadow-xl space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Scribe Name</label>
              <input type="text" value={authorProfile.name} onChange={e => onUpdateAuthor({...authorProfile, name: e.target.value})} className="w-full p-4 rounded-xl md:rounded-2xl bg-slate-50 outline-none" />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Professional Title</label>
              <input type="text" value={authorProfile.title} onChange={e => onUpdateAuthor({...authorProfile, title: e.target.value})} className="w-full p-4 rounded-xl md:rounded-2xl bg-slate-50 outline-none" />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Soul Bio</label>
              <textarea value={authorProfile.bio} onChange={e => onUpdateAuthor({...authorProfile, bio: e.target.value})} className="w-full p-4 rounded-xl md:rounded-2xl bg-slate-50 h-32 outline-none" />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="max-w-xl mx-auto space-y-6 w-full">
           <form onSubmit={handlePasswordChange} className="glass-card p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-100 bg-white shadow-xl space-y-6">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Change Access Key</h3>
            
            {securityMessage && (
              <div className={`p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest ${securityMessage.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {securityMessage.text}
              </div>
            )}

            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Current Key</label>
              <input required type="password" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} className="w-full p-4 rounded-xl md:rounded-2xl bg-slate-50 outline-none" />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">New Key</label>
              <input required type="password" value={passwords.next} onChange={e => setPasswords({...passwords, next: e.target.value})} className="w-full p-4 rounded-xl md:rounded-2xl bg-slate-50 outline-none" />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Confirm New Key</label>
              <input required type="password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} className="w-full p-4 rounded-xl md:rounded-2xl bg-slate-50 outline-none" />
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white p-5 rounded-full font-bold shadow-xl hover:bg-indigo-600 transition-all uppercase tracking-widest text-xs">
              Update Security Key
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
