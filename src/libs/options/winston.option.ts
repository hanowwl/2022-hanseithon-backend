import { existsSync, mkdirSync } from 'fs';
import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as aily from 'winston-daily-rotate-file';

const logDir = 'logs';

if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + `/${level}`,
    filename: `%DATE%.${level}.log`,
    maxFiles: 30,
    zippedArchive: true,
  };
};

export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'http' : 'silly',
      format:
        process.env.NODE_ENV === 'production'
          ? winston.format.simple()
          : winston.format.combine(
              winston.format.timestamp(),
              utilities.format.nestLike('한세톤', {
                prettyPrint: true,
              }),
            ),
    }),

    new aily(dailyOptions('info')),
    new aily(dailyOptions('warn')),
    new aily(dailyOptions('error')),
  ],
});
