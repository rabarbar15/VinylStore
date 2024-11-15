import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FetchReviewsDto } from './dto/fetch-reviews.dto';
import { AdminGuard } from '../auth/admin.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @UseGuards(AuthGuard)
    @Post()
    @ApiOperation({ summary: 'Add a review for a vinyl record' })
    @ApiBearerAuth()
    @ApiBody({ type: CreateReviewDto })
    @ApiResponse({
        status: 201,
        description: 'Review successfully added.',
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request - Invalid review data.',
    })
    async addReview(@Req() req, @Body() createReviewDto: CreateReviewDto) {
        console.log(req.user.sub);
        
        return this.reviewService.createReview({
            authorId: req.user.sub,
            vinylId: createReviewDto.vinylId,
            score: createReviewDto.score,
            comment: createReviewDto.comment,
        });
    }

    @UseGuards(AuthGuard)
    @Get()
    @ApiOperation({ summary: 'Get all reviews with optional filters' })
    @ApiBearerAuth()
    @ApiQuery({ name: 'vinylId', required: false, description: 'Filter by vinyl ID' })
    @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination' })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of reviews per page' })
    @ApiResponse({
        status: 200,
        description: 'Successfully retrieved reviews.',
    })
    async getAllReviews(@Query() fetchReviewsDto: FetchReviewsDto) {
        return this.reviewService.getAllReviews(fetchReviewsDto);
    }

    @UseGuards(AuthGuard, AdminGuard)
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a review by ID (Admin only)' })
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'Review successfully deleted.',
    })
    @ApiResponse({
        status: 404,
        description: 'Review not found.',
    })
    async deleteReview(@Param('id') id: number) {
        return this.reviewService.deleteReview(id);
    }
}
