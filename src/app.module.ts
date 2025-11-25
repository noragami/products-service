import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { dataBaseConfig } from './database/database.config';
import { TerminusModule } from '@nestjs/terminus';

@Module({
	imports: [
		ConfigModule.forRoot(),
		SequelizeModule.forRoot(dataBaseConfig),
		ProductsModule,
		TerminusModule,
	],
	controllers: [AppController],
	providers: [],
})
export class AppModule {}
