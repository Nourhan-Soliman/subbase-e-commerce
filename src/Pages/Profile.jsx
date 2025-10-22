import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
  }, []);

  // ✅ جلب بيانات المستخدم
  async function getUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) console.error("Error fetching user:", error.message);
    else setUser(data.user);
  }

  //  تسجيل الخروج
  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error signing out:", error.message);
    else navigate("/signin");
  }

  //  شاشة التحميل
  if (!user) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <p className="text-secondary fw-semibold">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg border-0 rounded-4" style={{ width: "380px" }}>
        <div className="card-body text-center p-4">
          <div className="mb-3">
            <i className="bi bi-person-circle text-primary" style={{ fontSize: "4rem" }}></i>
          </div>

          <h4 className="fw-bold text-primary mb-3">Profile</h4>

          <ul className="list-group list-group-flush text-start mb-4">
            <li className="list-group-item">
              <i className="bi bi-envelope-fill text-secondary me-2"></i>
              <strong>Email:</strong> <br /> {user.email}
            </li>
            <li className="list-group-item">
              <i className="bi bi-key-fill text-secondary me-2"></i>
              <strong>ID:</strong> <br /> {user.id}
            </li>
            <li className="list-group-item">
              <i className="bi bi-calendar3 text-secondary me-2"></i>
              <strong>Created at:</strong> <br />{" "}
              {new Date(user.created_at).toLocaleString()}
            </li>
          </ul>

          <button
            onClick={handleSignOut}
            className="btn btn-outline-danger w-100 fw-semibold"
          >
            <i className="bi bi-box-arrow-right me-2"></i>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
