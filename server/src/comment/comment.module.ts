import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { LikeComment } from 'src/entities/likeComment.entity';
import { Review } from 'src/entities/review.entity';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Review, LikeComment])
  ],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule {}
