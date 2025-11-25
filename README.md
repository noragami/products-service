# Products Service API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

**Products Management API** is built with **NestJS**, **TypeScript**, and **Sequelize**. This service provides CRUD operations for product management with advanced features like pagination, validation, health monitoring, and comprehensive testing.

## 🚀 Features

### **Core API**
- ✅ **Full CRUD Operations** - Create, Read, Update, Delete products
- ✅ **Advanced Pagination** - Offset-based pagination with metadata
- ✅ **Robust Validation** - Input validation with class-validator
- ✅ **Error Handling** - HTTP-compliant error responses
- ✅ **Auto Documentation** - Swagger/OpenAPI integration

### **Data Management**
- ✅ **Type Safety** - Full TypeScript coverage
- ✅ **Database ORM** - Sequelize with MySQL support
- ✅ **Database Migrations** - Version-controlled schema management
- ✅ **Data Validation** - Comprehensive DTO validation
- ✅ **Unique Constraints** - Duplicate prevention
- ✅ **Performance Indexes** - Optimized pagination queries

### **Production Ready**
- ✅ **Health Monitoring** - Memory and database health checks
- ✅ **Comprehensive Testing** - Unit and E2E tests
- ✅ **Performance Optimized** - Efficient database queries
- ✅ **Security** - Input sanitization and validation

## 📊 API Endpoints

### **Products**
```
GET    /products           # Get paginated products list
GET    /products/:id       # Get product by ID
POST   /products           # Create new product
PATCH  /products/:id       # Update product stock
DELETE /products/:id       # Delete product (idempotent)
```

### **Health Monitoring**
```
GET    /health            # Application health status
```

### **API Documentation**
```
GET    /api               # Swagger UI documentation
```

## 🏗️ Architecture

### **Project Structure**
```
src/
├── products/
│   ├── dto/                 # Data Transfer Objects
│   │   ├── create-product.dto.ts
│   │   └── update-product.dto.ts
│   ├── entities/
│   │   └── product.entity.ts
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── products.module.ts
├── common/
│   ├── dto/
│   │   └── pagination.dto.ts
│   ├── interfaces/
│   │   └── paginated-response.interface.ts
│   └── utils/
│       └── pagination.helper.ts
├── database/
│   └── database.config.ts
├── sequelize/               # Database migrations
│   ├── config.js           # Sequelize configuration
│   └── migrations/         # Migration files
│       ├── 20251125113230-create-products-table.js
│       └── 20251125115435-add-indexes-products-table.js
├── app.controller.ts        # Health checks
├── app.module.ts
└── main.ts
```

### **Database Schema**
```sql
products (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  productToken    VARCHAR(50) UNIQUE NOT NULL,
  name            VARCHAR(100) NOT NULL,
  price           DECIMAL(8,2) NOT NULL,
  stock           INT NOT NULL,
  createdAt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Indexes for optimized pagination
  INDEX idx_products_created_id (createdAt DESC, id ASC)
)
```

## 🛠️ Tech Stack

### **Core Framework**
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **Node.js** - Runtime environment

### **Database & ORM**
- **MySQL** - Production database
- **Sequelize** - TypeScript ORM
- **SQLite** - Testing database

### **Validation & Documentation**
- **class-validator** - Decorator-based validation
- **class-transformer** - Object transformation
- **Swagger/OpenAPI** - API documentation

### **Testing & Quality**
- **Jest** - Testing framework
- **Supertest** - HTTP testing
- **ESLint** - Code linting
- **Prettier** - Code formatting

### **Monitoring & Health**
- **@nestjs/terminus** - Health checks
- **Memory monitoring** - Heap usage tracking
- **Database monitoring** - Connection health

## 🔧 Installation & Setup

### **Prerequisites**
- Node.js (≥ 18.x)
- Docker & Docker Compose
- npm
- sequelize-cli (migrations)

### **1. Clone & Install**
```bash
git clone https://github.com/noragami/products-service.git
cd products-service
npm install
```

### **2. Environment Configuration**
Copy the example environment file and configure:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=ecommerce

# Application
PORT=3000
NODE_ENV=development
```

### **3. Database Setup**
```bash
# Start MySQL with Docker Compose (creates database automatically)
docker-compose up mysql -d

# Run database migrations to create tables and indexes
npx sequelize-cli db:migrate

