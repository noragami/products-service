/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import {
	HealthCheckService,
	MemoryHealthIndicator,
	SequelizeHealthIndicator,
} from '@nestjs/terminus';

describe('AppController', () => {
	let appController: AppController;
	let mockHealthCheckService: jest.Mocked<HealthCheckService>;
	let mockMemoryHealthIndicator: jest.Mocked<MemoryHealthIndicator>;
	let mockSequelizeHealthIndicator: jest.Mocked<SequelizeHealthIndicator>;

	const mockHealthCheckResult = {
		status: 'ok',
		info: {
			memory_heap: {
				status: 'up',
			},
			ecommerce: {
				status: 'up',
			},
		},
		error: {},
		details: {
			memory_heap: {
				status: 'up',
			},
			ecommerce: {
				status: 'up',
			},
		},
	};

	beforeEach(async () => {
		// Mock health check services
		mockHealthCheckService = {
			check: jest.fn(),
		} as jest.Mocked<HealthCheckService>;

		mockMemoryHealthIndicator = {
			checkHeap: jest.fn(),
		} as jest.Mocked<MemoryHealthIndicator>;

		mockSequelizeHealthIndicator = {
			pingCheck: jest.fn(),
		} as jest.Mocked<SequelizeHealthIndicator>;

		const app: TestingModule = await Test.createTestingModule({
			controllers: [AppController],
			providers: [
				{
					provide: HealthCheckService,
					useValue: mockHealthCheckService,
				},
				{
					provide: MemoryHealthIndicator,
					useValue: mockMemoryHealthIndicator,
				},
				{
					provide: SequelizeHealthIndicator,
					useValue: mockSequelizeHealthIndicator,
				},
			],
		}).compile();

		appController = app.get<AppController>(AppController);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('check', () => {
		it('should return health check results', async () => {
			// Arrange
			mockHealthCheckService.check.mockResolvedValue(mockHealthCheckResult);

			// Act
			const result = await appController.check();

			// Assert
			expect(mockHealthCheckService.check).toHaveBeenCalledWith([
				expect.any(Function),
				expect.any(Function),
			]);
			expect(result).toEqual(mockHealthCheckResult);
		});

		it('should call memory health check with correct parameters', async () => {
			// Arrange
			const memoryCheckResult = { status: 'up' };
			mockMemoryHealthIndicator.checkHeap.mockResolvedValue(memoryCheckResult);
			mockHealthCheckService.check.mockImplementation(async checks => {
				// Execute the first check function (memory)
				await checks[0]();
				return mockHealthCheckResult;
			});

			// Act
			await appController.check();

			// Assert
			expect(mockMemoryHealthIndicator.checkHeap).toHaveBeenCalledWith(
				'memory_heap',
				150 * 1024 * 1024,
			);
		});

		it('should call database health check with correct parameters', async () => {
			// Arrange
			const dbCheckResult = { status: 'up' };
			mockSequelizeHealthIndicator.pingCheck.mockResolvedValue(dbCheckResult);
			mockHealthCheckService.check.mockImplementation(async checks => {
				// Execute the second check function (database)
				await checks[1]();
				return mockHealthCheckResult;
			});

			// Act
			await appController.check();

			// Assert
			expect(mockSequelizeHealthIndicator.pingCheck).toHaveBeenCalledWith('ecommerce');
		});

		it('should handle health check failures', async () => {
			// Arrange
			const healthCheckError = new Error('Health check failed');
			mockHealthCheckService.check.mockRejectedValue(healthCheckError);

			// Act & Assert
			await expect(appController.check()).rejects.toThrow('Health check failed');
		});
	});
});
