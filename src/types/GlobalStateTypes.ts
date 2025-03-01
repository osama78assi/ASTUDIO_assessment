import { Product, User } from "./APIsResponseTypes";

type Common = {
  currentPage: number;
  recordsPerPage: 5 | 10 | 15 | 20;
  isLoading: boolean;
  error: Error | null;
  searchValue: string; // Search and filter in the client side
};

export type UsersState = {
  totalUsers: number;
  filterField: string;
  filterValue: string;
  users: User[] | null;
} & Common;

export type ProductsState = {
  totalProducts: number;
  products: Product[] | null;
  category: string;
} & Common;
