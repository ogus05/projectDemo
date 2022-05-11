// import { Strategy } from 'passport-naver';
// import { forwardRef, Inject, Injectable } from "@nestjs/common";
// import { PassportStrategy } from "@nestjs/passport";
// import { AuthService } from '../auth.service';
// import { ConfigService } from '@nestjs/config';
// import { UserService } from 'src/user/user.service';

// @Injectable()
// export class NaverStrategy extends PassportStrategy(Strategy){
//     constructor(
//         private authService: AuthService,
//         private consfigService: ConfigService,
//         @Inject(forwardRef(() => UserService))
//         private userService: UserService
//     ){
//         super({
//             clientID: consfigService.get('NAVER_CLIENT_ID'),
//             clientSecret: consfigService.get('NAVER_CLIENT_SECRET'),
//             callbackURL: consfigService.get('NAVER_CALLBACK_URL'),
//         });
//     }

//     async validate(
//         accessToken: string,
//         refreshToken: string,
//         profile: any,
//     ){
//         const user_email = profile._json.email;
//         const user_nickname = (await this.userService.getUserByID(user_email, false, false))?.nickname;
//         const user_provider = profile.provider;
//         const user_profile = {
//             user_email,
//             user_nickname,
//             user_provider,
//             isFirst: user_nickname === null
//         }
//         return user_profile;
//     }
// }