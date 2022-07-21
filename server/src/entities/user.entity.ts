import { Column, CreateDateColumn, Entity, Generated, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./comment.entity";
import { Community } from "./community.entity";
import { ConfirmMail } from "./confirmMail.entity";
import { LikeComment } from "./likeComment.entity";
import { Review } from "./review.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    number: number;

    @Column({
        unique: true
    })
    ID: string;

    @Column({
        nullable: false,
    })
    password: string;

    @Column({
        nullable: false,
    })
    nickname: string;

    @CreateDateColumn({
        type: "timestamp",
        nullable: false,
    })
    regDate: Date;

    @Column({
        default: null,
        nullable: true,
    })
    refreshJWT: string;

    @Column({
        nullable: true,
        type: "text",
    })
    message: string;

    @Column({
        nullable: true,
        default: null,
    })
    phone: string;

    @Column({
        type: "timestamp",
        nullable: true,
    })
    birth: Date;

    @Column({
        type: "tinyint",
        nullable: true,
    })
    male: boolean;
    
    @Column({
        default: false,
        type: "tinyint"
    })
    acceptMail: boolean;

    @ManyToOne(() => Community, community => community.user, {
        cascade: true,
    })
    @JoinColumn({
        name: "communityID"
    })
    community: Community;
    @Column({
        default: 1
    })
    communityID: number;


    @Column({
        type: "tinyint",
        default: 0,
    })
    role: number;

    @OneToMany(() => Review, review => review.user)
    review: Review;

    @OneToMany(() => Comment, comment => comment.user)
    comment: Comment;

    @OneToMany(() => LikeComment, likeComment => likeComment.user)
    likeComment: LikeComment;

    @OneToMany(() => ConfirmMail, confirmMail => confirmMail.user)
    confirmMail: ConfirmMail;
}
