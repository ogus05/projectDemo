import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Community{
    @PrimaryGeneratedColumn()
    ID: number;

    @Column({
        unique: true,
        nullable: false,
    })
    name: string;
    @OneToOne(() => User)
    @JoinColumn({
        name: "leaderID",
    })
    leader: User;

    @Column({
        name: "string"
    })
    leaderID: string;
    @Column({
        type: "varchar",
        default: 'community_default.jpg',
    })
    image: string;
    @Column({
        type: "tinyint",
        nullable: false,
        default: false,
    })
    isOpen: boolean;
    @Column({
        type: "text",
        nullable: false,
    })
    message: string;
    @CreateDateColumn({
        type:"datetime",
    })
    regDate: Date;

    //커뮤니티 정보를 가져올 때 마다 유저 수를 호출해야 하는데 이걸 서브쿼리 써서 호출하게 되면
    //너무 비효율적이지 않을까
    @Column({
        default: 0,
    })
    userCount: number;

    @OneToMany(() => User, user => user.community)
    user: User[];
}