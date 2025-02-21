import { CallHandler, ExecutionContext } from '@nestjs/common';
import { ResponseInterceptor } from './response.interceptor';
import { of } from 'rxjs';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor;

  beforeEach(() => {
    interceptor = new ResponseInterceptor();
  });

  it('should wrap the response in the expected format', (done) => {
    const mockResponse = { statusCode: 200 };
    const mockHttpArgumentsHost: HttpArgumentsHost = {
      getRequest: function <T = any>(): T {
        return mockResponse as T;
      },
      getResponse: function <T = any>(): T {
        return mockResponse as T;
      },
      getNext: function <T = any>(): T {
        return mockResponse as T;
      },
    };

    const mockExecutionContext: Partial<ExecutionContext> = {
      switchToHttp: () => mockHttpArgumentsHost as HttpArgumentsHost,
    };

    const mockCallHandler: Partial<CallHandler> = {
      handle: () => of({ message: 'Success' }),
    };

    interceptor
      .intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler as CallHandler,
      )
      .subscribe((result) => {
        expect(result).toEqual({
          status: 200,
          response: { data: { message: 'Success' } },
        });
        done();
      });
  });
});
