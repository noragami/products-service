# Products Service API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

A robust **Products Management API** built with **NestJS**, **TypeScript**, and **Sequelize**. This service provides complete CRUD operations for product management with advanced features like pagination, validation, health monitoring, and comprehensive testing.

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
git clone <repository-url>
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
docker-compose up -d

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
docker-compose up -d
```

#### **2. Start Application**
```bash
# Option A: Local development (recommended)
npm run start:dev

# Option B: Docker container
docker run -p 3000:3000 products-service
```

#### **3. Verify Setup**
```bash
# Check health endpoint
curl http://localhost:3000/health

# Test products API
curl http://localhost:3000/products
```

### **Production**
```bash
# Build the application
npm run build

# Start production server
npm run start:prod
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
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "productToken": "PROD001",
    "name": "Gaming Laptop",
    "price": 1299.99,
    "stock": 15
  }'
```

### **Get Products with Pagination**
```bash
curl "http://localhost:3000/products?page=1&limit=10"
```

### **Update Stock**
```bash
curl -X PATCH http://localhost:3000/products/1 \
  -H "Content-Type: application/json" \
  -d '{"stock": 25}'
```

### **Health Check**
```bash
curl http://localhost:3000/health
```

## 🔍 Response Examples

### **Paginated Products**
```json
{
  "data": [
    {
      "id": 1,
      "productToken": "PROD001",
      "name": "Gaming Laptop",
      "price": 1299.99,
      "stock": 15,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
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

### **Health Status**
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

## 🚀 Deployment

### **Docker** (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
```

### **Environment Variables**
```env
NODE_ENV=production
DB_HOST=your-production-db-host
DB_PORT=3306
DB_USERNAME=your-production-user
DB_PASSWORD=your-production-password
DB_DATABASE=ecommerce
PORT=3000
```

### **Production Database Setup**
```bash
# Run migrations on production database
NODE_ENV=production npx sequelize-cli db:migrate

# Check migration status
NODE_ENV=production npx sequelize-cli db:migrate:status
```

## 🔧 Troubleshooting

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

#### **Port Already in Use**
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
