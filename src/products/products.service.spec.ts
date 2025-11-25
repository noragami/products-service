/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

describe('ProductsService', () => {
	let service: ProductsService;
	let mockProductModel: any;

	const mockProduct = {
		id: 1,
		productToken: 'ABC123',
		name: 'Test Product',
		price: 29.99,
		stock: 100,
		createdAt: new Date(),
		updatedAt: new Date(),
		update: jest.fn(),
		destroy: jest.fn(),
	};

	const mockCreateProductDto: CreateProductDto = {
		productToken: 'ABC123',
		name: 'Test Product',
		price: 29.99,
		stock: 100,
	};

	const mockUpdateProductDto: UpdateProductDto = {
		stock: 50,
	};

	const mockPaginationDto: PaginationDto = {
		page: 1,
		limit: 10,
		get offset() {
			return 0;
		},
	};

	beforeEach(async () => {
		// Mock Sequelize Product model
		mockProductModel = {
			create: jest.fn(),
			findAndCountAll: jest.fn(),
			findOne: jest.fn(),
			count: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ProductsService,
				{
					provide: getModelToken(Product),
					useValue: mockProductModel,
				},
			],
		}).compile();

		service = module.get<ProductsService>(ProductsService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('create', () => {
		it('should create a product successfully', async () => {
			// Arrange
			mockProductModel.create.mockResolvedValue(mockProduct);

			// Act
			const result = await service.create(mockCreateProductDto);

			// Assert
			expect(mockProductModel.create).toHaveBeenCalledWith({
				productToken: mockCreateProductDto.productToken,
				name: mockCreateProductDto.name,
				price: mockCreateProductDto.price,
				stock: mockCreateProductDto.stock,
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
			});
			expect(result).toEqual(mockProduct);
		});

		it('should throw ConflictException when productToken already exists', async () => {
			// Arrange
			const duplicateError = {
				name: 'SequelizeUniqueConstraintError',
				errors: [{ path: 'productToken' }],
			};
			mockProductModel.create.mockRejectedValue(duplicateError);

			// Act & Assert
			await expect(service.create(mockCreateProductDto)).rejects.toThrow(
				new ConflictException(
					`Product token '${mockCreateProductDto.productToken}' already exists`,
				),
			);
		});

		it('should re-throw other database errors', async () => {
			// Arrange
			const genericError = new Error('Database connection error');
			mockProductModel.create.mockRejectedValue(genericError);

			// Act & Assert
			await expect(service.create(mockCreateProductDto)).rejects.toThrow(genericError);
		});
	});

	describe('findAll', () => {
		it('should return paginated products', async () => {
			// Arrange
			const mockProducts = [mockProduct, { ...mockProduct, id: 2 }];
			const mockResponse = {
				count: 25,
				rows: mockProducts,
			};
			mockProductModel.findAndCountAll.mockResolvedValue(mockResponse);

			// Act
			const result = await service.findAll(mockPaginationDto);

			// Assert
			expect(mockProductModel.findAndCountAll).toHaveBeenCalledWith({
				limit: mockPaginationDto.limit,
				offset: mockPaginationDto.offset,
				order: [
					['createdAt', 'DESC'],
					['id', 'ASC'],
				],
			});

			expect(result).toEqual({
				data: mockProducts,
				meta: {
					currentPage: 1,
					itemsPerPage: 10,
					totalItems: 25,
					totalPages: 3,
					hasNextPage: true,
					hasPreviousPage: false,
				},
			});
		});

		it('should handle empty results', async () => {
			// Arrange
			const mockResponse = {
				count: 0,
				rows: [],
			};
			mockProductModel.findAndCountAll.mockResolvedValue(mockResponse);

			// Act
			const result = await service.findAll(mockPaginationDto);

			// Assert
			expect(result).toEqual({
				data: [],
				meta: {
					currentPage: 1,
					itemsPerPage: 10,
					totalItems: 0,
					totalPages: 0,
					hasNextPage: false,
					hasPreviousPage: false,
				},
			});
		});

		it('should handle last page correctly', async () => {
			// Arrange
			const lastPagePagination: PaginationDto = {
				page: 3,
				limit: 10,
				get offset() {
					return 20;
				},
			};
			const mockResponse = {
				count: 25,
				rows: [mockProduct],
			};
			mockProductModel.findAndCountAll.mockResolvedValue(mockResponse);

			// Act
			const result = await service.findAll(lastPagePagination);

			// Assert
			expect(result.meta).toEqual({
				currentPage: 3,
				itemsPerPage: 10,
				totalItems: 25,
				totalPages: 3,
				hasNextPage: false,
				hasPreviousPage: true,
			});
		});
	});

	describe('findOne', () => {
		it('should return a product when found', async () => {
			// Arrange
			mockProductModel.findOne.mockResolvedValue(mockProduct);

			// Act
			const result = await service.findOne(1);

			// Assert
			expect(mockProductModel.findOne).toHaveBeenCalledWith({
				where: { id: 1 },
			});
			expect(result).toEqual(mockProduct);
		});

		it('should return null when product not found', async () => {
			// Arrange
			mockProductModel.findOne.mockResolvedValue(null);

			// Act
			const result = await service.findOne(999);

			// Assert
			expect(result).toBeNull();
		});
	});

	describe('update', () => {
		it('should update product stock successfully', async () => {
			// Arrange
			const updatedProduct = { ...mockProduct, stock: 50 };
			mockProductModel.findOne.mockResolvedValue(mockProduct);
			mockProduct.update.mockResolvedValue(updatedProduct);

			// Act
			const result = await service.update(1, mockUpdateProductDto);

			// Assert
			expect(mockProductModel.findOne).toHaveBeenCalledWith({
				where: { id: 1 },
			});
			expect(mockProduct.update).toHaveBeenCalledWith({
				stock: mockUpdateProductDto.stock,
				updatedAt: expect.any(Date),
			});
			expect(result).toEqual(mockProduct);
		});

		it('should throw NotFoundException when product not found', async () => {
			// Arrange
			mockProductModel.findOne.mockResolvedValue(null);

			// Act & Assert
			await expect(service.update(999, mockUpdateProductDto)).rejects.toThrow(
				new NotFoundException('Product with id 999 not found'),
			);
		});
	});

	describe('remove', () => {
		it('should remove product successfully', async () => {
			// Arrange
			mockProductModel.findOne.mockResolvedValue(mockProduct);
			mockProduct.destroy.mockResolvedValue(undefined);

			// Act
			await service.remove(1);

			// Assert
			expect(mockProductModel.findOne).toHaveBeenCalledWith({
				where: { id: 1 },
			});
			expect(mockProduct.destroy).toHaveBeenCalled();
		});

		it('should handle non-existent product gracefully (idempotent)', async () => {
			// Arrange
			mockProductModel.findOne.mockResolvedValue(null);

			// Act
			await service.remove(999);

			// Assert
			expect(mockProductModel.findOne).toHaveBeenCalledWith({
				where: { id: 999 },
			});
			// No exception should be thrown - idempotent behavior
		});
	});
});
