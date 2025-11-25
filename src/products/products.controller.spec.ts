/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

describe('ProductsController', () => {
	let controller: ProductsController;
	let mockProductsService: jest.Mocked<ProductsService>;

	const mockProduct = {
		id: 1,
		productToken: 'ABC123',
		name: 'Test Product',
		price: 29.99,
		stock: 100,
		createdAt: new Date(),
		updatedAt: new Date(),
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

	const mockPaginatedResponse = {
		data: [mockProduct],
		meta: {
			currentPage: 1,
			itemsPerPage: 10,
			totalItems: 1,
			totalPages: 1,
			hasNextPage: false,
			hasPreviousPage: false,
		},
	};

	beforeEach(async () => {
		// Mock ProductsService with proper typing
		mockProductsService = {
			create: jest.fn(),
			findAll: jest.fn(),
			findOne: jest.fn(),
			update: jest.fn(),
			remove: jest.fn(),
		} as jest.Mocked<ProductsService>;

		const module: TestingModule = await Test.createTestingModule({
			controllers: [ProductsController],
			providers: [
				{
					provide: ProductsService,
					useValue: mockProductsService,
				},
			],
		}).compile();

		controller = module.get<ProductsController>(ProductsController);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('create', () => {
		it('should create a product and return it', async () => {
			// Arrange
			mockProductsService.create.mockResolvedValue(mockProduct);

			// Act
			const result = await controller.create(mockCreateProductDto);

			// Assert
			expect(mockProductsService.create).toHaveBeenCalledWith(mockCreateProductDto);
			expect(mockProductsService.create).toHaveBeenCalledTimes(1);
			expect(result).toEqual(mockProduct);
		});

		it('should pass through service exceptions', async () => {
			// Arrange
			const serviceError = new Error('Service error');
			mockProductsService.create.mockRejectedValue(serviceError);

			// Act & Assert
			await expect(controller.create(mockCreateProductDto)).rejects.toThrow(serviceError);
			expect(mockProductsService.create).toHaveBeenCalledWith(mockCreateProductDto);
		});
	});

	describe('findAll', () => {
		it('should return paginated products', async () => {
			// Arrange
			mockProductsService.findAll.mockResolvedValue(mockPaginatedResponse);

			// Act
			const result = await controller.findAll(mockPaginationDto);

			// Assert
			expect(mockProductsService.findAll).toHaveBeenCalledWith(mockPaginationDto);
			expect(mockProductsService.findAll).toHaveBeenCalledTimes(1);
			expect(result).toEqual(mockPaginatedResponse);
		});

		it('should handle empty pagination parameters', async () => {
			// Arrange
			const emptyPaginationDto: PaginationDto = {
				page: 1,
				limit: 10,
				get offset() {
					return 0;
				},
			};
			mockProductsService.findAll.mockResolvedValue(mockPaginatedResponse);

			// Act
			const result = await controller.findAll(emptyPaginationDto);

			// Assert
			expect(mockProductsService.findAll).toHaveBeenCalledWith(emptyPaginationDto);
			expect(result).toEqual(mockPaginatedResponse);
		});
	});

	describe('findOne', () => {
		it('should return a product when found', async () => {
			// Arrange
			mockProductsService.findOne.mockResolvedValue(mockProduct);

			// Act
			const result = await controller.findOne(1);

			// Assert
			expect(mockProductsService.findOne).toHaveBeenCalledWith(1);
			expect(mockProductsService.findOne).toHaveBeenCalledTimes(1);
			expect(result).toEqual(mockProduct);
		});

		it('should throw NotFoundException when product not found', async () => {
			// Arrange
			const notFoundError = new Error('Product with id 999 not found');
			mockProductsService.findOne.mockRejectedValue(notFoundError);

			// Act & Assert
			await expect(controller.findOne(999)).rejects.toThrow(notFoundError);
			expect(mockProductsService.findOne).toHaveBeenCalledWith(999);
		});

		it('should accept number id directly', async () => {
			// Arrange
			mockProductsService.findOne.mockResolvedValue(mockProduct);

			// Act
			await controller.findOne(123);

			// Assert
			expect(mockProductsService.findOne).toHaveBeenCalledWith(123);
		});
	});

	describe('update', () => {
		it('should update a product and return it', async () => {
			// Arrange
			const updatedProduct = { ...mockProduct, stock: 50 };
			mockProductsService.update.mockResolvedValue(updatedProduct);

			// Act
			const result = await controller.update(1, mockUpdateProductDto);

			// Assert
			expect(mockProductsService.update).toHaveBeenCalledWith(1, mockUpdateProductDto);
			expect(mockProductsService.update).toHaveBeenCalledTimes(1);
			expect(result).toEqual(updatedProduct);
		});

		it('should accept number id directly', async () => {
			// Arrange
			mockProductsService.update.mockResolvedValue(mockProduct);

			// Act
			await controller.update(456, mockUpdateProductDto);

			// Assert
			expect(mockProductsService.update).toHaveBeenCalledWith(456, mockUpdateProductDto);
		});

		it('should pass through service exceptions', async () => {
			// Arrange
			const serviceError = new Error('Product not found');
			mockProductsService.update.mockRejectedValue(serviceError);

			// Act & Assert
			await expect(controller.update(999, mockUpdateProductDto)).rejects.toThrow(serviceError);
			expect(mockProductsService.update).toHaveBeenCalledWith(999, mockUpdateProductDto);
		});
	});

	describe('remove', () => {
		it('should remove a product successfully', async () => {
			// Arrange
			mockProductsService.remove.mockResolvedValue(undefined);

			// Act
			const result = await controller.remove(1);

			// Assert
			expect(mockProductsService.remove).toHaveBeenCalledWith(1);
			expect(mockProductsService.remove).toHaveBeenCalledTimes(1);
			expect(result).toBeUndefined();
		});

		it('should accept number id directly', async () => {
			// Arrange
			mockProductsService.remove.mockResolvedValue(undefined);

			// Act
			await controller.remove(789);

			// Assert
			expect(mockProductsService.remove).toHaveBeenCalledWith(789);
		});

		it('should handle non-existent products (idempotent behavior)', async () => {
			// Arrange
			mockProductsService.remove.mockResolvedValue(undefined);

			// Act
			const result = await controller.remove(999);

			// Assert
			expect(mockProductsService.remove).toHaveBeenCalledWith(999);
			expect(result).toBeUndefined();
		});

		it('should pass through service exceptions if any', async () => {
			// Arrange
			const serviceError = new Error('Database error');
			mockProductsService.remove.mockRejectedValue(serviceError);

			// Act & Assert
			await expect(controller.remove(1)).rejects.toThrow(serviceError);
			expect(mockProductsService.remove).toHaveBeenCalledWith(1);
		});
	});
});
