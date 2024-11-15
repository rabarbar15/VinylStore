import { Test, TestingModule } from '@nestjs/testing';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { EmailService } from '../email/email.service';
import { VinylService } from '../vinyl/vinyl.service';
import { UserService } from '../user/user.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ConfigService } from '../config/config.service';
import { Order } from './models/order.model';
import { JwtService } from '@nestjs/jwt';
import { CreateOrderDto } from './dto/create-order.dto';
import { NotFoundException } from '@nestjs/common';


describe('StripeController', () => {
    let stripeController: StripeController;

    const mockConfigService = {
        get: jest.fn().mockReturnValue('mock-stripe-api-key'),
    };

    const mockLogger = {
        info: jest.fn(),
        error: jest.fn(),
    };


    const mockStripeService = {
        createPaymentIntent: jest.fn(),
        createOrder: jest.fn(),
    };

    const mockOrderModel = {
        build: jest.fn().mockReturnValue({
            save: jest.fn(),
        }),
    };

    const mockJwtService = {
        sign: jest.fn(() => 'mock-jwt-token'),
    };

    const mockVinylService = {
        getVinylById: jest.fn()
    };

    const mockEmailService = {
        sendOrderConfirmation: jest.fn()
    };

    const mockUserService = {
        getUserById: jest.fn(),
        findById: jest.fn()
    };
    beforeEach(async () => {
        
        const module: TestingModule = await Test.createTestingModule({
            controllers: [StripeController],
            providers: [
                { provide: ConfigService, useValue: mockConfigService },
                { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
                { provide: 'OrderRepository', useValue: mockOrderModel },
                { provide: StripeService, useValue: mockStripeService },
                {
                    provide: Order, 
                    useValue: mockOrderModel,
                },
                {provide: JwtService, useValue: mockJwtService},
                { provide: VinylService, useValue: mockVinylService },
                {provide: EmailService, useValue: mockEmailService},
                { provide: UserService, useValue: mockUserService },
            ],
        }).compile();

        stripeController = module.get<StripeController>(StripeController);

    });

    it('should be defined', () => {
        expect(stripeController).toBeDefined();
    });

    describe('createOrder', () => {
        it('should create an order and return the order with clientSecret', async () => {
            const createOrderDto: CreateOrderDto = { vinylId: 1 };
            const vinyl = { id: 1, price: 100 }; 
            const user = { email: 'user@example.com' }; 
            const clientSecret = 'client_secret_example'; 

            mockVinylService.getVinylById = jest.fn().mockResolvedValue(vinyl);
            mockUserService.findById = jest.fn().mockResolvedValue(user);
            mockStripeService.createPaymentIntent = jest.fn().mockResolvedValue(clientSecret);
            mockStripeService.createOrder = jest.fn().mockResolvedValue({ id: 'order_1', amount: vinyl.price });
            mockEmailService.sendOrderConfirmation = jest.fn();

            const result = await stripeController.createOrder(
                { user: { sub: 1 } }, 
                createOrderDto
            );

            expect(result).toEqual({
                order: { id: 'order_1', amount: vinyl.price },
                clientSecret,
            });
            expect(mockVinylService.getVinylById).toHaveBeenCalledWith(createOrderDto.vinylId);
            expect(mockUserService.findById).toHaveBeenCalledWith(1);
            expect(mockStripeService.createPaymentIntent).toHaveBeenCalledWith(vinyl.price);
            expect(mockStripeService.createOrder).toHaveBeenCalledWith(createOrderDto, 1, clientSecret, vinyl.price);
            expect(mockEmailService.sendOrderConfirmation).toHaveBeenCalledWith(user.email, vinyl.id, vinyl.price);
        });

        it('should throw NotFoundException if vinyl is not found', async () => {
            const createOrderDto: CreateOrderDto = { vinylId: 1 };

            mockVinylService.getVinylById = jest.fn().mockResolvedValue(null); 

            await expect(
                stripeController.createOrder({ user: { sub: 1 } }, createOrderDto)
            ).rejects.toThrow(NotFoundException);
        });
    });
});
