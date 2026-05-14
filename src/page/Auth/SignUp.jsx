import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import "./Login.css";

import {
  FaRegEye,
  FaRegEyeSlash,
  FaUser,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";

import { z } from "zod";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useDispatch, useSelector } from "react-redux";

import { signUp } from "../../redux/usersSlice";

const SignUp = () => {
  const nav = useNavigate();

  const dispatch = useDispatch();

  const users = useSelector((state) => state.users.list);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation Schema
  const signUpSchema = z
    .object({
      fullName: z.string().min(2, "Full name must be at least 2 characters"),

      email: z.string().email("Invalid email address"),

      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
          "Password must contain uppercase, lowercase, number, and special character",
        ),

      confirmPassword: z.string().min(1, "Please confirm your password"),
    })

    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  // Submit Function
  const submitSignUp = handleSubmit((data) => {
    // Check if email already exists
    const existingUser = users.find(
      (user) => user.email.toLowerCase() === data.email.toLowerCase().trim(),
    );

    if (existingUser) {
      alert("Email already exists");
      return;
    }

    // Remove confirmPassword before saving
   const { confirmPassword, ...userData } = data || {};

    dispatch(
      signUp({
        ...userData,
        email: data.email.trim(),
      }),
    );

    alert("Account created successfully");

    // Reset form
    reset();

    // Redirect to login page
    nav("/");
  });

  return (
    <div className="login_container">
      <div className="login_card signup_card">
        <div className="login_header">
          <h1>Create Your Account</h1>

          <p>Join our bank and manage your finances</p>
        </div>

        <form className="login_form" onSubmit={submitSignUp}>
          {/* Full Name */}
          <div className="form_group">
            <label htmlFor="name">Full Name</label>

            <div className="input_wrapper">
              <FaUser className="input_icon" />

              <input
                type="text"
                id="name"
                placeholder="Enter your full name"
                {...register("fullName")}
              />
            </div>

            {errors.fullName && (
              <span style={{ color: "red" }}>
                {String(errors.fullName.message)}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="form_group">
            <label htmlFor="email">Email Address</label>

            <div className="input_wrapper">
              <FaEnvelope className="input_icon" />

              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                {...register("email")}
              />
            </div>

            {errors.email && (
              <span style={{ color: "red" }}>
                {String(errors.email.message)}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="form_group">
            <label htmlFor="password">Password</label>

            <div className="input_wrapper password_wrapper">
              <FaLock className="input_icon" />

              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Create password"
                {...register("password")}
              />

              <button
                type="button"
                className="toggle_password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>

            {errors.password && (
              <span style={{ color: "red" }}>
                {String(errors.password.message)}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form_group">
            <label htmlFor="confirmPassword">Confirm Password</label>

            <div className="input_wrapper password_wrapper">
              <FaLock className="input_icon" />

              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm password"
                {...register("confirmPassword")}
              />

              <button
                type="button"
                className="toggle_password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>

            {errors.confirmPassword && (
              <span style={{ color: "red" }}>
                {String(errors.confirmPassword.message)}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="login_btn">
            Sign Up
          </button>
        </form>

        {/* Login Link */}
        <div className="signup_link">
          <p>
            Already have an account? <Link to="/">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
