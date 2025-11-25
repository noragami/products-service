import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SequelizeModule, getModelToken } from '@nestjs/sequelize';
import request from 'supertest';
import { ProductsModule } from '../src/products/products.module';
import { Product } from '../src/products/entities/product.entity';

describe('Products (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let createdProductId: number;

  const validProduct = {
    productToken: 'TEST123',
    name: 'Test Product',
    price: 29.99,
    stock: 100,
  };

  const validProduct2 = {
    productToken: 'TEST456',
    name: 'Another Test Product',
    price: 49.99,
    stock: 50,
  };

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        ProductsModule,
        SequelizeModule.forRoot({
          dialect: 'sqlite',
          storage: ':memory:',
          models: [Product],
          autoLoadModels: true,
          synchronize: true,
          logging: false,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    // Close the NestJS application
    if (app) {
      await app.close();
    }
  });

  afterEach(async () => {
    // Clean up database after each test
    const productModel = app.get(getModelToken(Product));
    await productModel.destroy({ where: {}, truncate: true });
  });

  describe('POST /products', () => {
    it('should create a product successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/products')
        .send(validProduct)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(Number),
        productToken: validProduct.productToken,
        name: validProduct.name,
        price: validProduct.price,
        stock: validProduct.stock,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      createdProductId = response.body.id;
    });

    it('should return 409 when productToken already exists', async () => {
      // Create first product
      await request(app.getHttpServer())
        .post('/products')
        .send(validProduct)
        .expect(201);

      // Try to create product with same token
      const response = await request(app.getHttpServer())
        .post('/products')
        .send(validProduct)
        .expect(409);

      expect(response.body.message).toContain('already exists');
    });

    it('should return 400 for invalid product data', async () => {
      const invalidProduct = {
        productToken: 'AB', // Too short
        name: '', // Empty
        price: -10, // Negative
        stock: 'invalid', // Not a number
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .send(invalidProduct)
        .expect(400);

      expect(response.body.message).toBeInstanceOf(Array);
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteProduct = {
        name: 'Test Product',
        // Missing productToken, price, stock
      };

      await request(app.getHttpServer())
        .post('/products')
        .send(incompleteProduct)
        .expect(400);
    });

    it('should return 400 for extra fields (forbidNonWhitelisted)', async () => {
      const productWithExtraFields = {
        ...validProduct,
        extraField: 'should not be allowed',
      };

      await request(app.getHttpServer())
        .post('/products')
        .send(productWithExtraFields)
        .expect(400);
    });
  });

  describe('GET /products', () => {
    beforeEach(async () => {
      // Create test data
      await request(app.getHttpServer())
        .post('/products')
        .send(validProduct)
        .expect(201);

      await request(app.getHttpServer())
        .post('/products')
        .send(validProduct2)
        .expect(201);
    });

    it('should return paginated products with default pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .expect(200);

      expect(response.body).toMatchObject({
        data: expect.any(Array),
        meta: {
          currentPage: 1,
          itemsPerPage: 10,
          totalItems: 2,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });

      expect(response.body.data).toHaveLength(2);
    });

    it('should return paginated products with custom pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/products?page=1&limit=1')
        .expect(200);

      expect(response.body).toMatchObject({
        data: expect.any(Array),
        meta: {
          currentPage: 1,
          itemsPerPage: 1,
          totalItems: 2,
          totalPages: 2,
          hasNextPage: true,
          hasPreviousPage: false,
        },
      });

      expect(response.body.data).toHaveLength(1);
    });

    it('should return 400 for invalid pagination parameters', async () => {
      await request(app.getHttpServer())
        .get('/products?page=0&limit=101')
        .expect(400);
    });

    it('should return empty results for page beyond data', async () => {
      const response = await request(app.getHttpServer())
        .get('/products?page=10&limit=10')
        .expect(200);

      expect(response.body.data).toHaveLength(0);
      expect(response.body.meta.totalItems).toBe(2);
    });
  });

  describe('GET /products/:id', () => {
    let productId: number;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/products')
        .send(validProduct)
        .expect(201);
      productId = response.body.id;
    });

    it('should return a product by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: productId,
        productToken: validProduct.productToken,
        name: validProduct.name,
        price: validProduct.price,
        stock: validProduct.stock,
      });
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app.getHttpServer())
        .get('/products/99999')
        .expect(404);

      expect(response.body.message).toContain('not found');
    });

    it('should return 400 for invalid id format', async () => {
      await request(app.getHttpServer())
        .get('/products/invalid-id')
        .expect(400);
    });
  });

  describe('PATCH /products/:id', () => {
    let productId: number;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/products')
        .send(validProduct)
        .expect(201);
      productId = response.body.id;
    });


    it('should update product stock successfully', async () => {
      const updateData = { stock: 75 };

      const response = await request(app.getHttpServer())
        .patch(`/products/${productId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toMatchObject({
        id: productId,
        stock: 75,
        updatedAt: expect.any(String),
      });

      // Verify the update persisted
      const getResponse = await request(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(200);

      expect(getResponse.body.stock).toBe(75);
    });

    it('should return 404 for non-existent product', async () => {
      const updateData = { stock: 75 };

      const response = await request(app.getHttpServer())
        .patch('/products/99999')
        .send(updateData)
        .expect(404);

      expect(response.body.message).toContain('not found');
    });

    it('should return 400 for invalid stock value', async () => {
      const invalidUpdateData = { stock: -5 };

      await request(app.getHttpServer())
        .patch(`/products/${productId}`)
        .send(invalidUpdateData)
        .expect(400);
    });

    it('should return 400 for non-whitelisted fields', async () => {
      const invalidUpdateData = {
        stock: 75,
        name: 'Should not be allowed', // Only stock is allowed
      };

      await request(app.getHttpServer())
        .patch(`/products/${productId}`)
        .send(invalidUpdateData)
        .expect(400);
    });

    it('should allow stock to be zero', async () => {
      const updateData = { stock: 0 };

      const response = await request(app.getHttpServer())
        .patch(`/products/${productId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.stock).toBe(0);
    });
  });

  describe('DELETE /products/:id', () => {
    let productId: number;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/products')
        .send(validProduct)
        .expect(201);
      productId = response.body.id;
    });

    it('should delete a product successfully (204 No Content)', async () => {
      await request(app.getHttpServer())
        .delete(`/products/${productId}`)
        .expect(204);

      // Verify product is deleted by checking it's not in the list anymore
      const listResponse = await request(app.getHttpServer())
        .get('/products')
        .expect(200);

      expect(listResponse.body.data).toHaveLength(0);
      expect(listResponse.body.meta.totalItems).toBe(0);
    });

    it('should return 204 for non-existent product (idempotent)', async () => {
      await request(app.getHttpServer())
        .delete('/products/99999')
        .expect(204);
    });

    it('should return 400 for invalid id format', async () => {
      await request(app.getHttpServer())
        .delete('/products/invalid-id')
        .expect(400);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete CRUD workflow', async () => {
      // Create
      const createResponse = await request(app.getHttpServer())
        .post('/products')
        .send(validProduct)
        .expect(201);

      const productId = createResponse.body.id;

      // Read
      const readResponse = await request(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(200);

      expect(readResponse.body.id).toBe(productId);

      // Update
      await request(app.getHttpServer())
        .patch(`/products/${productId}`)
        .send({ stock: 25 })
        .expect(200);

      // List
      const listResponse = await request(app.getHttpServer())
        .get('/products')
        .expect(200);

      expect(listResponse.body.data).toHaveLength(1);
      expect(listResponse.body.data[0].stock).toBe(25);

      // Delete
      await request(app.getHttpServer())
        .delete(`/products/${productId}`)
        .expect(204);

      // Verify deletion
      const finalListResponse = await request(app.getHttpServer())
        .get('/products')
        .expect(200);

      expect(finalListResponse.body.data).toHaveLength(0);
    });

    it('should maintain data consistency across operations', async () => {
      // Create multiple products
      const product1Response = await request(app.getHttpServer())
        .post('/products')
        .send(validProduct)
        .expect(201);

      const product2Response = await request(app.getHttpServer())
        .post('/products')
        .send(validProduct2)
        .expect(201);

      // Update one product
      await request(app.getHttpServer())
        .patch(`/products/${product1Response.body.id}`)
        .send({ stock: 0 })
        .expect(200);

      // Verify both products exist with correct data
      const listResponse = await request(app.getHttpServer())
        .get('/products')
        .expect(200);

      expect(listResponse.body.data).toHaveLength(2);

      const updatedProduct = listResponse.body.data.find(
        (p: any) => p.id === product1Response.body.id
      );
      const unchangedProduct = listResponse.body.data.find(
        (p: any) => p.id === product2Response.body.id
      );

      expect(updatedProduct.stock).toBe(0);
      expect(unchangedProduct.stock).toBe(50);
    });
  });
});