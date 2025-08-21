// App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import Protect from "./pages/auth/Protect";
import Transaction from "./pages/transaction/Transaction";
import Profile from "./pages/profile/Profile";
import Category from "./pages/category/Category";
import CreateCategory from "./pages/category/CreateCategory";
import Page404 from "./pages/Page404";
import CreateTransaction from "./pages/transaction/CreateTransaction";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="*"
            element={
              <Protect>
                {" "}
                <Page404 />{" "}
              </Protect>
            }
          />
          <Route
            path="/dashboard"
            element={
              <Protect>
                <Dashboard />
              </Protect>
            }
          />
          <Route
            path="/transaction"
            element={
              <Protect>
                {" "} 
                <Transaction />{" "}
              </Protect>
            }
          />
          <Route
            path="/profile"
            element={
              <Protect>
                {" "}
                <Profile />{" "}
              </Protect>
            }
          />
          <Route
            path="/category"
            element={
              <Protect>
                {" "}
                <Category />{" "}
              </Protect>
            }
          />
          <Route
            path="/create-category"
            element={
              <Protect>
                {" "}
                <CreateCategory />{" "}
              </Protect>
            }
          />
          <Route
            path="/create-transaction"
            element={
              <Protect>
                {" "}
                <CreateTransaction />{" "}
              </Protect>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
