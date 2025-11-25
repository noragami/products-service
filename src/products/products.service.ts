import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
	constructor(
		@InjectModel(Product)
		private productModel: typeof Product,
	) {}

	create(createProductDto: CreateProductDto): Promise<Product> {
		return this.productModel.create({
			productToken: createProductDto.productToken,
			name: createProductDto.name,
			price: createProductDto.price,
			stock: createProductDto.stock,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
	}

	async findAll(): Promise<Product[]> {
		return this.productModel.findAll();
	}

	findOne(id: number): Promise<Product | null> {
		return this.productModel.findOne({
			where: {
				id,
			},
		});
	}

	update(id: number, updateProductDto: UpdateProductDto) {
		return `This action updates a #${id} product`;
	}

	async remove(id: number): Promise<void> {
		const product = await this.findOne(id);

		if (product) {
			await product.destroy();
		}
	}
}
