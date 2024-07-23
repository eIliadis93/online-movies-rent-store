export interface Movie {
  uuid: string;
  title: string;
  description: string;
  duration: number;
  poster_url: string;
  pub_date: number;
  rating: number;
  categories: Category[];
}

export interface Category {
  name: string;
}
