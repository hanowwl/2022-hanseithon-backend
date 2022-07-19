import {
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class FilesService {
  private readonly FILE_UPLOAD_FINISH_DATE: Date = new Date(
    '2022-07-21 15:00:01',
  );

  public async uploadFile(file) {
    try {
      const leftTime =
        this.FILE_UPLOAD_FINISH_DATE.getTime() - new Date().getTime();
      if (leftTime <= 0)
        throw new ForbiddenException('최종 파일 업로드 기한이 마감됐어요');
      if (file) {
        return '파일을 성공적으로 보냈어요';
      } else {
        throw new NotFoundException('파일을 찾을 수 없어요');
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('일시적인 오류가 발생했어요');
    }
  }
}
