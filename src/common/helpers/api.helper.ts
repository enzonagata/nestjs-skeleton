import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ApiError } from '../errors/api.error';

@Injectable()
export class ApiHelper {
  constructor(private readonly httpService: HttpService) {}

  async request<T>(requestConfig: AxiosRequestConfig): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.request<T>(requestConfig),
      );

      return response.data;
    } catch (error: any) {
      let details: any;

      if (error.response) {
        details = {
          data: error.response.data,
          status: error.response.status,
          headers: error.response.headers,
        };
      } else if (error.request) {
        details = error.request;
      } else {
        details = error.message;
      }

      throw new ApiError('An error occurred.', details);
    }
  }

  async get<T>(host: string, route: string, headers: object = {}): Promise<T> {
    const requestConfig: AxiosRequestConfig = {
      baseURL: host,
      url: route,
      method: 'get',
      headers,
    };

    return await this.request<T>(requestConfig);
  }

  async post<T>(
    host: string,
    route: string,
    body: any,
    headers: object = {},
  ): Promise<T> {
    const requestConfig: AxiosRequestConfig = {
      baseURL: host,
      url: route,
      method: 'post',
      headers,
      data: body,
    };

    return await this.request<T>(requestConfig);
  }

  async put<T>(
    host: string,
    route: string,
    body: any,
    headers: object = {},
  ): Promise<T> {
    const requestConfig: AxiosRequestConfig = {
      baseURL: host,
      url: route,
      method: 'put',
      headers,
      data: body,
    };

    return await this.request<T>(requestConfig);
  }

  async delete<T>(
    host: string,
    route: string,
    body: any,
    headers: object = {},
  ): Promise<T> {
    const requestConfig: AxiosRequestConfig = {
      baseURL: host,
      url: route,
      method: 'delete',
      headers,
      data: body,
    };

    return await this.request<T>(requestConfig);
  }

  async patch<T>(
    host: string,
    route: string,
    body: any,
    headers: object = {},
  ): Promise<T> {
    const requestConfig: AxiosRequestConfig = {
      baseURL: host,
      url: route,
      method: 'patch',
      headers,
      data: body,
    };

    return await this.request<T>(requestConfig);
  }
}