# Optional: If you need to rollback migrations
# npx sequelize-cli db:migrate:undo
```

## 🚀 Development Workflow

### **Step-by-Step Setup for Local Development**

#### **1. Start Database**
```bash
# Start MySQL container (required for manual testing)
docker-compose up mysql -d
```

#### **2. Start Application**
```bash
npm run start:dev
```

#### **3. Verify Setup**
```bash
# Check health endpoint
curl http://localhost:3000/health

# Test products API
curl http://localhost:3000/products
```

### **Access Points**
- **Products API**: http://localhost:3000/products
- **API Documentation**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health

## 🧪 Testing

### **Automated Testing (No Database Required)**
Our test suite uses **SQLite in-memory** for maximum speed and isolation:

```bash
# Unit tests (mocked dependencies)
npm run test

# E2E tests (SQLite in-memory database)
npm run test:e2e

# Test coverage
npm run test:cov

# Test in watch mode
npm run test:watch
```

### **Why SQLite for Tests?**
- ⚡ **Fast startup**: No external database needed
- 🔒 **Isolated**: Each test gets a fresh database
- 🚀 **CI/CD friendly**: Runs anywhere without dependencies
- 📊 **Same ORM**: Sequelize behavior is identical

### **Test Coverage**
- **Unit Tests**: Controllers and services with mocked dependencies
- **E2E Tests**: Full API workflow with SQLite in-memory database
- **Integration**: Real database operations (SQLite)
- **Health Checks**: Memory and database monitoring

### **Manual Testing**
For manual API testing, follow the [Development Workflow](#-development-workflow) above.

## 📝 API Usage Examples

### **Create Product**
**Request:**
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "productToken": "pdtkn001",
    "name": "HD Monitor",
    "price": 1299.99,
    "stock": 15
  }'
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "productToken": "pdtkn001",
  "name": "HD Monitor",
  "price": 1299.99,
  "stock": 15,
  "createdAt": "2025-11-25T10:30:00Z",
  "updatedAt": "2025-11-25T10:30:00Z"
}
```

