import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosRequestConfig } from 'axios';
import { of, throwError } from 'rxjs';
import { ApiError } from '../../common/errors/api.error';
import { ApiHelper } from '../../common/helpers/api.helper';

describe('API Helper - request', () => {
  let service: ApiHelper;
  let httpService: HttpService;

  const request = {
    host: '/api',
    route: '/teste',
    body: '',
    header: {},
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiHelper,
        {
          provide: HttpService,
          useValue: {
            request: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ApiHelper>(ApiHelper);
    httpService = module.get<HttpService>(HttpService);
  });

  test('should return data when request is successful', async () => {
    const mockResponse = { data: { message: 'Success' } };

    (httpService.request as jest.Mock).mockReturnValue(of(mockResponse));

    const requestConfig: AxiosRequestConfig = { url: '/test', method: 'GET' };
    const result = await service.request(requestConfig);

    expect(result).toEqual(mockResponse.data);
    expect(httpService.request).toHaveBeenCalledWith(requestConfig);
  });

  test('should throw ApiError when response error occurs', async () => {
    const errorResponse = {
      response: {
        data: 'Not Found',
        status: 404,
        headers: { 'content-type': 'application/json' },
      },
    };

    (httpService.request as jest.Mock).mockReturnValue(
      throwError(() => errorResponse),
    );

    const requestConfig: AxiosRequestConfig = { url: '/test', method: 'GET' };

    await expect(service.request(requestConfig)).rejects.toThrow(ApiError);
    await expect(service.request(requestConfig)).rejects.toMatchObject({
      details: {
        data: 'Not Found',
        status: 404,
        headers: { 'content-type': 'application/json' },
      },
    });
  });

  test('should throw ApiError when request error occurs', async () => {
    const errorRequest = { request: { timeout: 5000 } };

    (httpService.request as jest.Mock).mockReturnValue(
      throwError(() => errorRequest),
    );

    const requestConfig: AxiosRequestConfig = { url: '/test', method: 'GET' };

    await expect(service.request(requestConfig)).rejects.toThrow(ApiError);
    await expect(service.request(requestConfig)).rejects.toMatchObject({
      details: { timeout: 5000 },
    });
  });

  test('should throw ApiError when an unknown error occurs', async () => {
    const errorMessage = { message: 'Unexpected Error' };

    (httpService.request as jest.Mock).mockReturnValue(
      throwError(() => errorMessage),
    );

    const requestConfig: AxiosRequestConfig = { url: '/test', method: 'GET' };

    await expect(service.request(requestConfig)).rejects.toThrow(ApiError);
    await expect(service.request(requestConfig)).rejects.toMatchObject({
      details: 'Unexpected Error',
    });
  });

  test('return data when get is successful', async () => {
    const mockResponse = { data: { message: 'Success' } };
    (httpService.request as jest.Mock).mockReturnValue(of(mockResponse));
    const res = await service.get(request.host, request.route);
    expect(res).toEqual(mockResponse.data);
  });

  test('return data when post is successful', async () => {
    const mockResponse = { data: { message: 'Success' } };
    (httpService.request as jest.Mock).mockReturnValue(of(mockResponse));
    const res = await service.post(request.host, request.route, request.body);
    expect(res).toEqual(mockResponse.data);
  });

  test('return data when put is successful', async () => {
    const mockResponse = { data: { message: 'Success' } };
    (httpService.request as jest.Mock).mockReturnValue(of(mockResponse));
    const res = await service.put(request.host, request.route, request.body);
    expect(res).toEqual(mockResponse.data);
  });

  test('return data when delete is successful', async () => {
    const mockResponse = { data: { message: 'Success' } };
    (httpService.request as jest.Mock).mockReturnValue(of(mockResponse));
    const res = await service.delete(request.host, request.route, request.body);
    expect(res).toEqual(mockResponse.data);
  });

  test('return data when patch is successful', async () => {
    const mockResponse = { data: { message: 'Success' } };
    (httpService.request as jest.Mock).mockReturnValue(of(mockResponse));
    const res = await service.patch(request.host, request.route, request.body);
    expect(res).toEqual(mockResponse.data);
  });
});
