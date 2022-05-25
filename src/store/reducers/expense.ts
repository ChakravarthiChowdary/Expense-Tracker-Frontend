import { AnyAction } from "redux";
import { ExpenseState } from "../../types/stateTypes";
import {
  ADD_EXPENSE_FAIL,
  ADD_EXPENSE_START,
  ADD_EXPENSE_SUCCESS,
  CLEAN_EXPENSE_STATE,
  GET_ALL_EXPENSES_FAIL,
  GET_ALL_EXPENSES_START,
  GET_ALL_EXPENSES_SUCCESS,
  UPDATE_UPLOAD_PROGRESS,
} from "../actions/expense";

const initialState: ExpenseState = {
  expenses: [],
  loading: false,
  error: null,
  addExpenseSuccess: false,
  progress: 0,
};

export const expenseReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case ADD_EXPENSE_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADD_EXPENSE_SUCCESS:
      const expenses = state.expenses;
      expenses.push(action.payload);
      return {
        ...state,
        loading: false,
        error: null,
        expenses,
        addExpenseSuccess: true,
      };
    case ADD_EXPENSE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_ALL_EXPENSES_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_ALL_EXPENSES_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        expenses: action.payload,
      };
    case GET_ALL_EXPENSES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_UPLOAD_PROGRESS:
      return {
        ...state,
        progress: action.payload,
      };
    case CLEAN_EXPENSE_STATE:
      return initialState;
    default:
      return state;
  }
};
