import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function ProductList({ products, onCartUpdate }) {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  async function addToCart(product) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setToast({ show: true, message: "Please sign in to add products!", type: "danger" });
      navigate("/signin");
      return;
    }

    const { error } = await supabase
      .from("cart")
      .insert([{ user_id: user.id, product_id: product.id, quantity: 1 }]);

    if (!error) {
      setToast({ show: true, message: "Product added to cart!", type: "success" });
      onCartUpdate(); 
    } else {
      setToast({ show: true, message: "Failed to add product to cart.", type: "danger" });
    }
  }

  if (!products || products.length === 0) {
    return (
      <p className="text-center text-muted fs-5 my-5">
        No products available at the moment.
      </p>
    );
  }

  return (
    <div className="position-relative">
      <div className="position-fixed top-0 start-50 translate-middle-x p-3" style={{ zIndex: 11 }}>
        <div
          className={`toast align-items-center text-white bg-${toast.type} border-0 ${toast.show ? "show" : ""}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">{toast.message}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setToast({ ...toast, show: false })}
            ></button>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        {products.map((product) => (
          <div
            className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex align-items-stretch"
            key={product.id}
          >
            <div className="card shadow-sm border-0 rounded-4 w-100">
              <div className="position-relative">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="card-img-top rounded-top-4"
                  style={{ height: "220px", objectFit: "cover" }}
                />
              </div>

              <div className="card-body text-center d-flex flex-column justify-content-between">
                <div>
                  <h5 className="fw-bold text-dark">{product.name}</h5>
                  <p className="text-muted small mb-2">{product.description}</p>
                </div>

                <div className="mt-auto">
                  <p className="fw-bold text-primary fs-5 mb-3">
                    {product.price} <span className="fs-6">EGP</span>
                  </p>
                  <button
                    className="btn btn-success w-100 rounded-pill"
                    onClick={() => addToCart(product)}
                  >
                    <i className="bi bi-cart-plus"></i> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
