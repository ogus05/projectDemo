import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./comment.entity";
import { User } from "./user.entity";

@Entity()
export class LikeComment{
    @PrimaryGeneratedColumn()
    ID: number;

    @ManyToOne(() => Comment)
    @JoinColumn({
        name: "commentID"
    })
    comment: Comment
    @Column()
    commentID: number;

    @ManyToOne(() => User)
    @JoinColumn({
        name: "userNumber"
    })
    user: User;
    @Column()
    userNumber: number;
}