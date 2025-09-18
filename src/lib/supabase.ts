import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Check if we're in demo mode (no env vars)
export const isDemoMode = !supabaseUrl || !supabaseAnonKey;

export const supabase = isDemoMode 
  ? null 
  : createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });

// Demo mode storage using in-memory storage for server-side
const demoStorage = new Map<string, any>();

// Demo mode storage using localStorage (client-side) or in-memory (server-side)
export class DemoStorage {
  private static prefix = 'activity-picker-demo-';

  static setItem(key: string, value: any) {
    if (typeof window !== 'undefined') {
      // Client-side: use localStorage
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
    } else {
      // Server-side: use in-memory storage
      demoStorage.set(this.prefix + key, value);
    }
  }

  static getItem(key: string) {
    if (typeof window !== 'undefined') {
      // Client-side: use localStorage
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } else {
      // Server-side: use in-memory storage
      return demoStorage.get(this.prefix + key) || null;
    }
  }

  static removeItem(key: string) {
    if (typeof window !== 'undefined') {
      // Client-side: use localStorage
      localStorage.removeItem(this.prefix + key);
    } else {
      // Server-side: use in-memory storage
      demoStorage.delete(this.prefix + key);
    }
  }

  static clear() {
    if (typeof window !== 'undefined') {
      // Client-side: use localStorage
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(this.prefix)
      );
      keys.forEach(key => localStorage.removeItem(key));
    } else {
      // Server-side: clear in-memory storage
      demoStorage.clear();
    }
  }
}
