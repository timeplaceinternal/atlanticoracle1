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
        if (Array.isArray(posts)) {
          postsCache = posts;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
          return posts;
        }
      }
    } catch (error) {
      console.error("Failed to fetch news from API:", error);
    }

    // Fallback to localStorage if API fails
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse local storage news:", e);
      }
    }
    return DEFAULT_POSTS;
  },

  savePost: async (post: NewsPost) => {
    // Get current posts (prefer cache if available to avoid race conditions)
    const posts = postsCache || await newsService.getPosts();
    const newPosts = [...posts];
    const index = newPosts.findIndex(p => p.id === post.id);
    
    if (index >= 0) {
      newPosts[index] = post;
    } else {
      newPosts.push(post);
    }
    
    // Update local state immediately
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPosts));
    postsCache = newPosts;

    // Sync with API
    const response = await fetch('/api/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPosts)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to sync with server");
    }
    
    return newPosts;
  },

  deletePost: async (id: string) => {
    const posts = postsCache || await newsService.getPosts();
    const filtered = posts.filter(p => p.id !== id);
    
    // Update local state immediately
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    postsCache = filtered;

    // Sync with API
    const response = await fetch('/api/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filtered)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to sync deletion with server");
    }
    
    return filtered;
  }
};
