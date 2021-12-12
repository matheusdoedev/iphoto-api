export class PaginatedResultDto<T> {
  page: number;
  perPage: number;
  total: number;
  lastPage: number;
  data: T[];
}
