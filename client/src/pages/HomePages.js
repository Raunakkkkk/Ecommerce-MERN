import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import axios from "axios";
import { Button, Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import'../styles/Homepage.css'

const HomePages = () => {
  const [products, setProducts] = useState();
  const [categories, setCategories] = useState();
  const [checked, setChecked] = useState([]); //isme hum sabki id store rakhenge jo checked hai
  //get all category
  const [radio, setRadio] = useState([]);
  const navigate = useNavigate();
  const [cart, setCart] = useCart();

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        "/api/v1/category/get-category"
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []); //initial time pr milegi

  //filter by category
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      // if category  is checked
      all.push(id);
    } else {
      //us category se related nhi dikhane
      all = all.filter((c) => c !== id);
    }

    setChecked(all);
  };

  //get products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        "/api/v1/product/get-product"
      );
      setProducts(data.products);
    } catch (error) {}
  };
  useEffect(() => {
    if (!checked.length || !radio.length) {
      getAllProducts();
      //mtlb jab koi filter ya radio na laga ho to sare products diha do
    }
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) {
      filterProduct();
    }
  }, [checked, radio]);

  //get filtered product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post(
        "/api/v1/product/product-filters",
        { checked, radio }
      );

      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };
  //to add item to cart
  const addToCart = (product) => {
    const isItemInCart = cart.find((item) => item._id === product._id);

    if (isItemInCart) {
      toast.error("Item is already in the cart");
    } else {
      const newItem = { ...product, quantity: 1 }; // Adding default quantity
      setCart([...cart, newItem]);
      localStorage.setItem("cart", JSON.stringify([...cart, newItem]));
      toast.success("Item Added to Cart");
    }
  };
  return (
    <Layout title={"All Products - Best Offers"}>
            <img
        src="/images/banner.jpg"
        className="banner-img"
        alt="bannerimage"
        width={"100%"}
      />

      <div className=" container-fluid row mt-3 home-page">
        <div className="col-md-2 filters">
          <h4 className="text-center">Filter by Categroy</h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          {/* price filter */}
          <h4 className="text-center mt-4">Filter by Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {/* //price from price filter */}
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column mt-3">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="col-md-10">
          {/* {JSON.stringify(radio,null,4)} */}
          <h1 className="text-center  "> 
            {/* All Products */}
            All Items
            </h1>
          <div className="d-flex flex-wrap">
            {products?.map((p) => (
              <div className="card m-2 d-flex flex-column" 
              key={p._id}
              style={{ width: "18rem" }}>
                <img
                  src={`/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body d-flex flex-column">
                <div className="card-name-price">
                    <h5 className="card-title">{p.name}</h5>
                    <h5 className="card-title card-price">
                      {p.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </h5>
                  </div>
                  <p className="card-text ">
                    {p.description.substring(0, 60)}...
                  </p>
                  <div className="card-name-price mt-auto">
                    <button
                      className="btn btn-primary ms-1"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                  <button
                    class="btn btn-secondary ms-1"
                    onClick={() => addToCart(p)}

                  >
                    ADD TO CART
                  </button>
                  </div>
                </div>
              </div>
            ))}{" "}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePages;
