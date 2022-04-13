import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { LikeComment } from 'src/entities/likeComment.entity';
import { Review } from 'src/entities/review.entity';
import { Repository } from 'typeorm';
import { LikeCommentDto, DeleteCommentDto, PostCommentDto, PutCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        @InjectRepository(LikeComment)
        private readonly likeCommentRepository: Repository<LikeComment>
    ){}

    async createComment(dto: PostCommentDto){
        const review = await this.reviewRepository.createQueryBuilder()
        .where("ID = :keyReviewID", {keyReviewID: dto.reviewID})
        .getOne();
        if(!review){
            throw new BadRequestException("존재하지 않는 리뷰입니다.");
        }
        const comment = this.commentRepository.create(dto);
        await this.commentRepository.insert(comment);
    }

    async putComment(dto: PutCommentDto){
        const review = await this.commentRepository.update({
            ID: dto.commentID,
            userID: dto.userID,
        }, {
            text: dto.text,
        });
        if(review.affected !== 1){
            throw new BadRequestException("다른 유저의 댓글을 수정할 수 없습니다.");
        }
    }

    async deleteComment(dto: DeleteCommentDto){
        const review = await this.commentRepository.delete({
            ID: dto.commentID,
            userID: dto.userID,
        });
        if(review.affected !== 1){
            throw new BadRequestException("다른 유저의 댓글을 삭제할 수 없습니다.");
        }
    }

    async postLikeComment(dto: LikeCommentDto){
        await this.likeCommentRepository.insert({
            userID: dto.userID,
            commentID: dto.commentID
        });
    }

    async deleteLikeComment(dto: LikeCommentDto){
        const likeComment = await this.likeCommentRepository.delete({
            userID: dto.userID,
            commentID: dto.commentID,
        });
        if(likeComment.affected !== 1){
            throw new BadRequestException("잘못된 요청입니다.");
        }
    }
}
