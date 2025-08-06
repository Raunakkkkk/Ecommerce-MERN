import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "../../styles/AuthStyles.css";
import { useAuth } from "../../context/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (auth?.token) {
      navigate("/");
    }
  }, [auth?.token, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/v1/auth/login`,
        {
          email,
          password,
        }
      );
      if (res && res.data.success) {
        toast.success("Welcome back! 🎉");
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate("/");
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));

    if (field === "email") {
      setEmail(value);
    } else if (field === "password") {
      setPassword(value);
    }
  };

  return (
    <Layout title="Login - Instamart">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h4 className="title">Welcome Back</h4>
          <p className="subtitle">Sign in to continue your shopping journey</p>

          <div className="form-group">
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`form-control ${errors.email ? "error" : ""}`}
                placeholder="Enter your email"
                required
              />
            </div>
            {errors.email && (
              <div className="error-message">
                <FaEnvelope />
                {errors.email}
              </div>
            )}
          </div>

          <div className="form-group">
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`form-control ${errors.password ? "error" : ""}`}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "1rem",
                  background: "none",
                  border: "none",
                  color: "#a0aec0",
                  cursor: "pointer",
                  zIndex: 2,
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <div className="error-message">
                <FaLock />
                {errors.password}
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end mb-3">
            <button
              type="button"
              className="forgot-btn"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="signup-link">
            Don't have an account?{" "}
            <Link to="/register" className="forgot-btn">
              Sign up now
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
