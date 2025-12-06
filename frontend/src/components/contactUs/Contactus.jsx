'use client';

import "./contactus.css";
import React, { useState } from "react";
import Image from 'next/image';
import goldenImg from "../../assets/Images/banner/contactBanner.jpg";
import customerIcon from "../../assets/img/icons/customer-support.png";
import lineImg from "../../assets/img/Line 37.png";
import phoneIcon from "../../assets/img/icons/phone 1.png";
import locationIcon from "../../assets/img/icons/location 1.png";
import emailIcon from "../../assets/img/icons/email 2.png";
import axios from 'axios';

// import PvjMember from "../../components/pvj-member/PvjMember";
import vectorIcon from "../../assets/img/icons/Vector.png";

const API_URL = process.env.NEXT_PUBLIC_API_URL

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.post(`${API_URL}/contact-us`, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.subject,
        message: form.message,
      });
      const data = res.data;
      if (data.success) {
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
        alert('Thank you for contacting us! We will get back to you soon.');
      } else {
        alert(data.message || 'Something went wrong');
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Network error. Please try again.');
    }
    setSubmitting(false);
  };

  // Mobile search bar handler
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(search)}`
      );
      if (!response.ok) throw new Error("Backend not available");
      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      setError("No backend connected or an error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contactUs-container">
      {/* Mobile Search Bar */}
      <form className="contactus-mobile-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search  Rings"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="contactus-mobile-search-input"
        />
        <button type="submit" className="contactus-mobile-search-btn">
          <Image src={vectorIcon} alt="Search" width={20} height={20} />
        </button>
      </form>
      {/* Mobile Search Results */}
      {search && (
        <ul className="contactus-mobile-search-results">
          {loading && <li>Loading...</li>}
          {error && <li>{error}</li>}
          {!loading && !error && results.length === 0 && (
            <li>No results found.</li>
          )}
          {!loading &&
            !error &&
            results.map((item, idx) => (
              <li key={idx}>{item.name || item.title || item}</li>
            ))}
        </ul>
      )}

      <div className="contactus-banner" style={{ position: 'relative', width: '100%', height: '200px' }}>
        <Image src={goldenImg} alt="Banner" fill style={{ objectFit: 'cover' }} />
        <h2>CONTACT US</h2>
      </div>
      <div className="contactus-content">
        {/* Left Section */}
        <div className="contactus-left">
          <div className="contactus-help">
            <div className="contactus-help-icon">
              <Image src={customerIcon} alt="Help" width={40} height={40} />
            </div>
            <span className="contactus-help-text">Need Any Help ?</span>
          </div>
          <h3 className="contactus-title">GET IN TOUCH WITH US</h3>
          <p className="contactus-desc">
            Have a question or custom request? Fill out the form below — we&apos;re
            here to help. Thank you
          </p>
          <Image src={lineImg} alt="" className="contactus-line1" width={200} height={2} style={{ width: '100%', height: 'auto' }} />
          <div className="contactus-contact-block">
            <div className="contactus-contact-label">
              <b>Contact-</b>
            </div>
            <div className="contactus-contact-info">
              <div className="contactus-contact-row">
                <Image
                  src={locationIcon}
                  alt="Location"
                  className="contactus-contact-icon"
                  width={20}
                  height={20}
                />
                <a
                  href="https://www.google.com/maps/search/2310,+Khajane+walo+ka+Rasta,+Nehru+Tailour+Chouraha,+Chandpole+Bazar,+Jaipur-302001"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  2310, Khajane walo ka Rasta, Nehru Tailour Chouraha, Chandpole Bazar, Jaipur-302001 (Rajasthan) INDIA
                </a>
              </div>
              <div className="contactus-contact-row">
                <Image
                  src={phoneIcon}
                  alt="Phone"
                  className="contactus-contact-icon"
                  width={20}
                  height={20}
                />
                <a
                  href="tel:+917791983156"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  +91 77919 83156
                </a>
                <span style={{ margin: "0 8px" }}>|</span>
                <a
                  href="tel:+918824292890"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  +91 88242 92890
                </a>
                <span style={{ margin: "0 8px" }}>|</span>
                <a
                  href="tel:+919784503338"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  +91 97845 03338
                </a>

              </div>
              <div className="contactus-contact-row">
                <Image
                  src={emailIcon}
                  alt="Email"
                  className="contactus-contact-icon"
                  width={20}
                  height={20}
                />
                <a
                  href="mailto:Mateshvariexporter@gmail.com"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Mateshvariexporter@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Right Section */}
        <div className="contactus-right">
          <form className="contactus-form" onSubmit={handleSubmit}>
            <h3 className="contactus-form-title">Send Us a Message</h3>
            <span className="right-contact-line"></span>
            <label htmlFor="contact-name">Name*</label>
            <input
              id="contact-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              autoComplete="name"
            />
            <label htmlFor="contact-email">Email*</label>
            <input
              id="contact-email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              type="email"
              required
              autoComplete="email"
            />
            <label htmlFor="contact-phone">Phone Number*</label>
            <input
              id="contact-phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              autoComplete="tel"
            />
            <label htmlFor="contact-subject">Subject*</label>
            <input
              id="contact-subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Subject of your message"
              required
            />
            <label htmlFor="contact-message">Message*</label>
            <input
              id="contact-message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Type your message here..."
              required
              rows="4"

            />
            <button type="submit" className="contactus-submit-btn" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>

      {/* map */}
      <div id="map" className="contactus-googlemap">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.1234567890123!2d75.76991568465547!3d26.863326047415356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db56788547435%3A0xe1075755bf375bee!2s2310%2C+Khajane+walo+ka+Rasta%2C+Nehru+Tailour+Chouraha%2C+Chandpole+Bazar%2C+Jaipur-302001!5e0!3m2!1sen!2sin!4v1751001931260!5m2!1sen!2sin"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

    </div>
  );
};

export default ContactUs;
