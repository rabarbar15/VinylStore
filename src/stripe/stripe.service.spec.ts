import { Test, TestingModule } from '@nestjs/testing';
import { StripeService } from './stripe.service';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CreateOrderDto } from './dto/create-order.dto';

describe('StripeService', () => {
    let stripeService: StripeService;

    const mockConfigService = {
        get: jest.fn().mockReturnValue('mock-stripe-api-key'),
    };

    const mockOrderModel = {
        build: jest.fn().mockReturnValue({
            id: 1,
            save: jest.fn(),
        }),
    };

    const mockLogger = {
        info: jest.fn(),
        error: jest.fn(),
    };


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StripeService,
                { provide: ConfigService, useValue: mockConfigService },
                { provide: 'OrderRepository', useValue: mockOrderModel },
                { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },


            ],
        }).compile();

        stripeService = module.get<StripeService>(StripeService);
    });

    it('should be defined', () => {
        expect(stripeService).toBeDefined();
    });


    describe('createOrder', () => {
        it('should create an order and save it to the database', async () => {
            const mockCreateOrderDto: CreateOrderDto = {
                vinylId: 1,
            };
            const userId = 1;
            const paymentIntentId = 'mock-payment-intent-id';
            const price = 20;

            const order = await stripeService.createOrder(mockCreateOrderDto, userId, paymentIntentId, price);

            expect(order).toMatchObject({ id: 1 });
            expect(mockOrderModel.build).toHaveBeenCalledWith({
                userId: userId,
                vinylId: mockCreateOrderDto.vinylId,
                price: price,
                paymentIntentId: paymentIntentId,
            });
            expect(mockOrderModel.build().save).toHaveBeenCalled();
            expect(mockLogger.info).toHaveBeenCalledWith('Order with id 1 created');
        });

        it('should throw an error if order creation fails', async () => {
            const errorMessage = 'Order creation failed';
            mockOrderModel.build().save.mockRejectedValueOnce(new Error(errorMessage));

            try {
                await stripeService.createOrder({ vinylId: 1 }, 1, 'mock-payment-intent-id', 20);
            } catch (error) {
                expect(error.message).toBe(errorMessage);
            }
        });
    });
});
