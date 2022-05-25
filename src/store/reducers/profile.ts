import { AnyAction } from "redux";
import { ProfileState } from "../../types/stateTypes";

const initialState: ProfileState = {
  totalNetIncome: 45000,
};

export const profileReducer = (state = initialState, action: AnyAction) => {
  return state;
};
