import { existsSync, mkdirSync } from 'fs';
import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { getFileDateString } from 'src/utils';

export const MulterOptions = {
  fileFilter: (req, file, callback) => {
    if (file.mimetype.match('application/zip')) {
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
    destination: (req: any, file, callback) => {
      const fileUploadStartDate: Date = new Date(2022, 6, 21, 22, 30, 0);
      console.log(fileUploadStartDate);
      const leftTime: number =
        fileUploadStartDate.getTime() - new Date().getTime();
      const uploadPath =
        leftTime > 0
          ? `middle/${req.user.team.name}`
          : `final/${req.user.team.name}`;

      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      callback(null, uploadPath);
    },

    filename: (req, file, callback) => {
      callback(null, getFileDateString(file, req));
    },
  }),
};
