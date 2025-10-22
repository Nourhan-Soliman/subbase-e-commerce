import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "bootstrap/dist/css/bootstrap.min.css";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(" Login failed: " + error.message);
    } else {
      setMessage(" Login successful!");
      setTimeout(() => navigate("/home"), 1000);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ width: "370px", borderRadius: "12px" }}>
        <h3 className="text-center mb-3 fw-bold text-primary">Welcome Back</h3>
        <p className="text-center text-muted mb-4">Sign in to your account</p>

        <form onSubmit={handleSignIn}>
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary w-100 py-2 fw-bold shadow-sm">
            Sign In
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
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="fw-semibold text-decoration-none text-primary"
            >
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
