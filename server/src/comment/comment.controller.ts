import { Controller, Delete, Get, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CommentService } from './comment.service';
import { LikeCommentDto, DeleteCommentDto, PostCommentDto, PutCommentDto } from './dto/comment.dto';

@Controller('comment')
export class CommentController {
    constructor(
        private commentService: CommentService,
    ) {}

    @Get()
    async getComment(){}

    @Post()
    @UseGuards(JwtAuthGuard)
    async postComment(body: PostCommentDto, @Req() req: Request, @Res() res: Response){
        body.userNumber = req.user.number;
        await this.commentService.createComment(body);
        res.send()
    }

    @Post('like')
    @UseGuards(JwtAuthGuard)
    async postCommentLike(body: LikeCommentDto, @Req() req: Request, @Res() res: Response){
        body.userNumber = req.user.number;
        await this.commentService.postLikeComment(body);
        res.send()
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    async putComment(body: PutCommentDto, @Req() req: Request, @Res() res: Response){
        body.userNumber = req.user.number;
        await this.commentService.putComment(body);
        res.send();
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    async deleteComment(body: DeleteCommentDto, @Req() req: Request, @Res() res: Response){
        body.userNumber = req.user.number;
        await this.commentService.deleteComment(body);
        res.send();
    }

    @Delete('like')
    @UseGuards(JwtAuthGuard)
    async deleteCommentLike(body: LikeCommentDto, @Req() req: Request, @Res() res: Response){
        body.userNumber = req.user.number;
        await this.commentService.deleteLikeComment(body);
    }
}
