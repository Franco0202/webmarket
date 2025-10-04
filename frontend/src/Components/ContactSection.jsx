import React from "react";
import "./ContactSection.css";

function ContactSection() {
  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      <div className="contact-details">
        <div className="contact-item">
          <h3>Email</h3>
          <p>support@yourcompany.com</p>
          <p>info@yourcompany.com</p>
        </div>
        <div className="contact-item">
          <h3>Phone</h3>
          <p>+1 234 567 890</p>
          <p>+1 987 654 321</p>
        </div>
        <div className="contact-item">
          <h3>Address</h3>
          <p>123 Your Street</p>
          <p>City, Country</p>
        </div>
      </div>
      <p className="contact-footer">© {new Date().getFullYear()} Your Company. All rights reserved.</p>
    </div>
  );
}

export default ContactSection;
