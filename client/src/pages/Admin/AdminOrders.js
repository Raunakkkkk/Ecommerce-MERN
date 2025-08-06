import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from "antd";
import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";

const { Option } = Select;

const AdminOrders = () => {
  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ]);
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();
  const [loading, setLoading] = useState(true);

  // Fetch all orders
  const getOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/v1/auth/all-orders`
      );
      setOrders(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  // Handle status change
  const handleChange = async (orderId, value) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_ENDPOINT}/api/v1/auth/order-status/${orderId}`,
        { status: value }
      );
      toast.success("Order status updated successfully");
      getOrders();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update order status");
    }
  };

  return (
    <Layout title={"Dashboard - Manage Orders"}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3">
            <AdminMenu />
          </div>

          {/* Main Content */}
          <div className="col-md-9">
            <h1 className=" mb-4">All Orders</h1>
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : orders.length === 0 ? (
              <div className="text-center">No orders found</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-primary">
                    <tr>
                      <th>#</th>
                      <th>Buyer</th>
                      <th>Status</th>
                      <th>Payment</th>
                      <th>Quantity</th>
                      <th>Total Price</th>
                      <th>Order Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders?.map((o, i) => (
                      <tr key={o._id}>
                        <td>{i + 1}</td>
                        <td>{o?.buyer?.name}</td>
                        <td>
                          <Select
                            bordered={false}
                            onChange={(value) => handleChange(o._id, value)}
                            defaultValue={o?.status}
                            className="status-select"
                          >
                            {status.map((s, i) => (
                              <Option key={i} value={s}>
                                {s}
                              </Option>
                            ))}
                          </Select>
                        </td>
                        <td>
                          {o?.payment.success ? (
                            <span className="text-success">Success</span>
                          ) : (
                            <span className="text-danger">Failed</span>
                          )}
                        </td>
                        <td>{o?.products?.length}</td>
                        <td>
                          ₹{o?.products.reduce((acc, p) => acc + p.price, 0)}
                        </td>
                        <td>{moment(o?.createdAt).format("MMMM Do YYYY")}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            data-bs-toggle="collapse"
                            data-bs-target={`#orderDetails${i}`}
                            aria-expanded="false"
                            aria-controls={`orderDetails${i}`}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Order Details */}
            {orders?.map((o, i) => (
              <div
                className="collapse mt-3"
                id={`orderDetails${i}`}
                key={`details-${o._id}`}
              >
                <div className="card card-body">
                  <h5>Order #{i + 1} Details</h5>
                  <div className="row">
                    {o?.products?.map((p) => (
                      <div className="col-md-4 mb-3" key={p._id}>
                        <div className="card h-100">
                          <img
                            src={`${process.env.REACT_APP_API_ENDPOINT}/api/v1/product/product-photo/${p._id}`}
                            className="card-img-top"
                            alt={p.name}
                          />
                          <div className="card-body">
                            <h6 className="card-title">{p.name}</h6>
                            <p className="card-text">
                              {p.description.substring(0, 50)}...
                            </p>
                            <p className="card-text">
                              <strong>Price:</strong> ₹{p.price}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
