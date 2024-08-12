import { applyDecorators, UseGuards } from "@nestjs/common";
import { ValidRoles } from "../enums";
import { RoleProtected } from "./role-protected.decorator";
import { AuthGuard } from "@nestjs/passport";
import { UserRoleGuard } from "../guards";

export function Auth(...roles: ValidRoles[]){
    return applyDecorators(
        RoleProtected(...roles), //add roles
        UseGuards(AuthGuard(), UserRoleGuard) //add jwt strategy //valida role
    )
}