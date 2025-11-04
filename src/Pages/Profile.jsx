import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { supabase } from "../supabaseClient";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const { data, error } = await supabase.auth.getUser();
    if (!error && data.user) {
      setUser(data.user);
      fetchOrders(data.user.id);
    }
  }

  async function fetchOrders(userId) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "Completed")
      .order("id", { ascending: false });

    if (!error && data) setOrders(data);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/signin";
  }

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />

      <div className="container-fluid py-5 bg-light min-vh-100">
        {user ? (
          <div className="container">
            <div className="text-center mb-5">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="avatar"
                className="rounded-circle mb-3"
                style={{ width: "100px" }}
              />
              <h3 className="custom-heading">
                Welcome, {user.email.split("@")[0]} 👋
              </h3>
              <p className="text-muted">
                You have {orders.length} completed{" "}
                {orders.length === 1 ? "order" : "orders"}.
              </p>
            </div>

            <div className="row justify-content-center">
              {orders.length === 0 ? (
                <p className="text-center text-muted">
                  No completed orders yet.
                </p>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="col-md-4 col-lg-3 mb-4">
                    <div className="card shadow-sm border-0 rounded-4 text-center">
                      <div className="card-body">
                        <h5 className="fw-bold">Order #{order.id}</h5>
                        <p className="fw-bold text-success mb-1">
                          {order.total_price} EGP
                        </p>
                        <span className="badge bg-success">
                          {order.status}
                        </span>
                        <p className="text-muted mt-2 mb-0">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-danger">
            Please log in to view profile.
          </p>
        )}
      </div>

      <Footer />
    </>
  );
}
