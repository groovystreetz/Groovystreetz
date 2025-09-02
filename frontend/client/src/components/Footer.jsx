import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-10 bg-[#F57C26] text-white w-full pb-0 pt-12 border-t border-[#d86a1f]">
      {/* Outer wrapper */}
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Inner grid */}
        <div className="grid md:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <div>
            <img src="/logo.png" alt="Logo" className="h-12 mb-4 drop-shadow-[0_1px_0_rgba(0,0,0,0.18)]" />
            <p className="text-sm text-white/90 leading-relaxed">
              Your go-to destination for quality products and smooth shopping experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-white">Quick Links</h2>
            <ul className="space-y-2 text-white/80 text-sm">
              {["Home", "Shop", "About Us", "Contact"].map((link, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-white hover:text-white transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-white">Follow Us</h2>
            <div className="flex space-x-4">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-200"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-white">Newsletter</h2>
            <p className="text-white/90 text-sm mb-3">
              Subscribe to get the latest updates.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-md text-gray-800 text-sm outline-none w-full border border-white/60 focus:border-white"
              />
              <button className="bg-white hover:bg-white/90 text-[#F57C26] px-4 py-2 rounded-md text-sm w-full sm:w-auto transition-colors duration-200 shadow-sm hover:shadow">
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
