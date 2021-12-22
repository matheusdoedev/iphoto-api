import { PaginationDto } from 'src/shared/schemas/pagination.dto';

export class GetUserPhotosDto extends PaginationDto {
  albumId?: string;
}
