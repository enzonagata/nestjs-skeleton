import { Body, Controller, Get, Headers, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health Check')
@Controller({})
export class AppController {
  @Get()
  helloWorld() {
    return 'Hello World';
  }

  @Get('health-check')
  @ApiOperation({
    summary: 'Endpoint de Health Check',
  })
  @ApiOkResponse({
    type: String,
  })
  healthCheck(): string {
    return 'healthcheck';
  }
}
