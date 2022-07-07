import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenAuthGuard } from 'src/auth/guards';
import { multerOptions } from 'src/libs/options';
import { GetUser } from 'src/users/decorators';
import { FilesService } from './files.service';

@UseGuards(AccessTokenAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  public uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user,
  ) {
    const uploadedFile = this.filesService.uploadFile(file);

    return {
      files: uploadedFile,
      filename: file.originalname,
      user: user.name,
    };
  }
}
