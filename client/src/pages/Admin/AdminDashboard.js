import React from 'react'
import Dashboard from './../user/Dashboard';
import Layout from '../../components/layout/Layout';
import AdminMenu from '../../components/layout/AdminMenu';
import { useAuth } from '../../context/auth';

const AdminDashboard = () => {
  const [auth]=useAuth();
  return (
    <Layout>
        <div className='container-fluid m-3 p-3'>
          <div className='row'>
            <div className='col-md-3'>
<AdminMenu/>
            </div>
            <div className='col-md-9'>
              <div className='card w-76 p-3'>
<h2>Admin name: {auth?.user?.name}</h2>
<h2>Admin email: {auth?.user?.email}</h2>
<h2>Admin phone: {auth?.user?.phone}</h2>
              </div>

            </div>

          </div>


        </div>
    </Layout>
  )
}

export default AdminDashboard