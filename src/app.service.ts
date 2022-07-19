import { Injectable } from '@nestjs/common';
import { getServerTime } from './utils';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  public async getServerTime() {
    return getServerTime();
  }
}
