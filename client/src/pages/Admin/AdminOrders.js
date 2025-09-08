import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select, Modal, Skeleton } from "antd";
import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";

const { Option } = Select;

const AdminOrders = () => {
  const status = [
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();
  const [loading, setLoading] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

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
              <div className="table-responsive">
                <table className="table">
                  <thead>
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
                    {[...Array(5)].map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 8 }).map((__, j) => (
                          <td key={j}>
                            <Skeleton
                              active
                              paragraph={false}
                              title={{ width: "80%" }}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                            onClick={() => {
                              setActiveOrder(o);
                              setIsDetailsOpen(true);
                            }}
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
            <Modal
              title={
                activeOrder
                  ? `Order #${activeOrder?._id?.slice(-6)}`
                  : "Order Details"
              }
              open={isDetailsOpen}
              onCancel={() => setIsDetailsOpen(false)}
              footer={null}
              width={900}
            >
              {!activeOrder ? (
                <Skeleton active />
              ) : (
                <div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <div>
                        <strong>Buyer:</strong>{" "}
                        {activeOrder?.buyer?.name || "-"}
                      </div>
                      <div>
                        <strong>Email:</strong>{" "}
                        {activeOrder?.buyer?.email || "-"}
                      </div>
                      <div>
                        <strong>Address:</strong>{" "}
                        {activeOrder?.buyer?.address || "-"}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div>
                        <strong>Status:</strong> {activeOrder?.status}
                      </div>
                      <div>
                        <strong>Payment:</strong>{" "}
                        {activeOrder?.payment?.success ? (
                          <span className="text-success">Success</span>
                        ) : (
                          <span className="text-danger">Failed</span>
                        )}
                      </div>
                      <div>
                        <strong>Items:</strong>{" "}
                        {activeOrder?.products?.length || 0}
                      </div>
                      <div>
                        <strong>Total:</strong> ₹
                        {(activeOrder?.products || []).reduce(
                          (acc, p) => acc + (p.price || 0),
                          0
                        )}
                      </div>
                      <div>
                        <strong>Date:</strong>{" "}
                        {moment(activeOrder?.createdAt).format(
                          "MMMM Do YYYY, h:mm a"
                        )}
                      </div>
                    </div>
                  </div>

                  <h6 className="mb-3">Products</h6>
                  <div className="table-responsive">
                    <table className="table table-sm align-middle">
                      <thead>
                        <tr>
                          <th className="d-none d-sm-table-cell">Image</th>
                          <th>Name</th>
                          <th>Description</th>
                          <th className="text-end">Price (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeOrder?.products?.map((p) => (
                          <tr key={p._id}>
                            <td
                              className="d-none d-sm-table-cell"
                              style={{ width: "88px" }}
                            >
                              <img
                                src={`${process.env.REACT_APP_API_ENDPOINT}/api/v1/product/product-photo/${p._id}`}
                                alt={p.name}
                                className="img-fluid rounded"
                                style={{
                                  maxWidth: "72px",
                                  maxHeight: "72px",
                                  objectFit: "cover",
                                }}
                              />
                            </td>
                            <td>{p.name}</td>
                            <td className="text-muted">
                              {(p.description || "").substring(0, 80)}
                              {(p.description || "").length > 80 ? "..." : ""}
                            </td>
                            <td className="text-end">{p.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
