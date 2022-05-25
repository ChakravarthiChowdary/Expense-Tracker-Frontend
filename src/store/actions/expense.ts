import axios, { AxiosError } from "axios";
import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { ExpenseBody, ExpenseRes } from "../../types/types";
import { RootState } from "../store";

export const ADD_EXPENSE_START = "ADD_EXPENSE_START";
export const ADD_EXPENSE_SUCCESS = "ADD_EXPENSE_SUCCESS";
export const ADD_EXPENSE_FAIL = "ADD_EXPENSE_FAIL";

export const GET_ALL_EXPENSES_START = "GET_ALL_EXPENSES_START";
export const GET_ALL_EXPENSES_SUCCESS = "GET_ALL_EXPENSES_SUCCESS";
export const GET_ALL_EXPENSES_FAIL = "GET_ALL_EXPENSES_FAIL";

export const UPDATE_UPLOAD_PROGRESS = "UPDATE_UPLOAD_PROGRESS";

export const CLEAN_EXPENSE_STATE = "CLEAN_EXPENSE_STATE";

export const addExpense = (
  expense: ExpenseBody,
  files: FileList | null
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch, getState) => {
    try {
      const user = getState().auth.user;
      dispatch({ type: ADD_EXPENSE_START });

      const response = await axios.post(
        "http://localhost:5000/app/v1/expense/addexpense",
        {
          ...expense,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (files && files.length > 0) {
        const formData = new FormData();
        formData.append("image", files[0]);
        formData.append("expenseId", response.data._id);

        const uploadResponse = await axios.post(
          "http://localhost:5000/app/v1/expense/uploadExpenseBill",
          formData,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
            onUploadProgress: (progressEvent) =>
              dispatch({
                type: UPDATE_UPLOAD_PROGRESS,
                payload: Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                ),
              }),
          }
        );
      }

      dispatch({ type: ADD_EXPENSE_SUCCESS, payload: response });
    } catch (error: any) {
      if (error.response.data.errors || error.response.data.error) {
        dispatch({
          type: ADD_EXPENSE_FAIL,
          payload: error.response.data.errors
            ? {
                message: error.response.data.errors[0].msg,
                statusCode: 500,
                requestStatus: "Fail",
              }
            : error.response.data.error,
        });
        return;
      }
      dispatch({ type: ADD_EXPENSE_FAIL, payload: error });
    }
  };
};

export const getAllExpenses = (): ThunkAction<
  void,
  RootState,
  unknown,
  AnyAction
> => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: GET_ALL_EXPENSES_START });
      const user = getState().auth.user;

      const response = await axios.get(
        `http://localhost:5000/app/v1/expense/getExpenses/${user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      response.data.expenses.sort(
        (a: ExpenseRes, b: ExpenseRes) =>
          new Date(b.expenseDate).valueOf() - new Date(a.expenseDate).valueOf()
      );

      dispatch({
        type: GET_ALL_EXPENSES_SUCCESS,
        payload: response.data.expenses,
      });
    } catch (error: any) {
      if (error.response.data.errors || error.response.data.error) {
        dispatch({
          type: GET_ALL_EXPENSES_FAIL,
          payload: error.response.data.errors
            ? {
                message: error.response.data.errors[0].msg,
                statusCode: 500,
                requestStatus: "Fail",
              }
            : error.response.data.error,
        });
        return;
      }
      dispatch({ type: GET_ALL_EXPENSES_FAIL, payload: error });
    }
  };
};
