import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light py-5">
      <div className="container">
        <div className="row">
          {/* Company Info */}
          <div className="col-md-4 mb-4">
            <h5 className="mb-3 text-white">Instamart</h5>
            <p className="text-light">
              Your one-stop destination for all your shopping needs. Quality
              products, great prices, and excellent customer service.
            </p>
            <div className="social-icons mt-3">
              <a href="#" className="text-light me-3" aria-label="Facebook">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-light me-3" aria-label="Twitter">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-light me-3" aria-label="Instagram">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-light" aria-label="LinkedIn">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-3 mb-4">
            <h5 className="mb-3 text-white">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-light text-decoration-none">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-light text-decoration-none">
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-light text-decoration-none">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-5 mb-4">
            <h5 className="mb-3 text-white">Contact Us</h5>
            <ul className="list-unstyled">
              <li className="mb-2 d-flex align-items-center">
                <MdLocationOn className="me-2 text-light" />
                <span className="text-light">
                  123 Shopping Street, City, Country
                </span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <MdPhone className="me-2 text-light" />
                <span className="text-light">+1 234 567 890</span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <MdEmail className="me-2 text-light" />
                <span className="text-light">info@instamart.com</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4 bg-light" />

        {/* Bottom Footer */}
        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0 text-light">
              &copy; {currentYear} Made by Raunak Agarwal. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <Link to="/policy" className="text-light text-decoration-none me-3">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-light text-decoration-none">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
