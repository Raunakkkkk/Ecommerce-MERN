import React from 'react'
import Layout from '../../components/layout/Layout'
import UserMenu from '../../components/layout/UserMenu'

const Orders = () => {
  return (
    <Layout>
        <div className='container-fluid p-3 m-3 dashboard'>
            <div className='row'>
                <div className='col-md-3'>
                    <UserMenu/>
                </div>
                <div className='col-md-9'>
                    All Orders



                </div>
                <h1></h1>
            </div>
        </div>
    </Layout>
  )
}

export default Orders