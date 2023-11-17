import { Body, Controller, Get, Headers, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Logging } from 'log4obs';

@ApiTags('Health Check')
@Controller({})
export class AppController {
  private readonly logger = new Logging();

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
    this.logger.logInfo(
      '',
      '[COBRANCA][NEGATIVACAO-CURTA][HEALTH-CHECK]',
      'Endpoint de health-check acessado',
    );
    return 'negativacao-curta';
  }
}
