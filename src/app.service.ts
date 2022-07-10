import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  public async getServerTime() {
    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getUTCDate() + 1,
      hour: today.getUTCHours() - 15,
      minute: today.getUTCMinutes(),
      second: today.getUTCSeconds(),
    };
  }
}
