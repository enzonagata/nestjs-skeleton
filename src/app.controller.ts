import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller({
  version: '',
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('healthcheck')
  public getStatus(): boolean {
    return this.appService.getStatus();
  }
}
