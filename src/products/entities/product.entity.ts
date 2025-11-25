import { Column, Model, Table, Unique } from 'sequelize-typescript';

@Table({
	tableName: 'products',
})
export class Product extends Model {
	@Unique
	@Column
	declare productToken: string;

	@Column
	declare name: string;

	@Column
	declare price: number;

	@Column
	declare stock: number;
}
