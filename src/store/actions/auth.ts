import axios from "axios";
import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { User } from "../../types/stateTypes";
import { RootState } from "../store";

export const AUTH_AUTOLOGIN_START = "AUTH_AUTOLOGIN_START";
export const AUTH_AUTOLOGIN_SUCCESS = "AUTH_AUTOLOGIN_SUCCESS";
export const AUTH_AUTOLOGIN_FAIL = "AUTH_AUTOLOGIN_FAIL";

export const AUTH_SIGNUP_START = "AUTH_SIGNUP_START";
export const AUTH_SIGNUP_SUCCESS = "AUTH_SIGNUP_SUCCESS";
export const AUTH_SIGNUP_FAIL = "AUTH_SIGNUP_FAIL";

export const AUTH_SIGNIN_START = "AUTH_SIGNIN_START";
export const AUTH_SIGNIN_SUCCESS = "AUTH_SIGNIN_SUCCESS";
export const AUTH_SIGNIN_FAIL = "AUTH_SIGNIN_FAIL";

export const AUTH_SIGNOUT = "AUTH_SIGNOUT";

export const AUTH_UPDATE_PROFILE_START = "AUTH_UPDATE_PROFILE_START";
export const AUTH_UPDATE_PROFILE_SUCCESS = "AUTH_UPDATE_PROFILE_SUCCESS";
export const AUTH_UPDATE_PROFILE_FAIL = "AUTH_UPDATE_PROFILE_FAIL";

export const AUTH_UPLOAD_PROFILE_PIC_START = "AUTH_UPLOAD_PROFILE_PIC_START";
export const AUTH_UPLOAD_PROFILE_PIC_SUCCESS =
  "AUTH_UPLOAD_PROFILE_PIC_SUCCESS";
export const AUTH_UPLOAD_PROFILE_PIC_FAIL = "AUTH_UPLOAD_PROFILE_PIC_FAIL";

export const AUTH_FORGOTPASSWORD_START = "AUTH_FORGOTPASSWORD_START";
export const AUTH_FORGOTPASSWORD_SUCCESS = "AUTH_FORGOTPASSWORD_SUCCESS";
export const AUTH_FORGOTPASSWORD_FAIL = "AUTH_FORGOTPASSWORD_FAIL";

export const CLEAN_UP_AUTH_STATE = "CLEAN_UP_AUTH_STATE";

export const AUTH_UPDATE_UPLOAD_PROGRESS = "AUTH_UPDATE_UPLOAD_PROGRESS";

export const AUTH_CLEAN_UPDATE_PROFILE_STATE =
  "AUTH_CLEAN_UPDATE_PROFILE_STATE";

export const AUTH_UPDATE_INCOME_START = "AUTH_UPDATE_INCOME_START";
export const AUTH_UPDATE_INCOME_FAIL = "AUTH_UPDATE_INCOME_FAIL";
export const AUTH_UPDATE_INCOME_SUCCESS = "AUTH_UPDATE_INCOME_SUCCESS";

export const updateProfile = (userDetails: {
  username: string;
  passwordUpdated: boolean;
  password: string;
  confirmPassword: string;
  id: string;
}): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch, getState) => {
    try {
      const user = getState().auth.user;
      dispatch({ type: AUTH_UPDATE_PROFILE_START });
      const response = await fetch(
        "http://localhost:5000/app/v1/auth/updateProfile",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(userDetails),
        }
      );
      const result = await response.json();

      if (result.errors || result.error) {
        dispatch({
          type: AUTH_UPDATE_PROFILE_FAIL,
          payload: result.errors
            ? {
                message: result.errors[0].msg,
                statusCode: 500,
                requestStatus: "Fail",
              }
            : result.error,
        });
        return;
      }

      dispatch({ type: AUTH_UPDATE_PROFILE_SUCCESS, payload: userDetails });
    } catch (error) {
      dispatch({ type: AUTH_UPDATE_PROFILE_FAIL, payload: error });
    }
  };
};

