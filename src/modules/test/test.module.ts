import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { HttpModule } from '@nestjs/axios';
import { HttpUtils } from 'src/common/utils/http.utils';

@Module({
  imports: [HttpModule],
  controllers: [TestController],
  providers: [TestService, HttpUtils],
})
export class TestModule {}