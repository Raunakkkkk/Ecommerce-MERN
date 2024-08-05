import React, { useState, useEffect } from "react";
import AdminMenu from "./../../components/layout/AdminMenu";
import Layout from "./../../components/layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
const Products = () => {
  const [products, setProducts] = useState([]);

  // Get all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/get-product");
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  // Lifecycle method
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout>
      <div className="row admin-dashboard">
        <div className="col-md-3 admin-dashboard-menu">
          <AdminMenu />
        </div>
        <div className="col-md-9 admin-dashboard-products">
          <h1 className="text-center admin-dashboard-title">All Products List</h1>
          <div className="d-flex flex-wrap">
            {products?.map((p) => (
              <Link
                key={p._id}
                to={`/dashboard/admin/product/${p.slug}`}
                className="product-link"
              >
                <div className="p-3">
                <div className="card admin-dashboard-card h-100">
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top admin-dashboard-card-img"
                    alt={p.name}
                  />
                  <div className="card-body admin-dashboard-card-body">
                    <h5 className="card-title admin-dashboard-card-title">{p.name}</h5>
                    <p className="card-text admin-dashboard-card-text">
                    {p.description.length > 30 ? `${p.description.substring(0, 30)}...` : p.description}

                      {/* {p.description} */}
                      </p>
                  </div>
                </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
