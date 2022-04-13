import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { PostUserDto } from 'src/user/dto/user.dto';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendUserConfirmation(token: string, userID, nickname){
        const url = `localhost:3000/user/confirm?token=${token}`;

        await this.mailerService.sendMail({
            to: 'ogus05@naver.com',
            subject: 'the reader',
            template: 'confirm',
            context: {
                name: nickname,
                url,
            }
        })
    }
}
