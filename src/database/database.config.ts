import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Product } from '../products/entities/product.entity';

export const dataBaseConfig: SequelizeModuleOptions = {
	dialect: 'mysql',
	host: process.env.host ?? 'localhost',
	port: parseInt(process.env.port || '3306'),
	username: process.env.username ?? 'root',
	password: process.env.password ?? 'root',
	database: 'ecommerce',
	models: [Product],
	autoLoadModels: true,
	synchronize: true,
};
