import { Body, Controller, NotFoundException, Post, Req, UseGuards } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VinylService } from '../vinyl/vinyl.service';
import { AuthGuard } from '../auth/auth.guard';
import { EmailService } from '../email/email.service';
import { UserService } from '../user/user.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('stripe')
export class StripeController {
    constructor(
        private stripeService: StripeService,
        private vinylService: VinylService,
        private emailService: EmailService,
        private userService: UserService,
    ) {}

    @UseGuards(AuthGuard)
    @Post('order')
    @ApiOperation({ summary: 'Create an order for a vinyl and initiate Stripe payment' })
    @ApiBearerAuth()
    @ApiBody({ type: CreateOrderDto })
    @ApiResponse({
        status: 201,
        description: 'Order created successfully with Stripe payment intent.',
    })
    @ApiResponse({
        status: 404,
        description: 'Vinyl not found.',
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid order data.',
    })
    async createOrder(@Req() req,  @Body() createOrderDto: CreateOrderDto) {
        const vinyl = await this.vinylService.getVinylById(createOrderDto.vinylId);

        if (!vinyl) {
            throw new NotFoundException('Vinyl not found');
        }

        const user = await this.userService.findById(req.user.sub);

        const clientSecret = await this.stripeService.createPaymentIntent(vinyl.price);

        const order = await this.stripeService.createOrder(createOrderDto, req.user.sub, clientSecret, vinyl.price);

        this.emailService.sendOrderConfirmation(user.email, vinyl.id, vinyl.price);

        return { order, clientSecret };
    }
}
