import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../constants';


@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector  //acessar METADATA
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler()) //acessar METADATA

    if( !validRoles ) return true //não existe role, qualquer um entra
    if(validRoles.length === 0) return true

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if(!user)
      throw new BadRequestException('User not found')

    for(const role of user.roles){
      if(validRoles.includes(role)){
        return true;
      }
    }

    throw new ForbiddenException(`User ${user.fullName} don't have a valid role...`)

    //se o guard retornar false, lançará um 403 Forbidden
    
    return true;
  }
}
