import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { BmReview } from "./bmReview.entity";
import { BmUser } from "./bmUser.entity";
import { Comment } from "./comment.entity";
import { Community } from "./community.entity";
import { Profile } from "./profile.entity";
import { Review } from "./review.entity";

@Entity()
export class User {
    @PrimaryColumn({
        unique: true
    })
    ID: string;
    @Column()
    password: string;
    @Column()
    nickname: string;
    @CreateDateColumn({
        type: "timestamp"
    })
    regDate: Date;
    @Column({
        default: null,
        nullable: true,
    })
    refreshJWT: string;

    @OneToMany(() => BmUser, bmUser => bmUser.user)
    bmUser: BmUser[];
    @OneToMany(() => BmReview, bmReview => bmReview.user)
    bmReview: BmReview[];

    @OneToMany(() => Review, review => review.user)
    review: Review[];
    @OneToMany(() => Comment, comment => comment.user)
    comment: Comment[];

    @ManyToOne(() => Community, community => community.user, {
        cascade: true,
    })
    @JoinColumn({
        name: 'communityID',
    })
    community: Community;
    @Column()
    communityID: number;
    
    
    @OneToOne(() => Profile, profile => profile.ID, {
        cascade: true,
    })
    @JoinColumn({name: "profileID"})
    profile: Profile;
    @Column()
    profileID: number;

}
