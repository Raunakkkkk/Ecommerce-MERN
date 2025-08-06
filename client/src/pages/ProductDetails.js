import React, { useState, useEffect } from "react";
import Layout from "./../components/layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ProductDetailsStyles.css";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [cart, setCart] = useCart();
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  // Get product details
  const getProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
      toast.error("Error loading product details");
    } finally {
      setLoading(false);
    }
  };

  // Get similar products
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  // Add to cart
  const addToCart = (product) => {
    const isItemInCart = cart.find((item) => item._id === product._id);

    if (isItemInCart) {
      toast.error("Item is already in the cart");
    } else {
      const newItem = { ...product, quantity: 1 };
      setCart([...cart, newItem]);
      localStorage.setItem("cart", JSON.stringify([...cart, newItem]));
      toast.success("Item Added to Cart");
    }
  };

  if (loading) {
    return (
      <Layout title={"Loading..."}>
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={product?.name}>
      <div className="container">
        <div className="row product-details">
          {/* Product Images */}
          <div className="col-md-6">
            <div className="product-gallery">
              <div className="main-image">
                <img
                  src={`${process.env.REACT_APP_API_ENDPOINT}/api/v1/product/product-photo/${product._id}`}
                  className="img-fluid"
                  alt={product.name}
                />
              </div>
              {product.images && product.images.length > 0 && (
                <div className="thumbnail-container">
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={`${process.env.REACT_APP_API_ENDPOINT}/api/v1/product/product-photo/${product._id}/${index}`}
                      className={`thumbnail ${
                        selectedImage === index ? "active" : ""
                      }`}
                      alt={`${product.name} - ${index + 1}`}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="col-md-6">
            <div className="product-details-info">
              <h1 className="mb-4">{product.name}</h1>

              <div className="price-section">
                <h2>
                  {product.price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "INR",
                  })}
                </h2>
                {product.quantity > 0 ? (
                  <span className="badge bg-success">In Stock</span>
                ) : (
                  <span className="badge bg-danger">Out of Stock</span>
                )}
              </div>

              <div className="description">
                <p>{product.description}</p>
              </div>

              <div className="product-actions">
                <button
                  className="btn btn-primary btn-lg me-2"
                  onClick={() => addToCart(product)}
                  disabled={product.quantity <= 0}
                >
                  Add to Cart
                </button>
                <button
                  className="btn btn-outline-primary btn-lg"
                  onClick={() => navigate("/cart")}
                >
                  Go to Cart
                </button>
              </div>

              <div className="product-meta">
                <div className="d-flex gap-4">
                  <div>
                    <h6>Category</h6>
                    <p>{product.category?.name}</p>
                  </div>
                  <div>
                    <h6>Shipping</h6>
                    <p>
                      {product.shipping ? (
                        <span className="text-success">
                          <i className="bi bi-truck me-1"></i>
                          Shippable
                        </span>
                      ) : (
                        <span className="text-danger">
                          <i className="bi bi-x-circle me-1"></i>
                          Not Shippable
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {relatedProducts.length > 0 && (
          <div className="similar-products">
            <h3>Similar Products</h3>
            <div className="row">
              {relatedProducts.map((p) => (
                <div className="col-md-3 mb-4" key={p._id}>
                  <div className="card">
                    <img
                      src={`${process.env.REACT_APP_API_ENDPOINT}/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text">
                        {p.description.substring(0, 60)}...
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="card-price">
                          {p.price.toLocaleString("en-US", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </h6>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => navigate(`/product/${p.slug}`)}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetails;
