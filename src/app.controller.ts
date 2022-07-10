import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CustomDate } from './auth/dto/custom-date.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('time')
  async getServerTime(): Promise<CustomDate> {
    return await this.appService.getServerTime();
  }
}
