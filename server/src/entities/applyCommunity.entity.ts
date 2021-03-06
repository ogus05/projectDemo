import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Community } from "./community.entity";
import { User } from "./user.entity";

@Entity()
export class ApplyCommunity{
    @PrimaryGeneratedColumn()
    ID: number;

    @ManyToOne(() => Community, {
        onDelete: "CASCADE",
    })
    @JoinColumn({
        name: "communityID"
    })
    community: Community;

    @Column()
    communityID: number;

    @OneToOne(() => User, {
        onDelete: "CASCADE",
    })
    @JoinColumn({
        name: "userNumber"
    })
    user: User;
    @Column()
    userNumber: number;
}