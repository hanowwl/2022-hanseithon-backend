import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessTokenStrategy } from 'src/auth/strategies';
import { File, TeamMember, User } from 'src/entities';
import { TeamsModule } from 'src/teams/teams.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, TeamMember, File]),
    forwardRef(() => TeamsModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, AccessTokenStrategy],
  exports: [UsersService],
})
export class UsersModule {}
