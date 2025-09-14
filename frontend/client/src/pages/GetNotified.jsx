import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function GetNotified() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await axios.post(import.meta.env.VITE_API_BASE_URL + "/notify/", {
        email,
      });
      setSuccess("Thanks for subscribing! 🎉");
      setEmail("");
    } catch (err) {
      setErrors({ api: "Something went wrong. Please try again later." });
    }
  };

  return (
    <div className="w-[99vw]">
      {/* <Navbar /> */}
      <div className="flex items-center justify-center min-h-screen bg-gray-50 pt-8 p-4">
        <div className="bg-white rounded-3xl shadow-lg flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
          {/* Left Side */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-orange-400 to-orange-500 p-10 flex flex-col justify-between relative text-center md:text-left">
            <div>
              <h2 className="text-white text-3xl md:text-4xl font-bold mb-4 leading-tight">
                Stay in the loop <br className="hidden md:block" /> with Groovystreetz
              </h2>
              <p className="text-orange-100 mb-8 text-sm md:text-base">
                Be the first to know about new arrivals, exclusive drops, and
                special discounts.  
              </p>
            </div>
            <div className="flex justify-center md:justify-end items-end">
              <img src="/notifyhero.png" alt="notify" className="max-h-48 md:max-h-64" />
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
            {/* Logo */}
            <div className="flex items-center mb-6 md:mb-8 justify-center md:justify-start">
              <div className="bg-orange-400 rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center mr-3">
                <span className="text-white text-xl md:text-2xl font-bold">GZ</span>
              </div>
              <span className="font-bold text-lg md:text-xl">Groovystreetz</span>
            </div>

            {/* Heading */}
            <h2 className="text-xl md:text-2xl font-bold mb-2 text-center md:text-left">Get Notified</h2>
            <p className="text-gray-500 mb-6 text-sm md:text-base text-center md:text-left">
              Enter your email and never miss out on what’s trending.
            </p>

            {/* Form */}
            <form className="space-y-4 mb-4" onSubmit={handleSubmit}>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg bg-gray-100 border ${
                    errors.email ? "border-red-400" : "border-gray-200"
                  } focus:outline-none focus:ring-2 focus:ring-orange-400`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
                {errors.api && (
                  <p className="text-red-500 text-xs mt-1">{errors.api}</p>
                )}
                {success && (
                  <p className="text-green-500 text-xs mt-1">{success}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Notify Me
              </button>
            </form>

            {/* Back to login/signup */}
            <p className="text-center text-gray-500 text-sm">
              Changed your mind?{" "}
              <Link
                to="/login"
                className="text-orange-400 hover:underline font-semibold"
              >
                Go back
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default GetNotified;
