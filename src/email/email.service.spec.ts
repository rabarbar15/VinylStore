import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('EmailService', () => {
    let emailService: EmailService;

    const mockTransporter = {
        sendMail: jest.fn().mockResolvedValue({ messageId: '1234' }),
    };

    const mockLogger = {
        info: jest.fn(),
        error: jest.fn(),
    };

    const mockConfigService = {
        get: jest.fn().mockReturnValue('mock-sendgrid-api-key'),
    };

    beforeEach(async () => {
        (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EmailService,
                // { provide: 'nodemailer', useValue: mockTransporter },
                { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
                { provide: ConfigService, useValue: mockConfigService },
            ],
        })
            .compile();

        emailService = module.get<EmailService>(EmailService);
    });

    it('should be defined', () => {
        expect(emailService).toBeDefined();
    });

    describe('sendOrderConfirmation', () => {
        it('should send an order confirmation email', async () => {
            const to = 'customer@example.com';
            const orderId = 123;
            const price = 50;
      
            mockTransporter.sendMail.mockResolvedValue({ messageId: '1234' });
      
            await emailService.sendOrderConfirmation(to, orderId, price);
      
            expect(mockTransporter.sendMail).toHaveBeenCalledWith({
                from: undefined,
                to: to,
                subject: 'Order Confirmation',
                text: `Your order with id ${orderId} has been confirmed. Total price: $${price}`,
            });
      
            expect(mockLogger.info).toHaveBeenCalledWith('Email sent: 1234');
        });
      
        it('should log an error if sending email fails', async () => {
            mockTransporter.sendMail.mockRejectedValue(new Error('SendGrid error'));
      
            const to = 'customer@example.com';
            const orderId = 123;
            const price = 50;
      
            try {
                await emailService.sendOrderConfirmation(to, orderId, price);
            // eslint-disable-next-line 
            } catch (e) {
                expect(mockLogger.error).toHaveBeenCalledWith('Error sending email:', expect.any(Error));
            }
        });
    });

});
