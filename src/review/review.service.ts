import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Review } from './model/review.model';
import { InjectModel } from '@nestjs/sequelize';
import { FetchReviewsDto } from './dto/fetch-reviews.dto';

@Injectable()
export class ReviewService {
    constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectModel(Review)
    private reviewModel: typeof Review,
    ) {}

    async getAllReviews(query: FetchReviewsDto): Promise<Review[]> {
        const { page = 1, pageSize = 10 } = query;
        const offset = (page - 1) * pageSize;

        this.logger.info(`Fetching reviews from page ${page} with page size ${pageSize}`);
        return this.reviewModel.findAll({
            offset: Number(offset),
            limit: Number(pageSize),
        });
    }

    async createReview(reviewData: Partial<Review>): Promise<Review> {
        try {
            const newReview = this.reviewModel.build({
                authorId: reviewData.authorId,
                vinylId: reviewData.vinylId,
                score: reviewData.score,
                comment: reviewData.comment
            });
            await newReview.save();
            this.logger.info(`Review with id ${newReview.id} created`);
            return newReview;
        } catch (error) {
            this.logger.error(`Error creating review: ${error.message}`);
            throw new NotFoundException('Vinyl not found');
        }
    }

    async deleteReview(reviewId: number): Promise<{message: string}> {
        const review = await this.reviewModel.findByPk(reviewId);
        if (!review) {
            this.logger.error(`Review with id ${reviewId} not found`);
            throw new NotFoundException('Review not found');
        }
        await review.destroy();
        this.logger.info(`Review with id ${reviewId} deleted`);
        return {message: `Review with id ${reviewId} deleted`};
    }
}
