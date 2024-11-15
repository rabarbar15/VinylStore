import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Stripe from 'stripe';
import { Order } from './models/order.model';
import { CreateOrderDto } from './dto/create-order.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
    private readonly stripe: Stripe;

    constructor(
        // @Inject('STRIPE_API_KEY') private readonly stripeApiKey: string,
        private readonly configService: ConfigService,
        @InjectModel(Order) private orderModel: typeof Order,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {
        this.stripe = new Stripe(this.stripeApiKey, { apiVersion: '2024-10-28.acacia' });
    }

    private readonly stripeApiKey = this.configService.get<string>('STRIPE_API_KEY');

    async createPaymentIntent(price: number) {
        
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: price * 100,
                currency: 'usd',
                payment_method_types: ['card'],
            });
            return paymentIntent.client_secret;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createOrder(orderData: CreateOrderDto, userId: number, paymentIntentId: string, price: number) {
        try {
            const order = this.orderModel.build({
                userId: userId,
                vinylId: orderData.vinylId,
                price: price,
                paymentIntentId: paymentIntentId,
            });

            this.logger.info(`Order with id ${order.id} created`);
            await order.save();
            return order;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
