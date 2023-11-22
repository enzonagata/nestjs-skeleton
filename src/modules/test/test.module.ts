import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { HttpModule } from '@nestjs/axios';
import { HttpHelper } from 'src/common/helpers/http.helper';

@Module({
  imports: [HttpModule],
  controllers: [TestController],
  providers: [TestService, HttpHelper],
})
export class TestModule {}
