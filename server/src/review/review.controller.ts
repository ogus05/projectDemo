import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { GetReviewListDto, PostReviewDto } from "./dto/review.dto";
import { ReviewService } from "./review.service";

@Controller("review")
export class ReviewController{
    constructor(
        private reviewService: ReviewService
    ) {}

    @Get("/:ID")
    async getReview(@Param('ID') id: number, @Req() req: Request, @Res() res: Response){
        try{
            const review = await this.reviewService.getReviewByID(id);
            res.send(review)
        } catch(e){
            throw new HttpException("리뷰를 찾을 수 없습니다.", HttpStatus.BAD_REQUEST);
        }
    }

    @Get()
    async getReviewList(@Body() body: GetReviewListDto, @Req() req: Request, @Res() res: Response){
        await this.reviewService.getReviewList(body);
        res.send();
    }

    @Post()
    async postReview(@Body() body: PostReviewDto, @Req() req: Request, @Res() res: Response){
        if(await this.reviewService.postReview(body)){
            res.send();
        } else{
            throw new HttpException("잘못된 리뷰", HttpStatus.BAD_REQUEST);
        }
    }
}