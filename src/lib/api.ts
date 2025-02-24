import { AppError, ErrorCodes, handleError } from './error';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

interface ApiResponse<T> {
  data: T;
  error: null;
}

interface ApiError {
  data: null;
  error: AppError;
}

type ApiResult<T> = ApiResponse<T> | ApiError;

class ApiClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL;
    this.apiKey = import.meta.env.VITE_API_KEY;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResult<T>> {
    try {
      const { params, ...init } = options;
      const url = new URL(`${this.baseUrl}${endpoint}`);
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }

      const response = await fetch(url.toString(), {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          ...init.headers,
        },
      });

      if (!response.ok) {
        throw new AppError(
          response.statusText,
          ErrorCodes.NETWORK_ERROR,
          response.status
        );
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleError(error) };
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResult<T>> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  async post<T>(endpoint: string, data: unknown): Promise<ApiResult<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<ApiResult<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResult<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient(); 