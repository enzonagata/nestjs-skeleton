import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { HttpHelper } from './http.helper';
import { AxiosResponse } from 'axios';

describe('HttpHelper', () => {
  let httpService: HttpService;
  let httpHelper: HttpHelper;

  beforeEach(() => {
    httpService = new HttpService();
    httpHelper = new HttpHelper(httpService);
  });

  it('should make a GET request', async () => {
    const mockResponse: AxiosResponse = {
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: undefined,
      },
    };

    jest.spyOn(httpService, 'request').mockReturnValue(of(mockResponse));

    const result = await httpHelper.get('/test');
    expect(result).toEqual(mockResponse.data);
  });

  it('should make a POST request', async () => {
    const mockResponse: AxiosResponse = {
      data: { id: 1 },
      status: 201,
      statusText: 'Created',
      headers: {},
      config: {
        headers: undefined,
      },
    };

    jest.spyOn(httpService, 'request').mockReturnValue(of(mockResponse));

    const result = await httpHelper.post('/test', { name: 'Test' });
    expect(result).toEqual(mockResponse.data);
  });

  it('should make a PUT request', async () => {
    const mockResponse: AxiosResponse = {
      data: { updated: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: undefined,
      },
    };

    jest.spyOn(httpService, 'request').mockReturnValue(of(mockResponse));

    const result = await httpHelper.put('/test', { name: 'Updated' });
    expect(result).toEqual(mockResponse.data);
  });

  it('should make a DELETE request', async () => {
    const mockResponse: AxiosResponse = {
      data: { deleted: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: undefined,
      },
    };

    jest.spyOn(httpService, 'request').mockReturnValue(of(mockResponse));

    const result = await httpHelper.delete('/test');
    expect(result).toEqual(mockResponse.data);
  });

  it('should throw an error on request failure', async () => {
    jest
      .spyOn(httpService, 'request')
      .mockReturnValue(throwError(() => new Error('Request failed')));

    await expect(httpHelper.get('/error')).rejects.toThrow(
      'Erro na requisição GET /error: Request failed',
    );
  });
});
