import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms'
import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from 'src/interfaces/jwt.payload.interface';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtServices: JwtService
){}

  async register(createUserDto: CreateUserDto, response: Response) {
    const { password, ...userData } = createUserDto;

    try {
     const user = this.userRepository.create( {      
        ...userData,
        password: bcrypt.hashSync( password, 10)   
     } );

     await this.userRepository.save(user)
     delete user.password

     response.cookie('Authentication', await this.getRefreshToken({id: user.id}), {
      secure: true,
      httpOnly: true,
      expires: this.generateExpirationToken()
    });

     return {
      ...user,
      token: await this.getJwtToken({ id: user.id })
     };

    } catch (error) {
      this.handleDbErrors(error)
    }
  }

  async login(loginUserDto: LoginUserDto, response: Response){
    const { password } = loginUserDto
    const email = loginUserDto.email.toLowerCase().trim()
   
    const user = await this.userRepository.findOne({
      where: { email },
      select:{ id: true, email: true, password: true}
    });

    if(!user)
        throw new UnauthorizedException('invalid credentials...')

    if( !bcrypt.compareSync(password, user.password) )
        throw new UnauthorizedException('invalid credentials...')

    delete user.password
    
    response.cookie('Authentication', await this.getRefreshToken({id: user.id}), {
      secure: true,
      httpOnly: true,
      expires: this.generateExpirationToken()
    })

    return {
      ...user,
      token: await this.getJwtToken({ id: user.id })
    };
  }

  private async getJwtToken( payload: JwtPayload){
    return await this.jwtServices.signAsync( payload )
  }

  private async getRefreshToken(payload: JwtPayload){
    return await this.jwtServices.signAsync(payload, {
      secret: this.configService.getOrThrow('REFRESH_SECRET'),
      expiresIn: 60 * 60 *24 * 7
    })
  }

  private generateExpirationToken(){
    const expires = new Date()
    expires.setMilliseconds(
      expires.getMilliseconds() + ms(this.configService.getOrThrow<string>('JWT_EXPIRATION'))
  );
  
    return expires
  }

  private handleDbErrors(error: any): never{
    if(error.code === '23505')
      throw new BadRequestException(error.detail)

    console.log(error)

    throw new InternalServerErrorException('Error, please contact the support')
  }
}
