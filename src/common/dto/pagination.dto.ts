import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
    @Type(() => Number)
    @IsOptional()
    @IsInt({
        message: 'Page must be an integer'
    })
    @Min(1, {
        message: 'Page must be at least 1'
    })
    readonly page: number = 1;

    @Type(() => Number)
    @IsOptional()
    @IsInt({
        message: 'Limit must be an integer'
    })
    @Min(1, {
        message: 'Limit must be at least 1'
    })
    @Max(100, {
        message: 'Limit cannot exceed 100'
    })
    readonly limit: number = 10;

    get offset(): number {
        return (this.page - 1) * this.limit;
    }
}