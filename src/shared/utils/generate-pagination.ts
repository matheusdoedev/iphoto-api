import { PaginatedResultDto } from '../schemas/pagination-result.dto';
import getLastPage from './get-last-page';

async function generatePagination<T>(
  items: T[],
  page: number,
  perPage: number,
): Promise<PaginatedResultDto<T> | string> {
  const total = items.length;
  const includedItems = page * perPage;
  const lastPage = getLastPage(total, perPage);

  return {
    page,
    perPage,
    total,
    lastPage,
    data: items.filter((photo, index) => photo && index < includedItems),
  };
}

export default generatePagination;
