import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { PaginationHelper } from '../common/utils/pagination.helper';

@Injectable()
export class ProductsService {
	constructor(
		@InjectModel(Product)
		private productModel: typeof Product,
	) {}

	async create(createProductDto: CreateProductDto): Promise<Product> {
		try {
			return await this.productModel.create({
				productToken: createProductDto.productToken,
				name: createProductDto.name,
				price: createProductDto.price,
				stock: createProductDto.stock,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
		} catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				const constraintError = error.errors?.find(err => err.path === 'productToken');
				if (constraintError) {
					throw new ConflictException(
						`Product token '${createProductDto.productToken}' already exists`,
					);
				}
			}
			throw error;
		}
	}

	async findAll(paginationDto: PaginationDto): Promise<PaginatedResponse<Product>> {
		const { page, limit, offset } = paginationDto;

		// Single query for both count and data
		const { count: totalItems, rows: products } = await this.productModel.findAndCountAll({
			limit,
			offset,
			order: [
				['createdAt', 'DESC'], // Primary ordering by creation date
				['id', 'ASC'], // Secondary ordering for consistency (tiebreaker)
			],
		});

		return PaginationHelper.createPaginatedResponse(products, page, limit, totalItems);
	}

	findOne(id: number): Promise<Product | null> {
		return this.productModel.findOne({
			where: {
				id,
			},
		});
	}

	async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
		const product = await this.findOne(id);

		if (!product) {
			throw new NotFoundException(`Product with id ${id} not found`);
		}

		await product.update({
			stock: updateProductDto.stock,
			updatedAt: new Date(),
		});

		return product;
	}

	async remove(id: number): Promise<void> {
		const product = await this.findOne(id);

		if (product) {
			await product.destroy();
		}
	}
}
