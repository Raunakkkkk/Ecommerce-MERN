import React, { useState, useEffect } from "react";
import AdminMenu from "./../../components/layout/AdminMenu";
import Layout from "./../../components/layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/v1/product/get-product`
      );
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while fetching products");
    } finally {
      setLoading(false);
    }
  };

  // Lifecycle method
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout title={"Dashboard - Manage Products"}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>All Products</h1>
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : products.length === 0 ? (
              <div className="text-center">No products available</div>
            ) : (
              <div className="container">
                <div className="row">
                  {products?.map((p) => (
                    <div key={p._id} className="col-md-4 mb-4">
                      <Link
                        to={`/dashboard/admin/product/${p.slug}`}
                        className="product-link"
                      >
                        <div className="card h-100">
                          <img
                            src={`${process.env.REACT_APP_API_ENDPOINT}/api/v1/product/product-photo/${p._id}`}
                            className="card-img-top product-img"
                            alt={p.name}
                          />
                          <div className="card-body">
                            <h5 className="card-title">{p.name}</h5>
                            <p className="card-text">
                              {p.description.length > 30
                                ? `${p.description.substring(0, 30)}...`
                                : p.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
