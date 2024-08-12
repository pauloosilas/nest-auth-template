import { Controller, Get, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Auth, GetUser, RoleProtected } from './decorators';
import { User } from './entities/user.entity';
import { ValidRoles } from './enums';
import { Request, Response } from 'express';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto,
  @Res({passthrough: true}) response: Response  
) {
    return this.authService.register(createUserDto, response);
  }

  @Post('login')
  loginUser(@Body() loginUserDto:LoginUserDto,
    @Res({passthrough: true}) response: Response){
    return this.authService.login(loginUserDto, response)
  }

  @Get('priv2')
  @UseGuards( AuthGuard('jwt') )
  //testPrivateRoute(@Req() request: Request){
    testPrivateRoute(@GetUser() user: User){
    return{
      ok: true,
      user: user
    }
  }

  @Get('priv')
  @Auth(ValidRoles.admin)
  privRoute(
    @GetUser() user: User
  ){
    
    return {
      ok: true,
      user
    }
  }

  @Post('refresh')
  @UseGuards(AuthGuard('refresh-jwt'))
  refresh(@Req() request: Request){
    return {
      user: request.user
    }
  }

}
