import { Controller, Get, Render, Req, Res, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { JWTInterceptor } from './interceptors/JWT.interceptor';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService
  ) {}
  @Get()
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
