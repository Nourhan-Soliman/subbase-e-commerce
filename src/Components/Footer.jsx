import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-light border-top mt-5">
      <div className="container py-5">
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
<Link className="navbar-brand custom-logo text-primary" to="/">
  Nour Shop
</Link>
            <p className="text-muted">
              Shop now at Noor Shop — a premium shopping experience combining
              quality and convenience.
            </p>
          </div>

          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="fw-semibold mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link
                  to="/"
                  className="text-decoration-none text-secondary d-block mb-2"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-decoration-none text-secondary d-block mb-2"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-decoration-none text-secondary d-block mb-2"
                >
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* ===== Social Media ===== */}
          <div className="col-md-4">
            <h5 className="fw-semibold mb-3">Follow Us</h5>
            <div className="d-flex gap-3">
              <a href="#" className="text-secondary fs-5">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-secondary fs-5">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-secondary fs-5">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="text-secondary fs-5">
                <i className="bi bi-github"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-top text-center py-3">
     <small className="text-muted">
  © {new Date().getFullYear()}{" "}
  <span className="fw-semibold text-primary ">Noor Shop</span> — All
  rights reserved.
</small>

      </div>
    </footer>
  );
}
