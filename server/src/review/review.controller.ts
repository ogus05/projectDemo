import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { DeleteReviewDto, GetReviewListDto, PostReviewDto, PutReviewDto } from "./dto/review.dto";
import { ReviewService } from "./review.service";

@Controller("review")
export class ReviewController{
    constructor(
        private reviewService: ReviewService,
    ) {}

    //정렬 기준 추가할 것들 여러개 있음 찾아봐야함.
    //1. 유저, 최근 / 2. 전체, 최근 / 3. 전체, 댓글 수 / 4. 전체, 조회 수 / 5. 전체, 즐겨찾기 수
    //6. 커뮤, 최근 / 7. 커뮤, 댓글 수 / 8. 커뮤, 조회 수 / 9. 커뮤, 즐겨찾기 수
    @Get()
    async getReviewList(@Req() req: Request, @Res() res: Response){
        const dto: GetReviewListDto = {
            limit: parseInt(req.query["limit"] as string) || 10,
            offset: parseInt(req.query["offset"] as string) || 0,
            orderBy: (["regDate", "comment", "visit", "bookmark"]
            .includes(req.query.orderBy as string))
             ? req.query.orderBy as string : "regDate",
            where: (["all", "community", "user"]
            .includes(req.query.where as string))
             ? req.query.where as string : "all"
        }
        console.log(dto);
        res.send();
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async postReview(@Body() body: PostReviewDto, @Req() req: Request, @Res() res: Response){
        body.userID = req.user.userID;
        await this.reviewService.postReview(body);
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    async putReview(@Body() body: PutReviewDto, @Req() req: Request, @Res() res: Response){
        body.userID = req.user.userID;
        await this.reviewService.putReview(body);
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    async deleteReview(@Body() body: DeleteReviewDto, @Req() req: Request, @Res() res: Response){
        body.userID = req.user.userID;
        await this.reviewService.deleteReview(body);
    }
}