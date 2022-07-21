import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./comment.entity";
import { Community } from "./community.entity";
import { User } from "./user.entity";

@Entity()
export class Review{
    @PrimaryGeneratedColumn()
    ID: number;
    @Column()
    title: string;
    @Column({
        type: 'text',
    })
    text: string;

    @ManyToOne(() => User)
    @JoinColumn({
        name: "userNumber"
    })
    user: User;
    @Column()
    userNumber: number;

    @ManyToOne(() => Community)
    @JoinColumn({
        name: "communityID"
    })
    community: Community;
    @Column({
        nullable: false,
    })
    communityID: number;

    @Column({
        default: 0,
    })
    visit: number;
    @Column({
        name: "isbn",
        nullable: false,
    })
    ISBN: string;
    
    @Column({
        name: "regDate",
        type: "timestamp",
    })
    regDate: Date;

    @OneToMany(() => Comment, comment => comment.review)
    comment: Comment;
}