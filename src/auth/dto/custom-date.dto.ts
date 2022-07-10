import { IsNumber } from 'class-validator';

export class CustomDate {
  @IsNumber()
  year: number;

  @IsNumber()
  month: number;

  @IsNumber()
  day: number;

  @IsNumber()
  hour: number;

  @IsNumber()
  minute: number;

  @IsNumber()
  second: number;
}
