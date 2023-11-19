import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

export const X_REQUEST_ID_HEADER = 'X-Request-ID';
export const X_RESPONSE_ID_HEADER = 'X-Response-ID';

export enum RequestMethod {
  POST = 'post',
  PUT = 'put',
  GET = 'get',
  DELETE = 'delete',
  PATCH = 'patch',
}

@Injectable()
export class HttpUtils {
  constructor(private readonly httpService: HttpService) {}

  async request(
    type: RequestMethod,
    url: string,
    payload: object,
    headers?: any,
  ) {
    try {
      const response = this.httpService[type](url, {
        data: payload,
        headers,
      });
      const result = await firstValueFrom(response);
      return result.data.data;
    } catch (error) {
      throw new HttpException(`${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }
}
