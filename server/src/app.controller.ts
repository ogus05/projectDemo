import { Controller, Get, Render, Req, Res, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { JWTInterceptor } from './interceptors/JWT.interceptor';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  @UseInterceptors(JWTInterceptor)
  async getWelcomePage(@Req() req: Request, @Res() res: Response){
    if(req.user){
      res.render('main');
    } else{
      res.render('welcome');
    }
  }
  
}
