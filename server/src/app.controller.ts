import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  @Render('welcome')
  async getWelcomePage(){
  }

  @Get('/main')
  @Render('main')
  async getMainPage(){

  }

  @Get('/user')
  @Render('user')
  async getUserPage(){
  }

  @Get('/community')
  @Render('community')
  async getCommunityPage(){
    
  }

  @Get('/register')
  @Render('register')
  async getRegsterPage(){
    
  }
}
