import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { VerificationTemplate } from './templates/verification.template';
import { render } from '@react-email/components';

@Injectable()
export class MailService {
    public constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService
    ) {}


    public async sendVerificationEmail(email: string, token: string) {
        const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN') || 'http://localhost:3000';
        const html = await render(VerificationTemplate({ domain, token }));
        this.sendMail(email, 'Verify your email', html);
    }

    private sendMail(email: string, subject: string, html: string) {
        return this.mailerService.sendMail({
            to: email,
            subject,
            html
        });
    }
}
