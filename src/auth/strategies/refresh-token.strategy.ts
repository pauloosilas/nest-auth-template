import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "src/interfaces";
import { User } from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";

export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh-jwt'){

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService
    ){
        super({
           secretOrKey: configService.getOrThrow('REFRESH_SECRET'),
           jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                let token = null;
                if (request && request.cookies) {
                  token = request.cookies['Authentication']; 
            }
             return token;
           }])
        })
    }


   async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload

    const user = await this.userRepository.findOneBy({ id })

    if(!user)
        throw new UnauthorizedException('Invalid token')

    if(!user.isActive)
        throw new UnauthorizedException('User is inactive')

    //user é colocado no request
    return user
}
     
}