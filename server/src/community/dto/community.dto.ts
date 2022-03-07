import { IsBoolean, IsString } from "class-validator";
import { User } from "src/entities/user.entity";

export class GetCommunityInfoModel{

}

export class PostCommunityDto{
    @IsString()
    name: string;
    @IsString()
    mark: string;
    @IsBoolean()
    isOpen: boolean;
    @IsString()
    message: string;

    leader: User;
}