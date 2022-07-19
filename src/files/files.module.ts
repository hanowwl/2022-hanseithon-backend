import { Module } from '@nestjs/common';
import { TeamsModule } from 'src/teams/teams.module';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [TeamsModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
