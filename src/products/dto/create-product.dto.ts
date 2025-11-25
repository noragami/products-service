import {
	IsNotEmpty,
	IsNumber,
	IsString,
	Matches,
	MinLength,
	MaxLength,
	IsInt,
	IsPositive,
	Min,
	Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
	@IsNotEmpty({
		message: 'Product name cannot be empty',
	})
	@IsString({
		message: 'Product name must be a string',
	})
	@MinLength(3, {
		message: 'Product name must be at least 3 characters long',
	})
	@MaxLength(100, {
		message: 'Product name must not exceed 100 characters',
	})
	@Matches(/^[a-zA-Z0-9àáâãäåçèéêëìíîïñòóôõöùúûüýÿ\s\-_]+$/, {
		message: 'Product name must only contain letters, numbers, spaces, hyphens, and underscores',
	})
	@ApiProperty()
	readonly name: string;

	@IsNotEmpty({
		message: 'Product token cannot be empty',
	})
	@IsString({
		message: 'Product token must be a string',
	})
	@MinLength(3, {
		message: 'Product token must be at least 3 characters long',
	})
	@MaxLength(50, {
		message: 'Product token must not exceed 50 characters',
	})
	@Matches(/^[a-zA-Z0-9]+$/, {
		message: 'Product token must only contain letters and numbers',
	})
	@ApiProperty()
	readonly productToken: string;

	@IsNotEmpty({
		message: 'Price cannot be empty',
	})
	@IsNumber(
		{ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
		{
			message: 'Price must be a number with maximum 2 decimal places',
		},
	)
	@IsPositive({
		message: 'Price must be positive',
	})
	@Max(999999.99, {
		message: 'Price cannot exceed 999,999.99',
	})
	@ApiProperty()
	readonly price: number;

	@IsNotEmpty({
		message: 'Stock cannot be empty',
	})
	@IsInt({
		message: 'Stock must be an integer',
	})
	@Min(0, {
		message: 'Stock cannot be negative',
	})
	@Max(999999, {
		message: 'Stock cannot exceed 999,999',
	})
	@ApiProperty()
	readonly stock: number;
}
