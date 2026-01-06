
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readingTime: string;
  category: string;
  mood: string;
  imageUrl: string;
  status: 'published' | 'draft' | 'scheduled';
  scheduledDate?: string; // ISO string for the exact publish time
  likes?: number;
  dislikes?: number;
  ratingCount?: number;
  ratingSum?: number;
}

export interface ManifestoItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  text: string;
  date: string;
}

export interface AuthorProfile {
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
  rituals: { title: string; desc: string; icon: string }[];
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  accentColor: string;
  logoUrl: string;
}

export type View = 'landing' | 'home' | 'post' | 'admin' | 'edit' | 'author' | 'login';
