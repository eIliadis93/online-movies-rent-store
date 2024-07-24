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