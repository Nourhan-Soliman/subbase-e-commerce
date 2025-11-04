import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [total, setTotal] = useState(0);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      navigate("/signin");
    } else {
      setUser(data.user);
      fetchCart(data.user.id);
    }
  }

  async function fetchCart(userId) {
    const { data, error } = await supabase
      .from("cart")
      .select("id, quantity, product:product_id (id, name, price, image_url)")
      .eq("user_id", userId);

    if (!error && data) {
      setCartItems(data);
      calculateTotal(data);
    } else {
      toast.error("Failed to fetch cart data");
      console.error(error);
    }
  }

  function calculateTotal(items) {
    const sum = items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    setTotal(sum);
  }

  async function removeFromCart(itemId) {
    const { error } = await supabase.from("cart").delete().eq("id", itemId);
    if (!error) {
      const updated = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updated);
      calculateTotal(updated);
      toast.success("Product removed from cart");
    } else {
      toast.error("Failed to remove product");
    }
  }

  async function handleCheckout() {
    if (cartItems.length === 0) return toast.info("Your cart is empty");
    if (!user) {
      toast.warning("Please login to complete the order");
      navigate("/signin");
      return;
    }

    setProcessing(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user.id,
            total_price: total,
            status: "Completed",
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      await supabase.from("cart").delete().eq("user_id", user.id);

      toast.success("Order completed successfully");
      navigate("/profile");
    } catch (err) {
      console.error("Checkout Error:", err.message);
      toast.error("Error completing the order");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <Navbar />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="container-fluid py-5 bg-light min-vh-100">
        <h2 className=" custom-heading">Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <div className="text-center text-muted mt-5">
            <i className="bi bi-cart-x fs-1 d-block mb-3"></i>
            <p>Your cart is empty</p>
            <button className="btn btn-primary mt-2" onClick={() => navigate("/")}>
              Back to Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="row justify-content-center">
              {cartItems.map((item) => (
                <div className="col-md-5 col-lg-4 mb-4" key={item.id}>
                  <div className="card shadow-sm border-0 rounded-4 h-100">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="card-img-top"
                      style={{ height: "220px", objectFit: "cover" }}
                    />
                    <div className="card-body text-center">
                      <h5 className="fw-semibold">{item.product.name}</h5>
                      <p className="fw-bold text-primary mb-1">{item.product.price} EGP</p>
                      <p className="text-muted small">Quantity: {item.quantity}</p>
                      <button
                        className="btn btn-outline-danger btn-sm mt-2"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <i className="bi bi-trash"></i> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-4">
              <h4 className="fw-bold mb-3">
                Total: <span className="text-success">{total} EGP</span>
              </h4>
              <button
                className="btn btn-success btn-lg px-5 shadow-sm"
                onClick={handleCheckout}
                disabled={processing}
              >
                {processing ? "Processing..." : "Checkout"}
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}
