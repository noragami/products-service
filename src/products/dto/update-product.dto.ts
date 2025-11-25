import { PickType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PickType(CreateProductDto, ['stock'] as const) {}
