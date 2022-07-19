import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Inject,
  mixin,
  NestInterceptor,
  Optional,
  Type,
} from '@nestjs/common';
import { MulterModuleOptions } from '@nestjs/platform-express';
import { MULTER_MODULE_OPTIONS } from '@nestjs/platform-express/multer/files.constants';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { transformException } from '@nestjs/platform-express/multer/multer/multer.utils';
import { Request } from 'express';
import multer from 'multer';
import { Observable } from 'rxjs';
import { TeamsService } from 'src/teams/teams.service';

type MulterInstance = any;

export const CustomFileInterceptor = (
  fieldName: string,
  localOptions?: (teamName: string) => MulterOptions,
): Type<NestInterceptor> => {
  class MixinInterceptor implements NestInterceptor {
    protected multer: MulterInstance;
    private options: MulterModuleOptions = {};

    constructor(
      @Optional()
      @Inject(MULTER_MODULE_OPTIONS)
      options: MulterModuleOptions = {},

      private readonly teamsService: TeamsService,
    ) {
      this.options = options;
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler<any>,
    ): Promise<Observable<any>> {
      const ctx = context.switchToHttp();
      const request: Request = ctx.getRequest();
      const team = await this.teamsService.findTeamByMemberId(request.user.id);
      if (!team) throw new BadRequestException('소속된 팀이 없어요');

      const localMulter = (multer as any)({
        ...this.options,
        ...localOptions(team.name),
      });

      await new Promise<void>((resolve, reject) =>
        localMulter.single(fieldName)(
          request,
          ctx.getResponse(),
          (err: any) => {
            if (err) {
              const error = transformException(err);
              return reject(error);
            }
            resolve();
          },
        ),
      );

      return next.handle();
    }
  }

  const Interceptor = mixin(MixinInterceptor);
  return Interceptor;
};
