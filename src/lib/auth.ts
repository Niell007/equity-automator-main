import { supabase } from './supabase';
import { AppError, ErrorCodes } from './error';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
}

export interface Session {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

class AuthManager {
  private session: Session | null = null;

  constructor() {
    // Initialize session from storage
    this.initSession();
    
    // Listen for auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        this.setSession(session);
      } else if (event === 'SIGNED_OUT') {
        this.clearSession();
      }
    });
  }

  private initSession() {
    const savedSession = localStorage.getItem('session');
    if (savedSession) {
      try {
        this.session = JSON.parse(savedSession);
      } catch {
        this.clearSession();
      }
    }
  }

  private setSession(authSession: any) {
    if (!authSession) {
      this.clearSession();
      return;
    }

    this.session = {
      user: authSession.user ? {
        id: authSession.user.id,
        email: authSession.user.email!,
        full_name: authSession.user.user_metadata?.full_name,
        avatar_url: authSession.user.user_metadata?.avatar_url,
        role: authSession.user.user_metadata?.role || 'user',
      } : null,
      accessToken: authSession.access_token,
      refreshToken: authSession.refresh_token,
    };

    localStorage.setItem('session', JSON.stringify(this.session));
  }

  private clearSession() {
    this.session = null;
    localStorage.removeItem('session');
  }

  async signUp(email: string, password: string, userData: Partial<User>) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) throw error;
      this.setSession(data.session);
      return { data: data.user, error: null };
    } catch (error) {
      return { data: null, error: new AppError(
        'Failed to sign up',
        ErrorCodes.SUPABASE_ERROR,
        400,
        { originalError: error }
      )};
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      this.setSession(data.session);
      return { data: data.user, error: null };
    } catch (error) {
      return { data: null, error: new AppError(
        'Failed to sign in',
        ErrorCodes.SUPABASE_ERROR,
        401,
        { originalError: error }
      )};
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      this.clearSession();
      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: new AppError(
        'Failed to sign out',
        ErrorCodes.SUPABASE_ERROR,
        500,
        { originalError: error }
      )};
    }
  }

  async refreshSession() {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      this.setSession(data.session);
      return { data: data.user, error: null };
    } catch (error) {
      return { data: null, error: new AppError(
        'Failed to refresh session',
        ErrorCodes.SUPABASE_ERROR,
        401,
        { originalError: error }
      )};
    }
  }

  getSession(): Session | null {
    return this.session;
  }

  isAuthenticated(): boolean {
    return !!this.session?.accessToken;
  }

  getUser(): User | null {
    return this.session?.user || null;
  }

  getAccessToken(): string | null {
    return this.session?.accessToken || null;
  }
}

export const auth = new AuthManager(); 