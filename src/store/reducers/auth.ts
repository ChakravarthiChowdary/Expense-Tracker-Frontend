import { AnyAction } from "redux";
import { AuthState } from "../../types/stateTypes";

const initialState: AuthState = {
  user: {
    username: "Chakravarthi Katragadda",
    id: "628c8b1c8fc73205a44e150f",
    email: "test@test.com",
    photoUrl: "",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpZCI6IjYyOGM4YjFjOGZjNzMyMDVhNDRlMTUwZiIsInVzZXJuYW1lIjoiQ2hha3JhdmFydGhpIEthdHJhZ2FkZGEiLCJwaG90b1VybCI6IiIsImlhdCI6MTY1MzM4MzYyOH0.WYXdMDeJaJq4oK14c3GlykLqpQvIvhYaPDd_XKMiFFI",
    expiresIn: "2022-05-24T10:13:48.914Z",
  },
  loading: false,
  error: null,
};

export const authReducer = (state = initialState, action: AnyAction) => {
  return state;
};
