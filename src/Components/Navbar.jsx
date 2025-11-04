import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Navbar({ cartCount, setCartCount }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("user");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      setUser(data.user);

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (!error && profile?.role) setRole(profile.role);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setCartCount(0);
    navigate("/signin");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: "linear-gradient(90deg, #4b6cb7, #182848)" }}>
      <div className="container">
      <Link className="navbar-brand custom-logo" to="/">
  Nour Shop
</Link>


        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${expanded ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto align-items-center gap-3">
            {/* Dashboard فقط للـ Admin */}
            {role === "admin" && (
              <li className="nav-item">
                <Link className="btn btn-outline-light btn-sm rounded-pill" to="/dashboard">
                  Dashboard
                </Link>
              </li>
            )}

            {/* Dropdown للملف الشخصي */}
            {user ? (
              <li className="nav-item dropdown">
                <button
                  className="btn btn-light btn-sm dropdown-toggle rounded-pill"
                  id="profileDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle me-1"></i>
                  {user.email.split("@")[0]}
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="btn btn-light btn-sm rounded-pill" to="/signin">
                  Login
                </Link>
              </li>
            )}

            {/* Cart Button */}
            <li className="nav-item position-relative">
              <button
                className="btn btn-warning rounded-pill"
                onClick={() => navigate("/cart")}
              >
                <i className="bi bi-cart fs-5"></i>
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartCount}
                  </span>
                )}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
