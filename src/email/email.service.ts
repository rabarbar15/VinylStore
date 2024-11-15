import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as nodemailer from 'nodemailer';
import { Logger } from 'winston';

@Injectable()
export class EmailService {
    private transporter;
    private senderUser: string;

    constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly configService: ConfigService,
    ) {
        this.senderUser = process.env.EMAIL_USER;

        this.transporter = nodemailer.createTransport({
            service: 'SendGrid',
            server: 'smtp.sendgrid.net',
            port: 587,
            auth: {
                user: 'apikey',
                pass: this.configService.get<string>('SENDGRID_API_KEY'),
            }
        });
    }

    async sendOrderConfirmation(to: string, orderId: number, price: number): Promise<void> {
        const mailOptions = {
            from: this.senderUser,
            to: to,
            subject: 'Order Confirmation',
            text: `Your order with id ${orderId} has been confirmed. Total price: $${price}`,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            this.logger.info(`Email sent: ${info.messageId}`);
        } catch (error) {
            this.logger.error('Error sending email:', error);
            throw new Error('Failed to send email');
        }
    }

    async sendPaymentConfirmation(
        firstName: string,
        email: string,
    ): Promise<void> {
        const mailOptions = {
            from: this.senderUser,
            to: email,
            subject: 'Payment Confirmation',
            text: `Hi ${firstName}, your order has been confirmed.`,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            this.logger.info(`Email sent: ${info.messageId}`);
        } catch (error) {
            this.logger.error('Error sending email:', error);
            throw new Error('Failed to send email');
        }
    }
}
