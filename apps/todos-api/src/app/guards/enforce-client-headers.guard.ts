import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

const ignoreMetadataName = 'EnforceClientHeadersGuard:ignore';

export const BypassClientHeadersGuard = (ignore = true) => SetMetadata(ignoreMetadataName, ignore);

@Injectable()
export class EnforceClientHeadersGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const ignore =
      this.reflector.get(ignoreMetadataName, context.getHandler()) ??
      this.reflector.get(ignoreMetadataName, context.getClass());

    if (ignore) {
      return true;
    }

    const req: Request = context.switchToHttp().getRequest();

    this.assertRequestHasHeader(req, 'x-api-client');
    this.assertRequestHasHeader(req, 'x-api-client-version');

    return true;
  }

  private assertRequestHasHeader(req: Request, header: string) {
    if (!req.headers[header]) {
      console.log(`Missing ${header} header`);
      throw new BadRequestException(`Missing ${header} header`);
    }
  }
}
