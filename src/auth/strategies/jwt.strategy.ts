import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwtPayload } from "src/interfaces";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy, 'jwt' ){
   constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService
   ){
    super({
        secretOrKey: configService.getOrThrow('JWT_SECRET'),
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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