export const changeOrUploadProfilePic = (
  files: FileList | null
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch, getState) => {
    try {
      const user = getState().auth.user;
      dispatch({ type: AUTH_UPDATE_PROFILE_START });

      if (files && files.length > 0) {
        const formData = new FormData();
        formData.append("image", files[0]);
        formData.append("userId", user ? user.id : "");

        const uploadResponse = await axios.post(
          "http://localhost:5000/app/v1/auth/uploadProfilePic",
          formData,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
            onUploadProgress: (progressEvent) =>
              dispatch({
                type: AUTH_UPDATE_UPLOAD_PROGRESS,
                payload: Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                ),
              }),
          }
        );

        dispatch({
          type: AUTH_UPLOAD_PROFILE_PIC_SUCCESS,
          payload: uploadResponse.data.photoUrl,
        });
      }
    } catch (error: any) {
      if (error.response.data.errors || error.response.data.error) {
        dispatch({
          type: AUTH_UPLOAD_PROFILE_PIC_FAIL,
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
      dispatch({ type: AUTH_UPLOAD_PROFILE_PIC_FAIL, payload: error });
    }
  };
};

export const autoLogin = (): ThunkAction<
  void,
  RootState,
  unknown,
  AnyAction
> => {
  return async (dispatch) => {
    try {
      dispatch({ type: AUTH_AUTOLOGIN_START });
      let user = localStorage.getItem("user");
      if (user) {
        const userInfo: User = await JSON.parse(user);

        const currentDate = new Date();
        const expiryDate = new Date(userInfo.expiresIn);

        if (expiryDate < currentDate) {
          dispatch({ type: AUTH_AUTOLOGIN_FAIL });
          return;
        }

        dispatch({ type: AUTH_AUTOLOGIN_SUCCESS, payload: userInfo });
      } else {
        dispatch({ type: AUTH_AUTOLOGIN_FAIL });
      }
    } catch (error) {
      dispatch({ type: AUTH_AUTOLOGIN_FAIL, payload: error });
    }
  };
};

export const signUp = (userInfo: {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  photoUrl: string;
}): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      dispatch({ type: AUTH_SIGNUP_START });

      const response = await fetch("http://localhost:5000/app/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });
      const result = await response.json();
      if (result.errors || result.error) {
        dispatch({
          type: AUTH_SIGNUP_FAIL,
          payload: result.errors
            ? {
                message: result.errors[0].msg,
                statusCode: 500,
                requestStatus: "Fail",
              }
            : result.error,
        });
        return;
      }

      dispatch({ type: AUTH_SIGNUP_SUCCESS, payload: result });
    } catch (error) {
      dispatch({ type: AUTH_SIGNUP_FAIL, payload: error });
    }
  };
};

export const forgotPassword = (userInfo: {
  email: string;
  oldPassword: string;
  confirmPassword: string;
  newPassword: string;
}): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      dispatch({ type: AUTH_FORGOTPASSWORD_START });

      const response = await fetch(
        "http://localhost:5000/app/v1/auth/forgotpassword",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userInfo),
        }
      );
      const result = await response.json();
      if (result.errors || result.error) {
        dispatch({
          type: AUTH_FORGOTPASSWORD_FAIL,
          payload: result.errors
            ? {
                message: result.errors[0].msg,
                statusCode: 500,
                requestStatus: "Fail",
              }
            : result.error,
        });
        return;
      }

      dispatch({ type: AUTH_FORGOTPASSWORD_SUCCESS, payload: result });
    } catch (error) {
      dispatch({ type: AUTH_FORGOTPASSWORD_FAIL, payload: error });
    }
  };
};

export const signInUser = (credentials: {
  email: string;
  password: string;
}): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      dispatch({ type: AUTH_SIGNIN_START });
      const response = await fetch("http://localhost:5000/app/v1/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      const result = await response.json();
      if (result.errors || result.error) {
        dispatch({
          type: AUTH_SIGNIN_FAIL,
          payload: result.errors
            ? {
                message: result.errors[0].msg,
                statusCode: 500,
                requestStatus: "Fail",
              }
            : result.error,
        });
        return;
      }
      localStorage.setItem("user", JSON.stringify(result.userInfo));
      dispatch({ type: AUTH_SIGNIN_SUCCESS, payload: result.userInfo });
    } catch (error) {
      dispatch({ type: AUTH_SIGNIN_FAIL, payload: error });
    }
  };
};

export const updateIncomeInfo = (
  netIncome: string,
  savingsPercentage: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: AUTH_UPDATE_INCOME_START });
      const user = getState().auth.user;

      const response = await axios.patch(
        "http://localhost:5000/app/v1/auth/updateIncomeInfo",
        {
          userId: user.id,
          netIncome,
          savingsPercentage,
        }
      );

      dispatch({
        type: AUTH_UPDATE_INCOME_SUCCESS,
        payload: { netIncome, savingsPercentage },
      });
    } catch (error: any) {
      if (error.response.data.errors || error.response.data.error) {
        dispatch({
          type: AUTH_UPDATE_INCOME_FAIL,
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
      dispatch({ type: AUTH_UPDATE_INCOME_FAIL, payload: error });
    }
  };
};
