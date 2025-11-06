import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiPhone, FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-heading font-bold text-gold-500 mb-4">
              Mateshwari Exports
            </h3>
            <p className="text-gray-400 mb-4">
              Crafting Divinity, One Masterpiece at a Time
            </p>
            <p className="text-gray-400 text-sm">
              Where devotion meets design. Premium marble idols and temples crafted with love and precision.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-gold-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-400 hover:text-gold-500 transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/virtual-showroom" className="text-gray-400 hover:text-gold-500 transition-colors">
                  Virtual Showroom
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-gold-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-gold-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop?category=Temples" className="text-gray-400 hover:text-gold-500 transition-colors">
                  Temples
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Idols" className="text-gray-400 hover:text-gold-500 transition-colors">
                  Idols
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Decor" className="text-gray-400 hover:text-gold-500 transition-colors">
                  Decor
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Custom Orders" className="text-gray-400 hover:text-gold-500 transition-colors">
                  Custom Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-400">
                <FiPhone className="text-gold-500" />
                <span>+91 1234567890</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <FiMail className="text-gold-500" />
                <span>info@mateshwariexports.com</span>
              </li>
              <li className="flex items-center space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-gold-500 transition-colors">
                  <FiFacebook className="text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gold-500 transition-colors">
                  <FiInstagram className="text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gold-500 transition-colors">
                  <FiTwitter className="text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gold-500 transition-colors">
                  <FiYoutube className="text-xl" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Mateshwari Exports. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

