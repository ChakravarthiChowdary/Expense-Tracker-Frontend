import { applyMiddleware, combineReducers, createStore, Action } from "redux";
import thunk, { ThunkDispatch } from "redux-thunk";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { authReducer } from "./reducers/auth";
import { profileReducer } from "./reducers/profile";
import { expenseReducer } from "./reducers/expense";

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  expense: expenseReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type ThunkAction<R, S, E, A extends Action> = (
  dispatch: ThunkDispatch<S, E, A>,
  getState: () => S,
  extraArgument: E
) => R;
