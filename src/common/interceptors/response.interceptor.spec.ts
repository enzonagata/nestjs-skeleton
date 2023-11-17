import { ExecutionContext } from '@nestjs/common';
import { ResponseInterceptor } from './response.interceptor';
import { of } from 'rxjs';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor;

  beforeEach(() => {
    interceptor = new ResponseInterceptor();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should intercept and modify response data', async () => {
    const context: ExecutionContext = {
      switchToHttp: jest.fn(),
    } as unknown as ExecutionContext;

    const response = { data: 'Teste negativação curta.' };
    const next = {
      handle: () => of(response),
    } as any;

    const modifiedResponse = await interceptor
      .intercept(context, next)
      .toPromise();

    expect(modifiedResponse).toEqual({
      data: { data: 'Teste negativação curta.' },
    });
  });
});
