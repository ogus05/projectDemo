import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./comment.entity";
import { User } from "./user.entity";

@Entity()
export class LikeComment{
    @PrimaryGeneratedColumn()
    ID: number;
    @ManyToOne(() => Comment)
    @JoinColumn()
    comment: Comment;
    @ManyToOne(() => User)
    @JoinColumn()
    user: User;
}