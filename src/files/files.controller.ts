import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AccessTokenAuthGuard } from 'src/auth/guards';
import { CustomFileInterceptor } from 'src/libs/interceptors';
import { MulterOptions } from 'src/libs/options';
import { FilesService } from './files.service';

@UseGuards(AccessTokenAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(CustomFileInterceptor('file', MulterOptions))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.uploadFile(file);
  }
}
