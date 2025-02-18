import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { Roles } from "./roles.decorator";

function matchRoles(roles: string[], userRoles: string[]): boolean {
  return roles.some((role) => userRoles.includes(role));
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return matchRoles(roles, user.roles);
  }
}
