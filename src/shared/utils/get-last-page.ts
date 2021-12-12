function getLastPage(total: number, perPage: number): number {
  return Math.ceil(total / perPage);
}
export default getLastPage;
