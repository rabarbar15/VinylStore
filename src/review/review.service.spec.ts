import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { NotFoundException } from '@nestjs/common';

describe('ReviewsService', () => {
    let reviewService: ReviewService;

    const mockLogger = {
        info: jest.fn(),
        error: jest.fn(),
    };

    const mockReviewData = {
        id: 1,
        authorId: 1,
        vinylId: 2,
        score: 5,
        comment: 'Great vinyl!',
    };

    const mockReviewModel = {
        build: jest.fn().mockReturnValue({
            save: jest.fn(),
        }),
        findAll: jest.fn(),
        findByPk: jest.fn(),    
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReviewService,
                { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
                { provide: 'ReviewRepository', useValue: mockReviewModel },
            ],
        }).compile();

        reviewService = module.get<ReviewService>(ReviewService);
    });

    it('should be defined', () => {
        expect(reviewService).toBeDefined();
    });

    describe('getAllReviews', () => {
        it('should fetch reviews with pagination', async () => {
            const query = { page: 1, pageSize: 10 };
            const mockReviews = [{ id: 1, ...mockReviewData }];
            mockReviewModel.findAll.mockResolvedValue(mockReviews);
    
            const result = await reviewService.getAllReviews(query);
    
            expect(mockReviewModel.findAll).toHaveBeenCalledWith({
                offset: 0,
                limit: 10,
            });
            expect(result).toEqual(mockReviews);
        });
    });

    describe('createReview', () => {
        it('should create and save a review successfully', async () => {
            mockReviewModel.build.mockReturnValueOnce({
                ...mockReviewData,
                save: jest.fn().mockResolvedValue(mockReviewData), 
            });

            const result = await reviewService.createReview(mockReviewData);

            expect(mockReviewModel.build).toHaveBeenCalledWith({
                authorId: 1,
                vinylId: 2,
                score: 5,
                comment: 'Great vinyl!',
                
            });

            expect(result).toMatchObject(mockReviewData);

            expect(mockLogger.info).toHaveBeenCalledWith(
                `Review with id ${mockReviewData.id} created`
            );
        });

        it('should throw an error when vinyl is not found', async () => {
            const error = new Error('Vinyl not found');
            mockReviewModel.build().save.mockRejectedValue(error);
      
            try {
                await reviewService.createReview(mockReviewData);
            } catch (err) {
                expect(err).toBeInstanceOf(NotFoundException);
                expect(err.message).toBe('Vinyl not found');
            }
        });
    });

    describe('deleteReview', () => {
        it('should delete a review successfully', async () => {
            const mockReview = { id: 1, ...mockReviewData, destroy: jest.fn() };
            mockReviewModel.findByPk.mockResolvedValue(mockReview);
    
            const result = await reviewService.deleteReview(1);
    
            expect(mockReview.destroy).toHaveBeenCalled();
            expect(result).toEqual({ message: 'Review with id 1 deleted' });
            expect(mockLogger.info).toHaveBeenCalledWith('Review with id 1 deleted');
        });
    
        it('should throw an error if the review is not found', async () => {
            mockReviewModel.findByPk.mockResolvedValue(null);
    
            try {
                await reviewService.deleteReview(999); 
            } catch (err) {
                expect(err).toBeInstanceOf(NotFoundException);
                expect(err.message).toBe('Review not found');
            }
        });
    });
    
});
