import { AnyAction } from "redux";
import { AuthState } from "../../types/stateTypes";
import {
  AUTH_UPLOAD_PROFILE_PIC_FAIL,
  AUTH_UPLOAD_PROFILE_PIC_START,
  AUTH_UPLOAD_PROFILE_PIC_SUCCESS,
  AUTH_AUTOLOGIN_FAIL,
  AUTH_AUTOLOGIN_START,
  AUTH_AUTOLOGIN_SUCCESS,
  AUTH_CLEAN_UPDATE_PROFILE_STATE,
  AUTH_FORGOTPASSWORD_FAIL,
  AUTH_FORGOTPASSWORD_START,
  AUTH_FORGOTPASSWORD_SUCCESS,
  AUTH_SIGNIN_FAIL,
  AUTH_SIGNIN_START,
  AUTH_SIGNIN_SUCCESS,
  AUTH_SIGNOUT,
  AUTH_SIGNUP_FAIL,
  AUTH_SIGNUP_START,
  AUTH_SIGNUP_SUCCESS,
  AUTH_UPDATE_PROFILE_FAIL,
  AUTH_UPDATE_PROFILE_START,
  AUTH_UPDATE_PROFILE_SUCCESS,
  CLEAN_UP_AUTH_STATE,
  AUTH_UPDATE_INCOME_START,
  AUTH_UPDATE_INCOME_SUCCESS,
  AUTH_UPDATE_INCOME_FAIL,
} from "../actions/auth";

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  updateProfileError: null,
  updateProfileLoading: false,
  updateProfileSuccess: false,
  autoLoginLoading: false,
  signUpSuccess: false,
  passwordUpdateSuccess: false,
  updateProfilePicError: null,
  updateProfilePicLoading: false,
  updateProfilePicSuccess: false,
  updateIncomeLoading: false,
  updateIncomeError: null,
  updateIncomeSuccess: false,
};

export const authReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case AUTH_UPDATE_PROFILE_START:
      return {
        ...state,
        updateProfileLoading: true,
        updateProfileError: null,
      };
    case AUTH_UPDATE_PROFILE_FAIL:
      return {
        ...state,
        updateProfileLoading: false,
        updateProfileError: action.payload,
      };
    case AUTH_UPDATE_PROFILE_SUCCESS:
      const userUpdated = state.user;
      if (userUpdated) {
        userUpdated.username = action.payload.username;
        return {
          ...state,
          updateProfileLoading: false,
          updateProfileError: null,
          updateProfileSuccess: true,
          user: userUpdated,
        };
      } else return state;

    case AUTH_CLEAN_UPDATE_PROFILE_STATE:
      return {
        ...state,
        updateProfileLoading: false,
        updateProfileError: null,
        updateProfileSuccess: false,
        updateProfilePicError: null,
        updateProfilePicLoading: false,
        updateProfilePicSuccess: false,
      };
    case AUTH_UPLOAD_PROFILE_PIC_START:
      return {
        ...state,
        updateProfilePicError: null,
        updateProfilePicLoading: true,
        updateProfilePicSuccess: false,
      };
    case AUTH_UPLOAD_PROFILE_PIC_SUCCESS:
      const user = state.user;
      if (user) {
        user.photoUrl = action.payload;
        return {
          ...state,
          updateProfilePicError: null,
          updateProfilePicLoading: false,
          updateProfilePicSuccess: true,
          user: user,
        };
      } else {
        return state;
      }

    case AUTH_UPLOAD_PROFILE_PIC_FAIL:
      return {
        ...state,
        updateProfilePicError: action.payload,
        updateProfilePicLoading: false,
        updateProfilePicSuccess: false,
      };
    case AUTH_SIGNIN_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case AUTH_SIGNIN_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        user: action.payload,
      };
    case AUTH_SIGNIN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case AUTH_SIGNOUT:
      localStorage.removeItem("user");
      return initialState;
    case AUTH_AUTOLOGIN_START:
      return {
        ...state,
        autoLoginLoading: true,
      };
    case AUTH_AUTOLOGIN_FAIL:
      return {
        ...state,
        autoLoginLoading: false,
        user: null,
      };
    case AUTH_AUTOLOGIN_SUCCESS:
      return {
        ...state,
        autoLoginLoading: false,
        user: action.payload,
      };
    case AUTH_SIGNUP_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case AUTH_SIGNUP_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        signUpSuccess: true,
      };
    case AUTH_SIGNUP_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        signUpSuccess: false,
      };
    case AUTH_FORGOTPASSWORD_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case AUTH_FORGOTPASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        passwordUpdateSuccess: true,
        error: null,
      };
    case AUTH_FORGOTPASSWORD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        passwordUpdateSuccess: false,
      };
    case AUTH_UPDATE_INCOME_START:
      return {
        ...state,
        updateIncomeLoading: true,
        updateIncomeError: null,
        updateIncomeSuccess: false,
      };
    case AUTH_UPDATE_INCOME_SUCCESS:
      const updatedIncomeUser = state.user;
      if (updatedIncomeUser) {
        updatedIncomeUser.netIncome = action.paylaod.netIncome;
        updatedIncomeUser.savingsPercentage = action.payload.netIncome;
        return {
          ...state,
          updateIncomeLoading: false,
          updateIncomeError: null,
          updateIncomeSuccess: true,
          user: updatedIncomeUser,
        };
      } else {
        return state;
      }
    case AUTH_UPDATE_INCOME_FAIL:
      return {
        ...state,
        updateIncomeLoading: false,
        updateIncomeError: action.payload,
        updateIncomeSuccess: false,
      };

    case CLEAN_UP_AUTH_STATE:
      return initialState;
    default:
      return state;
  }
};
