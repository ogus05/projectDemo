import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { PostUserDto } from 'src/user/dto/user.dto';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendUserConfirmation(token: string, type: number, userID: string, userName: string){
        await this.mailerService.sendMail({
            to: 'ogus05@naver.com',     //userID로 바꿔야함
            subject: 'the reader',
            template: (type == 0) ? 'register' : 'findPassword',
            context: {
                url: `http://localhost:3000/user/page/confirm?token=${token}`,
                userName,
            },
            attachments: [{
                filename: 'mailPage.png',
                path: './src/mail/image/mailPage.png',
                cid: 'mailPage'
            }]
        })
    }
}
