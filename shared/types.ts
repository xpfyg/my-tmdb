export interface CloudResource {
  id: number;
  drama_name: string;
  alias: string;
  category1: string;
  category2: string;
  drive_type: string;
  link: string;
  is_expired: number;
  view_count: number;
  share_count: number;
  hot: number;
  size: string;
  tmdb_id: number | null;
  last_share_time: Date | null;
  create_time: Date;
  update_time: Date;
}

export interface TMDBResource {
  id: number;
  tmdb_code: string;
  title: string;
  year_released: number | null;
  category: string | null;
  description: string | null;
  poster_url: string | null;
  create_time: Date;
  update_time: Date;
}

export interface ResourceWithDetails {
  id: number;
  drama_name: string;
  alias: string;
  category1: string;
  category2: string;
  drive_type: string;
  link: string;
  is_expired: number;
  view_count: number;
  share_count: number;
  hot: number;
  size: string;
  tmdb_id: number | null;
  last_share_time: Date | null;
  create_time: Date;
  update_time: Date;
  // TMDB关联字段
  tmdb_code?: string;
  title?: string;
  year_released?: number;
  category?: string;
  description?: string;
  poster_url?: string;
}

export interface SearchParams {
  keyword?: string;
  category1?: string;
  category2?: string;
  drive_type?: string;
  page?: number;
  limit?: number;
  sort?: 'hot' | 'view_count' | 'create_time' | 'title';
  order?: 'ASC' | 'DESC';
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ShareLink {
  id: number;
  resource_id: number;
  share_url: string;
  share_title: string;
  share_description: string;
  created_at: Date;
}