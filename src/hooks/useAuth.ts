import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { apiService } from '@/services/api';
import { useRouter } from 'next/navigation';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await apiService.login(email, password);
      
      if (response.success && response.data) {
        localStorage.setItem('auth_token', response.data.token);
        // Fetch user profile after successful login
        const userProfile = await apiService.request<User>('GET', '/auth/me');
        if (userProfile.success && userProfile.data) {
          setState({
            user: userProfile.data,
            isLoading: false,
            error: null,
          });
          router.push('/dashboard');
          return true;
        }
      }
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: response.error || 'Login failed',
      }));
      return false;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'An unexpected error occurred',
      }));
      return false;
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await apiService.logout();
    } finally {
      localStorage.removeItem('auth_token');
      setState({
        user: null,
        isLoading: false,
        error: null,
      });
      router.push('/auth/login');
    }
  }, [router]);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setState({
        user: null,
        isLoading: false,
        error: null,
      });
      return;
    }

    try {
      const response = await apiService.request<User>('GET', '/auth/me');
      if (response.success && response.data) {
        setState({
          user: response.data,
          isLoading: false,
          error: null,
        });
      } else {
        localStorage.removeItem('auth_token');
        setState({
          user: null,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      localStorage.removeItem('auth_token');
      setState({
        user: null,
        isLoading: false,
        error: 'Failed to verify authentication',
      });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    login,
    logout,
    checkAuth,
  };
} 