import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-10 bg-gray-100 text-gray-800 w-full pb-0 pt-12 border-t border-gray-200">
      {/* Outer wrapper */}
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Inner grid */}
        <div className="grid md:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <div>
            <img src="/logo.png" alt="Logo" className="h-12 mb-4" />
            <p className="text-sm text-gray-600 leading-relaxed">
              Your go-to destination for quality products and smooth shopping experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
            <ul className="space-y-2 text-gray-600 text-sm">
              {["Home", "Shop", "About Us", "Contact"].map((link, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="hover:text-black transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Follow Us</h2>
            <div className="flex space-x-4">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-200"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Newsletter</h2>
            <p className="text-gray-600 text-sm mb-3">
              Subscribe to get the latest updates.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-md text-gray-800 text-sm outline-none w-full border border-gray-300 focus:border-gray-500"
              />
              <button className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm w-full sm:w-auto transition-colors duration-200">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="w-full mt-10 border-t border-gray-300 pt-6 text-sm text-center text-gray-600 px-6">
        © {new Date().getFullYear()} BrandName. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
