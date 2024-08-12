import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetUser = createParamDecorator(
    (data, ctx: ExecutionContext) =>{
       
        const req = ctx.switchToHttp().getRequest(); //ExecutionContext tem acesso ao request
        const user = req.user

        if(!user)
          throw new InternalServerErrorException('User not found')

        return user
    }
)