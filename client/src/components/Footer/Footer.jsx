import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaBook, FaFacebook, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";
import "./Footer.css";

export const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="gy-4">
          <Col md={4}>
            <div className="footer-title">
              <FaBook className="text-warning" size={24} />
              <span>BookStore</span>
            </div>
            <p className="footer-desc">
              Your favorite community marketplace for buying and selling books. 
              Connect, read, and share the joy of literature.
            </p>
          </Col>

          <Col md={2} xs={6}>
            <h5 className="text-white mb-3">Shop</h5>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          </Col>

          <Col md={2} xs={6}>
            <h5 className="text-white mb-3">Support</h5>
            <ul className="footer-links">
              <li><Link to="#">Help Center</Link></li>
              <li><Link to="#">Terms of Service</Link></li>
              <li><Link to="#">Privacy Policy</Link></li>
            </ul>
          </Col>

          <Col md={4}>
            <h5 className="text-white mb-3">Follow Us</h5>
            <div className="footer-social">
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaGithub /></a>
            </div>
          </Col>
        </Row>

        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} BookStore. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};