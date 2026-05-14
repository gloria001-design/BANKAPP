import React, { useState, useContext } from "react";

import { Link, useNavigate } from "react-router-dom";

import "./Login.css";

import { FaRegEye, FaRegEyeSlash, FaUser, FaLock } from "react-icons/fa";

import { AuthContext } from "../../context/AuthContext.jsx";

import { useDispatch } from "react-redux";

import { clearError, login } from "../../redux/usersSlice";

import store from "../../redux/store";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const { setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    dispatch(clearError());
    dispatch(login({ email, password }));

    const { currentUser, error } = store.getState().users;

    if (error) {
      alert(error);
      return;
    }

    setUser(currentUser);

    localStorage.setItem("loggedInUser", JSON.stringify(currentUser));

    alert("Login successful");

    navigate("/dashboard");
  };

  return (
    <div className="login_container">
      <div className="login_card">
        <div className="login_header">
          <h1>Bank Login</h1>

          <p>Secure access to your account</p>
        </div>

        <form className="login_form" onSubmit={handleLogin}>
          <div className="form_group">
            <label htmlFor="email">Email Address</label>

            <div className="input_wrapper">
              <FaUser className="input_icon" />

              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                required={true}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form_group">
            <label htmlFor="password">Password</label>

            <div className="input_wrapper password_wrapper">
              <FaLock className="input_icon" />

              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter password"
                required={true}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="toggle_password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
          </div>

          <div className="remember_forgot">
            <label className="remember_me">
              <input type="checkbox" />

              <span>Remember me</span>
            </label>

            <a href="#forgot" className="forgot_link">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="login_btn">
            Login
          </button>
        </form>

        <div className="signup_link">
          <p>
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
