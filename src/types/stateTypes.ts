import { ExpenseRes } from "./types";

export interface AuthState {
  loading: boolean;
  error: null;
  user: User | null;
}

export interface ProfileState {
  totalNetIncome: number;
}

export interface ExpenseState {
  expenses: ExpenseRes[];
  loading: boolean;
  error: Error | null;
  addExpenseSuccess: boolean;
  progress: number;
}

export interface User {
  username: string;
  id: string;
  email: string;
  photoUrl: string;
  token: string;
  expiresIn: string;
}

export interface Error {
  message: string;
  statusCode: number;
  requestStatus: "Fail";
}
