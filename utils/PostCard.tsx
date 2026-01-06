
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
      className="group cursor-pointer glass-card rounded-[2rem] overflow-hidden hover:translate-y-[-4px] transition-all duration-500 hover:shadow-2xl border-slate-200/50 bg-white/80 h-full flex flex-col"
    >
      <div className="h-48 md:h-52 overflow-hidden bg-slate-100">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale-[0.3] group-hover:grayscale-0 opacity-90 group-hover:opacity-100"
        />
      </div>
      <div className="p-6 flex-1 flex flex-col text-center sm:text-left">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              {post.category}
            </span>
          </div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{post.readingTime} read</span>
        </div>
        <h3 className="text-lg md:text-xl font-bold mb-3 text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
          {post.title}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-6 leading-relaxed italic serif">
          "{post.excerpt}"
        </p>
        <div className="flex items-center justify-center sm:justify-start gap-3 mt-auto pt-6 border-t border-slate-50">
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600 border border-indigo-100">
            {post.author[0]}
          </div>
          <div className="text-left text-[10px]">
            <p className="text-slate-900 font-semibold">{post.author}</p>
            <p className="text-slate-400 uppercase">{post.date}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
