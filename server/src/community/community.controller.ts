import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { CommunityService } from './community.service';
import { PostCommunityDto } from './dto/community.dto';

@Controller('community')
export class CommunityController {
    constructor(
        private readonly communityService: CommunityService,
        private readonly userService: UserService,
    ) {}

    @Get('/page/info')
    @Get('/page/info/:ID')
    @UseGuards(JwtAuthGuard)
    async getCommunityInfoPage(@Req() req: Request, @Res() res: Response){
        try{
            const user = await this.userService.getUserByID(req.user.userID);
            const userCommunityID = (user?.communityID) ? user?.communityID : 1;
            if(req.params.ID){
                res.render('communityInfo', {
                    communityID: req.params.ID,
                    userCommunityID
                });
            } else{
                res.render('communityInfo', {
                    communityID: userCommunityID,
                    userCommunityID: userCommunityID
                })
            }
        } catch(e){
            console.log("getCommunityInfoPage. " + e);
            res.render('communityInfo', {
                communityID: req.params.ID,
                userCommunityID: 1,
            });
        }
    }

    @Get('/page/search')
    @Render('communitySearch')
    @UseGuards(JwtAuthGuard)
    async getCommunitySearchPage(){
        
    }

    @Get('/page/register')
    @Render('communityRegister')
    @UseGuards(JwtAuthGuard)
    async getCommunityRegisterPage(){
        
    }

    @Get(':ID')
    async getCommunity(@Param('ID') id: number, @Req() req: Request, @Res() res: Response){
        try{
            const community = await this.communityService.getCommunityByID(isNaN(id) ? 1 : id);
            res.send(community);
        } catch(e){
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async postCommunity(@Body() body: PostCommunityDto, @Req() req: Request, @Res() res: Response){
        try{
            const user = await this.userService.getUserByID(req.user.userID);
            if(user.communityID !== 1) {
                throw new Error("가입한 커뮤니티가 존재합니다.");
            } else{
                body.leader = user;
            }
            if(await this.communityService.getCommunityByName(body.name)){
                throw new Error("존재하는 커뮤니티 이름입니다.");
            }
            await this.communityService.postCommunity(body);
            res.send("커뮤니티가 성공적으로 만들어졌습니다.");
        } catch(e){
            console.log(e);
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }
    }


}
