import React, { useEffect, useState, useCallback, useMemo } from "react";
import Layout from "../components/layout/Layout";
import axios from "axios";
import { Checkbox, Radio, Dropdown, Button } from "antd";
import { Prices } from "../components/Prices";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import {
  FaFilter,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import "../styles/Homepage.css";

const HomePages = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [cart, setCart] = useCart();
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Memoized API endpoint
  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

  // Calculate pagination values
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, total);

  // Get all categories
  const getAllCategory = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${API_ENDPOINT}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [API_ENDPOINT]);

  // Get products with pagination
  const getAllProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_ENDPOINT}/api/v1/product/get-product?page=${page}&limit=${limit}`
      );
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [API_ENDPOINT, page, limit]);

  // Filter products
  const filterProduct = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${API_ENDPOINT}/api/v1/product/product-filters`,
        { checked, radio, page, limit }
      );
      setProducts(data?.products || []);
      setTotal(data?.total || 0);
    } catch (error) {
      console.error("Error filtering products:", error);
      toast.error("Failed to filter products");
    } finally {
      setLoading(false);
    }
  }, [API_ENDPOINT, checked, radio, page, limit]);

  // Handle filter by category
  const handleFilter = useCallback((value, id) => {
    setChecked((prev) => {
      if (value) {
        return [...prev, id];
      } else {
        return prev.filter((c) => c !== id);
      }
    });
  }, []);

  // Add to cart
  const addToCart = useCallback(
    (product) => {
      const isItemInCart = cart.find((item) => item._id === product._id);

      if (isItemInCart) {
        toast.error("Item is already in the cart");
      } else {
        const newItem = { ...product, quantity: 1 };
        const updatedCart = [...cart, newItem];
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        toast.success("Item Added to Cart");
      }
    },
    [cart, setCart]
  );

  // Clear filters
  const clearFilters = useCallback(() => {
    setChecked([]);
    setRadio([]);
    setPage(1);
  }, []);

  // Pagination handlers
  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handlePrevPage = useCallback(() => {
    if (page > 1) {
      handlePageChange(page - 1);
    }
  }, [page, handlePageChange]);

  const handleNextPage = useCallback(() => {
    if (page < totalPages) {
      handlePageChange(page + 1);
    }
  }, [page, totalPages, handlePageChange]);

  // Generate page numbers
  const getPageNumbers = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  }, [page, totalPages]);

  // Memoized product cards
  const productCards = useMemo(() => {
    return products?.map((p) => {
      const imageUrl = `${API_ENDPOINT}/api/v1/product/product-photo/${p._id}`;
      return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={p._id}>
          <div className="card h-100">
            <img
              src={imageUrl}
              className="card-img-top"
              alt={p.name}
              loading="lazy"
              style={{
                height: "200px",
                objectFit: "cover",
              }}
            />
            <div className="card-body d-flex flex-column">
              <div className="card-name-price">
                <h5 className="card-title text-truncate">{p.name}</h5>
                <h5 className="card-title card-price">
                  {p.price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "INR",
                  })}
                </h5>
              </div>
              <p className="card-text text-truncate">
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
                  className="btn btn-secondary ms-1"
                  onClick={() => addToCart(p)}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }, [products, API_ENDPOINT, navigate, addToCart]);

  // Mobile filters dropdown content
  const mobileFiltersContent = (
    <div className="mobile-filters p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Filters</h5>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={clearFilters}
        >
          <FaTimes /> Clear
        </button>
      </div>

      <div className="mb-4">
        <h6>Filter by Category</h6>
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
      </div>

      <div className="mb-4">
        <h6>Filter by Price</h6>
        <div className="d-flex flex-column">
          <Radio.Group onChange={(e) => setRadio(e.target.value)}>
            {Prices?.map((p) => (
              <div key={p._id}>
                <Radio value={p.array}>{p.name}</Radio>
              </div>
            ))}
          </Radio.Group>
        </div>
      </div>
    </div>
  );

  // Custom Pagination Component
  const CustomPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="custom-pagination">
        <div className="pagination-info">
          Showing {startIndex} to {endIndex} of {total} results
        </div>
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            onClick={handlePrevPage}
            disabled={page === 1}
          >
            <FaChevronLeft />
          </button>

          {getPageNumbers.map((pageNum, index) => (
            <button
              key={index}
              className={`pagination-btn ${pageNum === page ? "active" : ""} ${
                pageNum === "..." ? "disabled" : ""
              }`}
              onClick={() =>
                typeof pageNum === "number" && handlePageChange(pageNum)
              }
              disabled={pageNum === "..."}
            >
              {pageNum}
            </button>
          ))}

          <button
            className="pagination-btn"
            onClick={handleNextPage}
            disabled={page === totalPages}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    );
  };

  // Effects
  useEffect(() => {
    getAllCategory();
  }, [getAllCategory]);

  useEffect(() => {
    if (!checked.length && !radio.length) {
      getAllProducts();
    }
  }, [getAllProducts, checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) {
      filterProduct();
    }
  }, [filterProduct, checked.length, radio.length]);

  return (
    <Layout title={"All Products - Best Offers"}>
      <img
        src="/images/banner.jpg"
        className="banner-img"
        alt="bannerimage"
        width={"100%"}
        loading="lazy"
      />

      <div className="container-fluid row mt-3 home-page">
        {/* Desktop Filters */}
        <div className="col-md-3 col-lg-2 filters d-none d-md-block">
          <h4 className="text-center">Filter by Category</h4>
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
          <h4 className="text-center mt-4">Filter by Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column mt-3">
            <button className="btn btn-danger" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>

        {/* Mobile Filters Dropdown */}
        <div className="d-md-none mb-3">
          <Dropdown
            overlay={mobileFiltersContent}
            trigger={["click"]}
            placement="bottomLeft"
            overlayClassName="mobile-filters-dropdown"
          >
            <Button className="w-100 d-flex align-items-center justify-content-center">
              <FaFilter className="me-2" />
              Filters
            </Button>
          </Dropdown>
        </div>

        <div className="col-md-9 col-lg-10">
          <h1 className="text-center">All Items</h1>
          {loading && (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          <div className="row">{productCards}</div>
          {!loading && total > 0 && <CustomPagination />}
        </div>
      </div>

      <style>
        {`
          @media (max-width: 768px) {
            .home-page {
              margin-top: 80px !important;
            }
            
            .mobile-filters-dropdown .ant-dropdown-menu {
              max-width: 300px;
              width: 100vw;
              margin: 0 10px;
            }
            
            .mobile-filters {
              background: white;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
              max-height: 70vh;
              overflow-y: auto;
            }
          }

          .custom-pagination {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            margin: 2rem 0;
            padding: 1rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          .pagination-info {
            color: #6b7280;
            font-size: 0.875rem;
          }

          .pagination-controls {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex-wrap: wrap;
            justify-content: center;
          }

          .pagination-btn {
            min-width: 40px;
            height: 40px;
            border: 1px solid #e5e7eb;
            background: white;
            color: #4b5563;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 500;
          }

          .pagination-btn:hover:not(:disabled) {
            background: #f3f4f6;
            border-color: #d1d5db;
          }

          .pagination-btn.active {
            background: #6366f1;
            color: white;
            border-color: #6366f1;
          }

          .pagination-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .pagination-btn.disabled {
            cursor: default;
            background: transparent;
            border: none;
          }

          @media (max-width: 640px) {
            .pagination-controls {
              gap: 0.25rem;
            }
            
            .pagination-btn {
              min-width: 36px;
              height: 36px;
              font-size: 0.875rem;
            }
          }
        `}
      </style>
    </Layout>
  );
};

export default HomePages;
