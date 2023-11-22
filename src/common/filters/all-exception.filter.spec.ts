import { ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { AllExceptionsFilter } from './all-exception.filter';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let responseMock: Response;

  beforeEach(() => {
    filter = new AllExceptionsFilter();
    responseMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should catch HttpException and set response status and message', () => {
    const exception = new HttpException(
      'Test exception message',
      HttpStatus.BAD_REQUEST,
    );
    const host = {
      switchToHttp: jest.fn(() => ({
        getResponse: jest.fn(() => responseMock),
      })),
    } as unknown as ArgumentsHost;

    filter.catch(exception, host);

    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(responseMock.json).toHaveBeenCalledWith({
      error_message: 'Test exception message',
    });
  });

  it('should catch non-HttpException and set response status and message', () => {
    const exception = new Error('Test error message');
    const host = {
      switchToHttp: jest.fn(() => ({
        getResponse: jest.fn(() => responseMock),
      })),
    } as unknown as ArgumentsHost;

    filter.catch(exception, host);

    expect(responseMock.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(responseMock.json).toHaveBeenCalledWith({
      error_message: new Error('Test error message'),
    });
  });
});
