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

    const groupedCart = updatedCart.reduce((accumulator, current) => {
      const itemInAccumulator = accumulator.find(
        (item) => item._id === current._id
      );

      if (itemInAccumulator) {
        itemInAccumulator.quantity += current.quantity;
      } else {
        accumulator.push(current);
      }

      return accumulator;
    }, []);

    setCart(groupedCart);
    localStorage.setItem("cart", JSON.stringify(groupedCart));
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

  //get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/braintree/token");
      setClientToken(data?.clientToken);
      // console.log("Client Token:", data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getToken();
  }, [auth?.token]);

  //handle payments
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post("/api/v1/product/braintree/payment", {
        nonce,
        cart,
      });
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully ");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="cart-page">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user
                ? "Hello Guest"
                : `Hello  ${auth?.token && auth?.user?.name}`}
            </h1>
            <h4 className="text-center">
              {cart?.length
                ? `You Have ${cart.length} items in your cart ${
                    auth?.token ? "" : "please login to checkout"
                  }`
                : " Your Cart Is Empty"}
            </h4>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-7 p-0 m-0">
              {cart?.map((p) => (
                <div className="row card flex-row" key={p._id}>
                  <div className="col-md-3">
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                      width="100%"
                      height="130px"
                    />
                  </div>
                  <div className="col-md-9">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h4>{p.name}</h4>
                        <h6>{p.description.substring(0, 30)}</h6>
                        <h6>Price : &#8377;{p.price}</h6>
                      </div>
                      <div className="d-flex align-items-center">
                        <h6 className="me-3 mb-0">
                          Quantity: {p.quantity || 1}
                        </h6>
                        <button
                          className="btn btn-outline-secondary ml-1 me-2"
                          onClick={() => updateQuantity(p._id, p.quantity - 1)}
                          disabled={p.quantity <= 1}
                        >
                          -
                        </button>
                        <button
                          className="btn btn-outline-secondary ms-2"
                          onClick={() =>
                            updateQuantity(p._id, (p.quantity || 1) + 1)
                          }
                        >
                          +
                        </button>
                        <div className="cart-remove-btn">
                          <button
                            className="btn btn-danger ms-2"
                            onClick={() => removeCartItem(p._id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-md-5 cart-summary">
              <h2>Cart Summary</h2>
              <p>Total | Checkout | Payment</p>
              <hr />
              <h4>Total : {totalPrice()} </h4>
              {auth?.user?.address ? (
                <>
                  <div className="mb-3">
                    <h4>Current Address</h4>
                    <h5>{auth?.user?.address}</h5>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                    {/* <button
                      className="btn btn-success ms-3 button-outline"
                      onClick={() => navigate("/checkout")}
                    >
                      Checkout
                    </button> */}
                  </div>
                </>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() =>
                        navigate("/login", {
                          state: "/cart",
                        })
                      }
                    >
                      Plase Login to checkout
                    </button>
                  )}
                </div>
              )}
              <div className="mt-2 mx-3">
                {auth?.token&&clientToken&&cart?.length ? (
                  <>
                    <DropIn
                      options={{
                        authorization: clientToken,
                        paypal: {
                          flow: "vault",
                        },
                        googlePay: {
                          allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                          allowedCardNetworks: [
                            "AMEX",
                            "DISCOVER",
                            "MASTERCARD",
                            "VISA",
                          ],
                          billingAddressRequired: true,
                          billingAddressParameters: {
                            format: "FULL",
                          },
                          phoneNumberRequired: true,
                          environment: "test",
                        },
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />
                    <button
                      onClick={handlePayment}
                      className="btn btn-primary"
                      disabled={loading || !instance || !auth?.user?.address}
                    >
                      {loading ? "Processing..." : "Make Payment"}{" "}
                    </button>
                  </>
                ) : (
                  <p>Loading payment options...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
