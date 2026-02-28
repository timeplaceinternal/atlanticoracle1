import { NewsPost } from '../types';

const STORAGE_KEY = 'atlantic_oracle_news';

const DEFAULT_POSTS: NewsPost[] = [
  {
    id: '1',
    slug: 'cosmic-shift-2024',
    title: 'The Great Cosmic Shift',
    date: 'Feb 24, 2024',
    text: 'The stars are moving in ways we haven\'t seen in centuries. This cosmic shift is not just a celestial event; it\'s a call to awakening for all souls on Earth. As the planets align, we are invited to release old patterns and embrace a new frequency of existence.',
    imageUrl: 'https://picsum.photos/seed/cosmic/800/600',
    format: 'fact',
    topic: 'astrology'
  },
  {
    id: '2',
    slug: 'numerology-of-union',
    title: 'Numerology of Union',
    date: 'Feb 20, 2024',
    text: 'Numbers are the language of the universe. In the realm of relationships, numerology can provide profound insights into the compatibility and destiny of two individuals. By understanding the vibrational frequencies of your names and birth dates, you can unlock the secrets of your union.',
    imageUrl: 'https://picsum.photos/seed/union/800/600',
    format: 'fact',
    topic: 'numerology'
  }
];

// Cache for posts to avoid frequent fetches
let postsCache: NewsPost[] | null = null;

export const newsService = {
  getPosts: async (): Promise<NewsPost[]> => {
    try {
      const response = await fetch('/api/news');
      if (response.ok) {
        const posts = await response.json();
        if (posts && posts.length > 0) {
          postsCache = posts;
          return posts;
        }
      }
    } catch (error) {
      console.warn("Failed to fetch news from API, falling back to local storage:", error);
    }

    // Fallback to localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_POSTS;
    }
    return JSON.parse(stored);
  },

  savePost: async (post: NewsPost) => {
    // Update local state first
    const posts = await newsService.getPosts();
    const index = posts.findIndex(p => p.id === post.id);
    if (index >= 0) {
      posts[index] = post;
    } else {
      posts.push(post);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    postsCache = posts;

    // Sync with API
    try {
      await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(posts)
      });
    } catch (error) {
      console.error("Failed to sync news with API:", error);
    }
  },

  deletePost: async (id: string) => {
    const posts = await newsService.getPosts();
    const filtered = posts.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    postsCache = filtered;

    // Sync with API
    try {
      await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filtered)
      });
    } catch (error) {
      console.error("Failed to sync news deletion with API:", error);
    }
  }
};
