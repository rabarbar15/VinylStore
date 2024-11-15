import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Vinyl } from './models/vinyl.model/vinyl.model';
import { CreateVinylDto } from './dto/create-vinyl.dto/create-vinyl.dto';
import { VinylPaginationDto } from './dto/fetch-vinyls.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Review } from '../review/model/review.model';
import { Op } from 'sequelize';
import { VinylResponseDto } from './dto/vinyl-response.dto';
import { UpdateVinylDto } from './dto/update-vinyl.dto';

@Injectable()
export class VinylService {

    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @InjectModel(Vinyl)
        private vinylModel: typeof Vinyl,
    ) {}

    async getVinylById(vinylId: number): Promise<Vinyl> {
        const vinyl = await this.vinylModel.findByPk(vinylId);

        if (!vinyl) {
            this.logger.error(`Vinyl with id ${vinylId} not found`);
            throw new NotFoundException('Vinyl not found');
        }

        return vinyl;
    }

    async getAllVinyls(query: VinylPaginationDto, currentUserId?: number): Promise<VinylResponseDto[]> {
        const { page = 1, pageSize = 10 } = query;
        const offset = (page - 1) * pageSize;

        this.logger.info(`Fetching vinyls from page ${page} with page size ${pageSize}`);

        const vinyls = await this.vinylModel.findAll({
            offset: Number(offset),
            limit: Number(pageSize),
            include: [
                {
                    model: Review,
                    as: 'reviews',
                    where: currentUserId ? { authorId: { [Op.ne]: currentUserId } } : {},
                    order: [['createdAt', 'ASC']],
                    required: false,
                }
            ],
            attributes: ['id', 'title', 'author', 'description', 'price'],
        });
        const result = await Promise.all(
            vinyls.map(async (vinyl) => {
                const reviews = vinyl.reviews || [];
                const averageScore =
                reviews.length > 0
                    ? reviews.reduce((acc, review) => acc + review.score, 0) / reviews.length
                    : 0;
      
                const firstReview = reviews.length > 0 ? reviews[0] : null;
      
                return {
                    title: vinyl.title,
                    author: vinyl.author,
                    price: vinyl.price,
                    description: vinyl.description,
                    averageScore,
                    firstReview: firstReview ? `Comment: ${firstReview.comment}, Score: ${firstReview.score}` : null
                };
            }),
        );

        return result;
    }

    async createVinyl(vinyl: CreateVinylDto): Promise<Vinyl> {
        const newVinyl = this.vinylModel.build(vinyl);

        this.logger.info(`Creating vinyl with title ${newVinyl.title}`);
        await newVinyl.save();
        return newVinyl;
    }

    async deleteVinyl(vinylId: number): Promise<{message: string}> {
        const vinyl = await this.vinylModel.findByPk(vinylId);

        if (!vinyl) {
            this.logger.error(`Vinyl with id ${vinylId} not found`);
            throw new NotFoundException('Vinyl not found');
        }

        this.logger.info(`Deleting vinyl with id ${vinylId}`);
        await vinyl.destroy();

        return {message: 'Vinyl deleted successfully'};
    }

    async updateVinyl(vinylId: number, data: UpdateVinylDto): Promise<Vinyl> {
        const vinyl = await this.vinylModel.findByPk(vinylId);

        if (!vinyl) {
            this.logger.error(`Vinyl with id ${vinylId} not found`);
            throw new NotFoundException('Vinyl not found');
        }

        this.logger.info(`Updating vinyl with id ${vinylId}`);
        await vinyl.update(data);
        return vinyl;
    }

    async searchVinyls(title: string, author: string, sortBy: string, order: string): Promise<VinylResponseDto[]> {
        this.logger.info(`Searching vinyls by title ${title} and author ${author}`);

        const validSortOptions = ['title', 'author', 'price'];
        const sortOption = validSortOptions.includes(sortBy) ? sortBy : 'title';
        const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const searchConditions: any = {};
        if (title) {
            searchConditions.title = { [Op.like]: `%${title}%` };
        }
        if (author) {
            searchConditions.author = { [Op.like]: `%${author}%` };
        }
    

        const vinyls = await this.vinylModel.findAll({
            where: searchConditions,
            order: [[sortOption, sortOrder]],
        });

        return vinyls;
    }

}
