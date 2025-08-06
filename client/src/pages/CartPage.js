import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import "../styles/CartStyles.css";
import axios from "axios";
import DropIn from "braintree-web-drop-in-react";
import toast from "react-hot-toast";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);

  const updateQuantity = (productId, newQuantity) => {
    const updatedCart = cart.map((item) => {
      if (item._id === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + item.price * item.quantity;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const getToken = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/v1/product/braintree/token`
      );
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Fetch the client token for Braintree DropIn
    const fetchClientToken = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_ENDPOINT}/api/v1/product/braintree/token`
        );
        setClientToken(data?.clientToken);
      } catch (error) {
        console.error("Failed to fetch client token:", error);
        toast.error("Unable to initialize payment. Please try again later.");
      }
    };

    if (auth?.token) {
      fetchClientToken();
    }
  }, [auth?.token]);

  const handlePayment = async () => {
    if (!instance) {
      toast.error("Payment instance not initialized. Please try again.");
      return;
    }

    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod(); // Get the payment method nonce
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/v1/product/braintree/payment`,
        {
          nonce,
          cart,
        }
      );

      // Handle successful payment
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully");
    } catch (error) {
      console.error("Payment failed:", error);
      setLoading(false);
      toast.error("Payment failed. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="cart-container">
        <div className="cart-header">
          {cart?.length ? (
            <div className="cart-header-content">
              <div className="cart-title">
                <h1>Shopping Cart</h1>
                <p className="cart-subtitle">
                  You have {cart.length} item{cart.length > 1 ? "s" : ""} in
                  your cart
                </p>
              </div>
              <div className="cart-actions">
                <button className="btn-clear" onClick={clearCart}>
                  <i className="fas fa-trash"></i>
                  Clear Cart
                </button>
                <button className="btn-continue" onClick={() => navigate("/")}>
                  <i className="fas fa-shopping-bag"></i>
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            <div className="cart-empty">
              <div className="empty-icon">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <h2>Your Cart is Empty</h2>
              <p>Looks like you haven't added any items to your cart yet.</p>
              <button className="btn-shop-now" onClick={() => navigate("/")}>
                <i className="fas fa-shopping-bag"></i>
                Start Shopping
              </button>
            </div>
          )}
        </div>

        {cart?.length > 0 && (
          <div className="cart-content">
            <div className="cart-items">
              {cart?.map((p) => (
                <div className="cart-item" key={p._id}>
                  <div className="item-image">
                    <img
                      src={`${process.env.REACT_APP_API_ENDPOINT}/api/v1/product/product-photo/${p._id}`}
                      alt={p.name}
                    />
                  </div>
                  <div className="item-details">
                    <div className="item-info">
                      <h3 className="item-name">{p.name}</h3>
                      <p className="item-description">
                        {p.description.substring(0, 80)}...
                      </p>
                      <div className="item-price">
                        <span className="price-amount">₹{p.price}</span>
                        <span className="price-label">per item</span>
                      </div>
                    </div>
                    <div className="item-controls">
                      <div className="quantity-controls">
                        <button
                          className="quantity-btn"
                          onClick={() => updateQuantity(p._id, p.quantity - 1)}
                          disabled={p.quantity <= 1}
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                        <span className="quantity-display">
                          {p.quantity || 1}
                        </span>
                        <button
                          className="quantity-btn"
                          onClick={() =>
                            updateQuantity(p._id, (p.quantity || 1) + 1)
                          }
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                      <div className="item-total">
                        <span className="total-amount">
                          ₹{(p.price * (p.quantity || 1)).toLocaleString()}
                        </span>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => removeCartItem(p._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-header">
                <h2>Order Summary</h2>
              </div>

              <div className="summary-details">
                <div className="summary-row">
                  <span>Items ({cart.length})</span>
                  <span>{totalPrice()}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="free-shipping">Free</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total-row">
                  <span>Total</span>
                  <span className="total-price">{totalPrice()}</span>
                </div>
              </div>

              <div className="address-section">
                {auth?.user?.address ? (
                  <div className="current-address">
                    <h4>Delivery Address</h4>
                    <p>{auth?.user?.address}</p>
                    <button
                      className="btn-update-address"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      <i className="fas fa-edit"></i>
                      Update Address
                    </button>
                  </div>
                ) : (
                  <div className="address-required">
                    {auth?.token ? (
                      <button
                        className="btn-add-address"
                        onClick={() => navigate("/dashboard/user/profile")}
                      >
                        <i className="fas fa-plus"></i>
                        Add Delivery Address
                      </button>
                    ) : (
                      <button
                        className="btn-login-required"
                        onClick={() =>
                          navigate("/login", {
                            state: "/cart",
                          })
                        }
                      >
                        <i className="fas fa-sign-in-alt"></i>
                        Login to Checkout
                      </button>
                    )}
                  </div>
                )}
              </div>

              {auth?.token &&
                clientToken &&
                cart?.length &&
                auth?.user?.address && (
                  <div className="payment-section">
                    <h4>Payment Method</h4>
                    <div className="payment-dropin">
                      <DropIn
                        options={{
                          authorization: clientToken,
                          paypal: {
                            flow: "vault",
                          },
                        }}
                        onInstance={(instance) => setInstance(instance)}
                      />
                    </div>
                    <button
                      onClick={handlePayment}
                      className="btn-checkout"
                      disabled={loading || !instance}
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-lock"></i>
                          Secure Checkout
                        </>
                      )}
                    </button>
                  </div>
                )}

              {!clientToken && auth?.token && (
                <div className="payment-loading">
                  <i className="fas fa-spinner fa-spin"></i>
                  <p>Loading payment options...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
