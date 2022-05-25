import React from "react";
import { Route, Routes } from "react-router";

import "./App.css";
import NavBar from "./components/NavBar";
import AddExpense from "./pages/AddExpense";
import MyExpenses from "./pages/MyExpenses";
import PageNotFound from "./pages/PageNotFound";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/addexpense" element={<AddExpense />} />
        <Route path="/myExpenses" element={<MyExpenses />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
