import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { LikeComment } from 'src/entities/likeComment.entity';
import { Review } from 'src/entities/review.entity';
import { Repository } from 'typeorm';
import { PostLikeCommentDto, PostCommentDto, PutCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        @InjectRepository(LikeComment)
        private readonly likeCommentRepository: Repository<LikeComment>
    ){}

    async getUserCommentList(commentUserNumber: number, requestUserNumber: number, limit: number, offset: number){
        const comments = await this.commentRepository.createQueryBuilder('comment')
        .select(['comment.ID', 'comment.regDate', 'comment.text', 'review.ID', 'user.number'])
        .leftJoin('comment.user', 'user')
        .leftJoin('comment.review', 'review')
        .where('user.number = :keyUserNumber', {keyUserNumber: commentUserNumber})
        .limit(limit)
        .offset(offset)
        .getManyAndCount();
        if(comments[0].length !== 0){
            comments[0].forEach((v, i) => {
                if(!v.isOpen && v.user.number !== requestUserNumber){
                    v.text = '비공개 댓글입니다.';
                }
            })
        }
        return comments;
    }


    async getReviewCommentList(reviewID: number, userNumber: number){
        const comments = await this.commentRepository.createQueryBuilder('comment')
        .select(['comment.ID', 'comment.text', 'user.number', 'user.nickname',
     'comment.isOpen', 'comment.regDate'])
        .leftJoin('comment.user', 'user')
        .leftJoin('comment.review', 'review')
        .where('review.ID = :keyReviewID', {keyReviewID: reviewID})
        .getManyAndCount();
        if(comments[0].length !== 0){
            comments[0].forEach((v, i) => {
                if(!v.isOpen && v.user.number !== userNumber){
                    v.text = '비공개 댓글입니다.';
                }
            })
        }
        return comments;
    }

    async postComment(dto: PostCommentDto){
        dto.text 
        const comment = this.commentRepository.create(dto);
        await this.commentRepository.insert(comment);
    }

    async putComment(dto: PutCommentDto){
        const review = await this.commentRepository.update({
            ID: dto.commentID,
            userNumber: dto.userNumber,
        }, {
            text: dto.text,
        });
        if(review.affected !== 1){
            throw new BadRequestException("다른 유저의 댓글을 수정할 수 없습니다.");
        }
    }

    async deleteComment(commentID: number, userNumber: number){
        const comment = await this.commentRepository.createQueryBuilder('comment')
        .select(['comment.ID', 'user.number'])
        .leftJoin('comment.user', 'user')
        .where('comment.ID = :keyCommentID', {keyCommentID: commentID})
        .getOne();
        if(!comment){
            throw new BadRequestException("존재하지 않는 댓글입니다.");
        }
        if(comment.user.number != userNumber){
            throw new BadRequestException("다른 유저의 댓글을 삭제할 수 없습니다.");
        }
        await this.commentRepository.delete(comment);
    }

    async createOrDeleteLikeComment(dto: PostLikeCommentDto){
        const deleteComment = await this.likeCommentRepository.delete({
            commentID: dto.commentID,
            userNumber: dto.userNumber,
        })
        if(deleteComment.affected === 0){
            await this.likeCommentRepository.insert({
                commentID: dto.commentID,
                userNumber: dto.userNumber,
            })
        }
    }
}
