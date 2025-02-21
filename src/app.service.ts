import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public getStatus(): boolean {
    return true;
  }
}
