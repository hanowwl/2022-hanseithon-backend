import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AccessTokenAuthGuard } from 'src/auth/guards';
import { User } from 'src/entities';
import { CustomFileInterceptor } from 'src/libs/interceptors';
import { MulterOptions } from 'src/libs/options';
import { GetUser } from 'src/users/decorators';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseGuards(AccessTokenAuthGuard)
  @UseInterceptors(CustomFileInterceptor('file', MulterOptions))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    return this.filesService.uploadFile(file, user);
  }

  @Get('download')
  async getFileList(@Headers() header, @Query('p@ssword') password: string) {
    if (password !== 'kiss_n_punch')
      throw new BadRequestException('잘못된 접근이에요');

    return this.filesService.getFileList(header.host);
  }

  @Get('download/:team/:type/:fileName')
  async downloadFile(
    @Res() res,
    @Param('team') team: string,
    @Param('type') type: 'middle' | 'final',
    @Param('fileName') fileName: string,
  ) {
    return this.filesService.downloadFile(res, team, type, fileName);
  }
}
