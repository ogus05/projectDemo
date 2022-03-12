import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { GetReviewListDto,  PostReviewDto } from "./dto/review.dto";
import { ReviewService } from "./review.service";

@Controller("review")
export class ReviewController{
    constructor(
        private reviewService: ReviewService,
    ) {}

    @Get(":ID")
    async getReview(@Param('ID') ID: number, @Req() req: Request, @Res() res: Response){
        const review = await this.reviewService.getReviewByID(ID);
    }


    //정렬 기준 추가할 것들 여러개 있음 찾아봐야함.
    //1. 유저, 최근 / 2. 전체, 최근 / 3. 전체, 댓글 수 / 4. 전체, 조회 수 / 5. 전체, 즐겨찾기 수
    //6. 커뮤, 최근 / 7. 커뮤, 댓글 수 / 8. 커뮤, 조회 수 / 9. 커뮤, 즐겨찾기 수
    @Get()
    async getReviewList(@Req() req: Request, @Res() res: Response){
        await this.reviewService.getReviewList(dto);
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