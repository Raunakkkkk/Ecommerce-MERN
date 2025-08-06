import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import "../../styles/AuthStyles.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useAuth } from "../../context/auth";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [auth, setAuth] = useAuth();

  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (auth?.token) {
      navigate("/");
    }
  }, [auth?.token, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

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

    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!answer.trim()) {
      newErrors.answer = "City name is required";
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
        `${process.env.REACT_APP_API_ENDPOINT}/api/v1/auth/register`,
        {
          name,
          email,
          password,
          phone,
          address,
          answer,
        }
      );

      if (res && res.data.success) {
        toast.success("Account created successfully! 🎉");
        navigate("/login");
      } else {
        toast.error(res.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));

    switch (field) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "address":
        setAddress(value);
        break;
      case "answer":
        setAnswer(value);
        break;
      default:
        break;
    }
  };

  return (
    <Layout title="Register - Instamart">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h4 className="title">Create Account</h4>
          <p className="subtitle">Join us and start your shopping adventure</p>

          <div className="form-group">
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                value={name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`form-control ${errors.name ? "error" : ""}`}
                placeholder="Enter your full name"
                required
                autoFocus
              />
            </div>
            {errors.name && (
              <div className="error-message">
                <FaUser />
                {errors.name}
              </div>
            )}
          </div>

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
                placeholder="Create a password"
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

          <div className="form-group">
            <div className="input-group">
              <FaPhone className="input-icon" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`form-control ${errors.phone ? "error" : ""}`}
                placeholder="Enter your phone number"
                required
              />
            </div>
            {errors.phone && (
              <div className="error-message">
                <FaPhone />
                {errors.phone}
              </div>
            )}
          </div>

          <div className="form-group">
            <div className="input-group">
              <FaMapMarkerAlt className="input-icon" />
              <input
                type="text"
                value={address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={`form-control ${errors.address ? "error" : ""}`}
                placeholder="Enter your address"
                required
              />
            </div>
            {errors.address && (
              <div className="error-message">
                <FaMapMarkerAlt />
                {errors.address}
              </div>
            )}
          </div>

          <div className="form-group">
            <div className="input-group">
              <FaCity className="input-icon" />
              <input
                type="text"
                value={answer}
                onChange={(e) => handleInputChange("answer", e.target.value)}
                className={`form-control ${errors.answer ? "error" : ""}`}
                placeholder="What is your city name?"
                required
              />
            </div>
            {errors.answer && (
              <div className="error-message">
                <FaCity />
                {errors.answer}
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          <div className="signup-link">
            Already have an account?{" "}
            <Link to="/login" className="forgot-btn">
              Sign in here
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
