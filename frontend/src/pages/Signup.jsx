import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiEye, FiEyeOff } from 'react-icons/fi'

function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!form.name) {
      newErrors.name = 'Name is required.'
    }
    if (!form.email) {
      newErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address.'
    }
    if (!form.password) {
      newErrors.password = 'Password is required.'
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.'
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.'
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = 'Passwords do not match.'
    }
    return newErrors
  }

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true })
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)
    setTouched({ name: true, email: true, password: true, confirmPassword: true })
    if (Object.keys(validationErrors).length === 0) {
      // Proceed with signup
      alert('Signup successful (mock)')
    }
  }

  return (
    <div className="flex items-center justify-center ">
      <div className="bg-white rounded-3xl shadow-lg flex w-full max-w-4xl overflow-hidden">
        {/* Left Side */}
        <div className="w-1/2 bg-gradient-to-br from-orange-400 to-orange-500 p-10 flex flex-col justify-between relative">
          <div>
            <h2 className="text-white text-4xl font-bold mb-4 leading-tight">
              Discover<br />your style with<br />Groovystreetz.
            </h2>
            <p className="text-orange-100 mb-8">
              Shop the latest trends and enjoy a seamless shopping experience on our user-friendly e-commerce platform.
            </p>
          </div>
          {/* Placeholder for image */}
          <div className="flex justify-center items-end ">
           <img src="/loginhero.png" alt="" />
          </div>
        </div>
        {/* Right Side */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <div className="bg-orange-400 rounded-full w-12 h-12 flex items-center justify-center mr-3">
              <span className="text-white text-2xl font-bold">GZ</span>
            </div>
            <span className="font-bold text-xl">Groovystreetz</span>
          </div>
          {/* Welcome Text */}
          <h2 className="text-2xl font-bold mb-2">Create Account</h2>
          <p className="text-gray-500 mb-6">Sign up to start shopping with Groovystreetz</p>
          {/* Signup Form */}
          <form className="space-y-5 mb-4" onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-1">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 rounded-lg bg-gray-100 border ${errors.name && touched.name ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-orange-400`}
              />
              {errors.name && touched.name && (
                <p className="text-red-500 text-xs mt-1 text-left">{errors.name}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 rounded-lg bg-gray-100 border ${errors.email && touched.email ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-orange-400`}
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-xs mt-1 text-left">{errors.email}</p>
              )}
            </div>
            <div className="relative flex flex-col gap-1">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-lg bg-gray-100 border ${errors.password && touched.password ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-orange-400`}
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer text-xl z-10"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={0}
                  role="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
              {errors.password && touched.password && (
                <p className="text-red-500 text-xs mt-1 text-left">{errors.password}</p>
              )}
            </div>
            <div className="relative flex flex-col gap-1">
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-lg bg-gray-100 border ${errors.confirmPassword && touched.confirmPassword ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-orange-400`}
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer text-xl z-10"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  tabIndex={0}
                  role="button"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 text-left">{errors.confirmPassword}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Sign Up
            </button>
          </form>
          <p className="text-center text-gray-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-400 hover:underline font-semibold">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup 