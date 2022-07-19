import path from 'path';
import {
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File, TeamMember, User } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class FilesService {
  private readonly FILE_UPLOAD_FINISH_DATE: Date = new Date(
    '2022-07-21 15:00:01',
  );

  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,
  ) {}

  public async uploadFile(targetFile: Express.Multer.File, user: User) {
    try {
      const leftTime =
        this.FILE_UPLOAD_FINISH_DATE.getTime() - new Date().getTime();
      if (leftTime <= 0)
        throw new ForbiddenException('최종 파일 업로드 기한이 마감됐어요');
      if (!targetFile) throw new NotFoundException('파일을 찾을 수 없어요');

      const teamMember = await this.teamMemberRepository.findOne({
        where: {
          user: {
            id: user.id,
          },
        },
        relations: ['team'],
      });
      if (!teamMember) throw new NotFoundException('팀 정보를 찾을 수 없어요');

      const file = this.fileRepository.create({
        name: targetFile.filename,
        path: path.resolve(__dirname, '../../', targetFile.path),
        size: targetFile.size,
        type: leftTime > 0 ? 'middle' : 'final',
        uploader: teamMember,
        team: teamMember.team,
      });

      this.fileRepository.save(file);

      return file;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('일시적인 오류가 발생했어요');
    }
  }
}
