/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
	let app: INestApplication<App>;
	let moduleFixture: TestingModule;

	beforeEach(async () => {
		moduleFixture = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterEach(async () => {
		if (app) {
			await app.close();
		}
	});

	describe('/health (GET)', () => {
		it('should return health check status', async () => {
			const response = await request(app.getHttpServer()).get('/health').expect(200);

			// Verify health check response structure
			expect(response.body).toHaveProperty('status');
			expect(response.body).toHaveProperty('info');
			expect(response.body).toHaveProperty('error');
			expect(response.body).toHaveProperty('details');

			// Verify specific health indicators
			expect(response.body.details).toHaveProperty('memory_heap');
			expect(response.body.details).toHaveProperty('ecommerce');

			// Verify status values
			expect(['ok', 'error', 'shutting_down']).toContain(response.body.status);
		});

		it('should check memory heap health', async () => {
			const response = await request(app.getHttpServer()).get('/health').expect(200);

			const memoryCheck = response.body.details.memory_heap;
			expect(memoryCheck).toHaveProperty('status');
			expect(['up', 'down']).toContain(memoryCheck.status);
		});

		it('should check database health', async () => {
			const response = await request(app.getHttpServer()).get('/health').expect(200);

			const dbCheck = response.body.details.ecommerce;
			expect(dbCheck).toHaveProperty('status');
			expect(['up', 'down']).toContain(dbCheck.status);
		});
	});
});
