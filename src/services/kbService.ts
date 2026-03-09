import { KnowledgeBasePost } from '../types';

const STORAGE_KEY = 'atlantic_oracle_kb';

const DEFAULT_POSTS: KnowledgeBasePost[] = [];

// Cache for posts to avoid frequent fetches
let postsCache: KnowledgeBasePost[] | null = null;

export const kbService = {
  getPosts: async (): Promise<KnowledgeBasePost[]> => {
    try {
      const response = await fetch('/api/kb');
      if (response.ok) {
        const posts = await response.json();
        if (Array.isArray(posts)) {
          postsCache = posts;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
          return posts;
        }
      }
    } catch (error) {
      console.error("Failed to fetch KB from API:", error);
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
        console.error("Failed to parse local storage KB:", e);
      }
    }
    return DEFAULT_POSTS;
  },

  savePost: async (post: KnowledgeBasePost) => {
    const posts = postsCache || await kbService.getPosts();
    const newPosts = [...posts];
    const index = newPosts.findIndex(p => p.id === post.id);
    
    if (index >= 0) {
      newPosts[index] = post;
    } else {
      newPosts.push(post);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPosts));
    postsCache = newPosts;

    const response = await fetch('/api/kb', {
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
    const posts = postsCache || await kbService.getPosts();
    const filtered = posts.filter(p => p.id !== id);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    postsCache = filtered;

    const response = await fetch('/api/kb', {
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
