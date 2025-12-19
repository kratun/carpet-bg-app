export interface PaginationType<T> {
  pageIndex: number;
  pageSize: number;
  items: T[];
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  totalCount: number;
}
