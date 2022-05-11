import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Redirect, Render, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { CommunityService } from './community.service';
import { ApplyCommunityDto, GetCommunityListDto, PostCommunityDto, PutCommunityDto } from './dto/community.dto';
import { LeaderGuard } from './leader.guard';

@Controller('community')
export class CommunityController {
    constructor(
        private readonly communityService: CommunityService,
        private readonly userService: UserService,
    ) {}
    
    @Get('leader')
    @UseGuards(JwtAuthGuard, LeaderGuard)
    async getLeader(@Req() req: Request, @Res() res: Response){
        res.send({communityID: req.user.community.ID});
    }
    
    @Post()
    @UseGuards(JwtAuthGuard)
    async postCommunity(@Body() body: PostCommunityDto, @Req() req: Request, @Res() res: Response){
        body.leaderNumber = req.user.number;
        await this.communityService.createCommunity(body);
        res.send();
    }

    @Get('apply')
    @UseGuards(JwtAuthGuard, LeaderGuard)
    async getApplyUser(@Req() req: Request, @Res() res: Response){
        const users = await this.communityService.getCommunityApplyUserList(req.user.community.ID);
        res.send(users);
    }
    
    @Post('apply')
    @UseGuards(JwtAuthGuard)
    async postApply(@Body() body: ApplyCommunityDto, @Req() req: Request, @Res() res: Response){
        body.number = req.user.number;
        await this.communityService.applyCommunity(body);
        res.send();
    }

    @Delete('apply')
    @UseGuards(JwtAuthGuard, LeaderGuard)
    async deleteApply(@Body('number') number: number, @Req() req: Request, @Res() res: Response){
        await this.communityService.deleteCommunityApply(req.user.community.ID, number);
        res.send();
    }
    
    @Post('user')
    @UseGuards(JwtAuthGuard, LeaderGuard)
    async postCommunityUser(@Body() body: {number: number}, @Req() req: Request, @Res() res: Response){
        const communityUser = await this.userService.getUserByNumber(body.number, false);
        if(communityUser.communityID !== 1){
            throw new BadRequestException("해당 유저가 다른 커뮤니티에 가입되어 있습니다.");
        }
        await this.communityService.updateCommunityUser(body.number, req.user.community.ID);
        res.send();
    }
    
    @Put()
    @UseGuards(JwtAuthGuard, LeaderGuard)
    async putCommunity(@Body() body: PutCommunityDto, @Req() req: Request, @Res() res: Response){
        body.ID = req.user.community.ID;
        await this.communityService.updateCommunity(body);
        res.send();
    }
    
    @Put('image')
    @UseGuards(JwtAuthGuard, LeaderGuard)
    @UseInterceptors(FileInterceptor('image'))
    async putCommunityImage(@UploadedFile() image: Express.Multer.File, @Req() req: Request, @Res() res: Response){
        await this.communityService.updateCommunityImage(req.user.community.ID, image.filename);
        res.send();
    }
    
    @Put('leader')
    @UseGuards(JwtAuthGuard, LeaderGuard)
    async putCommunityLeader(@Body('userNumber') delegatedUserNumber: number, @Req() req: Request, @Res() res: Response){
        await this.communityService.updateCommunityLeader(req.user.community.ID, delegatedUserNumber);
        res.send();
    }
    
    
    @Delete()
    @UseGuards(JwtAuthGuard, LeaderGuard)
    async deleteComunity(@Req() req: Request, @Res() res: Response){
        await this.communityService.deleteCommunity(req.user.community.ID);
        res.send();
    }
    
    @Delete('user')
    @UseGuards(JwtAuthGuard, LeaderGuard)
    async deleteCommunityUser(@Body("userNumber") deleteUserNumber: number, @Req() req: Request, @Res() res: Response){
        const communityUser = await this.userService.getUserByNumber(deleteUserNumber, false);
        if(communityUser.communityID !== req.user.community.ID){
            throw new BadRequestException("다른 커뮤니티의 유저를 제명시킬 수 없습니다.");
        }
        await this.communityService.updateCommunityUser(deleteUserNumber);
        res.send();
    }
    
    @Delete('user2')
    @UseGuards(JwtAuthGuard)
    async deleteCommunityUser2(@Req() req: Request, @Res() res: Response){
        const user = await this.userService.getUserByNumber(req.user.number, false);
        if(user.communityID === 1){
            throw new BadRequestException("커뮤니티에 가입되어있지 않습니다.");
        } else{
            await this.communityService.updateCommunityUser(user.number);
            res.send();
        }
    }
    
    @Get('info/:ID')
    @UseGuards(JwtAuthGuard)
    async getCommunityInfo(@Param('ID') id: number, @Req() req: Request, @Res() res: Response){
        const community = await this.communityService.getCommunityByID(id, 1);
        if(!community) res.redirect("/community/page/search");
        else res.send(community);
    }

    @Get('edit')
    @UseGuards(JwtAuthGuard, LeaderGuard)
    async getCommunityEdit(@Req() req: Request, @Res() res: Response){
        const community = await this.communityService.getCommunityByID(req.user.community.ID, 2);
        res.send(community);
    }

    @Get('/page/info')
    @UseGuards(JwtAuthGuard)
    async redirectCommunityInfoPage(@Req() req: Request, @Res() res: Response){
        const user = await this.userService.getUserByNumber(req.user.number, false);
        if(user.communityID === 1){
            res.redirect('/community/page/search');
        } else{
            res.redirect(`/community/page/info/${user.communityID}`);
        }
    }

    @Get('/page/info/:ID')
    @UseGuards(JwtAuthGuard)
    async getCommunityInfoPage(@Param("ID") ID: number,@Req() req: Request, @Res() res: Response){
        try{
            if(ID < 1 || isNaN(ID)){
                res.redirect("/")
            } else{
                res.render('communityInfo', {
                    communityID: ID,
                })
            }
        } catch(e){
            console.log("getCommunityInfoPage. " + e);
            res.redirect("/");
        }
    }

    @Get('/page/search')
    @Render('communitySearch')
    @UseGuards(JwtAuthGuard)
    async getCommunitySearchPage(){
        
    }

    @Get('/page/register')
    @UseGuards(JwtAuthGuard)
    async getCommunityRegisterPage(@Req() req: Request, @Res() res: Response){
        const user= await this.userService.getUserByNumber(req.user.number, false);
        if(user.communityID !== 1){
            res.redirect("/");
        } else{
            res.render('communityRegister');
        }
    }

    @Get('/page/edit')
    @Render('communityEdit')
    @UseGuards(JwtAuthGuard, LeaderGuard)
    async getCommunityEditPage(){
    }
}
