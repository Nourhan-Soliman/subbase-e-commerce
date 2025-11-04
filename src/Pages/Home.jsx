import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import ProductList from "../Components/ProductList";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchProducts();
    fetchCartCount();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase.from("products").select("*");
    if (!error) setProducts(data);
  }

  async function fetchCartCount() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", user.id);
      if (!error) setCartCount(data.length);
    }
  }

  return (
    <>
      <Navbar cartCount={cartCount} setCartCount={setCartCount} />
      <div className="container py-5">
<h2 className="text-center mb-5 fw-bold custom-heading">Our Products</h2>
        <ProductList products={products} onCartUpdate={fetchCartCount} />
      </div>
      <Footer />
    </>
  );
}
