import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";
import axios from "axios";
import { Table, Space, Modal, Skeleton } from "antd";
import { useAuth } from "../../context/auth";
import { toast } from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [auth] = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const getAllUsers = async () => {
    try {
      setLoadingUsers(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/v1/auth/all-users`
      );
      if (data?.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const getUserOrders = async (userId) => {
    try {
      setLoadingOrders(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/v1/auth/user-orders/${userId}`
      );
      if (data?.success) {
        setUserOrders(data.orders);
      } else {
        toast.error(data?.message || "Error fetching orders");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Error fetching user orders"
      );
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleViewOrders = async (user) => {
    setSelectedUser(user);
    await getUserOrders(user._id);
    setIsModalVisible(true);
  };

  useEffect(() => {
    if (auth?.token) getAllUsers();
  }, [auth?.token]);

  const handleDelete = async (userId) => {
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API_ENDPOINT}/api/v1/auth/delete-user/${userId}`
      );
      if (data?.success) {
        toast.success("User deleted successfully");
        getAllUsers();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in deleting user");
    }
  };

  const confirmDelete = (userId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      content: "This action cannot be undone",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDelete(userId);
      },
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <a onClick={() => handleViewOrders(record)}>{text}</a>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Orders",
      key: "orderCount",
      dataIndex: "orderCount",
      render: (orderCount) => <span>{orderCount}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <button
            className="btn btn-danger btn-sm"
            onClick={() => confirmDelete(record._id)}
          >
            Delete
          </button>
        </Space>
      ),
    },
  ];

  const orderColumns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      render: (id) => id.substring(0, 8) + "...",
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
      render: (products) => (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {products.map((product) => (
            <li key={product._id}>{product.name}</li>
          ))}
        </ul>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          style={{
            color:
              status === "Processing"
                ? "orange"
                : status === "Shipped"
                ? "blue"
                : status === "Delivered"
                ? "green"
                : "red",
          }}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "payment",
      key: "amount",
      render: (payment) => {
        const amount = payment?.amount || 0;
        return `₹${amount.toLocaleString("en-IN")}`;
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <Layout>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>All Users List</h1>
            {loadingUsers ? (
              <div>
                <Skeleton active title paragraph={{ rows: 5 }} />
                <Skeleton active title paragraph={{ rows: 5 }} />
              </div>
            ) : (
              <Table columns={columns} dataSource={users} rowKey="_id" />
            )}
          </div>
        </div>
      </div>

      <Modal
        title={`Orders for ${selectedUser?.name}`}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {loadingOrders ? (
          <Skeleton active title paragraph={{ rows: 6 }} />
        ) : (
          <Table
            columns={orderColumns}
            dataSource={userOrders}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
          />
        )}
      </Modal>
    </Layout>
  );
};

export default Users;
