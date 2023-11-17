import {
  Body,
  Controller,
  Get,
  Head,
  Header,
  Headers,
  Req,
  Res,
} from '@nestjs/common';
import { TestService } from './test.service';
import { HttpUtils, RequestMethod } from 'src/common/utils/http.utils';

@Controller('test')
export class TestController {
  constructor(
    private readonly testService: TestService,
    private readonly httpUtils: HttpUtils,
  ) {}

  @Get()
  async test(@Body() payload) {
    console.log(payload);
    // const re = await this.httpUtils.request(
    //   RequestMethod.GET,
    //   'http://localhost:3000/api/v1/test/aaa',
    //   payload,
    // );
    return 'Hello World';
  }

  @Get('aaa')
  async testa(@Body() payload) {
    const re = await this.httpUtils.request(
      RequestMethod.GET,
      'http://localhost:3000/api/v1/',
      payload,
    );
    return re;
  }
}
