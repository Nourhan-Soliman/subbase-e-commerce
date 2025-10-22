import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import Profile from "./Profile";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("Loading products...");
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  //    المستخدم
  async function checkUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      navigate("/signin");
    } else {
      setUser(data.user);
      fetchProducts();
    }
  }

  //   المنتجات
  async function fetchProducts() {
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
      console.error("Error fetching products:", error.message);
      setMessage(" You are logged in, but cannot access products.");
    } else if (!data || data.length === 0) {
      setMessage("No products available.");
    } else {
      setProducts(data);
      setMessage("");
    }
  }

  //    المستخدم
  if (!user) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 fw-semibold text-secondary">Loading user...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">
        Products
        </h2>
        <button
          className="btn btn-outline-primary rounded-circle"
          onClick={() => setShowProfile(!showProfile)}
          title="Profile"
        >
          <i className="bi bi-person fs-4"></i>
        </button>
      </div>

      {showProfile && (
        <div className="mb-4">
          <Profile />
        </div>
      )}
    </div>
  );
}
