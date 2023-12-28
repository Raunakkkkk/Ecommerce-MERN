import React, { useEffect, useState } from "react";
import Layout from "./../components/layout/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import'../styles/ProductDetailsStyles.css'
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
const ProductDetails = () => {
  //get product
  const params = useParams();
  const [product, setProduct] = useState({});
  const [cart,setCart]=useCart();
  //initial details
  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      {/* {JSON.stringify(product,null,4)} */}

      <div className="row container product-details">
        <div className="col-md-6">
          <img
            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
            className="card-img-top"
            alt={product.name}
            height="400"
            // width={"350px"}
          />
</div>

          <div className="col-md-6 product-details-info ">

          <h1 className="text-center">Product Details</h1>
          <hr/>
          <h3>Name : {product.name}</h3>
          <h4>Description : {product.description}</h4>
          <h4>Price : {product.price}</h4>
          <h4>Category : {product?.category?.name}</h4>
          <button class="btn btn-secondary ms-1" 
           onClick={() => {
            setCart([...cart, product]);
            localStorage.setItem(
              "cart",
              JSON.stringify([...cart, product])
            );
            toast.success("Item Added to Cart ");
          }}
          >ADD TO CART</button>
          </div>
        </div>
      
    </Layout>
  );
};

export default ProductDetails;
