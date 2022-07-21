import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Render, Req, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { DeleteReviewDto, GetReviewListDto, PostReviewDto, PutReviewDto } from "./dto/review.dto";
import { ReviewService } from "./review.service";
import {HttpService} from "@nestjs/axios";
import { Observable } from "rxjs";
import axios, {AxiosResponse} from 'axios';

@Controller("review")
export class ReviewController{
    constructor(
        private reviewService: ReviewService,
        private configService: ConfigService,
        private httpService: HttpService
    ) {}

    @Get('/info/:ID')
    async getReview(@Param('ID') ID: number, @Req() req: Request, @Res() res: Response){
        if(isNaN(ID)) res.redirect('/');
        const reviewInfo = await this.reviewService.getReviewInfo(ID);
        res.send({...reviewInfo
        });
    }

    //정렬 기준 추가할 것들 여러개 있음 찾아봐야함.
    //1. 유저, 최근 / 2. 전체, 최근 / 3. 전체, 댓글 수 / 4. 전체, 조회 수 / 5. 전체, 즐겨찾기 수
    //6. 커뮤, 최근 / 7. 커뮤, 댓글 수 / 8. 커뮤, 조회 수 / 9. 커뮤, 즐겨찾기 수
    @Get()
    async getReviewList(@Req() req: Request, @Res() res: Response,
    @Query('limit') limit: number, @Query('offset') offset: number,
    @Query('where') where: string, @Query('query') query: string){
        const dto: GetReviewListDto = {
            limit, offset, where, query
        }
        const reviewList = await this.reviewService.getReviewList(dto);
        if(reviewList){
            res.send({
                reviewList: reviewList[0], 
                count: reviewList[1],
            });
        } else{
            res.send({
                reviewList: null,
                count: 0,
            })
        }
        
    }

    @Get('/book/info/:isbn')
    async getBookInfo(@Param('isbn') isbn: string, @Req() req: Request, @Res() res: Response){
        const bookInfo = await this.httpService.get(this.configService.get('BOOK_URL') + `?target=isbn&query=${isbn}`,{
            headers:{
                Authorization: this.configService.get('BOOK_HEADER'),
            }
        }).toPromise();
        res.send(bookInfo.data.documents[0]);
    }
    @Post()
    @UseGuards(JwtAuthGuard)
    async postReview(@Body() body: PostReviewDto, @Req() req: Request, @Res() res: Response){
        body.userNumber = req.user.number;
        await this.reviewService.createReview(body);
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    async putReview(@Body() body: PutReviewDto, @Req() req: Request, @Res() res: Response){
        body.userNumber = req.user.number;
        await this.reviewService.putReview(body);
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    async deleteReview(@Body() body: DeleteReviewDto, @Req() req: Request, @Res() res: Response){
        body.userNumber = req.user.number;
        await this.reviewService.deleteReview(body);
    }


    @Get('/page/info/:ID')
    @UseGuards(JwtAuthGuard)
    async getReviewPage(@Param('ID') ID: string, @Req() req: Request, @Res() res: Response){
        res.render('reviewInfo');
    }

    @Get('/page/register')
    @UseGuards(JwtAuthGuard)
    async getReviewRegisterPage(@Req() req: Request, @Res() res: Response){
        res.render('reviewRegister');
    }
}