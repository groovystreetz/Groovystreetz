import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiEye, FiEyeOff } from 'react-icons/fi'

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!email) {
      newErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address.'
    }
    if (!password) {
      newErrors.password = 'Password is required.'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.'
    }
    return newErrors
  }

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)
    setTouched({ email: true, password: true })
    if (Object.keys(validationErrors).length === 0) {
      alert('Login successful (mock)')
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
          <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
          <p className="text-gray-500 mb-6">Sign in to continue shopping with Groovystreetz</p>
          {/* Login Form */}
          <form className="space-y-4 mb-4" onSubmit={handleSubmit} noValidate>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 rounded-lg bg-gray-100 border ${errors.email && touched.email ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-orange-400`}
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-xs mt-1  left-0 text-left">{errors.email}</p>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 rounded-lg bg-gray-100 border ${errors.password && touched.password ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-orange-400`}
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer text-xl"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={0}
                role="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
              {errors.password && touched.password && (
                <p className="text-red-500 text-xs mt-1 absolute left-0 -bottom-5">{errors.password}</p>
              )}
            </div>
            <div className="flex items-center justify-between mb-2"></div>
            <div className="flex items-center justify-between mb-2 ">
              <label className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="form-checkbox accent-orange-400 mr-2" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-orange-400 hover:underline">Forgot password?</Link>
            </div>
            <button
              type="submit"
              className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Login
            </button>
          </form>
          {/* Or Login with */}
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="mx-2 text-gray-400 text-sm">Or Login with</span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>
          <div className="flex space-x-4 mb-6">
            <button className="flex-1 flex items-center justify-center border border-gray-200 rounded-lg py-2 hover:bg-gray-50">
              <span className="mr-2 text-lg"><img className='w-6 h-6' src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png" alt="google" /></span> Google
            </button>
            <button className="flex-1 flex items-center justify-center border border-gray-200 rounded-lg py-2 hover:bg-gray-50">
              <span className="mr-2 text-lg"><img className='w-6 h-6' src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/2048px-Facebook_f_logo_%282019%29.svg.png" alt="facebook" /></span> Facebook
            </button>
          </div>
          <p className="text-center text-gray-500 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-orange-400 hover:underline font-semibold">Signup</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
