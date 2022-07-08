import { existsSync, mkdirSync } from 'fs';
import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';

export const multerOptions = {
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
    destination: (req, file, callback) => {
      const uploadPath = 'public';

      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }

      callback(null, uploadPath);
    },
  }),
};
