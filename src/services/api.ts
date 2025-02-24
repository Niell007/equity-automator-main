import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse } from '@/types';

class ApiService {
  private api: AxiosInstance;
  private static instance: ApiService;

  private constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle token refresh or logout
          localStorage.removeItem('auth_token');
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private async request<T>(
    method: string,
    url: string,
    data?: any,
    params?: any
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.request({
        method,
        url,
        data,
        params,
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'An error occurred',
      };
    }
  }

  // Auth endpoints
  public async login(email: string, password: string) {
    return this.request<{ token: string }>('POST', '/auth/login', { email, password });
  }

  public async logout() {
    return this.request<void>('POST', '/auth/logout');
  }

  // Employee endpoints
  public async getEmployees(organizationId: string) {
    return this.request<any[]>('GET', `/organizations/${organizationId}/employees`);
  }

  public async createEmployee(organizationId: string, employeeData: any) {
    return this.request<any>('POST', `/organizations/${organizationId}/employees`, employeeData);
  }

  // Report endpoints
  public async getReports(organizationId: string) {
    return this.request<any[]>('GET', `/organizations/${organizationId}/reports`);
  }

  public async generateReport(organizationId: string, reportData: any) {
    return this.request<any>('POST', `/organizations/${organizationId}/reports`, reportData);
  }

  // Organization endpoints
  public async getOrganization(organizationId: string) {
    return this.request<any>('GET', `/organizations/${organizationId}`);
  }

  public async updateOrganization(organizationId: string, organizationData: any) {
    return this.request<any>('PUT', `/organizations/${organizationId}`, organizationData);
  }
}

export const apiService = ApiService.getInstance(); 