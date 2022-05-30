import { ExpenseRes } from "./types";

export interface AuthState {
  loading: boolean;
  user: User | null;
  error: null;
  updateProfileLoading: boolean;
  updateProfileError: Error | null;
  updateProfileSuccess: boolean;
  autoLoginLoading: boolean;
  signUpSuccess: boolean;
  passwordUpdateSuccess: boolean;
  updateProfilePicError: Error | null;
  updateProfilePicLoading: boolean;
  updateProfilePicSuccess: boolean;
  updateIncomeLoading: boolean;
  updateIncomeError: Error | null;
  updateIncomeSuccess: boolean;
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
  netIncome: string;
  savingsPercentage: string;
}

export interface Error {
  message: string;
  statusCode: number;
  requestStatus: "Fail";
}
