import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Redirect, Render, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles, UserRole } from 'src/auth/roles/roles';
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
    
    @Get('info/:ID')
    @UseGuards(JwtAuthGuard)
    async getCommunityInfo(@Param('ID') id: number, @Req() req: Request, @Res() res: Response){
        const community = await this.communityService.getCommunityInfo(id);
        if(!community) res.redirect("/community/page/search");
        else res.send(community);
    }

    @Get('search')
    @UseGuards(JwtAuthGuard)
    async getCommunitySearch(@Query('offset') offset: number, @Query('limit') limit: number, @Req() req: Request, @Res() res: Response){
        const communityList = await this.communityService.getCommunitySearchList(offset, limit);
        if(communityList){
            res.send({
                communityList: communityList[0],
                count: communityList[1]
            })
        } else{
            res.send({
                communityList: null,
                count: 0,
            })
        }
    }

    @Get('user/:ID')
    @UseGuards(JwtAuthGuard)
    async getCommunityUser(@Param('ID') ID, @Req() req: Request, @Res() res: Response){
        const userList = await this.communityService.getCommunityUserList(ID);
        res.send({
            userList: userList[0],
            count: userList[1],
        });
    }

    @Get('edit')
    @UseGuards(JwtAuthGuard, LeaderGuard)
    async getCommunityEdit(@Req() req: Request, @Res() res: Response){
        const data = await this.communityService.getCommunityEdit(req.user.community.ID);
        res.send(data);
    }

    @Get('apply')
    @UseGuards(JwtAuthGuard, LeaderGuard)
    async getApplyUser(@Req() req: Request, @Res() res: Response){
        const users = await this.communityService.getCommunityApplyUserList(req.user.community.ID);
        res.send(users);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(1)
    async postCommunity(@Body() body: PostCommunityDto, @Req() req: Request, @Res() res: Response){
        body.leaderNumber = req.user.number;
        await this.communityService.createCommunity(body);
        res.send();
    }
    
    @Post('apply/:ID')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(1)
    async postApply(@Param('ID') ID: number, @Req() req: Request, @Res() res: Response){
        const dto: ApplyCommunityDto = {
            userNumber: req.user.number,
            ID,
        }
        await this.communityService.createApplyCommunity(dto);
        res.send();
    }

    @Post('user')
    @UseGuards(JwtAuthGuard, LeaderGuard)
    async postCommunityUser(@Body('userNumber') userNumber: number, @Req() req: Request, @Res() res: Response){
        await this.communityService.updateCommunityUser(userNumber, req.user.community.ID);
        res.send();
    }
    
    @Put()
    @UseGuards(JwtAuthGuard, LeaderGuard)
    async putCommunity(@Body() body: PutCommunityDto, @Req() req: Request, @Res() res: Response){
        body.ID = req.user.community.ID;
        await this.communityService.updateCommunity(body);
        res.send();
    }
    
    @Put('leader')
    @UseGuards(JwtAuthGuard, LeaderGuard)
    async putCommunityLeader(@Body('userNumber') delegatedUserNumber: number, @Req() req: Request, @Res() res: Response){
        await this.communityService.updateCommunityLeader(req.user.community.ID, delegatedUserNumber);
        res.send();
    }

    @Put('image')
    @UseGuards(JwtAuthGuard, LeaderGuard)
    @UseInterceptors(FileInterceptor('image'))
    async putCommunityImage(@UploadedFile() image: Express.Multer.File, @Req() req: Request, @Res() res: Response){
        res.send();
    }
    
    
    @Delete()
    @UseGuards(JwtAuthGuard, LeaderGuard)
    async deleteComunity(@Req() req: Request, @Res() res: Response){
        await this.communityService.deleteCommunity(req.user.community.ID);
        res.send();
    }

    @Delete('user')
    @UseGuards(JwtAuthGuard)
    async deleteCommunityUser(@Req() req: Request, @Res() res: Response){
        await this.communityService.updateCommunityUser(req.user.number);
        res.send();
    }

    @Get('/page/info')
    @UseGuards(JwtAuthGuard)
    async redirectCommunityInfoPage(@Req() req: Request, @Res() res: Response){
        const user = await this.userService.getUserInfo(req.user.number);
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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(1)
    async getCommunityRegisterPage(@Req() req: Request, @Res() res: Response){
        const user = await this.userService.getUserInfo(req.user.number);
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
