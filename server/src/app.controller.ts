import { All, Controller, Get, Render, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { RolesGuard } from './auth/guard/roles.guard';
import { Roles } from './auth/roles/roles';
import { JWTInterceptor } from './interceptors/JWT.interceptor';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}
  @All()
  @UseInterceptors(JWTInterceptor)
  async getWelcomePage(@Req() req: Request, @Res() res: Response){
    if(req.user){
      res.render('main');
    } else{
      res.render('welcome');
    }
  }




  @Get('/test')
  @Render('test')
  async getTestPage(){}
  
}
