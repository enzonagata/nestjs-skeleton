import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TestService } from './test.service';
import { HttpHelper, RequestMethod } from 'src/common/helpers/http.helper';

@Controller('test')
export class TestController {
  constructor(
    private readonly testService: TestService,
    private readonly httpHelper: HttpHelper,
  ) {}

  @Get()
  async test(@Body() payload) {
    throw new HttpException(
      `Ocorreu um erro`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    // const re = await this.httpUtils.request(
    //   RequestMethod.GET,
    //   'http://localhost:3000/api/v1/test/aaa',
    //   payload,
    // );
    // return re;
  }

  @Get('aaa')
  async testa(@Body() payload) {
    const re = await this.httpHelper.request(
      RequestMethod.GET,
      'http://localhost:3002/api/v1/',
      payload,
    );
    return re;
  }
}
