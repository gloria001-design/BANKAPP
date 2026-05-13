import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import DashBoard from "./page/Dashboard/DashBoard";
import Login from "./page/Auth/Login";
import SignUp from "./page/Auth/SignUp";
import NotFound from "./components/NotFound";

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard/" element={<DashBoard />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
