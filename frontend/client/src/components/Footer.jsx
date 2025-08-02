import React, { useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPinterestP,
  FaYoutube,
} from "react-icons/fa";
import { FiMail, FiPhone } from "react-icons/fi"; // Right package
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const Footer = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
<footer className="w-full pt-10 pb-6 bg-gradient-to-t from-orange-400 to-orange-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Sections */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
          {/* Need Help? */}
          <div>
            <h3 className="font-bold mb-3">Need Help?</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Track Order
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Returns & Exchange
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Shipping
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Cancellation
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold mb-3">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Collaborations
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Media
                </a>
              </li>
            </ul>
          </div>

          {/* More Info */}
          <div>
            <h3 className="font-bold mb-3">More Info</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Sitemap
                </a>
              </li>
            </ul>
          </div>

          {/* Popular Categories (Toggle) */}
          <div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-between w-full font-bold mb-3 bg-transparent text-white"
            >
              Popular Categories
              {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {isExpanded && (
              <ul className="space-y-2 text-sm bg-transparent">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Men's T-Shirts
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Women's T-Shirts
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Full Sleeve T-Shirts
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Hoodies & Sweatshirts
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:underline">
                    Jackets
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:underline">
                    Joggers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:underline">
                    Shorts
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:underline">
                    Vests
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:underline">
                    Polo T-Shirts
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:underline">
                    Shirts
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:underline">
                    Co-ord Sets
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:underline">
                    Plus Size
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:underline">
                    Boxers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Jeans & Denims
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Trousers & Pyjamas
                  </a>
                </li>
              </ul>
            )}
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-bold mb-3">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Dummy Link 1
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Dummy Link 2
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Dummy Link 3
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-white"></div>

        {/* Bottom Section */}
        <div className="text-sm">
          <h3 className="font-bold mb-3">Connect With Us</h3>
          <div className="flex space-x-4 text-xl mb-3">
            <a href="#" className="text-gray-300 hover:text-white">
              <FaFacebookF />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <FaInstagram />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <FaTwitter />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <FaPinterestP />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <FaYoutube />
            </a>
          </div>
          <div className="space-y-1">
            <p className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200">
              <FiMail /> dummy@example.com
            </p>
            <p className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200">
              <FiPhone /> +1 234 567 890 (Dummy Number)
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-white"></div>

        {/* Copyright */}
        <div className="text-center text-xs text-white">
          © {new Date().getFullYear()} The Souled Store. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
