import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { supabase } from "../supabaseClient";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productModal, setProductModal] = useState({ show: false, data: null });
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: prod } = await supabase.from("products").select("*");
    const { data: usr } = await supabase.from("profiles").select("*");
    setProducts(prod || []);
    setUsers(usr || []);
    setLoading(false);
  };

  const handleSaveProduct = async (p) => {
    if (!p.name || !p.price) return alert("Please fill all fields");
    if (p.id) {
      await supabase.from("products").update(p).eq("id", p.id);
    } else {
      await supabase.from("products").insert([p]);
    }
    setProductModal({ show: false, data: null });
    fetchData();
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure?")) {
      await supabase.from("products").delete().eq("id", id);
      fetchData();
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;

  return (
    <div className="d-flex flex-column vh-100">
      <Navbar cartCount={cartCount} setCartCount={setCartCount} />

      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div className="bg-dark text-white d-flex flex-column p-3" style={{ width: "250px" }}>
          <h3 className="mb-4">Admin Panel</h3>
          <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item">
              <button className={`nav-link text-white ${activeTab === "products" ? "active" : ""}`} onClick={() => setActiveTab("products")}>
                Products
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link text-white ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
                Users
              </button>
            </li>
          </ul>
        </div>

        <div className="flex-grow-1 p-4 overflow-auto bg-light">
          {activeTab === "products" && (
            <div className="table-responsive shadow-sm p-3 bg-white rounded">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Products</h4>
                <button className="btn btn-success" onClick={() => setProductModal({ show: true, data: null })}>+ Add Product</button>
              </div>
              <table className="table table-striped table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>{p.image_url ? <img src={p.image_url} alt={p.name} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "5px" }} /> : "No Image"}</td>
                      <td>{p.name}</td>
                      <td>{parseFloat(p.price).toFixed(2)} EGP</td>
                      <td>
                        <button className="btn btn-warning btn-sm me-2" onClick={() => setProductModal({ show: true, data: p })}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProduct(p.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "users" && (
            <div className="table-responsive shadow-sm p-3 bg-white rounded">
              <h4 className="mb-3">Users</h4>
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => <tr key={u.id}><td>{u.email}</td><td>{u.role}</td></tr>)}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {productModal.show && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content p-4">
              <h5 className="mb-3">{productModal.data ? "Edit Product" : "Add New Product"}</h5>
              {["name", "price", "image_url"].map((field) => (
                <input
                  key={field}
                  className="form-control mb-3"
                  type={field === "price" ? "number" : "text"}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace("_", " ")}
                  value={productModal.data?.[field] || ""}
                  onChange={(e) => setProductModal({ show: true, data: { ...productModal.data, [field]: e.target.value } })}
                />
              ))}
              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-secondary" onClick={() => setProductModal({ show: false, data: null })}>Cancel</button>
                <button className="btn btn-primary" onClick={() => handleSaveProduct(productModal.data)}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
