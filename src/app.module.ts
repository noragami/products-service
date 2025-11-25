import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { dataBaseConfig } from './database/database.config';

@Module({
	imports: [ConfigModule.forRoot(), SequelizeModule.forRoot(dataBaseConfig), ProductsModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
