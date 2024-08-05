import React from 'react'
import Footer from './Footer'
import Header from './Header'
import {Helmet} from "react-helmet";
// isse SEO hota hai

import  { Toaster } from 'react-hot-toast';

const Layout = ({children,title,description,author,keywords}) => {
  return (
    <div>
       <Helmet>
                <meta charSet="utf-8" />
       <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
                <title>{title}</title>
            </Helmet>
<Header/>
<main style={{minHeight:'80vh'}}>
  <Toaster/>
        {children}
        {/* isse layout ke andar jo wrap rahega vo iske format se ayenge */}

</main>
<Footer/>
    </div>

  )
}
Layout.defaultProps = {
  title: "Ecommerce app - shop now",
  description: "mern stack project",
  keywords: "mern,react,node,mongodb",
  author: "Techinfoyt",
};

export default Layout