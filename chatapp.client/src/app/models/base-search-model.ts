export interface BaseSearchModel {
  page?: number;
  size?: number;
  sortColumn?: string;
  sortDirection?: 'ASC' | 'DESC';
}