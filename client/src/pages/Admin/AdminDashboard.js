import React from "react";
import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";
import { useAuth } from "../../context/auth";

const AdminDashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout title={"Admin Dashboard"}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3">
            <AdminMenu />
          </div>

          {/* Main Content */}
          <div className="col-md-9">
            <div className="card p-3">
              <h2 className="mb-3">Admin Details</h2>
              <p>
                <strong>Name:</strong> {auth?.user?.name}
              </p>
              <p>
                <strong>Email:</strong> {auth?.user?.email}
              </p>
              <p>
                <strong>Phone:</strong> {auth?.user?.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
