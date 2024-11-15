import { Test, TestingModule } from '@nestjs/testing';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { FetchReviewsDto } from './dto/fetch-reviews.dto';
import { NotFoundException } from '@nestjs/common';

describe('ReviewsController', () => {
    let reviewController: ReviewController;

    const mockReviewService = {
        createReview: jest.fn(),
        getAllReviews: jest.fn(),
        deleteReview: jest.fn(),
    };

    const mockUserService = {
        findAll: jest.fn(),
        createUser: jest.fn(),
        findByEmail: jest.fn(),
    };

    const mockJwtService = {
        signAsync: jest.fn(),
    };

    const mockRequest = {
        user: {
            sub: 1, 
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ReviewController],
            providers: [
                { provide: ReviewService, useValue: mockReviewService },
                { provide: JwtService, useValue: mockJwtService },
                {provide: UserService, useValue: mockUserService},
            ]
        }).compile();

        reviewController = module.get<ReviewController>(ReviewController);
    });

    it('should be defined', () => {
        expect(reviewController).toBeDefined();
    });

    describe('addReview', () => {
        it('should create a review successfully', async () => {
            const createReviewDto: CreateReviewDto = {
                vinylId: 2,
                score: 5,
                comment: 'Great vinyl!',
            };
    
            mockReviewService.createReview.mockResolvedValue({
                id: 1,
                authorId: 1,
                vinylId: 2,
                score: 5,
                comment: 'Great vinyl!',
            });
    
            const result = await reviewController.addReview(mockRequest, createReviewDto);
    
            expect(mockReviewService.createReview).toHaveBeenCalledWith({
                authorId: 1,
                vinylId: 2,
                score: 5,
                comment: 'Great vinyl!',
            });
            expect(result).toEqual({
                id: 1,
                authorId: 1,
                vinylId: 2,
                score: 5,
                comment: 'Great vinyl!',
            });
        });
    });

    describe('getAllReviews', () => {
        it('should fetch reviews successfully', async () => {
            const fetchReviewsDto: FetchReviewsDto = { page: 1, pageSize: 10 };
            const mockReviews = [
                { id: 1, authorId: 1, vinylId: 2, score: 5, comment: 'Great vinyl!' },
            ];
    
            mockReviewService.getAllReviews.mockResolvedValue(mockReviews);
    
            const result = await reviewController.getAllReviews(fetchReviewsDto);
    
            expect(mockReviewService.getAllReviews).toHaveBeenCalledWith(fetchReviewsDto);
            expect(result).toEqual(mockReviews);
        });
    });

    describe('deleteReview', () => {
        it('should delete a review successfully', async () => {
            const reviewId = 1;
    
            mockReviewService.deleteReview.mockResolvedValue({ message: 'Review with id 1 deleted' });
    
            const result = await reviewController.deleteReview(reviewId);
    
            expect(mockReviewService.deleteReview).toHaveBeenCalledWith(reviewId);
            expect(result).toEqual({ message: 'Review with id 1 deleted' });
        });
    
        it('should throw an error if the review is not found', async () => {
            const reviewId = 999;
    
            mockReviewService.deleteReview.mockRejectedValue(new NotFoundException('Review not found'));
    
            try {
                await reviewController.deleteReview(reviewId);
            } catch (err) {
                expect(err).toBeInstanceOf(NotFoundException);
                expect(err.message).toBe('Review not found');
            }
        });
    });
});
