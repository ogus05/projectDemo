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
        type: "mediumblob",
        nullable: true,
    })
    mark: string;
    @Column({
        type: "tinyint",
        nullable: false,
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

    @OneToMany(() => User, user => user.community)
    user: User[];
}