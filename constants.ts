import { BlogPost } from './types.ts';

export const INITIAL_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Art of Late Night Whispers',
    excerpt: 'Finding clarity in the silence that only arrives after midnight.',
    content: 'When the world falls silent, the mind begins to speak. There is a specific kind of magic that happens between 2 AM and 4 AM, when the hustle of modern life is put on pause and the only sound is the rhythmic humming of the refrigerator or the distant wind in the trees...',
    author: 'Mosunmola, Esq',
    date: 'Oct 24, 2023 • 02:15 AM',
    readingTime: '5 min',
    category: 'Reflections',
    mood: 'Quiet',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800',
    status: 'published'
  },
  {
    id: '2',
    title: 'Why Soft Lighting Changes Everything',
    excerpt: 'How the warm glow of a desk lamp can transform your creative process.',
    content: 'Atmosphere is the unsung hero of productivity. We often focus on tools—the fastest laptops, the smoothest pens—but we forget the environment that houses them...',
    author: 'Mosunmola, Esq',
    date: 'Nov 12, 2023 • 11:45 PM',
    readingTime: '3 min',
    category: 'Lifestyle',
    mood: 'Inspired',
    imageUrl: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&q=80&w=800',
    status: 'published'
  },
  {
    id: '3',
    title: 'Finding Grace in the Stillness',
    excerpt: 'How quiet moments of prayer and reflection strengthen the soul.',
    content: 'There is a profound spiritual connection that happens in the quiet. When we remove the distractions of the day, we open our hearts to a deeper understanding of our faith...',
    author: 'Mosunmola, Esq',
    date: 'Dec 05, 2023 • 05:30 AM',
    readingTime: '8 min',
    category: 'Faith',
    mood: 'Restless',
    imageUrl: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&q=80&w=800',
    status: 'published'
  }
];