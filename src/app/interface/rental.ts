export interface Rental {
  uuid: string;
  rental_date: string;
  return_date: string;
  is_paid?: boolean;
  user: string;
  movie: string;
}

export interface RentalsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Rental[];
}
