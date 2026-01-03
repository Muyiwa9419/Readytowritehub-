
import React from 'react';
import { BlogPost } from '../types';

interface PostCardProps {
  post: BlogPost;
  onClick: (post: BlogPost) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  return (
    <div 
      onClick={() => onClick(post)}
      className="group cursor-pointer glass-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10"
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-80"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400/80 bg-indigo-500/10 px-2 py-1 rounded">
              {post.category}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-600 bg-white/5 px-2 py-1 rounded">
              {post.mood}
            </span>
          </div>
          <span className="text-xs text-slate-500">{post.readingTime} read</span>
        </div>
        <h3 className="text-2xl font-semibold mb-3 text-white leading-snug group-hover:text-indigo-300 transition-colors">
          {post.title}
        </h3>
        <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed italic">
          "{post.excerpt}"
        </p>
        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/5">
          <div className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center text-[10px] font-bold text-indigo-300">
            {post.author[0]}
          </div>
          <div className="text-[11px]">
            <p className="text-slate-300 font-medium">{post.author}</p>
            <p className="text-slate-500">{post.date}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
