import { NewsPost } from '../types';

const STORAGE_KEY = 'atlantic_oracle_news';

const DEFAULT_POSTS: NewsPost[] = [];

// Cache for posts to avoid frequent fetches
let postsCache: NewsPost[] | null = null;

export const newsService = {
  getPosts: async (): Promise<NewsPost[]> => {
    try {
      const response = await fetch('/api/news');
      if (response.ok) {
        const posts = await response.json();
        postsCache = posts;
        return posts;
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