### **Get Products with Pagination**
**Request:**
```bash
curl "http://localhost:3000/products?page=1&limit=10"
```

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "productToken": "pdtkn001",
      "name": "HD Monitor",
      "price": 1299.99,
      "stock": 15,
      "createdAt": "2025-11-25T10:30:00Z",
      "updatedAt": "2025-11-25T10:30:00Z"
    }
  ],
  "meta": {
    "currentPage": 1,
    "itemsPerPage": 10,
    "totalItems": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

### **Get Single Product**
**Request:**
```bash
curl http://localhost:3000/products/1
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "productToken": "pdtkn001",
  "name": "HD Monitor",
  "price": 1299.99,
  "stock": 15,
  "createdAt": "2025-11-25T10:30:00Z",
  "updatedAt": "2025-11-25T10:30:00Z"
}
```

**Error Response:** `404 Not Found`
```json
{
  "message": "Product with id 999 not found",
  "error": "Not Found",
  "statusCode": 404
}
```

### **Update Product Stock**
**Request:**
```bash
curl -X PATCH http://localhost:3000/products/1 \
  -H "Content-Type: application/json" \
  -d '{"stock": 25}'
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "productToken": "pdtkn001",
  "name": "HD Monitor",
  "price": 1299.99,
  "stock": 25,
  "createdAt": "2025-11-25T10:30:00Z",
  "updatedAt": "2025-11-25T12:15:00Z"
}
```

### **Delete Product**
**Request:**
```bash
curl -X DELETE http://localhost:3000/products/1
```

**Response:** `204 No Content`
```
(Empty response body)
```

### **Health Check**
**Request:**
```bash
curl http://localhost:3000/health
```

**Response:** `200 OK`
```json
{
  "status": "ok",
  "info": {
    "memory_heap": { "status": "up" },
    "ecommerce": { "status": "up" }
  },
  "error": {},
  "details": {
    "memory_heap": { "status": "up" },
    "ecommerce": { "status": "up" }
  }
}
```


## 🛡️ Validation Rules

### **Product Creation**
- **productToken**: 3-50 chars, alphanumeric, unique
- **name**: 3-100 chars, letters/numbers/spaces/hyphens/underscores
- **price**: Positive decimal, max 2 decimals, ≤ 999,999.99
- **stock**: Non-negative integer, ≤ 999,999

### **Product Update**
- **stock**: Non-negative integer, ≤ 999,999

## 🔧 Configuration

### **Database Config** (`src/database/database.config.ts`)
- Sequelize configuration

### **Validation Config** (`src/main.ts`)
- Global validation pipe
- Transform enabled

## 📊 Performance Features

- **Optimized Queries**: `findAndCountAll` for pagination
- **Database Indexes**: Composite index on (createdAt DESC, id ASC) for efficient pagination
- **Consistent Ordering**: Deterministic sort with tiebreakers
- **Input Validation**: Early request filtering
- **Memory Monitoring**: Heap usage tracking

## 🚀 Deployment via Docker

### **🐳 Complete Docker Setup**

The service includes a full Docker setup with multi-stage builds, health checks, and production optimizations.

#### **Quick Start (Recommended)**
```bash
# Option 1) Build and start all services (MySQL + Products API)
docker-compose up --build

# Option 2) Run in background
docker-compose up --build -d
```

```bash
# Check services status
docker-compose ps
```

#### **Production Deployment**
```bash
# Build production images
docker-compose build

# Start services with restart policies
docker-compose up -d

# Run database migrations
docker-compose exec products-service npx sequelize-cli db:migrate

# Verify deployment
curl http://localhost:3000/health
```

### **🏗️ Docker Architecture**

#### **Multi-Stage Dockerfile**
- **Builder stage**: Compiles TypeScript to JavaScript
- **Production stage**: Minimal runtime with security optimizations
- **Non-root user**: Runs as `nestjs:nodejs` (uid: 1001)
- **Health checks**: Built-in `/health` endpoint monitoring

#### **Services Configuration**
```yaml
services:
  mysql:          # MySQL 9 database
  products-service: # NestJS API service
```

### **📋 Available Commands**

#### **Service Management**
```bash
# Start only database (for local development)
docker-compose up mysql -d

# Rebuild specific service
docker-compose build products-service

# Restart services
docker-compose restart

# Stop all services
docker-compose down

# Remove volumes (⚠️ deletes data)
docker-compose down -v
```

#### **Database Operations**
```bash
# Run migrations
docker-compose exec products-service npx sequelize-cli db:migrate

# Check migration status
docker-compose exec products-service npx sequelize-cli db:migrate:status

# Rollback last migration
docker-compose exec products-service npx sequelize-cli db:migrate:undo

# Access MySQL directly
docker-compose exec mysql mysql -u root -proot ecommerce
```

#### **Monitoring & Debugging**
```bash
# View logs
docker-compose logs products-service

# Follow logs in real-time
docker-compose logs -f products-service

# Access container shell
docker-compose exec products-service sh

# Check container resource usage
docker stats $(docker-compose ps -q)
```

### **🌍 Environment Configuration**

#### **Production Environment Variables**
```env
NODE_ENV=production
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=ecommerce
PORT=3000
```

### **🚀 Production Deployment Options**

#### **Option 1: Docker Compose**
```bash
# Clone repository
git clone https://github.com/noragami/products-service.git
cd products-service

# Configure environment
cp .env.example .env
# Edit .env with your production values

# Deploy
docker-compose up --build -d

# Run migrations
docker-compose exec products-service npx sequelize-cli db:migrate
```

#### **Option 2: Standalone Docker**
```bash
# Build image
docker build -t products-service .

# Run with external database
docker run -d \
  --name products-service \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DB_HOST=your-db-host \
  -e DB_USERNAME=your-user \
  -e DB_PASSWORD=your-password \
  products-service
```


## 🔧 General Troubleshooting

### **Common Issues**

#### **Database Connection Errors**
```bash
# Ensure MySQL container is running
docker-compose ps

# Check MySQL logs
docker-compose logs mysql

# Restart database if needed
docker-compose restart mysql
```

#### **Migration Issues**
```bash
# Check migration status
npx sequelize-cli db:migrate:status

# Rollback last migration if needed
npx sequelize-cli db:migrate:undo

# Run specific migration
npx sequelize-cli db:migrate --to 20251125115435-add-indexes-products-table.js
```

#### **Port Already in Use (Local)**
```bash
# Check what's using port 3000
lsof -i :3000

# Use different port
PORT=3001 npm run start:dev
```

#### **Test Failures**
Tests use SQLite in-memory, so database issues are unlikely:
```bash
# Clean install and retry
rm -rf node_modules package-lock.json
npm install
npm run test
```

## 📚 Documentation

- **API Docs**: Available at `/api` when running
- **Health Monitoring**: Available at `/health`
- **Code Coverage**: Generated in `coverage/` directory

## 📄 License

This project is [MIT licensed](LICENSE).

## 👨‍💻 Author

[Daniele Dell'Erba](https://github.com/noragami)