import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-10 bg-[#F57C26]  text-white w-full pb-0 pt-12 border-t border-[#d86a1f]">
      {/* Outer wrapper */}
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Inner grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-1">
            <img src="/logo.png" alt="Logo" className="h-12 mb-4 drop-shadow-[0_1px_0_rgba(0,0,0,0.18)]" />
            <p className="text-sm text-white/90 leading-relaxed">
              Your go-to destination for quality products and smooth shopping experiences.
            </p>
          </div>

          {/* Customer Service */}  
          <div>
            <h2 className="text-lg font-semibold mb-4 text-white">CUSTOMER SERVICE</h2>
            <ul className="space-y-2 text-white/80 text-sm">
              <li>
                <Link to="/contact" className="text-white hover:text-white/80 transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-white hover:text-white/80 transition-colors duration-200">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-white hover:text-white/80 transition-colors duration-200">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-white hover:text-white/80 transition-colors duration-200">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-white hover:text-white/80 transition-colors duration-200">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-white">COMPANY</h2>
            <ul className="space-y-2 text-white/80 text-sm">
              <li>
                <Link to="/about" className="text-white hover:text-white/80 transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/investor-relations" className="text-white hover:text-white/80 transition-colors duration-200">
                  Investor Relation
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-white hover:text-white/80 transition-colors duration-200">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/gift-vouchers" className="text-white hover:text-white/80 transition-colors duration-200">
                  Gift Vouchers
                </Link>
              </li>
            </ul>
          </div>

          {/* More Info */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-white">MORE INFO</h2>
            <ul className="space-y-2 text-white/80 text-sm">
              <li>
                <Link to="/terms-conditions" className="text-white hover:text-white/80 transition-colors duration-200">
                  T&C
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-white hover:text-white/80 transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="text-white hover:text-white/80 transition-colors duration-200">
                  Sitemap
                </Link>
              </li>
              <li>
                <Link to="/notifications" className="text-white hover:text-white/80 transition-colors duration-200">
                  Get Notified
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media & Newsletter */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-lg font-semibold mb-4 text-white">Follow Us</h2>
            <div className="flex space-x-4 mb-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-200"
              >
                <FaFacebookF size={14} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-200"
              >
                <FaTwitter size={14} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-200"
              >
                <FaInstagram size={14} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-200"
              >
                <FaLinkedinIn size={14} />
              </a>
            </div>
            
            <h3 className="text-lg font-semibold mb-4 text-white">Newsletter</h3>
            <p className="text-white/90 text-sm mb-3">
              Subscribe to get the latest updates.
            </p>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-md text-gray-800 text-sm outline-none w-full border border-white/60 focus:border-white"
              />
              <button className="bg-white hover:bg-white/90 text-[#F57C26] px-4 py-2 rounded-md text-sm w-full transition-colors duration-200 shadow-sm hover:shadow">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="w-full mt-10 border-t border-white/30 pt-6 text-sm text-center text-white/80 px-6">
        © {new Date().getFullYear()} GroovyStreetz. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
