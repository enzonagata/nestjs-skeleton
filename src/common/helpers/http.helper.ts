import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HttpHelper {
  constructor(private readonly httpService: HttpService) {}

  async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.request<T>({
          method,
          url,
          data,
          ...config,
        }),
      );
      return response.data;
    } catch (error) {
      throw new Error(`Erro na requisição ${method} ${url}: ${error.message}`);
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request('GET', url, null, config);
  }

  async post<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request('POST', url, data, config);
  }

  async put<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request('PUT', url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request('DELETE', url, null, config);
  }
}
