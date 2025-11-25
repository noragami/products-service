import { Column, Model, Table, Unique } from 'sequelize-typescript';

@Table({
	tableName: 'products',
})
export class Product extends Model {
	@Unique
	@Column
	productToken: string;

	@Column
	name: string;

	@Column
	price: number;

	@Column
	stock: number;
}
