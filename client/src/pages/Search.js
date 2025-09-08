import React from "react";
import Layout from "../components/layout/Layout";
import { useSearch } from "../context/search";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import "../styles/Homepage.css";
const Search = () => {
  const [values] = useSearch();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  // Add to cart function
  const addToCart = (product) => {
    setCart([...cart, product]);
    localStorage.setItem("cart", JSON.stringify([...cart, product]));
    toast.success("Item Added to Cart");
  };
  return (
    <Layout title={"Search results"}>
      <div className="container">
        <div className="text-center">
          <h1>Search Results</h1>
          <h4 className="p-3">
            {values?.results.length < 1
              ? "No Products Found"
              : `Found ${values?.results.length} product${
                  values?.results.length === 1 ? "" : "s"
                }`}
          </h4>
          {values?.results.length < 1 && (
            <div className="mt-4">
              <p className="text-muted mb-4">
                Sorry, we couldn't find any products matching your search.
              </p>
              <Link
                to="/"
                className="btn btn-primary btn-lg"
                style={{
                  textDecoration: "none",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontWeight: "500",
                }}
              >
                <i className="fas fa-home me-2"></i>
                Go to Homepage
              </Link>
            </div>
          )}
          <div className="row mt-4">
            {values?.results.map((p) => (
              <div key={p._id} className="col-md-6 col-lg-4 col-xl-3 mb-4">
                <div className="card h-100">
                  <img
                    src={`${process.env.REACT_APP_API_ENDPOINT}/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                    style={{
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                  <div className="card-body d-flex flex-column">
                    <div className="card-name-price">
                      <h5 className="card-title text-truncate">{p.name}</h5>
                      <h5 className="card-title card-price">
                        {p.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </h5>
                    </div>
                    <p className="card-text text-truncate">
                      {p.description.substring(0, 60)}...
                    </p>
                    <div className="card-name-price mt-auto">
                      <button
                        className="btn btn-primary ms-1"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        More Details
                      </button>
                      <button
                        className="btn btn-secondary ms-1"
                        onClick={() => addToCart(p)}
                      >
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* {setValues({keyword:"",results:[]})} */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
