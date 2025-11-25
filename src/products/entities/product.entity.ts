import { Column, DataType, Model, Table, Unique } from 'sequelize-typescript';

@Table({
	tableName: 'products',
})
export class Product extends Model {
	@Unique
	@Column(DataType.STRING(50))
	declare productToken: string;

	@Column(DataType.STRING(100))
	declare name: string;

	@Column(DataType.DECIMAL(8, 2))
	declare price: number;

	@Column(DataType.INTEGER)
	declare stock: number;
}
