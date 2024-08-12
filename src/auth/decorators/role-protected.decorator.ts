import { SetMetadata } from '@nestjs/common';
import { META_ROLES } from '../constants';
import { ValidRoles } from '../enums';

export const RoleProtected = (...args: ValidRoles[]) => {
   return SetMetadata(META_ROLES, args);
}
