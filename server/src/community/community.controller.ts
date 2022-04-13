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

    @Get('/page/info')
    @UseGuards(JwtAuthGuard)
    async redirectCommunityInfoPage(@Req() req: Request, @Res() res: Response){
        res.redirect('/community/page/info/0');
    }

    @Get('/page/info/:ID')
    @UseGuards(JwtAuthGuard)
    async getCommunityInfoPage(@Req() req: Request, @Res() res: Response){
        try{
            if(req.params.ID === "0" || isNaN(parseInt(req.params.ID))){
                const user = await this.userService.getUserByID(req.user.userID, false, false);
                res.render('communityInfo', {
                    communityID: user.communityID,
                });
            } else{
                res.render('communityInfo', {
                    communityID: req.params.ID,
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
    @Render('communityRegister')
    @UseGuards(JwtAuthGuard)
    async getCommunityRegisterPage(){
        
    }

    @Get('/page/edit')
    @Render('communityEdit')
    @UseGuards(JwtAuthGuard)
    async getCommunityEditPage(){
    }
    //TODO
    @Get('list')
    @UseGuards(JwtAuthGuard)
    async getCommunityList(@Query("offset") offset: number, @Query("limit") limit: number, 
            @Query("orderby") orderBy: string, @Req() req: Request, @Res() res: Response){
        const dto: GetCommunityListDto = {offset, limit, orderBy};
    }

    @Get('leader')
    @UseGuards(JwtAuthGuard, LeaderGuard)
    async getLeader(@Req() req: Request, @Res() res: Response){
        res.send({communityID: req.user.community.ID});
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async postCommunity(@Body() body: PostCommunityDto, @Req() req: Request, @Res() res: Response){
        body.leaderID = req.user.userID;
        await this.communityService.createCommunity(body);
        res.send();
    }

    @Post('apply')
    @UseGuards(JwtAuthGuard)
    async applyCommunity(@Body() body: ApplyCommunityDto, @Req() req: Request, @Res() res: Response){
        body.userID = req.user.userID;
        await this.communityService.applyCommunity(body);
        res.send();
    }

    @Post('user')
    @UseGuards(JwtAuthGuard, LeaderGuard)
    async postCommunityUser(@Body() body: string, @Req() req: Request, @Res() res: Response){
        const communityUser = await this.userService.getUserByID(body, false, false);
        if(communityUser.communityID !== 1){
            throw new BadRequestException("해당 유저가 다른 커뮤니티에 가입되어 있습니다.");
        }
        await this.communityService.updateCommunityUser(communityUser.ID, req.user.community.ID);
        res.send();
    }

    @Put()
    @UseGuards(JwtAuthGuard, LeaderGuard)
    async putCommunity(@Body() body: PutCommunityDto, @Req() req: Request, @Res() res: Response){
        body.ID = req.user.community.ID;
        console.log(body);
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
    async putCommunityLeader(@Body('userID') delegatedUser: string, @Req() req: Request, @Res() res: Response){
        await this.communityService.updateCommunityLeader(req.user.community.ID, delegatedUser);
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
    async deleteCommunityUser(@Body() body, @Req() req: Request, @Res() res: Response){
        const communityUser = await this.userService.getUserByID(body.userID, false, false);
        if(communityUser.communityID !== req.user.community.ID){
            throw new BadRequestException("다른 커뮤니티의 유저를 제명시킬 수 없습니다.");
        }
        await this.communityService.updateCommunityUser(body.userID);
        res.send();
    }

    @Delete('user2')
    @UseGuards(JwtAuthGuard)
    async deleteCommunityUser2(@Req() req: Request, @Res() res: Response){
        const user = await this.userService.getUserByID(req.user.userID, false, false);
        if(user.communityID === 1){
            throw new BadRequestException("커뮤니티에 가입되어있지 않습니다.");
        } else{
            await this.communityService.updateCommunityUser(user.ID);
            res.send();
        }
    }

    @Get(':ID')
    @UseGuards(JwtAuthGuard)
    async getCommunity(@Param('ID') id: number, @Req() req: Request, @Res() res: Response){
        const community = await this.communityService.getCommunityByID(id);
        if(!community) throw new BadRequestException("존재하지 않는 커뮤니티입니다."); 
        res.send(community);
    }
}
