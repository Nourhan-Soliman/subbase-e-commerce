// src/Pages/SignUp.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "bootstrap/dist/css/bootstrap.min.css";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: null, 
      },
    });

    if (error) {
      setMessage(" Sign up failed: " + error.message);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setMessage(" Account created but login failed: " + signInError.message);
    } else {
      setMessage(" Account created successfully! Redirecting...");
      setTimeout(() => navigate("/"), 1500);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ width: "370px", borderRadius: "12px" }}>
        <h3 className="text-center mb-3 fw-bold text-primary">Create Account</h3>
        <p className="text-center text-muted mb-4">Join us and explore our store</p>

        <form onSubmit={handleSignUp}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email Address</label>
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary w-100 py-2 fw-bold shadow-sm">
            Sign Up
          </button>

          {message && (
            <p
              className={`mt-3 text-center fw-bold ${
                message.includes("failed") ? "text-danger" : "text-success"
              }`}
            >
              {message}
            </p>
          )}

          <p className="text-center mt-4 mb-0">
            Already have an account?{" "}
            <a
              href="/signin"
              className="fw-semibold text-decoration-none text-primary"
            >
              Sign In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
