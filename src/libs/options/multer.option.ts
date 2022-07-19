import { existsSync, mkdirSync } from 'fs';
import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { getFileDateString } from 'src/utils';

export const MulterOptions = (teamName: string) => ({
  fileFilter: (req, file, callback) => {
    if (file.mimetype.match('application/x-zip-compressed')) {
      callback(null, true);
    } else {
      callback(
        new BadRequestException(
          '지원하지 않는 파일 형식입니다. .zip 확장자를 사용해주세요.',
        ),
        false,
      );
    }
  },

  storage: diskStorage({
    destination: (req: Request, file, callback) => {
      try {
        const fileUploadStartDate: Date = new Date(2022, 6, 21, 22, 30, 0);
        const leftTime: number =
          fileUploadStartDate.getTime() - new Date().getTime();

        const uploadPath =
          leftTime > 0 ? `middle/${teamName}` : `final/${teamName}`;

        if (!existsSync(uploadPath)) {
          mkdirSync(uploadPath);
        }
        callback(null, uploadPath);
      } catch (error) {
        if (error instanceof HttpException) throw error;
        throw new InternalServerErrorException('일시적인 오류가 발생했어요');
      }
    },

    filename: (req, file, callback) => {
      callback(null, getFileDateString(file, req));
    },
  }),
});
