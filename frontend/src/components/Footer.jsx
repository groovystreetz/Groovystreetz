import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-10 bg-orange-400 text-white w-full pb-0 pt-10">
      {/* Outer full-width wrapper */}
      <div className="w-full p-0 m-0">
        {/* Inner centered grid content */}
        <div className="grid md:grid-cols-4 gap-8 px-4 md:px-8">
          {/* Logo & Description */}
          <div>
            <img src="/logo.png" alt="Logo" className="h-12 mb-4" />
            <p className="text-sm text-orange-100">
              Your go-to destination for quality products and smooth shopping experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-white">Quick Links</h2>
            <ul className="space-y-2 text-orange-100 text-sm">
              <li><a href="#" className="hover:text-white">Home</a></li>
              <li><a href="#" className="hover:text-white">Shop</a></li>
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-white">Follow Us</h2>
            <div className="flex space-x-4 text-xl text-orange-100">
              <a href="#" className="hover:text-white"><FaFacebookF /></a>
              <a href="#" className="hover:text-white"><FaTwitter /></a>
              <a href="#" className="hover:text-white"><FaInstagram /></a>
              <a href="#" className="hover:text-white"><FaLinkedinIn /></a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-white">Newsletter</h2>
            <p className="text-orange-100 text-sm mb-3">Subscribe to get the latest updates.</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-md text-gray-800 text-sm outline-none w-full"
              />
              <button className="bg-white hover:bg-orange-100 text-orange-600 px-4 py-2 rounded-md text-sm w-full sm:w-auto">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="w-full mt-10 border-t border-orange-300 pt-6 text-sm text-center text-orange-100 px-4 md:px-8">
        © {new Date().getFullYear()} BrandName. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
