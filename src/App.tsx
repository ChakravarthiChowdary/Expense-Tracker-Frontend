import React, { Dispatch, useEffect } from "react";
import { Route, Routes } from "react-router";

import "./App.css";
import NavBar from "./components/NavBar";
import AddExpense from "./pages/AddExpense";
import MyExpenses from "./pages/MyExpenses";
import MyProfile from "./pages/MyProfile";
import PageNotFound from "./pages/PageNotFound";
import { useAppSelector } from "./store/store";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import { useDispatch } from "react-redux";
import { autoLogin } from "./store/actions/auth";

function App() {
  const { user } = useAppSelector((state) => state.auth);

  const dispatch: Dispatch<any> = useDispatch();

  useEffect(() => {
    dispatch(autoLogin());
  }, [dispatch]);
  return (
    <>
      <NavBar />
      <Routes>
        {user ? (
          <>
            <Route path="/addexpense" element={<AddExpense />} />
            <Route path="/myExpenses" element={<MyExpenses />} />
            <Route path="/myProfile" element={<MyProfile />} />
            <Route path="/myBills" element={<MyExpenses billsPage={true} />} />
            <Route path="/" element={<MyExpenses />} />
          </>
        ) : (
          <>
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
          </>
        )}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
