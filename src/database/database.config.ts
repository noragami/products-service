import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Product } from '../products/entities/product.entity';

export const dataBaseConfig: SequelizeModuleOptions = {
	dialect: 'mysql',
	host: process.env.DB_HOST ?? 'localhost',
	port: parseInt(process.env.DB_PORT || '3306'),
	username: process.env.DB_USERNAME ?? 'root',
	password: process.env.DB_PASSWORD ?? 'root',
	database: process.env.DB_DATABASE ?? 'ecommerce',
	models: [Product],
	autoLoadModels: false,
	synchronize: false,
};
