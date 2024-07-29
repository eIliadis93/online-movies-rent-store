export interface Movie {
  uuid: string;
  title: string;
  description: string;
  duration: number;
  poster_url: string;
  pub_date: number;
  rating: number;
  categories: Category[];
  reviews?: Review[];
}

export interface Category {
  name: string;
}

export interface Review {
  author: string;
  content: string;
}

export interface MovieCreate {
  title: string;
  pub_date?: number;
  duration?: number;
  rating?: number;
  description?: string;
  categories: Category[];
}

export interface MovieCount {
  [year: number]: number;
}

export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}