import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/roles/roles';
import { CommentService } from './comment.service';
import { PostLikeCommentDto, PostCommentDto, PutCommentDto } from './dto/comment.dto';

@Controller('comment')
export class CommentController {
    constructor(
        private commentService: CommentService,
    ) {}

    @Get('user/:Number')
    @UseGuards(JwtAuthGuard)
    async getUserCommentList(@Param('Number') number: number,
    @Query('limit') limit: number, @Query('offset') offset: number,  @Req() req: Request, @Res() res: Response){
        const commentList = await this.commentService.getUserCommentList(number, req.user.number, limit, offset);
        res.send({
            commentList: commentList[0],
            count: commentList[1],
        });
    }

    @Get('review/:ID')
    @UseGuards(JwtAuthGuard)
    async getReviewCommentList(@Param('ID') ID: number, @Req() req: Request, @Res() res: Response){
        const commentList = await this.commentService.getReviewCommentList(ID, req.user.number);
        res.send({
            commentList: commentList[0],
            count: commentList[1],
        });
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(1)
    async postComment(@Body() body: PostCommentDto, @Req() req: Request, @Res() res: Response){
        body.userNumber = req.user.number;
        await this.commentService.postComment(body);
        res.send()
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    async putComment(body: PutCommentDto, @Req() req: Request, @Res() res: Response){
        body.userNumber = req.user.number;
        await this.commentService.putComment(body);
        res.send();
    }

    @Delete(':ID')
    @UseGuards(JwtAuthGuard)    
    async deleteComment(@Param('ID') ID: number, @Req() req: Request, @Res() res: Response){
        await this.commentService.deleteComment(ID, req.user.number);
        res.send();
    }
    
    @Post('like/:ID')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(1)
    async postCommentLike(@Param('ID') commentID, @Req() req: Request, @Res() res: Response){
        const dto: PostLikeCommentDto= {
            commentID, userNumber: req.user.number
        }
        await this.commentService.createOrDeleteLikeComment(dto);
        res.send()
    }
}
