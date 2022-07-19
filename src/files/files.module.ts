import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File, TeamMember } from 'src/entities';
import { TeamsModule } from 'src/teams/teams.module';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [TeamsModule, TypeOrmModule.forFeature([File, TeamMember])],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
