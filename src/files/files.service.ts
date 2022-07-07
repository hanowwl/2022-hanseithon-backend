import { Injectable } from '@nestjs/common';
import { createImageURL } from 'src/libs/options';

@Injectable()
export class FilesService {
  public uploadFile(file: Express.Multer.File) {
    const generatedFile = createImageURL(file);

    return generatedFile;
  }
}
